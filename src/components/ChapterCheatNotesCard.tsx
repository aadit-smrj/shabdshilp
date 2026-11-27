import React from 'react';
import {
  Printer,
  Download,
  KeyRound,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ListChecks,
} from 'lucide-react';
import { ChapterCheatNoteData } from '../data/simulationCheatNotes';
import {
  printChapterCheatNotes,
  downloadChapterCheatNotes,
} from '../utils/printWorksheet';
import { BoardType, GradeLevel } from '../types';

interface ChapterCheatNotesCardProps {
  note: ChapterCheatNoteData;
  grade: GradeLevel;
  selectedBoard: BoardType;
  bilingualMode: boolean;
  shloka?: string;
  studentName?: string;
  questionCount: number;
  onProceedToQuestions?: () => void;
  onBackToSimulation?: () => void;
  compactMode?: boolean;
  darkTheme?: boolean;
}

export const ChapterCheatNotesCard: React.FC<ChapterCheatNotesCardProps> = ({
  note,
  grade,
  selectedBoard,
  bilingualMode,
  shloka,
  studentName,
  questionCount,
  onProceedToQuestions,
  onBackToSimulation,
  compactMode = false,
  darkTheme = false,
}) => {
  const handlePrint = () => {
    printChapterCheatNotes(note, {
      grade,
      board: selectedBoard,
      studentName,
      shloka,
    });
  };

  const handleDownload = () => {
    downloadChapterCheatNotes(note, {
      grade,
      board: selectedBoard,
      studentName,
      shloka,
    });
  };

  return (
    <div
      className={`rounded-3xl border shadow-xl overflow-hidden ${
        darkTheme
          ? 'bg-[#0B1120] border-slate-800 text-slate-100'
          : 'bg-white border-slate-200 text-slate-900'
      }`}
    >
      {/* Header Strip */}
      <div
        className={`px-6 py-5 sm:px-7 sm:py-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b ${
          darkTheme
            ? 'bg-[#070B16] border-slate-800 text-white'
            : 'bg-slate-900 border-slate-800 text-white'
        }`}
      >
        <div className="flex items-center gap-3.5">
          <img
            src="/assets/aistudio/mail.google_a65ce30f.png"
            alt="शब्दशिल्प (ShabdShilp) Logo"
            className="w-12 h-12 rounded-xl object-cover object-center bg-[#091124] border border-white/20 shadow-sm shrink-0"
          />
          <div className="space-y-1">
            <div className="text-[11px] font-bold tracking-wider uppercase text-amber-300">
              चीट कोड्स व अध्याय नोट्स अनलॉक · {selectedBoard} · {grade}
            </div>
            <h3 className="text-xl sm:text-2xl font-black font-serif-display text-white">
              {note.chapterTitleHindi}
            </h3>
            {bilingualMode && (
              <p className="text-xs text-slate-300">{note.chapterTitleEnglish}</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleDownload}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold inline-flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Download className="w-4 h-4 text-amber-300 shrink-0" />
            <span>नोट्स डाउनलोड करें (Download)</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black inline-flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap shadow-xs"
          >
            <Printer className="w-4 h-4 shrink-0" />
            <span>प्रिंट करें / PDF सहेजें</span>
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 sm:p-7 space-y-7">
        {/* Core Idea */}
        <div
          className={`rounded-2xl border p-4 sm:p-5 space-y-1.5 ${
            darkTheme
              ? 'bg-[#111827] border-indigo-500/30'
              : 'bg-indigo-50/70 border-indigo-200/80'
          }`}
        >
          <div
            className={`flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide ${
              darkTheme ? 'text-amber-300' : 'text-indigo-900'
            }`}
          >
            <BookOpen
              className={`w-4 h-4 shrink-0 ${
                darkTheme ? 'text-amber-300' : 'text-indigo-700'
              }`}
            />
            <span>मूल सिद्धांत (Core Mechanism Summary)</span>
          </div>
          <p
            className={`text-sm font-bold leading-relaxed font-hindi ${
              darkTheme ? 'text-slate-100 tracking-[0.01em]' : 'text-slate-900'
            }`}
          >
            {note.coreIdeaHindi}
          </p>
          {bilingualMode && (
            <p
              className={`text-xs leading-relaxed ${
                darkTheme ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              {note.coreIdeaEnglish}
            </p>
          )}
        </div>

        {/* Identification Keywords Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h4
              className={`text-base font-black font-display flex items-center gap-2 ${
                darkTheme ? 'text-white' : 'text-slate-900'
              }`}
            >
              <KeyRound
                className={`w-4 h-4 shrink-0 ${
                  darkTheme ? 'text-amber-400' : 'text-indigo-600'
                }`}
              />
              <span>त्वरित पहचान कीवर्ड्स (Chapter Cheat Codes)</span>
            </h4>
            <span
              className={`text-xs font-semibold tabular-nums ${
                darkTheme ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              {note.keywords.length} प्रमुख संकेत-सूत्र
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {note.keywords.map((kw, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border space-y-1.5 ${
                  darkTheme
                    ? 'border-slate-800 bg-[#111827]'
                    : 'border-slate-200 bg-slate-50/70'
                }`}
              >
                <div
                  className={`text-sm font-black font-hindi ${
                    darkTheme ? 'text-amber-300' : 'text-indigo-800'
                  }`}
                >
                  {kw.keyword}
                </div>
                <div
                  className={`text-xs font-bold flex items-start gap-1.5 ${
                    darkTheme ? 'text-slate-100' : 'text-slate-900'
                  }`}
                >
                  <span
                    className={`font-black ${
                      darkTheme ? 'text-emerald-400' : 'text-emerald-600'
                    }`}
                  >
                    →
                  </span>
                  <span>{kw.identifies}</span>
                </div>
                <div
                  className={`text-xs pt-1 border-t font-hindi ${
                    darkTheme
                      ? 'text-slate-300 border-slate-800'
                      : 'text-slate-600 border-slate-200/70'
                  }`}
                >
                  उदा.: {kw.example}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step-by-Step Mechanism + Common Traps */}
        <div className="grid lg:grid-cols-2 gap-5">
          <div
            className={`p-5 rounded-2xl border space-y-3 ${
              darkTheme
                ? 'border-slate-800 bg-[#111827]'
                : 'border-slate-200 bg-white'
            }`}
          >
            <h4
              className={`text-sm font-black flex items-center gap-2 ${
                darkTheme ? 'text-white' : 'text-slate-900'
              }`}
            >
              <ListChecks
                className={`w-4 h-4 shrink-0 ${
                  darkTheme ? 'text-emerald-400' : 'text-emerald-600'
                }`}
              />
              <span>परीक्षा में सही उत्तर निकालने की विधि</span>
            </h4>
            <ol className="space-y-3">
              {note.mechanismSteps.map((step, i) => (
                <li
                  key={i}
                  className={`text-xs sm:text-sm space-y-0.5 ${
                    darkTheme ? 'text-slate-200' : 'text-slate-800'
                  }`}
                >
                  <div className="font-bold font-hindi leading-relaxed">
                    {step.stepHindi}
                  </div>
                  {bilingualMode && step.stepEnglish && (
                    <div
                      className={`text-xs ${
                        darkTheme ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      {step.stepEnglish}
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </div>

          <div
            className={`p-5 rounded-2xl border space-y-3 ${
              darkTheme
                ? 'border-rose-500/30 bg-rose-950/20'
                : 'border-rose-200/80 bg-rose-50/40'
            }`}
          >
            <h4
              className={`text-sm font-black flex items-center gap-2 ${
                darkTheme ? 'text-rose-200' : 'text-rose-950'
              }`}
            >
              <AlertTriangle
                className={`w-4 h-4 shrink-0 ${
                  darkTheme ? 'text-rose-400' : 'text-rose-600'
                }`}
              />
              <span>आम परीक्षा भूलें व बचाव (Common Exam Traps)</span>
            </h4>
            <div className="space-y-3">
              {note.commonTraps.map((trap, i) => (
                <div
                  key={i}
                  className={`p-3.5 rounded-xl border space-y-1.5 text-xs ${
                    darkTheme
                      ? 'bg-[#0D1326] border-rose-500/25'
                      : 'bg-white border-rose-200/70'
                  }`}
                >
                  <div
                    className={`font-bold font-hindi ${
                      darkTheme ? 'text-rose-300' : 'text-rose-800'
                    }`}
                  >
                    भूल: {trap.trapHindi}
                  </div>
                  <div
                    className={`font-semibold font-hindi ${
                      darkTheme ? 'text-emerald-300' : 'text-emerald-800'
                    }`}
                  >
                    सही तर्क: {trap.fixHindi}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Revision Table */}
        <div className="space-y-2.5">
          <h4
            className={`text-sm font-black ${
              darkTheme ? 'text-white' : 'text-slate-900'
            }`}
          >
            त्वरित पुनरावृत्ति तालिका (Quick Revision Sheet)
          </h4>
          <div
            className={`overflow-x-auto rounded-2xl border ${
              darkTheme ? 'border-slate-800' : 'border-slate-200'
            }`}
          >
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className={darkTheme ? 'bg-[#070B16] text-amber-300' : 'bg-slate-900 text-white'}>
                  <th className="py-2.5 px-3.5 font-bold">
                    {note.quickTableHeaders[0]}
                  </th>
                  <th className="py-2.5 px-3.5 font-bold">
                    {note.quickTableHeaders[1]}
                  </th>
                  <th className="py-2.5 px-3.5 font-bold">
                    {note.quickTableHeaders[2]}
                  </th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${
                  darkTheme ? 'divide-slate-800' : 'divide-slate-200'
                }`}
              >
                {note.quickTableRows.map((row, idx) => (
                  <tr
                    key={idx}
                    className={
                      darkTheme
                        ? idx % 2 === 0
                          ? 'bg-[#0B1120]'
                          : 'bg-[#111827]'
                        : idx % 2 === 0
                        ? 'bg-white'
                        : 'bg-slate-50/70'
                    }
                  >
                    <td
                      className={`py-2.5 px-3.5 font-extrabold font-hindi ${
                        darkTheme ? 'text-slate-100' : 'text-slate-900'
                      }`}
                    >
                      {row[0]}
                    </td>
                    <td
                      className={`py-2.5 px-3.5 font-semibold font-hindi ${
                        darkTheme ? 'text-amber-300' : 'text-indigo-800'
                      }`}
                    >
                      {row[1]}
                    </td>
                    <td
                      className={`py-2.5 px-3.5 font-hindi ${
                        darkTheme ? 'text-slate-300' : 'text-slate-700'
                      }`}
                    >
                      {row[2]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {shloka && (
          <div
            className={`p-4 rounded-2xl border text-xs font-hindi ${
              darkTheme
                ? 'bg-amber-500/10 border-amber-400/25 text-amber-200'
                : 'bg-amber-50/70 border-amber-200 text-amber-950'
            }`}
          >
            <span className="font-extrabold">परंपरा सूत्र: </span>
            <span className="italic">{shloka}</span>
          </div>
        )}

        {/* Action Bar */}
        {!compactMode && onProceedToQuestions && (
          <div
            className={`pt-4 border-t flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 ${
              darkTheme ? 'border-slate-800' : 'border-slate-200'
            }`}
          >
            {onBackToSimulation ? (
              <button
                type="button"
                onClick={onBackToSimulation}
                className={`px-4 py-3 rounded-xl border text-xs font-bold cursor-pointer transition-colors whitespace-nowrap ${
                  darkTheme
                    ? 'border-slate-700 bg-[#111827] hover:bg-slate-800 text-slate-200'
                    : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                ← सिमुलेशन दोबारा देखें
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={onProceedToQuestions}
              className={`px-6 py-3.5 rounded-xl text-sm font-black inline-flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-colors whitespace-nowrap ${
                darkTheme
                  ? 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                  : 'bg-indigo-700 hover:bg-indigo-800 text-white'
              }`}
            >
              <CheckCircle2
                className={`w-4 h-4 shrink-0 ${
                  darkTheme ? 'text-slate-950' : 'text-amber-300'
                }`}
              />
              <span>
                अध्याय अभ्यास प्रश्न शुरू करें ({questionCount} प्रश्न)
              </span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
