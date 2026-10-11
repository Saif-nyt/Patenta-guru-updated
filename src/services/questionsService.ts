import type { QuizQuestion } from '../data/quizData';
import { ALL_200_QUESTIONS, shuffleQuestions } from '../data/roundQuestions';

/**
 * Fetch 30 randomized questions directly from the MongoDB 7,165 question database.
 * If network fails or offline, safely fall back to the local curated question bank.
 */
export async function fetchSimulationExamQuestions(count: number = 30): Promise<QuizQuestion[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500); // Fast 3.5s timeout

    const res = await fetch(`/api/exam-questions?count=${count}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.questions) && data.questions.length > 0) {
        return data.questions;
      }
    }
  } catch (err) {
    console.warn('MongoDB questions API request timed out or unavailable, using local pool:', err);
  }

  // Instant fallback to local pool
  const shuffled = shuffleQuestions(ALL_200_QUESTIONS);
  return shuffled.slice(0, count);
}

