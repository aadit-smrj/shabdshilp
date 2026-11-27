import React, { useEffect, useMemo, useState } from 'react';
import { CheckSquare, Download, Languages, Printer, Square, X } from 'lucide-react';
import {
  PRINT_PREVIEW_EVENT,
  PrintPreviewPayload,
  buildWorksheetHtmlDocument,
  clearPrintRoot,
  downloadPrintableHtml,
  syncPrintRootWithHtml,
  triggerNativePrint,
} from '../utils/printWorksheet';

export const PrintPreviewModal: React.FC = () => {
  const [payload, setPayload] = useState<PrintPreviewPayload | null>(null);
  const [includeAnswers, setIncludeAnswers] = useState<boolean>(false);
  const [includeEnglish, setIncludeEnglish] = useState<boolean>(false);

  useEffect(() => {
    const handleOpen = (ev: Event) => {
      const customEv = ev as CustomEvent<PrintPreviewPayload>;
      if (!customEv.detail) return;
      const next = customEv.detail;
      setPayload(next);
      if (next.kind === 'worksheet') {
        setIncludeAnswers(Boolean(next.worksheet.includeAnswers));
        setIncludeEnglish(Boolean(next.worksheet.includeEnglish));
      }
    };

    window.addEventListener(PRINT_PREVIEW_EVENT, handleOpen);
    return () => {
      window.removeEventListener(PRINT_PREVIEW_EVENT, handleOpen);
    };
  }, []);

  useEffect(() => {
    if (!payload) {
      clearPrintRoot();
      return;
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPayload(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [payload]);

  const hasEnglishContent = useMemo(() => {
    if (!payload || payload.kind !== 'worksheet') return false;
    return (payload.worksheet.questions || []).some((q) => Boolean(q.questionEnglish));
  }, [payload]);

  const renderedHtml = useMemo(() => {
    if (!payload) return '';
    if (payload.kind === 'html') return payload.htmlDocument;
    return buildWorksheetHtmlDocument({
      ...payload.worksheet,
      includeAnswers,
      includeEnglish,
    });
  }, [payload, includeAnswers, includeEnglish]);

  // Keep #shabdshilp-print-root in sync whenever toggles change so both Print button and Ctrl+P match preview
  useEffect(() => {
    if (!payload || !renderedHtml) return;
    syncPrintRootWithHtml(renderedHtml);
  }, [payload, renderedHtml]);

  if (!payload) return null;

  const modalTitle = payload.kind === 'worksheet' ? payload.worksheet.titleHindi : payload.title;
  const modalSubtitle = payload.kind === 'worksheet' ? payload.worksheet.subtitle : payload.subtitle;
  const filenameBase =
    payload.kind === 'worksheet' ? payload.worksheet.titleHindi : payload.filenameSlug;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 print:hidden animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-label="प्रिंट पूर्वावलोकन (Print & PDF Preview)"
    >
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between gap-4 shrink-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-amber-300 font-bold">
              <Printer className="w-3.5 h-3.5 shrink-0" />
              <span>प्रिंट एवं PDF पूर्वावलोकन (Print Preview)</span>
            </div>
            <h3 className="text-base sm:text-lg font-black truncate mt-0.5">{modalTitle}</h3>
            {modalSubtitle && (
              <p className="text-[11px] text-slate-300 truncate">{modalSubtitle}</p>
            )}
          </div>

          <button
            type="button"
            onClick={() => setPayload(null)}
            aria-label="प्रिंट पूर्वावलोकन बंद करें"
            className="w-9 h-9 rounded-xl bg-white/15 hover:bg-white/25 text-white flex items-center justify-center cursor-pointer transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action & Options Bar */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex flex-wrap items-center gap-2">
            {payload.kind === 'worksheet' && (
              <>
                <button
                  type="button"
                  onClick={() => setIncludeAnswers((prev) => !prev)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                    includeAnswers
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {includeAnswers ? (
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Square className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span>उत्तर कुंजी शामिल करें (Answer Key)</span>
                </button>

                {hasEnglishContent && (
                  <button
                    type="button"
                    onClick={() => setIncludeEnglish((prev) => !prev)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                      includeEnglish
                        ? 'bg-indigo-50 text-indigo-900 border-indigo-300'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Languages className="w-3.5 h-3.5" />
                    <span>अंग्रेजी अनुवाद (Bilingual)</span>
                  </button>
                )}
              </>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => triggerNativePrint(renderedHtml)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>प्रिंट करें / Save as PDF</span>
            </button>

            <button
              type="button"
              onClick={() => downloadPrintableHtml(renderedHtml, filenameBase)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              title="प्रिंटेबल HTML फ़ाइल डाउनलोड करें (इसे किसी भी ब्राउज़र में खोलकर PDF सहेजें या प्रिंट करें)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>प्रिंटेबल फ़ाइल डाउनलोड</span>
            </button>
          </div>
        </div>

        {/* Helpful Info Strip */}
        <div className="px-5 py-2 bg-amber-50 border-b border-amber-200/80 text-[11px] text-amber-950 font-medium shrink-0">
          यदि ब्राउज़र प्रीव्यू विंडो में प्रिंट डायलॉग न खुले, तो <strong>"प्रिंटेबल फ़ाइल डाउनलोड"</strong> दबाएँ या कीबोर्ड से <strong>Ctrl+P / Cmd+P</strong> दबाएँ।
        </div>

        {/* Isolated Paper Preview */}
        <div className="flex-1 overflow-hidden p-4 bg-slate-200/80">
          <iframe
            srcDoc={renderedHtml}
            title="प्रिंट पूर्वावलोकन (Print Preview Sheet)"
            className="w-full h-[58vh] min-h-[360px] bg-white rounded-xl border border-slate-300 shadow-sm"
          />
        </div>
      </div>
    </div>
  );
};
