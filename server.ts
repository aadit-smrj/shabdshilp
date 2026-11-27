import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import os from 'os';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
import { buildDeterministicSevenDayPlan, normalizeSevenDayCourse } from './src/utils/studyPlanBuilder.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI on the server with Gemini 4 Hydrogen
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function withTimeout<T>(promise: Promise<T>, timeoutMs = 25000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('AI generation timed out')), timeoutMs)
    ),
  ]);
}

function safeParseJson<T = any>(text?: string | null): T | null {
  if (!text) return null;
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
  }
  return JSON.parse(cleaned) as T;
}

const modelCooldownUntil: Record<string, number> = {};
const aiResponseCache = new Map<string, { value: any; expiresAt: number }>();

function getCachedAiResult<T = any>(key: string): T | null {
  const entry = aiResponseCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    aiResponseCache.delete(key);
    return null;
  }
  return entry.value as T;
}

function setCachedAiResult(key: string, value: any, ttlMs = 10 * 60 * 1000) {
  if (aiResponseCache.size > 300) {
    const firstKey = aiResponseCache.keys().next().value;
    if (firstKey) aiResponseCache.delete(firstKey);
  }
  aiResponseCache.set(key, { value, expiresAt: Date.now() + ttlMs });
}

function isQuotaOrRateLimitError(err: any): boolean {
  const msg = String(err?.message || err || '');
  return err?.status === 429 || /\b429\b|RESOURCE_EXHAUSTED|quota exceeded|rate.?limit/i.test(msg);
}

function isTransientUnavailableError(err: any): boolean {
  const msg = String(err?.message || err || '');
  return (
    err?.status === 503 ||
    err?.status === 504 ||
    err?.status === 502 ||
    /\b503\b|\b504\b|UNAVAILABLE|high demand|temporarily unavailable|timed out|timeout|ECONNRESET|ETIMEDOUT|fetch failed/i.test(msg)
  );
}

function isAuthOrConfigError(err: any): boolean {
  const msg = String(err?.message || err || '');
  return (
    err?.status === 401 ||
    err?.status === 403 ||
    /\b403\b|\b401\b|PERMISSION_DENIED|API_KEY_INVALID|API key not valid/i.test(msg)
  );
}

function parseRetryDelaySeconds(msg: string): number | null {
  const hmsMatch = msg.match(/retry in\s+(?:(\d+)h)?(?:(\d+)m)?(\d+(?:\.\d+)?)s/i);
  if (hmsMatch) {
    const h = hmsMatch[1] ? parseInt(hmsMatch[1], 10) : 0;
    const m = hmsMatch[2] ? parseInt(hmsMatch[2], 10) : 0;
    const s = hmsMatch[3] ? parseFloat(hmsMatch[3]) : 0;
    return h * 3600 + m * 60 + s;
  }
  const jsonDelayMatch = msg.match(/"retryDelay"\s*:\s*"(\d+(?:\.\d+)?)s"/i);
  if (jsonDelayMatch) {
    return parseFloat(jsonDelayMatch[1]);
  }
  return null;
}

function setModelCooldown(model: string, err: any) {
  const msg = String(err?.message || '');
  const isDailyQuota = /GenerateRequestsPerDay|per\s*day/i.test(msg);
  const parsedSeconds = parseRetryDelaySeconds(msg);

  let cooldownMs: number;
  if (isDailyQuota || (parsedSeconds !== null && parsedSeconds > 300)) {
    const rawMs = (parsedSeconds ?? 3600) * 1000;
    cooldownMs = Math.min(Math.max(rawMs, 10 * 60 * 1000), 6 * 60 * 60 * 1000);
  } else if (isQuotaOrRateLimitError(err)) {
    const rawMs = ((parsedSeconds ?? 45) + 2) * 1000;
    cooldownMs = Math.min(Math.max(rawMs, 15000), 120000);
  } else {
    cooldownMs = 45000;
  }
  modelCooldownUntil[model] = Math.max(modelCooldownUntil[model] || 0, Date.now() + cooldownMs);
}

function isModelInCooldown(model: string): boolean {
  const until = modelCooldownUntil[model] || 0;
  return Date.now() < until;
}

function getModelCooldownRemainingSeconds(model: string): number {
  const until = modelCooldownUntil[model] || 0;
  return Math.max(0, Math.ceil((until - Date.now()) / 1000));
}

function logAiFallback(scope: string, err: any) {
  if (isQuotaOrRateLimitError(err)) {
    console.info(`[${scope}] Using fallback (Gemini rate-limit cooldown active).`);
    return;
  }
  if (isTransientUnavailableError(err)) {
    console.info(`[${scope}] Using fallback (Gemini model temporarily busy or timed out).`);
    return;
  }
  const shortMsg = String(err?.message || 'Unknown error').slice(0, 140);
  console.info(`[${scope}] Using fallback (${shortMsg}).`);
}

function buildDeterministicPronounceFallback(rawText: string) {
  const trimmed = rawText.trim();
  const isDevanagari = /[\u0900-\u097F]/.test(trimmed);

  const builtInQuickDict: Record<
    string,
    { hindiText: string; phonetic: string; syllables: string; meaningHindi: string; meaningEnglish: string; tip: string }
  > = {
    'namaste': { hindiText: 'नमस्ते', phonetic: 'nuh-muhs-TAY', syllables: 'न + म + स्ते', meaningHindi: 'अभिवादन / प्रणाम', meaningEnglish: 'Respectful greeting / Hello', tip: 'अंतिम संयुक्त अक्षर "स्ते" में "स" हल्का और "ते" स्पष्ट बोलें।' },
    'shukriya': { hindiText: 'शुक्रिया', phonetic: 'shuk-RI-yaa', syllables: 'शु + क्रि + या', meaningHindi: 'धन्यवाद / आभार', meaningEnglish: 'Thank you', tip: '"शु" में तालव्य "श" का उच्चारण कोमलता से करें और "क्रि" पर छोटी इ रखें।' },
    'dhanyavad': { hindiText: 'धन्यवाद', phonetic: 'dhun-yuh-VAAD', syllables: 'ध + न्य + वा + द', meaningHindi: 'आभार प्रकट करना', meaningEnglish: 'Thank you / Gratitude', tip: '"न्य" संयुक्त अक्षर को हल्का रखकर "वा" को लंबा खींचें।' },
    'sahitya': { hindiText: 'साहित्य', phonetic: 'saa-HIT-yuh', syllables: 'सा + हि + त्य', meaningHindi: 'लेखन व काव्य-रचना का संग्रह', meaningEnglish: 'Literature', tip: '"सा" पर दीर्घ आ और अंत में "त्य" संयुक्ताक्षर का स्पष्ट उच्चारण करें।' },
    'sanskriti': { hindiText: 'संस्कृति', phonetic: 'sun-SKRI-ti', syllables: 'सं + स्कृ + ति', meaningHindi: 'सभ्यता, कला व परंपराएँ', meaningEnglish: 'Culture / Heritage', tip: '"सं" में अनुस्वार नासिक्य ध्वनि से और "स्कृ" में ऋ की मात्रा स्पष्ट बोलें।' },
    'kritagyata': { hindiText: 'कृतज्ञता', phonetic: 'kri-tuhg-yuh-TAA', syllables: 'कृ + त + ज्ञ + ता', meaningHindi: 'किए हुए उपकार को मानने का भाव', meaningEnglish: 'Gratitude / Thankfulness', tip: '"कृ" में ऋ स्वर और "ज्ञ" का शुद्ध उच्चारण करें।' },
    'abhinandan': { hindiText: 'अभिनंदन', phonetic: 'uh-bhi-NUN-dun', syllables: 'अ + भि + नं + द + न', meaningHindi: 'हार्दिक स्वागत व बधाई', meaningEnglish: 'Warm welcome / Felicitation', tip: '"भि" में महाप्राण "भ" और छोटी इ तथा "नं" पर अनुस्वार स्पष्ट रखें।' },
    'parishram': { hindiText: 'परिश्रम', phonetic: 'puh-RI-shrum', syllables: 'प + रि + श्र + म', meaningHindi: 'कड़ी मेहनत', meaningEnglish: 'Hard work / Diligence', tip: '"रि" लघु स्वर के साथ "श्र" संयुक्त अक्षर का सहज उच्चारण करें।' },
  };

  const quick = builtInQuickDict[trimmed.toLowerCase()];
  if (quick) {
    return {
      hindiText: quick.hindiText,
      phonetic: quick.phonetic,
      syllables: quick.syllables,
      meaningHindi: quick.meaningHindi,
      meaningEnglish: quick.meaningEnglish,
      pronunciationTipHindi: quick.tip,
    };
  }

  if (isDevanagari) {
    // Split Devanagari aksharas (consonant + virama clusters + vowel signs/anusvara)
    const aksharas = trimmed.match(/[\u0905-\u0939](?:\u094D[\u0915-\u0939])*[\u093E-\u094C\u0901-\u0903\u093C]?|[\u0904-\u0914][\u0901-\u0903]?|[^\s]/g) || [trimmed];
    const syllables = aksharas.join(' + ');

    const charMap: Record<string, string> = {
      'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'oo', 'ऋ': 'ri',
      'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au', 'ं': 'n', 'ः': 'h', 'ँ': 'n',
      'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'च': 'ch', 'छ': 'chh', 'ज': 'j', 'झ': 'jh',
      'ट': 't', 'ठ': 'th', 'ड': 'd', 'ढ': 'dh', 'ण': 'n', 'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n',
      'प': 'p', 'फ': 'ph', 'ब': 'b', 'भ': 'bh', 'म': 'm', 'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'v',
      'श': 'sh', 'ष': 'sh', 'स': 's', 'ह': 'h', 'ा': 'aa', 'ि': 'i', 'ी': 'ee', 'ु': 'u', 'ू': 'oo',
      'ृ': 'ri', 'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au', '्': '', '़': '',
    };
    const phoneticTokens = aksharas.map((ak) => {
      if (ak === ' ') return ' ';
      let out = '';
      for (let i = 0; i < ak.length; i++) {
        const ch = ak[i];
        out += charMap[ch] ?? ch;
      }
      if (!/[aeiou]$/.test(out) && !ak.endsWith('्') && /[\u0915-\u0939]$/.test(ak)) {
        out += 'a';
      }
      return out;
    });

    return {
      hindiText: trimmed,
      phonetic: phoneticTokens.join('-').replace(/\s*-\s*/g, ' '),
      syllables,
      meaningHindi: `"${trimmed}" का देवनागरी उच्चारण व अक्षर-विभाजन`,
      meaningEnglish: 'Devanagari phonetic & syllable guide',
      pronunciationTipHindi: 'प्रत्येक अक्षर और मात्रा (लघु व दीर्घ स्वर) को उनके क्रम के अनुसार स्पष्ट रूप से उच्चारित करें।',
    };
  }

  return null;
}

async function generateJsonFast(
  contents: string,
  responseSchema?: any,
  timeoutMs = 15000
): Promise<any | null> {
  if (!ai) return null;
  const attempts: Array<{ model: string; thinkingLevel: ThinkingLevel; t: number }> = [
    { model: 'gemini-3.1-flash-lite', thinkingLevel: ThinkingLevel.MINIMAL, t: Math.min(timeoutMs, 11000) },
    { model: 'gemini-4-hydrogen', thinkingLevel: ThinkingLevel.LOW, t: Math.min(timeoutMs, 11000) },
  ];

  let lastErr: any = null;
  for (const cfg of attempts) {
    if (isModelInCooldown(cfg.model)) {
      continue;
    }
    try {
      const configObj: any = {
        responseMimeType: 'application/json',
        thinkingConfig: { thinkingLevel: cfg.thinkingLevel },
      };
      if (responseSchema) {
        configObj.responseSchema = responseSchema;
      }
      const response = await withTimeout(
        ai.models.generateContent({
          model: cfg.model,
          contents,
          config: configObj,
        }),
        cfg.t
      );
      const parsed = safeParseJson(response.text);
      if (parsed) return parsed;
    } catch (err: any) {
      lastErr = err;
      if (isAuthOrConfigError(err)) {
        throw err;
      }
      if (isQuotaOrRateLimitError(err) || isTransientUnavailableError(err)) {
        setModelCooldown(cfg.model, err);
        console.info(`[AI] Skipping ${cfg.model} temporarily (${isQuotaOrRateLimitError(err) ? 'rate limit' : 'busy/timeout'}).`);
      } else {
        console.info(`[AI] ${cfg.model} attempt skipped.`);
      }
    }
  }
  if (lastErr && isAuthOrConfigError(lastErr)) {
    throw lastErr;
  }
  return null;
}

async function generateJsonMultimodal(
  parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }>,
  responseSchema?: any,
  timeoutMs = 28000
): Promise<any | null> {
  if (!ai) return null;
  const attempts: Array<{ model: string; thinkingLevel: ThinkingLevel; t: number }> = [
    { model: 'gemini-4-hydrogen', thinkingLevel: ThinkingLevel.LOW, t: timeoutMs },
    { model: 'gemini-3.1-flash-lite', thinkingLevel: ThinkingLevel.MINIMAL, t: Math.min(timeoutMs, 20000) },
  ];

  let lastErr: any = null;
  for (const cfg of attempts) {
    if (isModelInCooldown(cfg.model)) {
      continue;
    }
    try {
      const configObj: any = {
        responseMimeType: 'application/json',
        thinkingConfig: { thinkingLevel: cfg.thinkingLevel },
      };
      if (responseSchema) {
        configObj.responseSchema = responseSchema;
      }
      const response = await withTimeout(
        ai.models.generateContent({
          model: cfg.model,
          contents: [{ role: 'user', parts }],
          config: configObj,
        }),
        cfg.t
      );
      const parsed = safeParseJson(response.text);
      if (parsed) return parsed;
    } catch (err: any) {
      lastErr = err;
      if (isAuthOrConfigError(err)) {
        throw err;
      }
      if (isQuotaOrRateLimitError(err) || isTransientUnavailableError(err)) {
        setModelCooldown(cfg.model, err);
        console.info(`[AI-Multimodal] Skipping ${cfg.model} temporarily (${isQuotaOrRateLimitError(err) ? 'rate limit' : 'busy/timeout'}).`);
      } else {
        console.info(`[AI-Multimodal] ${cfg.model} attempt skipped:`, String(err?.message || '').slice(0, 120));
      }
    }
  }
  if (lastErr && isAuthOrConfigError(lastErr)) {
    throw lastErr;
  }
  return null;
}

// 1. Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: !!apiKey,
    timestamp: new Date().toISOString(),
  });
});

// 2. Custom Course Generator (when user selects weak topics or inputs them)
app.post('/api/ai/course-generate', async (req: Request, res: Response) => {
  const { weakTopics, grade, goals, board = 'ICSE' } = req.body;
  const gradeLevel = grade || 'कक्षा 8 (Class 8)';
  const boardName = board || 'ICSE';
  const topicsArr = Array.isArray(weakTopics)
    ? weakTopics.filter(Boolean)
    : typeof weakTopics === 'string' && weakTopics.trim()
    ? weakTopics.split(/[,;\n]/).map((s: string) => s.trim()).filter(Boolean)
    : ['संज्ञा', 'कारक', 'वाक्य भेद'];
  const topicsList = topicsArr.join(', ');

  if (ai) {
    try {
      const prompt = `You are the lead Hindi Vyakaran pedagogy expert for ShabdShilp (शब्द शिल्प), an interactive Hindi grammar platform for school students.
Create a strictly topic-aligned 7-DAY (Day 1 to Day 7) day-by-day study plan for a ${gradeLevel} (${boardName}) student focusing ONLY on these selected weak topics: "${topicsList}".
Goal: "${goals || `Improve grammar accuracy from basics to 100% ${boardName} exam readiness`}".

CRITICAL RULES:
1. NEVER invent or include unrelated grammar chapters that are NOT in "${topicsList}". Every single note in diagnosticWeaknessNotes and every Day 1–5 module MUST correspond strictly to the requested topics and be age-appropriate for ${gradeLevel}.
2. Provide ALL 7 days in "modules" (day: 1 through day: 7):
   - Days 1 to 5: Focus step-by-step on the requested topics "${topicsList}".
   - Day 6: Mixed revision worksheet & mistake recovery covering ONLY the requested topics.
   - Day 7: Weekly final self-evaluation (Post-Checkpoint Quiz) for ${gradeLevel}.
3. Each day in "modules" MUST include "dailyTasksHindi" (an array of 3 crisp actionable daily steps in Hindi).

Return ONLY valid JSON matching this structure:
{
  "courseTitle": "7-दिवसीय व्यक्तिगत अध्ययन योजना (${gradeLevel})",
  "summaryHindi": "2 crisp sentences in Hindi mentioning the exact selected topics",
  "summaryEnglish": "English translation of the summary",
  "estimatedDays": 7,
  "diagnosticWeaknessNotes": [
    {
      "topic": "exact requested topic name in Hindi",
      "whyConfusingHindi": "exact point of confusion in Hindi for ${gradeLevel}",
      "whyConfusingEnglish": "in English",
      "remedy": "actionable learning strategy in Hindi"
    }
  ],
  "modules": [
    {
      "day": 1,
      "topicHindi": "focus topic in Hindi",
      "title": "day title in Hindi",
      "titleEnglish": "English title",
      "ruleHindi": "clear precise rule in Hindi",
      "ruleEnglish": "precise explanation in English",
      "quickTip": "memory trick or formula in Hindi",
      "dailyTasksHindi": ["step 1 in Hindi", "step 2 in Hindi", "step 3 in Hindi"],
      "practiceCount": 8
    }
  ],
  "motivationalQuoteHindi": "प्रेरणादायक संदेश",
  "motivationalQuoteEnglish": "English translation"
}`;

      const courseCacheKey = `course:${gradeLevel}:${boardName}:${topicsList}`;
      const cachedCourse = getCachedAiResult(courseCacheKey);
      if (cachedCourse) {
        return res.json(cachedCourse);
      }
      const parsed = await generateJsonFast(prompt, undefined, 16000);
      if (parsed && parsed.modules && parsed.modules.length > 0) {
        const normalized = normalizeSevenDayCourse(parsed, topicsArr, gradeLevel, boardName);
        setCachedAiResult(courseCacheKey, normalized);
        return res.json(normalized);
      }
    } catch (err: any) {
      logAiFallback('course-generate', err);
    }
  }

  return res.json(buildDeterministicSevenDayPlan(topicsArr, gradeLevel, boardName));
});

// Rebalances questions to guarantee distributed answers across options (never only A)
function balanceServerQuestions(questions: any[]): any[] {
  if (!Array.isArray(questions)) return questions;
  const pattern = [1, 2, 3, 0, 2, 1, 3, 0, 3, 2, 0, 1];
  questions.forEach((q, idx) => {
    if (!q || !Array.isArray(q.options) || q.options.length <= 1) return;
    const oldCorrect = typeof q.correctIndex === 'number' && q.correctIndex >= 0 && q.correctIndex < q.options.length
      ? q.correctIndex
      : 0;
    const targetIdx = pattern[idx % pattern.length] % q.options.length;
    if (targetIdx === oldCorrect) return;
    const correctOpt = q.options[oldCorrect];
    q.options.splice(oldCorrect, 1);
    q.options.splice(targetIdx, 0, correctOpt);
    q.correctIndex = targetIdx;
  });
  return questions;
}

function sanitizeOptionEnglish(val: unknown): string {
  const s = typeof val === 'string' ? val.trim() : '';
  if (!s) return '';
  if (/^(correct\s*(option|answer)|wrong\s*(option|answer)|distractor\s*\w*|option\s*([a-d]|[1-4])|choice\s*([a-d]|[1-4])|answer\s*([a-d]|[1-4])?)$/i.test(s)) {
    return '';
  }
  return s;
}

function buildUniformOptions(
  correctH: string,
  wrongsH: string[],
  correctE: unknown,
  wrongsE: unknown[]
) {
  const engList = [
    sanitizeOptionEnglish(correctE),
    sanitizeOptionEnglish(wrongsE?.[0]),
    sanitizeOptionEnglish(wrongsE?.[1]),
    sanitizeOptionEnglish(wrongsE?.[2]),
  ];
  const allValidEnglish = engList.every((e) => e.length > 0);
  return [
    { textHindi: String(correctH), textEnglish: allValidEnglish ? engList[0] : '' },
    { textHindi: String(wrongsH[0]), textEnglish: allValidEnglish ? engList[1] : '' },
    { textHindi: String(wrongsH[1]), textEnglish: allValidEnglish ? engList[2] : '' },
    { textHindi: String(wrongsH[2]), textEnglish: allValidEnglish ? engList[3] : '' },
  ];
}

// 3. Upsarg & Pratyay Interactive Generator with customizable word count
app.post('/api/ai/upsarg-pratyay', async (req: Request, res: Response) => {
  const { morphemeType, morpheme, wordCount = 5, grade = '8' } = req.body;
  const count = Math.min(Math.max(parseInt(wordCount, 10) || 5, 2), 20);
  const isPratyayEarly = morphemeType === 'pratyay';
  const type = isPratyayEarly ? 'प्रत्यय (Suffix)' : 'उपसर्ग (Prefix)';
  const item = String(morpheme || (isPratyayEarly ? 'ता' : 'अनु')).trim();
  const cleanLookup = item.replace(/[^\u0900-\u097F]/g, '').trim() || (isPratyayEarly ? 'ता' : 'अनु');

  const upsargCacheKey = `upsarg:${isPratyayEarly ? 'pratyay' : 'upsarg'}:${cleanLookup}:${count}`;
  const cachedUpsarg = getCachedAiResult(upsargCacheKey);
  if (cachedUpsarg) {
    return res.json(cachedUpsarg);
  }

  // Known preset affixes with deep curated banks are already deterministic and verified locally;
  // only query Gemini when generating novel/custom affixes not in our standard preset set.
  const curatedPresetKeys = new Set(['अनु', 'प्र', 'अधि', 'अप', 'सु', 'वि', 'ता', 'इक', 'आवट', 'ईय', 'वानमान', 'दार']);

  if (ai && (!curatedPresetKeys.has(cleanLookup) || count > 8)) {
    try {
      const prompt = `You are a Hindi grammar professor for ShabdShilp.
Generate an in-depth breakdown for the Hindi ${type}: "${item}".
Generate exactly ${count} distinct words using this ${type}.
Target audience: Hindi grade ${grade}.

Return ONLY valid JSON matching this schema:
{
  "morphemeType": "${isPratyayEarly ? 'प्रत्यय' : 'उपसर्ग'}",
  "morpheme": "${item}",
  "morphemeMeaningHindi": "meaning of this prefix/suffix in Hindi",
  "morphemeMeaningEnglish": "meaning in English",
  "ruleHindi": "Concise rule for this affix in Hindi",
  "ruleEnglish": "Concise rule in English",
  "words": [
    {
      "word": "full word in Devanagari",
      "rootWord": "मूल शब्द",
      "affix": "${item}",
      "breakupFormula": "formula e.g. अनु + शासन = अनुशासन or सुन्दर + ता = सुन्दरता",
      "meaningHindi": "Hindi meaning of the new word",
      "meaningEnglish": "English meaning",
      "sentenceExampleHindi": "An illustrative example sentence",
      "sentenceExampleEnglish": "English translation"
    }
  ],
  "quizQuestions": [
    {
      "id": 1,
      "questionHindi": "MCQ Question text in Hindi",
      "questionEnglish": "Question in English",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correctIndex": 1,
      "explanationHindi": "Clear explanation in Hindi",
      "explanationEnglish": "Clear explanation in English"
    }
  ]
}
Make sure quizQuestions has at least 3 distinct multiple-choice questions directly testing the generated words and concepts. Distribute the correct answers across options A, B, C, D (not just option A).`;

      const parsed = await generateJsonFast(prompt, undefined, 16000);
      if (parsed && Array.isArray(parsed.words) && parsed.words.length > 0) {
        if (Array.isArray(parsed.quizQuestions)) {
          parsed.quizQuestions = balanceServerQuestions(parsed.quizQuestions);
        }
        setCachedAiResult(upsargCacheKey, parsed);
        return res.json(parsed);
      }
    } catch (err: any) {
      logAiFallback('upsarg-pratyay', err);
    }
  }

  // Comprehensive fallback dictionary supporting common prefixes and suffixes
  const isPratyay = morphemeType === 'pratyay';
  const cleanItem = (item || '').replace(/[^\u0900-\u097F]/g, '').trim() || (isPratyay ? 'ता' : 'अनु');

  // Pre-built word banks for prominent affixes
  const affixDatabase: Record<string, Array<{ root: string; word: string; meaningHindi: string; meaningEnglish: string; ex: string }>> = {
    'अनु': [
      { root: 'शासन', word: 'अनुशासन', meaningHindi: 'नियम पालन, व्यवस्था', meaningEnglish: 'Discipline', ex: 'छात्र जीवन में अनुशासन अनिवार्य है।' },
      { root: 'भव', word: 'अनुभव', meaningHindi: 'तजुर्बा, अनुभूति', meaningEnglish: 'Experience', ex: 'बड़ों का अनुभव सदैव मार्गदर्शन करता है।' },
      { root: 'करण', word: 'अनुकरण', meaningHindi: 'पीछे चलना, नकल', meaningEnglish: 'Imitation', ex: 'बच्चे माता-पिता का अनुकरण करते हैं।' },
      { root: 'राग', word: 'अनुराग', meaningHindi: 'प्रेम, स्नेह', meaningEnglish: 'Affection', ex: 'ईश्वर के प्रति उनका गहरा अनुराग था।' },
      { root: 'वाद', word: 'अनुवाद', meaningHindi: 'भाषान्तरण', meaningEnglish: 'Translation', ex: 'यह पुस्तक संस्कृत का अनुवाद है।' },
      { root: 'रूप', word: 'अनुरूप', meaningHindi: 'अनुसार, सदृश', meaningEnglish: 'In accordance with', ex: 'उसने योग्यता के अनुरूप काम किया।' },
      { root: 'गमन', word: 'अनुगमन', meaningHindi: 'पीछे जाना', meaningEnglish: 'Following behind', ex: 'सैनिकों ने सेनापति का अनुगमन किया।' },
      { root: 'चर', word: 'अनुचर', meaningHindi: 'सेवक, साथ चलने वाला', meaningEnglish: 'Follower / attendant', ex: 'राजा के साथ अनेक अनुचर थे।' },
      { root: 'क्रम', word: 'अनुक्रम', meaningHindi: 'सिलसिला, क्रमवार सूची', meaningEnglish: 'Sequence', ex: 'रोल नंबर को अनुक्रम में लिखें।' },
      { root: 'मान', word: 'अनुमान', meaningHindi: 'अंदाज़ा, कयास', meaningEnglish: 'Estimation / guess', ex: 'उसका अनुमान बिल्कुल सही निकला।' }
    ],
    'प्र': [
      { root: 'गति', word: 'प्रगति', meaningHindi: 'आगे बढ़ना, उन्नति', meaningEnglish: 'Progress', ex: 'देश निरंतर प्रगति कर रहा है।' },
      { root: 'सिद्ध', word: 'प्रसिद्ध', meaningHindi: 'विख्यात, मशहूर', meaningEnglish: 'Famous', ex: 'ताजमहल एक प्रसिद्ध स्मारक है।' },
      { root: 'योग', word: 'प्रयोग', meaningHindi: 'व्यवहार, इस्तेमाल', meaningEnglish: 'Usage / experiment', ex: 'वैज्ञानिकों ने नया प्रयोग किया।' },
      { root: 'बल', word: 'प्रबल', meaningHindi: 'बहुत शक्तिशाली', meaningEnglish: 'Strong / mighty', ex: 'उसकी जीतने की इच्छा प्रबल थी।' },
      { root: 'काण्ड', word: 'प्रकांड', meaningHindi: 'अति विद्वान, श्रेष्ठ', meaningEnglish: 'Eminent scholar', ex: 'वह संस्कृत के प्रकांड पंडित हैं।' },
      { root: 'धान', word: 'प्रधान', meaningHindi: 'प्रमुख, मुख्य', meaningEnglish: 'Chief / primary', ex: 'यह गाँव के प्रधान का निर्णय है।' },
      { root: 'हार', word: 'प्रहार', meaningHindi: 'चोट, हमला', meaningEnglish: 'Strike / assault', ex: 'योद्धा ने ढाल पर प्रहार रोका।' },
      { root: 'माण', word: 'प्रमाण', meaningHindi: 'सबूत, साक्ष्य', meaningEnglish: 'Proof / evidence', ex: 'सत्य को प्रमाण की आवश्यकता नहीं होती।' }
    ],
    'अधि': [
      { root: 'कार', word: 'अधिकार', meaningHindi: 'हक, स्वामित्व', meaningEnglish: 'Right / authority', ex: 'शिक्षा पाना हर बच्चे का अधिकार है।' },
      { root: 'नायक', word: 'अधिनायक', meaningHindi: 'प्रमुख नेता, शासक', meaningEnglish: 'Commander / supreme leader', ex: 'राष्ट्रगान में भारत भाग्य विधाता कहा गया है।' },
      { root: 'पति', word: 'अधिपति', meaningHindi: 'स्वामी, राजा', meaningEnglish: 'Lord / sovereign', ex: 'वह संपूर्ण राज्य के अधिपति थे।' },
      { root: 'कार', word: 'अधीक्षक', meaningHindi: 'देखरेख करने वाला', meaningEnglish: 'Superintendent', ex: 'परीक्षा अधीक्षक ने पत्रक बाँटे।' },
      { root: 'भार', word: 'अधिभार', meaningHindi: 'अतिरिक्त शुल्क', meaningEnglish: 'Surcharge', ex: 'देरी से भुगतान पर अधिभार लगेगा।' }
    ],
    'सु': [
      { root: 'पुत्र', word: 'सुपुत्र', meaningHindi: 'अच्छा बेटा', meaningEnglish: 'Good son', ex: 'श्रवण कुमार एक आदर्श सुपुत्र थे।' },
      { root: 'विचार', word: 'सुविचार', meaningHindi: 'अच्छी सोच', meaningEnglish: 'Noble thought', ex: 'प्रतिदिन एक सुविचार पढ़ना चाहिए।' },
      { root: 'गंध', word: 'सुगंध', meaningHindi: 'अच्छी खुशबू', meaningEnglish: 'Fragrance', ex: 'गुलाब की सुगंध मनमोहक है।' },
      { root: 'मार्ग', word: 'सुमार्ग', meaningHindi: 'सच्चा रास्ता', meaningEnglish: 'Virtuous path', ex: 'सत्संग हमें सुमार्ग दिखाता है।' },
      { root: 'डोल', word: 'सुडौल', meaningHindi: 'सुंदर गठन वाला', meaningEnglish: 'Well-shaped', ex: 'व्यायाम से शरीर सुडौल बनता है।' }
    ],
    'ता': [
      { root: 'सुन्दर', word: 'सुन्दरता', meaningHindi: 'सुन्दर होने का गुण', meaningEnglish: 'Beauty', ex: 'प्रकृति की सुन्दरता मन मोह लेती है।' },
      { root: 'सफल', word: 'सफलता', meaningHindi: 'कामयाबी', meaningEnglish: 'Success', ex: 'परिश्रम ही सफलता की कुंजी है।' },
      { root: 'मानव', word: 'मानवता', meaningHindi: 'मनुष्यता, परोपकार', meaningEnglish: 'Humanity', ex: 'दीनों की सहायता सच्ची मानवता है।' },
      { root: 'मित्र', word: 'मित्रता', meaningHindi: 'दोस्ती का भाव', meaningEnglish: 'Friendship', ex: 'सच्ची मित्रता दुर्लभ होती है।' },
      { root: 'कठिन', word: 'कठिनता', meaningHindi: 'मुश्किल होने की अवस्था', meaningEnglish: 'Difficulty', ex: 'धैर्य से कठिनता दूर होती है।' },
      { root: 'योग्य', word: 'योग्यता', meaningHindi: 'काबिलियत', meaningEnglish: 'Capability', ex: 'उसने अपनी योग्यता सिद्ध की।' },
      { root: 'सरल', word: 'सरलता', meaningHindi: 'सीधापन, सहजता', meaningEnglish: 'Simplicity', ex: 'गांधीजी का जीवन सरलता का प्रतीक था।' },
      { root: 'महान', word: 'महानता', meaningHindi: 'बड़प्पन', meaningEnglish: 'Greatness', ex: 'क्षमा करने में ही महानता है।' },
      { root: 'सज्जन', word: 'सज्जनता', meaningHindi: 'नेक होने का भाव', meaningEnglish: 'Nobility / gentleness', ex: 'उनकी सज्जनता की सब प्रशंसा करते हैं।' },
      { root: 'अधीन', word: 'अधीनता', meaningHindi: 'गुलामी, पराधीनता', meaningEnglish: 'Subordination', ex: 'देशभक्तों ने अधीनता स्वीकार नहीं की।' }
    ],
    'इक': [
      { root: 'धर्म', word: 'धार्मिक', meaningHindi: 'धर्म से संबंधित', meaningEnglish: 'Religious', ex: 'यह एक धार्मिक अनुष्ठान है।' },
      { root: 'समाज', word: 'सामाजिक', meaningHindi: 'समाज से जुड़ा', meaningEnglish: 'Social', ex: 'हमें सामाजिक कुरीतियों को मिटाना होगा।' },
      { root: 'इतिहास', word: 'ऐतिहासिक', meaningHindi: 'इतिहास संबंधी', meaningEnglish: 'Historical', ex: 'लाल किला एक ऐतिहासिक स्थल है।' },
      { root: 'वर्ष', word: 'वार्षिक', meaningHindi: 'साल में एक बार होने वाला', meaningEnglish: 'Annual', ex: 'वार्षिक परीक्षा की तैयारी चल रही है।' },
      { root: 'मास', word: 'मासिक', meaningHindi: 'महीने से जुड़ा', meaningEnglish: 'Monthly', ex: 'मासिक पत्रिका समय पर आ गई।' },
      { root: 'अर्थ', word: 'आर्थिक', meaningHindi: 'वित्त व धन संबंधी', meaningEnglish: 'Economic', ex: 'देश की आर्थिक स्थिति सुधर रही है।' }
    ],
    'आवट': [
      { root: 'लिख', word: 'लिखावट', meaningHindi: 'लिखने का ढंग या शैली', meaningEnglish: 'Handwriting', ex: 'उसकी लिखावट बहुत सुंदर है।' },
      { root: 'सजा', word: 'सजावट', meaningHindi: 'सजाने की क्रिया या रूप', meaningEnglish: 'Decoration', ex: 'त्योहार पर घर की सजावट की गई।' },
      { root: 'बना', word: 'बनावट', meaningHindi: 'रचना, संरचना', meaningEnglish: 'Texture / structure', ex: 'इस वस्त्र की बनावट रेशमी है।' },
      { root: 'थक', word: 'थकावट', meaningHindi: 'थकने की अनुभूति', meaningEnglish: 'Tiredness', ex: 'लंबे सफर से थकावट हो गई।' },
      { root: 'मिला', word: 'मिलावट', meaningHindi: 'अशुद्ध मिश्रण', meaningEnglish: 'Adulteration', ex: 'दूध में मिलावट करना अपराध है।' }
    ]
  };

  // Find exact bank or construct dynamically
  let selectedBank = affixDatabase[cleanItem];
  if (!selectedBank) {
    // Generate dynamic entries for custom affix
    const genericRoots = isPratyay 
      ? ['सुन्दर', 'सफल', 'मानव', 'कठिन', 'सरल', 'योग्य', 'महान', 'निर्मल', 'सत्य', 'वीर', 'मधुर', 'शीतल']
      : ['ज्ञान', 'कार', 'बल', 'भाव', 'रूप', 'वाद', 'मति', 'देश', 'योग', 'मान', 'गति', 'गमन'];
    selectedBank = genericRoots.map(r => ({
      root: r,
      word: isPratyay ? `${r}${cleanItem}` : `${cleanItem}${r}`,
      meaningHindi: isPratyay ? `${r} होने का भाव या गुण` : `${cleanItem} भाव से युक्त ${r}`,
      meaningEnglish: isPratyay ? `Quality or state of ${r}` : `${cleanItem} combined with ${r}`,
      ex: isPratyay ? `उसने ${r}${cleanItem} का उत्कृष्ट परिचय दिया।` : `${cleanItem}${r} से कार्य पूर्ण हुआ।`
    }));
  }

  // Ensure we produce the exact requested count up to available
  const resultWords = [];
  for (let i = 0; i < count; i++) {
    const itemData = selectedBank[i % selectedBank.length];
    resultWords.push({
      word: itemData.word,
      rootWord: itemData.root,
      affix: cleanItem,
      breakupFormula: isPratyay ? `${itemData.root} + ${cleanItem} = ${itemData.word}` : `${cleanItem} + ${itemData.root} = ${itemData.word}`,
      meaningHindi: itemData.meaningHindi,
      meaningEnglish: itemData.meaningEnglish,
      sentenceExampleHindi: itemData.ex,
      sentenceExampleEnglish: `Example sentence illustrating '${itemData.word}'.`
    });
  }

  return res.json({
    morphemeType: isPratyay ? 'प्रत्यय' : 'उपसर्ग',
    morpheme: cleanItem,
    morphemeMeaningHindi: isPratyay ? 'शब्द के अंत में जुड़कर नया रूप देने वाला शब्दांश' : 'शब्द के पहले जुड़कर अर्थ को विशिष्ट बनाने वाला शब्दांश',
    morphemeMeaningEnglish: isPratyay ? 'Suffix attached at the end of word' : 'Prefix attached at the front of word',
    ruleHindi: isPratyay
      ? `प्रत्यय शब्द के अंत में जुड़ता है: मूल शब्द (${resultWords[0]?.rootWord}) + प्रत्यय (${cleanItem}) = ${resultWords[0]?.word}`
      : `उपसर्ग शब्द के आरंभ में जुड़ता है: उपसर्ग (${cleanItem}) + मूल शब्द (${resultWords[0]?.rootWord}) = ${resultWords[0]?.word}`,
    ruleEnglish: isPratyay
      ? `Suffixes attach to the end of root words to derive new noun/adjective forms.`
      : `Prefixes attach to the start of root words to alter or emphasize meaning.`,
    words: resultWords,
    quizQuestions: balanceServerQuestions([
      {
        id: 1,
        questionHindi: `'${resultWords[0]?.word}' शब्द में मूल शब्द क्या है?`,
        questionEnglish: `What is the root word in '${resultWords[0]?.word}'?`,
        options: [resultWords[0]?.rootWord, resultWords[0]?.affix, resultWords[1]?.rootWord || 'शब्द', 'कोई नहीं'],
        correctIndex: 0,
        explanationHindi: `'${resultWords[0]?.word}' शब्द '${resultWords[0]?.rootWord}' और '${cleanItem}' के योग से बना है।`,
        explanationEnglish: `'${resultWords[0]?.word}' is formed by combining root word '${resultWords[0]?.rootWord}' and affix '${cleanItem}'.`
      },
      {
        id: 2,
        questionHindi: `'${cleanItem}' किस प्रकार का शब्दांश है?`,
        questionEnglish: `What type of affix is '${cleanItem}'?`,
        options: [isPratyay ? 'प्रत्यय (Suffix)' : 'उपसर्ग (Prefix)', isPratyay ? 'उपसर्ग (Prefix)' : 'प्रत्यय (Suffix)', 'संधि (Sandhi)', 'समास (Samas)'],
        correctIndex: 0,
        explanationHindi: `${cleanItem} शब्द के ${isPratyay ? 'अंत में' : 'प्रारंभ में'} जुड़ने वाला ${isPratyay ? 'प्रत्यय' : 'उपसर्ग'} है।`,
        explanationEnglish: `'${cleanItem}' attaches at the ${isPratyay ? 'end' : 'beginning'} making it a ${isPratyay ? 'suffix' : 'prefix'}.`
      },
      {
        id: 3,
        questionHindi: `'${resultWords[1]?.word || resultWords[0]?.word}' का सही विच्छेद क्या है?`,
        questionEnglish: `What is the correct split for '${resultWords[1]?.word || resultWords[0]?.word}'?`,
        options: [
          resultWords[1]?.breakupFormula || resultWords[0]?.breakupFormula,
          `${cleanItem} + अर्थ`,
          `गलत + ${cleanItem}`,
          'उपरोक्त में से कोई नहीं'
        ],
        correctIndex: 0,
        explanationHindi: `सही विग्रह: ${resultWords[1]?.breakupFormula || resultWords[0]?.breakupFormula} है।`,
        explanationEnglish: `The accurate morphological split is ${resultWords[1]?.breakupFormula || resultWords[0]?.breakupFormula}.`
      }
    ])
  });
});

// 4. Interactive Story Builder with Hinglish understanding
app.post('/api/ai/story-builder', async (req: Request, res: Response) => {
  const { storyContext, userInput, characterName = 'आरव', genre = 'साहसिक कथा', grade = '8' } = req.body;

  if (ai) {
    try {
      const prompt = `You are the creative Hindi Writing Mentor for young students on ShabdShilp.
The student is writing a Hindi story themselves. Keep all Hindi SIMPLE and accessible (सरल हिंदी), avoiding archaic or complex Sanskrit words.
Student Input (which may be in Hinglish like 'ek din' or 'tum kaise ho' or Hindi Devanagari):
"${userInput}"

Story Context so far:
"${storyContext || 'कहानी की शुरुआत...'}"

Character: ${characterName}
Genre: ${genre}
Grade: Class ${grade}

Your task:
1. "studentInputHindi": Clean, simple Hindi Devanagari translation/transliteration of student input.
2. "transliterationNotes": Friendly short note on how Hinglish was understood (e.g. 'ek din' -> 'एक दिन').
3. "storyContinuationHindi": A rich, engaging, multi-sentence narrative paragraph (at least 4 to 6 descriptive sentences in beautiful Hindi with vivid setting, dialogue, character thoughts, and exciting plot development).
4. "storyContinuationEnglish": English meaning and summary of the continued passage.
5. "grammarHighlights": 2 simple grammar points (e.g., संज्ञा, क्रिया, विशेषण) explained in very simple terms.
6. "coachingTipHindi": A simple, encouraging tip for the young writer in easy Hindi.
7. "coachingTipEnglish": Short English tip.

Return ONLY valid JSON:
{
  "studentInputHindi": "...",
  "transliterationNotes": "...",
  "storyContinuationHindi": "...",
  "storyContinuationEnglish": "...",
  "grammarHighlights": [
    {
      "element": "संज्ञा (Noun)",
      "word": "...",
      "explanationHindi": "सरल व्याख्या",
      "explanationEnglish": "Simple explanation"
    }
  ],
  "coachingTipHindi": "...",
  "coachingTipEnglish": "..."
}`;

      const parsed = await generateJsonFast(prompt, undefined, 16000);
      if (parsed && parsed.studentInputHindi) {
        return res.json(parsed);
      }
    } catch (err: any) {
      logAiFallback('story-builder', err);
    }
  }

  // Fallback Hinglish-to-Hindi parser
  const lower = (userInput || '').toLowerCase();
  let devanagariInput = userInput || 'एक नया रोमांचक मोड़ आया...';

  if (lower.includes('tum kaise ho') || lower.includes('kaise ho')) {
    devanagariInput = 'तुम कैसे हो?';
  } else if (lower.includes('ek samay') || lower.includes('ek baar') || lower.includes('ek din')) {
    devanagariInput = 'एक दिन की बात है, एक सुंदर गाँव में एक बुद्धिमान बालक रहता था।';
  } else if (lower.includes('jungle') || lower.includes('sher')) {
    devanagariInput = 'जंगल में अचानक शेर की हल्की सी आवाज़ गूँजी और सब ध्यान से सुनने लगे।';
  }

  return res.json({
    studentInputHindi: devanagariInput,
    transliterationNotes: 'हिंग्लिश को सरल हिंदी में बदला गया। (Hinglish converted to simple Hindi)',
    storyContinuationHindi: 'चारों तरफ नीरव शांति छाई हुई थी और वृक्षों की हरी-भरी शाखाओं से सुनहरी धूप छनकर आ रही थी। आरव ने अपनी धड़कनों को शांत करते हुए धीमे कदमों से आगे बढ़ना शुरू किया। अचानक सामने एक प्राचीन द्वार खुला दिखाई दिया, जिस पर चमकीले अक्षरों में कुछ लिखा था। उसने मन ही मन सोचा कि यह अवश्य किसी बड़े रहस्य की शुरुआत है और अब पीछे मुड़ने का कोई सवाल ही नहीं उठता।',
    storyContinuationEnglish: 'Tranquil calm enveloped the surroundings as golden sunlight filtered through green tree branches. Steadying his heartbeats, Aarav stepped forward. Suddenly an ancient doorway appeared open ahead, with glowing letters inscribed upon it. He determined that this was the threshold of a great mystery, with no turning back.',
    grammarHighlights: [
      {
        element: 'विशेषण (Adjective)',
        word: 'हल्की हवा',
        explanationHindi: "'हल्की' शब्द हवा की विशेषता बता रहा है।",
        explanationEnglish: "'Halki' is an adjective describing the gentle breeze."
      },
      {
        element: 'क्रिया (Verb)',
        word: 'आगे बढ़ना',
        explanationHindi: "किसी काम के होने का संकेत है।",
        explanationEnglish: "Indicates the action of moving forward."
      }
    ],
    coachingTipHindi: 'बहुत बढ़िया! सरल शब्दों में अपनी बात कहना सबसे सुंदर लेखन कहलाता है।',
    coachingTipEnglish: 'Great job! Expressing ideas in simple, clear words is the hallmark of good storytelling.'
  });
});

// 4b. ShabdSahyog (शब्दसहयोग) - Dedicated Side-by-Side AI Writing Assistant
// Real-time helper for students writing their own Hindi stories
const SIMPLE_WORDS_MAP: Record<string, { alternatives: string[]; english: string; example: string }> = {
  'प्रसन्न': { alternatives: ['खुश', 'राजी', 'आनंदित'], english: 'Happy / Pleased', example: 'रोहन नया खिलौना देखकर बहुत खुश हुआ।' },
  'कठिन': { alternatives: ['मुश्किल', 'आसान नहीं', 'भारी'], english: 'Difficult / Hard', example: 'यह पहेली सुलझाना थोड़ा मुश्किल था।' },
  'विशाल': { alternatives: ['बहुत बड़ा', 'ऊँचा-लंबा', 'भारी भरकम'], english: 'Huge / Giant', example: 'जंगल में एक बहुत बड़ा बरगद का पेड़ था।' },
  'शीघ्र': { alternatives: ['जल्दी', 'तुरंत', 'फटाफट'], english: 'Quickly / Soon', example: 'उसने जल्दी से अपनी किताब खोली।' },
  'नेत्र': { alternatives: ['आँखें', 'नयन'], english: 'Eyes', example: 'उसकी आँखों में चमक आ गई।' },
  'भोजन': { alternatives: ['खाना', 'रोटी'], english: 'Food / Meal', example: 'सभी ने मिल-बाँटकर खाना खाया।' },
  'क्रोधित': { alternatives: ['गुस्सा', 'नाराज'], english: 'Angry', example: 'शेर गुस्से में दहाड़ने लगा।' },
  'मार्ग': { alternatives: ['रास्ता', 'सड़क', 'राह'], english: 'Path / Way', example: 'उन्हें जंगल का सही रास्ता मिल गया।' },
  'वृक्ष': { alternatives: ['पेड़', 'पौधा'], english: 'Tree', example: 'चिड़िया पेड़ की डाली पर बैठी थी।' },
  'अंधकार': { alternatives: ['अंधेरा', 'कालापन'], english: 'Darkness', example: 'सूरज ढलते ही अंधेरा छाने लगा।' },
  'समीप': { alternatives: ['पास', 'नजदीक'], english: 'Near / Close', example: 'नदी के पास एक छोटा सा घर था।' },
  'गृह': { alternatives: ['घर', 'मकान'], english: 'Home / House', example: 'वे शाम को सुरक्षित घर लौट आए।' },
  'जल': { alternatives: ['पानी', 'नीर'], english: 'Water', example: 'उसने मटके से ठंडा पानी पिया।' },
  'मित्र': { alternatives: ['दोस्त', 'सखा', 'साथी'], english: 'Friend', example: 'दोनों पक्के दोस्त बन गए।' },
  'रात्रि': { alternatives: ['रात', 'शाम'], english: 'Night', example: 'रात के समय तारे चमकने लगे।' },
  'सूर्य': { alternatives: ['सूरज', 'धूप'], english: 'Sun', example: 'सुबह का सूरज चमक रहा था।' },
  'पुष्प': { alternatives: ['फूल', 'कलियाँ'], english: 'Flower', example: 'बगीचे में लाल फूल खिले थे।' },
  'प्रयास': { alternatives: ['कोशिश', 'मेहनत'], english: 'Effort / Try', example: 'उसने फिर से कोशिश की और जीत गया।' },
  'विजय': { alternatives: ['जीत', 'सफलता'], english: 'Victory', example: 'अंत में सच्चाई की जीत हुई।' },
  'साहस': { alternatives: ['हिम्मत', 'बहादुरी'], english: 'Courage / Bravery', example: 'उसने हिम्मत नहीं हारी।' },
  'कदापि': { alternatives: ['कभी नहीं', 'बिल्कुल नहीं'], english: 'Never / At all', example: 'उसने झूठ कभी नहीं बोला।' },
  'सदा': { alternatives: ['हमेशा', 'रोज़'], english: 'Always', example: 'वह हमेशा दूसरों की मदद करता था।' },
  'अद्भुत': { alternatives: ['अनोखा', 'शानदार', 'लाजवाब'], english: 'Amazing / Wonderful', example: 'वहाँ एक अनोखा दृश्य दिखाई दिया।' },
  'भयभीत': { alternatives: ['डरा हुआ', 'सहमा हुआ'], english: 'Scared / Frightened', example: 'खरगोश डरा हुआ था पर हिम्मत से काम लिया।' },
};

const KID_FRIENDLY_IDIOMS = [
  {
    muhavara: 'फूले न समाना',
    meaningHindi: 'बहुत खुश होना (Extremely happy)',
    meaningEnglish: 'To be overjoyed',
    example: 'कक्षा में प्रथम आने पर आरव फूले न समाया।'
  },
  {
    muhavara: 'दंग रह जाना',
    meaningHindi: 'हैरान हो जाना (Astonished)',
    meaningEnglish: 'To be amazed / surprised',
    example: 'जादुई तोते को बोलते देखकर सब दंग रह गए।'
  },
  {
    muhavara: 'पीठ थपथपाना',
    meaningHindi: 'शाबाशी देना या हौसला बढ़ाना',
    meaningEnglish: 'To praise / pat on the back',
    example: 'अच्छी कहानी लिखने पर शिक्षक ने उसकी पीठ थपथपाई।'
  },
  {
    muhavara: 'हाथ बंटाना',
    meaningHindi: 'काम में मदद करना',
    meaningEnglish: 'To lend a helping hand',
    example: 'उसने अपने दोस्त का हाथ बंटाकर सारा काम पूरा किया।'
  },
  {
    muhavara: 'नौ दो ग्यारह होना',
    meaningHindi: 'तुरंत भाग जाना',
    meaningEnglish: 'To run away quickly',
    example: 'कुत्ते के भौंकते ही बिल्ली नौ दो ग्यारह हो गई।'
  },
  {
    muhavara: 'आँखों का तारा',
    meaningHindi: 'बहुत प्यारा होना',
    meaningEnglish: 'Apple of one’s eye / dearly loved',
    example: 'अपनी अच्छी आदतों के कारण वह सबका आँखों का तारा था।'
  }
];

// Offline transliteration dictionary for common Hinglish phrases
function offlineHinglishConvert(text: string): string {
  const t = text.trim();
  const lower = t.toLowerCase();

  // Common direct phrases
  const directMap: Record<string, string> = {
    'tum kaise ho': 'तुम कैसे हो?',
    'main theek hoon': 'मैं ठीक हूँ।',
    'main thik hu': 'मैं ठीक हूँ।',
    'ek din': 'एक दिन',
    'ek samay ki baat hai': 'एक समय की बात है',
    'ek baar ki baat hai': 'एक बार की बात है',
    'jungle me': 'जंगल में',
    'ek chhota bhalu': 'एक छोटा भालू',
    'usne socha': 'उसने सोचा',
    'usne dekha': 'उसने देखा',
    'kuch nahi': 'कुछ नहीं',
    'kya hua': 'क्या हुआ?',
    'mera naam': 'मेरा नाम',
    'mere dost': 'मेरे दोस्त',
    'mere paas': 'मेरे पास',
    'wahan par': 'वहाँ पर',
    'yahan par': 'यहाँ पर',
    'bohot sundar': 'बहुत सुंदर',
    'bahut accha': 'बहुत अच्छा',
  };

  for (const [k, v] of Object.entries(directMap)) {
    if (lower === k) return v;
  }

  // Word-by-word replacement dictionary
  const wordMap: Record<string, string> = {
    'ek': 'एक', 'din': 'दिन', 'baar': 'बार', 'samay': 'समय', 'ki': 'की', 'baat': 'बात', 'hai': 'है', 'tha': 'था', 'thi': 'थी', 'the': 'थे',
    'jungle': 'जंगल', 'me': 'में', 'mai': 'मैं', 'main': 'मैं', 'tum': 'तुम', 'aap': 'आप', 'hum': 'हम', 'woh': 'वह', 've': 'वे',
    'kaise': 'कैसे', 'kya': 'क्या', 'kyun': 'क्यों', 'kab': 'कब', 'kahan': 'कहाँ', 'kaun': 'कौन', 'ho': 'हो', 'hoon': 'हूँ', 'hu': 'हूँ',
    'sher': 'शेर', 'bhalu': 'भालू', 'chuha': 'चूहा', 'hathi': 'हाथी', 'chidiya': 'चिड़िया', 'ped': 'पेड़', 'nadi': 'नदी', 'pani': 'पानी',
    'ghar': 'घर', 'dost': 'दोस्त', 'raja': 'राजा', 'rani': 'रानी', 'baccha': 'बच्चा', 'ladka': 'लड़का', 'ladki': 'लड़की',
    'ne': 'ने', 'ko': 'को', 'se': 'से', 'par': 'पर', 'ke': 'के', 'liye': 'लिए', 'saath': 'साथ', 'ka': 'का',
    'dekha': 'देखा', 'socha': 'सोचा', 'bola': 'बोला', 'boli': 'बोली', 'kaha': 'कहा', 'suna': 'सुना', 'gaya': 'गया', 'gayi': 'गई', 'aaya': 'आया',
    'ja': 'जा', 'raha': 'रहा', 'rahi': 'रही', 'rahe': 'रहे', 'karega': 'करेगा', 'karegi': 'करेगी', 'karenge': 'करेंगे',
    'bohot': 'बहुत', 'bahut': 'बहुत', 'sundar': 'सुंदर', 'bada': 'बड़ा', 'chhota': 'छोटा', 'achha': 'अच्छा', 'accha': 'अच्छा', 'khush': 'खुश',
    'dara': 'डरा', 'hua': 'हुआ', 'tabhi': 'तभी', 'achanak': 'अचानक', 'aur': 'और', 'lekin': 'लेकिन', 'parantu': 'परंतु', 'kyunki': 'क्योंकि',
    'apne': 'अपने', 'apna': 'अपना', 'apni': 'अपनी', 'mera': 'मेरा', 'meri': 'मेरी', 'mere': 'मेरे', 'tera': 'तेरा', 'uska': 'उसका', 'uski': 'उसकी',
    'gum': 'गुम', 'kho': 'खो', 'mil': 'मिल', 'mila': 'मिला', 'mili': 'मिली', 'mile': 'मिले', 'pata': 'पता', 'chala': 'चला',
    'kuch': 'कुछ', 'koi': 'कोई', 'sab': 'सब', 'sabhi': 'सभी', 'bhag': 'भाग', 'daud': 'दौड़', 'madad': 'मदद', 'sath': 'साथ',
    'yahan': 'यहाँ', 'wahan': 'वहाँ', 'idhar': 'इधर', 'udhar': 'उधर', 'andar': 'अंदर', 'bahar': 'बाहर', 'upar': 'ऊपर', 'neeche': 'नीचे',
    'aage': 'आगे', 'peeche': 'पीछे', 'dur': 'दूर', 'paas': 'पास', 'aaj': 'आज', 'kal': 'कल', 'subah': 'सुबह', 'shaam': 'शाम', 'raat': 'रात'
  };

  // If mostly alphanumeric, do word map
  const words = t.split(/\s+/);
  const converted = words.map(w => {
    const clean = w.toLowerCase().replace(/[^a-z]/g, '');
    const punct = w.replace(/[a-zA-Z]/g, '');
    if (wordMap[clean]) {
      return wordMap[clean] + punct;
    }
    return w;
  }).join(' ');

  return converted || t;
}

app.post('/api/ai/shabdsahyog', async (req: Request, res: Response) => {
  const {
    action = 'chat',
    input = '',
    storyContext = '',
    characterName = 'आरव',
    genre = 'साहसिक कथा',
    grade = 'कक्षा 8'
  } = req.body;

  // 1. Hinglish to Simple Hindi
  if (action === 'hinglish_to_hindi') {
    const rawInput = input.trim();
    if (!rawInput) {
      return res.status(400).json({ error: 'Input is required' });
    }

    if (ai) {
      try {
        const prompt = `You are 'ShabdSahyog' (शब्दसहयोग), a friendly AI writing co-pilot for school students.
Convert this student's Hinglish or informal text into natural, correct, SIMPLE Hindi (सरल हिंदी):
Input: "${rawInput}"

Requirements:
- Use easy, everyday Hindi words suited for school learners.
- Do NOT use heavy Sanskrit vocabulary.
- Output JSON ONLY:
{
  "hindiText": "सरल हिंदी अनुवाद/देवनागरी रूप",
  "englishMeaning": "English translation of what was meant",
  "tip": "Short friendly tip in simple Hindi (e.g. 'बहुत अच्छा वाक्य! इसे अपनी कहानी में जोड़ सकते हैं।')"
}`;

        const parsed = await generateJsonFast(prompt, undefined, 16000);
        if (parsed && parsed.hindiText) {
          return res.json({
            success: true,
            action,
            hindiText: parsed.hindiText,
            englishMeaning: parsed.englishMeaning || '',
            tip: parsed.tip || 'सरल और सुंदर हिंदी वाक्य!'
          });
        }
      } catch (e: any) {
        logAiFallback('shabdsahyog-hinglish', e);
      }
    }

    // Instant local fallback
    const converted = offlineHinglishConvert(rawInput);
    return res.json({
      success: true,
      action,
      hindiText: converted,
      englishMeaning: 'Transliterated directly to simple Hindi Devanagari.',
      tip: 'हिंग्लिश को तुरंत सरल हिंदी में बदला गया। आप इसे कहानी में जोड़ सकते हैं!'
    });
  }

  // 2. Simplify Word (कठिन शब्द का सरल रूप)
  if (action === 'simplify_word') {
    const word = input.trim();
    if (!word) {
      return res.status(400).json({ error: 'Word is required' });
    }

    // Check if word exists in offline dictionary first for instant 0ms latency
    const localEntry = SIMPLE_WORDS_MAP[word];
    if (localEntry) {
      return res.json({
        success: true,
        action,
        originalWord: word,
        simpleAlternatives: localEntry.alternatives.map((alt) => ({
          word: alt,
          meaningEnglish: localEntry.english,
          exampleSentence: localEntry.example
        })),
        tip: `'${word}' की जगह '${localEntry.alternatives[0]}' का प्रयोग करने से कहानी पढ़ना आसान हो जाता है।`
      });
    }

    if (ai) {
      try {
        const prompt = `You are 'ShabdSahyog' (शब्दसहयोग), helping school students replace difficult Hindi words with simple, everyday words (सरल शब्द).
The student wants simpler alternatives for: "${word}".

Return JSON ONLY:
{
  "originalWord": "${word}",
  "simpleAlternatives": [
    {
      "word": "सरल शब्द 1",
      "meaningEnglish": "English meaning",
      "exampleSentence": "सरल वाक्य जिसमें यह शब्द उपयोग हुआ हो"
    },
    {
      "word": "सरल शब्द 2",
      "meaningEnglish": "English meaning",
      "exampleSentence": "एक और सरल वाक्य"
    }
  ],
  "tip": "Short explanation in simple Hindi on how this makes writing easier"
}`;

        const parsed = await generateJsonFast(prompt, undefined, 16000);
        if (parsed && Array.isArray(parsed.simpleAlternatives) && parsed.simpleAlternatives.length > 0) {
          return res.json({
            success: true,
            action,
            originalWord: parsed.originalWord || word,
            simpleAlternatives: parsed.simpleAlternatives,
            tip: parsed.tip || `'${word}' का सरल रूप चुनकर कहानी को सुंदर बनाएँ।`
          });
        }
      } catch (e: any) {
        logAiFallback('shabdsahyog-simplify', e);
      }
    }

    // Local fallback for any unlisted word
    return res.json({
      success: true,
      action,
      originalWord: word,
      simpleAlternatives: [
        {
          word: word,
          meaningEnglish: 'Common everyday term',
          exampleSentence: `छात्रों ने '${word}' का सही प्रयोग सीखा।`
        }
      ],
      tip: `सरल शब्दों का प्रयोग करने से आपकी कहानी सभी आसानी से समझ सकते हैं।`
    });
  }

  // 3. Next Line Ideas (आगे क्या लिखें?)
  if (action === 'next_ideas') {
    if (ai) {
      try {
        const prompt = `You are 'ShabdSahyog' (शब्दसहयोग), a creative writing co-pilot for young Hindi learners.
The student is writing their own story and needs 3 creative ideas for what happens next.
Story so far: "${storyContext || 'एक समय की बात है, एक बहादुर बालक था जिसका नाम ' + characterName + ' था।'}"
Character: ${characterName}
Genre: ${genre}
Grade: ${grade}

Rules:
- Write in VERY SIMPLE, everyday Hindi (सरल हिंदी). No difficult words!
- Provide 3 distinct story options:
  1) An exciting twist or surprise
  2) A dialogue or conversation
  3) A brave or clever action
- Return JSON ONLY:
{
  "ideas": [
    {
      "id": "idea_1",
      "vibe": "रोमांचक मोड़ (Exciting Twist)",
      "hindiSentence": "सरल हिंदी में वाक्य",
      "englishMeaning": "English summary"
    },
    {
      "id": "idea_2",
      "vibe": "बातचीत (Dialogue)",
      "hindiSentence": "सरल हिंदी में बातचीत",
      "englishMeaning": "English summary"
    },
    {
      "id": "idea_3",
      "vibe": "साहस भरा कदम (Brave Action)",
      "hindiSentence": "सरल हिंदी में वाक्य",
      "englishMeaning": "English summary"
    }
  ],
  "coachTip": "कहानी को आगे बढ़ाने के लिए अपनी पसंद का विकल्प चुनें और कहानी में जोड़ें!"
}`;

        const parsed = await generateJsonFast(prompt, undefined, 16000);
        if (parsed && Array.isArray(parsed.ideas) && parsed.ideas.length > 0) {
          return res.json({
            success: true,
            action,
            ideas: parsed.ideas,
            coachTip: parsed.coachTip || 'पसंद का विकल्प चुनें और कहानी में जोड़ें!'
          });
        }
      } catch (e: any) {
        logAiFallback('shabdsahyog-next-ideas', e);
      }
    }

    // Local instant fallback
    return res.json({
      success: true,
      action,
      ideas: [
        {
          id: 'idea_1',
          vibe: 'रोमांचक मोड़ (Exciting Twist)',
          hindiSentence: `तभी झाड़ियों के पीछे से एक हल्की सी आवाज़ आई और ${characterName} चौंक गया।`,
          englishMeaning: `Suddenly a gentle sound came from behind the bushes and ${characterName} was startled.`
        },
        {
          id: 'idea_2',
          vibe: 'बातचीत (Dialogue)',
          hindiSentence: `'डरो मत, मैं तुम्हारी मदद के लिए आया हूँ!' सामने खड़े नए दोस्त ने मुस्कुराते हुए कहा।`,
          englishMeaning: `'Don't be afraid, I came to help you!' said the new friend with a smile.`
        },
        {
          id: 'idea_3',
          vibe: 'साहस भरा कदम (Brave Action)',
          hindiSentence: `${characterName} ने गहरी साँस ली और हिम्मत करके आगे की ओर कदम बढ़ा दिया।`,
          englishMeaning: `${characterName} took a deep breath and courageously stepped forward.`
        }
      ],
      coachTip: 'इनमें से कोई भी वाक्य चुनकर आप अपनी कहानी को आगे बढ़ा सकते हैं!'
    });
  }

  // 4. Fix & Polish Sentence (वाक्य सुधारें व सरल बनाएँ)
  if (action === 'fix_sentence') {
    const rawInput = input.trim();
    if (!rawInput) {
      return res.status(400).json({ error: 'Sentence is required' });
    }

    if (ai) {
      try {
        const prompt = `You are 'ShabdSahyog' (शब्दसहयोग), helping school children polish and simplify their Hindi writing.
The student wrote this sentence (which may have grammar/spelling errors or be in Hinglish):
"${rawInput}"

Task:
1. Turn it into correct, natural, SIMPLE Hindi (सरल हिंदी).
2. Avoid difficult words.
3. Explain what was fixed in 1 short friendly sentence in simple Hindi and English.

Return JSON ONLY:
{
  "improvedHindi": "शुद्ध व सरल हिंदी वाक्य",
  "englishMeaning": "English meaning",
  "explanationHindi": "हमने वर्तनी और वाक्य की बनावट को ठीक किया ताकि पढ़ने में सहज लगे।",
  "explanationEnglish": "Polished grammar and word order for natural flow."
}`;

        const parsed = await generateJsonFast(prompt, undefined, 16000);
        if (parsed && parsed.improvedHindi) {
          return res.json({
            success: true,
            action,
            originalText: rawInput,
            improvedHindi: parsed.improvedHindi,
            englishMeaning: parsed.englishMeaning || '',
            explanationHindi: parsed.explanationHindi || 'वाक्य को व्याकरण के अनुसार सही और सरल बनाया गया।',
            explanationEnglish: parsed.explanationEnglish || 'Enhanced grammar for simple and natural flow.'
          });
        }
      } catch (e: any) {
        logAiFallback('shabdsahyog-fix-sentence', e);
      }
    }

    // Local fallback
    const simpleClean = offlineHinglishConvert(rawInput);
    return res.json({
      success: true,
      action,
      originalText: rawInput,
      improvedHindi: simpleClean.endsWith('।') || simpleClean.endsWith('?') ? simpleClean : `${simpleClean}।`,
      englishMeaning: 'Your sentence polished into clear, simple Hindi.',
      explanationHindi: 'वाक्य को पूर्ण विराम और सरल बनावट के साथ संवारा गया।',
      explanationEnglish: 'Formatted with proper punctuation and natural word order.'
    });
  }

  // 5. Suggest Idioms (सरल मुहावरे)
  if (action === 'suggest_idioms') {
    return res.json({
      success: true,
      action,
      idioms: KID_FRIENDLY_IDIOMS,
      tip: 'मुहावरों का प्रयोग कहानी को मज़ेदार और जीवंत बना देता है!'
    });
  }

  // 6. Universal AI Chat with ShabdSahyog (सार्वभौमिक हिंदी व्याकरण, शब्दावली व लेखन समाधान)
  if (action === 'chat') {
    const studentQuery = (input || '').trim();
    if (!studentQuery) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const { topicContext = '' } = req.body;

    const universalSystemPrompt = `You are 'ShabdSahyog AI' (शब्दसहयोग AI), the universal, expert, and warm Hindi language and Vyakaran mentor for students (Classes 5-10).
The student is using ShabdShilp and can ask you about ANYTHING related to Hindi:
1. Grammar: कारक (Karak - करण vs अपादान, etc.), वाक्य भेद (सरल, संयुक्त, मिश्र), वाच्य (कर्तृ, कर्म, भाव), काल (भूत, वर्तमान, भविष्यत् एवं 6-6 उपभेद), मुहावरे, उपसर्ग एवं प्रत्यय, संधि एवं समास, वाक्य शुद्धि।
2. Comprehension (अपठित गद्यांश): गद्यांश हल करने के नियम, उत्तर खोजना, उपयुक्त शीर्षक चयन।
3. Vocabulary & Meanings: शब्दार्थ, विलोम, पर्यायवाची, हिंग्लिश से शुद्ध हिंदी।
4. Worksheets & Exam Doubts: कठिन प्रश्नों का समाधान, स्मरण सूत्र (Mnemonics)।
5. Writing Studio: कहानियाँ, निबंध, संवाद, वाक्य विस्तार।

Active Model Target: Gemini 4 Hydrogen
Student Query: "${studentQuery}"
Current Context: "${topicContext || storyContext || 'Universal Hindi Assistant'}"
Character: ${characterName}
Grade Level: "${grade}"

Instructions:
1. Always provide an accurate, clear, and encouraging answer in simple everyday Hindi (सरल हिंदी) accompanied by an English translation.
2. Bold the essential grammar rules, definitions, or mnemonic tips.
3. In 'suggestedSentence', provide a memorable example or key formula (स्मरण सूत्र) that the student can apply or remember.
4. Output JSON ONLY:
{
  "replyHindi": "सरल और प्रामाणिक हिंदी उत्तर...",
  "replyEnglish": "Concise English translation...",
  "suggestedSentence": "स्मरण सूत्र या उदाहरण वाक्य..."
}`;

    if (ai) {
      try {
        const parsed = await generateJsonFast(universalSystemPrompt, undefined, 16000);
        if (parsed && parsed.replyHindi) {
          return res.json({
            success: true,
            action,
            replyHindi: parsed.replyHindi,
            replyEnglish: parsed.replyEnglish || '',
            suggestedSentence: parsed.suggestedSentence || '',
            modelUsed: 'gemini-3.1-flash-lite'
          });
        }
      } catch (e: any) {
        logAiFallback('shabdsahyog-chat', e);
      }
    }

    // Comprehensive intelligent fallback with greeting detection
    const lower = studentQuery.toLowerCase();
    let replyHindi = `आपके प्रश्न "${studentQuery}" के संबंध में: हिंदी व्याकरण और भाषा में इस विषय को स्पष्ट करने के लिए इसके नियमों और उदाहरणों को समझना महत्वपूर्ण है। क्या आप इसके बारे में कोई विशिष्ट उदाहरण या नियम जानना चाहते हैं?`;
    let replyEnglish = `Regarding your query "${studentQuery}": In Hindi grammar, understanding this topic involves reviewing its core rules and contextual examples. Would you like a specific example?`;
    let suggestedSentence = `मुझसे व्याकरण का कोई भी नियम या उदाहरण पूछने के लिए स्वतंत्र महसूस करें!`;

    if (lower === 'hi' || lower === 'hello' || lower === 'hey' || lower.includes('namaste') || lower.includes('नमस्ते') || lower.includes('नमस्कार') || lower.includes('प्रणाम') || lower.includes('kaise ho') || lower.includes('कौन हो')) {
      replyHindi = "नमस्ते! मैं 'शब्दसहयोग AI' हूँ—आपका हिंदी व्याकरण, शब्दावली और लेखन साथी। बताइए, आज हिंदी व्याकरण या लेखन में मैं आपकी क्या सहायता कर सकता हूँ?";
      replyEnglish = "Hello! I am 'ShabdSahyog AI'—your Hindi grammar, vocabulary, and writing companion. How can I help you with Hindi today?";
      suggestedSentence = "आप मुझसे कारक, समास, वाक्य भेद, मुहावरे या किसी भी व्याकरण नियम के बारे में पूछ सकते हैं!";
    } else if (lower.includes('करण') || lower.includes('अपादान') || lower.includes('karan') || lower.includes('apadan') || studentQuery.includes('कारक')) {
      replyHindi = "करण और अपादान दोनों में 'से' विभक्ति लगती है, पर बड़ा अंतर है:\n1. करण कारक = क्रिया का साधन/माध्यम (जैसे: 'उसने कलम से लिखा' - यहाँ कलम साधन है)।\n2. अपादान कारक = अलगाव, दूरी या तुलना (जैसे: 'पेड़ से पत्ता गिरा' - यहाँ पत्ता अलग हो रहा है)।";
      replyEnglish = "Both use 'से', but Karan denotes the tool/instrument ('with/by'), while Apadan strictly denotes detachment or origin ('separated from').";
      suggestedSentence = "स्मरण सूत्र: साधन हो तो करण, जुदाई हो तो अपादान!";
    } else if (lower.includes('वाक्य') || lower.includes('मिश्र') || lower.includes('संयुक्त') || lower.includes('सरल') || lower.includes('vakya')) {
      replyHindi = "रचना के आधार पर वाक्य के 3 भेद हैं:\n1. सरल वाक्य: केवल 1 मुख्य क्रिया (जैसे: राम विद्यालय जाता है)।\n2. संयुक्त वाक्य: दो स्वतंत्र वाक्य 'और', 'किन्तु', 'या' से जुड़े (जैसे: वह आया और तुरंत चला गया)।\n3. मिश्र वाक्य: 1 प्रधान उपवाक्य + 1 या अधिक आश्रित उपवाक्य ('जो...वह', 'जब...तब', 'क्योंकि...इसलिए')।";
      replyEnglish = "Simple has one finite verb; Compound connects independent clauses via coordinators; Complex links dependent clauses via subordinator pairs.";
      suggestedSentence = "स्मरण सूत्र: 'और/परन्तु' दिखे तो संयुक्त, 'जो/जब/कि' दिखे तो मिश्र वाक्य!";
    } else if (lower.includes('वाच्य') || lower.includes('vachya') || lower.includes('कर्मवाच्य') || lower.includes('भाववाच्य')) {
      replyHindi = "वाच्य क्रिया के रूपांतर को कहते हैं:\n1. कर्तृवाच्य: कर्ता मुख्य (लड़का पुस्तक पढ़ता है)।\n2. कर्मवाच्य: कर्म मुख्य + 'के द्वारा' (लड़के द्वारा पुस्तक पढ़ी जाती है)।\n3. भाववाच्य: क्रिया का भाव मुख्य, अकर्मक क्रिया (मुझसे अब चला नहीं जाता)।";
      replyEnglish = "Kartrivachya is Active (subject agrees); Karmvachya is Passive (object agrees + 'by'); Bhavvachya is Impersonal (intransitive inability).";
      suggestedSentence = "स्मरण सूत्र: असमर्थता + अकर्मक क्रिया = भाववाच्य!";
    } else if (lower.includes('उपसर्ग') || lower.includes('प्रत्यय') || lower.includes('upsarg') || lower.includes('pratyay')) {
      replyHindi = "उपसर्ग और प्रत्यय शब्दांश होते हैं:\n• उपसर्ग: मूल शब्द के आरंभ (आगे) जुड़कर अर्थ बदलते हैं (अति + अंत = अत्यंत)।\n• प्रत्यय: मूल शब्द के अंत (पीछे) जुड़कर नया शब्द बनाते हैं (समाज + इक = सामाजिक)।";
      replyEnglish = "Prefixes (Upsarg) attach at the front; Suffixes (Pratyay) attach at the tail end of the root.";
      suggestedSentence = "स्मरण सूत्र: आगे लगे तो उपसर्ग, पीछे लगे तो प्रत्यय!";
    } else if (lower.includes('काल') || lower.includes('kaal') || lower.includes('भूत') || lower.includes('भविष्य')) {
      replyHindi = "काल क्रिया के समय को दर्शाता है:\n1. भूतकाल: बीता हुआ समय (गया, लिख रहा था, चुका था)।\n2. वर्तमान काल: चल रहा समय (पढ़ता है, जा रहा है)।\n3. भविष्यत् काल: आने वाला समय (जाएगा, पढ़ेगा)।";
      replyEnglish = "Kaal designates the temporal tense: Past (भूतकाल), Present (वर्तमान काल), and Future (भविष्यत् काल).";
      suggestedSentence = "स्मरण सूत्र: था/थे/थी = भूतकाल, है/हैं = वर्तमान, गा/गे/गी = भविष्यत्!";
    } else if (lower.includes('मुहावरा') || lower.includes('muhavara') || lower.includes('लोकोक्ति')) {
      replyHindi = "मुहावरा अपना सामान्य शाब्दिक अर्थ छोड़कर एक विशेष लाक्षणिक अर्थ देता है। जैसे 'आँखों का तारा' का अर्थ 'बहुत प्यारा' होता है, सचमुच का तारा नहीं।";
      replyEnglish = "Idioms convey figurative nuance rather than literal meaning.";
      suggestedSentence = "उदाहरण: 'रोहन अपनी दादी जी की आँखों का तारा है।'";
    } else if (lower.includes('संधि') || lower.includes('समास') || lower.includes('sandhi') || lower.includes('samas')) {
      replyHindi = "संधि और समास में मुख्य अंतर:\n• संधि: दो ध्वनियों/वर्णों का मेल होता है (सूर्य + उदय = सूर्योदय)।\n• समास: दो या अधिक पदों/शब्दों का संक्षिप्त मेल होता है (रसोई के लिए घर = रसोईघर)।";
      replyEnglish = "Sandhi is euphonic combination of phonemes; Samas is morphological compounding of words.";
      suggestedSentence = "स्मरण सूत्र: वर्णों का मेल = संधि, शब्दों का मेल = समास!";
    }

    return res.json({
      success: true,
      action,
      replyHindi,
      replyEnglish,
      suggestedSentence,
      modelUsed: 'offline-grammar-knowledge-engine'
    });
  }

  return res.status(400).json({ error: 'Unknown action' });
});

// 4B. Story Review & Spell Checker (वर्तनी सुधार एवं स्तर मूल्यांकन)
app.post('/api/ai/story-review-and-spelling', async (req: Request, res: Response) => {
  const {
    storyTitle = 'मेरी कहानी',
    storyContent = '',
    characterName = 'आरव',
    genre = 'साहसिक कथा',
    grade = 'कक्षा 8'
  } = req.body;

  const rawStory = (storyContent || '').trim();
  if (!rawStory) {
    return res.status(400).json({ error: 'Story content is required' });
  }

  const wordCount = rawStory.split(/\s+/).filter(Boolean).length;

  if (ai) {
    try {
      const prompt = `You are a distinguished Hindi literature teacher, grammarian, and creative writing mentor for school students.
A student wrote this entire Hindi story:
Title: "${storyTitle}"
Character: "${characterName}"
Genre: "${genre}"
Grade Level: "${grade}"

Story Text:
"""
${rawStory}
"""

YOUR TASK:
1. SPELL & GRAMMAR CHECK: Find all misspelled Hindi words, matra errors, conjunct errors, or grammatical slips.
Provide the original word, corrected word, issue type, and a clear explanation in Hindi and English.
2. CORRECTED STORY: Provide the complete corrected story with all spelling/grammatical errors resolved and proper punctuation (पूर्णविराम '।', अल्पविराम ',', उद्धरण चिह्न '“ ”').
3. STORY LEVEL & REVIEW:
Evaluate the story's overall quality, creativity, vocabulary, and plot flow.
Determine the student's proficiency level:
  - "master" (श्रेष्ठ रचनाकार - Master Storyteller): Exceptional flow, rich vocabulary, captivating plot. Award 15 WordCoins.
  - "advanced" (दक्ष कथाकार - Advanced Storyteller): Very good structure, clear plot, few minor errors. Award 12 WordCoins.
  - "intermediate" (मध्यम स्तर - Intermediate): Decent storyline, understandable, some room for better descriptions. Award 8 WordCoins.
  - "beginner" (आरंभिक स्तर - Beginner): Short or developing story, needs more descriptive sentences. Award 5 WordCoins.

Return JSON ONLY matching this exact structure:
{
  "spellingCorrections": [
    {
      "originalWord": "गलत शब्द",
      "correctedWord": "शुद्ध शब्द",
      "issueType": "वर्तनी (Spelling)" | "मात्रा (Vowel mark)" | "व्याकरण (Grammar)" | "विराम चिह्न (Punctuation)",
      "explanationHindi": "यहाँ '...' की जगह '...' होना चाहिए क्योंकि...",
      "explanationEnglish": "Detailed explanation of the rule applied."
    }
  ],
  "correctedStory": "Full corrected story text in Hindi...",
  "storyReview": {
    "overallScore": 88,
    "level": "दक्ष कथाकार (Advanced Storyteller)",
    "levelRank": "advanced",
    "coinsAwarded": 12,
    "feedbackHindi": "सहानुभूतिपूर्ण और उत्साहवर्धक टिप्पणी...",
    "feedbackEnglish": "Encouraging pedagogical review...",
    "strengthsHindi": [
      "रोचक कथानक और पात्र का साहसिक चित्रण",
      "सरल और प्रभावोत्पादक भाषा शैली"
    ],
    "strengthsEnglish": [
      "Engaging plot and dynamic character portrayal",
      "Clean and lucid sentence construction"
    ],
    "improvementTipsHindi": [
      "संवादों में अल्पविराम (,) का अधिक सटीक प्रयोग करें",
      "दृश्य वर्णन को थोड़ा और विस्तार दे सकते हैं"
    ],
    "improvementTipsEnglish": [
      "Use commas more precisely in dialogues",
      "Add sensory descriptions of the surroundings"
    ],
    "criteriaScores": {
      "plotFlow": 9,
      "vocabulary": 8,
      "grammarSpelling": 9,
      "creativity": 9
    }
  }
}`;

      const parsed = await generateJsonFast(prompt, undefined, 18000);
      if (parsed && parsed.storyReview && parsed.correctedStory) {
        return res.json({
          success: true,
          spellingCorrections: Array.isArray(parsed.spellingCorrections) ? parsed.spellingCorrections : [],
          correctedStory: parsed.correctedStory,
          storyReview: parsed.storyReview
        });
      }
    } catch (e: any) {
      logAiFallback('story-review-and-spelling', e);
    }
  }

  // Robust, intelligent offline fallback evaluator
  const commonMisspellings: Record<string, { correct: string; type: string; expHindi: string; expEnglish: string }> = {
    'क्युंकी': { correct: 'क्योंकि', type: 'वर्तनी (Spelling)', expHindi: "हिंदी वर्तनी में 'क्युंकी' अशुद्ध है, शुद्ध रूप 'क्योंकि' होता है।", expEnglish: "Standard Hindi spelling is 'क्योंकि'." },
    'क्युकी': { correct: 'क्योंकि', type: 'वर्तनी (Spelling)', expHindi: "हिंदी वर्तनी में 'क्युकी' अशुद्ध है, शुद्ध रूप 'क्योंकि' होता है।", expEnglish: "Standard Hindi spelling is 'क्योंकि'." },
    'क्रपा': { correct: 'कृपा', type: 'मात्रा (Vowel mark)', expHindi: "यहाँ 'ऋ' की मात्रा प्रयुक्त होगी, अतः 'कृपा' शुद्ध है।", expEnglish: "Uses Ri-kar matra, hence 'कृपा'." },
    'दिवार': { correct: 'दीवार', type: 'मात्रा (Vowel mark)', expHindi: "'दीवार' में दीर्घ 'ई' की मात्रा लगती है।", expEnglish: "Requires long 'ee' vowel marker." },
    'श्रीमान': { correct: 'श्रीमान्', type: 'व्याकरण (Grammar)', expHindi: "मानक हिंदी में हलंत युक्त 'श्रीमान्' या सरल 'श्रीमान' मान्य है।", expEnglish: "Halant form 'श्रीमान्' is formally preferred." },
    'त्यौहार': { correct: 'त्योहार', type: 'मात्रा (Vowel mark)', expHindi: "केंद्रीय हिंदी निदेशालय के अनुसार 'त्योहार' (एक मात्रा) शुद्ध है।", expEnglish: "Single matra 'त्योहार' is official ICSE standard." },
    'श्रीमति': { correct: 'श्रीमती', type: 'मात्रा (Vowel mark)', expHindi: "'श्रीमती' के अंत में दीर्घ 'ई' की मात्रा आती है।", expEnglish: "Feminine suffix carries long 'ee'." },
    'उज्जवल': { correct: 'उज्ज्वल', type: 'वर्तनी (Spelling)', expHindi: "'उज्ज्वल' में दोनों 'ज' आधे (द्वित्व) होते हैं: उत् + ज्वल = उज्ज्वल।", expEnglish: "Both 'ja' consonants are half (उज्ज्वल)." },
    'आर्शीवाद': { correct: 'आशीर्वाद', type: 'वर्तनी (Spelling)', expHindi: "रेफ (र्) का उच्चारण 'शी' के बाद होता है, अतः 'आशीर्वाद' शुद्ध है।", expEnglish: "Ref mark sits on 'वा', forming 'आशीर्वाद'." },
    'कविइत्री': { correct: 'कवयित्री', type: 'वर्तनी (Spelling)', expHindi: "'कवि' का स्त्रीलिंग 'कवयित्री' होता है न कि कविइत्री।", expEnglish: "Feminine form of kavi is strictly 'कवयित्री'." },
    'गयाथा': { correct: 'गया था', type: 'विराम चिह्न (Punctuation)', expHindi: "मुख्य क्रिया और सहायक क्रिया के बीच रिक्त स्थान (space) होना चाहिए।", expEnglish: "Requires spacing between main and auxiliary verbs." }
  };

  const detectedCorrections: Array<{
    originalWord: string;
    correctedWord: string;
    issueType: string;
    explanationHindi: string;
    explanationEnglish: string;
  }> = [];

  let patchedStory = rawStory;
  Object.entries(commonMisspellings).forEach(([badWord, fix]) => {
    if (rawStory.includes(badWord)) {
      detectedCorrections.push({
        originalWord: badWord,
        correctedWord: fix.correct,
        issueType: fix.type,
        explanationHindi: fix.expHindi,
        explanationEnglish: fix.expEnglish
      });
      patchedStory = patchedStory.split(badWord).join(fix.correct);
    }
  });

  // Ensure full stop ends sentences
  if (!patchedStory.endsWith('।') && !patchedStory.endsWith('.')) {
    patchedStory += '।';
  }

  // Determine Level according to word count & structure
  let levelRank = 'intermediate';
  let level = 'मध्यम स्तर (Intermediate)';
  let coinsAwarded = 8;
  let overallScore = 75;

  if (wordCount >= 100) {
    levelRank = 'master';
    level = 'श्रेष्ठ रचनाकार (Master Storyteller)';
    coinsAwarded = 15;
    overallScore = 95;
  } else if (wordCount >= 50) {
    levelRank = 'advanced';
    level = 'दक्ष कथाकार (Advanced Storyteller)';
    coinsAwarded = 12;
    overallScore = 88;
  } else if (wordCount >= 25) {
    levelRank = 'intermediate';
    level = 'मध्यम स्तर (Intermediate)';
    coinsAwarded = 8;
    overallScore = 76;
  } else {
    levelRank = 'beginner';
    level = 'आरंभिक स्तर (Beginner)';
    coinsAwarded = 5;
    overallScore = 65;
  }

  return res.json({
    success: true,
    spellingCorrections: detectedCorrections,
    correctedStory: patchedStory,
    storyReview: {
      overallScore,
      level,
      levelRank,
      coinsAwarded,
      feedbackHindi: `शानदार प्रयास! आपकी कहानी में कल्पनाशीलता और सरलता का अद्भुत संतुलन है। ${characterName} का चरित्र बहुत आकर्षक ढंग से प्रस्तुत किया गया है।`,
      feedbackEnglish: `Remarkable effort! Your storytelling balances vibrant imagination with clear, natural expressions. ${characterName} shines brightly.`,
      strengthsHindi: [
        `कथा का प्रवाह सहज और पठनीय है (${wordCount} शब्द)`,
        'पात्र की भावनाओं और परिस्थितियों का सजीव चित्रण',
        'सरल और स्वाभाविक हिंदी शब्दावली का प्रयोग'
      ],
      strengthsEnglish: [
        `Fluid narrative progression (${wordCount} words written)`,
        'Vivid rendering of character actions and feelings',
        'Consistent and natural Hindi diction'
      ],
      improvementTipsHindi: [
        'कहानी में संवादों के बाद पूर्णविराम (।) का ध्यान रखें',
        'वर्णनों में थोड़े और विशेषण जोड़कर दृश्य को और सजीव बना सकते हैं'
      ],
      improvementTipsEnglish: [
        'Maintain accurate terminal punctuation after spoken dialogue',
        'Incorporate more sensory adjectives to enrich scene imagery'
      ],
      criteriaScores: {
        plotFlow: Math.min(10, Math.max(6, Math.round(overallScore / 10))),
        vocabulary: Math.min(10, Math.max(7, Math.round((overallScore - 4) / 10))),
        grammarSpelling: detectedCorrections.length === 0 ? 10 : Math.max(7, 10 - detectedCorrections.length),
        creativity: Math.min(10, Math.max(7, Math.round(overallScore / 10)))
      }
    }
  });
});

// 5. Apathit Gadyansh Topic-Based Generator
app.post('/api/ai/gadyansh-generate', async (req: Request, res: Response) => {
  const { topic = 'पर्यावरण और प्रकृति संरक्षण', grade = 'कक्षा 8', difficulty = 'medium' } = req.body;
  const cleanTopic = String(topic || '').trim();
  if (!cleanTopic) {
    return res.status(400).json({ error: 'कृपया गद्यांश तैयार करने के लिए कोई विषय लिखें।' });
  }

  const diffLabel = difficulty === 'easy' ? 'सरल (Easy)' : difficulty === 'very_hard' ? 'अत्यंत कठिन (Very Hard)' : 'मध्यम (Medium)';
  const diffInstructions = difficulty === 'easy'
    ? 'Difficulty Level: Easy (सरल). Use clear, lucid everyday Hindi vocabulary suitable for beginners/middle school across 3 short paragraphs (~180-230 words).'
    : difficulty === 'very_hard'
    ? 'Difficulty Level: Very Hard (अत्यंत कठिन). Use rich literary Sanskritized (तत्सम) vocabulary and analytical depth across 3 paragraphs (~230-290 words).'
    : 'Difficulty Level: Medium (मध्यम). Use standard literary Hindi with engaging examples across 3 paragraphs (~200-260 words).';

  if (!ai) {
    return res.status(503).json({
      error: 'एआई गद्यांश सेवा अभी उपलब्ध नहीं है। कृपया कुछ क्षण बाद पुनः प्रयास करें।',
    });
  }

  const prompt = `You are a distinguished Hindi literature teacher and curriculum designer for ShabdShilp (${grade}, ICSE).
A student typed this custom topic (it may be in English, Hinglish, or Hindi Devanagari): "${cleanTopic}".
Understand the student's topic deeply and write a genuinely meaningful, informative, topic-specific Hindi Reading Comprehension Passage (अपठित गद्यांश) about "${cleanTopic}".
NEVER write generic filler—every paragraph, fact, example, and question must directly revolve around "${cleanTopic}".
${diffInstructions}

REQUIREMENTS:
1. "titleHindi": Engaging, specific Hindi title directly about "${cleanTopic}".
2. "titleEnglish": English translation of the title.
3. "theme": Short category tag in Hindi (1-3 words).
4. "passageHindi": A genuine, well-structured 3-paragraph Hindi passage strictly about "${cleanTopic}".
5. "hindiSummary": A concise 2-3 sentence Hindi summary (संक्षिप्त हिंदी सारांश) capturing the essence of this passage. Write strictly in Hindi.
6. "relatedStoryHindi": A concise 1-paragraph inspiring Hindi mini-story directly connected to "${cleanTopic}".
7. "vocabularyList": Exactly 4 important words taken directly from your passage with Hindi and English meanings.
8. "questions": Exactly 5 distinct comprehension MCQs strictly based on facts, inference, vocabulary, grammar, and central idea of THIS passage. Each question must have 1 correct Hindi answer, 3 distinct plausible wrong Hindi answers, and concise Hindi + English explanations.
9. "shortQuestions": Exactly 2 concise short-answer comprehension questions (answerable in 1-2 lines directly from THIS passage). Each must include "questionHindi", "questionEnglish", "sampleAnswerHindi" (1-2 lines in Hindi), and "sampleAnswerEnglish" (1-2 lines in English).`;

  try {
    const parsed = await generateJsonFast(
      prompt,
      {
        type: Type.OBJECT,
        properties: {
          titleHindi: { type: Type.STRING },
          titleEnglish: { type: Type.STRING },
          theme: { type: Type.STRING },
          passageHindi: { type: Type.STRING },
          hindiSummary: { type: Type.STRING },
          relatedStoryHindi: { type: Type.STRING },
          vocabularyList: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                word: { type: Type.STRING },
                meaningHindi: { type: Type.STRING },
                meaningEnglish: { type: Type.STRING },
              },
              required: ['word', 'meaningHindi', 'meaningEnglish'],
            },
          },
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                questionHindi: { type: Type.STRING },
                questionEnglish: { type: Type.STRING },
                correctAnswerHindi: { type: Type.STRING },
                correctAnswerEnglish: { type: Type.STRING },
                wrongAnswersHindi: { type: Type.ARRAY, items: { type: Type.STRING } },
                wrongAnswersEnglish: { type: Type.ARRAY, items: { type: Type.STRING } },
                explanationHindi: { type: Type.STRING },
                explanationEnglish: { type: Type.STRING },
              },
              required: [
                'questionHindi',
                'questionEnglish',
                'correctAnswerHindi',
                'wrongAnswersHindi',
                'explanationHindi',
                'explanationEnglish',
              ],
            },
          },
          shortQuestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                questionHindi: { type: Type.STRING },
                questionEnglish: { type: Type.STRING },
                sampleAnswerHindi: { type: Type.STRING },
                sampleAnswerEnglish: { type: Type.STRING },
              },
              required: [
                'questionHindi',
                'questionEnglish',
                'sampleAnswerHindi',
                'sampleAnswerEnglish',
              ],
            },
          },
        },
        required: [
          'titleHindi',
          'titleEnglish',
          'theme',
          'passageHindi',
          'hindiSummary',
          'relatedStoryHindi',
          'vocabularyList',
          'questions',
          'shortQuestions',
        ],
      },
      24000
    );

    if (parsed && parsed.passageHindi && Array.isArray(parsed.questions) && parsed.questions.length >= 4) {
      const formattedQuestions = parsed.questions
        .map((q: any, idx: number) => {
          const wrongsH = Array.isArray(q.wrongAnswersHindi) ? q.wrongAnswersHindi.slice(0, 3) : [];
          if (!q.questionHindi || !q.correctAnswerHindi || wrongsH.length < 3) return null;
          const wrongsE = Array.isArray(q.wrongAnswersEnglish) ? q.wrongAnswersEnglish : [];
          return {
            id: `cq_${idx + 1}_${Date.now()}`,
            topicId: 'comprehension',
            topicNameHindi: 'अपठित गद्यांश',
            topicNameEnglish: 'Reading Comprehension',
            questionHindi: String(q.questionHindi).trim(),
            questionEnglish: String(q.questionEnglish || q.questionHindi).trim(),
            options: buildUniformOptions(
              String(q.correctAnswerHindi),
              wrongsH.map(String),
              q.correctAnswerEnglish,
              wrongsE
            ),
            correctIndex: 0,
            explanationHindi: String(q.explanationHindi || ''),
            explanationEnglish: String(q.explanationEnglish || ''),
          };
        })
        .filter(Boolean);

      if (formattedQuestions.length >= 4) {
        const formattedShortQuestions = Array.isArray(parsed.shortQuestions)
          ? parsed.shortQuestions
              .slice(0, 3)
              .map((sq: any, idx: number) => {
                if (!sq?.questionHindi || !sq?.sampleAnswerHindi) return null;
                return {
                  id: `csq_${idx + 1}_${Date.now()}`,
                  topicId: 'comprehension',
                  topicNameHindi: 'अपठित गद्यांश',
                  topicNameEnglish: 'Reading Comprehension',
                  questionHindi: String(sq.questionHindi).trim(),
                  questionEnglish: String(sq.questionEnglish || sq.questionHindi).trim(),
                  sampleAnswerHindi: String(sq.sampleAnswerHindi).trim(),
                  sampleAnswerEnglish: String(sq.sampleAnswerEnglish || sq.sampleAnswerHindi).trim(),
                };
              })
              .filter(Boolean)
          : [];

        return res.json({
          id: `custom_${Date.now()}`,
          titleHindi: String(parsed.titleHindi || cleanTopic),
          titleEnglish: String(parsed.titleEnglish || cleanTopic),
          theme: String(parsed.theme || cleanTopic),
          difficulty: difficulty === 'very_hard' ? 'hard' : difficulty,
          difficultyLabelHindi: diffLabel,
          gradeLevel: grade,
          passageHindi: String(parsed.passageHindi).trim(),
          hindiSummary: String(parsed.hindiSummary || '').trim(),
          englishSummary: String(parsed.hindiSummary || '').trim(),
          relatedStoryHindi: String(parsed.relatedStoryHindi || '').trim(),
          vocabularyList: Array.isArray(parsed.vocabularyList) ? parsed.vocabularyList.slice(0, 6) : [],
          questions: balanceServerQuestions(formattedQuestions),
          shortQuestions: formattedShortQuestions,
        });
      }
    }
  } catch (err: any) {
    if (isAuthOrConfigError(err)) {
      console.error('AI gadyansh-generate config error:', err?.message);
    } else {
      logAiFallback('gadyansh-generate', err);
    }
  }

  return res.status(503).json({
    error: 'गद्यांश तैयार करने में अस्थायी समस्या आई। कृपया कुछ क्षण बाद पुनः प्रयास करें।',
  });
});

// 6. Apathit Gadyansh (Reading Comprehension) with Deterministic Score Tracking & Skill Analysis
app.post('/api/ai/gadyansh-evaluate', async (req: Request, res: Response) => {
  const { passageTitle = '', userAnswers = {}, questions = [] } = req.body;
  const safeQuestions = Array.isArray(questions) ? questions : [];

  let correctCount = 0;
  let attemptedCount = 0;

  const questionFeedback = safeQuestions.map((q: any) => {
    const rawChoice = userAnswers?.[q.id];
    const isAnswered = typeof rawChoice === 'number' && !Number.isNaN(rawChoice);
    if (isAnswered) attemptedCount++;
    const isCorrect = isAnswered && rawChoice === q.correctIndex;
    if (isCorrect) correctCount++;

    return {
      questionId: q.id,
      isAnswered,
      isCorrect,
      explanationHindi: q.explanationHindi || 'गद्यांश के मुख्य विचार के आधार पर यह विकल्प सबसे उपयुक्त है।',
      explanationEnglish: q.explanationEnglish || 'This option is best aligned with the passage context.',
    };
  });

  const total = safeQuestions.length;
  const unansweredCount = Math.max(0, total - attemptedCount);
  const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  const computeSkillPct = (regex: RegExp): number => {
    const matching = safeQuestions.filter((q: any) =>
      regex.test(`${q.questionHindi || ''} ${q.questionEnglish || ''}`.toLowerCase())
    );
    const pool = matching.length > 0 ? matching : safeQuestions;
    if (pool.length === 0) return 0;
    const poolCorrect = pool.filter((q: any) => {
      const choice = userAnswers?.[q.id];
      return typeof choice === 'number' && choice === q.correctIndex;
    }).length;
    return Math.round((poolCorrect / pool.length) * 100);
  };

  const performanceBadgeHindi =
    percentage >= 80
      ? 'गद्यांश पारखी (Comprehension Prodigy)'
      : percentage >= 50
      ? 'सजग पाठक (Attentive Reader)'
      : 'अभ्यास आवश्यक (Needs Careful Reading)';

  const feedbackHindi =
    unansweredCount > 0
      ? `आपने ${total} में से ${attemptedCount} प्रश्न हल किए (${unansweredCount} अनुत्तरित रहे) और ${correctCount} उत्तर सही रहे (${percentage}%)। सटीक मूल्यांकन के लिए सभी प्रश्नों का उत्तर दें।`
      : `आपने "${passageTitle}" के ${total} में से ${correctCount} प्रश्नों के सही उत्तर दिए (${percentage}%)।`;

  const feedbackEnglish =
    unansweredCount > 0
      ? `You attempted ${attemptedCount} out of ${total} questions (${unansweredCount} skipped) and got ${correctCount} correct (${percentage}%). Attempt every question for a complete assessment.`
      : `You answered ${correctCount} out of ${total} questions correctly (${percentage}%).`;

  return res.json({
    totalScore: correctCount,
    maxScore: total,
    attemptedCount,
    unansweredCount,
    percentage,
    performanceBadgeHindi,
    feedbackHindi,
    feedbackEnglish,
    questionFeedback,
    comprehensionSkillMetrics: {
      vocabulary: computeSkillPct(/अर्थ|पर्याय|विलोम|शब्द|meaning|synonym|antonym|vocab|उपसर्ग|प्रत्यय|संधि/),
      inference: computeSkillPct(/निष्कर्ष|आशय|क्यों|अनुमान|तात्पर्य|infer|why|reason|imply/),
      centralIdea: computeSkillPct(/शीर्षक|केंद्रीय|संदेश|सीख|सारांश|शैली|title|central|moral|theme|tone/),
      speed: attemptedCount > 0 ? Math.round((attemptedCount / Math.max(1, total)) * 100) : 0,
    },
    improvementRoadmapHindi:
      unansweredCount > 0
        ? 'अगली बार कोई प्रश्न न छोड़ें — गद्यांश की संबंधित पंक्तियों को दोबारा पढ़कर सभी प्रश्नों का उत्तर दें।'
        : 'कठिन शब्दों के संदर्भगत अर्थ (contextual meaning) पर ध्यान दें और मुख्य पंक्तियों को रेखांकित करें।',
    improvementRoadmapEnglish:
      unansweredCount > 0
        ? 'Avoid leaving questions blank—re-read the relevant lines in the passage and attempt all items.'
        : 'Pay attention to contextual meanings of unfamiliar words and underline core topic sentences.',
  });
});

// 6b. Auto-Translate Student's English Short Answer to Hindi Devanagari
app.post('/api/ai/gadyansh-translate', async (req: Request, res: Response) => {
  const { englishText = '', passageTitle = '', questionHindi = '' } = req.body;
  const cleanText = String(englishText || '').trim();

  if (cleanText.length < 2) {
    return res.status(400).json({
      error: 'अनुवाद के लिए कृपया कम से कम एक सार्थक शब्द या वाक्य लिखें।',
    });
  }

  if (!ai) {
    return res.status(503).json({
      error: 'एआई अनुवाद सेवा अभी उपलब्ध नहीं है। कृपया कुछ क्षण बाद पुनः प्रयास करें।',
    });
  }

  try {
    const prompt = `You are a precise bilingual English-to-Hindi translator for a school reading comprehension exercise.
Context Passage Title: "${String(passageTitle || '').trim()}"
Question Being Answered: "${String(questionHindi || '').trim()}"
Student's Answer (written in English or Hinglish):
"""
${cleanText}
"""

TASK:
Translate the student's text accurately and faithfully into natural Hindi Devanagari ("hindiTranslation").
- Preserve the EXACT meaning of what the student wrote—do NOT correct factual mistakes or add missing information during translation.
- If the text is already Hindi, keep/normalize it cleanly in Devanagari.`;

    const parsed = await generateJsonFast(
      prompt,
      {
        type: Type.OBJECT,
        properties: {
          hindiTranslation: { type: Type.STRING },
        },
        required: ['hindiTranslation'],
      },
      12000
    );

    if (!parsed || !parsed.hindiTranslation) {
      throw new Error('Incomplete AI translation response');
    }

    return res.json({
      hindiTranslation: String(parsed.hindiTranslation).trim(),
    });
  } catch (err: any) {
    if (isAuthOrConfigError(err)) {
      console.error('AI gadyansh-translate config error:', err?.message);
    } else {
      logAiFallback('gadyansh-translate', err);
    }
    return res.status(503).json({
      error: 'हिंदी अनुवाद करने में अस्थायी समस्या आई। कृपया पुनः प्रयास करें।',
    });
  }
});

// 6c. Auto-Translate + AI Review for 1-2 Line Comprehension Short Answers
app.post('/api/ai/gadyansh-short-review', async (req: Request, res: Response) => {
  const {
    passageTitle = '',
    passageHindi = '',
    grade = 'कक्षा 8',
    questionHindi = '',
    questionEnglish = '',
    expectedAnswerHindi = '',
    expectedAnswerEnglish = '',
    studentEnglishAnswer = '',
  } = req.body;

  const cleanAnswer = String(studentEnglishAnswer || '').trim();
  if (cleanAnswer.length < 2) {
    return res.status(400).json({
      error: 'कृपया पहले अपना उत्तर अंग्रेज़ी में 1–2 पंक्तियों में लिखें। (Please write your 1–2 line answer in English first.)',
    });
  }

  if (!ai) {
    return res.status(503).json({
      error: 'एआई समीक्षा सेवा अभी उपलब्ध नहीं है। कृपया कुछ क्षण बाद पुनः प्रयास करें।',
    });
  }

  try {
    const prompt = `You are a thorough, encouraging Hindi teacher (${grade}, ICSE Board) evaluating a student's 1-2 line short comprehension answer.
Passage Title: "${String(passageTitle).trim()}"
Passage (Hindi):
"""
${String(passageHindi).trim()}
"""

Question (Hindi): "${String(questionHindi).trim()}"
Question (English): "${String(questionEnglish).trim()}"
Reference Answer (Hindi): "${String(expectedAnswerHindi).trim()}"
Reference Answer (English): "${String(expectedAnswerEnglish).trim()}"

Student's Answer (typed in English or Hinglish):
"""
${cleanAnswer}
"""

YOUR TASKS:
1. "hindiTranslation": Faithfully translate what the student actually wrote into natural Hindi Devanagari WITHOUT altering or fixing their facts.
2. Check whether the student's answer accurately and completely answers the question based strictly on the passage:
   - "status": "correct" (captures key idea accurately), "partial" (partially right or misses an important point from the passage), or "incorrect" (wrong facts, irrelevant, gibberish, or off-topic).
   - "isCorrect": true ONLY if status === "correct".
3. "whatWasWrongHindi" & "whatWasWrongEnglish":
   - If status is "incorrect" or "partial": clearly and specifically explain what the student wrote wrong, misunderstood, or missed compared to the passage (in 1-2 clear sentences).
   - If status is "correct": briefly confirm why the student's answer is right and well-grounded in the passage.
4. "correctAnswerHindi" & "correctAnswerEnglish":
   - Provide the exact, ideal 1-2 line answer directly supported by the passage in clear Hindi and English.`;

    const parsed = await generateJsonFast(
      prompt,
      {
        type: Type.OBJECT,
        properties: {
          hindiTranslation: { type: Type.STRING },
          status: { type: Type.STRING },
          isCorrect: { type: Type.BOOLEAN },
          whatWasWrongHindi: { type: Type.STRING },
          whatWasWrongEnglish: { type: Type.STRING },
          correctAnswerHindi: { type: Type.STRING },
          correctAnswerEnglish: { type: Type.STRING },
        },
        required: [
          'hindiTranslation',
          'status',
          'isCorrect',
          'whatWasWrongHindi',
          'whatWasWrongEnglish',
          'correctAnswerHindi',
          'correctAnswerEnglish',
        ],
      },
      18000
    );

    if (!parsed || !parsed.hindiTranslation || !parsed.correctAnswerHindi) {
      throw new Error('Incomplete AI review response');
    }

    const rawStatus = String(parsed.status || '').toLowerCase();
    const status: 'correct' | 'partial' | 'incorrect' =
      rawStatus === 'correct' ? 'correct' : rawStatus === 'partial' ? 'partial' : 'incorrect';
    const isCorrect = status === 'correct';
    const score = status === 'correct' ? 2 : status === 'partial' ? 1 : 0;

    return res.json({
      hindiTranslation: String(parsed.hindiTranslation).trim(),
      status,
      isCorrect,
      score,
      whatWasWrongHindi: String(parsed.whatWasWrongHindi || '').trim(),
      whatWasWrongEnglish: String(parsed.whatWasWrongEnglish || '').trim(),
      correctAnswerHindi: String(parsed.correctAnswerHindi).trim(),
      correctAnswerEnglish: String(parsed.correctAnswerEnglish || '').trim(),
    });
  } catch (err: any) {
    if (isAuthOrConfigError(err)) {
      console.error('AI gadyansh-short-review config error:', err?.message);
    } else {
      logAiFallback('gadyansh-short-review', err);
    }
    return res.status(503).json({
      error: 'लघु उत्तर की एआई समीक्षा करने में अस्थायी समस्या आई। कृपया पुनः प्रयास करें।',
    });
  }
});

// 6. Time Travel Machine - Future Strategic Roadmap Generator
app.post('/api/ai/time-travel-future', async (req: Request, res: Response) => {
  const { currentScore, weakTopicsMastered, grade = '8', wordCoins = 0 } = req.body;

  if (ai) {
    try {
      const prompt = `You are the Time Machine Oracle (काल-चक्र परामर्शदाता) of ShabdShilp Hindi Grammar OS.
A student in Grade ${grade} has:
- Current overall grammar mastery: ${currentScore}%
- Mastered topics: ${JSON.stringify(weakTopicsMastered || ['कारक', 'काल', 'उपसर्ग'])}
- WordCoins accumulated: ${wordCoins}

Project their FUTURE academic trajectory and recommend personalized roadmap strategies to maintain long-term academic excellence and score 100/100 in school/board exams.

Return ONLY JSON:
{
  "projectedScoreNextTerm": 98,
  "boardReadinessIndex": "A+ (उत्कृष्ट)",
  "futureHorizonTitleHindi": "भविष्य का मार्ग: 100/100 का स्वर्णिम लक्ष्य",
  "futureHorizonTitleEnglish": "Future Roadmap: The Golden Goal of 100/100",
  "strategicRoadmap": [
    {
      "milestone": "अगले 15 दिन (Next 15 Days)",
      "goalHindi": "संधि व समास के जटिल भेदों पर महारत",
      "goalEnglish": "Master complex Sandhi & Samas combinations",
      "weeklyRoutine": "20 मिनट प्रतिदिन ShabdShilp सिमुलेशन"
    },
    {
      "milestone": "परीक्षा पूर्व माह (Pre-Exam Month)",
      "goalHindi": "स्पीडशीट व अपठित गद्यांश में 100% सटीकता",
      "goalEnglish": "100% precision in SpeedSheets and Unseen Comprehension",
      "weeklyRoutine": "सप्ताहांत में 1 पूर्ण मॉक टेस्ट"
    },
    {
      "milestone": "वार्षिक परीक्षा (Final Board Exam)",
      "goalHindi": "व्याकरण खंड में शून्य अंक कटना",
      "goalEnglish": "Zero marks deducted in Hindi grammar section",
      "weeklyRoutine": "रिवीजन एवं कमजोर बिंदुओं का पुनः परीक्षण"
    }
  ],
  "futurePerks": [
    "कक्षा में व्याकरण मॉनिटर का गौरव",
    "शब्दशिल्प राष्ट्रीय छात्रवृत्ति हॉल ऑफ फेम",
    "साहित्य व निबंध लेखन में स्वाभाविक निपुणता"
  ]
}`;

      const parsed = await generateJsonFast(prompt, undefined, 16000);
      if (parsed) return res.json(parsed);
    } catch (err: any) {
      logAiFallback('time-travel-future', err);
    }
  }

  return res.json({
    projectedScoreNextTerm: 98,
    boardReadinessIndex: 'A+ (उत्कृष्ट - Top 1%)',
    futureHorizonTitleHindi: 'भविष्य का मार्ग: 100/100 का स्वर्णिम लक्ष्य (Future Roadmap)',
    futureHorizonTitleEnglish: 'Future Horizon: The Golden Goal of 100/100 in Hindi Grammar',
    strategicRoadmap: [
      {
        milestone: 'चरण 1: अगले 15 दिन (Phase 1: Next 15 Days)',
        goalHindi: 'संधि व समास के जटिल भेदों पर पूर्ण पकड़ बनाना',
        goalEnglish: 'Master intricate Sandhi and Samas variations',
        weeklyRoutine: '15 मिनट प्रतिदिन ShabdShilp के साथ'
      },
      {
        milestone: 'चरण 2: परीक्षा पूर्व माह (Phase 2: Pre-Exam Month)',
        goalHindi: 'अनलॉक की गई विशेष वर्कशीट्स का समयबद्ध अभ्यास',
        goalEnglish: 'Timed practice of unlocked WordCoin worksheets',
        weeklyRoutine: 'सप्ताह में 2 बार अपठित गद्यांश हल करना'
      },
      {
        milestone: 'चरण 3: बोर्ड/वार्षिक परीक्षा (Phase 3: Final Exams)',
        goalHindi: 'व्याकरण खंड में पूरे 16/16 अंक अर्जित करना',
        goalEnglish: 'Score full 16/16 marks in Hindi Grammar Section',
        weeklyRoutine: 'टाइम मशीन प्रेजेंट व फ्यूचर चेकलिस्ट रिव्यू'
      }
    ],
    futurePerks: [
      'कक्षा में सर्वोच्च व्याकरण अंक (Class Topper Badge)',
      'शब्दशिल्प हॉल ऑफ फेम में स्थान (Hall of Fame Honor)',
      'हिंदी निबंध व साहित्य में सहज शुद्धता (Flawless Writing Flow)'
    ]
  });
});

const ALLOWED_WIKIMEDIA_HOSTS = new Set(['upload.wikimedia.org', 'thumb.wikimedia.org']);

function isAllowedWikimediaUrl(rawUrl: string): boolean {
  try {
    const parsed = new URL(rawUrl);
    return parsed.protocol === 'https:' && ALLOWED_WIKIMEDIA_HOSTS.has(parsed.hostname.toLowerCase());
  } catch {
    return false;
  }
}

function isCleanRasterPhotoUrl(rawUrl: string, titleHint = ''): boolean {
  if (!rawUrl || !isAllowedWikimediaUrl(rawUrl)) return false;
  const combined = `${rawUrl} ${titleHint}`.toLowerCase();
  if (/\.(svg|pdf|og[gv]|webm|tiff?|djvu|mid|mp3|wav)(\?|$)/i.test(rawUrl)) return false;
  if (/(commons-logo|wiktionary-logo|wiki_logo|disambig|flag_of_|coat_of_arms|map_of_|icon_|arrow|stub|ambox)/i.test(combined)) {
    return false;
  }
  return true;
}

function sanitizeSvgToDataUrl(rawSvg: string): string | null {
  if (!rawSvg || typeof rawSvg !== 'string') return null;
  let cleaned = rawSvg
    .trim()
    .replace(/^```(?:svg|xml)?\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();

  const startIdx = cleaned.indexOf('<svg');
  const endIdx = cleaned.lastIndexOf('</svg>');
  if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) return null;
  cleaned = cleaned.slice(startIdx, endIdx + 6);
  if (cleaned.length > 28000) return null;

  // Strip dangerous elements, inline handlers, and external references
  cleaned = cleaned
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    .replace(/<object[\s\S]*?<\/object>/gi, '')
    .replace(/<embed[\s\S]*?>/gi, '')
    .replace(/\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/(?:xlink:)?href\s*=\s*(?:"[^"]*https?:[^"]*"|'[^']*https?:[^']*')/gi, '')
    .replace(/javascript:/gi, '');

  if (!/\bxmlns\s*=/i.test(cleaned)) {
    cleaned = cleaned.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(cleaned)}`;
}

function escapeXmlSafe(str: string): string {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildFallbackVisualSvgDataUrl(
  hindiWord: string,
  englishMeaning: string,
  category: 'object' | 'emotion' | 'abstract'
): string {
  const safeHi = escapeXmlSafe((hindiWord || 'शब्द').slice(0, 28));
  const safeEn = escapeXmlSafe((englishMeaning || '').split(/[,;()]/)[0].trim().slice(0, 32));
  const hint = `${hindiWord} ${englishMeaning}`.toLowerCase();

  const isJoy = /(खुश|प्रसन्न|आनंद|उल्लास|हर्ष|happy|joy|delight|smile|cheer|glad)/.test(hint);
  const isPeace = /(शांति|अमन|चैन|सुकून|ध्यान|peace|calm|seren|tranquil)/.test(hint);
  const isLove = /(प्रेम|प्यार|स्नेह|दुलार|मित्र|दोस्त|love|affection|care|friend)/.test(hint);
  const isCourage = /(साहस|हिम्मत|वीर|मेहनत|परिश्रम|सपना|courage|brave|effort|work|dream|strength)/.test(hint);
  const isAnger = /(क्रोध|गुस्सा|रोष|भय|डर|anger|fury|fear|sad|दुख|शोक)/.test(hint);

  let bg1 = category === 'emotion' ? '#fff7ed' : category === 'object' ? '#f0f9ff' : '#eef2ff';
  let bg2 = category === 'emotion' ? '#fdf2f8' : category === 'object' ? '#ecfdf5' : '#f5f3ff';
  let c1 = category === 'emotion' ? '#f97316' : category === 'object' ? '#0ea5e9' : '#6366f1';
  let c2 = category === 'emotion' ? '#ec4899' : category === 'object' ? '#10b981' : '#8b5cf6';
  let sceneMarkup = '';

  if (isJoy) {
    bg1 = '#fef9c3';
    bg2 = '#ffedd5';
    c1 = '#f59e0b';
    c2 = '#f97316';
    sceneMarkup = `
    <g opacity="0.35">
      <line x1="240" y1="22" x2="240" y2="45" stroke="#f59e0b" stroke-width="5" stroke-linecap="round"/>
      <line x1="158" y1="45" x2="174" y2="62" stroke="#f59e0b" stroke-width="5" stroke-linecap="round"/>
      <line x1="322" y1="45" x2="306" y2="62" stroke="#f59e0b" stroke-width="5" stroke-linecap="round"/>
      <line x1="130" y1="115" x2="152" y2="115" stroke="#f59e0b" stroke-width="5" stroke-linecap="round"/>
      <line x1="328" y1="115" x2="350" y2="115" stroke="#f59e0b" stroke-width="5" stroke-linecap="round"/>
    </g>
    <circle cx="240" cy="116" r="56" fill="#fbbf24"/>
    <circle cx="240" cy="116" r="48" fill="#fde047"/>
    <circle cx="222" cy="105" r="5.5" fill="#78350f"/>
    <circle cx="258" cy="105" r="5.5" fill="#78350f"/>
    <circle cx="212" cy="122" r="7" fill="#fb7185" opacity="0.45"/>
    <circle cx="268" cy="122" r="7" fill="#fb7185" opacity="0.45"/>
    <path d="M218 124 Q240 148 262 124" fill="none" stroke="#78350f" stroke-width="5" stroke-linecap="round"/>
    <path d="M125 78 L130 90 L142 95 L130 100 L125 112 L120 100 L108 95 L120 90 Z" fill="#f97316" opacity="0.75"/>
    <path d="M356 68 L360 77 L369 81 L360 85 L356 94 L352 85 L343 81 L352 77 Z" fill="#ec4899" opacity="0.75"/>`;
  } else if (isPeace) {
    bg1 = '#ecfeff';
    bg2 = '#e0e7ff';
    c1 = '#06b6d4';
    c2 = '#6366f1';
    sceneMarkup = `
    <circle cx="240" cy="110" r="46" fill="#bae6fd" opacity="0.6"/>
    <path d="M90 170 Q165 154 240 170 T390 170" fill="none" stroke="#38bdf8" stroke-width="4" stroke-linecap="round" opacity="0.7"/>
    <path d="M120 184 Q180 172 240 184 T360 184" fill="none" stroke="#818cf8" stroke-width="3" stroke-linecap="round" opacity="0.6"/>
    <path d="M240 62 C258 92 258 126 240 144 C222 126 222 92 240 62 Z" fill="#f472b6"/>
    <path d="M240 144 C205 138 186 112 194 84 C216 96 232 118 240 144 Z" fill="#ec4899" opacity="0.85"/>
    <path d="M240 144 C275 138 294 112 286 84 C264 96 248 118 240 144 Z" fill="#ec4899" opacity="0.85"/>`;
  } else if (isLove) {
    bg1 = '#fff1f2';
    bg2 = '#fce7f3';
    c1 = '#f43f5e';
    c2 = '#ec4899';
    sceneMarkup = `
    <circle cx="240" cy="115" r="66" fill="#ffe4e6" opacity="0.8"/>
    <path d="M240 162 C240 162 178 124 178 88 C178 68 194 56 212 56 C225 56 235 63 240 74 C245 63 255 56 268 56 C286 56 302 68 302 88 C302 124 240 162 240 162 Z" fill="url(#orbGrad)"/>
    <circle cx="212" cy="84" r="8" fill="#ffffff" opacity="0.35"/>`;
  } else if (isCourage) {
    bg1 = '#fff7ed';
    bg2 = '#fef3c7';
    c1 = '#ea580c';
    c2 = '#f59e0b';
    sceneMarkup = `
    <circle cx="240" cy="96" r="42" fill="#fbbf24" opacity="0.88"/>
    <polygon points="105,176 205,86 285,176" fill="#475569"/>
    <polygon points="195,176 280,98 375,176" fill="#334155"/>
    <polygon points="205,86 183,108 202,104 214,112 225,104" fill="#f8fafc"/>`;
  } else if (isAnger) {
    bg1 = '#fef2f2';
    bg2 = '#f1f5f9';
    c1 = '#ef4444';
    c2 = '#64748b';
    sceneMarkup = `
    <path d="M165 112 A28 28 0 0 1 215 92 A34 34 0 0 1 280 96 A26 26 0 0 1 312 128 L168 128 A22 22 0 0 1 165 112 Z" fill="#64748b"/>
    <polygon points="246,128 228,154 244,154 232,182 266,144 248,144" fill="#f59e0b"/>`;
  } else {
    sceneMarkup = `
    <circle cx="240" cy="115" r="54" fill="url(#orbGrad)" opacity="0.92"/>
    <circle cx="240" cy="115" r="42" fill="#ffffff" opacity="0.18"/>
    <text x="240" y="127" text-anchor="middle" font-size="30" font-weight="700" fill="#ffffff" font-family="sans-serif">${safeHi}</text>`;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 280">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${bg1}"/>
      <stop offset="100%" stop-color="${bg2}"/>
    </linearGradient>
    <linearGradient id="orbGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="480" height="280" rx="20" fill="url(#bgGrad)"/>
  <circle cx="88" cy="58" r="44" fill="${c1}" opacity="0.14"/>
  <circle cx="395" cy="215" r="62" fill="${c2}" opacity="0.14"/>
  <path d="M0 222 Q120 180 240 212 T480 198 L480 280 L0 280 Z" fill="url(#orbGrad)" opacity="0.16"/>
  ${sceneMarkup}
  <text x="240" y="218" text-anchor="middle" font-size="22" font-weight="800" fill="#0f172a" font-family="sans-serif">${safeHi}</text>
  <text x="240" y="244" text-anchor="middle" font-size="14" font-weight="600" fill="#475569" font-family="sans-serif">${safeEn || safeHi}</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

async function fetchDirectWikimediaImage(queryTerms: string[]): Promise<{
  proxyUrl: string;
  sourceTitle: string;
} | null> {
  const uniqueTerms = Array.from(
    new Set(
      queryTerms
        .map((t) => String(t || '').trim())
        .filter((t) => t.length >= 2 && t.length <= 60)
    )
  ).slice(0, 3);

  const headers = {
    'User-Agent': 'ShabdShilpEducationalApp/1.0 (https://shabdshilp.com)',
    Accept: 'application/json',
  };

  for (const term of uniqueTerms) {
    // 1. Try Wikipedia REST summary thumbnail first (gives exact encyclopedic object photos)
    try {
      const slug = encodeURIComponent(term.replace(/\s+/g, '_'));
      const controller = new AbortController();
      const tId = setTimeout(() => controller.abort(), 4500);
      const wikiRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${slug}`, {
        headers,
        signal: controller.signal,
      });
      clearTimeout(tId);
      if (wikiRes.ok) {
        const data: any = await wikiRes.json();
        if (data?.type !== 'disambiguation') {
          const candidateUrl = data?.thumbnail?.source || data?.originalimage?.source;
          if (candidateUrl && isCleanRasterPhotoUrl(candidateUrl, data?.title || term)) {
            return {
              proxyUrl: `/api/ai/word-image-proxy?url=${encodeURIComponent(candidateUrl)}`,
              sourceTitle: String(data?.title || term),
            };
          }
        }
      }
    } catch {
      // Fall through to Wikimedia Commons search
    }

    // 2. Fallback to Wikimedia Commons file search
    try {
      const controller = new AbortController();
      const tId = setTimeout(() => controller.abort(), 5000);
      const commonsUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(
        term
      )}&gsrlimit=6&prop=imageinfo&iiprop=url|mime|size&iiurlwidth=640&format=json`;
      const commonsRes = await fetch(commonsUrl, { headers, signal: controller.signal });
      clearTimeout(tId);
      if (commonsRes.ok) {
        const data: any = await commonsRes.json();
        const pages = Object.values(data?.query?.pages || {}) as any[];
        pages.sort((a, b) => (a?.index ?? 99) - (b?.index ?? 99));
        for (const page of pages) {
          const info = page?.imageinfo?.[0];
          const mime = String(info?.mime || '').toLowerCase();
          if (!['image/jpeg', 'image/png', 'image/webp'].includes(mime)) continue;
          const imgUrl = info?.thumburl || info?.url;
          if (imgUrl && isCleanRasterPhotoUrl(imgUrl, page?.title || term)) {
            return {
              proxyUrl: `/api/ai/word-image-proxy?url=${encodeURIComponent(imgUrl)}`,
              sourceTitle: String(page?.title || term).replace(/^File:/i, ''),
            };
          }
        }
      }
    } catch {
      // Continue to next term
    }
  }
  return null;
}

async function generateAiSvgIllustration(
  hindiWord: string,
  englishMeaning: string,
  category: 'object' | 'emotion' | 'abstract'
): Promise<string | null> {
  if (!ai) return null;
  const prompt = `Create a clean, expressive, child-friendly 2D vector SVG illustration representing the ${category} word "${hindiWord}" (${englishMeaning}).
Rules:
- ViewBox MUST be "0 0 480 280".
- Keep it concise (under 20 SVG elements), using single quotes inside attributes where possible, rich warm gradients, expressive character/nature/emotion symbols that immediately evoke "${englishMeaning}" visually.
- Do NOT write large text labels across the illustration. Focus on pure visual storytelling.
- No scripts, no event attributes, no external URLs.
Return JSON: { "svgMarkup": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 280'>...</svg>" }`;

  try {
    const parsed = await generateJsonFast(
      prompt,
      {
        type: Type.OBJECT,
        properties: {
          svgMarkup: { type: Type.STRING },
        },
        required: ['svgMarkup'],
      },
      18000
    );
    if (parsed?.svgMarkup) {
      return sanitizeSvgToDataUrl(parsed.svgMarkup);
    }
  } catch (err) {
    logAiFallback('word-visual-svg', err);
  }
  return null;
}

async function resolveWordVisualPayload(opts: {
  rawWord: string;
  hindiWord: string;
  englishMeaning: string;
  visualCategory?: string;
  visualSearchTerm?: string;
  visualCaptionHindi?: string;
  visualCaptionEnglish?: string;
}): Promise<{
  visualCategory: 'object' | 'emotion' | 'abstract';
  visualImageUrl: string;
  visualFallbackUrl: string;
  visualSourceType: 'direct_photo' | 'ai_illustration';
  visualCaptionHindi: string;
  visualCaptionEnglish: string;
}> {
  const cleanCat: 'object' | 'emotion' | 'abstract' =
    opts.visualCategory === 'object'
      ? 'object'
      : opts.visualCategory === 'emotion'
      ? 'emotion'
      : 'abstract';

  const firstMeaningTerm = String(opts.englishMeaning || '')
    .split(/[,;/()]/)[0]
    .trim();
  const fallbackUrl = buildFallbackVisualSvgDataUrl(opts.hindiWord, opts.englishMeaning, cleanCat);

  const captionHi =
    opts.visualCaptionHindi?.trim() ||
    (cleanCat === 'object'
      ? `"${opts.hindiWord}" का प्रत्यक्ष चित्र`
      : `"${opts.hindiWord}" के भाव को दर्शाता चित्रण`);
  const captionEn =
    opts.visualCaptionEnglish?.trim() ||
    (cleanCat === 'object'
      ? `Direct image of ${firstMeaningTerm || opts.hindiWord}`
      : `Visual illustration representing ${firstMeaningTerm || opts.hindiWord}`);

  // 1. For concrete objects: fetch a direct real photograph first
  if (cleanCat === 'object') {
    const directImg = await fetchDirectWikimediaImage([
      opts.visualSearchTerm || '',
      firstMeaningTerm,
      opts.rawWord,
    ]);
    if (directImg) {
      return {
        visualCategory: 'object',
        visualImageUrl: directImg.proxyUrl,
        visualFallbackUrl: fallbackUrl,
        visualSourceType: 'direct_photo',
        visualCaptionHindi: captionHi,
        visualCaptionEnglish: captionEn,
      };
    }
  }

  // 2. For emotions/abstract ideas (or if Wikimedia had no photo for an obscure object): generate AI SVG artwork
  const aiSvgUrl = await generateAiSvgIllustration(opts.hindiWord, opts.englishMeaning, cleanCat);
  if (aiSvgUrl) {
    return {
      visualCategory: cleanCat,
      visualImageUrl: aiSvgUrl,
      visualFallbackUrl: fallbackUrl,
      visualSourceType: 'ai_illustration',
      visualCaptionHindi: captionHi,
      visualCaptionEnglish: captionEn,
    };
  }

  // 3. Only try Wikimedia for non-emotion abstract concepts; emotions always keep expressive illustrations
  if (cleanCat === 'abstract') {
    const symbolImg = await fetchDirectWikimediaImage([opts.visualSearchTerm || '', firstMeaningTerm]);
    if (symbolImg) {
      return {
        visualCategory: cleanCat,
        visualImageUrl: symbolImg.proxyUrl,
        visualFallbackUrl: fallbackUrl,
        visualSourceType: 'direct_photo',
        visualCaptionHindi: captionHi,
        visualCaptionEnglish: captionEn,
      };
    }
  }

  return {
    visualCategory: cleanCat,
    visualImageUrl: fallbackUrl,
    visualFallbackUrl: fallbackUrl,
    visualSourceType: 'ai_illustration',
    visualCaptionHindi: captionHi,
    visualCaptionEnglish: captionEn,
  };
}

// Same-origin strictly allowlisted image proxy for Wikimedia direct object photos
app.get('/api/ai/word-image-proxy', async (req: Request, res: Response) => {
  const rawUrl = typeof req.query.url === 'string' ? req.query.url.trim() : '';
  if (!rawUrl || !isAllowedWikimediaUrl(rawUrl)) {
    return res.status(400).json({ error: 'Invalid or unsupported image host.' });
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 7000);
    const upstream = await fetch(rawUrl, {
      headers: {
        'User-Agent': 'ShabdShilpEducationalApp/1.0 (https://shabdshilp.com)',
      },
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (!upstream.ok) {
      return res.status(502).json({ error: 'Upstream image fetch failed.' });
    }

    const contentType = (upstream.headers.get('content-type') || '').toLowerCase().split(';')[0];
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(contentType)) {
      return res.status(415).json({ error: 'Unsupported upstream media type.' });
    }

    const contentLength = Number(upstream.headers.get('content-length') || 0);
    if (contentLength > 5 * 1024 * 1024) {
      return res.status(413).json({ error: 'Image exceeds size limit.' });
    }

    const buf = Buffer.from(await upstream.arrayBuffer());
    if (buf.length > 5 * 1024 * 1024) {
      return res.status(413).json({ error: 'Image exceeds size limit.' });
    }

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.send(buf);
  } catch {
    return res.status(504).json({ error: 'Image proxy request timed out.' });
  }
});

// 7. Word Meaning Studio (Hinglish/Hindi/English to Bilingual Meanings + Direct Object Photo / Emotion Visual)
app.post('/api/ai/word-meaning', async (req: Request, res: Response) => {
  const { word = 'mehnat', grade = '8' } = req.body;
  const rawWord = (word || '').trim();
  if (!rawWord) {
    return res.status(400).json({ error: 'कृपया अर्थ जानने के लिए कोई शब्द लिखें।' });
  }

  const cacheKey = `word-meaning-v3:${rawWord.toLowerCase()}`;
  const cachedEntry = getCachedAiResult(cacheKey);
  if (cachedEntry) {
    return res.json(cachedEntry);
  }

  // Pre-populated curated offline dictionary with accurate visual hints for fallback/0ms cases
  const fallbackDict: Record<string, any> = {
    'mehnat': {
      hindiWord: 'मेहनत',
      hindiMeaning: 'कठिन परिश्रम, लगन से किया गया काम',
      englishMeaning: 'Hard work, effort, diligence',
      partOfSpeech: 'संज्ञा (Noun)',
      exampleHindi: 'सच्ची मेहनत और लगन से हर मुश्किल काम आसान हो जाता है।',
      exampleEnglish: 'With true hard work and dedication, every difficult task becomes easy.',
      phonetic: 'MEH-huht',
      syllables: 'मेह + नत',
      synonymsHindi: ['परिश्रम', 'श्रम', 'उद्यम'],
      synonymsEnglish: ['Hard work', 'Labor', 'Diligence'],
      visualCategory: 'abstract',
      visualSearchTerm: 'Studying hard effort',
    },
    'khushi': {
      hindiWord: 'खुशी',
      hindiMeaning: 'आनंद, प्रसन्नता, सुखद अनुभव',
      englishMeaning: 'Happiness, joy, delight',
      partOfSpeech: 'संज्ञा (Noun)',
      exampleHindi: 'परीक्षा में अच्छे अंक पाकर आरव की खुशी का ठिकाना न रहा।',
      exampleEnglish: 'Aarav was overjoyed after scoring great marks in the exam.',
      phonetic: 'KHOO-shee',
      syllables: 'खु + शी',
      synonymsHindi: ['प्रसन्नता', 'आनंद', 'उल्लास'],
      synonymsEnglish: ['Joy', 'Cheerfulness', 'Gladness'],
      visualCategory: 'emotion',
      visualSearchTerm: 'Happiness joy sunshine',
    },
    'kitab': {
      hindiWord: 'किताब',
      hindiMeaning: 'पुस्तक, अध्ययन सामग्री',
      englishMeaning: 'Book, volume',
      partOfSpeech: 'संज्ञा (Noun)',
      exampleHindi: 'किताबें हमारी सबसे अच्छी और सच्ची मित्र होती हैं।',
      exampleEnglish: 'Books are our best and truest friends.',
      phonetic: 'ki-TAAB',
      syllables: 'कि + ताब',
      synonymsHindi: ['पुस्तक', 'ग्रंथ', 'पोथी'],
      synonymsEnglish: ['Book', 'Tome', 'Publication'],
      visualCategory: 'object',
      visualSearchTerm: 'Book',
    },
    'dost': {
      hindiWord: 'दोस्त',
      hindiMeaning: 'सखा, मित्र, जो सुख-दुख में साथ दे',
      englishMeaning: 'Friend, companion',
      partOfSpeech: 'संज्ञा (Noun)',
      exampleHindi: 'सच्चा दोस्त वही है जो कठिन समय में मदद करे।',
      exampleEnglish: 'A true friend is one who helps during difficult times.',
      phonetic: 'DOST',
      syllables: 'दो + स्त',
      synonymsHindi: ['मित्र', 'सखा', 'साथी'],
      synonymsEnglish: ['Friend', 'Pal', 'Companion'],
      visualCategory: 'abstract',
      visualSearchTerm: 'Friendship',
    },
    'pani': {
      hindiWord: 'पानी',
      hindiMeaning: 'जल, नीर, जीवनदाता तरल',
      englishMeaning: 'Water, life-giving liquid',
      partOfSpeech: 'संज्ञा (Noun)',
      exampleHindi: 'जल ही जीवन का सच्चा आधार है, पानी की हर बूँद बचाएं।',
      exampleEnglish: 'Water is the true foundation of life, save every drop of water.',
      phonetic: 'PAA-nee',
      syllables: 'पा + नी',
      synonymsHindi: ['जल', 'नीर', 'वारि'],
      synonymsEnglish: ['Water', 'Aqua', 'Liquid'],
      visualCategory: 'object',
      visualSearchTerm: 'Water droplet',
    },
    'ghar': {
      hindiWord: 'घर',
      hindiMeaning: 'मकान, निवास स्थल, आलय',
      englishMeaning: 'Home, residence, dwelling',
      partOfSpeech: 'संज्ञा (Noun)',
      exampleHindi: 'दिन भर की पढ़ाई के बाद सब अपने घर लौट आए।',
      exampleEnglish: 'After studying all day, everyone returned to their home.',
      phonetic: 'GHUHR',
      syllables: 'घ + र',
      synonymsHindi: ['गृह', 'सदन', 'आवास'],
      synonymsEnglish: ['Home', 'Abode', 'House'],
      visualCategory: 'object',
      visualSearchTerm: 'House',
    },
    'samay': {
      hindiWord: 'समय',
      hindiMeaning: 'काल, वक्त, निरंतर चलने वाली अवधि',
      englishMeaning: 'Time, period, moment',
      partOfSpeech: 'संज्ञा (Noun)',
      exampleHindi: 'बीता हुआ समय कभी वापस नहीं आता, अतः समय का सदुपयोग करें।',
      exampleEnglish: 'Lost time never returns, hence make good use of time.',
      phonetic: 'SUH-my',
      syllables: 'स + म + य',
      synonymsHindi: ['काल', 'वक्त', 'घड़ी'],
      synonymsEnglish: ['Time', 'Moment', 'Season'],
      visualCategory: 'object',
      visualSearchTerm: 'Pocket watch clock',
    },
    'shanti': {
      hindiWord: 'शांति',
      hindiMeaning: 'अमन, स्थिरता, कोलाहल रहित अवस्था',
      englishMeaning: 'Peace, tranquility, calm',
      partOfSpeech: 'संज्ञा (Noun)',
      exampleHindi: 'प्रकृति के शांत वातावरण में मन को शांति मिलती है।',
      exampleEnglish: 'In the peaceful environment of nature, the mind finds peace.',
      phonetic: 'SHAAN-tee',
      syllables: 'शां + ति',
      synonymsHindi: ['अमन', 'चैन', 'सुकून'],
      synonymsEnglish: ['Peace', 'Serenity', 'Calm'],
      visualCategory: 'emotion',
      visualSearchTerm: 'Serene calm lake sunrise',
    },
    'vidyalaya': {
      hindiWord: 'विद्यालय',
      hindiMeaning: 'पाठशाला, स्कूल, जहाँ शिक्षा दी जाती है',
      englishMeaning: 'School, educational institution',
      partOfSpeech: 'संज्ञा (Noun)',
      exampleHindi: 'सभी बच्चे सुबह समय पर विद्यालय पहुँचते हैं।',
      exampleEnglish: 'All children arrive at school on time in the morning.',
      phonetic: 'vid-YAA-luh-yuh',
      syllables: 'विद् + या + ल + य',
      synonymsHindi: ['स्कूल', 'पाठशाला', 'शिक्षालय'],
      synonymsEnglish: ['School', 'Academy'],
      visualCategory: 'object',
      visualSearchTerm: 'School',
    },
    'shikshak': {
      hindiWord: 'शिक्षक',
      hindiMeaning: 'अध्यापक, गुरु, मार्गदर्शक',
      englishMeaning: 'Teacher, mentor, educator',
      partOfSpeech: 'संज्ञा (Noun)',
      exampleHindi: 'शिक्षक बच्चों को अच्छे संस्कार और ज्ञान देते हैं।',
      exampleEnglish: 'Teachers impart good values and knowledge to children.',
      phonetic: 'SHIK-shuhk',
      syllables: 'शिक्ष + क',
      synonymsHindi: ['अध्यापक', 'गुरु', 'आचार्य'],
      synonymsEnglish: ['Teacher', 'Mentor'],
      visualCategory: 'object',
      visualSearchTerm: 'Teacher classroom',
    },
    'pustak': {
      hindiWord: 'पुस्तक',
      hindiMeaning: 'किताब, ग्रंथ',
      englishMeaning: 'Book, volume',
      partOfSpeech: 'संज्ञा (Noun)',
      exampleHindi: 'पुस्तकालय में हज़ारों अच्छी पुस्तकें उपलब्ध हैं।',
      exampleEnglish: 'Thousands of good books are available in the library.',
      phonetic: 'POOS-tuhk',
      syllables: 'पुस् + तक',
      synonymsHindi: ['किताब', 'ग्रंथ', 'पोथी'],
      synonymsEnglish: ['Book', 'Volume'],
      visualCategory: 'object',
      visualSearchTerm: 'Book',
    },
    'vigyan': {
      hindiWord: 'विज्ञान',
      hindiMeaning: 'विशेष ज्ञान, प्रकृति के नियमों का अध्ययन',
      englishMeaning: 'Science, systematic knowledge',
      partOfSpeech: 'संज्ञा (Noun)',
      exampleHindi: 'विज्ञान ने हमारे जीवन को बहुत आसान बना दिया है।',
      exampleEnglish: 'Science has made our lives much easier.',
      phonetic: 'vig-YAAN',
      syllables: 'विग् + यान',
      synonymsHindi: ['शास्त्र', 'शोध', 'अनुसंधान'],
      synonymsEnglish: ['Science', 'Study'],
      visualCategory: 'object',
      visualSearchTerm: 'Science microscope laboratory',
    },
    'ganit': {
      hindiWord: 'गणित',
      hindiMeaning: 'संख्याओं, गणना और तार्किकता का शास्त्र',
      englishMeaning: 'Mathematics, arithmetic',
      partOfSpeech: 'संज्ञा (Noun)',
      exampleHindi: 'गणित विषय हमारे सोचने और तर्क करने की क्षमता बढ़ाता है।',
      exampleEnglish: 'Mathematics enhances our thinking and reasoning ability.',
      phonetic: 'GUH-nit',
      syllables: 'ग + णि + त',
      synonymsHindi: ['अंकगणित', 'रियाजी'],
      synonymsEnglish: ['Math', 'Arithmetic'],
      visualCategory: 'abstract',
      visualSearchTerm: 'Mathematics geometry',
    },
    'prakriti': {
      hindiWord: 'प्रकृति',
      hindiMeaning: 'कुदरत, पर्यावरण, संसार की मूल रचना',
      englishMeaning: 'Nature, environment',
      partOfSpeech: 'संज्ञा (Noun)',
      exampleHindi: 'हमें अपनी प्रकृति और वनों की रक्षा करनी चाहिए।',
      exampleEnglish: 'We must protect our nature and forests.',
      phonetic: 'pruh-KRI-tee',
      syllables: 'प्र + कृ + ति',
      synonymsHindi: ['कुदरत', 'पर्यावरण', 'निसर्ग'],
      synonymsEnglish: ['Nature', 'Environment'],
      visualCategory: 'object',
      visualSearchTerm: 'Nature green forest waterfall',
    },
    'suraj': {
      hindiWord: 'सूरज',
      hindiMeaning: 'सूर्य, दिन में प्रकाश देने वाला तारा',
      englishMeaning: 'Sun, solar star',
      partOfSpeech: 'संज्ञा (Noun)',
      exampleHindi: 'प्रातःकाल उगता हुआ सूरज धरती पर नई ऊर्जा लाता है।',
      exampleEnglish: 'The rising morning sun brings fresh energy to the earth.',
      phonetic: 'SOO-ruhj',
      syllables: 'सू + रज',
      synonymsHindi: ['सूर्य', 'दिनकर', 'भास्कर'],
      synonymsEnglish: ['Sun', 'Solar orb'],
      visualCategory: 'object',
      visualSearchTerm: 'Sun',
    },
  };

  if (ai) {
    const prompt = `You are an expert bilingual Hindi-English lexicographer for school students (Grade ${grade}) in ShabdShilp.
The user provided this word or short phrase (which could be in Hinglish/Romanized Hindi like 'mehnat', 'kitab', 'khushi', or in Devanagari Hindi like 'साहस', 'कमल', or in English like 'astronaut', 'butterfly', 'courage'):
"${rawWord}"

Provide an accurate, authentic dictionary entry with:
- "hindiWord": exact word/equivalent in Hindi Devanagari script
- "hindiMeaning": clear, accurate definition in Hindi
- "englishMeaning": clear, accurate definition in English
- "partOfSpeech": grammatical part of speech e.g. संज्ञा (Noun)
- "exampleHindi": natural example sentence in Hindi
- "exampleEnglish": English translation of the example sentence
- "phonetic": Romanized pronunciation guide
- "syllables": Devanagari syllable/matra breakup separated by +
- "synonymsHindi": 3 Hindi synonyms
- "synonymsEnglish": 3 English synonyms
- "visualCategory": strictly one of "object" | "emotion" | "abstract". Use "object" for any concrete physical object, animal, bird, plant, fruit, nature element, building, place, person/profession, or celestial body (e.g. किताब, सूरज, पानी, फूल, पेड़, घर, विद्यालय, सेब, शेर). Use "emotion" for feelings/moods (e.g. खुशी, शांति, प्रेम, क्रोध, उत्साह, भय). Use "abstract" for qualities/ideas/actions (e.g. मेहनत, सत्य, ज्ञान, समय).
- "visualSearchTerm": a concise 1-2 word canonical English Wikipedia/Wikimedia term representing the word (e.g. "Book", "Sun", "Water", "House", "Lotus", "Lion", "Happiness").
- "visualCaptionHindi": concise 1-line Hindi caption describing a helpful visual image for this word.
- "visualCaptionEnglish": concise 1-line English caption for the visual.`;

    try {
      const parsed = await generateJsonFast(
        prompt,
        {
          type: Type.OBJECT,
          properties: {
            hindiWord: { type: Type.STRING },
            hindiMeaning: { type: Type.STRING },
            englishMeaning: { type: Type.STRING },
            partOfSpeech: { type: Type.STRING },
            exampleHindi: { type: Type.STRING },
            exampleEnglish: { type: Type.STRING },
            phonetic: { type: Type.STRING },
            syllables: { type: Type.STRING },
            synonymsHindi: { type: Type.ARRAY, items: { type: Type.STRING } },
            synonymsEnglish: { type: Type.ARRAY, items: { type: Type.STRING } },
            visualCategory: { type: Type.STRING },
            visualSearchTerm: { type: Type.STRING },
            visualCaptionHindi: { type: Type.STRING },
            visualCaptionEnglish: { type: Type.STRING },
          },
          required: [
            'hindiWord',
            'hindiMeaning',
            'englishMeaning',
            'partOfSpeech',
            'exampleHindi',
            'exampleEnglish',
            'phonetic',
            'syllables',
            'synonymsHindi',
            'synonymsEnglish',
            'visualCategory',
            'visualSearchTerm',
            'visualCaptionHindi',
            'visualCaptionEnglish',
          ],
        },
        13000
      );

      if (parsed && parsed.hindiWord && parsed.hindiMeaning) {
        const visual = await resolveWordVisualPayload({
          rawWord,
          hindiWord: parsed.hindiWord,
          englishMeaning: parsed.englishMeaning,
          visualCategory: parsed.visualCategory,
          visualSearchTerm: parsed.visualSearchTerm,
          visualCaptionHindi: parsed.visualCaptionHindi,
          visualCaptionEnglish: parsed.visualCaptionEnglish,
        });
        const finalPayload = { ...parsed, ...visual };
        setCachedAiResult(cacheKey, finalPayload, 15 * 60 * 1000);
        return res.json(finalPayload);
      }
    } catch (err: any) {
      if (isAuthOrConfigError(err)) {
        console.error('AI word-meaning config error:', err?.message);
      } else {
        logAiFallback('word-meaning', err);
      }
    }
  }

  const lower = rawWord.toLowerCase();
  const matched = fallbackDict[lower] || fallbackDict[rawWord];
  if (matched) {
    const visual = await resolveWordVisualPayload({
      rawWord,
      hindiWord: matched.hindiWord,
      englishMeaning: matched.englishMeaning,
      visualCategory: matched.visualCategory,
      visualSearchTerm: matched.visualSearchTerm,
    });
    const finalPayload = { ...matched, ...visual };
    setCachedAiResult(cacheKey, finalPayload, 10 * 60 * 1000);
    return res.json(finalPayload);
  }

  return res.status(503).json({
    error: 'शब्दार्थ खोजने में अस्थायी समस्या आई। कृपया कुछ क्षण बाद पुनः प्रयास करें।',
    errorEnglish: 'Unable to fetch word meaning right now. Please try again.',
  });
});

// 7B. Dedicated Visual Resolver for Instant Local Dictionary Matches
app.post('/api/ai/word-visual', async (req: Request, res: Response) => {
  const { rawWord = '', hindiWord = '', englishMeaning = '' } = req.body || {};
  const cleanHi = String(hindiWord || rawWord).trim();
  const cleanEn = String(englishMeaning || rawWord).trim();
  if (!cleanHi && !cleanEn) {
    return res.status(400).json({ error: 'Word required for visual lookup.' });
  }

  const cacheKey = `word-visual-v2:${(rawWord || cleanHi).toLowerCase()}`;
  const cached = getCachedAiResult(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  let visualCategory: string = 'abstract';
  let visualSearchTerm: string = cleanEn.split(/[,;/]/)[0].trim();
  let visualCaptionHindi = '';
  let visualCaptionEnglish = '';

  if (ai) {
    try {
      const classified = await generateJsonFast(
        `Classify the concept "${cleanHi}" (${cleanEn}) for a visual illustration card:
- "visualCategory": "object" if tangible physical object/animal/plant/place/person/celestial body; "emotion" if a feeling/mood; "abstract" if an idea/action/quality.
- "visualSearchTerm": 1-2 word canonical English Wikipedia noun query (e.g. "Book", "Sun", "Water", "Happiness").
- "visualCaptionHindi": concise 1-line Hindi caption.
- "visualCaptionEnglish": concise 1-line English caption.`,
        {
          type: Type.OBJECT,
          properties: {
            visualCategory: { type: Type.STRING },
            visualSearchTerm: { type: Type.STRING },
            visualCaptionHindi: { type: Type.STRING },
            visualCaptionEnglish: { type: Type.STRING },
          },
          required: ['visualCategory', 'visualSearchTerm', 'visualCaptionHindi', 'visualCaptionEnglish'],
        },
        8000
      );
      if (classified) {
        visualCategory = classified.visualCategory || visualCategory;
        visualSearchTerm = classified.visualSearchTerm || visualSearchTerm;
        visualCaptionHindi = classified.visualCaptionHindi || '';
        visualCaptionEnglish = classified.visualCaptionEnglish || '';
      }
    } catch {
      // Fallback to direct term heuristic
    }
  }

  const visual = await resolveWordVisualPayload({
    rawWord: rawWord || cleanHi,
    hindiWord: cleanHi,
    englishMeaning: cleanEn,
    visualCategory,
    visualSearchTerm,
    visualCaptionHindi,
    visualCaptionEnglish,
  });
  setCachedAiResult(cacheKey, visual, 15 * 60 * 1000);
  return res.json(visual);
});

// 8. Bilingual Word & Sentence Converter (English ⇄ Hindi)
app.post('/api/ai/word-translate', async (req: Request, res: Response) => {
  const { text = '', direction = 'en_to_hi' } = req.body;
  const rawText = (text || '').trim();
  if (!rawText) {
    return res.status(400).json({ error: 'अनुवाद के लिए कृपया शब्द या वाक्य लिखें।' });
  }

  const isEnToHi = direction === 'en_to_hi';

  const enToHiDict: Record<string, { hi: string; type: string; exHi: string; exEn: string; roman: string }> = {
    'courage': { hi: 'साहस / हिम्मत', type: 'संज्ञा (Noun)', exHi: 'उसने कठिन समय में साहस दिखाया।', exEn: 'He showed courage in difficult times.', roman: 'Saahas / Himmat' },
    'water': { hi: 'पानी / जल', type: 'संज्ञा (Noun)', exHi: 'जल ही जीवन का आधार है।', exEn: 'Water is the foundation of life.', roman: 'Paani / Jal' },
    'friendship': { hi: 'दोस्ती / मित्रता', type: 'संज्ञा (Noun)', exHi: 'सच्ची मित्रता अनमोल होती है।', exEn: 'True friendship is priceless.', roman: 'Dosti / Mitrata' },
    'knowledge': { hi: 'ज्ञान / विद्या', type: 'संज्ञा (Noun)', exHi: 'ज्ञान बाँटने से बढ़ता है।', exEn: 'Knowledge grows by sharing.', roman: 'Gyaan / Vidya' },
    'nature': { hi: 'प्रकृति / कुदरत', type: 'संज्ञा (Noun)', exHi: 'प्रकृति का सौंदर्य अद्भुत है।', exEn: 'The beauty of nature is wonderful.', roman: 'Prakriti / Kudrat' },
    'success': { hi: 'सफलता / विजय', type: 'संज्ञा (Noun)', exHi: 'कड़ी मेहनत से सफलता मिलती है।', exEn: 'Hard work brings success.', roman: 'Safalta / Vijay' },
    'honesty': { hi: 'ईमानदारी / सच्चाई', type: 'संज्ञा (Noun)', exHi: 'ईमानदारी सबसे अच्छी नीति है।', exEn: 'Honesty is the best policy.', roman: 'Imaandari' },
    'time': { hi: 'समय / काल', type: 'संज्ञा (Noun)', exHi: 'समय का सदुपयोग करना चाहिए।', exEn: 'One should utilize time well.', roman: 'Samay' }
  };

  if (ai) {
    const prompt = `You are a professional Hindi-English translator and linguist for ShabdShilp.
Translate this ${isEnToHi ? 'English word, phrase, or sentence to natural, accurate Hindi (Devanagari)' : 'Hindi (Devanagari or Romanized Hinglish) word, phrase, or sentence to natural, accurate English'}:
"${rawText}"

Return:
- "translatedText": accurate primary translation
- "transliteration": Romanized Hindi pronunciation (or English pronunciation hint if target is English)
- "partOfSpeech": grammatical category (or "वाक्य (Sentence)" for sentences)
- "alternatives": 2-3 useful alternative translations or synonyms
- "exampleSentenceHindi": natural example sentence in Hindi using the concept
- "exampleSentenceEnglish": accurate English translation of that example sentence`;

    try {
      const parsed = await generateJsonFast(
        prompt,
        {
          type: Type.OBJECT,
          properties: {
            translatedText: { type: Type.STRING },
            transliteration: { type: Type.STRING },
            partOfSpeech: { type: Type.STRING },
            alternatives: { type: Type.ARRAY, items: { type: Type.STRING } },
            exampleSentenceHindi: { type: Type.STRING },
            exampleSentenceEnglish: { type: Type.STRING },
          },
          required: [
            'translatedText',
            'transliteration',
            'partOfSpeech',
            'alternatives',
            'exampleSentenceHindi',
            'exampleSentenceEnglish',
          ],
        },
        13000
      );

      if (parsed && parsed.translatedText) {
        return res.json({
          inputText: rawText,
          direction,
          ...parsed,
        });
      }
    } catch (err: any) {
      if (isAuthOrConfigError(err)) {
        console.error('AI word-translate config error:', err?.message);
      } else {
        logAiFallback('word-translate', err);
      }
    }
  }

  const lower = rawText.toLowerCase();
  if (isEnToHi && enToHiDict[lower]) {
    const item = enToHiDict[lower];
    return res.json({
      inputText: rawText,
      direction,
      translatedText: item.hi,
      transliteration: item.roman,
      partOfSpeech: item.type,
      alternatives: item.hi.split(' / '),
      exampleSentenceHindi: item.exHi,
      exampleSentenceEnglish: item.exEn
    });
  }

  return res.status(503).json({
    error: 'अनुवाद सेवा अभी उपलब्ध नहीं हो सकी। कृपया पुनः प्रयास करें।',
    errorEnglish: 'Translation service is temporarily unavailable. Please try again.',
  });
});

// 8b. Speech Pronunciation Analysis (supports Hinglish, Devanagari Hindi, or English input)
app.post('/api/ai/speech-pronounce', async (req: Request, res: Response) => {
  const { text = '', grade = 'कक्षा 8' } = req.body;
  const rawText = String(text || '').trim();
  if (!rawText) {
    return res.status(400).json({ error: 'उच्चारण के लिए कृपया कोई शब्द या वाक्यांश लिखें।' });
  }

  const cacheKey = `pronounce:${grade}:${rawText.toLowerCase()}`;
  const cached = getCachedAiResult(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  if (ai) {
    const prompt = `You are a Hindi phonetics and pronunciation coach for ShabdShilp (${grade}).
A student entered this word or short phrase (it may be in Hinglish like 'namaste' or 'shukriya', Devanagari Hindi like 'कृतज्ञता' or 'नमस्ते', or English like 'perseverance'):
"${rawText}"

If the input is English, convert it to the natural Hindi word/phrase first. If Hinglish, convert it to exact standard Devanagari Hindi. If already Devanagari Hindi, preserve it accurately.
Return structured pronunciation data:
- "hindiText": exact Devanagari Hindi word or phrase
- "phonetic": intuitive phonetic pronunciation guide in Latin syllables (e.g., "kri-tuhg-yuh-TAA")
- "syllables": Devanagari syllable/matra breakdown separated by " + "
- "meaningHindi": concise meaning in simple Hindi
- "meaningEnglish": concise meaning in English
- "pronunciationTipHindi": 1 helpful tip in Hindi explaining how to pronounce the tricky vowels, matras, or conjunct consonants cleanly.`;

    try {
      const parsed = await generateJsonFast(
        prompt,
        {
          type: Type.OBJECT,
          properties: {
            hindiText: { type: Type.STRING },
            phonetic: { type: Type.STRING },
            syllables: { type: Type.STRING },
            meaningHindi: { type: Type.STRING },
            meaningEnglish: { type: Type.STRING },
            pronunciationTipHindi: { type: Type.STRING },
          },
          required: [
            'hindiText',
            'phonetic',
            'syllables',
            'meaningHindi',
            'meaningEnglish',
            'pronunciationTipHindi',
          ],
        },
        11000
      );

      if (parsed && parsed.hindiText) {
        const result = {
          input: rawText,
          ...parsed,
        };
        setCachedAiResult(cacheKey, result, 12 * 60 * 60 * 1000);
        return res.json(result);
      }
    } catch (err: any) {
      if (isAuthOrConfigError(err)) {
        console.error('AI speech-pronounce config error:', err?.message);
        return res.status(403).json({
          error: 'API कुंजी (GEMINI_API_KEY) सत्यापित नहीं हो सकी। कृपया Settings > Secrets में जाँचें।',
        });
      }
      logAiFallback('speech-pronounce', err);
    }
  }

  const deterministic = buildDeterministicPronounceFallback(rawText);
  if (deterministic) {
    const fallbackResult = {
      input: rawText,
      ...deterministic,
    };
    setCachedAiResult(cacheKey, fallbackResult, 10 * 60 * 1000);
    return res.json(fallbackResult);
  }

  return res.status(503).json({
    error: 'उच्चारण विश्लेषण अभी व्यस्त है। कृपया हिंदी या रोमन में लिखें या कुछ क्षण बाद पुनः प्रयास करें।',
  });
});

// 8c. High-clarity Hindi Audio Generation (TTS with server cache, model cooldown, and seamless browser speech fallback)
app.post('/api/ai/tts', async (req: Request, res: Response) => {
  const { text = '' } = req.body;
  const cleanText = String(text || '').trim();
  if (!cleanText) {
    return res.status(400).json({ error: 'बोलने के लिए कृपया कोई शब्द या वाक्य भेजें।' });
  }

  const cacheKey = `tts:${cleanText.toLowerCase()}`;
  const cachedAudio = getCachedAiResult<string>(cacheKey);
  if (cachedAudio) {
    return res.json({
      audioBase64: cachedAudio,
      mimeType: 'audio/wav',
      cached: true,
    });
  }

  if (!ai) {
    return res.json({
      audioBase64: null,
      useBrowserSpeech: true,
      reason: 'no_api_key',
    });
  }

  const ttsModels = ['gemini-3.8-flash-lite-tts', 'gemini-3.8-flash-tts'];
  let authError: any = null;

  for (const model of ttsModels) {
    if (isModelInCooldown(model)) {
      continue;
    }

    try {
      const response = await withTimeout(
        ai.models.generateContent({
          model,
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: cleanText,
                  speechMetadata: {
                    style: 'Clear, calm, articulate Hindi teacher pronouncing accurately for students',
                  },
                },
              ],
            },
          ],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: 'Kore' },
              },
            },
          },
        }),
        20000
      );

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        setCachedAiResult(cacheKey, base64Audio, 12 * 60 * 60 * 1000);
        return res.json({
          audioBase64: base64Audio,
          mimeType: 'audio/wav',
        });
      }
    } catch (err: any) {
      if (isAuthOrConfigError(err)) {
        authError = err;
        break;
      }
      setModelCooldown(model, err);
      logAiFallback(`ai-tts:${model}`, err);
    }
  }

  if (authError) {
    console.error('AI TTS config error:', authError?.message);
    return res.status(403).json({
      error: 'API कुंजी (GEMINI_API_KEY) सत्यापित नहीं हो सकी। कृपया Settings > Secrets में जाँचें।',
    });
  }

  const cooldownLeft = Math.min(
    getModelCooldownRemainingSeconds('gemini-3.8-flash-lite-tts') || 60,
    getModelCooldownRemainingSeconds('gemini-3.8-flash-tts') || 60
  );

  return res.json({
    audioBase64: null,
    useBrowserSpeech: true,
    rateLimited: true,
    retryAfterSeconds: Math.max(cooldownLeft, 30),
  });
});

// 9. AI Unique Worksheet Generator (ICSE Board, Zero Duplicate Questions)
app.post('/api/ai/generate-worksheet', async (req: Request, res: Response) => {
  const {
    topic = 'कारक (Case Markers)',
    topicId = 'karak',
    grade = 'कक्षा 8',
    difficulty = 'medium',
    questionCount = 10,
  } = req.body;

  const count = Math.min(Math.max(parseInt(String(questionCount), 10) || 10, 1), 25);

  if (!ai) {
    return res.json({ questions: [] });
  }

  try {
    const diffDesc =
      difficulty === 'easy'
        ? 'Easy / Foundational level (clear, direct ICSE concepts)'
        : difficulty === 'hard' || difficulty === 'board_level'
        ? 'Challenging ICSE Board Exam level (application, nuanced exceptions, transformation)'
        : 'Standard ICSE middle/high school level';

    const syllabusGuard =
      String(grade).includes('5')
        ? 'CLASS 5 SYLLABUS ONLY: Limit questions strictly to ICSE Class 5 topics (उपसर्ग-प्रत्यय, संज्ञा, लिंग, वचन, कारक, सर्वनाम, विशेषण, क्रिया और काल, वाक्य-विचार, विराम-चिह्न, पर्यायवाची, विलोम, अनेक शब्दों के लिए एक शब्द, मुहावरे). Do NOT ask संधि, समास, वाच्य, अविकारी, अनेकार्थी, श्रुतिसमभिन्नार्थक, पद-परिचय, or लोकोक्तियाँ.'
        : String(grade).includes('6')
        ? 'CLASS 6 SYLLABUS ONLY: Limit questions strictly to ICSE Class 6 topics (शब्द-विचार, उपसर्ग-प्रत्यय, संज्ञा, लिंग, वचन, कारक, सर्वनाम, विशेषण, क्रिया, काल, अविकारी शब्द, वाक्य-विचार और अशुद्धि शोधन, विराम-चिह्न, पर्यायवाची, विलोम, अनेकार्थी, श्रुतिसमभिन्नार्थक, अनेक शब्दों के लिए एक शब्द, मुहावरे और लोकोक्तियाँ). Do NOT ask वाच्य, संधि, समास, or पद-परिचय.'
        : String(grade).includes('7')
        ? 'CLASS 7 SYLLABUS ONLY: Limit questions strictly to ICSE Class 7 topics (उपसर्ग और प्रत्यय, समास, संज्ञा, लिंग, वचन, कारक, सर्वनाम, विशेषण, क्रिया, काल, वाच्य, अविकारी शब्द [क्रियाविशेषण, संबंधबोधक, समुच्चयबोधक, विस्मयादिबोधक, निपात], पद-परिचय, वाक्य-विचार और अशुद्धि शोधन, विराम-चिह्न, पर्यायवाची शब्द, विलोम शब्द, अनेकार्थी शब्द, श्रुतिसमभिन्नार्थक शब्द, अनेक शब्दों के लिए एक शब्द, मुहावरे और लोकोक्तियाँ). Do NOT ask संधि or शब्द-विचार.'
        : String(grade).includes('8')
        ? 'CLASS 8 SYLLABUS ONLY: Limit questions strictly to ICSE Class 8 topics (शब्द-विचार, उपसर्ग और प्रत्यय, समास, संज्ञा, लिंग, वचन, कारक, सर्वनाम, विशेषण, क्रिया, काल, वाच्य, अविकारी शब्द [क्रियाविशेषण, संबंधबोधक, समुच्चयबोधक, विस्मयादिबोधक, निपात], पद-परिचय, वाक्य-विचार [अर्थ और रचना के आधार पर], विराम-चिह्न, पर्यायवाची शब्द, विलोम शब्द, अनेकार्थी शब्द, श्रुतिसमभिन्नार्थक शब्द, अनेक शब्दों के लिए एक शब्द, मुहावरे और लोकोक्तियाँ, वाक्य और उसके भेद). Do NOT ask संधि.'
        : String(grade).includes('9') || String(grade).includes('10')
        ? `ICSE ${grade} SYLLABUS ONLY: Limit questions strictly to these 15 topics: विशेषण निर्माण, पर्यायवाची शब्द, विलोम शब्द, अनेक शब्दों के लिए एक शब्द, अनेकार्थी शब्द, श्रुतिसमभिन्नार्थक शब्द, वर्तनी शुद्धि, वाक्य शुद्धि, लिंग, वचन, कारक, काल, वाच्य, वाक्य-परिवर्तन (अर्थ और रचना के आधार पर), मुहावरे और लोकोक्तियाँ. Do NOT ask संधि, समास, उपसर्ग-प्रत्यय, पद-परिचय, अविकारी शब्द, शब्द-विचार, or विराम-चिह्न.`
        : `Align difficulty and examples strictly to ICSE ${grade} curriculum standards.`;

    const prompt = `You are a senior ICSE Hindi Grammar examiner for ShabdShilp.
Generate EXACTLY ${count} completely distinct, non-repeating multiple-choice questions (MCQ) on the topic "${topic}" (topicId: ${topicId}) for ${grade} (ICSE Board) at ${diffDesc}.
${syllabusGuard}

STRICT QUALITY & UNIQUENESS RULES:
1. ALL ${count} QUESTIONS MUST BE 100% DIFFERENT from each other — every question MUST use a completely different example sentence, word, or grammatical scenario, and test a distinct answer/concept. NEVER repeat the same question or just swap options.
2. Each question must have 1 accurate Hindi correct answer, 3 plausible distinct Hindi distractors, and clear Hindi + English explanations.
3. Do NOT prefix questions with "प्रश्न 1." or "Q1.".`;

    const parsed: any = await generateJsonFast(
      prompt,
      {
        type: Type.OBJECT,
        properties: {
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                questionHindi: { type: Type.STRING },
                questionEnglish: { type: Type.STRING },
                correctAnswerHindi: { type: Type.STRING },
                correctAnswerEnglish: { type: Type.STRING },
                wrongAnswersHindi: { type: Type.ARRAY, items: { type: Type.STRING } },
                wrongAnswersEnglish: { type: Type.ARRAY, items: { type: Type.STRING } },
                explanationHindi: { type: Type.STRING },
                explanationEnglish: { type: Type.STRING },
              },
              required: [
                'questionHindi',
                'questionEnglish',
                'correctAnswerHindi',
                'wrongAnswersHindi',
                'explanationHindi',
                'explanationEnglish',
              ],
            },
          },
        },
        required: ['questions'],
      },
      22000
    );
    const rawItems = Array.isArray(parsed?.questions) ? parsed!.questions! : [];
    const seen = new Set<string>();
    const formatted: any[] = [];

    rawItems.forEach((item: any, idx: number) => {
      const qHindi = String(item?.questionHindi || '').trim();
      const norm = qHindi.replace(/^(प्रश्न|Q)\s*\d+\s*[:.)]?\s*/i, '').replace(/\s+/g, ' ').toLowerCase();
      if (!qHindi || seen.has(norm)) return;
      const wrongsH = Array.isArray(item.wrongAnswersHindi) ? item.wrongAnswersHindi.slice(0, 3) : [];
      if (!item.correctAnswerHindi || wrongsH.length < 3) return;
      seen.add(norm);

      const wrongsE = Array.isArray(item.wrongAnswersEnglish) ? item.wrongAnswersEnglish : [];
      const rawOptions = buildUniformOptions(
        String(item.correctAnswerHindi),
        wrongsH.map(String),
        item.correctAnswerEnglish,
        wrongsE
      );

      formatted.push({
        id: `ai_q_${idx + 1}_${Date.now()}`,
        topicId,
        topicNameHindi: topic,
        topicNameEnglish: topic,
        questionHindi: qHindi,
        questionEnglish: String(item.questionEnglish || qHindi),
        options: rawOptions,
        correctIndex: 0,
        explanationHindi: String(item.explanationHindi || ''),
        explanationEnglish: String(item.explanationEnglish || ''),
      });
    });

    return res.json({ questions: balanceServerQuestions(formatted).slice(0, count) });
  } catch (err: any) {
    logAiFallback('generate-worksheet', err);
    return res.json({ questions: [] });
  }
});

// 10. English Story -> Hindi Translation + Gemini Review + Length/Content WordCoins
app.post('/api/ai/story-translate-review', async (req: Request, res: Response) => {
  const { storyTitle = '', englishStory = '', grade = 'कक्षा 8' } = req.body;
  const rawStory = String(englishStory || '').trim();
  const words = rawStory.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  if (!rawStory || wordCount < 5) {
    return res.status(400).json({
      error: 'कृपया कम से कम 5 शब्दों की एक अंग्रेज़ी कहानी लिखें। (Please write a story of at least 5 words in English.)',
    });
  }

  if (!ai) {
    return res.status(503).json({
      error: 'एआई अनुवाद एवं समीक्षा सेवा अभी उपलब्ध नहीं है। कृपया कुछ क्षण बाद पुनः प्रयास करें।',
    });
  }

  try {
    const prompt = `You are a bilingual literary translator and creative writing mentor for school students (${grade}, ICSE Board).
A student wrote the following story (it may be written in English, Hinglish/Romanized Hindi, or Hindi):
Title: "${storyTitle.trim() || 'Untitled Story'}"
Word Count: ${wordCount} words
Student Story:
"""
${rawStory}
"""

YOUR TASKS:
1. Translate/convert the title ("hindiTitle") and the ENTIRE story accurately into natural, expressive, school-friendly Hindi Devanagari ("hindiTranslation"), preserving all paragraphs and tone. (If already Hindi, polish grammar & matras while keeping the student's voice.)
2. Evaluate the content quality, creativity, plot coherence, vocabulary, and depth of the story honestly:
   - Set "isMeaningfulStory" to false if the text is gibberish, random keystrokes, or repeated meaningless words.
   - Give an honest "overallScore" (0 to 100) based on content quality and storytelling effort.
   - Determine proficiency "level" (e.g., "उत्कृष्ट कथाकार (Master Storyteller)", "दक्ष लेखक (Advanced Writer)", "सशक्त प्रयास (Developing Writer)", "प्रारंभिक लेखक (Beginner)").
   - Provide detailed, encouraging feedback in Hindi ("feedbackHindi") and English ("feedbackEnglish"), mentioning both the content quality and the length (${wordCount} words).
   - Provide 2-3 specific strengths ("strengthsHindi", "strengthsEnglish") and 2-3 actionable improvement tips ("improvementTipsHindi", "improvementTipsEnglish").`;

    const parsed = await generateJsonFast(
      prompt,
      {
        type: Type.OBJECT,
        properties: {
          hindiTitle: { type: Type.STRING },
          hindiTranslation: { type: Type.STRING },
          overallScore: { type: Type.INTEGER },
          level: { type: Type.STRING },
          isMeaningfulStory: { type: Type.BOOLEAN },
          feedbackHindi: { type: Type.STRING },
          feedbackEnglish: { type: Type.STRING },
          strengthsHindi: { type: Type.ARRAY, items: { type: Type.STRING } },
          strengthsEnglish: { type: Type.ARRAY, items: { type: Type.STRING } },
          improvementTipsHindi: { type: Type.ARRAY, items: { type: Type.STRING } },
          improvementTipsEnglish: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: [
          'hindiTitle',
          'hindiTranslation',
          'overallScore',
          'level',
          'isMeaningfulStory',
          'feedbackHindi',
          'feedbackEnglish',
          'strengthsHindi',
          'strengthsEnglish',
          'improvementTipsHindi',
          'improvementTipsEnglish',
        ],
      },
      20000
    );

    if (!parsed || !parsed.hindiTranslation) {
      throw new Error('Incomplete AI translation response');
    }

    const score = Math.min(100, Math.max(0, Number(parsed.overallScore) || 60));
    const meaningful = parsed.isMeaningfulStory !== false;

    // Award WordCoins strictly based on BOTH story length (wordCount) AND content quality (score)
    let coinsAwarded = 0;
    if (meaningful && wordCount >= 5) {
      let lengthCoins = 2;
      if (wordCount >= 180) lengthCoins = 16;
      else if (wordCount >= 100) lengthCoins = 12;
      else if (wordCount >= 50) lengthCoins = 8;
      else if (wordCount >= 20) lengthCoins = 4;

      let contentCoins = 1;
      if (score >= 90) contentCoins = 9;
      else if (score >= 80) contentCoins = 7;
      else if (score >= 65) contentCoins = 4;
      else if (score >= 50) contentCoins = 2;

      coinsAwarded = Math.min(25, Math.max(1, lengthCoins + contentCoins));
    }

    return res.json({
      success: true,
      wordCount,
      hindiTitle: parsed.hindiTitle || storyTitle || 'मेरी कहानी',
      hindiTranslation: parsed.hindiTranslation,
      overallScore: score,
      level: parsed.level || 'सशक्त प्रयास (Developing Writer)',
      isMeaningfulStory: meaningful,
      coinsAwarded,
      feedbackHindi: parsed.feedbackHindi,
      feedbackEnglish: parsed.feedbackEnglish,
      strengthsHindi: Array.isArray(parsed.strengthsHindi) ? parsed.strengthsHindi : [],
      strengthsEnglish: Array.isArray(parsed.strengthsEnglish) ? parsed.strengthsEnglish : [],
      improvementTipsHindi: Array.isArray(parsed.improvementTipsHindi) ? parsed.improvementTipsHindi : [],
      improvementTipsEnglish: Array.isArray(parsed.improvementTipsEnglish) ? parsed.improvementTipsEnglish : [],
    });
  } catch (err: any) {
    if (isAuthOrConfigError(err)) {
      console.error('AI story-translate-review config error:', err?.message);
    } else {
      logAiFallback('story-translate-review', err);
    }
    return res.status(503).json({
      error: 'कहानी अनुवाद व समीक्षा में अस्थायी त्रुटि हुई। कृपया पुनः प्रयास करें।',
    });
  }
});

// 10b. Katha Shilpi AI — Universal ICSE Composition Translator, Format Checker & Rubric Reviewer
app.post('/api/ai/katha-shilpi-review', async (req: Request, res: Response) => {
  const {
    genreId = 'kahani',
    title = '',
    compositionText = '',
    inputLanguage = 'english',
    grade = 'कक्षा 8',
  } = req.body;

  const rawText = String(compositionText || '').trim();
  const words = rawText.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  if (!rawText || wordCount < 5) {
    return res.status(400).json({
      error: 'कृपया कम से कम 5 शब्दों की रचना लिखें। (Please write at least 5 meaningful words.)',
    });
  }

  if (!ai) {
    return res.status(503).json({
      error: 'एआई रचना समीक्षा सेवा अभी उपलब्ध नहीं है। कृपया कुछ क्षण बाद पुनः प्रयास करें।',
    });
  }

  const formatGuideMap: Record<string, string> = {
    nibandh:
      'निबंध लेखन (ICSE Essay): Title -> Multi-paragraph flow (प्रस्तावना -> 2-3 मध्य अनुच्छेद -> संतुलित उपसंहार). No bullet-list notes. Target ~140-250 words depending on grade (250 words for Class 9-10).',
    kahani:
      'कहानी लेखन (ICSE Story): Catchy Title -> Consistent tense (usually भूतकाल) with plot conflict, natural dialogue ("..."), resolution -> crisp 1-line "शिक्षा / सीख:" at the end.',
    anuched:
      'अनुच्छेद लेखन (ICSE Single Paragraph): Title -> Strictly ONE continuous paragraph (~80-120 words). NO subheadings, NO paragraph breaks.',
    patra_formal:
      'औपचारिक पत्र (ICSE Left-Aligned Formal Letter): Strictly left-aligned block order -> प्रेषक पता -> दिनांक -> सेवा में, प्रापक पद व पता -> विषय: (Mandatory!) -> महोदय, -> 2-body paragraphs -> सधन्यवाद / भवदीय या आपका आज्ञाकारी शिष्य / क.ख.ग. NO personal greeting like सादर प्रणाम.',
    patra_informal:
      'अनौपचारिक पत्र (ICSE Left-Aligned Informal Letter): Strictly left-aligned -> प्रेषक पता -> दिनांक -> संबंध-आधारित संबोधन (पूज्य पिताजी / प्रिय मित्र) -> अभिवादन (सादर प्रणाम / सप्रेम नमस्ते / शुभाशीष) -> कुशल-क्षेम व मुख्य संदेश -> आत्मीय समापन / क.ख.ग. NO "विषय:" and NO "सेवा में".',
    soochna:
      'सूचना लेखन (ICSE Boxed Notice): Inside a box -> संस्था का नाम (centered) -> सूचना -> दिनांक (left) -> शीर्षक (centered) -> 3rd-person body covering What, Date, Time, Venue, Contact (~40-60 words) -> नीचे बाएँ जारीकर्ता नाम व पद.',
    diary:
      'डायरी लेखन (ICSE Boxed Diary): Inside a box -> दिनांक व दिन -> समय (रात्रि/सायं) -> प्रिय डायरी, -> 1st-person ("मैं/मुझे") sincere feelings & day event (~70-100 words) -> शुभरात्रि / क.ख.ग.',
    vigyapan:
      'विज्ञापन लेखन (ICSE Boxed Advertisement): Inside a box -> आकर्षक शीर्षक व नारा -> संक्षिप्त बुलेट विशेषताएँ (3-4 crisp bullets, NO essay paragraphs) -> विशेष छूट/ऑफर -> काल्पनिक संपर्क (98XXXXXXXX) व पता (~25-50 words).',
  };

  const activeFormatDesc = formatGuideMap[String(genreId)] || formatGuideMap.kahani;

  try {
    const prompt = `You are a senior ICSE Hindi Board examiner and bilingual writing coach (${grade}, CISCE/ICSE curriculum).
Format Type: "${genreId}"
ICSE Format & Syllabus Standard:
${activeFormatDesc}

Student Input Language Mode: ${inputLanguage === 'hindi' ? 'Hindi (proofread, fix matras/grammar, format per ICSE)' : 'English/Hinglish (translate faithfully into natural ICSE Hindi properly structured in this exact format)'}
Optional Title Provided: "${String(title || '').trim() || 'Not specified'}"
Input Word Count: ${wordCount} words
Student Draft:
"""
${rawText}
"""

YOUR TASKS:
1. "hindiTitle": Accurate Hindi title/heading suitable for this format.
2. "hindiTranslation":
   - If the draft is in English/Hinglish: translate the student's ideas faithfully into clean, accurate ICSE Hindi formatted properly in the exact structure of "${genreId}" (preserve paragraphs/line breaks clearly; if a format part like Date/Subject/Moral/Contact was missing from student input, indicate it cleanly or keep faithful to what student wrote while noting missing elements in formatChecklist).
   - If the draft is already in Hindi: return the corrected, grammatically pure ICSE-formatted Hindi version.
3. "formatChecklist": Evaluate 4 key ICSE format criteria specific to "${genreId}". For each item return { "elementHindi", "elementEnglish", "present": boolean, "noteHindi" }.
4. "spellingCorrections": If Hindi input had spelling/matra/grammar errors, list up to 6 corrections { "originalWord", "correctedWord", "explanationHindi" }. Empty array if none or if English input.
5. "structureFeedback": Detailed 2-3 sentence Hindi evaluation of opening, body flow, and conclusion based on standard ICSE "${genreId}" Praroop.
6. "vocabularySuggestions": Array of 2-4 objects { "originalHindi", "upgradedHindi", "muhavaraOrSynonym", "usageNoteHindi" } suggesting richer Hindi synonyms or Muhavare to elevate expression.
7. "isMeaningful": false ONLY if gibberish, random letters, or nonsensical spam.
8. "overallScore" (0-100), "formatScore" (0-10), "contentScore" (0-10), "languageScore" (0-10), and "level" (e.g., "उत्कृष्ट रचनाकार (ICSE Master)", "दक्ष लेखक (Advanced)", "सशक्त प्रयास (Developing)", "प्रारंभिक प्रयास (Beginner)").
9. Honest, constructive "feedbackHindi", "feedbackEnglish", 2-3 "strengthsHindi"/"strengthsEnglish", and 2-3 "improvementTipsHindi"/"improvementTipsEnglish" mentioning ICSE format accuracy & word-count guidance for ${grade}.`;

    const parsed = await generateJsonFast(
      prompt,
      {
        type: Type.OBJECT,
        properties: {
          hindiTitle: { type: Type.STRING },
          hindiTranslation: { type: Type.STRING },
          isMeaningful: { type: Type.BOOLEAN },
          overallScore: { type: Type.INTEGER },
          formatScore: { type: Type.INTEGER },
          contentScore: { type: Type.INTEGER },
          languageScore: { type: Type.INTEGER },
          level: { type: Type.STRING },
          formatChecklist: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                elementHindi: { type: Type.STRING },
                elementEnglish: { type: Type.STRING },
                present: { type: Type.BOOLEAN },
                noteHindi: { type: Type.STRING },
              },
              required: ['elementHindi', 'elementEnglish', 'present', 'noteHindi'],
            },
          },
          spellingCorrections: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                originalWord: { type: Type.STRING },
                correctedWord: { type: Type.STRING },
                explanationHindi: { type: Type.STRING },
              },
              required: ['originalWord', 'correctedWord', 'explanationHindi'],
            },
          },
          structureFeedback: { type: Type.STRING },
          vocabularySuggestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                originalHindi: { type: Type.STRING },
                upgradedHindi: { type: Type.STRING },
                muhavaraOrSynonym: { type: Type.STRING },
                usageNoteHindi: { type: Type.STRING },
              },
              required: ['originalHindi', 'upgradedHindi', 'muhavaraOrSynonym', 'usageNoteHindi'],
            },
          },
          feedbackHindi: { type: Type.STRING },
          feedbackEnglish: { type: Type.STRING },
          strengthsHindi: { type: Type.ARRAY, items: { type: Type.STRING } },
          strengthsEnglish: { type: Type.ARRAY, items: { type: Type.STRING } },
          improvementTipsHindi: { type: Type.ARRAY, items: { type: Type.STRING } },
          improvementTipsEnglish: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: [
          'hindiTitle',
          'hindiTranslation',
          'isMeaningful',
          'overallScore',
          'formatScore',
          'contentScore',
          'languageScore',
          'level',
          'formatChecklist',
          'spellingCorrections',
          'structureFeedback',
          'vocabularySuggestions',
          'feedbackHindi',
          'feedbackEnglish',
          'strengthsHindi',
          'strengthsEnglish',
          'improvementTipsHindi',
          'improvementTipsEnglish',
        ],
      },
      22000
    );

    if (!parsed || !parsed.hindiTranslation) {
      throw new Error('Incomplete AI katha-shilpi review response');
    }

    const score = Math.min(100, Math.max(0, Number(parsed.overallScore) || 65));
    const meaningful = parsed.isMeaningful !== false;
    const shortFormat = genreId === 'vigyapan' || genreId === 'soochna';

    let coinsAwarded = 0;
    if (meaningful && wordCount >= 5) {
      let lengthCoins = 2;
      if (shortFormat) {
        if (wordCount >= 35) lengthCoins = 12;
        else if (wordCount >= 20) lengthCoins = 8;
        else if (wordCount >= 10) lengthCoins = 4;
      } else {
        if (wordCount >= 160) lengthCoins = 15;
        else if (wordCount >= 90) lengthCoins = 11;
        else if (wordCount >= 45) lengthCoins = 7;
        else if (wordCount >= 20) lengthCoins = 4;
      }

      let qualityCoins = 1;
      if (score >= 90) qualityCoins = 10;
      else if (score >= 80) qualityCoins = 7;
      else if (score >= 65) qualityCoins = 4;
      else if (score >= 50) qualityCoins = 2;

      coinsAwarded = Math.min(25, Math.max(1, lengthCoins + qualityCoins));
    }

    return res.json({
      success: true,
      genreId,
      wordCount,
      hindiTitle: parsed.hindiTitle || title || 'मेरी रचना',
      hindiTranslation: parsed.hindiTranslation,
      overallScore: score,
      rubricScores: {
        format: Math.min(10, Math.max(0, Number(parsed.formatScore) || 7)),
        content: Math.min(10, Math.max(0, Number(parsed.contentScore) || 7)),
        language: Math.min(10, Math.max(0, Number(parsed.languageScore) || 7)),
      },
      level: parsed.level || 'सशक्त प्रयास (Developing Writer)',
      isMeaningful: meaningful,
      coinsAwarded,
      formatChecklist: Array.isArray(parsed.formatChecklist) ? parsed.formatChecklist : [],
      spellingCorrections: Array.isArray(parsed.spellingCorrections) ? parsed.spellingCorrections : [],
      structureFeedback: parsed.structureFeedback || '',
      vocabularySuggestions: Array.isArray(parsed.vocabularySuggestions) ? parsed.vocabularySuggestions : [],
      feedbackHindi: parsed.feedbackHindi,
      feedbackEnglish: parsed.feedbackEnglish,
      strengthsHindi: Array.isArray(parsed.strengthsHindi) ? parsed.strengthsHindi : [],
      strengthsEnglish: Array.isArray(parsed.strengthsEnglish) ? parsed.strengthsEnglish : [],
      improvementTipsHindi: Array.isArray(parsed.improvementTipsHindi) ? parsed.improvementTipsHindi : [],
      improvementTipsEnglish: Array.isArray(parsed.improvementTipsEnglish) ? parsed.improvementTipsEnglish : [],
    });
  } catch (err: any) {
    if (isAuthOrConfigError(err)) {
      console.error('AI katha-shilpi-review config error:', err?.message);
    } else {
      logAiFallback('katha-shilpi-review', err);
    }
    return res.status(503).json({
      error: 'रचना अनुवाद व समीक्षा करने में अस्थायी त्रुटि हुई। कृपया पुनः प्रयास करें।',
    });
  }
});

// 10c. Katha Shilpi AI — Handwritten Upload (JPG / PNG / PDF) Multimodal OCR & ICSE Evaluation
app.post('/api/ai/katha-shilpi-handwritten', async (req: Request, res: Response) => {
  const {
    dataUrl = '',
    mimeType = '',
    fileName = 'handwritten-work',
    genreId = 'anuched',
    title = '',
    grade = 'कक्षा 8',
    wordLimit = 120,
  } = req.body || {};

  const rawMime = String(mimeType || '').trim().toLowerCase();
  const normalizedMime = rawMime === 'image/jpg' ? 'image/jpeg' : rawMime;
  const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'application/pdf'];

  if (!ALLOWED_MIMES.includes(normalizedMime)) {
    return res.status(400).json({
      error: 'केवल JPG, PNG या PDF प्रारूप में हस्तलिखित कॉपी अपलोड करें। (Only JPG, PNG, or PDF files are supported.)',
    });
  }

  let base64Data = String(dataUrl || '').trim();
  const dataUriMatch = base64Data.match(/^data:([^;]+);base64,(.+)$/i);
  if (dataUriMatch) {
    base64Data = dataUriMatch[2].trim();
  }

  if (!base64Data || base64Data.length < 32) {
    return res.status(400).json({
      error: 'अमान्य या खाली फ़ाइल डेटा। कृपया स्पष्ट फ़ोटो या PDF पुनः अपलोड करें।',
    });
  }

  let decodedBytes = 0;
  try {
    decodedBytes = Buffer.from(base64Data, 'base64').byteLength;
  } catch {
    decodedBytes = 0;
  }
  const MAX_BYTES = 6 * 1024 * 1024; // 6 MB limit
  if (decodedBytes <= 0 || decodedBytes > MAX_BYTES) {
    return res.status(400).json({
      error: 'फ़ाइल का आकार अधिकतम 6 MB से कम होना चाहिए। (File must be under 6 MB.)',
    });
  }

  if (!ai) {
    return res.status(503).json({
      error: 'हस्तलिखित OCR एआई सेवा अभी उपलब्ध नहीं है। कृपया कुछ क्षण बाद पुनः प्रयास करें।',
    });
  }

  const formatGuideMap: Record<string, string> = {
    nibandh: 'निबंध लेखन (ICSE Essay): शीर्षक -> प्रस्तावना -> 2-3 मध्य अनुच्छेद -> संतुलित उपसंहार।',
    kahani: 'कहानी लेखन (ICSE Story): आकर्षक शीर्षक -> सुसंगत काल व संवाद -> सटीक 1-पंक्ति शिक्षा।',
    anuched: 'अनुच्छेद लेखन (ICSE Single Paragraph): शीर्षक -> केवल एक समेकित अनुच्छेद (बिना उपशीर्षक)।',
    patra_formal: 'औपचारिक पत्र (ICSE Left-Aligned Formal Letter): प्रेषक पता -> दिनांक -> सेवा में -> विषय: -> महोदय, -> मुख्य भाग -> भवदीय/क.ख.ग.।',
    patra_informal: 'अनौपचारिक पत्र (ICSE Left-Aligned Informal Letter): प्रेषक पता -> दिनांक -> संबोधन -> अभिवादन -> संदेश -> समापन/क.ख.ग.।',
    soochna: 'सूचना लेखन (ICSE Boxed Notice): बॉक्स सीमा -> संस्था का नाम -> सूचना -> दिनांक -> शीर्षक -> मुख्य विवरण -> जारीकर्ता पद।',
    diary: 'डायरी लेखन (ICSE Boxed Diary): बॉक्स सीमा -> दिनांक व दिन -> समय -> प्रिय डायरी, -> आत्मीय अनुभव -> शुभरात्रि।',
    vigyapan: 'विज्ञापन लेखन (ICSE Boxed Advertisement): बॉक्स सीमा -> आकर्षक शीर्षक व नारा -> संक्षिप्त विशेषताएँ -> छूट/संपर्क।',
  };

  const activeFormatDesc = formatGuideMap[String(genreId)] || formatGuideMap.anuched;

  try {
    const prompt = `You are a senior ICSE Hindi Board examiner and expert Devanagari handwriting OCR specialist (${grade}).
Attached is a student's handwritten Hindi composition (${String(fileName).slice(0, 80)}).
Target Format: "${genreId}" (${activeFormatDesc})
Optional Topic/Title: "${String(title || '').trim() || 'Not specified'}"
Target Word Limit: ~${Number(wordLimit) || 120} words.

PERFORM ACCURATE MULTIMODAL HANDWRITTEN HINDI OCR & STRUCTURED ICSE EVALUATION:
1. "transcribedText": Transcribe the handwritten Hindi text faithfully in Devanagari script, preserving line breaks and visible spelling/matras as actually written by the student (do NOT silently fix errors inside transcribedText so the student sees exactly what the AI read). If the image has NO legible Hindi/English writing or is blank/blurry, set isMeaningful=false and explain clearly.
2. "hindiTitle": Detected or appropriate Hindi title.
3. "hindiTranslation": Clean, corrected, board-ready ICSE version of the student's transcribed composition.
4. "grammarErrors": Up to 8 specific spelling (*matra*), punctuation, karak, ling-vachan, or kaal errors observed in the handwriting as { "originalWord", "correctedWord", "explanationHindi" }.
5. "structureFeedback": Detailed Hindi evaluation of Opening (प्रारंभ), Body (मध्य विस्तार), and Conclusion (उपसंहार/समापन) against the standard ICSE "${genreId}" Praroop.
6. "formatChecklist": 4 ICSE Praroop elements as { "elementHindi", "elementEnglish", "present": boolean, "noteHindi" }.
7. "vocabularySuggestions": 3-5 concrete Hindi synonyms (*पर्यायवाची*) or idioms (*मुहावरे*) that can replace plain expressions in their writing as { "originalHindi", "upgradedHindi", "muhavaraOrSynonym", "usageNoteHindi" }.
8. Scores: "overallScore" (0-100), "formatScore" (0-10), "contentScore" (0-10), "languageScore" (0-10), "vyakaranVartaniScore" (0-10), "praroopScore" (0-10), "shabdavaliBhavScore" (0-10).
9. "level", "isMeaningful" (boolean), "feedbackHindi", "feedbackEnglish", 2-3 "strengthsHindi"/"strengthsEnglish", and 2-3 "improvementTipsHindi"/"improvementTipsEnglish".`;

    const parsed = await generateJsonMultimodal(
      [
        {
          inlineData: {
            mimeType: normalizedMime,
            data: base64Data,
          },
        },
        { text: prompt },
      ],
      {
        type: Type.OBJECT,
        properties: {
          transcribedText: { type: Type.STRING },
          hindiTitle: { type: Type.STRING },
          hindiTranslation: { type: Type.STRING },
          isMeaningful: { type: Type.BOOLEAN },
          overallScore: { type: Type.INTEGER },
          formatScore: { type: Type.INTEGER },
          contentScore: { type: Type.INTEGER },
          languageScore: { type: Type.INTEGER },
          vyakaranVartaniScore: { type: Type.INTEGER },
          praroopScore: { type: Type.INTEGER },
          shabdavaliBhavScore: { type: Type.INTEGER },
          level: { type: Type.STRING },
          formatChecklist: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                elementHindi: { type: Type.STRING },
                elementEnglish: { type: Type.STRING },
                present: { type: Type.BOOLEAN },
                noteHindi: { type: Type.STRING },
              },
              required: ['elementHindi', 'elementEnglish', 'present', 'noteHindi'],
            },
          },
          grammarErrors: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                originalWord: { type: Type.STRING },
                correctedWord: { type: Type.STRING },
                explanationHindi: { type: Type.STRING },
              },
              required: ['originalWord', 'correctedWord', 'explanationHindi'],
            },
          },
          structureFeedback: { type: Type.STRING },
          vocabularySuggestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                originalHindi: { type: Type.STRING },
                upgradedHindi: { type: Type.STRING },
                muhavaraOrSynonym: { type: Type.STRING },
                usageNoteHindi: { type: Type.STRING },
              },
              required: ['originalHindi', 'upgradedHindi', 'muhavaraOrSynonym', 'usageNoteHindi'],
            },
          },
          feedbackHindi: { type: Type.STRING },
          feedbackEnglish: { type: Type.STRING },
          strengthsHindi: { type: Type.ARRAY, items: { type: Type.STRING } },
          strengthsEnglish: { type: Type.ARRAY, items: { type: Type.STRING } },
          improvementTipsHindi: { type: Type.ARRAY, items: { type: Type.STRING } },
          improvementTipsEnglish: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: [
          'transcribedText',
          'hindiTitle',
          'hindiTranslation',
          'isMeaningful',
          'overallScore',
          'formatScore',
          'contentScore',
          'languageScore',
          'vyakaranVartaniScore',
          'praroopScore',
          'shabdavaliBhavScore',
          'level',
          'formatChecklist',
          'grammarErrors',
          'structureFeedback',
          'vocabularySuggestions',
          'feedbackHindi',
          'feedbackEnglish',
          'strengthsHindi',
          'strengthsEnglish',
          'improvementTipsHindi',
          'improvementTipsEnglish',
        ],
      },
      30000
    );

    if (!parsed || typeof parsed.transcribedText !== 'string') {
      throw new Error('Incomplete multimodal OCR response');
    }

    const transcribed = parsed.transcribedText.trim();
    const wordCount = transcribed ? transcribed.split(/\s+/).filter(Boolean).length : 0;
    const score = Math.min(100, Math.max(0, Number(parsed.overallScore) || 65));
    const meaningful = parsed.isMeaningful !== false && wordCount >= 5;
    const shortFormat = genreId === 'vigyapan' || genreId === 'soochna';

    let coinsAwarded = 0;
    if (meaningful) {
      let lengthCoins = 4;
      if (shortFormat) {
        if (wordCount >= 35) lengthCoins = 12;
        else if (wordCount >= 20) lengthCoins = 8;
      } else {
        if (wordCount >= 140) lengthCoins = 15;
        else if (wordCount >= 80) lengthCoins = 12;
        else if (wordCount >= 40) lengthCoins = 8;
      }
      const qualityCoins = score >= 90 ? 10 : score >= 80 ? 7 : score >= 65 ? 5 : 2;
      coinsAwarded = Math.min(25, Math.max(3, lengthCoins + qualityCoins));
    }

    const grammarErrs = Array.isArray(parsed.grammarErrors) ? parsed.grammarErrors : [];

    return res.json({
      success: true,
      submissionMode: 'handwritten',
      genreId,
      wordCount,
      transcribedText: transcribed,
      hindiTitle: parsed.hindiTitle || title || 'हस्तलिखित रचना',
      hindiTranslation: parsed.hindiTranslation || transcribed,
      overallScore: score,
      rubricScores: {
        format: Math.min(10, Math.max(0, Number(parsed.formatScore) || 7)),
        content: Math.min(10, Math.max(0, Number(parsed.contentScore) || 7)),
        language: Math.min(10, Math.max(0, Number(parsed.languageScore) || 7)),
        vyakaranVartani: Math.min(10, Math.max(0, Number(parsed.vyakaranVartaniScore) || 7)),
        praroop: Math.min(10, Math.max(0, Number(parsed.praroopScore) || 7)),
        shabdavaliBhav: Math.min(10, Math.max(0, Number(parsed.shabdavaliBhavScore) || 7)),
      },
      level: parsed.level || 'सशक्त प्रयास (Developing Writer)',
      isMeaningful: meaningful,
      coinsAwarded,
      formatChecklist: Array.isArray(parsed.formatChecklist) ? parsed.formatChecklist : [],
      grammarErrors: grammarErrs,
      spellingCorrections: grammarErrs,
      structureFeedback: parsed.structureFeedback || '',
      vocabularySuggestions: Array.isArray(parsed.vocabularySuggestions) ? parsed.vocabularySuggestions : [],
      feedbackHindi: parsed.feedbackHindi || '',
      feedbackEnglish: parsed.feedbackEnglish || '',
      strengthsHindi: Array.isArray(parsed.strengthsHindi) ? parsed.strengthsHindi : [],
      strengthsEnglish: Array.isArray(parsed.strengthsEnglish) ? parsed.strengthsEnglish : [],
      improvementTipsHindi: Array.isArray(parsed.improvementTipsHindi) ? parsed.improvementTipsHindi : [],
      improvementTipsEnglish: Array.isArray(parsed.improvementTipsEnglish) ? parsed.improvementTipsEnglish : [],
    });
  } catch (err: any) {
    if (isAuthOrConfigError(err)) {
      console.error('AI katha-shilpi-handwritten config error:', err?.message);
    } else {
      logAiFallback('katha-shilpi-handwritten', err);
    }
    return res.status(503).json({
      error: 'हस्तलिखित कॉपी पढ़ने व मूल्यांकन करने में अस्थायी त्रुटि हुई। कृपया स्पष्ट फ़ोटो के साथ पुनः प्रयास करें।',
    });
  }
});

// ==================== PER-ID PERSISTENCE & PORTAL AUTH STORE ====================
const DATA_DIR = process.env.VERCEL
  ? path.resolve(os.tmpdir(), '.shabdshilp-data')
  : path.resolve(__dirname, '.shabdshilp-data');
const STORE_FILE = path.resolve(DATA_DIR, 'store.json');
if (!STORE_FILE.startsWith(DATA_DIR + path.sep)) {
  throw new Error('Invalid persistence store path');
}

const SESSION_SECRET =
  process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');
const PORTAL_PASSCODE_SALT = 'shabdshilp-portal-v1';
const DEFAULT_PORTAL_PASSCODE_SCRYPT_HEX =
  '00eb0673a4587ef90a00f046fce71b162ae3f6dc2ac31c8168287f69fad59d79243ede0e09fab9cc8c3e9d83543de463fd6b3a1bf559970369d181be221982da';

interface PersistedUserRecord {
  email: string;
  userName: string;
  grade: string;
  section: string;
  role: 'student' | 'teacher';
  isTeacher: boolean;
  updatedAt: string;
  progress: Record<string, any> | null;
  progressUpdatedAtMs: number;
  customWorksheets: any[];
}

interface PersistedServerStore {
  users: Record<string, PersistedUserRecord>;
  teacherWorksheets: Record<string, any[]>;
  submissions: any[];
  creativeHomeworks: any[];
  creativeSubmissions: any[];
}

function createEmptyStore(): PersistedServerStore {
  return {
    users: {},
    teacherWorksheets: {},
    submissions: [],
    creativeHomeworks: [],
    creativeSubmissions: [],
  };
}

let cachedStore: PersistedServerStore | null = null;

function readServerStore(): PersistedServerStore {
  if (cachedStore) return cachedStore;
  try {
    if (fs.existsSync(STORE_FILE)) {
      const raw = fs.readFileSync(STORE_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      cachedStore = {
        users: parsed?.users && typeof parsed.users === 'object' ? parsed.users : {},
        teacherWorksheets:
          parsed?.teacherWorksheets && typeof parsed.teacherWorksheets === 'object'
            ? parsed.teacherWorksheets
            : {},
        submissions: Array.isArray(parsed?.submissions) ? parsed.submissions : [],
        creativeHomeworks: Array.isArray(parsed?.creativeHomeworks) ? parsed.creativeHomeworks : [],
        creativeSubmissions: Array.isArray(parsed?.creativeSubmissions) ? parsed.creativeSubmissions : [],
      };
      return cachedStore;
    }
  } catch (err) {
    console.warn('Server store load warning, initializing fresh store:', err);
  }
  cachedStore = createEmptyStore();
  return cachedStore;
}

function writeServerStore(store: PersistedServerStore): void {
  cachedStore = store;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tmpFile = path.resolve(DATA_DIR, `store.${process.pid}.${Date.now()}.tmp`);
    if (!tmpFile.startsWith(DATA_DIR + path.sep)) return;
    fs.writeFileSync(tmpFile, JSON.stringify(store), 'utf8');
    fs.renameSync(tmpFile, STORE_FILE);
  } catch (err) {
    console.warn('Server store write warning:', err);
  }
}

function isValidShabdshilpEmail(emailStr: unknown): emailStr is string {
  if (typeof emailStr !== 'string') return false;
  return /^[^\s@]+@shabdshilp\.com$/.test(emailStr.trim().toLowerCase());
}

function isTeacherEmailServer(emailStr: string): boolean {
  const lower = emailStr.trim().toLowerCase();
  return (
    lower.includes('.1') ||
    lower.includes('_1') ||
    lower.startsWith('kiran') ||
    lower.includes('teacher') ||
    lower.includes('shikshak')
  );
}

function verifyPortalPasscode(inputPasscode: string): boolean {
  const configured = process.env.SHABDSHILP_PORTAL_PASSCODE;
  if (configured && configured.trim().length > 0) {
    const a = crypto.createHash('sha256').update(inputPasscode).digest();
    const b = crypto.createHash('sha256').update(configured).digest();
    return crypto.timingSafeEqual(a, b);
  }
  const derived = crypto.scryptSync(inputPasscode, PORTAL_PASSCODE_SALT, 64);
  const expected = Buffer.from(DEFAULT_PORTAL_PASSCODE_SCRYPT_HEX, 'hex');
  if (derived.length !== expected.length) return false;
  return crypto.timingSafeEqual(derived, expected);
}

interface PortalTokenPayload {
  email: string;
  isTeacher: boolean;
  exp: number;
}

function signPortalToken(payload: PortalTokenPayload): string {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(body)
    .digest('base64url');
  return `${body}.${sig}`;
}

function verifyPortalToken(token: string): PortalTokenPayload | null {
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [body, sig] = parts;
  if (!body || !sig) return null;
  const expectedSig = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(body)
    .digest('base64url');
  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return null;
  }
  try {
    const decoded = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (
      !decoded ||
      !isValidShabdshilpEmail(decoded.email) ||
      typeof decoded.exp !== 'number' ||
      Date.now() > decoded.exp
    ) {
      return null;
    }
    return {
      email: decoded.email.trim().toLowerCase(),
      isTeacher: Boolean(decoded.isTeacher),
      exp: decoded.exp,
    };
  } catch {
    return null;
  }
}

interface AuthedRequest extends Request {
  portalUser?: PortalTokenPayload;
}

function requirePortalAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const authHeader = String(req.headers.authorization || '');
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  const verified = verifyPortalToken(match[1].trim());
  if (!verified) {
    return res.status(401).json({ error: 'Session expired or invalid' });
  }
  req.portalUser = verified;
  next();
}

function sanitizeServerProgress(progress: any): Record<string, any> | null {
  if (!progress || typeof progress !== 'object' || Array.isArray(progress)) {
    return null;
  }
  const cloned = JSON.parse(JSON.stringify(progress));
  if (Array.isArray(cloned.gadyanshHistory)) cloned.gadyanshHistory = cloned.gadyanshHistory.slice(-50);
  if (Array.isArray(cloned.badgesEarned)) cloned.badgesEarned = cloned.badgesEarned.slice(0, 30);
  if (Array.isArray(cloned.unlockedWorksheetIds)) cloned.unlockedWorksheetIds = cloned.unlockedWorksheetIds.slice(0, 100);
  if (Array.isArray(cloned.savedReports)) cloned.savedReports = cloned.savedReports.slice(0, 30);
  if (Array.isArray(cloned.completedSimulationModules)) {
    cloned.completedSimulationModules = Array.from(
      new Set(cloned.completedSimulationModules.filter((id: unknown) => typeof id === 'string'))
    ).slice(0, 50);
  }
  if (
    cloned.completedWorksheetResults &&
    typeof cloned.completedWorksheetResults === 'object' &&
    !Array.isArray(cloned.completedWorksheetResults)
  ) {
    cloned.completedWorksheetResults = Object.fromEntries(
      Object.entries(cloned.completedWorksheetResults).slice(-50)
    );
  }
  if (Array.isArray(cloned.workbookAttempts)) {
    cloned.workbookAttempts = cloned.workbookAttempts.slice(0, 40);
  }
  if (Array.isArray(cloned.kathaShilpiPortfolio)) {
    cloned.kathaShilpiPortfolio = cloned.kathaShilpiPortfolio.slice(0, 30);
  }
  return cloned;
}

// @shabdshilp.com Portal Login (returns HMAC session token + saved per-ID profile)
app.post('/api/auth/shabdshilp-login', (req: Request, res: Response) => {
  const {
    email,
    password,
    userName,
    grade,
    section,
    nameTouched,
    gradeTouched,
    sectionTouched,
    honorific,
    honorificTouched,
  } = req.body || {};

  if (!isValidShabdshilpEmail(email)) {
    return res.status(400).json({
      error: 'केवल @shabdshilp.com ईमेल आईडी से ही लॉगिन की अनुमति है।',
    });
  }

  if (typeof password !== 'string' || !verifyPortalPasscode(password)) {
    return res.status(401).json({
      error: 'गलत पासवर्ड! कृपया सही पासवर्ड दर्ज करें (Incorrect password).',
    });
  }

  const normEmail = email.trim().toLowerCase();
  const isTeacher = isTeacherEmailServer(normEmail);
  const store = readServerStore();
  const existing = store.users[normEmail];

  const cleanInputName = typeof userName === 'string' ? userName.trim().slice(0, 100) : '';
  const cleanInputGrade = typeof grade === 'string' && grade.trim() ? grade.trim().slice(0, 30) : 'कक्षा 8';
  const cleanInputSection = typeof section === 'string' && section.trim() ? section.trim().slice(0, 30) : 'सेक्शन A';

  const resolvedName =
    nameTouched && cleanInputName
      ? cleanInputName
      : existing?.userName || cleanInputName || normEmail.split('@')[0];

  const finalName =
    isTeacher && honorificTouched && (honorific === 'sir' || honorific === 'madam')
      ? `${resolvedName.replace(/\s+(मैम|सर|Madam|Sir)$/gi, '').trim() || 'किरण'} ${honorific === 'sir' ? 'सर' : 'मैम'}`
      : resolvedName;

  const resolvedGrade = gradeTouched
    ? cleanInputGrade
    : (existing?.progress?.selectedGrade as string) || existing?.grade || cleanInputGrade;
  const resolvedSection = sectionTouched
    ? cleanInputSection
    : existing?.section || cleanInputSection;

  const updatedRecord: PersistedUserRecord = {
    email: normEmail,
    userName: finalName,
    grade: resolvedGrade,
    section: resolvedSection,
    role: isTeacher ? 'teacher' : 'student',
    isTeacher,
    updatedAt: new Date().toISOString(),
    progress: existing?.progress || null,
    progressUpdatedAtMs: existing?.progressUpdatedAtMs || 0,
    customWorksheets: Array.isArray(existing?.customWorksheets) ? existing.customWorksheets : [],
  };

  store.users[normEmail] = updatedRecord;
  writeServerStore(store);

  const token = signPortalToken({
    email: normEmail,
    isTeacher,
    exp: Date.now() + 24 * 60 * 60 * 1000,
  });

  return res.json({
    token,
    user: {
      email: normEmail,
      userName: updatedRecord.userName,
      grade: updatedRecord.grade,
      section: updatedRecord.section,
      role: updatedRecord.role,
      isTeacher: updatedRecord.isTeacher,
    },
    hasSavedProgress: Boolean(updatedRecord.progress),
  });
});

// Load saved progress, profile & custom worksheets for authenticated @shabdshilp.com ID
app.get('/api/id-store/progress', requirePortalAuth, (req: AuthedRequest, res: Response) => {
  const normEmail = req.portalUser!.email;
  const store = readServerStore();
  const record = store.users[normEmail];
  return res.json({
    email: normEmail,
    progress: record?.progress || null,
    progressUpdatedAtMs: record?.progressUpdatedAtMs || 0,
    profile: record
      ? {
          userName: record.userName,
          grade: record.grade,
          section: record.section,
          role: record.role,
          isTeacher: record.isTeacher,
        }
      : null,
    customWorksheets: Array.isArray(record?.customWorksheets) ? record.customWorksheets : [],
  });
});

// Save progress for authenticated @shabdshilp.com ID
app.put('/api/id-store/progress', requirePortalAuth, (req: AuthedRequest, res: Response) => {
  const normEmail = req.portalUser!.email;
  const sanitized = sanitizeServerProgress(req.body?.progress);
  if (!sanitized) {
    return res.status(400).json({ error: 'Invalid progress payload' });
  }

  const store = readServerStore();
  const existing = store.users[normEmail];
  const nowMs = Date.now();
  const nextGrade =
    typeof sanitized.selectedGrade === 'string' && sanitized.selectedGrade.trim()
      ? sanitized.selectedGrade.trim().slice(0, 30)
      : existing?.grade || 'कक्षा 8';
  const nextName =
    typeof sanitized.userName === 'string' && sanitized.userName.trim()
      ? sanitized.userName.trim().slice(0, 100)
      : existing?.userName || normEmail.split('@')[0];

  store.users[normEmail] = {
    email: normEmail,
    userName: existing?.userName || nextName,
    grade: nextGrade,
    section: existing?.section || 'सेक्शन A',
    role: req.portalUser!.isTeacher ? 'teacher' : 'student',
    isTeacher: req.portalUser!.isTeacher,
    updatedAt: new Date().toISOString(),
    progress: sanitized,
    progressUpdatedAtMs: nowMs,
    customWorksheets: Array.isArray(existing?.customWorksheets) ? existing.customWorksheets : [],
  };

  writeServerStore(store);
  return res.json({ ok: true, updatedAtMs: nowMs });
});

// Update profile (grade / userName / section) for authenticated @shabdshilp.com ID
app.put('/api/id-store/profile', requirePortalAuth, (req: AuthedRequest, res: Response) => {
  const normEmail = req.portalUser!.email;
  const store = readServerStore();
  const existing = store.users[normEmail];

  const nextName =
    typeof req.body?.userName === 'string' && req.body.userName.trim()
      ? req.body.userName.trim().slice(0, 100)
      : existing?.userName || normEmail.split('@')[0];
  const nextGrade =
    typeof req.body?.grade === 'string' && req.body.grade.trim()
      ? req.body.grade.trim().slice(0, 30)
      : existing?.grade || 'कक्षा 8';
  const nextSection =
    typeof req.body?.section === 'string' && req.body.section.trim()
      ? req.body.section.trim().slice(0, 30)
      : existing?.section || 'सेक्शन A';

  const nextProgress = existing?.progress ? { ...existing.progress, selectedGrade: nextGrade } : null;

  store.users[normEmail] = {
    email: normEmail,
    userName: nextName,
    grade: nextGrade,
    section: nextSection,
    role: req.portalUser!.isTeacher ? 'teacher' : 'student',
    isTeacher: req.portalUser!.isTeacher,
    updatedAt: new Date().toISOString(),
    progress: nextProgress,
    progressUpdatedAtMs: existing?.progressUpdatedAtMs || Date.now(),
    customWorksheets: Array.isArray(existing?.customWorksheets) ? existing.customWorksheets : [],
  };

  writeServerStore(store);
  return res.json({ ok: true });
});

// Custom worksheets for authenticated @shabdshilp.com ID
app.get('/api/id-store/custom-worksheets', requirePortalAuth, (req: AuthedRequest, res: Response) => {
  const normEmail = req.portalUser!.email;
  const store = readServerStore();
  const list = store.users[normEmail]?.customWorksheets || [];
  return res.json({ worksheets: list });
});

app.put('/api/id-store/custom-worksheets', requirePortalAuth, (req: AuthedRequest, res: Response) => {
  const normEmail = req.portalUser!.email;
  const ws = req.body?.worksheet;
  if (!ws || typeof ws !== 'object' || !ws.id) {
    return res.status(400).json({ error: 'Invalid worksheet' });
  }
  const store = readServerStore();
  const existing = store.users[normEmail] || {
    email: normEmail,
    userName: normEmail.split('@')[0],
    grade: 'कक्षा 8',
    section: 'सेक्शन A',
    role: req.portalUser!.isTeacher ? 'teacher' : 'student',
    isTeacher: req.portalUser!.isTeacher,
    updatedAt: new Date().toISOString(),
    progress: null,
    progressUpdatedAtMs: 0,
    customWorksheets: [],
  };
  const filtered = (existing.customWorksheets || []).filter((item: any) => item?.id !== ws.id);
  existing.customWorksheets = [ws, ...filtered].slice(0, 50);
  store.users[normEmail] = existing;
  writeServerStore(store);
  return res.json({ ok: true });
});

app.delete('/api/id-store/custom-worksheets/:id', requirePortalAuth, (req: AuthedRequest, res: Response) => {
  const normEmail = req.portalUser!.email;
  const wsId = String(req.params.id || '');
  const store = readServerStore();
  const existing = store.users[normEmail];
  if (existing && Array.isArray(existing.customWorksheets)) {
    existing.customWorksheets = existing.customWorksheets.filter((item: any) => item?.id !== wsId);
    writeServerStore(store);
  }
  return res.json({ ok: true });
});

// Teacher worksheets (teacher-scoped & global active catalog) for authenticated @shabdshilp.com IDs
app.get('/api/id-store/teacher-worksheets', requirePortalAuth, (req: AuthedRequest, res: Response) => {
  const normEmail = req.portalUser!.email;
  const scope = String(req.query.scope || 'all');
  const store = readServerStore();
  if (scope === 'mine') {
    return res.json({ worksheets: store.teacherWorksheets[normEmail] || [] });
  }
  const merged: any[] = [];
  for (const list of Object.values(store.teacherWorksheets)) {
    if (Array.isArray(list)) merged.push(...list);
  }
  return res.json({ worksheets: merged.slice(0, 200) });
});

app.put('/api/id-store/teacher-worksheets', requirePortalAuth, (req: AuthedRequest, res: Response) => {
  if (!req.portalUser!.isTeacher) {
    return res.status(403).json({ error: 'Only teachers can update teacher worksheets' });
  }
  const normEmail = req.portalUser!.email;
  const list = Array.isArray(req.body?.worksheets) ? req.body.worksheets.slice(0, 100) : [];
  const store = readServerStore();
  store.teacherWorksheets[normEmail] = list.map((w: any) => ({
    ...w,
    teacherEmail: normEmail,
  }));
  writeServerStore(store);
  return res.json({ ok: true });
});

// Student submissions (role-isolated) for authenticated @shabdshilp.com IDs
app.get('/api/id-store/submissions', requirePortalAuth, (req: AuthedRequest, res: Response) => {
  const normEmail = req.portalUser!.email;
  const store = readServerStore();
  const list = req.portalUser!.isTeacher
    ? store.submissions
    : store.submissions.filter(
        (s: any) => String(s?.studentEmail || '').trim().toLowerCase() === normEmail
      );
  return res.json({ submissions: list });
});

app.post('/api/id-store/submissions', requirePortalAuth, (req: AuthedRequest, res: Response) => {
  const normEmail = req.portalUser!.email;
  const sub = req.body?.submission;
  if (!sub || typeof sub !== 'object' || !sub.worksheetId) {
    return res.status(400).json({ error: 'Invalid submission payload' });
  }
  const store = readServerStore();
  const keyExists = store.submissions.some(
    (s: any) =>
      s?.worksheetId === sub.worksheetId &&
      String(s?.studentEmail || '').trim().toLowerCase() === normEmail
  );
  if (keyExists) {
    return res.json({ ok: true, alreadyLocked: true });
  }
  store.submissions.unshift({
    ...sub,
    studentEmail: normEmail,
    updatedAt: new Date().toISOString(),
  });
  store.submissions = store.submissions.slice(0, 500);
  writeServerStore(store);
  return res.json({ ok: true });
});

// Creative Writing Homeworks (teacher-created, student-readable)
app.get('/api/id-store/creative-homeworks', requirePortalAuth, (_req: AuthedRequest, res: Response) => {
  const store = readServerStore();
  return res.json({ homeworks: store.creativeHomeworks || [] });
});

app.post('/api/id-store/creative-homeworks', requirePortalAuth, (req: AuthedRequest, res: Response) => {
  if (!req.portalUser!.isTeacher) {
    return res.status(403).json({ error: 'Only teachers can assign creative writing homework' });
  }
  const hw = req.body?.homework;
  if (!hw || typeof hw !== 'object' || !hw.id || !hw.titleHindi) {
    return res.status(400).json({ error: 'Invalid creative homework payload' });
  }
  const normEmail = req.portalUser!.email;
  const store = readServerStore();
  const nextItem = {
    ...hw,
    teacherEmail: normEmail,
    updatedAt: new Date().toISOString(),
  };
  store.creativeHomeworks = [
    nextItem,
    ...(store.creativeHomeworks || []).filter((item: any) => item?.id !== hw.id),
  ].slice(0, 150);
  writeServerStore(store);
  return res.json({ ok: true, homework: nextItem });
});

app.delete('/api/id-store/creative-homeworks/:id', requirePortalAuth, (req: AuthedRequest, res: Response) => {
  if (!req.portalUser!.isTeacher) {
    return res.status(403).json({ error: 'Only teachers can delete creative writing homework' });
  }
  const hwId = String(req.params.id || '');
  const store = readServerStore();
  store.creativeHomeworks = (store.creativeHomeworks || []).filter((h: any) => h?.id !== hwId);
  writeServerStore(store);
  return res.json({ ok: true });
});

// Creative Writing Submissions (typed + handwritten OCR evaluations)
app.get('/api/id-store/creative-submissions', requirePortalAuth, (req: AuthedRequest, res: Response) => {
  const normEmail = req.portalUser!.email;
  const store = readServerStore();
  const list = req.portalUser!.isTeacher
    ? store.creativeSubmissions || []
    : (store.creativeSubmissions || []).filter(
        (s: any) => String(s?.studentEmail || '').trim().toLowerCase() === normEmail
      );
  return res.json({ submissions: list });
});

app.post('/api/id-store/creative-submissions', requirePortalAuth, (req: AuthedRequest, res: Response) => {
  const normEmail = req.portalUser!.email;
  const sub = req.body?.submission;
  if (!sub || typeof sub !== 'object' || !sub.id) {
    return res.status(400).json({ error: 'Invalid creative submission payload' });
  }
  const store = readServerStore();
  const safeSub = {
    ...sub,
    studentEmail: normEmail,
    status: sub.status === 'Reviewed' && req.portalUser!.isTeacher ? 'Reviewed' : 'Submitted',
    updatedAt: new Date().toISOString(),
  };
  store.creativeSubmissions = [
    safeSub,
    ...(store.creativeSubmissions || []).filter((item: any) => item?.id !== safeSub.id),
  ].slice(0, 300);
  writeServerStore(store);
  return res.json({ ok: true, submission: safeSub });
});

app.patch('/api/id-store/creative-submissions/:id', requirePortalAuth, (req: AuthedRequest, res: Response) => {
  if (!req.portalUser!.isTeacher) {
    return res.status(403).json({ error: 'Only teachers can review creative submissions' });
  }
  const subId = String(req.params.id || '');
  const { status = 'Reviewed', teacherRemarks = '' } = req.body || {};
  const store = readServerStore();
  let updated: any = null;
  store.creativeSubmissions = (store.creativeSubmissions || []).map((item: any) => {
    if (item?.id !== subId) return item;
    updated = {
      ...item,
      status: status === 'Submitted' ? 'Submitted' : 'Reviewed',
      teacherRemarks: String(teacherRemarks || '').slice(0, 1000),
      updatedAt: new Date().toISOString(),
    };
    return updated;
  });
  if (!updated) {
    return res.status(404).json({ error: 'Submission not found' });
  }
  writeServerStore(store);
  return res.json({ ok: true, submission: updated });
});

// Ensure unknown /api routes always return JSON, never HTML
app.use('/api', (_req: Request, res: Response) => {
  res.status(404).json({ error: 'API route not found' });
});

// Vite Middleware mounting in development or static serving in production
async function setupViteOrStatic() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { 
        middlewareMode: true,
        hmr: false,
        ws: false
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`ShabdShilp Server running on port ${port} [Mode: ${isProduction ? 'production' : 'development'}]`);
  });
}

if (!process.env.VERCEL) {
  setupViteOrStatic().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
}

export default app;
