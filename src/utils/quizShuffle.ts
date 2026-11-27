import { QuizQuestion, QuizOption } from '../types';

/**
 * Shuffles an array using the modern Fisher-Yates algorithm.
 */
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Shuffles the options of a single question and updates the correctIndex
 * so that the correct answer is NOT always option A.
 */
export function randomizeQuestionOptions(question: QuizQuestion): QuizQuestion {
  if (!question.options || question.options.length <= 1) {
    return question;
  }

  const originalCorrectOption = question.options[question.correctIndex];
  const shuffledOptions = shuffleArray(question.options);
  const newCorrectIndex = shuffledOptions.findIndex(
    (opt) => opt.textHindi === originalCorrectOption?.textHindi || opt === originalCorrectOption
  );

  return {
    ...question,
    options: shuffledOptions,
    correctIndex: newCorrectIndex >= 0 ? newCorrectIndex : Math.floor(Math.random() * shuffledOptions.length),
  };
}

/**
 * Shuffles an entire array of questions (QuizQuestion or generic), ensuring options
 * are dynamically distributed across indices 0, 1, 2, 3 (A, B, C, D) so answers are never all option A.
 */
export function randomizeQuizSet<T extends { options: any[]; correctIndex: number }>(questions: T[]): T[] {
  if (!Array.isArray(questions) || questions.length === 0) return [];

  // Guaranteed mixed answer distribution cycle: B, C, D, A, C, B, D, A, D, C, A, B, B, D, A, C
  const pattern = [1, 2, 3, 0, 2, 1, 3, 0, 3, 2, 0, 1, 1, 3, 0, 2];

  return questions.map((q, idx) => {
    if (!q || !Array.isArray(q.options) || q.options.length <= 1) {
      return q;
    }

    const currentCorrectIndex = typeof q.correctIndex === 'number' && q.correctIndex >= 0 && q.correctIndex < q.options.length
      ? q.correctIndex
      : 0;
    const originalCorrectOption = q.options[currentCorrectIndex];
    const otherOptions = q.options.filter((_, i) => i !== currentCorrectIndex);
    const shuffledOthers = shuffleArray(otherOptions);

    // Guaranteed mixed index based on cycling pattern
    const targetIndex = pattern[idx % pattern.length] % q.options.length;

    const newOptions = [...shuffledOthers];
    newOptions.splice(targetIndex, 0, originalCorrectOption);

    return {
      ...q,
      options: newOptions,
      correctIndex: targetIndex,
    };
  });
}
