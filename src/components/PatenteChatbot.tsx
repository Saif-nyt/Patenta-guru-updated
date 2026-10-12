import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  Send,
  Volume2,
  Copy,
  Check,
  Minimize2,
  Maximize2,
  MessageCircle,
  ShieldCheck,
  GripVertical,
  EyeOff
} from 'lucide-react';
import { HOTSHOT_QUESTIONS } from '../data/hotshotQuestions';
import { ROUND_QUESTIONS } from '../data/roundQuestions';
import { COMPREHENSIVE_VOCABULARY } from '../data/vocabData';
import type { StudentUser } from './StudentAuthModal';
import { speakItalian as playItalianFemaleVoice } from '../utils/italianSpeech';
import { getBanglaTranslation } from '../utils/patenteTranslator';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  quizResult?: {
    isCorrect: boolean;
    questionIt: string;
    questionBn?: string;
    explanationBn: string;
    trapTipBn?: string;
    vocab?: Array<{ wordIt: string; meaningBn: string }>;
  };
}

interface PatenteChatbotProps {
  currentTheme: 'light' | 'sepia' | 'dark';
  currentUser: StudentUser | null;
  onOpenPaywall: () => void;
}

// Design size of the expanded chat window (used for viewport clamping)
const EXPANDED_WIN_WIDTH = 460;
const EXPANDED_WIN_HEIGHT = 540;

export const PatenteChatbot: React.FC<PatenteChatbotProps> = ({
  currentTheme,
  currentUser,
  onOpenPaywall,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial welcome message (Funny & charismatic teacher persona) — only for signed-in students
  const [messages, setMessages] = useState<Message[]>(() =>
    currentUser
      ? [
          {
            id: 'welcome',
            sender: 'ai',
            text: `Ciao ${(currentUser.name || currentUser.email || 'Student').split(' ')[0]}! Sono Teacher Marco! 🇮🇹🚗\n\nপাতেন্তে নিয়ে কোনো প্যারা? কুইজ বুঝতে মাথা ঘুরছে? যেকোনো প্রশ্ন বা কুইজ এখানে পেস্ট করুন—সহজ, মজার ছলে ও ফাঁদ ধরিয়ে বুঝিয়ে দেব! 🍕\n\nতবে হ্যাঁ, বিরিয়ানির রেসিপি জিজ্ঞেস করবেন না কিন্তু, আমি শুধু গাড়ি চালানো আর পাতেন্তে পাস করানো জানি! 😂🏎️`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]
      : []
  );

  // Scroll to bottom on new message
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized, isTyping]);

  // Speech pronunciation for Italian text using natural female voice
  const speakItalian = (text: string) => {
    playItalianFemaleVoice(text, { rate: 1.0 });
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Draggable FAB & Dock State for mobile and desktop screens
  const [isDocked, setIsDocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem('patente_chatbot_docked') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('patente_chatbot_docked', String(isDocked));
    } catch {}
  }, [isDocked]);

  // Remember the dragged position of the mobile/desktop support nav across reloads
  const [fabPosition, setFabPosition] = useState<{ x: number; y: number } | null>(() => {
    try {
      const raw = localStorage.getItem('patente_chatbot_fab_pos');
      if (!raw) return null;
      const parsed = JSON.parse(raw) as { x: number; y: number };
      if (typeof parsed?.x === 'number' && typeof parsed?.y === 'number') {
        const bottomSafe = window.innerWidth < 768 ? 90 : 12;
        const x = Math.max(8, Math.min(window.innerWidth - 128, parsed.x));
        const y = Math.max(8, Math.min(window.innerHeight - 50 - bottomSafe, parsed.y));
        return { x, y };
      }
    } catch {}
    return null;
  });

  useEffect(() => {
    if (!fabPosition) return;
    // Debounced so live dragging never blocks on synchronous localStorage writes
    const timer = setTimeout(() => {
      try {
        localStorage.setItem('patente_chatbot_fab_pos', JSON.stringify(fabPosition));
      } catch {}
    }, 250);
    return () => clearTimeout(timer);
  }, [fabPosition]);

  // Remember the dragged position of the open chat window across reloads
  const [chatWindowPos, setChatWindowPos] = useState<{ x: number; y: number } | null>(() => {
    try {
      const raw = localStorage.getItem('patente_chatbot_win_pos');
      if (!raw) return null;
      const parsed = JSON.parse(raw) as { x: number; y: number };
      if (typeof parsed?.x === 'number' && typeof parsed?.y === 'number') {
        // A saved position may come from a different screen size — pull it back into view
        const width = Math.min(EXPANDED_WIN_WIDTH, window.innerWidth - 16);
        const height = Math.min(EXPANDED_WIN_HEIGHT, window.innerHeight - 160);
        const safeBottom = window.innerWidth < 768 ? 90 : 12;
        return {
          x: Math.max(8, Math.min(window.innerWidth - width - 8, parsed.x)),
          y: Math.max(8, Math.min(window.innerHeight - height - safeBottom, parsed.y)),
        };
      }
    } catch {}
    return null;
  });

  useEffect(() => {
    if (!chatWindowPos) return;
    // Debounced so live dragging never blocks on synchronous localStorage writes
    const timer = setTimeout(() => {
      try {
        localStorage.setItem('patente_chatbot_win_pos', JSON.stringify(chatWindowPos));
      } catch {}
    }, 250);
    return () => clearTimeout(timer);
  }, [chatWindowPos]);

  const chatWinRef = useRef<HTMLDivElement>(null);
  const chatDragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null);
  const chatWasDraggingRef = useRef(false);
  const chatDragRafRef = useRef<number | null>(null);
  const chatPendingPosRef = useRef<{ x: number; y: number } | null>(null);

  const clampToViewport = useCallback((x: number, y: number, width: number, height: number) => {
    const safeBottom = window.innerWidth < 768 ? 90 : 12;
    return {
      x: Math.max(8, Math.min(window.innerWidth - width - 8, x)),
      y: Math.max(8, Math.min(window.innerHeight - height - safeBottom, y)),
    };
  }, []);

  // Clamp using the element's live size (works for both minimized and expanded states)
  const clampChatPosition = useCallback(
    (x: number, y: number) => {
      const el = chatWinRef.current;
      return clampToViewport(x, y, el?.offsetWidth || EXPANDED_WIN_WIDTH, el?.offsetHeight || EXPANDED_WIN_HEIGHT);
    },
    [clampToViewport]
  );

  // Coalesce rapid pointermove events into at most one state update per frame
  const scheduleChatPosUpdate = useCallback((x: number, y: number) => {
    chatPendingPosRef.current = { x, y };
    if (chatDragRafRef.current != null) return;
    chatDragRafRef.current = requestAnimationFrame(() => {
      chatDragRafRef.current = null;
      if (chatPendingPosRef.current) {
        setChatWindowPos(chatPendingPosRef.current);
      }
    });
  }, []);

  useEffect(() => {
    return () => {
      if (chatDragRafRef.current != null) {
        cancelAnimationFrame(chatDragRafRef.current);
        chatDragRafRef.current = null;
      }
    };
  }, []);

  // Drag the open chat window freely by its header (mouse + touch)
  const handleChatPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    // Header buttons must stay clickable — never start a drag from them
    if ((e.target as HTMLElement).closest('button, input, textarea, a')) return;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}

    const rect = chatWinRef.current?.getBoundingClientRect();
    chatDragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: rect?.left ?? 0,
      initialY: rect?.top ?? 0,
    };
    chatWasDraggingRef.current = false;
  };

  const handleChatPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!chatDragRef.current) return;

    const deltaX = e.clientX - chatDragRef.current.startX;
    const deltaY = e.clientY - chatDragRef.current.startY;

    if (!chatWasDraggingRef.current && Math.hypot(deltaX, deltaY) > 6) {
      chatWasDraggingRef.current = true;
    }

    if (chatWasDraggingRef.current) {
      e.preventDefault();
      const next = clampChatPosition(
        chatDragRef.current.initialX + deltaX,
        chatDragRef.current.initialY + deltaY
      );
      scheduleChatPosUpdate(next.x, next.y);
    }
  };

  const handleChatPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {}

    // Commit the final dragged position (if any) and stop the drag session
    if (chatWasDraggingRef.current && chatPendingPosRef.current) {
      setChatWindowPos(chatPendingPosRef.current);
    }
    chatDragRef.current = null;
  };

  // Minimize / restore the chat while keeping its position and re-clamping on expand
  const toggleChatMinimize = () => {
    if (!isMinimized) {
      setIsMinimized(true);
      return;
    }

    setIsMinimized(false);
    // The window grows on expand, so pull it back inside the viewport if needed
    setChatWindowPos((prev) => {
      if (!prev) return prev;
      const width = Math.min(EXPANDED_WIN_WIDTH, window.innerWidth - 16);
      const height = Math.min(EXPANDED_WIN_HEIGHT, window.innerHeight - 160);
      return clampToViewport(prev.x, prev.y, width, height);
    });
  };

  // Keep a dragged chat window fully inside the viewport on resize/rotation
  useEffect(() => {
    const onResize = () => {
      setChatWindowPos((prev) => (prev ? clampChatPosition(prev.x, prev.y) : prev));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [clampChatPosition]);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null);
  const fabRef = useRef<HTMLDivElement>(null);
  const [isPointerDown, setIsPointerDown] = useState(false);

  // Unified pointer drag handlers for both desktop mouse and mobile touch
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    // Don't drag if clicking dismiss/close button
    if ((e.target as HTMLElement).closest('.fab-dismiss-btn')) return;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}

    const clientX = e.clientX;
    const clientY = e.clientY;

    const bottomSafeMargin = window.innerWidth < 768 ? 85 : 20;
    const currentRect = fabRef.current?.getBoundingClientRect();
    const currentX = currentRect ? currentRect.left : (fabPosition?.x ?? (window.innerWidth - 210));
    const currentY = currentRect ? currentRect.top : (fabPosition?.y ?? (window.innerHeight - 60 - bottomSafeMargin));

    dragStartRef.current = {
      startX: clientX,
      startY: clientY,
      initialX: currentX,
      initialY: currentY,
    };
    isDraggingRef.current = false;
    setIsPointerDown(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStartRef.current) return;

    const deltaX = e.clientX - dragStartRef.current.startX;
    const deltaY = e.clientY - dragStartRef.current.startY;

    if (Math.hypot(deltaX, deltaY) > 8) {
      isDraggingRef.current = true;
    }

    if (isDraggingRef.current) {
      const bottomSafeMargin = window.innerWidth < 768 ? 85 : 16;
      const buttonWidth = fabRef.current?.offsetWidth || 200;
      const buttonHeight = fabRef.current?.offsetHeight || 60;

      // Keep the whole pill visible anywhere inside the viewport
      const newX = Math.max(8, Math.min(window.innerWidth - buttonWidth - 8, dragStartRef.current.initialX + deltaX));
      const newY = Math.max(8, Math.min(window.innerHeight - buttonHeight - bottomSafeMargin, dragStartRef.current.initialY + deltaY));

      setFabPosition({ x: newX, y: newY });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {}

    const wasDragging = isDraggingRef.current;
    dragStartRef.current = null;
    setIsPointerDown(false);
    isDraggingRef.current = false;

    // Direct, reliable tap-to-open! If user did not drag, open the chatbot immediately:
    if (!wasDragging) {
      setIsOpen(true);
      setIsMinimized(false);
    }
  };

  // Drag the docked small "Support" tab anywhere on the screen as well
  const dockTabRef = useRef<HTMLDivElement>(null);
  const dockDragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null);
  const dockWasDraggingRef = useRef(false);

  const clampDockTabPosition = useCallback((x: number, y: number) => {
    const el = dockTabRef.current;
    const width = el?.offsetWidth || 120;
    const height = el?.offsetHeight || 40;
    const bottomSafeMargin = window.innerWidth < 768 ? 85 : 12;
    return {
      x: Math.max(8, Math.min(window.innerWidth - width - 8, x)),
      y: Math.max(8, Math.min(window.innerHeight - height - bottomSafeMargin, y)),
    };
  }, []);

  const handleDockPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}

    const rect = dockTabRef.current?.getBoundingClientRect();
    dockDragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: rect?.left ?? (window.innerWidth - 120),
      initialY: rect?.top ?? (window.innerHeight - 200),
    };
    dockWasDraggingRef.current = false;
  };

  const handleDockPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dockDragRef.current) return;

    const deltaX = e.clientX - dockDragRef.current.startX;
    const deltaY = e.clientY - dockDragRef.current.startY;

    if (!dockWasDraggingRef.current && Math.hypot(deltaX, deltaY) > 6) {
      dockWasDraggingRef.current = true;
    }

    if (dockWasDraggingRef.current) {
      e.preventDefault();
      setFabPosition(
        clampDockTabPosition(dockDragRef.current.initialX + deltaX, dockDragRef.current.initialY + deltaY)
      );
    }
  };

  const handleDockPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {}
    dockDragRef.current = null;
  };

  // Intelligent Response Generator & Knowledge Matcher
  const analyzeQuery = (query: string): { reply: string; quiz?: any } => {
    const cleanQuery = query.toLowerCase().trim();

    // 0. Out-of-Scope / Irrelevant Topic Detection (Witty Marco Rejection)
    const outOfScopePatterns = [
      /রেসিপি|বিরিয়ানি|রান্না|তরকারি|খাবার|recipe|cook|cooking|briyani|pizza recipe|pasta recipe/,
      /মুভি|সিনেমা|গান|নাটক|অভিনেতা|movie|actor|actress|cinema|bollywood|song/,
      /প্রেম|বিয়ে|ভালোবাসা|ব্রেকআপ|ক্রাশ|গার্লফ্রেন্ড|বয়ফ্রেন্ড|love|dating|girlfriend|boyfriend/,
      /রাশিফল|জ্যোতিষ|ভাগ্য|গণক|horoscope|astrology|fortune/,
      /কোডিং|প্রোগ্রামিং|জাভাস্ক্রিপ্ট|পাইথন|react|html|css|coding|programmer|python|java\b|software/,
      /ক্রিকেট|ফুটবল|মেসি|রোনালদো|বিপিএল|আইপিএল|cricket|football|soccer|messi|ronaldo/,
      /রাজনীতি|প্রধানমন্ত্রী|ভোট|এমপি|মন্ত্রী|politics|election|minister/,
      /ঔষধ|ট্যাবলেট|প্রেসক্রিপশন|medicine|doctor advice/,
    ];

    if (outOfScopePatterns.some((pattern) => pattern.test(cleanQuery))) {
      return {
        reply: `Mamma Mia! 🤌😂 ওহে বন্ধু, আমি তো ইতালিয়ান ড্রাইভিং লাইসেন্স গুরু মারকো! আমি কি শেফ, কোডার নাকি জ্যোতিষী? 🍝\n\nএই প্রশ্নের সাথে তো পাতেন্তে বি বা ইতালিয়ান ট্রাফিক আইনের দূর-দূরান্তেও কোনো সম্পর্ক নেই! এসবে সময় নষ্ট না করে গাড়ির স্টিয়ারিংয়ে মন দাও—পাতেন্তে পাস না করলে ইতালি ঘুরে দেখবে কীভাবে? 🚗\n\nচলো, কোনো ট্রাফিক সাইন, কুইজের ফাঁদ (Trabocchetti) বা ড্রাইভিং নিয়ম নিয়ে প্রশ্ন করো, চুটকিতে বুঝিয়ে দিচ্ছি! Andiamo! 🏎️💨`,
      };
    }

    // 1. Common Student Questions (Course, Exam & License Rules)
    if (cleanQuery.includes('ভুল') || cleanQuery.includes('error') || cleanQuery.includes('কয়টা ভুল')) {
      return {
        reply: `🎯 **পরীক্ষার নিয়ম ও ভুল সীমা (Regole d'Esame):**\n\nইতালিয়ান Patente B কুইজ পরীক্ষায় মোট **৩০টি প্রশ্ন** থাকে এবং সময় থাকে **২০ মিনিট**।\n\n• পাস করার নিয়ম: আপনি **সর্বোচ্চ ৩টি ভুল (Massimo 3 errori)** করতে পারবেন! ✅\n• **৪টি ভুল হলেই পরীক্ষা ফেইল (Bocciato)!** 😱\n\nমারকোর পরামর্শ: আমাদের ২৪০টি রাউন্ড নিয়মিত প্র্যাকটিস করুন, ভুল শূন্যে নামিয়ে আনাই আমাদের টার্গেট! 🚗💨`,
      };
    }

    if (cleanQuery.includes('সময় কত') || cleanQuery.includes('কত মিনিট') || cleanQuery.includes('পরীক্ষা কত') || cleanQuery.includes('tempo')) {
      return {
        reply: `⏱️ **পরীক্ষার সময়সীমা (Tempo d'Esame):**\n\nঅফিশিয়াল কুইজ পরীক্ষার জন্য আপনি পাবেন ঠিক **২০ মিনিট (20 minuti)**! ৩০টি প্রশ্নের জন্য এটা যথেষ্ট সময়—প্রতি প্রশ্নে গড়ে ৪০ সেকেন্ড।\n\nমারকোর সিক্রেট টিপস: কঠিন প্রশ্নে আটকে না থেকে প্রথমে নিশ্চিত প্রশ্নগুলোর উত্তর দিন, তারপর বাকিগুলো ঠান্ডা মাথায় চেক করুন! 🇮🇹✅`,
      };
    }

    if (cleanQuery.includes('foglio rosa') || cleanQuery.includes('ফোগলিও রোসা') || cleanQuery.includes('ফোগলিও')) {
      return {
        reply: `📄 **ফোগলিও রোসা (Foglio Rosa) কী?**\n\nথিওরি পরীক্ষায় পাস করার পরই আপনি পাবেন 'Foglio Rosa'! এর মেয়াদ **১ বছর (12 mesi)** এবং এই সময়ের মধ্যে আপনি প্র্যাকটিক্যাল পরীক্ষার ৩টি সুযোগ (3 tentativi) পাবেন।\n\nমারকোর ড্রাইভিং টিপস: ফোগলিও রোসা দিয়ে গাড়ি ড্রাইভ করার সময় পাশে অবশ্যই কমপক্ষে ১০ বছরের অভিজ্ঞ লাইসেন্সধারী গাইড থাকতে হবে! 🚗`,
      };
    }

    if (cleanQuery.includes('neopatentat') || cleanQuery.includes('নেওপাতেন্তাতো') || cleanQuery.includes('নতুন ড্রাইভার')) {
      return {
        reply: `🚦 **Neopatentati (নতুন ড্রাইভারদের কড়া নিয়ম):**\n\nলাইসেন্স পাওয়ার প্রথম ৩ বছর আপনি 'Neopatentato':\n• **গতিসীমা:** হাইওয়েতে (Autostrada) সর্বোচ্চ ১০০ কিমি/ঘণ্টা (সাধারণদের ১৩০), এবং Tangenziale-তে ৯০ কিমি/ঘণ্টা।\n• **অ্যালকোহল লিমিট:** ঠিক **0.0 g/l**! এক ফোঁটাও অ্যালকোহল সহ্য করা হবে না! 🚫🍷\n• **পয়েন্ট কাটা:** কোনো ভায়োলেশনে সাধারণ চালকের চেয়ে দ্বিগুণ (Double) পয়েন্ট কাটা যাবে! সাবধান! ⚠️`,
      };
    }

    if (cleanQuery.includes('sosta') && cleanQuery.includes('fermata')) {
      return {
        reply: `🅿️ **Sosta বনাম Fermata এর সহজ পার্থক্য:**\n\n• **Fermata (থামানো):** খুব অল্প সময়ের জন্য গাড়ি দাঁড় করানো (যেমন যাত্রী নামানো বা উঠানো)। চালককে অবশ্যই গাড়ির স্টিয়ারিংয়ে প্রস্তুত থাকতে হবে! VERO! ⏱️\n• **Sosta (পার্কিং):** গাড়ি রেখে চলে যাওয়া বা দীর্ঘ সময় রাখা। ইঞ্জিন বন্ধ থাকে।\n\nমারকোর গোল্ডেন রুল: যেখানে Fermata নিষেধ, সেখানে Sosta ও নিষেধ! কিন্তু যেখানে Sosta নিষেধ, সেখানে Fermata করা যেতে পারে (যদি বাধা সৃষ্টি না হয়)! 🚗`,
      };
    }

    // 2. Check if user pasted an existing hotshot question
    const matchedHotshot = HOTSHOT_QUESTIONS.find(
      (q) =>
        q.questionIt.toLowerCase().includes(cleanQuery) ||
        cleanQuery.includes(q.questionIt.toLowerCase().slice(0, 30))
    );

    if (matchedHotshot) {
      return {
        reply: `Mamma Mia! 🤌 **কুইজ প্রশ্ন পেয়ে গেছি!**\n\nপরীক্ষা অনুযায়ী এর উত্তর **${
          matchedHotshot.isCorrect ? '✅ VERO (সত্য)' : '❌ FALSO (মিথ্যা)'
        }**।\n\nমারকোর সহজ বিশ্লেষণ নিচে দেওয়া হলো:`,
        quiz: {
          isCorrect: matchedHotshot.isCorrect,
          questionIt: matchedHotshot.questionIt,
          questionBn: getBanglaTranslation(matchedHotshot.questionIt, matchedHotshot.questionBn),
          explanationBn: matchedHotshot.explanationBn,
          trapTipBn: matchedHotshot.trapTipBn,
          vocab: matchedHotshot.vocabulary,
        },
      };
    }

    // 3. Check in all 20 rounds (600 official questions)
    for (const roundList of Object.values(ROUND_QUESTIONS)) {
      const match = roundList.find((q) => {
        const it = q.questionIt.toLowerCase();
        return (
          cleanQuery.length > 15 &&
          (it.includes(cleanQuery) || cleanQuery.includes(it.slice(0, 35)))
        );
      });

      if (match) {
        return {
          reply: `Bravissimo! 🎯 **অফিশিয়াল প্রশ্ন শনাক্ত হয়েছে!**\n\nপরীক্ষা অনুযায়ী এর উত্তর **${
            match.isCorrect ? '✅ VERO (সত্য)' : '❌ FALSO (মিথ্যা)'
          }**।`,
          quiz: {
            isCorrect: match.isCorrect,
            questionIt: match.questionIt,
            questionBn: getBanglaTranslation(match.questionIt, match.questionBn),
            explanationBn: match.explanationBn,
            vocab: match.vocabulary,
          },
        };
      }
    }

    // 4. Keyword / Trap Word Check (Trabocchetti)
    const trapWords = [
      'esclusivamente',
      'sempre',
      'mai',
      'solo',
      'obbligatoriamente',
      'in ogni caso',
      'qualsiasi',
      'tutti i veicoli',
    ];

    const foundTrap = trapWords.find((w) => cleanQuery.includes(w));
    if (foundTrap) {
      return {
        reply: `Attenzione! ⚠️ **মারকোর ট্র্যাপ অ্যালার্ট: "${foundTrap.toUpperCase()}"**\n\nইতালিয়ান ড্রাইভিং লাইসেন্স কুইজে **${foundTrap}** (শুধুমাত্র / সবসময় / কোনো অবস্থাতেই না) শব্দগুলো থাকলে **৯৫% ক্ষেত্রে প্রশ্নটি FALSO (মিথ্যা)** হয়! কারণ ট্রাফিক বিধিতে প্রায় সবসময়ই কিছু ব্যতিক্রম থাকে।\n\nপ্রশ্নটি ভালো করে পড়ুন এবং এই ফাঁদে পা দেবেন না! 🤌`,
      };
    }

    // 5. Vocabulary Matcher
    const matchedVocab = COMPREHENSIVE_VOCABULARY.filter(
      (v) =>
        cleanQuery.includes(v.wordIt.toLowerCase()) ||
        cleanQuery.includes(v.meaningBn.toLowerCase())
    ).slice(0, 3);

    if (matchedVocab.length > 0) {
      const vocabText = matchedVocab
        .map(
          (v) =>
            `• **${v.wordIt}**: ${v.meaningBn} *(ক্যাটাগরি: ${v.category})*`
        )
        .join('\n');
      return {
        reply: `📖 **গুরুত্বপূর্ণ শব্দার্থ (Vocabolario):**\n\n${vocabText}\n\nআপনার কুইজের পুরো বাক্যটি এখানে পেস্ট করুন, আমি সাথে সাথে VERO/FALSO এবং নিয়ম বুঝিয়ে দেব! 🚗`,
      };
    }

    // 6. Default Teacher Support Guidance
    return {
      reply: `Ciao Amico! 🇮🇹👨‍🏫 আপনার প্রশ্নটি পেয়েছি। ইতালিয়ান লাইসেন্স পরীক্ষায় সঠিক উত্তর নিশ্চিত করতে যে কোনো কুইজ প্রশ্ন সরাসরি ইতালিয়ান ভাষায় হুবহু পেস্ট করুন।\n\nউদাহরণ:\n• *"La carreggiata è destinata alla sosta di emergenza..."*\n• *"In presenza del segnale di STOP..."*\n\nকুইজ ড্রপ করলেই আমি সম্পূর্ণ বাংলা ভাবার্থ ও ফাঁদ বের করে বুঝিয়ে দেব! Andiamo! 🚗💨`,
    };
  };

  // Clean text/markdown renderer for WhatsApp-style chat bubbles
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, lIdx) => {
      if (line.startsWith('### ')) {
        return (
          <h4 key={lIdx} className="font-black text-xs sm:text-sm text-[#075E54] dark:text-emerald-400 mt-2 mb-0.5">
            {line.replace('### ', '')}
          </h4>
        );
      }
      if (line.trim() === '---') {
        return <hr key={lIdx} className="my-1.5 border-slate-200 dark:border-slate-700" />;
      }
      const boldParts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <p key={lIdx} className={`min-h-[1.1rem] leading-relaxed ${line.startsWith('* ') || line.startsWith('• ') ? 'pl-2' : ''}`}>
          {boldParts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={pIdx} className="font-black text-slate-900 dark:text-white">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          })}
        </p>
      );
    });
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: Message = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const currentHistory = messages.map((m) => ({
      role: m.sender,
      text: m.text,
    }));

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) {
      setInputText('');
    }
    setIsTyping(true);

    try {
      // 1. Check local knowledge for immediate question card
      const localMatch = analyzeQuery(text);

      // 2. Call live AI Tutor endpoint powered by Google Gemini
      const res = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          history: currentHistory.slice(-4),
          studentName: currentUser?.name || 'Student',
        }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success && data.reply) {
          const aiMsg: Message = {
            id: 'ai_' + Date.now(),
            sender: 'ai',
            text: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            quizResult: localMatch.quiz,
          };
          setMessages((prev) => [...prev, aiMsg]);
          setIsTyping(false);
          return;
        }
      }

      // 3. Fallback to local intelligence if API is slow or offline
      const aiMsg: Message = {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        text: localMatch.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quizResult: localMatch.quiz,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.warn('AI tutor fetch notice, using local knowledge:', err);
      const localMatch = analyzeQuery(text);
      const aiMsg: Message = {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        text: localMatch.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quizResult: localMatch.quiz,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickActions = [
    { label: '🛑 STOP বনাম Precedenza', query: 'STOP এবং Dare Precedenza এর পার্থক্য কি?' },
    { label: '⚠️ ফাঁদ শব্দ (Trabocchetti)', query: 'কুইজে কোন কোন ফাঁদ শব্দ থাকলে FALSO হয়?' },
    { label: '🚗 Neopatentati গতিসীমা', query: 'নতুন লাইসেন্সধারীদের হাইওয়েতে সর্বোচ্চ গতি কত?' },
    { label: '🍷 অ্যালকোহল লিমিট 0.0', query: 'নেওপাতেন্তাতোদের জন্য অ্যালকোহল রক্তের মাত্রা কত?' },
  ];

  return (
    <>
      {/* Moveable Support Nav — compact circle on mobile, full pill on desktop */}
      {!isOpen && !isDocked && (
        <div
          ref={fabRef}
          style={
            fabPosition
              ? { position: 'fixed', left: `${fabPosition.x}px`, top: `${fabPosition.y}px`, zIndex: 50 }
              : undefined
          }
          className={
            !fabPosition
              ? 'fixed bottom-52 sm:bottom-48 md:bottom-6 right-3 sm:right-6 z-50 flex flex-col items-end'
              : ''
          }
        >
          <div
            role="button"
            tabIndex={0}
            aria-label="Open live support chat"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setIsOpen(true);
                setIsMinimized(false);
              }
            }}
            className="relative flex items-center select-none touch-none cursor-grab active:cursor-grabbing transition-transform rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-black shadow-2xl shadow-emerald-600/40 hover:scale-[1.03] active:scale-95 border-2 border-white/50 p-2.5 sm:gap-2 sm:py-2.5 sm:pl-3 sm:pr-2 sm:text-sm text-xs"
            style={{ transform: isPointerDown ? 'scale(1.05)' : undefined }}
          >
            {/* Drag grip — inline on desktop, corner badge on mobile */}
            <div
              title="Drag anywhere to move • tap ✕ to hide"
              className="hidden sm:flex items-center text-emerald-100/90 shrink-0"
            >
              <GripVertical className="w-4 h-4" />
            </div>
            <span
              title="Drag anywhere to move"
              className="sm:hidden absolute -top-1.5 -left-1.5 w-6 h-6 rounded-full bg-[#075E54] border-2 border-white/70 flex items-center justify-center shadow-md"
            >
              <GripVertical className="w-3.5 h-3.5 text-emerald-100" />
            </span>

            {/* Online ping — desktop only */}
            <span className="hidden sm:flex relative flex h-3 w-3 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
            </span>

            <MessageCircle className="w-7 h-7 sm:w-5 sm:h-5 fill-current text-white shrink-0" />

            {/* Labels — desktop only */}
            <div className="hidden sm:block text-left leading-tight">
              <span className="block text-xs font-black">24/7 Live Support</span>
              <span className="text-[10px] opacity-90 block font-bold">Replies &lt; 1 min</span>
            </div>

            {/* Hide button — available on mobile and desktop */}
            <button
              type="button"
              className="fab-dismiss-btn flex p-1 ml-1 rounded-full bg-black/15 hover:bg-black/30 text-white/90 hover:text-white transition cursor-pointer shrink-0 items-center"
              onClick={(e) => {
                e.stopPropagation();
                setIsDocked(true);
              }}
              title="Hide under small Support tab"
              aria-label="Hide support button"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Authentic WhatsApp Chat Window — drag it anywhere by its header */}
      {isOpen && (
        <div
          ref={chatWinRef}
          role="dialog"
          aria-label="Patente Live Support chat"
          style={
            chatWindowPos
              ? { position: 'fixed', left: `${chatWindowPos.x}px`, top: `${chatWindowPos.y}px`, zIndex: 60 }
              : undefined
          }
          className={`flex flex-col bg-[#EFEAE2] dark:bg-[#0B141A] border border-emerald-800/40 rounded-3xl shadow-2xl overflow-hidden z-[60] transition-[width,height,box-shadow,opacity] duration-300 ${
            chatWindowPos ? '' : 'fixed bottom-3 sm:bottom-6 right-2 sm:right-6'
          } ${
            currentTheme === 'sepia' ? 'theme-sepia' : currentTheme === 'dark' ? 'dark' : ''
          } ${
            isMinimized
              ? 'w-72 sm:w-80'
              : 'w-[94vw] sm:w-[420px] md:w-[460px] h-[540px] max-h-[calc(100vh-160px)] md:max-h-[85vh]'
          }`}
        >
          {/* WhatsApp Header: Deep Emerald Green (#075E54) — drag handle for the whole window */}
          <div
            onPointerDown={handleChatPointerDown}
            onPointerMove={handleChatPointerMove}
            onPointerUp={handleChatPointerUp}
            onPointerCancel={handleChatPointerUp}
            onClick={(e) => {
              // Ignore clicks that started on header controls (they handle themselves)
              if ((e.target as HTMLElement).closest('button, input, textarea, a')) return;
              // Clicking the collapsed bar restores the chat (but a drag must not)
              if (isMinimized && !chatWasDraggingRef.current) {
                toggleChatMinimize();
              }
            }}
            className="bg-[#075E54] dark:bg-[#1F2C34] p-3 sm:p-3.5 text-white flex items-center justify-between shadow-md shrink-0 select-none touch-none cursor-grab active:cursor-grabbing"
            title={isMinimized ? 'Expand support chat (or drag to move)' : 'Drag to move the chat anywhere'}
          >
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center text-white font-bold text-sm shadow-inner border border-white/30">
                  👨‍🏫
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#25D366] border-2 border-[#075E54]" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-sm tracking-tight">Patente Live Support</h4>
                  {!isMinimized && (
                    <span className="text-[10px] bg-emerald-600/80 px-1.5 py-0.2 rounded font-mono font-bold">
                      Official
                    </span>
                  )}
                </div>
                {!isMinimized && (
                  <p className="text-[11px] text-emerald-200 font-medium flex items-center gap-1">
                    <span>🟢 Online • Replies in &lt; 1 minute</span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 text-white/90">
              <span className="hidden sm:flex p-1.5 text-emerald-200/80" title="Drag to move the chat anywhere">
                <GripVertical className="w-4 h-4" />
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setIsMinimized(false);
                  setIsDocked(true);
                }}
                className="p-1.5 rounded-lg hover:bg-white/10 transition cursor-pointer"
                title="Hide under small Support tab"
              >
                <EyeOff className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={toggleChatMinimize}
                className="p-1.5 rounded-lg hover:bg-white/10 transition cursor-pointer"
                title={isMinimized ? 'Expand' : 'Minimize'}
                aria-label={isMinimized ? 'Expand support chat' : 'Minimize support chat'}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition cursor-pointer"
                title="Close Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Guaranteed 1-Minute Support Leaflet Banner */}
              <div className="p-2.5 bg-[#DCF8C6] dark:bg-emerald-950/60 border-b border-emerald-200/80 dark:border-emerald-900/60 flex items-start gap-2 text-xs text-emerald-950 dark:text-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-left leading-tight">
                  <span className="font-bold block text-[11px]">
                    ⚡ 24/7 Guaranteed Fast Support (১ মিনিটের মধ্যে নিশ্চিত উত্তর):
                  </span>
                  <span className="text-[10px] text-emerald-900/80 dark:text-emerald-300">
                    দিন হোক বা রাত, যেকোনো কঠিন কুইজ কপি করে পেস্ট করুন। আমাদের শিক্ষক দল ১ মিনিটের মধ্যে সহজ ব্যাখ্যা দেবে।
                  </span>
                </div>
              </div>

              {/* Quick Prompt Chips */}
              <div className="p-2 border-b border-slate-200/60 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
                {quickActions.map((action, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSendMessage(action.query)}
                    className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:text-[#075E54] hover:border-emerald-400 shrink-0 transition cursor-pointer shadow-2xs"
                  >
                    {action.label}
                  </button>
                ))}
              </div>

              {/* Messages Body (WhatsApp Chat Canvas) */}
              <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3 text-xs">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[86%] rounded-2xl p-3 space-y-1.5 shadow-xs relative text-left ${
                        msg.sender === 'user'
                          ? 'bg-[#E7FFDB] dark:bg-[#005C4B] text-slate-900 dark:text-white rounded-tr-none'
                          : 'bg-white dark:bg-[#202C33] text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200/60 dark:border-slate-700/60'
                      }`}
                    >
                      {/* Message Text */}
                      <div className="space-y-1 text-xs">
                        {renderFormattedText(msg.text)}
                      </div>

                      {/* Quiz Breakdown Card if matched */}
                      {msg.quizResult && (
                        <div className="mt-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2">
                          <div className="flex items-center justify-between gap-2 border-b border-slate-200/70 dark:border-slate-800 pb-1.5">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                                msg.quizResult.isCorrect
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              }`}
                            >
                              {msg.quizResult.isCorrect ? '✅ VERO (সত্য)' : '❌ FALSO (ভুল)'}
                            </span>
                            <button
                              type="button"
                              onClick={() => speakItalian(msg.quizResult!.questionIt)}
                              className="text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 font-bold text-[10px] cursor-pointer"
                              title="Listen in Italian"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>উচ্চারণ</span>
                            </button>
                          </div>

                          <div>
                            <span className="text-[10px] font-bold text-slate-400 block uppercase">
                              Domanda Ufficiale:
                            </span>
                            <p className="font-bold text-slate-900 dark:text-slate-100 text-xs italic">
                              "{msg.quizResult.questionIt}"
                            </p>
                            {msg.quizResult.questionBn && (
                              <p className="mt-1.5 text-xs text-emerald-900 dark:text-emerald-300 font-medium bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-lg border border-emerald-200/60 dark:border-emerald-800/40 leading-relaxed">
                                🇧🇩 {msg.quizResult.questionBn}
                              </p>
                            )}
                          </div>

                          <div className="pt-1 text-[11px] text-slate-700 dark:text-slate-300">
                            <span className="font-bold text-[#075E54] dark:text-emerald-400 block mb-0.5">
                              কেন এটি সঠিক বা ভুল (Spiegazione):
                            </span>
                            <p className="leading-relaxed">{msg.quizResult.explanationBn}</p>
                          </div>

                          {msg.quizResult.trapTipBn && (
                            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-[10px] font-medium">
                              ⚠️ {msg.quizResult.trapTipBn}
                            </div>
                          )}

                          {msg.quizResult.vocab && msg.quizResult.vocab.length > 0 && (
                            <div className="pt-1 border-t border-slate-200/60 dark:border-slate-800 flex flex-wrap gap-1 text-[10px]">
                              {msg.quizResult.vocab.map((v, idx) => (
                                <span
                                  key={idx}
                                  className="px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                                >
                                  <strong>{v.wordIt}</strong>: {v.meaningBn}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* WhatsApp Style Footer (Timestamp & Blue Checkmarks) */}
                      <div className="flex items-center justify-end gap-1 text-[10px] opacity-60 pt-0.5">
                        <span>{msg.timestamp}</span>
                        {msg.sender === 'user' && (
                          <span className="text-sky-500 font-bold">✓✓</span>
                        )}
                        {msg.sender === 'ai' && (
                          <button
                            type="button"
                            onClick={() => copyToClipboard(msg.id, msg.text)}
                            className="hover:opacity-100 flex items-center gap-0.5 cursor-pointer ml-1"
                            title="Copy reply"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-2 items-center text-slate-500 text-xs italic bg-white dark:bg-slate-800 px-3 py-1.5 rounded-full w-fit shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Marco sta scrivendo la risposta...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* WhatsApp Input Bar */}
              <div className="p-2 sm:p-2.5 border-t border-slate-200 dark:border-slate-800 bg-[#F0F2F5] dark:bg-[#1F2C34] shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-end gap-2"
                >
                  <div className="flex-1 h-10 flex items-center bg-white dark:bg-[#2A3942] rounded-full border border-slate-300 dark:border-slate-700 px-4 focus-within:ring-2 focus-within:ring-emerald-500 shadow-xs transition-none">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Scrivi un messaggio o incolla il quiz..."
                      className="w-full bg-transparent text-slate-900 dark:text-white text-[16px] sm:text-xs md:text-[13px] leading-normal focus:outline-none block"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="p-2.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] disabled:opacity-40 text-white font-bold transition cursor-pointer shadow-sm shrink-0"
                    title="Invia messaggio (Enter)"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
                <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1 px-2">
                  <span>Risposta rapida &lt; 1 min • <strong>Enter</strong> invia, <strong>Shift+Enter</strong> a capo</span>
                  <button
                    type="button"
                    onClick={onOpenPaywall}
                    className="text-[#075E54] dark:text-emerald-400 font-bold hover:underline"
                  >
                    Pro Student Pass
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

    {/* Docked Support Tab (small nav) — draggable anywhere, tap to reopen chat */}
    {!isOpen && isDocked && (
      <div
        ref={dockTabRef}
        onPointerDown={handleDockPointerDown}
        onPointerMove={handleDockPointerMove}
        onPointerUp={handleDockPointerUp}
        onPointerCancel={handleDockPointerUp}
        style={
          fabPosition
            ? { position: 'fixed', left: `${fabPosition.x}px`, top: `${fabPosition.y}px`, zIndex: 45 }
            : undefined
        }
        className={`z-40 ${fabPosition ? '' : 'fixed right-0 bottom-52 sm:bottom-48 md:bottom-6'}`}
      >
        <button
          type="button"
          onClick={(e) => {
            // A drag must not also trigger the restore action
            if (dockWasDraggingRef.current) {
              e.preventDefault();
              return;
            }
            setIsDocked(false);
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="bg-[#25D366] hover:bg-[#20bd5a] text-white py-2 pl-2.5 pr-2 rounded-l-2xl shadow-2xl border-l-2 border-y-2 border-white/60 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-grab active:cursor-grabbing group animate-fadeIn select-none touch-none"
          title="লাইভ সাপোর্ট আবার দেখান (Drag to move • tap to open)"
          aria-label="Open live support chat"
        >
          <GripVertical className="w-3.5 h-3.5 text-emerald-100/80 shrink-0" />
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
          </span>
          <MessageCircle className="w-4 h-4 fill-current text-white shrink-0" />
          <span className="text-[10px] font-black uppercase tracking-tight">
            Support
          </span>
        </button>
      </div>
    )}
  </>
);
};
