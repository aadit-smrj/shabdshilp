import {
  ALL_GRAMMAR_MODULES,
  APATHIT_GADYANSH_PASSAGES,
  PRE_CHECK_QUIZ_QUESTIONS,
  SPECIAL_WORKSHEETS,
} from './grammarData';
import {
  CLASS5_6_MODULES,
  CLASS5_PRE_CHECKPOINT,
  CLASS5_POST_CHECKPOINT,
  CLASS6_PRE_CHECKPOINT,
  CLASS6_POST_CHECKPOINT,
  CLASS5_STORE_WORKSHEETS,
  CLASS6_STORE_WORKSHEETS,
} from './class5And6Data';
import {
  CLASS7_TO_10_MODULES,
  CLASS7_PRE_CHECKPOINT,
  CLASS7_POST_CHECKPOINT,
  CLASS8_PRE_CHECKPOINT,
  CLASS8_POST_CHECKPOINT,
  CLASS9_PRE_CHECKPOINT,
  CLASS9_POST_CHECKPOINT,
  CLASS10_PRE_CHECKPOINT,
  CLASS10_POST_CHECKPOINT,
  CLASS7_STORE_WORKSHEETS,
  CLASS8_STORE_WORKSHEETS,
  CLASS9_STORE_WORKSHEETS,
  CLASS10_STORE_WORKSHEETS,
} from './class7To10Data';
import { CLASS5_AND_6_RAW_BANK } from './class5And6Bank';
import { CLASS7_TO_10_RAW_BANK } from './class7To10Bank';
import { EXTRA_GRAMMAR_MODULES } from './expandedSimulationsData';
import {
  PRE_CHECKPOINT_QUESTIONS,
  POST_CHECKPOINT_QUESTIONS,
  EXTRA_MODULE_QUESTIONS,
} from './siteExtraQuestions';
import { KATHA_SHILPI_INNOVATIONS } from './kathaShilpiInnovations';
import { KATHA_SHILPI_FORMATS } from './kathaShilpiData';
import { getAllRawBankQuestions } from './worksheetBank';

/**
 * Normalizes a Hindi/English question string by removing numbering prefixes,
 * collapsing whitespace, and lowercasing.
 */
export function normalizeSiteQuestionKey(text?: string | null): string {
  return String(text || '')
    .replace(/^प्रश्न\s*\d+\s*[:.]\s*/i, '')
    .replace(/^Q\s*\d+\s*[:.]\s*/i, '')
    .replace(/^\d+\s*[.)]\s*/, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/**
 * Punctuation-insensitive normalization key to catch identical questions that differ
 * only in quotes, danda (।), question mark (?), hyphens, or spacing.
 */
export function normalizeStrictQuestionFingerprint(text?: string | null): string {
  return normalizeSiteQuestionKey(text)
    .replace(/[।?!.,;:'"‘’“”()[\]{}\-–—/\\]/g, '')
    .replace(/\s+/g, '');
}

let cachedSiteWideKeys: Set<string> | null = null;

function addQuestionKeysToSet(target: Set<string>, text?: string | null): void {
  if (!text || typeof text !== 'string') return;
  const norm = normalizeSiteQuestionKey(text);
  if (norm) target.add(norm);
  const strict = normalizeStrictQuestionFingerprint(text);
  if (strict) target.add(strict);
}

/**
 * Lazily constructs and caches a Set of normalized & strict-fingerprint keys for
 * EVERY question displayed anywhere across the entire website (Store Worksheets,
 * Custom Worksheet Studio, Dashboard Mini-Quizzes, Pre/Post Checkpoints,
 * Grammar Simulations & Quick Checks, Apathit Gadyansh, and Katha Shilpi AI).
 */
export function getSiteWideQuestionKeySet(): Set<string> {
  if (cachedSiteWideKeys) return cachedSiteWideKeys;

  const keys = new Set<string>();

  // 1. All RAW_BANK questions (includes worksheetBank + class5And6Bank + class7To10Bank)
  try {
    for (const item of getAllRawBankQuestions()) {
      addQuestionKeysToSet(keys, item?.qH);
    }
  } catch {
    for (const group of [CLASS5_AND_6_RAW_BANK, CLASS7_TO_10_RAW_BANK]) {
      for (const list of Object.values(group)) {
        for (const item of list) addQuestionKeysToSet(keys, item?.qH);
      }
    }
  }

  // 2. Grammar Modules Quick Checks (Core + Extra Simulations + Classes 5-10 + Extra Component MCQs)
  for (const modList of [
    ALL_GRAMMAR_MODULES,
    EXTRA_GRAMMAR_MODULES,
    CLASS5_6_MODULES,
    CLASS7_TO_10_MODULES,
  ]) {
    for (const mod of modList) {
      for (const q of mod.quickCheckQuestions || []) {
        addQuestionKeysToSet(keys, q?.questionHindi);
      }
    }
  }
  for (const list of Object.values(EXTRA_MODULE_QUESTIONS)) {
    for (const q of list) {
      addQuestionKeysToSet(keys, q?.questionHindi);
    }
  }

  // 3. Pre & Post Checkpoints (Global + Classes 5-10)
  for (const checkpointList of [
    PRE_CHECK_QUIZ_QUESTIONS,
    PRE_CHECKPOINT_QUESTIONS,
    POST_CHECKPOINT_QUESTIONS,
    CLASS5_PRE_CHECKPOINT,
    CLASS5_POST_CHECKPOINT,
    CLASS6_PRE_CHECKPOINT,
    CLASS6_POST_CHECKPOINT,
    CLASS7_PRE_CHECKPOINT,
    CLASS7_POST_CHECKPOINT,
    CLASS8_PRE_CHECKPOINT,
    CLASS8_POST_CHECKPOINT,
    CLASS9_PRE_CHECKPOINT,
    CLASS9_POST_CHECKPOINT,
    CLASS10_PRE_CHECKPOINT,
    CLASS10_POST_CHECKPOINT,
  ]) {
    for (const q of checkpointList) {
      addQuestionKeysToSet(keys, q?.questionHindi);
    }
  }

  // 4. All Store Worksheets (Classes 5-10 & Special Worksheets)
  for (const wsGroup of [
    SPECIAL_WORKSHEETS,
    CLASS5_STORE_WORKSHEETS,
    CLASS6_STORE_WORKSHEETS,
    CLASS7_STORE_WORKSHEETS,
    CLASS8_STORE_WORKSHEETS,
    CLASS9_STORE_WORKSHEETS,
    CLASS10_STORE_WORKSHEETS,
  ]) {
    for (const ws of wsGroup) {
      for (const q of ws.practiceQuestions || []) {
        addQuestionKeysToSet(keys, q?.questionHindi);
      }
    }
  }

  // 5. Apathit Gadyansh Passages (MCQs & Short Questions)
  for (const passage of APATHIT_GADYANSH_PASSAGES) {
    for (const q of passage.questions || []) {
      addQuestionKeysToSet(keys, q?.questionHindi);
    }
    for (const sq of passage.shortQuestions || []) {
      addQuestionKeysToSet(keys, sq?.questionHindi);
    }
  }

  // 6. Katha Shilpi Innovations & Format Exercises
  for (const bundle of Object.values(KATHA_SHILPI_INNOVATIONS)) {
    for (const ex of bundle.creativeExercises || []) {
      addQuestionKeysToSet(keys, ex?.questionHindi);
    }
  }
  for (const spec of Object.values(KATHA_SHILPI_FORMATS)) {
    for (const fb of spec.fillBlanks || []) {
      addQuestionKeysToSet(keys, `${fb.beforeBlankHindi} ____ ${fb.afterBlankHindi}`);
    }
    for (const err of spec.errorIdentification || []) {
      addQuestionKeysToSet(keys, err.titleHindi);
    }
  }

  cachedSiteWideKeys = keys;
  return keys;
}

/**
 * Checks whether a question string already exists anywhere on the website
 * or in an optional set of runtime/session exclusion texts.
 */
export function isQuestionBlockedSiteWide(
  questionHindi: string,
  extraBlockedKeys?: Set<string>
): boolean {
  const norm = normalizeSiteQuestionKey(questionHindi);
  const strict = normalizeStrictQuestionFingerprint(questionHindi);
  if (!norm && !strict) return true;

  const siteKeys = getSiteWideQuestionKeySet();
  if (siteKeys.has(norm) || siteKeys.has(strict)) return true;

  if (extraBlockedKeys && (extraBlockedKeys.has(norm) || extraBlockedKeys.has(strict))) {
    return true;
  }
  return false;
}
