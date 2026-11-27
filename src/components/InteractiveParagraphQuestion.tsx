import React from 'react';
import { CheckCircle2, XCircle, MousePointerClick, HelpCircle } from 'lucide-react';
import { InteractiveParagraphQuestion as InteractiveParagraphQuestionType } from '../types';
import { normalizeHindiToken } from '../data/interactiveWorkbookData';

interface InteractiveParagraphQuestionProps {
  question: InteractiveParagraphQuestionType;
  questionIndex: number;
  selectedToken: string | number | null; // word mode: "normalizedWord::tokenId" ; sentence mode: sentenceIndex (number)
  selectedBhed: string;
  selectedRole: string;
  isSubmitted: boolean;
  bilingualMode: boolean;
  onSelectToken: (val: string | number) => void;
  onSelectBhed: (val: string) => void;
  onSelectRole: (val: string) => void;
}

export const extractSelectedWordKey = (selectedToken: string | number | null): string => {
  if (typeof selectedToken !== 'string') return '';
  return selectedToken.split('::')[0] || '';
};

export const evaluateInteractiveParagraphAnswer = (
  question: InteractiveParagraphQuestionType,
  selectedToken: string | number | null,
  selectedBhed: string,
  selectedRole: string
): {
  hasSelection: boolean;
  selectionCorrect: boolean;
  bhedCorrect: boolean;
  roleCorrect: boolean;
  bothCorrect: boolean;
  expectedBhed: string;
  expectedRole: string;
} => {
  if (question.mode === 'word') {
    const wordKey = extractSelectedWordKey(selectedToken);
    if (!wordKey) {
      return {
        hasSelection: false,
        selectionCorrect: false,
        bhedCorrect: false,
        roleCorrect: false,
        bothCorrect: false,
        expectedBhed: '',
        expectedRole: '',
      };
    }
    const annotation = question.wordAnnotations?.[wordKey];
    const selectionCorrect = Boolean(
      annotation && annotation.categoryId === question.targetWordCategory
    );
    const bhedCorrect = Boolean(selectionCorrect && selectedBhed === annotation?.bhedHindi);
    const roleCorrect = Boolean(
      selectionCorrect &&
        (!question.roleOptions?.length || selectedRole === annotation?.roleHindi)
    );
    return {
      hasSelection: true,
      selectionCorrect,
      bhedCorrect,
      roleCorrect,
      bothCorrect: selectionCorrect && bhedCorrect,
      expectedBhed: annotation?.bhedHindi || '',
      expectedRole: annotation?.roleHindi || '',
    };
  }

  // Sentence mode
  if (typeof selectedToken !== 'number' || Number.isNaN(selectedToken)) {
    return {
      hasSelection: false,
      selectionCorrect: false,
      bhedCorrect: false,
      roleCorrect: false,
      bothCorrect: false,
      expectedBhed: '',
      expectedRole: '',
    };
  }

  const sAnn = question.sentenceAnnotations?.find((s) => s.sentenceIndex === selectedToken);
  const selectionCorrect = Boolean(sAnn && sAnn.bhedType === question.targetSentenceBhed);
  const bhedCorrect = Boolean(selectionCorrect && selectedBhed === sAnn?.bhedHindi);
  const roleCorrect = Boolean(
    selectionCorrect && (!question.roleOptions?.length || selectedRole === sAnn?.roleHindi)
  );
  return {
    hasSelection: true,
    selectionCorrect,
    bhedCorrect,
    roleCorrect,
    bothCorrect: selectionCorrect && bhedCorrect,
    expectedBhed: sAnn?.bhedHindi || '',
    expectedRole: sAnn?.roleHindi || '',
  };
};

export const InteractiveParagraphQuestion: React.FC<InteractiveParagraphQuestionProps> = ({
  question,
  questionIndex,
  selectedToken,
  selectedBhed,
  selectedRole,
  isSubmitted,
  bilingualMode,
  onSelectToken,
  onSelectBhed,
  onSelectRole,
}) => {
  const evalResult = evaluateInteractiveParagraphAnswer(
    question,
    selectedToken,
    selectedBhed,
    selectedRole
  );

  const selectedWordKey = extractSelectedWordKey(selectedToken);
  const selectedDisplayText =
    question.mode === 'word'
      ? selectedWordKey
      : typeof selectedToken === 'number'
      ? question.paragraphSentences[selectedToken] || ''
      : '';

  return (
    <div className="p-5 sm:p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-4 shadow-2xs">
      {/* Header Prompt */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-[11px] font-black text-indigo-800 bg-indigo-100 px-2.5 py-1 rounded-lg border border-indigo-200">
            <MousePointerClick className="w-3.5 h-3.5" />
            <span>
              {question.mode === 'word'
                ? 'शब्द-स्तर अनुच्छेद परीक्षण (Word Selection — Zero Hint)'
                : 'वाक्य-स्तर अनुच्छेद परीक्षण (Sentence Selection — Zero Hint)'}
            </span>
          </div>
          <h5 className="text-sm sm:text-base font-black text-slate-900 font-hindi leading-snug pt-1">
            {questionIndex + 1}. {question.promptHindi}
          </h5>
          {bilingualMode && question.promptEnglish && (
            <p className="text-xs text-indigo-700/85 font-medium">{question.promptEnglish}</p>
          )}
        </div>

        {isSubmitted && (
          <div className="flex flex-wrap items-center gap-1.5 shrink-0">
            <span
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1 border ${
                evalResult.selectionCorrect
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  : 'bg-rose-100 text-rose-900 border-rose-300'
              }`}
            >
              {evalResult.selectionCorrect ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <XCircle className="w-3.5 h-3.5" />
              )}
              <span>
                {question.mode === 'word' ? 'शब्द चयन' : 'वाक्य चयन'}:{' '}
                {evalResult.selectionCorrect ? 'सही' : 'गलत'}
              </span>
            </span>

            <span
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1 border ${
                evalResult.bhedCorrect
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  : 'bg-rose-100 text-rose-900 border-rose-300'
              }`}
            >
              {evalResult.bhedCorrect ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <XCircle className="w-3.5 h-3.5" />
              )}
              <span>भेद पहचान: {evalResult.bhedCorrect ? 'सही' : 'गलत'}</span>
            </span>
          </div>
        )}
      </div>

      {/* Interactive Gadyansh Container */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-3 shadow-inner">
        <div className="flex items-center justify-between gap-2 flex-wrap border-b border-slate-100 pb-2">
          <span className="text-xs font-black text-slate-800">
            गद्यांश: {question.paragraphTitleHindi}
          </span>
          {!isSubmitted && (
            <span className="text-[11px] font-semibold text-slate-500">
              {question.mode === 'word'
                ? 'नीचे किसी भी शब्द पर क्लिक करें (चयन के समय सही/गलत संकेत नहीं दिया जाएगा)'
                : 'नीचे किसी भी वाक्य पर क्लिक करें (चयन के समय सही/गलत संकेत नहीं दिया जाएगा)'}
            </span>
          )}
        </div>

        {question.mode === 'word' ? (
          <div className="text-base sm:text-lg leading-[2.2] font-hindi text-slate-900 select-none">
            {question.paragraphSentences.map((sentence, sIdx) => {
              const parts = sentence.split(/(\s+)/);
              return (
                <span key={sIdx} className="mr-1.5">
                  {parts.map((part, pIdx) => {
                    if (/^\s+$/.test(part)) {
                      return <span key={pIdx}>{part}</span>;
                    }
                    const norm = normalizeHindiToken(part);
                    if (!norm) {
                      return <span key={pIdx}>{part}</span>;
                    }
                    const tokenKey = `${norm}::${sIdx}_${pIdx}`;
                    const isThisClicked = selectedToken === tokenKey;
                    const ann = question.wordAnnotations?.[norm];
                    const isValidTarget = Boolean(
                      ann && ann.categoryId === question.targetWordCategory
                    );

                    let tokenStyle =
                      'bg-transparent hover:bg-indigo-50 text-slate-900 border-transparent hover:border-indigo-200';

                    if (!isSubmitted) {
                      // STRICT ZERO-HINT: Every clicked token uses uniform neutral indigo highlight
                      if (isThisClicked) {
                        tokenStyle =
                          'bg-indigo-600 text-white border-indigo-700 font-bold shadow-xs';
                      }
                    } else {
                      if (isThisClicked) {
                        tokenStyle = isValidTarget
                          ? 'bg-emerald-600 text-white border-emerald-700 font-bold'
                          : 'bg-rose-600 text-white border-rose-700 font-bold';
                      } else if (isValidTarget) {
                        tokenStyle =
                          'bg-emerald-50 text-emerald-900 border-emerald-400 font-bold';
                      }
                    }

                    return (
                      <button
                        key={pIdx}
                        type="button"
                        disabled={isSubmitted}
                        onClick={() => onSelectToken(tokenKey)}
                        className={`inline-block px-1.5 py-0.5 mx-0.5 rounded-lg border transition-all ${
                          isSubmitted ? 'cursor-default' : 'cursor-pointer'
                        } ${tokenStyle}`}
                      >
                        {part}
                      </button>
                    );
                  })}
                </span>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2.5 select-none">
            {question.paragraphSentences.map((sentence, sIdx) => {
              const isThisClicked = selectedToken === sIdx;
              const sAnn = question.sentenceAnnotations?.find((s) => s.sentenceIndex === sIdx);
              const isValidTarget = Boolean(
                sAnn && sAnn.bhedType === question.targetSentenceBhed
              );

              let cardStyle =
                'bg-slate-50/70 hover:bg-indigo-50/70 text-slate-900 border-slate-200 hover:border-indigo-300';

              if (!isSubmitted) {
                // STRICT ZERO-HINT: Uniform neutral highlight for any selected sentence
                if (isThisClicked) {
                  cardStyle =
                    'bg-indigo-600 text-white border-indigo-700 font-bold shadow-sm';
                }
              } else {
                if (isThisClicked) {
                  cardStyle = isValidTarget
                    ? 'bg-emerald-600 text-white border-emerald-700 font-bold'
                    : 'bg-rose-600 text-white border-rose-700 font-bold';
                } else if (isValidTarget) {
                  cardStyle =
                    'bg-emerald-50 text-emerald-950 border-emerald-400 font-bold';
                }
              }

              return (
                <button
                  key={sIdx}
                  type="button"
                  disabled={isSubmitted}
                  onClick={() => onSelectToken(sIdx)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                    isSubmitted ? 'cursor-default' : 'cursor-pointer'
                  } ${cardStyle}`}
                >
                  <span
                    className={`w-6 h-6 rounded-lg text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5 ${
                      isThisClicked
                        ? 'bg-white/20 text-white'
                        : 'bg-white border border-slate-200 text-slate-700'
                    }`}
                  >
                    {sIdx + 1}
                  </span>
                  <span className="text-sm sm:text-base font-hindi leading-relaxed">
                    {sentence}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Neutral Follow-up Bhed + Role Question triggered upon selection */}
      {evalResult.hasSelection && (
        <div className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-indigo-200 space-y-4">
          <div className="flex items-start gap-2.5 pb-2 border-b border-slate-100">
            <HelpCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm font-black text-slate-900 font-hindi">
              आपने <span className="text-indigo-700">“{selectedDisplayText}”</span> चुना है। अब इसका सटीक भेद चुनें और इसकी व्याकरणिक भूमिका स्पष्ट करें:
            </div>
          </div>

          {/* Step 1: Bhed Selection */}
          {Array.isArray(question.bhedOptions) && question.bhedOptions.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-extrabold text-slate-700">
                १. सटीक भेद चुनें (Select Exact Bhed):
              </div>
              <div className="grid sm:grid-cols-2 gap-2">
                {question.bhedOptions.map((opt, idx) => {
                  const isChosen = selectedBhed === opt.value;
                  let optStyle =
                    'bg-slate-50 border-slate-200 text-slate-800 hover:bg-indigo-50/70';
                  if (!isSubmitted) {
                    if (isChosen) {
                      optStyle =
                        'bg-indigo-600 border-indigo-700 text-white font-bold shadow-xs';
                    }
                  } else {
                    const isExpectedBhed =
                      evalResult.selectionCorrect && opt.value === evalResult.expectedBhed;
                    if (isExpectedBhed) {
                      optStyle =
                        'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold';
                    } else if (isChosen && !evalResult.bhedCorrect) {
                      optStyle = 'bg-rose-100 border-rose-500 text-rose-950 font-bold';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => onSelectBhed(opt.value)}
                      className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                        isSubmitted ? 'cursor-default' : 'cursor-pointer'
                      } ${optStyle}`}
                    >
                      {opt.labelHindi}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Grammatical Role / Reasoning */}
          {Array.isArray(question.roleOptions) && question.roleOptions.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="text-xs font-extrabold text-slate-700">
                २. वाक्य में व्याकरणिक भूमिका / कारण चुनें (Grammatical Role):
              </div>
              <div className="grid gap-2">
                {question.roleOptions.map((opt, idx) => {
                  const isChosen = selectedRole === opt.value;
                  let optStyle =
                    'bg-slate-50 border-slate-200 text-slate-800 hover:bg-indigo-50/70';
                  if (!isSubmitted) {
                    if (isChosen) {
                      optStyle =
                        'bg-amber-100 border-amber-500 text-amber-950 font-bold';
                    }
                  } else {
                    const isExpectedRole =
                      evalResult.selectionCorrect && opt.value === evalResult.expectedRole;
                    if (isExpectedRole) {
                      optStyle =
                        'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold';
                    } else if (isChosen && !evalResult.roleCorrect) {
                      optStyle = 'bg-rose-100 border-rose-500 text-rose-950 font-bold';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => onSelectRole(opt.value)}
                      className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                        isSubmitted ? 'cursor-default' : 'cursor-pointer'
                      } ${optStyle}`}
                    >
                      {opt.labelHindi}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Post-submit Evaluation Summary */}
      {isSubmitted && (
        <div
          className={`p-4 rounded-2xl border text-xs space-y-2 ${
            evalResult.bothCorrect
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : 'bg-amber-50 border-amber-300 text-amber-950'
          }`}
        >
          <div className="font-black">
            {evalResult.bothCorrect
              ? '✅ पूर्णतः सही! आपने सही शब्द/वाक्य चुना और उसका सटीक भेद भी पहचाना।'
              : !evalResult.hasSelection
              ? '⚠️ आपने इस अनुच्छेद प्रश्न में कोई चयन नहीं किया।'
              : !evalResult.selectionCorrect
              ? `❌ चुना गया अंश (“${selectedDisplayText}”) लक्ष्य श्रेणी (${
                  question.targetCategoryLabelHindi || question.targetSentenceBhedLabelHindi || ''
                }) के अंतर्गत नहीं आता। अनुच्छेद में हरे रंग से चिह्नित सही विकल्प देखें।`
              : `⚠️ चयन सही था, परंतु भेद पहचान सही नहीं थी। सही भेद: “${evalResult.expectedBhed}”`}
          </div>
          <div className="font-hindi leading-relaxed text-slate-800">
            <strong>व्याख्या:</strong> {question.explanationHindi}
          </div>
          {bilingualMode && question.explanationEnglish && (
            <div className="text-[11px] text-slate-600 italic">
              {question.explanationEnglish}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
