import React from 'react';
import {
  Award,
  BarChart3,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lightbulb,
  Printer,
  Coins,
  TrendingUp,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { WorksheetDiagnosticReport } from '../utils/worksheetReport';
import { getPrintBrandLogosHtml, printRawHtmlDocument } from '../utils/printWorksheet';

interface WorksheetReportCardProps {
  report: WorksheetDiagnosticReport;
  bilingualMode: boolean;
  onOpenMistakeRecovery?: () => void;
  onOpenPracticeTab?: (tab: string) => void;
}

const escapeHtml = (val: string): string =>
  String(val || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export function printDiagnosticReport(report: WorksheetDiagnosticReport): void {
  const brandLogosHtml = getPrintBrandLogosHtml(46);
  const topicRows = report.topicBreakdown
    .map(
      (t) => `
      <tr>
        <td>${escapeHtml(t.nameHindi)}</td>
        <td style="text-align:center; font-variant-numeric:tabular-nums;">${t.correct} / ${t.total}</td>
        <td style="text-align:center; font-variant-numeric:tabular-nums;">${t.wrong + t.unanswered}</td>
        <td style="text-align:center; font-weight:700; font-variant-numeric:tabular-nums;">${t.percentage}%</td>
      </tr>`
    )
    .join('');

  const skillRows = report.skillBreakdown
    .map(
      (s) => `
      <tr>
        <td>${escapeHtml(s.nameHindi)}</td>
        <td style="text-align:center; font-variant-numeric:tabular-nums;">${s.correct} / ${s.total}</td>
        <td style="text-align:center; font-weight:700; font-variant-numeric:tabular-nums;">${s.percentage}%</td>
      </tr>`
    )
    .join('');

  const mistakesHtml =
    report.mistakes.length === 0
      ? `<p style="color:#065f46; font-weight:700;">कोई त्रुटि नहीं — सभी प्रश्न सही हल किए गए हैं!</p>`
      : report.mistakes
          .map(
            (m) => `
        <div class="mistake" style="${m.isUnanswered ? 'border-color:#fde68a; background:#fffbeb;' : ''}">
          <div class="m-head"><strong>प्रश्न ${m.questionNumber}</strong> · ${escapeHtml(m.topicHindi)} · ${escapeHtml(m.skillHindi)} · <strong>${m.isUnanswered ? 'अनुत्तरित (Skipped)' : 'गलत उत्तर (Incorrect)'}</strong></div>
          <div class="m-q">${escapeHtml(m.questionHindi)}</div>
          <div class="m-ans">
            <span class="wrong"><strong>आपका उत्तर:</strong> ${escapeHtml(m.selectedTextHindi)}</span>
            <span class="right"><strong>सही उत्तर:</strong> ${escapeHtml(m.correctTextHindi)}</span>
          </div>
          <div class="m-exp"><strong>व्याख्या:</strong> ${escapeHtml(m.explanationHindi)}</div>
        </div>`
          )
          .join('');

  const improvementsHtml = report.improvementPlan
    .map(
      (imp) => `
      <div class="imp">
        <div class="imp-title">${escapeHtml(imp.titleHindi)} (${escapeHtml(imp.scoreLabel)})</div>
        <p class="imp-diag">${escapeHtml(imp.diagnosisHindi)}</p>
        <ul>
          ${imp.actionStepsHindi.map((st) => `<li>${escapeHtml(st)}</li>`).join('')}
        </ul>
      </div>`
    )
    .join('');

  const html = `<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8" />
  <title>प्रदर्शन एवं सुधार रिपोर्ट — ${escapeHtml(report.titleHindi)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet" />
  <style>
    @page { size: A4; margin: 14mm; }
    .ss-print-doc {
      font-family: 'Noto Sans Devanagari', 'Plus Jakarta Sans', Arial, sans-serif;
      color: #0f172a; line-height: 1.55; margin: 0 auto; padding: 16px 20px;
      max-width: 820px; font-size: 12px; background: #ffffff;
    }
    .ss-print-doc * { box-sizing: border-box; }
    .ss-print-doc .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #4338ca; padding-bottom: 10px; margin-bottom: 14px; gap: 12px; }
    .ss-print-doc .brand { display: flex; align-items: center; gap: 10px; }
    .ss-print-doc .logo { width: 46px; height: 46px; object-fit: contain; border: 1px solid #cbd5e1; border-radius: 8px; padding: 2px; background: #fff; }
    .ss-print-doc h1 { margin: 0; font-size: 18px; color: #1e1b4b; font-weight: 800; }
    .ss-print-doc h2 { margin: 18px 0 8px 0; font-size: 14px; color: #312e81; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
    .ss-print-doc .kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 14px; }
    .ss-print-doc .kpi { border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px 10px; background: #f8fafc; }
    .ss-print-doc .kpi-label { font-size: 10px; color: #475569; display: block; }
    .ss-print-doc .kpi-val { font-size: 15px; font-weight: 800; color: #0f172a; font-variant-numeric: tabular-nums; }
    .ss-print-doc table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
    .ss-print-doc th, .ss-print-doc td { border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; }
    .ss-print-doc th { background: #f1f5f9; font-size: 11px; }
    .ss-print-doc .mistake { border: 1px solid #fecdd3; background: #fff1f2; border-radius: 8px; padding: 8px 10px; margin-bottom: 8px; page-break-inside: avoid; break-inside: avoid; }
    .ss-print-doc .m-head { font-size: 11px; color: #475569; margin-bottom: 3px; }
    .ss-print-doc .m-q { font-weight: 700; margin-bottom: 4px; }
    .ss-print-doc .m-ans { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 4px; font-size: 11px; }
    .ss-print-doc .wrong { color: #be123c; }
    .ss-print-doc .right { color: #047857; }
    .ss-print-doc .m-exp { font-size: 11px; color: #334155; }
    .ss-print-doc .imp { border: 1px solid #cbd5e1; background: #f8fafc; border-radius: 8px; padding: 8px 10px; margin-bottom: 8px; page-break-inside: avoid; break-inside: avoid; }
    .ss-print-doc .imp-title { font-weight: 700; color: #1e293b; }
    .ss-print-doc .imp-diag { margin: 4px 0; font-size: 11px; color: #334155; }
    .ss-print-doc .imp ul { margin: 4px 0 0 18px; padding: 0; font-size: 11px; }
  </style>
</head>
<body>
  <div class="ss-print-doc">
    <div class="header">
      <div class="brand">
        ${brandLogosHtml}
        <div>
          <h1>प्रदर्शन एवं सुधार रिपोर्ट (Performance &amp; Improvement Report)</h1>
          <div style="color:#475569; font-size:11px;">${escapeHtml(report.titleHindi)} · ${escapeHtml(report.tierLabelHindi)}</div>
        </div>
      </div>
      <div style="text-align:right; font-size:11px; white-space:nowrap;">
        <strong>शब्दशिल्प (ShabdShilp)</strong><br />
        <span>${new Date().toLocaleDateString('hi-IN')}</span>
      </div>
    </div>

    <p>${escapeHtml(report.summaryHindi)}</p>

    <div class="kpis">
      <div class="kpi"><span class="kpi-label">कुल अंक (Score)</span><span class="kpi-val">${report.correctCount} / ${report.totalQuestions}</span></div>
      <div class="kpi"><span class="kpi-label">उत्तर दिए गए / छूटे</span><span class="kpi-val">${report.attemptedCount} हल · ${report.unansweredCount} छूटे</span></div>
      <div class="kpi"><span class="kpi-label">प्रतिशत (Accuracy)</span><span class="kpi-val">${report.percentage}%</span></div>
      <div class="kpi"><span class="kpi-label">अर्जित WordCoins</span><span class="kpi-val">+${report.wordCoinsEarned}</span></div>
    </div>

    <h2>१. विषय-वार अंक विवरण (Where You Scored How Much)</h2>
    <table>
      <thead><tr><th>विषय (Topic)</th><th style="text-align:center;">सही / कुल</th><th style="text-align:center;">त्रुटि</th><th style="text-align:center;">प्रतिशत</th></tr></thead>
      <tbody>${topicRows}</tbody>
    </table>

    <h2>२. कौशल व प्रश्न-प्रकार विश्लेषण (Skill Breakdown)</h2>
    <table>
      <thead><tr><th>कौशल (Skill Area)</th><th style="text-align:center;">सही / कुल</th><th style="text-align:center;">प्रतिशत</th></tr></thead>
      <tbody>${skillRows}</tbody>
    </table>

    <h2>३. कहाँ-कहाँ गलती हुई (Where Errors Occurred)</h2>
    ${mistakesHtml}

    <h2>४. सुधार कैसे करें (How to Improve)</h2>
    ${improvementsHtml}
  </div>
</body>
</html>`;

  printRawHtmlDocument(html, {
    title: `प्रदर्शन रिपोर्ट — ${report.titleHindi}`,
    subtitle: `${report.tierLabelHindi} • ${report.correctCount}/${report.totalQuestions} (${report.percentage}%)`,
    filenameSlug: `report-${report.titleHindi}`,
  });
}

export const WorksheetReportCard: React.FC<WorksheetReportCardProps> = ({
  report,
  bilingualMode,
  onOpenMistakeRecovery,
  onOpenPracticeTab,
}) => {
  const tierStyles = {
    emerald: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    indigo: 'bg-indigo-50 text-indigo-900 border-indigo-200',
    amber: 'bg-amber-50 text-amber-900 border-amber-200',
    rose: 'bg-rose-50 text-rose-900 border-rose-200',
  }[report.tierTone];

  return (
    <section
      aria-label="Worksheet Performance Report"
      className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-6 text-slate-900 print:border-slate-300"
    >
      {/* Top Report Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
            <BarChart3 className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>मूल्यांकन एवं सुधार रिपोर्ट</span>
            {bilingualMode && (
              <>
                <span aria-hidden="true">·</span>
                <span>Diagnostic Performance Report</span>
              </>
            )}
          </div>
          <h4 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
            {report.titleHindi}
          </h4>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-3xl">
            {report.summaryHindi}
          </p>
          {bilingualMode && (
            <p className="text-xs text-slate-500 italic leading-relaxed max-w-3xl">
              {report.summaryEnglish}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <div className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 ${tierStyles}`}>
            {report.tierTone === 'emerald' || report.tierTone === 'indigo' ? (
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            )}
            <span>{report.tierLabelHindi}</span>
          </div>

          <button
            type="button"
            onClick={() => printDiagnosticReport(report)}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 print:hidden"
            title="प्रदर्शन रिपोर्ट प्रिंट करें या PDF में सहेजें"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>रिपोर्ट प्रिंट करें</span>
          </button>
        </div>
      </div>

      {/* 4-Column Score KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
          <span className="text-xs font-semibold text-slate-600 block">
            कुल प्राप्तांक {bilingualMode ? '(Score)' : ''}
          </span>
          <div className="text-xl font-black text-slate-900 tabular-nums">
            {report.correctCount} / {report.totalQuestions}
          </div>
          <span className="text-[11px] text-slate-500 block tabular-nums">
            उत्तर दिए गए (Answered): {report.attemptedCount}/{report.totalQuestions}
            {report.unansweredCount > 0 ? ` · छूटे (Skipped): ${report.unansweredCount}` : ''}
          </span>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
          <span className="text-xs font-semibold text-slate-600 block">
            सटीकता दर {bilingualMode ? '(Accuracy)' : ''}
          </span>
          <div className="text-xl font-black text-indigo-700 tabular-nums">
            {report.percentage}%
          </div>
          <span className="text-[11px] text-slate-500 block">
            {report.percentage >= 80 ? 'लक्ष्य पूर्ण (On Track)' : '75%+ लक्ष्य रखें'}
          </span>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
          <span className="text-xs font-semibold text-slate-600 block">
            त्रुटियाँ व छूटे {bilingualMode ? '(Wrong & Skipped)' : ''}
          </span>
          <div className={`text-xl font-black tabular-nums ${report.wrongCount > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
            {report.wrongCount}
          </div>
          <span className="text-[11px] text-slate-500 block tabular-nums">
            {report.unansweredCount > 0
              ? `गलत: ${report.wrongCount - report.unansweredCount} · छूटे (Skipped): ${report.unansweredCount}`
              : report.wrongCount === 0
              ? 'कोई त्रुटि नहीं'
              : 'नीचे व्याख्या देखें'}
          </span>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
          <span className="text-xs font-semibold text-slate-600 block">
            अर्जित इनाम {bilingualMode ? '(WordCoins)' : ''}
          </span>
          <div className="text-xl font-black text-amber-700 tabular-nums flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-amber-600 shrink-0" />
            <span>+{report.wordCoinsEarned}</span>
          </div>
          <span className="text-[11px] text-slate-500 block">
            हर 2 सही उत्तर = 1 WordCoin
          </span>
        </div>
      </div>

      {/* SECTION 1: How Much Has He Got Where (Topic & Skill Matrix) */}
      <div className="grid lg:grid-cols-2 gap-5 pt-2 border-t border-slate-200">
        {/* Topic-by-Topic Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h5 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>१. विषय के अनुसार अंक (Where You Scored)</span>
            </h5>
            <span className="text-[11px] text-slate-500 tabular-nums">
              {report.topicBreakdown.length} विषय
            </span>
          </div>

          <div className="space-y-2.5">
            {report.topicBreakdown.map((t) => {
              const barColor =
                t.status === 'strong'
                  ? 'bg-emerald-600'
                  : t.status === 'developing'
                  ? 'bg-amber-500'
                  : 'bg-rose-600';
              const statusText =
                t.status === 'strong'
                  ? 'मजबूत'
                  : t.status === 'developing'
                  ? 'मध्यम'
                  : 'सुधार आवश्यक';
              const statusClass =
                t.status === 'strong'
                  ? 'text-emerald-800'
                  : t.status === 'developing'
                  ? 'text-amber-800'
                  : 'text-rose-800';

              return (
                <div key={t.key} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <div className="font-bold text-slate-900">
                      <span>{t.nameHindi}</span>
                      {bilingualMode && t.nameEnglish && (
                        <span className="text-[11px] font-normal text-slate-500 ml-1.5">
                          ({t.nameEnglish})
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0 tabular-nums">
                      <span className="font-black text-slate-900">
                        {t.correct}/{t.total}
                      </span>
                      <span className={`font-bold ${statusClass}`}>
                        {t.percentage}% · {statusText}
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${barColor}`}
                      style={{ width: `${t.percentage > 0 ? Math.max(4, t.percentage) : 0}%` }}
                    />
                  </div>
                  {t.unanswered > 0 && (
                    <div className="text-[10px] text-slate-500 tabular-nums">
                      उत्तर दिए: {t.correct + t.wrong}/{t.total} · छूटे (Skipped): {t.unanswered}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Skill / Question-Aspect Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h5 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>२. प्रश्न-प्रकार व कौशल विश्लेषण (By Skill Type)</span>
            </h5>
            <span className="text-[11px] text-slate-500 tabular-nums">
              {report.skillBreakdown.length} कौशल
            </span>
          </div>

          <div className="space-y-2.5">
            {report.skillBreakdown.map((s) => {
              const barColor =
                s.percentage >= 80
                  ? 'bg-indigo-600'
                  : s.percentage >= 50
                  ? 'bg-amber-500'
                  : 'bg-rose-600';

              return (
                <div key={s.key} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <div className="font-bold text-slate-900">
                      <span>{s.nameHindi}</span>
                      {bilingualMode && (
                        <span className="text-[11px] font-normal text-slate-500 ml-1.5">
                          ({s.nameEnglish})
                        </span>
                      )}
                    </div>
                    <div className="font-black text-slate-900 shrink-0 tabular-nums">
                      {s.correct}/{s.total} ({s.percentage}%)
                    </div>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${barColor}`}
                      style={{ width: `${s.percentage > 0 ? Math.max(4, s.percentage) : 0}%` }}
                    />
                  </div>
                  {s.unanswered > 0 && (
                    <div className="text-[10px] text-slate-500 tabular-nums">
                      उत्तर दिए: {s.attempted}/{s.total} · छूटे (Skipped): {s.unanswered}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 2: Where the Student Has Done Wrong */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h5 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
            {report.mistakes.length > 0 ? (
              <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            )}
            <span>
              ३. कहाँ गलती हुई और सही उत्तर क्या है ({report.mistakes.length} त्रुटि{report.mistakes.length === 1 ? '' : 'याँ'})
            </span>
          </h5>
          {bilingualMode && (
            <span className="text-[11px] text-slate-500">
              Detailed Question-by-Question Error Review
            </span>
          )}
        </div>

        {report.mistakes.length === 0 ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm font-semibold text-emerald-900 flex items-center gap-2.5">
            <Award className="w-5 h-5 text-emerald-700 shrink-0" />
            <span>
              बधाई हो! इस अभ्यास में आपका एक भी उत्तर गलत नहीं हुआ। सभी प्रश्नों में आपकी समझ सटीक रही।
            </span>
          </div>
        ) : (
          <div className="space-y-3">
            {report.mistakes.map((m) => (
              <div
                key={`${m.questionId}_${m.questionNumber}`}
                className={`p-4 rounded-xl border space-y-2.5 text-xs ${
                  m.isUnanswered
                    ? 'bg-amber-50/40 border-amber-200'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between gap-2 flex-wrap text-[11px] text-slate-600">
                  <div className="flex items-center gap-1.5 flex-wrap font-semibold">
                    <span className="font-black text-slate-900 tabular-nums">प्रश्न {m.questionNumber}</span>
                    <span aria-hidden="true">·</span>
                    <span>{m.topicHindi}</span>
                    <span aria-hidden="true">·</span>
                    <span>{m.skillHindi}</span>
                  </div>
                  {m.isUnanswered ? (
                    <span className="font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>अनुत्तरित (Skipped — 0 अंक)</span>
                    </span>
                  ) : (
                    <span className="font-bold text-rose-700 flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>गलत उत्तर (Incorrect)</span>
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                  {m.questionHindi}
                </p>
                {bilingualMode && m.questionEnglish && (
                  <p className="text-[11px] text-slate-500 italic">{m.questionEnglish}</p>
                )}

                <div className="grid sm:grid-cols-2 gap-2.5">
                  <div
                    className={`p-2.5 rounded-lg border ${
                      m.isUnanswered
                        ? 'bg-amber-50 border-amber-200 text-amber-950'
                        : 'bg-rose-50 border-rose-200 text-rose-900'
                    }`}
                  >
                    <span
                      className={`text-[11px] font-bold block mb-0.5 ${
                        m.isUnanswered ? 'text-amber-900' : 'text-rose-800'
                      }`}
                    >
                      आपका उत्तर {bilingualMode ? '(Your Answer)' : ''}:
                    </span>
                    <span className="font-semibold">{m.selectedTextHindi}</span>
                  </div>
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-950">
                    <span className="text-[11px] font-bold block text-emerald-800 mb-0.5">
                      सही उत्तर {bilingualMode ? '(Correct Answer)' : ''}:
                    </span>
                    <span className="font-bold">{m.correctTextHindi}</span>
                  </div>
                </div>

                <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 leading-relaxed">
                  <strong className="font-bold text-slate-900">नियम व कारण (Why): </strong>
                  <span>{m.explanationHindi}</span>
                  {bilingualMode && m.explanationEnglish && (
                    <span className="block text-[11px] text-slate-500 italic mt-0.5">
                      {m.explanationEnglish}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 3: How the Student Can Improve */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h5 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
            <span>४. आगे सुधार कैसे करें (Actionable Improvement Plan)</span>
          </h5>
          {bilingualMode && (
            <span className="text-[11px] text-slate-500">
              Targeted Next Steps Based on This Attempt
            </span>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-3.5">
          {report.improvementPlan.map((item) => {
            const priorityBadge =
              item.priority === 'high'
                ? 'text-rose-800 bg-rose-50 border-rose-200'
                : item.priority === 'medium'
                ? 'text-amber-900 bg-amber-50 border-amber-200'
                : 'text-emerald-900 bg-emerald-50 border-emerald-200';
            const priorityText =
              item.priority === 'high'
                ? 'प्राथमिकता: उच्च'
                : item.priority === 'medium'
                ? 'प्राथमिकता: मध्यम'
                : 'उत्कृष्ट स्तर बनाए रखें';

            return (
              <div
                key={item.id}
                className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h6 className="font-black text-slate-900 text-xs sm:text-sm">
                        {item.titleHindi}
                      </h6>
                      {bilingualMode && (
                        <span className="text-[11px] text-slate-500 block">
                          {item.titleEnglish}
                        </span>
                      )}
                    </div>
                    <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold shrink-0 tabular-nums ${priorityBadge}`}>
                      {item.scoreLabel} · {priorityText}
                    </span>
                  </div>

                  <p className="text-slate-700 leading-relaxed">
                    {item.diagnosisHindi}
                  </p>
                  {bilingualMode && (
                    <p className="text-[11px] text-slate-500 italic leading-relaxed">
                      {item.diagnosisEnglish}
                    </p>
                  )}

                  <ul className="space-y-1.5 pt-1 text-slate-800">
                    {item.actionStepsHindi.map((step, sIdx) => (
                      <li key={sIdx} className="flex items-start gap-2 leading-snug">
                        <span className="font-black text-indigo-700 tabular-nums shrink-0">
                          {sIdx + 1}.
                        </span>
                        <div>
                          <span>{step}</span>
                          {bilingualMode && item.actionStepsEnglish[sIdx] && (
                            <span className="block text-[11px] text-slate-500 italic">
                              {item.actionStepsEnglish[sIdx]}
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {(onOpenMistakeRecovery || onOpenPracticeTab) && report.mistakes.length > 0 && (
          <div className="pt-2 flex flex-wrap items-center gap-2.5 print:hidden">
            {onOpenMistakeRecovery && (
              <button
                type="button"
                onClick={onOpenMistakeRecovery}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap"
              >
                <span>गलती-सुधार विशेष वर्कशीट में अभ्यास करें</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            {onOpenPracticeTab && (
              <button
                type="button"
                onClick={() => onOpenPracticeTab('modules')}
                className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-bold rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap"
              >
                <span>व्याकरण सिमुलेशन से नियम दोहराएँ</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
