import { QuizQuestion, StudentWorksheetSubmission, TeacherWorksheet } from '../types';

export interface PrintableWorksheetInput {
  titleHindi: string;
  subtitle?: string;
  grade?: string;
  board?: string;
  topic?: string;
  section?: string;
  difficulty?: string;
  teacherName?: string;
  teacherEmail?: string;
  instructionsHindi?: string[];
  questions: Array<
    Pick<
      QuizQuestion,
      'questionHindi' | 'questionEnglish' | 'options' | 'correctIndex' | 'explanationHindi'
    >
  >;
  includeAnswers?: boolean;
  includeEnglish?: boolean;
  footerLabel?: string;
}

export interface PrintableTeacherReportInput {
  titleHindi: string;
  subtitle?: string;
  teacherName: string;
  teacherEmail: string;
  totalAttempts: number;
  averagePercentage: number;
  passRate: number;
  passCount: number;
  distinctionRate: number;
  distinctionCount: number;
  topicStats?: Array<{
    topicName: string;
    attempts: number;
    percentage: number;
  }>;
  worksheets?: Array<{
    titleHindi: string;
    grade: string;
    topic: string;
    section?: string;
    questionCount: number;
    attempts: number;
    avgScoreLabel: string;
    passRate: number;
  }>;
  submissions: Array<{
    studentName: string;
    studentEmail: string;
    worksheetTitle: string;
    grade?: string;
    score: number;
    maxScore: number;
    percentage: number;
    attemptedAt: string;
  }>;
}

export type PrintPreviewPayload =
  | {
      kind: 'worksheet';
      worksheet: PrintableWorksheetInput;
    }
  | {
      kind: 'html';
      title: string;
      subtitle?: string;
      htmlDocument: string;
      filenameSlug: string;
    };

export const PRINT_PREVIEW_EVENT = 'shabdshilp:open-print-preview';
const PRINT_ROOT_ID = 'shabdshilp-print-root';

export const escapePrintHtml = (val: unknown): string =>
  String(val ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export const sanitizeFilename = (name: string): string => {
  const cleaned = String(name || 'shabdshilp-document')
    .replace(/[\\/:*?"<>|]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 64);
  return cleaned || 'shabdshilp-document';
};

/**
 * Synchronously syncs #shabdshilp-print-root in document.body so that
 * both synchronous window.print() and manual Ctrl+P / Cmd+P print cleanly.
 */
export function syncPrintRootWithHtml(fullHtmlDocument: string): void {
  if (typeof document === 'undefined') return;
  try {
    let root = document.getElementById(PRINT_ROOT_ID);
    if (!root) {
      root = document.createElement('div');
      root.id = PRINT_ROOT_ID;
      document.body.appendChild(root);
    }

    const parsed = new DOMParser().parseFromString(fullHtmlDocument, 'text/html');
    const styleTags = Array.from(parsed.querySelectorAll('style'))
      .map((s) => s.textContent || '')
      .join('\n');

    root.innerHTML = '';
    if (styleTags.trim()) {
      const styleEl = document.createElement('style');
      styleEl.textContent = styleTags;
      root.appendChild(styleEl);
    }

    const contentWrap = document.createElement('div');
    contentWrap.innerHTML = parsed.body ? parsed.body.innerHTML : fullHtmlDocument;
    root.appendChild(contentWrap);

    document.body.classList.add('shabdshilp-print-active');
  } catch (_e) {}
}

export function clearPrintRoot(): void {
  if (typeof document === 'undefined') return;
  try {
    document.body.classList.remove('shabdshilp-print-active');
    const root = document.getElementById(PRINT_ROOT_ID);
    if (root) {
      root.innerHTML = '';
    }
  } catch (_e) {}
}

/**
 * Synchronously invokes window.print() with user activation preserved.
 */
export function triggerNativePrint(fullHtmlDocument: string): void {
  syncPrintRootWithHtml(fullHtmlDocument);
  try {
    window.focus();
    window.print();
  } catch (_e) {}
}

/**
 * Injects a crisp print/save-PDF helper bar (hidden on paper) into standalone downloaded HTML
 * so users can open the downloaded file in any browser tab and print/save as PDF effortlessly.
 */
export function downloadPrintableHtml(fullHtmlDocument: string, filenameBase: string): void {
  if (typeof document === 'undefined') return;
  try {
    const toolbarCss = `
      .ss-download-toolbar {
        position: sticky; top: 0; z-index: 999;
        background: #1e1b4b; color: #fff; padding: 10px 16px;
        display: flex; align-items: center; justify-content: space-between; gap: 12px;
        font-family: system-ui, -apple-system, sans-serif; font-size: 13px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      }
      .ss-download-btn {
        background: #fbbf24; color: #0f172a; border: 0; border-radius: 8px;
        padding: 7px 14px; font-weight: 800; cursor: pointer; font-size: 12px;
      }
      @media print { .ss-download-toolbar { display: none !important; } }
    `;
    const toolbarHtml = `
      <div class="ss-download-toolbar">
        <span><strong>शब्दशिल्प (ShabdShilp)</strong> — प्रिंटेबल दस्तावेज़</span>
        <button class="ss-download-btn" onclick="window.print()">🖨️ प्रिंट करें / Save as PDF</button>
      </div>
    `;

    let enhancedHtml = fullHtmlDocument;
    if (enhancedHtml.includes('</head>')) {
      enhancedHtml = enhancedHtml.replace('</head>', `<style>${toolbarCss}</style></head>`);
    }
    if (enhancedHtml.includes('<body>')) {
      enhancedHtml = enhancedHtml.replace('<body>', `<body>${toolbarHtml}`);
    }

    const blob = new Blob(['\uFEFF' + enhancedHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${sanitizeFilename(filenameBase)}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  } catch (_e) {}
}

export function getShabdShilpLogoUrl(): string {
  return typeof window !== 'undefined'
    ? `${window.location.origin}/assets/aistudio/mail.google_a65ce30f.png`
    : '/assets/aistudio/mail.google_a65ce30f.png';
}

export function getTechPreneurLogoUrl(): string {
  return typeof window !== 'undefined'
    ? `${window.location.origin}/assets/aistudio/TechPreneur_Logo_a019c2b1.png`
    : '/assets/aistudio/TechPreneur_Logo_a019c2b1.png';
}

export function getPrintBrandLogosHtml(sizePx: number = 48): string {
  const shabdShilpLogoUrl = getShabdShilpLogoUrl();
  const techLogoUrl = getTechPreneurLogoUrl();
  const radius = Math.max(8, Math.round(sizePx * 0.2));
  const brandWidth = sizePx;
  return `
    <div class="ss-logos-pair" style="display:inline-flex; align-items:center; gap:8px; flex-shrink:0; -webkit-print-color-adjust:exact; print-color-adjust:exact;">
      <img
        class="ss-brand-logo"
        src="${shabdShilpLogoUrl}"
        alt="शब्दशिल्प (ShabdShilp) Logo"
        style="width:${brandWidth}px; height:${sizePx}px; object-fit:cover; object-position:center; border-radius:${radius}px; border:1px solid #cbd5e1; background:#091124; display:block; flex-shrink:0; box-shadow:0 1px 3px rgba(30,27,75,0.18);"
      />
      <img
        class="ss-logo"
        src="${techLogoUrl}"
        alt="TechPreneur Logo"
        style="width:${sizePx}px; height:${sizePx}px; object-fit:contain; border-radius:${radius}px; border:1px solid #cbd5e1; padding:2px; background:#ffffff; display:block; flex-shrink:0;"
      />
    </div>
  `.trim();
}

export function buildWorksheetHtmlDocument(ws: PrintableWorksheetInput): string {
  const brandLogosHtml = getPrintBrandLogosHtml(50);

  const instructions =
    ws.instructionsHindi && ws.instructionsHindi.length > 0
      ? ws.instructionsHindi
      : [
          'सभी प्रश्न अनिवार्य हैं। प्रत्येक सही उत्तर के लिए १ अंक निर्धारित है।',
          'प्रत्येक प्रश्न के चार विकल्पों (A, B, C, D) में से सर्वाधिक उपयुक्त उत्तर चुनें।',
        ];

  const instructionsHtml = `
    <div class="ss-instructions">
      <strong>सामान्य निर्देश (Instructions):</strong>
      <ul>
        ${instructions.map((ins) => `<li>${escapePrintHtml(ins)}</li>`).join('')}
      </ul>
    </div>
  `;

  const questionsHtml = (ws.questions || [])
    .map((q, idx) => {
      const optionsHtml = (q.options || [])
        .map((opt: any, oIdx: number) => {
          const textHindi = typeof opt === 'string' ? opt : opt?.textHindi || String(opt || '');
          const textEng = typeof opt === 'object' && opt?.textEnglish ? opt.textEnglish : '';
          return `
            <div class="ss-option">
              <span class="ss-opt-letter">(${String.fromCharCode(65 + oIdx)})</span>
              <span>${escapePrintHtml(textHindi)}</span>
              ${
                ws.includeEnglish && textEng
                  ? `<span class="ss-opt-eng">(${escapePrintHtml(textEng)})</span>`
                  : ''
              }
            </div>
          `;
        })
        .join('');

      return `
        <div class="ss-q-box">
          <div class="ss-question">
            <span>Q${idx + 1}. ${escapePrintHtml(q.questionHindi)}</span>
            ${
              ws.includeEnglish && q.questionEnglish
                ? `<div class="ss-q-eng">${escapePrintHtml(q.questionEnglish)}</div>`
                : ''
            }
          </div>
          <div class="ss-options">
            ${optionsHtml}
          </div>
        </div>
      `;
    })
    .join('');

  const answerKeyHtml = ws.includeAnswers
    ? `
      <div class="ss-answer-key">
        <h3>उत्तर कुंजी एवं व्याख्या (Answer Key &amp; Explanations)</h3>
        ${(ws.questions || [])
          .map((q, idx) => {
            const idxNum = typeof q.correctIndex === 'number' ? q.correctIndex : 0;
            const opt: any = q.options?.[idxNum];
            const ansText = typeof opt === 'string' ? opt : opt?.textHindi || '';
            return `
              <div class="ss-ak-item">
                <strong>Q${idx + 1}.</strong> सही विकल्प:
                <strong>(${String.fromCharCode(65 + idxNum)})</strong>
                ${escapePrintHtml(ansText)}
                ${
                  q.explanationHindi
                    ? `<div class="ss-ak-exp">${escapePrintHtml(q.explanationHindi)}</div>`
                    : ''
                }
              </div>
            `;
          })
          .join('')}
      </div>
    `
    : '';

  return `<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8" />
  <title>${escapePrintHtml(ws.titleHindi)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet" />
  <style>
    @page { size: A4; margin: 14mm; }
    .ss-print-doc {
      font-family: 'Noto Sans Devanagari', 'Plus Jakarta Sans', Arial, sans-serif;
      color: #0f172a;
      line-height: 1.55;
      margin: 0 auto;
      padding: 16px 20px;
      max-width: 820px;
      background: #ffffff;
    }
    .ss-print-doc * { box-sizing: border-box; }
    .ss-print-doc .ss-header {
      display: flex; align-items: center; justify-content: space-between;
      border-bottom: 2px solid #4338ca; padding-bottom: 12px; margin-bottom: 14px; gap: 14px;
    }
    .ss-print-doc .ss-brand { display: flex; align-items: center; gap: 12px; }
    .ss-print-doc .ss-logo {
      width: 52px; height: 52px; object-fit: contain; border-radius: 10px;
      border: 1px solid #cbd5e1; padding: 2px; background: #fff;
    }
    .ss-print-doc h1 { margin: 0; font-size: 19px; color: #1e1b4b; font-weight: 800; line-height: 1.3; }
    .ss-print-doc .ss-subtitle { font-size: 12px; color: #475569; margin-top: 2px; }
    .ss-print-doc .ss-badge-right { text-align: right; font-size: 12px; flex-shrink: 0; white-space: nowrap; }
    .ss-print-doc .ss-meta {
      display: flex; flex-wrap: wrap; gap: 10px 16px; font-size: 12px;
      background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;
      padding: 8px 12px; margin-bottom: 12px;
    }
    .ss-print-doc .ss-student-line {
      display: flex; justify-content: space-between; flex-wrap: wrap; gap: 12px 16px;
      font-size: 12px; margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px dashed #cbd5e1;
    }
    .ss-print-doc .ss-instructions {
      background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;
      padding: 9px 14px; margin-bottom: 16px; font-size: 12px;
    }
    .ss-print-doc .ss-instructions ul { margin: 4px 0 0 18px; padding: 0; }
    .ss-print-doc .ss-q-box {
      margin-bottom: 12px; page-break-inside: avoid; break-inside: avoid;
      border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 12px;
    }
    .ss-print-doc .ss-question { font-weight: 700; font-size: 13.5px; margin-bottom: 7px; color: #0f172a; }
    .ss-print-doc .ss-q-eng { font-weight: 500; font-size: 11.5px; color: #475569; margin-top: 2px; font-style: italic; }
    .ss-print-doc .ss-options { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 12px; font-size: 12.5px; }
    .ss-print-doc .ss-option { padding: 4px 7px; border: 1px solid #e2e8f0; border-radius: 5px; background: #fcfcfd; }
    .ss-print-doc .ss-opt-letter { font-weight: 700; color: #312e81; margin-right: 4px; }
    .ss-print-doc .ss-opt-eng { display: block; font-size: 10.5px; color: #64748b; margin-left: 22px; }
    .ss-print-doc .ss-answer-key {
      margin-top: 22px; padding-top: 14px; border-top: 2px solid #cbd5e1; page-break-before: auto;
    }
    .ss-print-doc .ss-answer-key h3 { margin: 0 0 10px 0; font-size: 15px; color: #1e1b4b; }
    .ss-print-doc .ss-ak-item {
      font-size: 12px; margin-bottom: 8px; page-break-inside: avoid; break-inside: avoid;
      padding: 6px 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px;
    }
    .ss-print-doc .ss-ak-exp { color: #334155; margin-top: 2px; font-size: 11.5px; }
    .ss-print-doc .ss-footer {
      margin-top: 24px; padding-top: 10px; border-top: 1px solid #cbd5e1;
      display: flex; align-items: center; justify-content: space-between; font-size: 11px; color: #475569;
    }
  </style>
</head>
<body>
  <div class="ss-print-doc">
    <div class="ss-header">
      <div class="ss-brand">
        ${brandLogosHtml}
        <div>
          <h1>${escapePrintHtml(ws.titleHindi)}</h1>
          ${ws.subtitle ? `<div class="ss-subtitle">${escapePrintHtml(ws.subtitle)}</div>` : ''}
        </div>
      </div>
      <div class="ss-badge-right">
        <strong>शब्दशिल्प (ShabdShilp)</strong><br />
        <span>${escapePrintHtml(ws.board || 'ICSE')} • ${escapePrintHtml(ws.grade || '')}</span>
      </div>
    </div>

    <div class="ss-meta">
      ${ws.topic ? `<span><strong>विषय:</strong> ${escapePrintHtml(ws.topic)}</span>` : ''}
      ${ws.section ? `<span><strong>सेक्शन:</strong> ${escapePrintHtml(ws.section)}</span>` : ''}
      ${ws.difficulty ? `<span><strong>स्तर:</strong> ${escapePrintHtml(ws.difficulty)}</span>` : ''}
      <span><strong>कुल प्रश्न:</strong> ${(ws.questions || []).length}</span>
      <span><strong>पूर्णांक:</strong> ${(ws.questions || []).length}</span>
      ${ws.teacherName ? `<span><strong>शिक्षक:</strong> ${escapePrintHtml(ws.teacherName)}</span>` : ''}
    </div>

    <div class="ss-student-line">
      <span><strong>विद्यार्थी का नाम:</strong> ___________________________</span>
      <span><strong>दिनांक:</strong> _______________</span>
      <span><strong>प्राप्तांक:</strong> _____ / ${(ws.questions || []).length}</span>
    </div>

    ${instructionsHtml}

    <div>${questionsHtml}</div>

    ${answerKeyHtml}

    <div class="ss-footer">
      <span>${escapePrintHtml(ws.footerLabel || 'शब्दशिल्प (ShabdShilp) • ICSE हिंदी व्याकरण वर्कशीट')}</span>
      <span>${escapePrintHtml(ws.grade || '')}</span>
    </div>
  </div>
</body>
</html>`;
}

export function buildTeacherClassReportHtml(report: PrintableTeacherReportInput): string {
  const brandLogosHtml = getPrintBrandLogosHtml(46);

  const topicSectionHtml =
    report.topicStats && report.topicStats.length > 0
      ? `
        <h2>१. विषयवार दक्षता विश्लेषण (Topic Mastery Analysis)</h2>
        <table>
          <thead>
            <tr>
              <th>विषय (Topic)</th>
              <th style="text-align:center;">छात्र प्रयास</th>
              <th style="text-align:center;">औसत दक्षता %</th>
            </tr>
          </thead>
          <tbody>
            ${report.topicStats
              .map(
                (t) => `
                <tr>
                  <td>${escapePrintHtml(t.topicName)}</td>
                  <td style="text-align:center; font-variant-numeric:tabular-nums;">${t.attempts}</td>
                  <td style="text-align:center; font-weight:700; font-variant-numeric:tabular-nums;">${t.percentage}%</td>
                </tr>`
              )
              .join('')}
          </tbody>
        </table>
      `
      : '';

  const worksheetsSectionHtml =
    report.worksheets && report.worksheets.length > 0
      ? `
        <h2>${report.topicStats && report.topicStats.length > 0 ? '२.' : '१.'} वर्कशीटवार सारांश (Worksheet Summary)</h2>
        <table>
          <thead>
            <tr>
              <th>वर्कशीट</th>
              <th>कक्षा व विषय</th>
              <th style="text-align:center;">प्रयास</th>
              <th style="text-align:center;">औसत अंक</th>
              <th style="text-align:center;">उत्तीर्ण दर</th>
            </tr>
          </thead>
          <tbody>
            ${report.worksheets
              .map(
                (w) => `
                <tr>
                  <td><strong>${escapePrintHtml(w.titleHindi)}</strong></td>
                  <td>${escapePrintHtml(w.grade)} • ${escapePrintHtml(w.topic)}${w.section ? ` (${escapePrintHtml(w.section)})` : ''}</td>
                  <td style="text-align:center;">${w.attempts}</td>
                  <td style="text-align:center; font-weight:700;">${escapePrintHtml(w.avgScoreLabel)}</td>
                  <td style="text-align:center; font-weight:700;">${w.passRate}%</td>
                </tr>`
              )
              .join('')}
          </tbody>
        </table>
      `
      : '';

  const getGradeLabel = (pct: number) =>
    pct >= 80 ? 'A+ (उत्कृष्ट)' : pct >= 60 ? 'A (उत्तम)' : pct >= 50 ? 'B (संतोषजनक)' : 'C (सुधार आवश्यक)';

  const subSectionNum =
    1 +
    (report.topicStats && report.topicStats.length > 0 ? 1 : 0) +
    (report.worksheets && report.worksheets.length > 0 ? 1 : 0);

  const submissionsHtml =
    report.submissions.length === 0
      ? `<p class="ss-empty">अभी तक कोई छात्र सबमिशन दर्ज नहीं है।</p>`
      : `
        <table>
          <thead>
            <tr>
              <th>क्र.</th>
              <th>छात्र का नाम</th>
              <th>ईमेल</th>
              <th>वर्कशीट</th>
              <th style="text-align:center;">प्राप्तांक</th>
              <th style="text-align:center;">प्रतिशत</th>
              <th style="text-align:center;">श्रेणी</th>
              <th>दिनांक / समय</th>
            </tr>
          </thead>
          <tbody>
            ${report.submissions
              .map(
                (s, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td><strong>${escapePrintHtml(s.studentName)}</strong></td>
                  <td style="font-family:monospace; font-size:10.5px;">${escapePrintHtml(s.studentEmail)}</td>
                  <td>${escapePrintHtml(s.worksheetTitle)}</td>
                  <td style="text-align:center; font-weight:700; font-variant-numeric:tabular-nums;">${s.score} / ${s.maxScore}</td>
                  <td style="text-align:center; font-weight:700; font-variant-numeric:tabular-nums;">${s.percentage}%</td>
                  <td style="text-align:center;">${escapePrintHtml(getGradeLabel(s.percentage))}</td>
                  <td style="font-size:10.5px;">${escapePrintHtml(s.attemptedAt)}</td>
                </tr>`
              )
              .join('')}
          </tbody>
        </table>
      `;

  return `<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8" />
  <title>${escapePrintHtml(report.titleHindi)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet" />
  <style>
    @page { size: A4; margin: 14mm; }
    .ss-print-doc {
      font-family: 'Noto Sans Devanagari', 'Plus Jakarta Sans', Arial, sans-serif;
      color: #0f172a; line-height: 1.5; margin: 0 auto; padding: 16px 20px;
      max-width: 860px; font-size: 12px; background: #ffffff;
    }
    .ss-print-doc * { box-sizing: border-box; }
    .ss-print-doc .ss-header {
      display: flex; justify-content: space-between; align-items: center;
      border-bottom: 2px solid #4338ca; padding-bottom: 10px; margin-bottom: 14px; gap: 12px;
    }
    .ss-print-doc .ss-brand { display: flex; align-items: center; gap: 10px; }
    .ss-print-doc .ss-logo { width: 48px; height: 48px; object-fit: contain; border: 1px solid #cbd5e1; border-radius: 8px; padding: 2px; background: #fff; }
    .ss-print-doc h1 { margin: 0; font-size: 18px; color: #1e1b4b; font-weight: 800; }
    .ss-print-doc h2 { margin: 18px 0 8px 0; font-size: 14px; color: #312e81; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
    .ss-print-doc .ss-kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 14px; }
    .ss-print-doc .ss-kpi { border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px 10px; background: #f8fafc; }
    .ss-print-doc .ss-kpi-label { font-size: 10px; color: #475569; display: block; }
    .ss-print-doc .ss-kpi-val { font-size: 16px; font-weight: 800; color: #0f172a; font-variant-numeric: tabular-nums; }
    .ss-print-doc table { width: 100%; border-collapse: collapse; margin-bottom: 14px; font-size: 11px; }
    .ss-print-doc th, .ss-print-doc td { border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; }
    .ss-print-doc th { background: #f1f5f9; font-weight: 700; }
    .ss-print-doc tr { page-break-inside: avoid; break-inside: avoid; }
    .ss-print-doc .ss-empty { padding: 12px; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; color: #475569; text-align: center; }
    .ss-print-doc .ss-footer {
      margin-top: 22px; padding-top: 10px; border-top: 1px solid #cbd5e1;
      display: flex; justify-content: space-between; font-size: 11px; color: #475569;
    }
  </style>
</head>
<body>
  <div class="ss-print-doc">
    <div class="ss-header">
      <div class="ss-brand">
        ${brandLogosHtml}
        <div>
          <h1>${escapePrintHtml(report.titleHindi)}</h1>
          <div style="color:#475569; font-size:11.5px;">
            ${report.subtitle ? `${escapePrintHtml(report.subtitle)} · ` : ''}शिक्षक: ${escapePrintHtml(report.teacherName)} (${escapePrintHtml(report.teacherEmail)})
          </div>
        </div>
      </div>
      <div style="text-align:right; font-size:11px; white-space:nowrap;">
        <strong>शब्दशिल्प (ShabdShilp)</strong><br />
        <span>दिनांक: ${new Date().toLocaleDateString('hi-IN')}</span>
      </div>
    </div>

    <div class="ss-kpis">
      <div class="ss-kpi"><span class="ss-kpi-label">कुल छात्र प्रयास (Attempts)</span><span class="ss-kpi-val">${report.totalAttempts}</span></div>
      <div class="ss-kpi"><span class="ss-kpi-label">औसत प्राप्तांक (Average)</span><span class="ss-kpi-val">${report.averagePercentage}%</span></div>
      <div class="ss-kpi"><span class="ss-kpi-label">उत्तीर्ण दर (Pass ≥50%)</span><span class="ss-kpi-val">${report.passRate}% (${report.passCount})</span></div>
      <div class="ss-kpi"><span class="ss-kpi-label">उत्कृष्ट (≥80%)</span><span class="ss-kpi-val">${report.distinctionRate}% (${report.distinctionCount})</span></div>
    </div>

    ${topicSectionHtml}
    ${worksheetsSectionHtml}

    <h2>${subSectionNum}. छात्र प्रदर्शन सूची (Student Submissions)</h2>
    ${submissionsHtml}

    <div class="ss-footer">
      <span>शब्दशिल्प (ShabdShilp) • शिक्षक प्रगति रिपोर्ट</span>
      <span>${escapePrintHtml(report.teacherName)}</span>
    </div>
  </div>
</body>
</html>`;
}

function dispatchPrintPreview(payload: PrintPreviewPayload, autoPrint: boolean): void {
  const htmlDoc =
    payload.kind === 'worksheet'
      ? buildWorksheetHtmlDocument(payload.worksheet)
      : payload.htmlDocument;

  if (autoPrint) {
    triggerNativePrint(htmlDoc);
  } else {
    syncPrintRootWithHtml(htmlDoc);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent<PrintPreviewPayload>(PRINT_PREVIEW_EVENT, { detail: payload }));
  }
}

export function printRawHtmlDocument(
  htmlContent: string,
  meta?: { title?: string; subtitle?: string; filenameSlug?: string }
): void {
  dispatchPrintPreview(
    {
      kind: 'html',
      title: meta?.title || 'प्रिंट पूर्वावलोकन (Print Preview)',
      subtitle: meta?.subtitle,
      htmlDocument: htmlContent,
      filenameSlug: meta?.filenameSlug || 'shabdshilp-report',
    },
    true
  );
}

export function printWorksheetDocument(ws: PrintableWorksheetInput): void {
  dispatchPrintPreview(
    {
      kind: 'worksheet',
      worksheet: ws,
    },
    true
  );
}

export function downloadWorksheetDocument(ws: PrintableWorksheetInput): void {
  const html = buildWorksheetHtmlDocument(ws);
  downloadPrintableHtml(html, ws.titleHindi || 'shabdshilp-worksheet');
}

export function printTeacherWorksheetItem(ws: TeacherWorksheet, includeEnglish = false): void {
  printWorksheetDocument({
    titleHindi: ws.titleHindi,
    subtitle: `दिनांक: ${ws.createdAt} • शिक्षक प्रमाणित वर्कशीट`,
    grade: ws.grade,
    board: 'ICSE',
    topic: ws.topic,
    section: ws.section,
    difficulty: ws.difficulty,
    teacherName: ws.teacherName,
    teacherEmail: ws.teacherEmail,
    questions: ws.questions || [],
    includeAnswers: false,
    includeEnglish,
    footerLabel: 'शब्दशिल्प (ShabdShilp) • शिक्षक प्रमाणित वर्कशीट',
  });
}

export function printTeacherClassReport(report: PrintableTeacherReportInput): void {
  const html = buildTeacherClassReportHtml(report);
  printRawHtmlDocument(html, {
    title: report.titleHindi,
    subtitle: `शिक्षक: ${report.teacherName}`,
    filenameSlug: report.titleHindi,
  });
}

export function buildTeacherSubmissionWorksheetMeta(
  ws: { titleHindi: string; grade: string; topic: string; section?: string; questionCount: number },
  submissions: StudentWorksheetSubmission[],
  teacherName: string,
  teacherEmail: string
): PrintableTeacherReportInput {
  const totalAttempts = submissions.length;
  const averagePercentage =
    totalAttempts > 0
      ? Math.round(submissions.reduce((acc, s) => acc + s.percentage, 0) / totalAttempts)
      : 0;
  const passCount = submissions.filter((s) => s.percentage >= 50).length;
  const passRate = totalAttempts > 0 ? Math.round((passCount / totalAttempts) * 100) : 0;
  const distinctionCount = submissions.filter((s) => s.percentage >= 80).length;
  const distinctionRate = totalAttempts > 0 ? Math.round((distinctionCount / totalAttempts) * 100) : 0;

  return {
    titleHindi: `वर्कशीट प्रगति रिपोर्ट: ${ws.titleHindi}`,
    subtitle: `${ws.grade} • ${ws.topic}${ws.section ? ` (${ws.section})` : ''} • कुल प्रश्न: ${ws.questionCount}`,
    teacherName,
    teacherEmail,
    totalAttempts,
    averagePercentage,
    passRate,
    passCount,
    distinctionRate,
    distinctionCount,
    submissions: submissions.map((s) => ({
      studentName: s.studentName,
      studentEmail: s.studentEmail,
      worksheetTitle: ws.titleHindi,
      grade: s.grade,
      score: s.score,
      maxScore: s.maxScore,
      percentage: s.percentage,
      attemptedAt: s.attemptedAt,
    })),
  };
}

export function buildSavedReportsHtmlDocument(
  reports: Array<{
    titleHindi: string;
    date: string;
    grade?: string;
    score: number;
    maxScore: number;
    attemptedCount?: number;
    unansweredCount?: number;
    percentage: number;
    wordCoinsEarned: number;
    weakAreasHindi: string[];
    strongAreasHindi: string[];
    adviceSummaryHindi?: string;
  }>,
  studentInfo?: { userName?: string; email?: string; grade?: string }
): { title: string; html: string } {
  const brandLogosHtml = getPrintBrandLogosHtml(46);

  const cardsHtml = reports
    .map(
      (rep, idx) => `
      <div class="ss-rep-card">
        <div class="ss-rep-head">
          <div>
            <h3>${reports.length > 1 ? `${idx + 1}. ` : ''}${escapePrintHtml(rep.titleHindi)}</h3>
            <div class="ss-rep-meta">${escapePrintHtml(rep.date)}${rep.grade ? ` • ${escapePrintHtml(rep.grade)}` : ''}</div>
          </div>
          <div class="ss-rep-score">
            <strong>${rep.score} / ${rep.maxScore} (${rep.percentage}%)</strong>
            ${
              typeof rep.attemptedCount === 'number'
                ? `<div style="font-size:10.5px; color:#475569;">हल: ${rep.attemptedCount}/${rep.maxScore}${
                    rep.unansweredCount && rep.unansweredCount > 0 ? ` · छूटे (Skipped): ${rep.unansweredCount}` : ''
                  }</div>`
                : ''
            }
            ${rep.wordCoinsEarned > 0 ? `<div class="ss-coins">+${rep.wordCoinsEarned} WordCoins</div>` : ''}
          </div>
        </div>
        ${
          rep.strongAreasHindi.length > 0
            ? `<div class="ss-box ss-strong"><strong>मजबूत पक्ष:</strong> ${escapePrintHtml(rep.strongAreasHindi.join(', '))}</div>`
            : ''
        }
        ${
          rep.weakAreasHindi.length > 0
            ? `<div class="ss-box ss-weak"><strong>सुधार क्षेत्र:</strong> ${escapePrintHtml(rep.weakAreasHindi.join(', '))}</div>`
            : ''
        }
        ${
          rep.adviceSummaryHindi
            ? `<div class="ss-advice"><strong>सुझाव:</strong> ${escapePrintHtml(rep.adviceSummaryHindi)}</div>`
            : ''
        }
      </div>
    `
    )
    .join('');

  const title =
    reports.length === 1
      ? `प्रगति रिपोर्ट — ${reports[0].titleHindi}`
      : `विद्यार्थी प्रगति रिपोर्ट कार्ड (${reports.length} रिपोर्ट)`;

  const html = `<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8" />
  <title>${escapePrintHtml(title)}</title>
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
    .ss-print-doc .ss-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #4338ca; padding-bottom: 10px; margin-bottom: 14px; gap: 12px; }
    .ss-print-doc .ss-brand { display: flex; align-items: center; gap: 10px; }
    .ss-print-doc .ss-logo { width: 46px; height: 46px; object-fit: contain; border: 1px solid #cbd5e1; border-radius: 8px; padding: 2px; background: #fff; }
    .ss-print-doc h1 { margin: 0; font-size: 18px; color: #1e1b4b; font-weight: 800; }
    .ss-print-doc .ss-rep-card { border: 1px solid #cbd5e1; border-radius: 10px; padding: 12px 14px; margin-bottom: 12px; page-break-inside: avoid; break-inside: avoid; background: #f8fafc; }
    .ss-print-doc .ss-rep-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 8px; }
    .ss-print-doc .ss-rep-head h3 { margin: 0; font-size: 14px; color: #0f172a; }
    .ss-print-doc .ss-rep-meta { font-size: 11px; color: #475569; margin-top: 2px; }
    .ss-print-doc .ss-rep-score { text-align: right; white-space: nowrap; font-size: 13px; color: #1e1b4b; }
    .ss-print-doc .ss-coins { font-size: 11px; color: #92400e; font-weight: 700; }
    .ss-print-doc .ss-box { padding: 6px 10px; border-radius: 6px; margin-bottom: 6px; font-size: 11.5px; }
    .ss-print-doc .ss-strong { background: #ecfdf5; border: 1px solid #a7f3d0; color: #065f46; }
    .ss-print-doc .ss-weak { background: #fff1f2; border: 1px solid #fecdd3; color: #9f1239; }
    .ss-print-doc .ss-advice { font-size: 11.5px; color: #334155; }
    .ss-print-doc .ss-footer { margin-top: 20px; padding-top: 8px; border-top: 1px solid #cbd5e1; display: flex; justify-content: space-between; font-size: 11px; color: #475569; }
  </style>
</head>
<body>
  <div class="ss-print-doc">
    <div class="ss-header">
      <div class="ss-brand">
        ${brandLogosHtml}
        <div>
          <h1>${escapePrintHtml(title)}</h1>
          <div style="color:#475569; font-size:11.5px;">
            ${studentInfo?.userName ? `विद्यार्थी: ${escapePrintHtml(studentInfo.userName)}` : ''}
            ${studentInfo?.email ? ` (${escapePrintHtml(studentInfo.email)})` : ''}
            ${studentInfo?.grade ? ` • ${escapePrintHtml(studentInfo.grade)}` : ''}
          </div>
        </div>
      </div>
      <div style="text-align:right; font-size:11px; white-space:nowrap;">
        <strong>शब्दशिल्प (ShabdShilp)</strong><br />
        <span>दिनांक: ${new Date().toLocaleDateString('hi-IN')}</span>
      </div>
    </div>

    ${cardsHtml}

    <div class="ss-footer">
      <span>शब्दशिल्प (ShabdShilp) • विद्यार्थी प्रगति रिपोर्ट</span>
      <span>${escapePrintHtml(studentInfo?.grade || '')}</span>
    </div>
  </div>
</body>
</html>`;

  return { title, html };
}

export function printSavedReportsDocument(
  reports: Array<{
    titleHindi: string;
    date: string;
    grade?: string;
    score: number;
    maxScore: number;
    attemptedCount?: number;
    unansweredCount?: number;
    percentage: number;
    wordCoinsEarned: number;
    weakAreasHindi: string[];
    strongAreasHindi: string[];
    adviceSummaryHindi?: string;
  }>,
  studentInfo?: { userName?: string; email?: string; grade?: string }
): void {
  const { title, html } = buildSavedReportsHtmlDocument(reports, studentInfo);
  printRawHtmlDocument(html, {
    title,
    subtitle: studentInfo?.userName
      ? `${studentInfo.userName}${studentInfo.grade ? ` • ${studentInfo.grade}` : ''}`
      : undefined,
    filenameSlug: title,
  });
}

export function downloadSavedReportsHtml(
  reports: Array<{
    titleHindi: string;
    date: string;
    grade?: string;
    score: number;
    maxScore: number;
    attemptedCount?: number;
    unansweredCount?: number;
    percentage: number;
    wordCoinsEarned: number;
    weakAreasHindi: string[];
    strongAreasHindi: string[];
    adviceSummaryHindi?: string;
  }>,
  studentInfo?: { userName?: string; email?: string; grade?: string }
): void {
  const { title, html } = buildSavedReportsHtmlDocument(reports, studentInfo);
  downloadPrintableHtml(html, title);
}

export interface PrintableChapterCheatNoteInput {
  chapterTitleHindi: string;
  chapterTitleEnglish: string;
  coreIdeaHindi: string;
  coreIdeaEnglish?: string;
  keywords: Array<{ keyword: string; identifies: string; example: string }>;
  mechanismSteps: Array<{ stepHindi: string; stepEnglish?: string }>;
  commonTraps: Array<{ trapHindi: string; fixHindi: string }>;
  quickTableHeaders: [string, string, string];
  quickTableRows: [string, string, string][];
}

export function buildChapterCheatNotesHtml(
  note: PrintableChapterCheatNoteInput,
  meta?: { grade?: string; board?: string; studentName?: string; shloka?: string }
): string {
  const brandLogosHtml = getPrintBrandLogosHtml(46);

  const keywordsHtml = note.keywords
    .map(
      (k) => `
      <div class="ss-kw-card">
        <div class="ss-kw-key">${escapePrintHtml(k.keyword)}</div>
        <div class="ss-kw-id">→ ${escapePrintHtml(k.identifies)}</div>
        <div class="ss-kw-ex">उदा.: ${escapePrintHtml(k.example)}</div>
      </div>
    `
    )
    .join('');

  const stepsHtml = note.mechanismSteps
    .map(
      (s) => `
      <li>
        <div><strong>${escapePrintHtml(s.stepHindi)}</strong></div>
        ${s.stepEnglish ? `<div style="font-size:11px; color:#475569; margin-top:2px;">${escapePrintHtml(s.stepEnglish)}</div>` : ''}
      </li>
    `
    )
    .join('');

  const trapsHtml = note.commonTraps
    .map(
      (t) => `
      <div class="ss-trap">
        <div class="ss-trap-q"><strong>आम भूल:</strong> ${escapePrintHtml(t.trapHindi)}</div>
        <div class="ss-trap-a"><strong>सही तर्क:</strong> ${escapePrintHtml(t.fixHindi)}</div>
      </div>
    `
    )
    .join('');

  const tableRowsHtml = note.quickTableRows
    .map(
      (row) => `
      <tr>
        <td><strong>${escapePrintHtml(row[0])}</strong></td>
        <td>${escapePrintHtml(row[1])}</td>
        <td>${escapePrintHtml(row[2])}</td>
      </tr>
    `
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8" />
  <title>${escapePrintHtml(note.chapterTitleHindi)}</title>
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
    .ss-print-doc .ss-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #4338ca; padding-bottom: 10px; margin-bottom: 14px; gap: 12px; }
    .ss-print-doc .ss-brand { display: flex; align-items: center; gap: 10px; }
    .ss-print-doc h1 { margin: 0; font-size: 18px; color: #1e1b4b; font-weight: 800; }
    .ss-print-doc .ss-sub { font-size: 11.5px; color: #475569; margin-top: 2px; }
    .ss-print-doc .ss-core { background: #eef2ff; border: 1px solid #c7d2fe; border-radius: 10px; padding: 11px 14px; margin-bottom: 14px; }
    .ss-print-doc .ss-core strong { color: #312e81; }
    .ss-print-doc h2 { font-size: 13.5px; color: #1e1b4b; margin: 14px 0 8px; padding-bottom: 4px; border-bottom: 1px solid #e2e8f0; }
    .ss-print-doc .ss-kw-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; margin-bottom: 12px; }
    .ss-print-doc .ss-kw-card { border: 1px solid #cbd5e1; border-radius: 8px; padding: 8px 10px; background: #f8fafc; page-break-inside: avoid; break-inside: avoid; }
    .ss-print-doc .ss-kw-key { font-weight: 800; color: #4338ca; font-size: 12.5px; }
    .ss-print-doc .ss-kw-id { font-weight: 700; color: #0f172a; font-size: 11.5px; margin-top: 2px; }
    .ss-print-doc .ss-kw-ex { font-size: 11px; color: #475569; margin-top: 2px; }
    .ss-print-doc ol { margin: 0; padding-left: 18px; }
    .ss-print-doc ol li { margin-bottom: 6px; }
    .ss-print-doc .ss-trap { border: 1px solid #fecdd3; background: #fff1f2; border-radius: 8px; padding: 8px 10px; margin-bottom: 8px; page-break-inside: avoid; break-inside: avoid; }
    .ss-print-doc .ss-trap-q { color: #9f1239; font-size: 11.5px; }
    .ss-print-doc .ss-trap-a { color: #065f46; font-size: 11.5px; margin-top: 3px; }
    .ss-print-doc table { width: 100%; border-collapse: collapse; margin-top: 6px; font-size: 11.5px; }
    .ss-print-doc th, .ss-print-doc td { border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; vertical-align: top; }
    .ss-print-doc th { background: #1e1b4b; color: #ffffff; font-weight: 700; }
    .ss-print-doc tr:nth-child(even) td { background: #f8fafc; }
    .ss-print-doc .ss-shloka { margin-top: 12px; padding: 8px 12px; background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; font-style: italic; color: #92400e; font-size: 11.5px; }
    .ss-print-doc .ss-footer { margin-top: 18px; padding-top: 8px; border-top: 1px solid #cbd5e1; display: flex; justify-content: space-between; font-size: 11px; color: #475569; }
  </style>
</head>
<body>
  <div class="ss-print-doc">
    <div class="ss-header">
      <div class="ss-brand">
        ${brandLogosHtml}
        <div>
          <h1>${escapePrintHtml(note.chapterTitleHindi)}</h1>
          <div class="ss-sub">
            ${escapePrintHtml(note.chapterTitleEnglish)}
            ${meta?.board ? ` · ${escapePrintHtml(meta.board)}` : ''}
            ${meta?.grade ? ` · ${escapePrintHtml(meta.grade)}` : ''}
          </div>
        </div>
      </div>
      <div style="text-align:right; font-size:11px; white-space:nowrap;">
        <strong>शब्दशिल्प (ShabdShilp)</strong><br />
        <span>अध्याय चीट कोड्स व नोट्स</span>
      </div>
    </div>

    <div class="ss-core">
      <div><strong>मुख्य सिद्धांत (Core Concept):</strong> ${escapePrintHtml(note.coreIdeaHindi)}</div>
      ${note.coreIdeaEnglish ? `<div style="font-size:11px; color:#475569; margin-top:3px;">${escapePrintHtml(note.coreIdeaEnglish)}</div>` : ''}
    </div>

    <h2>१. त्वरित पहचान कीवर्ड्स (Cheat Codes & Identification Keywords)</h2>
    <div class="ss-kw-grid">${keywordsHtml}</div>

    <h2>२. कार्यप्रणाली व तर्क-कदम (Step-by-Step Mechanism)</h2>
    <ol>${stepsHtml}</ol>

    <h2>३. त्वरित पुनरावृत्ति तालिका (Quick Revision Table)</h2>
    <table>
      <thead>
        <tr>
          <th>${escapePrintHtml(note.quickTableHeaders[0])}</th>
          <th>${escapePrintHtml(note.quickTableHeaders[1])}</th>
          <th>${escapePrintHtml(note.quickTableHeaders[2])}</th>
        </tr>
      </thead>
      <tbody>${tableRowsHtml}</tbody>
    </table>

    <h2>४. परीक्षा में होने वाली आम भूलें व बचाव (Exam Traps & Fixes)</h2>
    ${trapsHtml}

    ${meta?.shloka ? `<div class="ss-shloka"><strong>परंपरा सूत्र:</strong> ${escapePrintHtml(meta.shloka)}</div>` : ''}

    <div class="ss-footer">
      <span>शब्दशिल्प (ShabdShilp) · अध्याय अध्ययन नोट्स</span>
      <span>${meta?.studentName ? `विद्यार्थी: ${escapePrintHtml(meta.studentName)} · ` : ''}दिनांक: ${new Date().toLocaleDateString('hi-IN')}</span>
    </div>
  </div>
</body>
</html>`;
}

export function printChapterCheatNotes(
  note: PrintableChapterCheatNoteInput,
  meta?: { grade?: string; board?: string; studentName?: string; shloka?: string }
): void {
  const html = buildChapterCheatNotesHtml(note, meta);
  printRawHtmlDocument(html, {
    title: note.chapterTitleHindi,
    subtitle: `${meta?.board || 'ICSE'} · ${meta?.grade || ''}`.trim(),
    filenameSlug: note.chapterTitleHindi,
  });
}

export function downloadChapterCheatNotes(
  note: PrintableChapterCheatNoteInput,
  meta?: { grade?: string; board?: string; studentName?: string; shloka?: string }
): void {
  const html = buildChapterCheatNotesHtml(note, meta);
  downloadPrintableHtml(html, `${note.chapterTitleHindi}-Notes`);
}

export interface FullPortfolioReportInput {
  studentInfo?: { userName?: string; email?: string; grade?: string; board?: string };
  simulationSummaryRows: Array<{
    titleHindi: string;
    completions: number;
    avgAccuracyPct: number | null;
  }>;
  workbookSummary: {
    attempts: number;
    mcqPct: number;
    selectPct: number;
    bhedPct: number;
    rows: Array<{
      titleHindi: string;
      mcqLabel: string;
      selectLabel: string;
      bhedLabel: string;
      percentage: number;
    }>;
  };
  creativePortfolio: Array<{
    titleHindi: string;
    submissionMode: string;
    status: string;
    overallScore: number;
    submittedAt: string;
  }>;
  savedReports: Array<{
    titleHindi: string;
    date: string;
    grade?: string;
    score: number;
    maxScore: number;
    attemptedCount?: number;
    unansweredCount?: number;
    percentage: number;
    wordCoinsEarned: number;
    weakAreasHindi: string[];
    strongAreasHindi: string[];
    adviceSummaryHindi?: string;
  }>;
  weakRecoveryTopics?: string[];
}

export function buildFullStudentPortfolioReportHtml(input: FullPortfolioReportInput): {
  title: string;
  html: string;
} {
  const brandLogosHtml = getPrintBrandLogosHtml(46);
  const title = `संपूर्ण विद्यार्थी प्रगति रिपोर्ट (${input.studentInfo?.grade || 'ICSE'})`;

  const simRowsHtml = input.simulationSummaryRows
    .map(
      (r) => `
      <tr>
        <td><strong>${escapePrintHtml(r.titleHindi)}</strong></td>
        <td style="text-align:center;">${r.completions} बार</td>
        <td style="text-align:center;">${r.completions > 0 && r.avgAccuracyPct !== null ? `${r.avgAccuracyPct}%` : '—'}</td>
      </tr>`
    )
    .join('');

  const wbRowsHtml =
    input.workbookSummary.rows.length > 0
      ? `
      <div class="ss-kpis">
        <div class="ss-kpi"><span class="ss-kpi-label">कुल प्रयास</span><span class="ss-kpi-val">${input.workbookSummary.attempts}</span></div>
        <div class="ss-kpi"><span class="ss-kpi-label">MCQ सटीकता</span><span class="ss-kpi-val">${input.workbookSummary.mcqPct}%</span></div>
        <div class="ss-kpi"><span class="ss-kpi-label">अनुच्छेद चयन</span><span class="ss-kpi-val">${input.workbookSummary.selectPct}%</span></div>
        <div class="ss-kpi"><span class="ss-kpi-label">भेद पहचान</span><span class="ss-kpi-val">${input.workbookSummary.bhedPct}%</span></div>
      </div>
      <table>
        <thead>
          <tr><th>अभ्यास पुस्तिका</th><th>MCQ</th><th>चयन</th><th>भेद पहचान</th><th>समग्र %</th></tr>
        </thead>
        <tbody>
          ${input.workbookSummary.rows
            .map(
              (r) => `
            <tr>
              <td><strong>${escapePrintHtml(r.titleHindi)}</strong></td>
              <td>${escapePrintHtml(r.mcqLabel)}</td>
              <td>${escapePrintHtml(r.selectLabel)}</td>
              <td>${escapePrintHtml(r.bhedLabel)}</td>
              <td><strong>${r.percentage}%</strong></td>
            </tr>`
            )
            .join('')}
        </tbody>
      </table>`
      : `<p class="ss-empty">अभी तक कोई अभ्यास पुस्तिका हल नहीं की गई है।</p>`;

  const creativeRowsHtml =
    input.creativePortfolio.length > 0
      ? `
      <table>
        <thead>
          <tr><th>रचना शीर्षक</th><th>माध्यम</th><th>स्थिति</th><th>अंक</th><th>दिनांक</th></tr>
        </thead>
        <tbody>
          ${input.creativePortfolio
            .map(
              (c) => `
            <tr>
              <td><strong>${escapePrintHtml(c.titleHindi)}</strong></td>
              <td>${c.submissionMode === 'handwritten' ? 'हस्तलिखित OCR' : 'टाइप'}</td>
              <td>${escapePrintHtml(c.status)}</td>
              <td><strong>${c.overallScore}/100</strong></td>
              <td>${escapePrintHtml(new Date(c.submittedAt).toLocaleDateString('hi-IN'))}</td>
            </tr>`
            )
            .join('')}
        </tbody>
      </table>`
      : `<p class="ss-empty">अभी तक कोई रचनात्मक लेखन सबमिशन दर्ज नहीं है।</p>`;

  const savedCardsHtml =
    input.savedReports.length > 0
      ? input.savedReports
          .map(
            (rep, idx) => `
          <div class="ss-rep-card">
            <div class="ss-rep-head">
              <div>
                <h3>${idx + 1}. ${escapePrintHtml(rep.titleHindi)}</h3>
                <div class="ss-rep-meta">${escapePrintHtml(rep.date)}${rep.grade ? ` • ${escapePrintHtml(rep.grade)}` : ''}</div>
              </div>
              <div class="ss-rep-score">
                <strong>${rep.score} / ${rep.maxScore} (${rep.percentage}%)</strong>
                ${rep.wordCoinsEarned > 0 ? `<div class="ss-coins">+${rep.wordCoinsEarned} WordCoins</div>` : ''}
              </div>
            </div>
            ${
              rep.strongAreasHindi.length > 0
                ? `<div class="ss-box ss-strong"><strong>मजबूत पक्ष:</strong> ${escapePrintHtml(rep.strongAreasHindi.join(', '))}</div>`
                : ''
            }
            ${
              rep.weakAreasHindi.length > 0
                ? `<div class="ss-box ss-weak"><strong>सुधार क्षेत्र:</strong> ${escapePrintHtml(rep.weakAreasHindi.join(', '))}</div>`
                : ''
            }
            ${
              rep.adviceSummaryHindi
                ? `<div class="ss-advice"><strong>सुझाव:</strong> ${escapePrintHtml(rep.adviceSummaryHindi)}</div>`
                : ''
            }
          </div>`
          )
          .join('')
      : `<p class="ss-empty">अभी तक कोई सहेजी गई अध्याय या वर्कशीट रिपोर्ट उपलब्ध नहीं है।</p>`;

  const weakChipsHtml =
    input.weakRecoveryTopics && input.weakRecoveryTopics.length > 0
      ? `<div class="ss-box ss-weak" style="margin-bottom:14px;"><strong>रिपोर्ट से पहचाने गए त्रुटि-सुधार विषय (Mistake Recovery Focus):</strong> ${escapePrintHtml(
          input.weakRecoveryTopics.join(' · ')
        )}</div>`
      : '';

  const html = `<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8" />
  <title>${escapePrintHtml(title)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet" />
  <style>
    @page { size: A4; margin: 14mm; }
    .ss-print-doc {
      font-family: 'Noto Sans Devanagari', 'Plus Jakarta Sans', Arial, sans-serif;
      color: #0f172a; line-height: 1.5; margin: 0 auto; padding: 16px 20px;
      max-width: 860px; font-size: 12px; background: #ffffff;
    }
    .ss-print-doc * { box-sizing: border-box; }
    .ss-print-doc .ss-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #4338ca; padding-bottom: 10px; margin-bottom: 14px; gap: 12px; }
    .ss-print-doc .ss-brand { display: flex; align-items: center; gap: 10px; }
    .ss-print-doc h1 { margin: 0; font-size: 18px; color: #1e1b4b; font-weight: 800; }
    .ss-print-doc h2 { margin: 16px 0 8px 0; font-size: 13.5px; color: #1e1b4b; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; }
    .ss-print-doc .ss-kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 10px; }
    .ss-print-doc .ss-kpi { border: 1px solid #cbd5e1; border-radius: 8px; padding: 8px; background: #f8fafc; }
    .ss-print-doc .ss-kpi-label { font-size: 10px; color: #475569; display: block; }
    .ss-print-doc .ss-kpi-val { font-size: 15px; font-weight: 800; color: #0f172a; }
    .ss-print-doc table { width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 11px; }
    .ss-print-doc th, .ss-print-doc td { border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; }
    .ss-print-doc th { background: #1e1b4b; color: #ffffff; font-weight: 700; }
    .ss-print-doc tr { page-break-inside: avoid; break-inside: avoid; }
    .ss-print-doc .ss-rep-card { border: 1px solid #cbd5e1; border-radius: 10px; padding: 10px 12px; margin-bottom: 10px; page-break-inside: avoid; break-inside: avoid; background: #f8fafc; }
    .ss-print-doc .ss-rep-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 6px; }
    .ss-print-doc .ss-rep-head h3 { margin: 0; font-size: 13px; color: #0f172a; }
    .ss-print-doc .ss-rep-meta { font-size: 10.5px; color: #475569; }
    .ss-print-doc .ss-rep-score { text-align: right; white-space: nowrap; font-size: 12.5px; color: #1e1b4b; }
    .ss-print-doc .ss-coins { font-size: 10.5px; color: #92400e; font-weight: 700; }
    .ss-print-doc .ss-box { padding: 6px 9px; border-radius: 6px; margin-bottom: 5px; font-size: 11px; }
    .ss-print-doc .ss-strong { background: #ecfdf5; border: 1px solid #a7f3d0; color: #065f46; }
    .ss-print-doc .ss-weak { background: #fff1f2; border: 1px solid #fecdd3; color: #9f1239; }
    .ss-print-doc .ss-advice { font-size: 11px; color: #334155; }
    .ss-print-doc .ss-empty { padding: 10px; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; color: #475569; text-align: center; }
    .ss-print-doc .ss-footer { margin-top: 18px; padding-top: 8px; border-top: 1px solid #cbd5e1; display: flex; justify-content: space-between; font-size: 10.5px; color: #475569; }
  </style>
</head>
<body>
  <div class="ss-print-doc">
    <div class="ss-header">
      <div class="ss-brand">
        ${brandLogosHtml}
        <div>
          <h1>${escapePrintHtml(title)}</h1>
          <div style="color:#475569; font-size:11px;">
            ${input.studentInfo?.userName ? `विद्यार्थी: ${escapePrintHtml(input.studentInfo.userName)}` : ''}
            ${input.studentInfo?.email ? ` (${escapePrintHtml(input.studentInfo.email)})` : ''}
            ${input.studentInfo?.board ? ` • ${escapePrintHtml(input.studentInfo.board)}` : ''}
          </div>
        </div>
      </div>
      <div style="text-align:right; font-size:11px; white-space:nowrap;">
        <strong>शब्दशिल्प (ShabdShilp)</strong><br />
        <span>दिनांक: ${new Date().toLocaleDateString('hi-IN')}</span>
      </div>
    </div>

    ${weakChipsHtml}

    <h2>१. व्याकरण सिमुलेशन विषयवार प्रगति</h2>
    <table>
      <thead><tr><th>सिमुलेशन अध्याय</th><th style="text-align:center;">पूर्ण संख्या</th><th style="text-align:center;">औसत सटीकता</th></tr></thead>
      <tbody>${simRowsHtml}</tbody>
    </table>

    <h2>२. अभ्यास पुस्तिका व अनुच्छेद परीक्षण विश्लेषण</h2>
    ${wbRowsHtml}

    <h2>३. रचनात्मक लेखन पोर्टफोलियो (कथा शिल्पी AI)</h2>
    ${creativeRowsHtml}

    <h2>४. सहेजी गई अध्याय एवं वर्कशीट रिपोर्ट्स (${input.savedReports.length})</h2>
    ${savedCardsHtml}

    <div class="ss-footer">
      <span>शब्दशिल्प (ShabdShilp) • संपूर्ण प्रगति रिपोर्ट</span>
      <span>${escapePrintHtml(input.studentInfo?.grade || '')}</span>
    </div>
  </div>
</body>
</html>`;

  return { title, html };
}

export function printFullStudentPortfolioReport(input: FullPortfolioReportInput): void {
  const { title, html } = buildFullStudentPortfolioReportHtml(input);
  printRawHtmlDocument(html, {
    title,
    subtitle: input.studentInfo?.userName
      ? `${input.studentInfo.userName}${input.studentInfo.grade ? ` • ${input.studentInfo.grade}` : ''}`
      : undefined,
    filenameSlug: title,
  });
}

export function downloadFullStudentPortfolioReport(input: FullPortfolioReportInput): void {
  const { title, html } = buildFullStudentPortfolioReportHtml(input);
  downloadPrintableHtml(html, title);
}

export interface PrintableWorkbookInput {
  titleHindi: string;
  titleEnglish?: string;
  grade: string;
  board?: string;
  studentName?: string;
  trackedTopics?: string[];
  mcqQuestions: PrintableWorksheetInput['questions'];
  paragraphQuestions: Array<{
    promptHindi: string;
    paragraphTitleHindi: string;
    paragraphSentences: string[];
    explanationHindi?: string;
  }>;
  shortQuestions?: Array<{
    questionHindi: string;
    questionEnglish?: string;
    sampleAnswerHindi?: string;
  }>;
  creativePrompt?: {
    genreLabelHindi: string;
    titleHindi: string;
    instructionsHindi: string;
    wordLimit: number;
    hintsHindi?: string[];
  };
  includeAnswers?: boolean;
}

export function buildInteractiveWorkbookHtml(input: PrintableWorkbookInput): string {
  const brandLogosHtml = getPrintBrandLogosHtml(44);
  const mcqsHtml = (input.mcqQuestions || [])
    .map((q, idx) => {
      const opts = (q.options || [])
        .map((opt, oIdx) => {
          const txt = typeof opt === 'string' ? opt : opt?.textHindi || String(opt);
          const isAns = input.includeAnswers && oIdx === q.correctIndex;
          return `<li class="${isAns ? 'ans-correct' : ''}">(${String.fromCharCode(65 + oIdx)}) ${escapePrintHtml(txt)}${isAns ? ' ✓' : ''}</li>`;
        })
        .join('');
      return `
        <div class="ss-q">
          <div class="ss-q-title"><strong>${idx + 1}.</strong> ${escapePrintHtml(q.questionHindi)}</div>
          <ul class="ss-opts">${opts}</ul>
          ${input.includeAnswers && q.explanationHindi ? `<div class="ss-exp"><strong>व्याख्या:</strong> ${escapePrintHtml(q.explanationHindi)}</div>` : ''}
        </div>`;
    })
    .join('');

  const paraHtml = (input.paragraphQuestions || [])
    .map(
      (pq, idx) => `
      <div class="ss-q">
        <div class="ss-q-title"><strong>अनुच्छेद प्रश्न ${idx + 1}:</strong> ${escapePrintHtml(pq.promptHindi)}</div>
        <div class="ss-para-box">
          <div style="font-weight:800; margin-bottom:4px;">${escapePrintHtml(pq.paragraphTitleHindi)}</div>
          <p style="margin:0;">${escapePrintHtml((pq.paragraphSentences || []).join(' '))}</p>
        </div>
        <div class="ss-line-row">चुना गया शब्द/वाक्य: ______________________ &nbsp;&nbsp; भेद: ______________________</div>
      </div>`
    )
    .join('');

  const shortHtml =
    input.shortQuestions && input.shortQuestions.length > 0
      ? `<h2>भाग C · संक्षिप्त 2-पंक्ति प्रश्नोत्तर (Short Answer Questions)</h2>
        ${input.shortQuestions
          .map(
            (sq, idx) => `
          <div class="ss-q">
            <div class="ss-q-title"><strong>${idx + 1}.</strong> ${escapePrintHtml(sq.questionHindi)}</div>
            <div class="ss-write-line"></div>
            <div class="ss-write-line"></div>
            ${input.includeAnswers && sq.sampleAnswerHindi ? `<div class="ss-exp"><strong>आदर्श उत्तर:</strong> ${escapePrintHtml(sq.sampleAnswerHindi)}</div>` : ''}
          </div>`
          )
          .join('')}`
      : '';

  const creativeHtml = input.creativePrompt
    ? `<h2>भाग D · रचनात्मक लेखन (${escapePrintHtml(input.creativePrompt.genreLabelHindi)})</h2>
      <div class="ss-q">
        <div class="ss-q-title"><strong>विषय:</strong> ${escapePrintHtml(input.creativePrompt.titleHindi)} (शब्द सीमा: ~${input.creativePrompt.wordLimit} शब्द)</div>
        <div style="font-size:11.5px; color:#334155; margin-bottom:8px;">${escapePrintHtml(input.creativePrompt.instructionsHindi)}</div>
        ${
          input.creativePrompt.hintsHindi && input.creativePrompt.hintsHindi.length > 0
            ? `<div style="font-size:11px; color:#4338ca; margin-bottom:8px;"><strong>संकेत बिंदु:</strong> ${escapePrintHtml(input.creativePrompt.hintsHindi.join(' · '))}</div>`
            : ''
        }
        <div class="ss-creative-lines">
          ${Array.from({ length: 8 })
            .map(() => '<div class="ss-write-line"></div>')
            .join('')}
        </div>
      </div>`
    : '';

  return `<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8" />
  <title>${escapePrintHtml(input.titleHindi)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet" />
  <style>
    @page { size: A4; margin: 14mm; }
    .ss-print-doc {
      font-family: 'Noto Sans Devanagari', 'Plus Jakarta Sans', Arial, sans-serif;
      color: #0f172a; line-height: 1.55; margin: 0 auto; padding: 16px 20px; max-width: 860px; font-size: 12px; background: #fff;
    }
    .ss-print-doc * { box-sizing: border-box; }
    .ss-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #4338ca; padding-bottom: 10px; margin-bottom: 14px; gap: 12px; }
    .ss-brand { display: flex; align-items: center; gap: 10px; }
    h1 { margin: 0; font-size: 17px; color: #1e1b4b; font-weight: 800; }
    h2 { margin: 16px 0 8px 0; font-size: 13.5px; color: #1e1b4b; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; }
    .ss-chips { margin-bottom: 10px; font-size: 11px; color: #334155; background: #eef2ff; border: 1px solid #c7d2fe; padding: 6px 10px; border-radius: 6px; }
    .ss-q { border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px 12px; margin-bottom: 10px; page-break-inside: avoid; break-inside: avoid; }
    .ss-q-title { margin-bottom: 6px; font-size: 12px; }
    .ss-opts { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(2, 1fr); gap: 5px 12px; font-size: 11.5px; }
    .ans-correct { color: #065f46; font-weight: 800; }
    .ss-para-box { background: #f8fafc; border: 1px solid #cbd5e1; padding: 8px 10px; border-radius: 6px; margin-bottom: 6px; font-size: 11.5px; }
    .ss-line-row { font-size: 11px; color: #475569; margin-top: 6px; }
    .ss-write-line { border-bottom: 1px dashed #94a3b8; height: 22px; margin-top: 4px; }
    .ss-exp { margin-top: 6px; padding: 5px 8px; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 6px; font-size: 11px; color: #065f46; }
    .ss-footer { margin-top: 16px; padding-top: 8px; border-top: 1px solid #cbd5e1; display: flex; justify-content: space-between; font-size: 10.5px; color: #475569; }
  </style>
</head>
<body>
  <div class="ss-print-doc">
    <div class="ss-header">
      <div class="ss-brand">
        ${brandLogosHtml}
        <div>
          <h1>${escapePrintHtml(input.titleHindi)}</h1>
          <div style="font-size:11px; color:#475569;">
            ${escapePrintHtml(input.grade)} • ${escapePrintHtml(input.board || 'ICSE')}${input.studentName ? ` • विद्यार्थी: ${escapePrintHtml(input.studentName)}` : ''}
          </div>
        </div>
      </div>
      <div style="text-align:right; font-size:11px; white-space:nowrap;">
        <strong>शब्दशिल्प (ShabdShilp)</strong><br />
        <span>दिनांक: ${new Date().toLocaleDateString('hi-IN')}</span>
      </div>
    </div>

    ${input.trackedTopics && input.trackedTopics.length > 0 ? `<div class="ss-chips"><strong>संकलित विषय (Tracked Topics):</strong> ${escapePrintHtml(input.trackedTopics.join(' · '))}</div>` : ''}

    <h2>भाग A · बहुविकल्पीय प्रश्न (MCQs — ${input.mcqQuestions.length})</h2>
    ${mcqsHtml}

    <h2>भाग B · अनुच्छेद आधारित भाषा परीक्षण (${input.paragraphQuestions.length})</h2>
    ${paraHtml}

    ${shortHtml}
    ${creativeHtml}

    <div class="ss-footer">
      <span>शब्दशिल्प (ShabdShilp) • संकलित अभ्यास पुस्तिका</span>
      <span>${escapePrintHtml(input.grade)}</span>
    </div>
  </div>
</body>
</html>`;
}

export function printInteractiveWorkbookDocument(input: PrintableWorkbookInput): void {
  const html = buildInteractiveWorkbookHtml(input);
  printRawHtmlDocument(html, {
    title: input.titleHindi,
    subtitle: `${input.grade} • ${input.board || 'ICSE'}`,
    filenameSlug: input.titleHindi,
  });
}

export function downloadInteractiveWorkbookDocument(input: PrintableWorkbookInput): void {
  const html = buildInteractiveWorkbookHtml(input);
  downloadPrintableHtml(html, input.titleHindi || 'shabdshilp-workbook');
}

