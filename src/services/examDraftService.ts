import type { QuizQuestion } from '../data/quizData';

export interface ExamDraft {
  roundId: number | null;
  questions: QuizQuestion[];
  answers: Record<string, boolean>;
  currentIdx: number;
  timeLeftSeconds: number;
  savedAt: number;
}

export type ExamDraftInput = Omit<ExamDraft, 'savedAt'>;

const STORAGE_KEY = 'patente_exam_drafts';
const MAX_DRAFTS = 6;

export const getExamDraftKey = (roundId?: number | null): string =>
  roundId ? `round_${roundId}` : 'mock';

const isValidDraft = (draft: unknown): draft is ExamDraft => {
  if (!draft || typeof draft !== 'object') return false;
  const d = draft as ExamDraft;
  if (!Array.isArray(d.questions) || d.questions.length === 0) return false;
  if (d.questions.some((q) => !q || typeof q.id !== 'string')) return false;
  if (!d.answers || typeof d.answers !== 'object' || Array.isArray(d.answers)) return false;
  if (typeof d.currentIdx !== 'number' || !Number.isFinite(d.currentIdx)) return false;
  if (typeof d.timeLeftSeconds !== 'number' || !Number.isFinite(d.timeLeftSeconds)) return false;
  if (typeof d.savedAt !== 'number') return false;
  return true;
};

export const loadExamDrafts = (): Record<string, ExamDraft> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    const clean: Record<string, ExamDraft> = {};
    Object.entries(parsed).forEach(([key, value]) => {
      if (isValidDraft(value)) clean[key] = value;
    });
    return clean;
  } catch {
    return {};
  }
};

export const loadExamDraft = (roundId?: number | null): ExamDraft | null => {
  const draft = loadExamDrafts()[getExamDraftKey(roundId)];
  return isValidDraft(draft) ? draft : null;
};

export const getLatestExamDraft = (): ExamDraft | null => {
  const list = Object.values(loadExamDrafts()).sort((a, b) => b.savedAt - a.savedAt);
  return list.length > 0 ? list[0] : null;
};

export const saveExamDraft = (draft: ExamDraftInput): void => {
  try {
    const drafts = loadExamDrafts();
    // Strictly monotonic timestamp so "latest draft" stays correct even when two
    // saves land inside the same millisecond
    const newestSavedAt = Object.values(drafts).reduce(
      (max, d) => Math.max(max, d.savedAt || 0),
      0
    );
    const savedAt = Math.max(Date.now(), newestSavedAt + 1);
    drafts[getExamDraftKey(draft.roundId)] = { ...draft, savedAt };

    const sorted = Object.entries(drafts).sort(
      (a, b) => (b[1].savedAt || 0) - (a[1].savedAt || 0)
    );
    const pruned: Record<string, ExamDraft> = {};
    sorted.slice(0, MAX_DRAFTS).forEach(([key, value]) => {
      pruned[key] = value;
    });

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pruned));
    } catch {
      // Quota exceeded: keep only the current draft and retry once
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ [getExamDraftKey(draft.roundId)]: { ...draft, savedAt } })
      );
    }
  } catch {
    // Storage unavailable (private mode etc.) — resume feature simply stays inactive
  }
};

export const clearExamDraft = (roundId?: number | null): void => {
  try {
    const drafts = loadExamDrafts();
    const key = getExamDraftKey(roundId);
    if (!(key in drafts)) return;
    delete drafts[key];
    if (Object.keys(drafts).length === 0) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
      } catch {
        // Never keep a stale draft around just because storage is full
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  } catch {}
};

export const clearAllExamDrafts = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
};

/** Converts index-keyed answers (component state) into id-keyed answers (storage) */
export const answersToIdKeyed = (
  answers: Record<number, boolean>,
  questions: QuizQuestion[]
): Record<string, boolean> => {
  const out: Record<string, boolean> = {};
  Object.entries(answers).forEach(([idx, value]) => {
    const q = questions[Number(idx)];
    if (q && typeof q.id === 'string') out[q.id] = value;
  });
  return out;
};

/** Converts id-keyed answers (storage) back into index-keyed answers (component state) */
export const answersToIndexKeyed = (
  answers: Record<string, boolean> | undefined,
  questions: QuizQuestion[]
): Record<number, boolean> => {
  const out: Record<number, boolean> = {};
  if (!answers) return out;
  questions.forEach((q, idx) => {
    if (typeof answers[q.id] === 'boolean') out[idx] = answers[q.id];
  });
  return out;
};
