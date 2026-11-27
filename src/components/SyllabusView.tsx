import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Award, 
  ArrowRight, 
  Layers, 
  CheckCircle2, 
  HelpCircle, 
  Compass, 
  FileCheck,
  ChevronDown,
  ChevronUp,
  BookmarkCheck
} from 'lucide-react';
import { BoardType, GradeLevel } from '../types';
import { getBoardSyllabus } from '../data/syllabusData';

interface SyllabusViewProps {
  selectedBoard?: BoardType;
  onSelectBoard?: (board: BoardType) => void;
  selectedGrade: GradeLevel;
  onSelectGrade: (grade: GradeLevel) => void;
  bilingualMode: boolean;
  onNavigateToTab: (tab: string) => void;
  onSelectSimulationModule?: (moduleId: string) => void;
}

export const SyllabusView: React.FC<SyllabusViewProps> = ({
  selectedGrade,
  onSelectGrade,
  bilingualMode,
  onNavigateToTab,
  onSelectSimulationModule,
}) => {
  const [revealedQuestions, setRevealedQuestions] = useState<Record<number, boolean>>({});
  const selectedBoard: BoardType = 'ICSE';

  const syllabus = getBoardSyllabus('ICSE', selectedGrade);

  const toggleReveal = (idx: number) => {
    setRevealedQuestions(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const grades: GradeLevel[] = [
    'कक्षा 5',
    'कक्षा 6',
    'कक्षा 7',
    'कक्षा 8',
    'कक्षा 9',
    'कक्षा 10'
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner & Board Switcher Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-3xl p-6 sm:p-9 shadow-md relative overflow-hidden border border-indigo-700/50">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-32 bottom-0 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex items-center gap-4">
            <img
              src="/assets/aistudio/mail.google_a65ce30f.png"
              alt="शब्दशिल्प (ShabdShilp) Logo"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover object-center bg-[#091124] border border-white/25 shadow-lg shrink-0"
            />
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold border border-white/15 backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>पाठ्यक्रम नियंत्रक (Curriculum & Board Navigator)</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black font-serif-display tracking-tight text-white">
                {selectedBoard} {selectedGrade} हिंदी व्याकरण पाठ्यक्रम
              </h2>
            </div>
          </div>

          <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed max-w-3xl">
            {syllabus.overviewHindi}
          </p>

          {bilingualMode && (
            <p className="text-xs text-indigo-200/80 italic max-w-3xl">
              {syllabus.overviewEnglish}
            </p>
          )}

          {/* Grade Selector Row */}
          <div className="pt-2 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-indigo-200">कक्षा चुनें (Grade):</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {grades.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => onSelectGrade(g)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedGrade === g
                      ? 'bg-amber-400 text-slate-900 shadow-xs'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Board Assessment Pattern & Weightage Strip */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 font-display">
                {selectedBoard} परीक्षा प्रारूप व अंक विभाजन (Exam Pattern & Marks Weightage)
              </h3>
              <p className="text-xs text-slate-500">
                {syllabus.assessmentPatternHindi}
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
            कुल: 80 अंक सैद्धांतिक + 20 आंतरिक मूल्यांकन
          </span>
        </div>

        {/* Weightage Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {syllabus.weightage.map((item, idx) => (
            <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 truncate">{item.topic}</span>
                <span className="font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md shrink-0">
                  {item.marks} अंक
                </span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-600 h-full rounded-full" 
                  style={{ width: `${Math.min(100, item.marks * 8)}%` }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories Breakdown */}
      <div className="space-y-6">
        {syllabus.categories.map((cat, catIdx) => (
          <div key={catIdx} className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs">
                  {String.fromCharCode(65 + catIdx)}
                </span>
                <div>
                  <h4 className="text-lg font-black text-slate-900 font-serif-display">
                    {cat.titleHindi} ({cat.title})
                  </h4>
                  <p className="text-xs text-slate-500">
                    {selectedBoard} {selectedGrade} के अनुसार मुख्य पाठ्यक्रम इकाइयाँ
                  </p>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {cat.items.map((item, itemIdx) => (
                <div 
                  key={itemIdx}
                  className="p-4 bg-slate-50/70 hover:bg-slate-50 rounded-2xl border border-slate-200 transition-all flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <h5 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                        <BookmarkCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span>{item.nameHindi}</span>
                      </h5>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {item.nameEnglish}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-hindi">
                      {item.descriptionHindi}
                    </p>

                    {bilingualMode && (
                      <p className="text-[11px] text-slate-400 italic">
                        {item.descriptionEnglish}
                      </p>
                    )}
                  </div>

                  {/* Direct Launch Simulator Button */}
                  {item.linkedModuleId && (
                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          const target = item.linkedModuleId;
                          if (!target) return;
                          if (target === 'dashboard' || target === 'vocab-studio') {
                            onNavigateToTab('dashboard');
                          } else if (onSelectSimulationModule) {
                            onSelectSimulationModule(target);
                          } else {
                            onNavigateToTab('modules');
                          }
                        }}
                        className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer group-hover:scale-102"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>सिमुलेटर में अभ्यास करें (Simulate)</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Board-Style Sample Practice Items */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-extrabold text-slate-900 font-display">
              {selectedBoard} बोर्ड प्रारूप के अभ्यास प्रश्न (Board-Style Sample Questions)
            </h4>
            <p className="text-xs text-slate-500">
              {selectedBoard} परीक्षा शैली के अनुसार मॉडल प्रश्न व आदर्श उत्तर
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {syllabus.sampleQuestions.map((q, qIdx) => {
            const isRevealed = !!revealedQuestions[qIdx];
            return (
              <div key={qIdx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800">
                      प्रश्न {qIdx + 1} ({selectedBoard} Format)
                    </span>
                    <h5 className="text-sm font-bold text-slate-900 font-hindi leading-relaxed">
                      {q.questionTextHindi}
                    </h5>
                    {bilingualMode && (
                      <p className="text-xs text-slate-500 italic">
                        {q.questionTextEnglish}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleReveal(qIdx)}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 shadow-2xs transition-all cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <span>{isRevealed ? 'समाधान छिपाएँ' : 'उत्तर देखें'}</span>
                    {isRevealed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {isRevealed && (
                  <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1 animate-in fade-in duration-200 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>आदर्श उत्तर (Model Answer):</span>
                    </div>
                    <p className="text-emerald-950 font-bold font-hindi pl-5">
                      {q.modelAnswerHindi}
                    </p>
                    <p className="text-[11px] text-emerald-800 pl-5">
                      <strong>व्याख्या:</strong> {q.explanationHindi}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
