import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../lib/firebase';

export interface StudentProfile {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  unlockedRound: number;
  totalQuestionsAnswered: number;
  completedRounds: Record<number, { errors: number; passed: boolean }>;
  mistakeIds: string[];
  isVip: boolean;
  createdAt?: any;
  lastLoginAt?: any;
}

export const sanitizeStudentProfile = (raw: any): StudentProfile => {
  if (!raw || typeof raw !== 'object') {
    return {
      uid: 'std_' + Date.now(),
      name: 'Student',
      email: '',
      phone: '',
      address: '',
      city: '',
      unlockedRound: 1,
      totalQuestionsAnswered: 0,
      completedRounds: {},
      mistakeIds: [],
      isVip: false,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };
  }

  const email = (typeof raw.email === 'string' ? raw.email : '').trim().toLowerCase();
  let name = (typeof raw.name === 'string' ? raw.name : '').trim();
  if (!name && typeof raw.displayName === 'string' && raw.displayName.trim()) {
    name = raw.displayName.trim();
  }
  if (!name && email) {
    name = email.split('@')[0];
  }
  if (!name) {
    name = 'Student';
  }

  return {
    uid: String(raw.uid || raw.id || 'std_' + Date.now()),
    name,
    email,
    phone: typeof raw.phone === 'string' ? raw.phone : '',
    address: typeof raw.address === 'string' ? raw.address : '',
    city: typeof raw.city === 'string' ? raw.city : '',
    unlockedRound: Number.isFinite(raw.unlockedRound) ? Math.max(1, raw.unlockedRound) : 1,
    totalQuestionsAnswered: Number.isFinite(raw.totalQuestionsAnswered) ? Math.max(0, raw.totalQuestionsAnswered) : 0,
    completedRounds:
      raw.completedRounds && typeof raw.completedRounds === 'object' && !Array.isArray(raw.completedRounds)
        ? raw.completedRounds
        : {},
    mistakeIds: Array.isArray(raw.mistakeIds) ? raw.mistakeIds : [],
    isVip: Boolean(raw.isVip),
    createdAt: raw.createdAt || new Date().toISOString(),
    lastLoginAt: raw.lastLoginAt || new Date().toISOString(),
  };
};

const LOCAL_STORAGE_KEY = 'patente_student_user';
const LOCAL_TOKEN_KEY = 'patente_student_token';
const LOCAL_STUDENTS_LIST_KEY = 'patente_registered_students';
const AUTH_CHANGE_EVENT = 'patente_auth_state_changed';

const notifyAuthChange = (student: StudentProfile | null) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT, { detail: student }));
  }
};

// Helper to sync student to MongoDB Atlas (/api/students) for cross-device sync
export const syncStudentToServerDb = async (student: StudentProfile): Promise<boolean> => {
  try {
    if (typeof window !== 'undefined') {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(student),
      });
      return res.ok;
    }
  } catch (err) {
    console.warn('MongoDB Atlas sync notice:', err);
  }
  return false;
};

// Helper to fetch student profile from MongoDB Atlas (/api/students?email=...)
export const fetchStudentFromServerDb = async (email: string): Promise<Partial<StudentProfile> | null> => {
  try {
    if (typeof window !== 'undefined' && email) {
      const cleanEmail = email.trim().toLowerCase();
      const res = await fetch(`/api/students?email=${encodeURIComponent(cleanEmail)}`);
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    }
  } catch (err) {
    console.warn('MongoDB Atlas fetch student notice:', err);
  }
  return null;
};

// Helper to get local cached user
export const getCachedStudent = (): StudentProfile | null => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return null;
    return sanitizeStudentProfile(JSON.parse(raw));
  } catch {
    return null;
  }
};

const cacheStudentLocally = (student: StudentProfile, token?: string) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(student));
    if (token) {
      localStorage.setItem(LOCAL_TOKEN_KEY, token);
    }
    if (student.isVip) {
      localStorage.setItem('patente_bangla_is_vip', 'true');
    }
    const all: StudentProfile[] = JSON.parse(localStorage.getItem(LOCAL_STUDENTS_LIST_KEY) || '[]');
    const filtered = all.filter((s: any) => s.email?.toLowerCase() !== student.email.toLowerCase());
    filtered.unshift(student);
    localStorage.setItem(LOCAL_STUDENTS_LIST_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.warn('Local student storage update notice:', err);
  }
};

// Step 1 of Registration: Validate real email & send 6-digit OTP code
export const sendRegistrationOtp = async (
  name: string,
  email: string,
  phone: string
): Promise<{ emailSent: boolean; fallbackOtp?: string }> => {
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim();
  const cleanPhone = phone.trim();

  const res = await fetch('/api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'send-otp',
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
    }),
  });

  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const data = await res.json();
    if (!res.ok) {
      const authErr: any = new Error(data.error || 'Failed to send verification code');
      authErr.code = data.code || 'auth/otp-send-failed';
      throw authErr;
    }
    return {
      emailSent: Boolean(data.emailSent),
      fallbackOtp: data.fallbackOtp,
    };
  }

  throw new Error('Verification server unavailable');
};

// Step 2 of Registration: Verify 6-digit OTP and create student account in MongoDB
export const registerStudent = async (
  name: string,
  email: string,
  phone: string,
  password: string,
  otp?: string
): Promise<StudentProfile> => {
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim();
  const cleanPhone = phone.trim();

  try {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'register',
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        password,
        otp: otp ? otp.trim() : '',
      }),
    });

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await res.json();
      if (!res.ok) {
        const authErr: any = new Error(data.error || 'Registration failed');
        authErr.code = data.code || 'auth/registration-failed';
        throw authErr;
      }

      if (data.student) {
        const safeProfile = sanitizeStudentProfile(data.student);
        cacheStudentLocally(safeProfile, data.token);
        notifyAuthChange(safeProfile);
        return safeProfile;
      }
    }
  } catch (err: any) {
    if (err?.code?.startsWith('auth/')) {
      throw err;
    }
    console.warn('MongoDB /api/auth register fallback notice:', err);
    throw err;
  }

  throw new Error('Registration failed');
};

// Login an existing student directly via MongoDB /api/auth
export const loginStudent = async (
  email: string,
  password: string
): Promise<StudentProfile> => {
  const cleanEmail = email.trim().toLowerCase();

  try {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'login',
        email: cleanEmail,
        password,
      }),
    });

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await res.json();
      if (!res.ok) {
        const authErr: any = new Error(data.error || 'Login failed');
        authErr.code = data.code || 'auth/invalid-credential';
        throw authErr;
      }

      if (data.student) {
        const safeProfile = sanitizeStudentProfile(data.student);
        cacheStudentLocally(safeProfile, data.token);
        notifyAuthChange(safeProfile);
        return safeProfile;
      }
    }
  } catch (err: any) {
    if (err?.code?.startsWith('auth/')) {
      throw err;
    }
    console.warn('MongoDB /api/auth login fallback notice:', err);
  }

  // Offline / local fallback check
  const all: StudentProfile[] = JSON.parse(localStorage.getItem(LOCAL_STUDENTS_LIST_KEY) || '[]');
  const existingProfile = all.find((s) => s.email?.toLowerCase() === cleanEmail);
  if (!existingProfile) {
    const notFoundErr: any = new Error('Account not found');
    notFoundErr.code = 'auth/invalid-credential';
    throw notFoundErr;
  }

  const localProfile = sanitizeStudentProfile(existingProfile);
  cacheStudentLocally(localProfile);
  notifyAuthChange(localProfile);
  return localProfile;
};

// One-click Sign in / Register with Google (Gmail) and sync to MongoDB /api/auth
export const loginStudentWithGoogle = async (): Promise<{
  student: StudentProfile;
  isNewStudent: boolean;
}> => {
  if (!auth) {
    throw new Error('Google Sign-In is currently unavailable. Please use Email & Password.');
  }

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

  const credential = await signInWithPopup(auth, provider);
  const user = credential.user;
  const cleanEmail = (user.email || '').trim().toLowerCase();
  const cleanName = (user.displayName || cleanEmail.split('@')[0] || 'Student').trim();

  if (!cleanEmail) {
    throw new Error('Could not retrieve email address from Google account.');
  }

  try {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'google',
        email: cleanEmail,
        name: cleanName,
        googleUid: user.uid,
      }),
    });

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await res.json();
      if (res.ok && data.student) {
        const safeProfile = sanitizeStudentProfile(data.student);
        cacheStudentLocally(safeProfile, data.token);
        notifyAuthChange(safeProfile);
        return {
          student: safeProfile,
          isNewStudent: Boolean(data.isNewStudent),
        };
      }
    }
  } catch (err) {
    console.warn('MongoDB /api/auth google sync fallback notice:', err);
  }

  // Fallback local profile if offline
  const fallbackProfile = sanitizeStudentProfile({
    uid: user.uid || 'std_' + Date.now(),
    name: cleanName,
    email: cleanEmail,
    phone: 'Google Verified',
    unlockedRound: 1,
    isVip: false,
  });
  cacheStudentLocally(fallbackProfile);
  notifyAuthChange(fallbackProfile);
  return { student: fallbackProfile, isNewStudent: false };
};

// Log out student
export const logoutStudent = async (): Promise<void> => {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem(LOCAL_TOKEN_KEY);
  } catch {}
  notifyAuthChange(null);
};

// Sync student progress to MongoDB Atlas
export const syncStudentProgressToCloud = async (
  uid: string,
  progress: Partial<StudentProfile>
): Promise<void> => {
  try {
    const current = getCachedStudent();
    if (current && (current.uid === uid || !uid)) {
      const updatedStudent = sanitizeStudentProfile({ ...current, ...progress });
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedStudent));
      await syncStudentToServerDb(updatedStudent);
    }
  } catch (err) {
    console.warn('Progress sync notice:', err);
  }
};

// Subscribe to auth state changes & refresh student profile from MongoDB in background
export const subscribeToAuthChanges = (
  callback: (student: StudentProfile | null) => void
): (() => void) => {
  const cached = getCachedStudent();
  callback(cached);

  // If student is logged in, refresh their latest VIP/progress status from MongoDB
  if (cached && cached.email && typeof window !== 'undefined') {
    const token = localStorage.getItem(LOCAL_TOKEN_KEY) || '';
    fetch(`/api/auth?email=${encodeURIComponent(cached.email)}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          if (data?.student) {
            const merged = sanitizeStudentProfile({
              ...cached,
              ...data.student,
              unlockedRound: Math.max(cached.unlockedRound || 1, data.student.unlockedRound || 1),
              totalQuestionsAnswered: Math.max(
                cached.totalQuestionsAnswered || 0,
                data.student.totalQuestionsAnswered || 0
              ),
              isVip: Boolean(cached.isVip || data.student.isVip),
            });
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
            callback(merged);
          }
        }
      })
      .catch(() => {});
  }

  const handleCustomEvent = (e: Event) => {
    const custom = e as CustomEvent<StudentProfile | null>;
    callback(custom.detail ?? getCachedStudent());
  };

  if (typeof window !== 'undefined') {
    window.addEventListener(AUTH_CHANGE_EVENT, handleCustomEvent);
  }

  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener(AUTH_CHANGE_EVENT, handleCustomEvent);
    }
  };
};
