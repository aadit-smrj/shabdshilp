import React, { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  HelpCircle,
  Lightbulb,
  PanelRightClose,
  PanelRightOpen,
  ScrollText,
  Target,
} from 'lucide-react';
import { BoardType, GradeLevel, GrammarModule, QuizQuestion } from '../types';
import { getBoardSyllabus } from '../data/syllabusData';

export interface GrammarHintSidebarProps {
  currentModule: GrammarModule;
  grade: GradeLevel;
  selectedBoard: BoardType;
  bilingualMode: boolean;
  isOpen: boolean;
  onToggleOpen: () => void;
  suggestedRuleIndex?: number | null;
  activeContextHint?: {
    sourceLabelHindi: string;
    hintHindi: string;
    hintEnglish?: string;
    isCorrection?: boolean;
  } | null;
  lastWrongQuestion?: QuizQuestion | null;
  onJumpToPractice?: () => void;
  darkTheme?: boolean;
}

type HintTab = 'rules' | 'pitfalls' | 'syllabus';

const MODULE_WEIGHTAGE_KEYWORDS: Record<string, string[]> = {
  karak: ['कारक'],
  vakya: ['वाक्य'],
  'vakya-vichar': ['वाक्य-विचार', 'वाक्य'],
  'vakya-ashuddhi': ['वाक्य-विचार', 'अशुद्धि', 'वाक्य'],
  'vakya-shuddhi': ['वाक्य शुद्धि', 'वाक्य'],
  'vakya-parivartan': ['वाक्य-परिवर्तन', 'वाक्य'],
  vachya: ['वाच्य'],
  kaal: ['काल'],
  muhavare: ['मुहावरे'],
  'upsarg-pratyay': ['उपसर्ग'],
  sandhi: ['संधि'],
  samas: ['समास'],
  sangya: ['संज्ञा'],
  sarvanam: ['सर्वनाम'],
  visheshan: ['विशेषण'],
  'visheshan-nirman': ['विशेषण निर्माण', 'विशेषण'],
  ling: ['लिंग'],
  vachan: ['वचन'],
  kriya: ['क्रिया'],
  'kriya-kaal': ['क्रिया', 'काल'],
  'viram-chinh': ['विराम'],
  'shabd-vichar': ['शब्द-विचार', 'शब्द'],
  avikari: ['अविकारी', 'अव्यय'],
  'pad-parichay': ['पद-परिचय'],
  'vartani-shuddhi': ['वर्तनी'],
  paryayvachi: ['पर्यायवाची'],
  vilom: ['विलोम'],
  anekarthi: ['अनेकार्थी'],
  shrutisam: ['श्रुतिसम'],
  'anek-shabd': ['एक शब्द', 'अनेक शब्दों'],
  'shabd-bhandar': ['शब्द भंडार', 'पर्यायवाची', 'विलोम'],
};

export const GrammarHintSidebar: React.FC<GrammarHintSidebarProps> = ({
  currentModule,
  grade,
  selectedBoard,
  bilingualMode,
  isOpen,
  onToggleOpen,
  suggestedRuleIndex = null,
  activeContextHint = null,
  lastWrongQuestion = null,
  onJumpToPractice,
  darkTheme = false,
}) => {
  const [activeTab, setActiveTab] = useState<HintTab>('rules');
  const [focusedRuleIdx, setFocusedRuleIdx] = useState<number>(0);
  const [showHeritageDetails, setShowHeritageDetails] = useState<boolean>(false);

  const rules = currentModule.rulesSummary || [];

  // Reset focused rule when switching topic modules
  useEffect(() => {
    setFocusedRuleIdx(0);
    setActiveTab('rules');
    setShowHeritageDetails(false);
  }, [currentModule.id]);

  // Sync highlighted rule when simulation context changes
  useEffect(() => {
    if (
      typeof suggestedRuleIndex === 'number' &&
      suggestedRuleIndex >= 0 &&
      suggestedRuleIndex < rules.length
    ) {
      setFocusedRuleIdx(suggestedRuleIndex);
    }
  }, [suggestedRuleIndex, rules.length]);

  // Match topic inside board syllabus data for grade-specific hints
  const syllabusMatch = useMemo(() => {
    const syllabus = getBoardSyllabus(selectedBoard, grade);
    const matches: {
      categoryTitleHindi: string;
      nameHindi: string;
      nameEnglish: string;
      descriptionHindi: string;
      descriptionEnglish: string;
    }[] = [];

    for (const cat of syllabus.categories) {
      for (const item of cat.items) {
        if (item.linkedModuleId === currentModule.id) {
          matches.push({
            categoryTitleHindi: cat.titleHindi,
            nameHindi: item.nameHindi,
            nameEnglish: item.nameEnglish,
            descriptionHindi: item.descriptionHindi,
            descriptionEnglish: item.descriptionEnglish,
          });
        }
      }
    }

    const keywords = MODULE_WEIGHTAGE_KEYWORDS[currentModule.id] || [
      currentModule.titleHindi.split(' ')[0],
    ];
    const weightageRow = syllabus.weightage.find((w) =>
      keywords.some((kw) => w.topic.includes(kw))
    );

    const sampleMatch = syllabus.sampleQuestions.find((sq) =>
      keywords.some(
        (kw) =>
          sq.questionTextHindi.includes(kw) ||
          sq.explanationHindi.includes(kw) ||
          sq.modelAnswerHindi.includes(kw)
      )
    );

    return {
      boardFullName: syllabus.boardFullName,
      assessmentPatternHindi: syllabus.assessmentPatternHindi,
      matches,
      weightageRow,
      sampleMatch,
    };
  }, [selectedBoard, grade, currentModule.id, currentModule.titleHindi]);

  if (!isOpen) {
    return (
      <div
        className={`border rounded-2xl p-4 flex items-center justify-between gap-3 ${
          darkTheme
            ? 'bg-[#0B1120] border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="min-w-0">
          <div
            className={`text-xs font-bold truncate ${
              darkTheme ? 'text-slate-100' : 'text-slate-900'
            }`}
          >
            व्याकरण संकेत · {currentModule.titleHindi}
          </div>
          <div
            className={`text-[11px] mt-0.5 tabular-nums ${
              darkTheme ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            {selectedBoard} · {grade} · {rules.length} मुख्य नियम उपलब्ध
          </div>
        </div>
        <button
          type="button"
          onClick={onToggleOpen}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${
            darkTheme
              ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 focus-visible:outline-amber-400'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white focus-visible:outline-indigo-600'
          }`}
        >
          <PanelRightOpen className="w-4 h-4" />
          <span>संकेत खोलें</span>
        </button>
      </div>
    );
  }

  return (
    <aside
      aria-label="Grammar Hint Sidebar"
      className={`border rounded-2xl overflow-hidden lg:sticky lg:top-24 ${
        darkTheme
          ? 'bg-[#0B1120] border-slate-800 text-slate-100'
          : 'bg-white border-slate-200 text-slate-900'
      }`}
    >
      {/* Sidebar Header */}
      <div
        className={`p-4 sm:p-5 border-b flex items-start justify-between gap-3 ${
          darkTheme
            ? 'border-slate-800 bg-[#070B16]'
            : 'border-slate-100 bg-slate-50/60'
        }`}
      >
        <div className="min-w-0 space-y-1">
          <div
            className={`flex items-center gap-1.5 text-xs font-semibold ${
              darkTheme ? 'text-amber-300' : 'text-indigo-700'
            }`}
          >
            <Lightbulb className="w-4 h-4 shrink-0 text-amber-400" />
            <span>संदर्भ-आधारित व्याकरण संकेत</span>
          </div>
          <h3
            className={`text-base font-black font-hindi leading-snug ${
              darkTheme ? 'text-white' : 'text-slate-900'
            }`}
          >
            {currentModule.titleHindi}
          </h3>
          <p
            className={`text-xs tabular-nums ${
              darkTheme ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            <span>{selectedBoard}</span>
            <span aria-hidden="true"> · </span>
            <span>{grade}</span>
            <span aria-hidden="true"> · </span>
            <span>{rules.length} नियम</span>
            {syllabusMatch.weightageRow && (
              <>
                <span aria-hidden="true"> · </span>
                <span>लगभग {syllabusMatch.weightageRow.marks} अंक भार</span>
              </>
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={onToggleOpen}
          aria-expanded={isOpen}
          title="व्याकरण संकेत साइडबार छिपाएँ"
          className={`p-2 rounded-xl transition-colors cursor-pointer shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 ${
            darkTheme
              ? 'text-slate-400 hover:text-white hover:bg-slate-800 focus-visible:outline-amber-400'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 focus-visible:outline-indigo-600'
          }`}
        >
          <PanelRightClose className="w-4 h-4" />
        </button>
      </div>

      {/* Live Context-Aware Cue (appears when user hits a snag in simulation or quick check) */}
      {(activeContextHint || lastWrongQuestion) && (
        <div className="px-4 sm:px-5 py-3.5 bg-amber-50/90 border-b border-amber-200/80 space-y-1.5">
          <div className="flex items-center justify-between gap-2 text-[11px] font-bold text-amber-900">
            <span className="inline-flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>
                {activeContextHint
                  ? activeContextHint.sourceLabelHindi
                  : 'पिछले प्रश्न का त्वरित नियम संकेत'}
              </span>
            </span>
          </div>

          {activeContextHint ? (
            <>
              <p className="text-xs text-slate-900 font-hindi leading-relaxed">
                {activeContextHint.hintHindi}
              </p>
              {bilingualMode && activeContextHint.hintEnglish && (
                <p className="text-[11px] text-slate-600 italic">
                  {activeContextHint.hintEnglish}
                </p>
              )}
            </>
          ) : (
            lastWrongQuestion && (
              <>
                <p className="text-xs text-slate-900 font-hindi leading-relaxed">
                  {lastWrongQuestion.ruleTipHindi || lastWrongQuestion.explanationHindi}
                </p>
                {bilingualMode &&
                  (lastWrongQuestion.ruleTipEnglish || lastWrongQuestion.explanationEnglish) && (
                    <p className="text-[11px] text-slate-600 italic">
                      {lastWrongQuestion.ruleTipEnglish || lastWrongQuestion.explanationEnglish}
                    </p>
                  )}
              </>
            )
          )}
        </div>
      )}

      {/* Segmented Control: Rules | Pitfalls & Sutra | Syllabus */}
      <div className="px-4 sm:px-5 pt-3.5 pb-2">
        <div
          role="tablist"
          aria-label="Grammar Hint Sections"
          className={`grid grid-cols-3 gap-1 p-1 rounded-xl ${
            darkTheme ? 'bg-[#111827] border border-slate-800' : 'bg-slate-100'
          }`}
        >
          {[
            { id: 'rules' as HintTab, label: 'मुख्य नियम', sub: 'Rules' },
            { id: 'pitfalls' as HintTab, label: 'सूत्र व भ्रम', sub: 'Pitfalls' },
            { id: 'syllabus' as HintTab, label: 'पाठ्यक्रम', sub: 'Syllabus' },
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                type="button"
                aria-selected={active}
                onClick={() => setActiveTab(tab.id)}
                className={`px-2 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-1 ${
                  active
                    ? darkTheme
                      ? 'bg-amber-400 text-slate-950 shadow-2xs focus-visible:outline-amber-400'
                      : 'bg-white text-slate-900 shadow-2xs focus-visible:outline-indigo-600'
                    : darkTheme
                    ? 'text-slate-300 hover:text-white focus-visible:outline-amber-400'
                    : 'text-slate-600 hover:text-slate-900 focus-visible:outline-indigo-600'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4 sm:p-5 pt-2 space-y-4">
        {activeTab === 'rules' && (
          <div className="space-y-3">
            {rules.length === 0 ? (
              <p className="text-xs text-slate-500">
                इस विषय के लिए विस्तृत नियम अभी उपलब्ध नहीं हैं।
              </p>
            ) : (
              <div className={`divide-y ${darkTheme ? 'divide-slate-800' : 'divide-slate-100'}`}>
                {rules.map((ruleItem, idx) => {
                  const isFocused = focusedRuleIdx === idx;
                  const isContextMatch =
                    typeof suggestedRuleIndex === 'number' && suggestedRuleIndex === idx;

                  return (
                    <div key={idx} className="py-3 first:pt-1 last:pb-1">
                      <button
                        type="button"
                        onClick={() => setFocusedRuleIdx(idx)}
                        className="w-full text-left cursor-pointer group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 rounded-lg"
                      >
                        <div
                          className={`flex items-center justify-between gap-2 text-[11px] font-bold mb-1 ${
                            darkTheme ? 'text-slate-400' : 'text-slate-500'
                          }`}
                        >
                          <span className="tabular-nums">
                            नियम {idx + 1} / {rules.length}
                            {isContextMatch && ' · सक्रिय संकेत'}
                          </span>
                          <ChevronRight
                            className={`w-3.5 h-3.5 transition-transform ${
                              isFocused
                                ? darkTheme
                                  ? 'rotate-90 text-amber-400'
                                  : 'rotate-90 text-indigo-600'
                                : 'text-slate-400'
                            }`}
                          />
                        </div>

                        <p
                          className={`text-xs sm:text-[13px] font-hindi leading-relaxed transition-colors ${
                            isFocused
                              ? darkTheme
                                ? 'font-bold text-white'
                                : 'font-bold text-slate-950'
                              : darkTheme
                              ? 'font-semibold text-slate-300 group-hover:text-white'
                              : 'font-semibold text-slate-700 group-hover:text-slate-950'
                          }`}
                        >
                          {ruleItem.ruleHindi}
                        </p>
                        {bilingualMode && ruleItem.ruleEnglish && (
                          <p
                            className={`text-[11px] italic mt-0.5 ${
                              darkTheme ? 'text-slate-400' : 'text-slate-500'
                            }`}
                          >
                            {ruleItem.ruleEnglish}
                          </p>
                        )}
                      </button>

                      {isFocused && (
                        <div
                          className={`mt-2.5 p-3 rounded-xl border space-y-1 ${
                            darkTheme
                              ? 'bg-[#111827] border-slate-800'
                              : 'bg-slate-50 border-slate-200/80'
                          }`}
                        >
                          <div
                            className={`text-[11px] font-bold ${
                              darkTheme ? 'text-amber-300' : 'text-indigo-700'
                            }`}
                          >
                            उदाहरण (Example)
                          </div>
                          <p
                            className={`text-xs font-semibold font-hindi ${
                              darkTheme ? 'text-slate-100' : 'text-slate-900'
                            }`}
                          >
                            {ruleItem.exampleHindi}
                          </p>
                          {bilingualMode && ruleItem.exampleEnglish && (
                            <p
                              className={`text-[11px] italic ${
                                darkTheme ? 'text-slate-400' : 'text-slate-500'
                              }`}
                            >
                              {ruleItem.exampleEnglish}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'pitfalls' && (
          <div className="space-y-4">
            {/* Common Bottleneck */}
            <div
              className={`p-3.5 rounded-xl border space-y-1 ${
                darkTheme
                  ? 'bg-rose-950/30 border-rose-500/30'
                  : 'bg-rose-50/60 border-rose-200/80'
              }`}
            >
              <div
                className={`text-xs font-bold ${
                  darkTheme ? 'text-rose-300' : 'text-rose-800'
                }`}
              >
                सामान्य भूल जिससे बचें (Exam Trap)
              </div>
              <p
                className={`text-xs font-hindi leading-relaxed ${
                  darkTheme ? 'text-rose-100' : 'text-slate-800'
                }`}
              >
                {currentModule.bottleneckHindi}
              </p>
              {bilingualMode && currentModule.bottleneckEnglish && (
                <p
                  className={`text-[11px] italic ${
                    darkTheme ? 'text-rose-300/80' : 'text-rose-700/80'
                  }`}
                >
                  {currentModule.bottleneckEnglish}
                </p>
              )}
            </div>

            {/* Classical Rule / Definition */}
            {currentModule.paramparaCorner && (
              <div
                className={`pt-3 border-t space-y-2.5 ${
                  darkTheme ? 'border-slate-800' : 'border-slate-100'
                }`}
              >
                <div
                  className={`text-xs font-bold flex items-center gap-1.5 ${
                    darkTheme ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  <ScrollText
                    className={`w-3.5 h-3.5 shrink-0 ${
                      darkTheme ? 'text-amber-400' : 'text-indigo-600'
                    }`}
                  />
                  <span>मानक परिभाषा एवं व्याकरण सूत्र</span>
                </div>
                <p
                  className={`text-xs font-hindi leading-relaxed ${
                    darkTheme ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  {currentModule.paramparaCorner.definitionHindi}
                </p>
                {bilingualMode && currentModule.paramparaCorner.definitionEnglish && (
                  <p
                    className={`text-[11px] italic ${
                      darkTheme ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    {currentModule.paramparaCorner.definitionEnglish}
                  </p>
                )}

                {currentModule.paramparaCorner.classicalShlokaOrRule && (
                  <div
                    className={`p-3 rounded-xl border text-xs font-semibold font-hindi leading-relaxed ${
                      darkTheme
                        ? 'bg-[#111827] border-slate-800 text-amber-200'
                        : 'bg-slate-50 border-slate-200/80 text-indigo-950'
                    }`}
                  >
                    {currentModule.paramparaCorner.classicalShlokaOrRule}
                  </div>
                )}

                {currentModule.paramparaCorner.heritageContext && (
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowHeritageDetails((p) => !p)}
                      className={`text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer ${
                        darkTheme
                          ? 'text-amber-300 hover:text-amber-200'
                          : 'text-indigo-700 hover:text-indigo-900'
                      }`}
                    >
                      {showHeritageDetails ? (
                        <>
                          <ChevronUp className="w-3.5 h-3.5" />
                          <span>भाषा-परंपरा संदर्भ छिपाएँ</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3.5 h-3.5" />
                          <span>भाषा-परंपरा संदर्भ देखें</span>
                        </>
                      )}
                    </button>
                    {showHeritageDetails && (
                      <p
                        className={`text-[11px] mt-1.5 leading-relaxed font-hindi ${
                          darkTheme ? 'text-slate-300' : 'text-slate-600'
                        }`}
                      >
                        {currentModule.paramparaCorner.heritageContext}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Learning Outcome */}
            <div
              className={`pt-3 border-t space-y-1 ${
                darkTheme ? 'border-slate-800' : 'border-slate-100'
              }`}
            >
              <div
                className={`text-xs font-bold ${
                  darkTheme ? 'text-emerald-300' : 'text-emerald-800'
                }`}
              >
                इस विषय से अपेक्षित दक्षता
              </div>
              <p
                className={`text-xs font-hindi leading-relaxed ${
                  darkTheme ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                {currentModule.whatStudentGainsHindi}
              </p>
              {bilingualMode && currentModule.whatStudentGainsEnglish && (
                <p
                  className={`text-[11px] italic ${
                    darkTheme ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  {currentModule.whatStudentGainsEnglish}
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'syllabus' && (
          <div className="space-y-3.5">
            <div
              className={`text-xs leading-relaxed font-hindi ${
                darkTheme ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              <div
                className={`font-bold mb-1 ${
                  darkTheme ? 'text-white' : 'text-slate-900'
                }`}
              >
                {syllabusMatch.boardFullName}
              </div>
              {syllabusMatch.matches.length > 0 ? (
                <div
                  className={`divide-y ${
                    darkTheme ? 'divide-slate-800' : 'divide-slate-100'
                  }`}
                >
                  {syllabusMatch.matches.map((m, i) => (
                    <div key={i} className="py-2.5 first:pt-1 last:pb-1 space-y-1">
                      <div
                        className={`text-[11px] font-semibold ${
                          darkTheme ? 'text-amber-300' : 'text-indigo-700'
                        }`}
                      >
                        {m.categoryTitleHindi}
                      </div>
                      <div
                        className={`text-xs font-bold ${
                          darkTheme ? 'text-slate-100' : 'text-slate-900'
                        }`}
                      >
                        {m.nameHindi}
                        {bilingualMode && (
                          <span
                            className={`font-normal ${
                              darkTheme ? 'text-slate-400' : 'text-slate-500'
                            }`}
                          >
                            {' '}
                            · {m.nameEnglish}
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-xs leading-relaxed ${
                          darkTheme ? 'text-slate-300' : 'text-slate-700'
                        }`}
                      >
                        {m.descriptionHindi}
                      </p>
                      {bilingualMode && (
                        <p
                          className={`text-[11px] italic ${
                            darkTheme ? 'text-slate-400' : 'text-slate-500'
                          }`}
                        >
                          {m.descriptionEnglish}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p
                  className={`text-xs ${
                    darkTheme ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  {currentModule.subtitleHindi} — {grade} के व्याकरण अभ्यास हेतु शामिल विषय।
                </p>
              )}
            </div>

            {syllabusMatch.sampleMatch && (
              <div
                className={`p-3 rounded-xl border space-y-1.5 ${
                  darkTheme
                    ? 'bg-[#111827] border-slate-800'
                    : 'bg-slate-50 border-slate-200/80'
                }`}
              >
                <div
                  className={`text-[11px] font-bold ${
                    darkTheme ? 'text-amber-300' : 'text-slate-800'
                  }`}
                >
                  बोर्ड नमूना प्रश्न (Board Pattern Sample)
                </div>
                <p
                  className={`text-xs font-hindi ${
                    darkTheme ? 'text-slate-100' : 'text-slate-900'
                  }`}
                >
                  {syllabusMatch.sampleMatch.questionTextHindi}
                </p>
                <p
                  className={`text-[11px] font-semibold font-hindi ${
                    darkTheme ? 'text-emerald-300' : 'text-emerald-800'
                  }`}
                >
                  उत्तर: {syllabusMatch.sampleMatch.modelAnswerHindi}
                </p>
              </div>
            )}

            <div
              className={`pt-2 border-t text-[11px] leading-relaxed ${
                darkTheme
                  ? 'border-slate-800 text-slate-400'
                  : 'border-slate-100 text-slate-500'
              }`}
            >
              <strong className={darkTheme ? 'text-slate-200' : 'text-slate-700'}>
                मूल्यांकन प्रारूप:{' '}
              </strong>
              {syllabusMatch.assessmentPatternHindi}
            </div>
          </div>
        )}

        {/* Quick Jump to Practice Action */}
        {onJumpToPractice && (
          <div
            className={`pt-3 border-t ${
              darkTheme ? 'border-slate-800' : 'border-slate-100'
            }`}
          >
            <button
              type="button"
              onClick={onJumpToPractice}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-2 cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${
                darkTheme
                  ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 focus-visible:outline-amber-400'
                  : 'bg-slate-900 hover:bg-slate-800 text-white focus-visible:outline-slate-900'
              }`}
            >
              <BookOpen
                className={`w-3.5 h-3.5 ${
                  darkTheme ? 'text-slate-950' : 'text-amber-300'
                }`}
              />
              <span>त्वरित अभ्यास प्रश्न हल करें</span>
              <Target
                className={`w-3.5 h-3.5 ${
                  darkTheme ? 'text-slate-900' : 'text-slate-300'
                }`}
              />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
