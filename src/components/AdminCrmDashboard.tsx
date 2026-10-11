import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Search,
  Download,
  Phone,
  DollarSign,
  TrendingUp,
  LogOut,
  RefreshCw,
  Sparkles,
  Database,
  ExternalLink,
  FileText,
  Sliders,
  Check,
  Save,
  Trash2
} from 'lucide-react';
import type { StudentProfile } from '../services/studentService';
import { AdminQuestionExplorer } from './AdminQuestionExplorer';
import { CourseInvoiceModal } from './CourseInvoiceModal';
import { 
  getInvoices, 
  createInvoiceRecord, 
  saveInvoice 
} from '../services/paymentService';
import type { InvoiceRecord } from '../services/paymentService';
import { 
  getAppSettings, 
  saveAppSettings, 
  fetchRemoteAppSettings 
} from '../services/appSettingsService';
import type { AppSettings } from '../services/appSettingsService';

interface AdminCrmDashboardProps {
  adminEmail: string;
  onExitAdmin: () => void;
}

// Helper for instantaneous local cache retrieval (0ms initial render)
const getInitialCachedStudents = (): StudentProfile[] => {
  try {
    const map = new Map<string, StudentProfile>();

    // 1. Registered students
    try {
      const localStudents: StudentProfile[] = JSON.parse(
        localStorage.getItem('patente_registered_students') || '[]'
      );
      if (Array.isArray(localStudents)) {
        localStudents.forEach((s) => {
          if (s?.email) map.set(s.email.toLowerCase(), s);
        });
      }
    } catch {}

    // 2. Currently logged-in student user
    try {
      const current = localStorage.getItem('patente_student_user');
      if (current) {
        const curObj = JSON.parse(current);
        if (curObj?.email) {
          map.set(curObj.email.toLowerCase(), { ...map.get(curObj.email.toLowerCase()), ...curObj });
        }
      }
    } catch {}

    // 3. Lead modal submissions
    try {
      const lead = localStorage.getItem('patente_bangla_student_lead');
      if (lead) {
        const l = JSON.parse(lead);
        if (l?.email && !map.has(l.email.toLowerCase())) {
          map.set(l.email.toLowerCase(), {
            uid: 'lead_' + Date.now(),
            name: l.name || 'Student Lead',
            email: l.email,
            phone: l.phone || undefined,
            unlockedRound: 1,
            totalQuestionsAnswered: 0,
            completedRounds: {},
            mistakeIds: [],
            isVip: false,
            createdAt: l.date || new Date().toISOString(),
          });
        }
      }
    } catch {}

    return Array.from(map.values());
  } catch {
    return [];
  }
};

export const AdminCrmDashboard: React.FC<AdminCrmDashboardProps> = ({
  adminEmail,
  onExitAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<'crm' | 'questions'>('crm');
  // Immediately initialize state with cached students so admin sees data in 0ms!
  const [students, setStudents] = useState<StudentProfile[]>(() => getInitialCachedStudents());
  const [isLoading, setIsLoading] = useState<boolean>(() => getInitialCachedStudents().length === 0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'free' | 'pro'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentPhone, setNewStudentPhone] = useState('');
  const [newStudentIsVip, setNewStudentIsVip] = useState(false);
  const [viewInvoice, setViewInvoice] = useState<InvoiceRecord | null>(null);

  // Marketing & Free Rounds Policy Settings
  const [settings, setSettings] = useState<AppSettings>(() => getAppSettings());
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSaveMsg, setSettingsSaveMsg] = useState<string | null>(null);

  // Dynamic Pricing State (Regular Strike-through vs Active Offer Price)
  const [priceInputRegular, setPriceInputRegular] = useState<number>(() => settings.regularPriceEur || 120);
  const [priceInputActive, setPriceInputActive] = useState<number>(() => settings.academyPriceEur || 49);

  // Dynamic Free Rounds Limit State (allows arbitrary inputs like 5, 15, etc.)
  const [freeRoundsInput, setFreeRoundsInput] = useState<number>(() => settings.freeRoundsLimit);

  useEffect(() => {
    if (settings.regularPriceEur) setPriceInputRegular(settings.regularPriceEur);
    if (settings.academyPriceEur) setPriceInputActive(settings.academyPriceEur);
    if (typeof settings.freeRoundsLimit === 'number') setFreeRoundsInput(settings.freeRoundsLimit);
  }, [settings.regularPriceEur, settings.academyPriceEur, settings.freeRoundsLimit]);

  const handleSavePricing = async () => {
    if (priceInputActive <= 0) {
      alert('দয়া করে সঠিক অফার মূল্য দিন (কমপক্ষে €১)');
      return;
    }
    const regularToSave = priceInputRegular > 0 ? priceInputRegular : 120;
    const activeToSave = priceInputActive;

    // 1. Update React state immediately so user sees instant reaction (0ms)
    setSettings((prev) => ({
      ...prev,
      regularPriceEur: regularToSave,
      academyPriceEur: activeToSave,
    }));

    setIsSavingSettings(true);
    try {
      const updated = await saveAppSettings({
        regularPriceEur: regularToSave,
        academyPriceEur: activeToSave,
      });
      setSettings(updated);
      setPriceInputRegular(updated.regularPriceEur || 120);
      setPriceInputActive(updated.academyPriceEur || 49);
      setSettingsSaveMsg(`কোর্স মূল্য সফলভাবে আপডেট ও পুরো ওয়েবসাইটে লাইভ হয়েছে: নিয়মিত ~~€${updated.regularPriceEur}~~ • অফার €${updated.academyPriceEur}`);
      setTimeout(() => setSettingsSaveMsg(null), 4000);
    } catch (err) {
      console.error('Failed to save pricing:', err);
      setSettingsSaveMsg(`মূল্য আপডেট হয়েছে: নিয়মিত ~~€${regularToSave}~~ • অফার €${activeToSave}`);
      setTimeout(() => setSettingsSaveMsg(null), 4000);
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleUpdateFreeRoundsLimit = async (limit: number) => {
    const validLimit = Math.min(240, Math.max(0, limit));
    setFreeRoundsInput(validLimit);
    setIsSavingSettings(true);
    setSettings((prev) => ({ ...prev, freeRoundsLimit: validLimit }));
    try {
      const updated = await saveAppSettings({ freeRoundsLimit: validLimit });
      setSettings(updated);
      setFreeRoundsInput(updated.freeRoundsLimit);
      setSettingsSaveMsg(`সফলভাবে আপডেট হয়েছে: বর্তমানে ${validLimit}টি রাউন্ড ফ্রি`);
      setTimeout(() => setSettingsSaveMsg(null), 3500);
    } catch (e) {
      console.error('Settings update error:', e);
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleOpenStudentInvoice = (student: StudentProfile) => {
    const list = getInvoices(student.email);
    if (list.length > 0) {
      setViewInvoice(list[0]);
    } else {
      const inv = createInvoiceRecord({
        studentName: student.name || 'Studente Patente B',
        studentEmail: student.email,
        studentPhone: student.phone || '+39',
        codiceFiscale: 'REGOLARE',
        address: 'Italia',
        city: 'Bolzano',
        paymentMethod: 'card',
      });
      saveInvoice(inv);
      setViewInvoice(inv);
    }
  };

  // Fetch students with instant local fallback, Server JSON DB (/api/students), and Cloud Firestore
  const fetchStudents = async () => {
    setIsRefreshing(true);
    let serverStudents: StudentProfile[] = [];

    // 1. Read immediate local data first
    const localStudents = getInitialCachedStudents();
    if (localStudents.length > 0) {
      setStudents(localStudents);
      setIsLoading(false);
    }

    // 2. Fetch from MongoDB Atlas serverless API (/api/students)
    try {
      const res = await fetch('/api/students');
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (Array.isArray(data)) {
          serverStudents = data;
        }
      }
    } catch (e) {
      console.warn('MongoDB Atlas database fetch notice:', e);
    }

    // 3. Merge without duplicates (keyed by email or uid), prioritizing server records
    const map = new Map<string, StudentProfile>();
    localStudents.forEach((s) => {
      if (s.email) map.set(s.email.toLowerCase(), s);
      else if (s.uid) map.set(s.uid, s);
    });
    serverStudents.forEach((s) => {
      if (s.email) map.set(s.email.toLowerCase(), { ...map.get(s.email.toLowerCase()), ...s });
      else if (s.uid) map.set(s.uid, { ...map.get(s.uid), ...s });
    });

    const merged = Array.from(map.values());
    if (merged.length > 0) {
      setStudents(merged);
      try {
        localStorage.setItem('patente_registered_students', JSON.stringify(merged));
      } catch {}
    }

    setIsLoading(false);
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchStudents();
    fetchRemoteAppSettings().then((s) => {
      if (s) setSettings(s);
    });
  }, []);

  // Filtered students list
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = student.name?.toLowerCase().includes(q);
        const matchEmail = student.email?.toLowerCase().includes(q);
        const matchPhone = student.phone?.toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchPhone) return false;
      }

      // Filter
      if (filterType === 'pro' && !student.isVip) return false;
      if (filterType === 'free' && student.isVip) return false;

      return true;
    });
  }, [students, searchQuery, filterType]);

  // Key CRM Metrics
  const metrics = useMemo(() => {
    const total = students.length;
    const phoneLeads = students.filter((s) => s.phone && s.phone.trim().length > 5).length;
    const proPasses = students.filter((s) => s.isVip).length;
    const currentPrice = settings.academyPriceEur || 49;
    const totalRevenue = proPasses * currentPrice;
    const totalQuestions = students.reduce((acc, s) => acc + (s.totalQuestionsAnswered || 0), 0);
    return { total, phoneLeads, proPasses, totalRevenue, totalQuestions };
  }, [students, settings.academyPriceEur]);

  // Toggle Pro Student Pass for a student directly from CRM (all 240 rounds free for closest ones)
  const handleToggleProPass = async (student: StudentProfile) => {
    const newStatus = !student.isVip;
    const confirmMsg = newStatus
      ? `আপনি কি ${student.name || student.email}-কে আজীবনের জন্য সব ২৪০ রাউন্ড সম্পূর্ণ ফ্রি এক্সেস (VIP Pass) দিতে চান?\n\n(এটি তাৎক্ষণিকভাবে শিক্ষার্থীর অ্যাকাউন্টে সব ২৪০টি রাউন্ড আনলক করবে)`
      : `আপনি কি ${student.name || student.email}-এর ২৪০ রাউন্ড ফ্রি VIP Pass প্রত্যাহার করতে চান?`;

    if (!window.confirm(confirmMsg)) return;

    const payload: StudentProfile = {
      ...student,
      isVip: newStatus,
      unlockedRound: newStatus ? 240 : (student.unlockedRound || 1),
    };

    // 1. Update local state
    const updated = students.map((s) => (s.email.toLowerCase() === student.email.toLowerCase() ? payload : s));
    setStudents(updated);

    try {
      localStorage.setItem('patente_registered_students', JSON.stringify(updated));

      // 2. If currently logged in user on this device is this student, sync active session immediately
      const currentStored = localStorage.getItem('patente_student_user');
      if (currentStored) {
        const parsed = JSON.parse(currentStored);
        if (parsed.email && parsed.email.toLowerCase() === student.email.toLowerCase()) {
          const updatedActive = { ...parsed, isVip: newStatus, unlockedRound: payload.unlockedRound };
          localStorage.setItem('patente_student_user', JSON.stringify(updatedActive));
          localStorage.setItem('patente_bangla_is_vip', String(newStatus));
          if (newStatus) {
            localStorage.setItem('patente_bangla_unlocked_round', '240');
          }
        }
      }

      // 3. Save to MongoDB Atlas server database (/api/students)
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      alert(
        newStatus
          ? `✅ ${student.name || student.email}-এর জন্য সব ২৪০টি রাউন্ড সফলভাবে ফ্রি আনলক করা হয়েছে!`
          : `ℹ️ ${student.name || student.email}-এর VIP এক্সেস প্রত্যাহার করা হয়েছে।`
      );
    } catch (err: any) {
      console.error('Failed to sync VIP status:', err);
      alert('লোকাল স্ট্যাটাস আপডেট হয়েছে।');
    }
  };

  // Permanently remove a student from CRM & MongoDB database
  const handleRemoveStudent = async (student: StudentProfile) => {
    const cleanEmail = (student.email || '').trim().toLowerCase();
    const confirmDelete = window.confirm(
      `আপনি কি নিশ্চিত যে আপনি "${student.name || cleanEmail}" (${cleanEmail}) স্টুডেন্টকে CRM ও ডাটাবেস থেকে স্থায়ীভাবে মুছে ফেলতে (Remove) চান?`
    );
    if (!confirmDelete) return;

    // 1. Remove immediately from React state
    const updated = students.filter(
      (s) =>
        (s.email || '').trim().toLowerCase() !== cleanEmail &&
        (!student.uid || s.uid !== student.uid)
    );
    setStudents(updated);

    try {
      // 2. Clean local storage caches so the deleted user doesn't reappear
      localStorage.setItem('patente_registered_students', JSON.stringify(updated));

      const currentStored = localStorage.getItem('patente_student_user');
      if (currentStored) {
        const parsed = JSON.parse(currentStored);
        if ((parsed.email || '').trim().toLowerCase() === cleanEmail) {
          localStorage.removeItem('patente_student_user');
          localStorage.removeItem('patente_student_jwt');
        }
      }

      const leadStored = localStorage.getItem('patente_bangla_student_lead');
      if (leadStored) {
        const parsedLead = JSON.parse(leadStored);
        if ((parsedLead.email || '').trim().toLowerCase() === cleanEmail) {
          localStorage.removeItem('patente_bangla_student_lead');
        }
      }

      // 3. Delete from MongoDB Atlas (/api/students)
      await fetch(
        `/api/students?email=${encodeURIComponent(cleanEmail)}&uid=${encodeURIComponent(student.uid || '')}`,
        { method: 'DELETE' }
      );
    } catch (err) {
      console.error('Failed to delete student from server:', err);
    }
  };

  // Add new student manually from CRM
  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newStudentEmail.trim()) {
      alert('দয়া করে নাম ও ইমেইল পূরণ করুন');
      return;
    }

    const createdProfile: StudentProfile = {
      uid: 'std_' + Date.now(),
      name: newStudentName.trim(),
      email: newStudentEmail.trim().toLowerCase(),
      phone: newStudentPhone.trim() || undefined,
      unlockedRound: 1,
      totalQuestionsAnswered: 0,
      completedRounds: {},
      mistakeIds: [],
      isVip: newStudentIsVip,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    // Update state and local/server database
    const updated = [createdProfile, ...students.filter((s) => s.email?.toLowerCase() !== createdProfile.email.toLowerCase())];
    setStudents(updated);
    try {
      localStorage.setItem('patente_registered_students', JSON.stringify(updated));
      await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createdProfile),
      });
    } catch {}

    setNewStudentName('');
    setNewStudentEmail('');
    setNewStudentPhone('');
    setNewStudentIsVip(false);
    setIsAddStudentOpen(false);
  };

  // Export students list to CSV
  const handleExportCSV = () => {
    if (students.length === 0) {
      alert('কোনো স্টুডেন্ট ডেটা নেই');
      return;
    }

    const headers = ['Name', 'Email', 'Phone/WhatsApp', 'Unlocked Round', 'Questions Answered', 'Pro Student Pass', 'Joined Date'];
    const rows = students.map((s) => [
      `"${s.name || ''}"`,
      `"${s.email || ''}"`,
      `"${s.phone || ''}"`,
      `"${s.unlockedRound || 1}"`,
      `"${s.totalQuestionsAnswered || 0}"`,
      `"${s.isVip ? `YES (Pro €${settings.academyPriceEur || 49})` : 'NO (Free Trial)'}"`,
      `"${s.createdAt ? new Date(s.createdAt.seconds ? s.createdAt.seconds * 1000 : s.createdAt).toLocaleDateString() : ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `patente_students_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fadeIn text-left pb-16 rounded-[28px] bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.16),rgba(6,78,80,0.07)_45%,transparent_75%)]">
      {/* Top Admin Topbar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-[#041E17] via-[#07251C] to-[#062B2E] text-white border border-emerald-800/60 shadow-xl shadow-emerald-950/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white font-black shadow-md shadow-emerald-500/30">
            🛡️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black tracking-tight">
                Patente Bangla Italia • Admin CRM Portal
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 shadow-sm shadow-emerald-500/20">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Logged in as: <span className="text-emerald-300">{adminEmail}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          {/* Refresh Button */}
          <button
            type="button"
            onClick={fetchStudents}
            disabled={isRefreshing}
            className="py-2 px-3 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/70 text-emerald-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-emerald-800/70"
            title="Refresh student list"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>

          {/* Exit Admin Button */}
          <button
            type="button"
            onClick={onExitAdmin}
            className="py-2 px-4 rounded-xl bg-red-600/90 hover:bg-red-600 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit Admin</span>
          </button>
        </div>
      </div>

      {/* Admin Tab Switcher */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-fit shadow-xs">
        <button
          type="button"
          onClick={() => setActiveTab('crm')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'crm'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-sm shadow-emerald-500/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Student Leads & CRM ({students.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('questions')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'questions'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-sm shadow-emerald-500/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Master Questions Explorer (7,165 Qs)</span>
        </button>
      </div>

      {activeTab === 'crm' ? (
        <div className="space-y-6">
          {/* Dynamic Marketing & Free Rounds Policy Control Panel */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-[#131B2E] to-slate-900 text-white border border-slate-700/80 shadow-2xl space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/30">
                    <Sliders className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                    মার্কেটিং ও ফ্রি রাউন্ড পলিসি (Free Rounds Access Policy)
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Live Dynamic
                  </span>
                </div>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  মার্কেটিং অফার অনুযায়ী সাধারণ স্টুডেন্টদের জন্য ফ্রি রাউন্ড সংখ্যা নির্ধারণ করুন (০ থেকে ২৪০)। এখানে পরিবর্তন করলেই পুরো ওয়েবসাইটে সাথে সাথে কার্যকর হবে। এছাড়া নিচের টেবিল থেকে আপনার ঘনিষ্ঠ বা বিশেষ শিক্ষার্থীদের আলাদাভাবে <strong>"সব ২৪০ রাউন্ড ফ্রি (VIP Pass)"</strong> দিতে পারবেন।
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">বর্তমান সক্রিয় লিমিট</span>
                  <span className="text-base font-black text-emerald-400">
                    {settings.freeRoundsLimit} রাউন্ড ফ্রি
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Presets Buttons */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span>দ্রুত নির্বাচন করুন (Quick Presets):</span>
                {isSavingSettings && (
                  <span className="text-xs font-bold text-emerald-400 animate-pulse">
                    সংরক্ষণ ও ক্লাউড সিঙ্ক হচ্ছে...
                  </span>
                )}
                {settingsSaveMsg && (
                  <span className="text-xs font-black text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>{settingsSaveMsg}</span>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                {[
                  { value: 0, label: '০ ফ্রি (Full Paid)', desc: 'সম্পূর্ণ পেইড • কোনো ফ্রি নেই' },
                  { value: 5, label: '৫ রাউন্ড ফ্রি', desc: '১৫০টি কুইজ ফ্রি' },
                  { value: 10, label: '১০ রাউন্ড ফ্রি', desc: '৩০০টি কুইজ ফ্রি' },
                  { value: 20, label: '২০ রাউন্ড ফ্রি (স্ট্যান্ডার্ড)', desc: '৬০০টি কুইজ ফ্রি' },
                  { value: 240, label: '২৪০ রাউন্ড ফ্রি (সব ফ্রি)', desc: '১০০% উন্মুক্ত সিলেবাস' },
                ].map((preset) => {
                  const isActive = settings.freeRoundsLimit === preset.value;
                  return (
                    <button
                      key={preset.value}
                      type="button"
                      disabled={isSavingSettings}
                      onClick={() => handleUpdateFreeRoundsLimit(preset.value)}
                      className={`p-3 rounded-2xl text-left border transition-all cursor-pointer relative overflow-hidden group ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-600 border-transparent text-white shadow-lg shadow-emerald-500/25 ring-2 ring-white/20'
                          : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black">{preset.label}</span>
                        {isActive && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <span className={`text-[10px] block pt-1 ${isActive ? 'text-white/90' : 'text-slate-400'}`}>
                        {preset.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Slider & Number Input with Explicit Save Button */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                    <span>কাস্টম সংখ্যা স্লাইডার (০ থেকে ২৪০):</span>
                    <span className="font-mono text-emerald-300 font-black">{freeRoundsInput} / ২৪০ রাউন্ড</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="240"
                    value={freeRoundsInput}
                    onChange={(e) => setFreeRoundsInput(parseInt(e.target.value, 10) || 0)}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-400">সরাসরি ইনপুট:</span>
                    <input
                      type="number"
                      min="0"
                      max="240"
                      value={freeRoundsInput}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val)) setFreeRoundsInput(Math.min(240, Math.max(0, val)));
                      }}
                      className="w-20 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-black text-center text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <span className="text-xs text-slate-400">রাউন্ড</span>
                  </div>

                  <button
                    type="button"
                    disabled={isSavingSettings}
                    onClick={() => handleUpdateFreeRoundsLimit(freeRoundsInput)}
                    className={`px-4 py-2 rounded-xl text-white font-black text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50 ${
                      freeRoundsInput !== settings.freeRoundsLimit
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 animate-pulse ring-2 ring-emerald-400/30'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    }`}
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>
                      {isSavingSettings 
                        ? 'সংরক্ষণ হচ্ছে...' 
                        : freeRoundsInput !== settings.freeRoundsLimit 
                        ? 'পরিবর্তন সংরক্ষণ করুন' 
                        : 'সংরক্ষিত (Saved)'}
                    </span>
                  </button>
                </div>
              </div>

              {freeRoundsInput !== settings.freeRoundsLimit && (
                <div className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
                  <span>⚠️ আপনি মান পরিবর্তন করেছেন ({freeRoundsInput} রাউন্ড)। পুরো ওয়েবসাইটে কার্যকর করতে "পরিবর্তন সংরক্ষণ করুন" বাটনে ক্লিক করুন।</span>
                </div>
              )}
            </div>

            {/* Live Explanation Callout */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300 flex items-start gap-2.5">
              <span className="text-base shrink-0 mt-0.5">
                {settings.freeRoundsLimit === 0 ? '🚫' : settings.freeRoundsLimit === 240 ? '🎉' : '💡'}
              </span>
              <p className="leading-relaxed">
                {settings.freeRoundsLimit === 0 ? (
                  <>
                    <strong className="text-white">সম্পূর্ণ পেইড পলিসি সক্রিয়:</strong> ওয়েবসাইটে কোনো ফ্রি রাউন্ড নেই। সাধারণ শিক্ষার্থীদের ১ম রাউন্ড থেকেই একাডেমি মেম্বারশিপ (€৪৯) নিতে হবে। তবে আপনার বিশেষ বা ঘনিষ্ঠ শিক্ষার্থীদের নিচের তালিকা থেকে <strong className="text-emerald-400">"🎁 সব ২৪০ রাউন্ড ফ্রি (VIP Pass)"</strong> বাটনে ক্লিক করে সব রাউন্ড ফ্রি করে দিতে পারবেন।
                  </>
                ) : settings.freeRoundsLimit === 240 ? (
                  <>
                    <strong className="text-white">সম্পূর্ণ উন্মুক্ত পলিসি সক্রিয়:</strong> ওয়েবসাইটের সকল ২৪০টি রাউন্ড ও ৭,১৬৫টি কুইজ প্রতিটি সাধারণ শিক্ষার্থীর জন্য সম্পূর্ণ ফ্রি ও উন্মুক্ত।
                  </>
                ) : (
                  <>
                    <strong className="text-white">বর্তমান পলিসি অনুযায়ী:</strong> সাধারণ শিক্ষার্থীরা প্রথম <strong className="text-emerald-400">{settings.freeRoundsLimit}টি রাউন্ড ({settings.freeRoundsLimit * 30}টি প্রশ্ন)</strong> ফ্রিতে অনুশীলন করতে পারবে। রাউন্ড <strong className="text-orange-400">{settings.freeRoundsLimit + 1} থেকে ২৪০</strong> একাডেমি প্রো মেম্বারশিপে লক থাকবে (যদি না আপনি কোনো শিক্ষার্থীকে আলাদাভাবে VIP Pass প্রদান করেন)।
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Dynamic Academy Pricing & Discount Control Panel (Regular vs Special Offer Price) */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 text-white shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3.5">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                    €
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    একাডেমি কোর্স ফি ও ডিসকাউন্ট কন্ট্রোল (Dynamic Pricing)
                  </h3>
                </div>
                <p className="text-xs text-slate-400">
                  নিয়মিত মূল্য (কাটা দাগ) এবং ডিসকাউন্ট অফার মূল্য নির্ধারণ করুন। পুরো ওয়েবসাইট ও স্ট্রাইপে তাৎক্ষণিক কার্যকর হবে।
                </p>
              </div>

              {settingsSaveMsg && (
                <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>{settingsSaveMsg}</span>
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              {/* Regular Price (Crossed Out) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 block">
                    নিয়মিত ফি / Regular Price (€):
                  </label>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setPriceInputRegular(120)}
                      className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold cursor-pointer transition"
                    >
                      €120
                    </button>
                    <button
                      type="button"
                      onClick={() => setPriceInputRegular(170)}
                      className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold cursor-pointer transition"
                    >
                      €170
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">€</span>
                  <input
                    type="number"
                    min="1"
                    value={priceInputRegular === 0 ? '' : priceInputRegular}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/^0+(?=\d)/, '');
                      setPriceInputRegular(clean === '' ? 0 : parseInt(clean, 10) || 0);
                    }}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-black text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="120"
                  />
                </div>
                <span className="text-[10px] text-slate-400 block">কাটা দাগের নিয়মিত দাম (যেমন: €120 বা €170)</span>
              </div>

              {/* Offer Price (Active Charged Price) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 block">
                    ডিসকাউন্ট অফার মূল্য / Special Offer Price (€):
                  </label>
                  <div className="flex items-center gap-1 font-bold">
                    <button
                      type="button"
                      onClick={() => setPriceInputActive(49)}
                      className="px-1.5 py-0.5 rounded bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-300 text-[10px] cursor-pointer transition"
                    >
                      €49
                    </button>
                    <button
                      type="button"
                      onClick={() => setPriceInputActive(79)}
                      className="px-1.5 py-0.5 rounded bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-300 text-[10px] cursor-pointer transition"
                    >
                      €79
                    </button>
                    <button
                      type="button"
                      onClick={() => setPriceInputActive(80)}
                      className="px-1.5 py-0.5 rounded bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-300 text-[10px] cursor-pointer transition"
                    >
                      €80
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400 font-bold">€</span>
                  <input
                    type="number"
                    min="1"
                    value={priceInputActive === 0 ? '' : priceInputActive}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/^0+(?=\d)/, '');
                      setPriceInputActive(clean === '' ? 0 : parseInt(clean, 10) || 0);
                    }}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-950 border border-emerald-500/50 text-emerald-400 font-black text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                    placeholder="49"
                  />
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold block">শিক্ষার্থী যে আসল মূল্য পে করবে (যেমন: €49, €79, €80)</span>
              </div>

              {/* Save Pricing Button */}
              <div>
                {(() => {
                  const hasUnsavedPriceChanges =
                    priceInputActive !== (settings.academyPriceEur || 49) ||
                    priceInputRegular !== (settings.regularPriceEur || 120);

                  return (
                    <button
                      type="button"
                      disabled={isSavingSettings}
                      onClick={handleSavePricing}
                      className={`w-full py-2.5 px-4 rounded-xl text-white font-black text-xs shadow-lg active:scale-95 transition cursor-pointer flex items-center justify-center gap-2 ${
                        hasUnsavedPriceChanges
                          ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 ring-2 ring-amber-400 animate-pulse shadow-orange-500/30'
                          : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-emerald-500/20'
                      }`}
                    >
                      <Check className="w-4 h-4 text-white" />
                      <span>
                        {isSavingSettings
                          ? 'সংরক্ষণ হচ্ছে...'
                          : hasUnsavedPriceChanges
                          ? 'নতুন মূল্য সেভ করুন (Save New Price)'
                          : 'মূল্য সংরক্ষিত (Price Saved)'}
                      </span>
                    </button>
                  );
                })()}
              </div>
            </div>

            {/* Live Visual Preview of Pricing */}
            {(() => {
              const previewRegular = priceInputRegular > 0 ? priceInputRegular : (settings.regularPriceEur || 120);
              const previewActive = priceInputActive > 0 ? priceInputActive : (settings.academyPriceEur || 49);
              const previewSavings = Math.max(0, previewRegular - previewActive);
              const previewDiscountPct = previewRegular > 0 ? Math.round((previewSavings / previewRegular) * 100) : 0;
              const hasUnsavedPriceChanges =
                priceInputActive !== (settings.academyPriceEur || 49) ||
                priceInputRegular !== (settings.regularPriceEur || 120);

              return (
                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">ওয়েবসাইটে শিক্ষার্থীদের কাছে ডিসপ্লে হবে:</span>
                    {hasUnsavedPriceChanges ? (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold animate-pulse">
                        ⚠️ আনসেভড প্রিভিউ (সেভ করতে বাটনে চাপ দিন)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>লাইভ সক্রিয়</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="line-through text-slate-500 text-xs font-bold">
                      €{previewRegular}
                    </span>
                    <span className="text-lg font-black text-emerald-400">
                      €{previewActive}
                    </span>
                    {previewSavings > 0 && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-500/30">
                        Save €{previewSavings} ({previewDiscountPct}% OFF)
                      </span>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Executive CRM Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {/* Total Students */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold">
                <span>Total Students</span>
                <Users className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {metrics.total}
              </div>
              <p className="text-[10px] text-slate-400">Registered Accounts</p>
            </div>

            {/* WhatsApp Leads */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold">
                <span>WhatsApp Leads</span>
                <Phone className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                {metrics.phoneLeads}
              </div>
              <p className="text-[10px] text-slate-400">With verified phone</p>
            </div>

            {/* Pro Passes */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold">
                <span>Pro Student Passes</span>
                <Sparkles className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-500 dark:text-emerald-400">
                {metrics.proPasses}
              </div>
              <p className="text-[10px] text-slate-400">€{settings.academyPriceEur || 49} Lifetime Enrolled</p>
            </div>

            {/* Total Revenue */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold">
                <span>Est. Revenue</span>
                <DollarSign className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                €{metrics.totalRevenue}
              </div>
              <p className="text-[10px] text-slate-400">Based on €{settings.academyPriceEur || 49} Pass</p>
            </div>

            {/* Total Questions Solved */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold">
                <span>Questions Solved</span>
                <TrendingUp className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400">
                {metrics.totalQuestions}
              </div>
              <p className="text-[10px] text-slate-400">Across all students</p>
            </div>
          </div>

          {/* Search, Filter & CSV Export Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="নাম, ইমেইল বা হোয়াটসঅ্যাপ নম্বর দিয়ে খুঁজুন..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              {/* Membership Filter */}
              <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                    filterType === 'all'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500'
                  }`}
                >
                  All ({students.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType('pro')}
                  className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                    filterType === 'pro'
                      ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                      : 'text-slate-500'
                  }`}
                >
                  Pro ({metrics.proPasses})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType('free')}
                  className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                    filterType === 'free'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500'
                  }`}
                >
                  Free ({metrics.total - metrics.proPasses})
                </button>
              </div>

              {/* Add Student Button */}
              <button
                type="button"
                onClick={() => setIsAddStudentOpen(true)}
                className="py-2 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>+ Add Student</span>
              </button>

              {/* Export to CSV Button */}
              <button
                type="button"
                onClick={handleExportCSV}
                className="py-2 px-3.5 rounded-xl bg-slate-900 hover:bg-black dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Student Leads Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">WhatsApp / Contact</th>
                    <th className="py-3 px-4">Study Progress</th>
                    <th className="py-3 px-4">Membership</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-slate-400">
                        {isLoading ? 'Loading students from Cloud Firestore...' : 'কোনো স্টুডেন্ট পাওয়া যায়নি'}
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student) => {
                      const cleanPhone = student.phone ? student.phone.replace(/[^0-9+]/g, '') : '';
                      const whatsappUrl = cleanPhone
                        ? `https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent(
                            `Ciao ${student.name || 'Student'}, ti contatto da Patente Bangla Italia per la tua preparazione dell'esame di guida!`
                          )}`
                        : null;

                      return (
                        <tr
                          key={student.email}
                          className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition"
                        >
                          {/* Student Info */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                                {(student.name || student.email || 'S')[0]?.toUpperCase() || 'S'}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900 dark:text-white">
                                  {student.name || 'Unnamed Student'}
                                </div>
                                <div className="text-[11px] text-slate-400 font-mono">
                                  {student.email}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* WhatsApp / Phone */}
                          <td className="py-3.5 px-4">
                            {cleanPhone ? (
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs text-slate-700 dark:text-slate-300">
                                  {student.phone}
                                </span>
                                {whatsappUrl && (
                                  <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-2 py-0.5 rounded-md bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] flex items-center gap-1 transition border border-emerald-200 dark:border-emerald-800"
                                    title="Open WhatsApp chat"
                                  >
                                    <Phone className="w-2.5 h-2.5" />
                                    <span>WhatsApp</span>
                                    <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                                  </a>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-400 italic text-[11px]">No phone</span>
                            )}
                          </td>

                          {/* Progress */}
                          <td className="py-3.5 px-4 space-y-0.5">
                            <div className="font-bold text-slate-800 dark:text-slate-200">
                              Round {student.unlockedRound || 1} / 240
                            </div>
                            <div className="text-[10px] text-slate-500">
                              {student.totalQuestionsAnswered || 0} কুইজ সমাধান
                            </div>
                          </td>

                          {/* Membership Status */}
                          <td className="py-3.5 px-4">
                            {student.isVip ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-emerald-500/15 to-teal-500/15 text-emerald-600 dark:text-emerald-400 font-black text-[10px] border border-emerald-300 dark:border-emerald-700/60 shadow-xs">
                                <Sparkles className="w-3 h-3 fill-current text-emerald-500" />
                                <span>PRO VIP (২৪০ রাউন্ড ফ্রি)</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-[10px] border border-slate-200 dark:border-slate-700">
                                <span>
                                  {settings.freeRoundsLimit === 0
                                    ? 'পেইড স্টুডেন্ট (০ ফ্রি)'
                                    : `ফ্রি ট্রায়াল (${settings.freeRoundsLimit} রাউন্ড)`}
                                </span>
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {student.isVip && (
                                <button
                                  type="button"
                                  onClick={() => handleOpenStudentInvoice(student)}
                                  className="px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-bold text-[11px] transition cursor-pointer border border-blue-200 dark:border-blue-800 flex items-center gap-1 shadow-2xs"
                                  title="Visualizza e Stampa Ricevuta Ufficiale"
                                >
                                  <FileText className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                                  <span>Fattura</span>
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => handleToggleProPass(student)}
                                className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition cursor-pointer border flex items-center gap-1 ${
                                  student.isVip
                                    ? 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                                    : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 shadow-sm'
                                }`}
                                title={
                                  student.isVip
                                    ? 'VIP এক্সেস প্রত্যাহার করুন'
                                    : 'ঘনিষ্ঠদের জন্য সব ২৪০ রাউন্ড সম্পূর্ণ ফ্রি করে দিন'
                                }
                              >
                                {student.isVip ? (
                                  <span>Revoke VIP</span>
                                ) : (
                                  <>
                                    <span>🎁 সব ২৪০ রাউন্ড ফ্রি (VIP Pass)</span>
                                  </>
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleRemoveStudent(student)}
                                className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-[11px] transition cursor-pointer border border-red-500 flex items-center gap-1 shadow-sm shrink-0"
                                title="এই স্টুডেন্টকে স্থায়ীভাবে মুছে ফেলুন (Remove Student)"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Remove (মুছুন)</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Tab 2: Master Questions Explorer */
        <AdminQuestionExplorer onBackToApp={() => setActiveTab('crm')} />
      )}

      {/* Manual Student Addition Modal */}
      {isAddStudentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 text-left">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                নতুন স্টুডেন্ট যোগ করুন (Add Student)
              </h3>
              <button
                type="button"
                onClick={() => setIsAddStudentOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  পূর্ণ নাম (Student Full Name) *
                </label>
                <input
                  type="text"
                  required
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="e.g. Marco Hossain"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ইমেইল এড্রেস (Email Address) *
                </label>
                <input
                  type="email"
                  required
                  value={newStudentEmail}
                  onChange={(e) => setNewStudentEmail(e.target.value)}
                  placeholder="e.g. student@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  WhatsApp / ফোন নম্বর (Optional)
                </label>
                <input
                  type="text"
                  value={newStudentPhone}
                  onChange={(e) => setNewStudentPhone(e.target.value)}
                  placeholder="e.g. +39 328 123 4567"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isVipCheck"
                  checked={newStudentIsVip}
                  onChange={(e) => setNewStudentIsVip(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 cursor-pointer"
                />
                <label htmlFor="isVipCheck" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  একাডেমি Pro VIP Pass (€{settings.academyPriceEur || 49} লাইফটাইম এক্সেস)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddStudentOpen(false)}
                  className="py-2 px-4 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition cursor-pointer shadow-md shadow-emerald-600/25"
                >
                  সেভ করুন (Save Student)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Invoice View & Print Modal */}
      <CourseInvoiceModal
        isOpen={Boolean(viewInvoice)}
        onClose={() => setViewInvoice(null)}
        invoice={viewInvoice}
      />
    </div>
  );
};
