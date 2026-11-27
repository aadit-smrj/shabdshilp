export interface SimulationMetadataItem {
  moduleId: string;
  uniqueSimNameHindi: string;
  uniqueSimNameEnglish: string;
  mechanismTagHindi: string;
  probeActionHindi: string;
  probeActionEnglish: string;
}

export const SIMULATION_METADATA: Record<string, SimulationMetadataItem> = {
  karak: {
    moduleId: 'karak',
    uniqueSimNameHindi: 'कारक बल-केबल प्रयोगशाला',
    uniqueSimNameEnglish: 'Karak Force-Cable Lab',
    mechanismTagHindi: 'साधन बनाम अलगाव विश्लेषण',
    probeActionHindi: '‘से’ बल व दूरी परीक्षण चलाएँ',
    probeActionEnglish: 'Run Tool vs Separation Test',
  },
  vakya: {
    moduleId: 'vakya',
    uniqueSimNameHindi: 'वाक्य रेल-कपलर प्रयोगशाला',
    uniqueSimNameEnglish: 'Vakya Clause-Coupler Lab',
    mechanismTagHindi: 'उपवाक्य स्वतंत्रता परीक्षण',
    probeActionHindi: 'योजक से काटकर उपवाक्य परखें',
    probeActionEnglish: 'Run Clause Split Test',
  },
  vachya: {
    moduleId: 'vachya',
    uniqueSimNameHindi: 'वाच्य स्पॉटलाइट मंच',
    uniqueSimNameEnglish: 'Vachya Agreement Spotlight Stage',
    mechanismTagHindi: 'क्रिया-नियंत्रण केंद्र',
    probeActionHindi: 'स्पॉटलाइट घुमाकर क्रिया बदलें',
    probeActionEnglish: 'Shift Voice Spotlight',
  },
  kaal: {
    moduleId: 'kaal',
    uniqueSimNameHindi: 'काल चक्र समय-यात्रा यंत्र',
    uniqueSimNameEnglish: 'Kaal Time-Dial Simulator',
    mechanismTagHindi: 'क्रिया-अंत व समय-रेखा यंत्र',
    probeActionHindi: 'समय-रेखा व काल-चिह्न देखें',
    probeActionEnglish: 'Inspect Tense Timeline',
  },
  muhavare: {
    moduleId: 'muhavare',
    uniqueSimNameHindi: 'मुहावरा दृश्य-सेतु प्रयोगशाला',
    uniqueSimNameEnglish: 'Muhavara Visual Logic Bridge',
    mechanismTagHindi: 'तर्क से अर्थ — बिना रटे',
    probeActionHindi: '३-चरणीय तर्क-सेतु खोलें',
    probeActionEnglish: 'Open 3-Layer Logic Bridge',
  },
  'upsarg-pratyay': {
    moduleId: 'upsarg-pratyay',
    uniqueSimNameHindi: 'शब्दांश चुंबक संयोजक लैब',
    uniqueSimNameEnglish: 'Affix Magnetic Assembler Lab',
    mechanismTagHindi: 'आगे-पीछे शब्दांश जुड़ाव',
    probeActionHindi: 'शब्दांश जोड़कर परिणाम देखें',
    probeActionEnglish: 'Snap & Fuse Affix',
  },
  sandhi: {
    moduleId: 'sandhi',
    uniqueSimNameHindi: 'संधि ध्वनि-टक्कर स्लाइडर',
    uniqueSimNameEnglish: 'Sandhi Phonetic Collision Lab',
    mechanismTagHindi: 'सीमांत वर्ण ध्वनि-मेल',
    probeActionHindi: 'ध्वनि-टक्कर स्लाइडर चलाएँ',
    probeActionEnglish: 'Run Phonetic Fusion',
  },
  samas: {
    moduleId: 'samas',
    uniqueSimNameHindi: 'समास विग्रह विस्तारक लैब',
    uniqueSimNameEnglish: 'Samas Vigraha Expansion Lab',
    mechanismTagHindi: 'समस्तपद संक्षेपण-विस्तार',
    probeActionHindi: 'समस्तपद खोलकर विग्रह देखें',
    probeActionEnglish: 'Expand Compound & Inspect',
  },
  sangya: {
    moduleId: 'sangya',
    uniqueSimNameHindi: 'संज्ञा मूर्त-भाव विश्लेषक',
    uniqueSimNameEnglish: 'Sangya Tangibility & Class Lens',
    mechanismTagHindi: 'व्यक्ति · जाति · भाव परीक्षण',
    probeActionHindi: 'नाम व भाव-वर्ग विश्लेषक चलाएँ',
    probeActionEnglish: 'Run Noun Class Analyzer',
  },
  sarvanam: {
    moduleId: 'sarvanam',
    uniqueSimNameHindi: 'सर्वनाम प्रतिस्थापन सेतु',
    uniqueSimNameEnglish: 'Sarvanam Replacement Bridge',
    mechanismTagHindi: 'पुनरावृत्ति रोकथाम व संकेत',
    probeActionHindi: 'सर्वनाम भूमिका व संकेत परखें',
    probeActionEnglish: 'Inspect Pronoun Signal',
  },
  visheshan: {
    moduleId: 'visheshan',
    uniqueSimNameHindi: 'विशेषण त्रिकोण-जाँच लेंस',
    uniqueSimNameEnglish: 'Visheshan 3-Question Degree Lens',
    mechanismTagHindi: 'कैसा · कितने · कितना लेंस',
    probeActionHindi: 'विशेषण जाँच लेंस चलाएँ',
    probeActionEnglish: 'Run Modifier Lens',
  },
  'shabd-bhandar': {
    moduleId: 'shabd-bhandar',
    uniqueSimNameHindi: 'शब्द-संपदा चतुर्भुज मैट्रिक्स',
    uniqueSimNameEnglish: 'Shabd-Bhandar 4-Pillar Matrix',
    mechanismTagHindi: 'समान · विपरीत · अनेक अर्थ',
    probeActionHindi: 'शब्द-संबंध तंत्र खोलें',
    probeActionEnglish: 'Open Word Matrix',
  },
  ling: {
    moduleId: 'ling',
    uniqueSimNameHindi: 'लिंग ‘मेरा-मेरी’ एवं प्रत्यय लैब',
    uniqueSimNameEnglish: 'Ling Gender Agreement Lab',
    mechanismTagHindi: 'लिंग-मेल व प्रत्यय रूपांतरण',
    probeActionHindi: '‘मेरा-मेरी’ व प्रत्यय नियम चलाएँ',
    probeActionEnglish: 'Run Gender Agreement Test',
  },
  vachan: {
    moduleId: 'vachan',
    uniqueSimNameHindi: 'वचन स्वर-परिवर्तन स्विच लैब',
    uniqueSimNameEnglish: 'Vachan Vowel-Shift Plural Lab',
    mechanismTagHindi: 'एकवचन से बहुवचन स्वर-नियम',
    probeActionHindi: 'स्वर-परिवर्तन व बहुवचन नियम देखें',
    probeActionEnglish: 'Run Pluralization Engine',
  },
  'kriya-kaal': {
    moduleId: 'kriya-kaal',
    uniqueSimNameHindi: 'क्रिया-काल द्वि-इंजन स्टूडियो',
    uniqueSimNameEnglish: 'Kriya-Kaal Dual Action-Time Studio',
    mechanismTagHindi: 'कर्म व काल संयुक्त यंत्र',
    probeActionHindi: 'क्रिया-काल तंत्र चलाएँ',
    probeActionEnglish: 'Inspect Action & Tense',
  },
  kriya: {
    moduleId: 'kriya',
    uniqueSimNameHindi: 'क्रिया कर्म-प्रभाव लेज़र लैब',
    uniqueSimNameEnglish: 'Kriya Object-Impact Probe Lab',
    mechanismTagHindi: '“क्या / किसे?” कर्म-प्रभाव जाँच',
    probeActionHindi: 'कर्म-प्रभाव लेज़र जाँच चलाएँ',
    probeActionEnglish: 'Run Object-Impact Probe',
  },
  'vakya-vichar': {
    moduleId: 'vakya-vichar',
    uniqueSimNameHindi: 'उद्देश्य-विधेय विभाजक लैब',
    uniqueSimNameEnglish: 'Subject-Predicate Splitter Lab',
    mechanismTagHindi: 'उद्देश्य · विधेय · अर्थ-भाव',
    probeActionHindi: 'उद्देश्य व विधेय विभाजक चलाएँ',
    probeActionEnglish: 'Split Subject & Predicate',
  },
  'viram-chinh': {
    moduleId: 'viram-chinh',
    uniqueSimNameHindi: 'विराम-चिह्न ठहराव व अर्थ-पलट यंत्र',
    uniqueSimNameEnglish: 'Punctuation Pause & Meaning Shifter',
    mechanismTagHindi: 'ठहराव अवधि व भाव-संकेत',
    probeActionHindi: 'ठहराव व अर्थ-परिवर्तन देखें',
    probeActionEnglish: 'Test Pause & Tone Shift',
  },
  paryayvachi: {
    moduleId: 'paryayvachi',
    uniqueSimNameHindi: 'पर्यायवाची मूल-परिवार वृक्ष',
    uniqueSimNameEnglish: 'Paryayvachi Root-Family Tree',
    mechanismTagHindi: 'समान अर्थ व मूल शब्द श्रृंखला',
    probeActionHindi: 'मूल-परिवार शब्द श्रृंखला खोलें',
    probeActionEnglish: 'Expand Synonym Family',
  },
  vilom: {
    moduleId: 'vilom',
    uniqueSimNameHindi: 'विलोम उपसर्ग-दर्पण प्रयोगशाला',
    uniqueSimNameEnglish: 'Vilom Prefix-Mirror Lab',
    mechanismTagHindi: 'विपरीत उपसर्ग व स्तर-संतुलन',
    probeActionHindi: 'विपरीत शब्द-दर्पण चलाएँ',
    probeActionEnglish: 'Flip Antonym Mirror',
  },
  'anek-shabd': {
    moduleId: 'anek-shabd',
    uniqueSimNameHindi: 'वाक्यांश मूल-संक्षेपक लैब',
    uniqueSimNameEnglish: 'One-Word Phrase Compactor Lab',
    mechanismTagHindi: 'वाक्यांश से एक संस्कृत मूल',
    probeActionHindi: 'वाक्यांश संक्षेपण यंत्र चलाएँ',
    probeActionEnglish: 'Compact Phrase to Root Word',
  },
  'shabd-vichar': {
    moduleId: 'shabd-vichar',
    uniqueSimNameHindi: 'शब्द उत्पत्ति-वृक्ष एवं रचना लैब',
    uniqueSimNameEnglish: 'Shabd Etymology & Structure Lab',
    mechanismTagHindi: 'तत्सम · तद्भव · रूढ़-योगरूढ़ तंत्र',
    probeActionHindi: 'उत्पत्ति व अक्षर-चिह्न स्कैनर चलाएँ',
    probeActionEnglish: 'Run Etymology Signature Scan',
  },
  avikari: {
    moduleId: 'avikari',
    uniqueSimNameHindi: 'अव्यय अपरिवर्तन लॉक-टेस्ट लैब',
    uniqueSimNameEnglish: 'Avikari Invariance Freeze Lab',
    mechanismTagHindi: 'लिंग-वचन बदलने पर भी स्थिर',
    probeActionHindi: 'लिंग-काल बदलकर अव्यय लॉक जाँचें',
    probeActionEnglish: 'Run Invariance Stress Test',
  },
  'vakya-ashuddhi': {
    moduleId: 'vakya-ashuddhi',
    uniqueSimNameHindi: 'वाक्य-दोष स्कैनर व शोधन बेंच',
    uniqueSimNameEnglish: 'Syntax Error-Repair Bench',
    mechanismTagHindi: 'पदक्रम · पुनरुक्ति · वचन शोधन',
    probeActionHindi: 'वाक्य दोष-शोधन स्कैनर चलाएँ',
    probeActionEnglish: 'Run Syntax Error Repair',
  },
  anekarthi: {
    moduleId: 'anekarthi',
    uniqueSimNameHindi: 'अनेकार्थी प्रसंग-स्विच प्रयोगशाला',
    uniqueSimNameEnglish: 'Anekarthi Context Switcher Lab',
    mechanismTagHindi: 'एक शब्द — प्रसंग से बदलते अर्थ',
    probeActionHindi: 'प्रसंग के अनुसार अर्थ बदलें',
    probeActionEnglish: 'Switch Sentence Contexts',
  },
  shrutisam: {
    moduleId: 'shrutisam',
    uniqueSimNameHindi: 'श्रुतिसम ध्वनि-अंतर सूक्ष्मदर्शी',
    uniqueSimNameEnglish: 'Shrutisam Sound-Pair Microscope',
    mechanismTagHindi: 'एक मात्रा/अक्षर से अर्थ भेद',
    probeActionHindi: 'ध्वनि व मात्रा-अंतर सूक्ष्मदर्शी चलाएँ',
    probeActionEnglish: 'Inspect Minimal Pair Difference',
  },
  'pad-parichay': {
    moduleId: 'pad-parichay',
    uniqueSimNameHindi: 'पद-परिचय व्याकरणिक एक्स-रे',
    uniqueSimNameEnglish: 'Pad-Parichay Grammar X-Ray Lab',
    mechanismTagHindi: 'शब्द-वर्ग से क्रिया-संबंध तक',
    probeActionHindi: 'पद का व्याकरणिक एक्स-रे खोलें',
    probeActionEnglish: 'Inspect Word Grammar ID',
  },
  'visheshan-nirman': {
    moduleId: 'visheshan-nirman',
    uniqueSimNameHindi: 'विशेषण-निर्माण प्रत्यय संश्लेषक',
    uniqueSimNameEnglish: 'Adjective Derivation Morph Lab',
    mechanismTagHindi: 'आदि स्वर वृद्धि व प्रत्यय नियम',
    probeActionHindi: 'प्रत्यय व स्वर-वृद्धि संश्लेषक चलाएँ',
    probeActionEnglish: 'Run Suffix Morphing Rule',
  },
  'vartani-shuddhi': {
    moduleId: 'vartani-shuddhi',
    uniqueSimNameHindi: 'वर्तनी मात्रा व रेफ़-सूक्ष्मदर्शी',
    uniqueSimNameEnglish: 'Vartani Matra & Ref Microscope',
    mechanismTagHindi: 'उच्चारण, रेफ़ व संयुक्ताक्षर मानक',
    probeActionHindi: 'मात्रा व रेफ़ नियम सूक्ष्मदर्शी चलाएँ',
    probeActionEnglish: 'Inspect Spelling Anatomy',
  },
  'vakya-shuddhi': {
    moduleId: 'vakya-shuddhi',
    uniqueSimNameHindi: 'वाक्य शुद्धि पंच-तत्व निरीक्षक',
    uniqueSimNameEnglish: '5-Point Sentence Purity Scanner',
    mechanismTagHindi: 'लिंग · वचन · कारक · पुनरुक्ति जाँच',
    probeActionHindi: '५-बिंदु त्रुटि-निवारण स्कैनर चलाएँ',
    probeActionEnglish: 'Run 5-Point Error Scanner',
  },
  'vakya-parivartan': {
    moduleId: 'vakya-parivartan',
    uniqueSimNameHindi: 'अर्थ-रक्षा वाक्य रूपांतरण यंत्र',
    uniqueSimNameEnglish: 'Meaning-Preserving Sentence Transformer',
    mechanismTagHindi: 'अर्थ न बदले — रूप बदले',
    probeActionHindi: 'अर्थ-रक्षा रूपांतरण तंत्र चलाएँ',
    probeActionEnglish: 'Run Transformation Engine',
  },
};

export function getSimulationMetadata(
  moduleId: string,
  fallbackHindi?: string,
  fallbackEnglish?: string
): SimulationMetadataItem {
  const found = SIMULATION_METADATA[moduleId];
  if (found) return found;
  return {
    moduleId,
    uniqueSimNameHindi: fallbackHindi || `${moduleId} प्रयोगशाला`,
    uniqueSimNameEnglish: fallbackEnglish || `${moduleId} Lab`,
    mechanismTagHindi: 'कार्यप्रणाली व तर्क विश्लेषण',
    probeActionHindi: 'कार्यप्रणाली विश्लेषण चलाएँ',
    probeActionEnglish: 'Inspect Mechanism',
  };
}

/**
 * Converts any legacy question-like classifier strings (e.g. "कवि → ?", "बच्चे खेल रहे हैं ___",
 * "निम्नलिखित में से शुद्ध वाक्य चुनिए:") into clean declarative teaching specimens for simulations.
 */
export function sanitizeSpecimenForMechanism(
  wordOrSentence: string,
  category: string,
  correctOption?: string,
  highlight?: string
): {
  beforeForm: string;
  afterForm: string;
  displaySpecimen: string;
  ruleHeadline: string;
  isTransformation: boolean;
} {
  const raw = (wordOrSentence || '').trim();
  const cat = (category || '').trim();
  const ans = (correctOption || '').trim();

  // Strip question-style instructions (so simulations never look like MCQ prompts)
  const isQuestionHeader =
    /निम्नलिखित में से|शुद्ध वाक्य चुनिए|वाक्य शुद्ध कीजिए|कौन-सा भेद|कौन-सी क्रिया|कौन-सी होगी|कैसा वाक्य|शुद्ध रूप क्या|किस प्रकार|चुनिए:|बताइए/i.test(
      raw
    );

  if (isQuestionHeader) {
    // Extract quoted sentence if present inside raw, e.g. "'राधा पत्र लिखती है।' वाक्य में..."
    const quoted = raw.match(/['"‘“]([^'"’”]+)['"’”]/);
    if (quoted && quoted[1]) {
      return {
        beforeForm: quoted[1].trim(),
        afterForm: ans || cat,
        displaySpecimen: quoted[1].trim(),
        ruleHeadline: cat || ans,
        isTransformation: Boolean(ans && ans !== quoted[1].trim()),
      };
    }
    const cleanTarget = ans || cat;
    return {
      beforeForm: cleanTarget,
      afterForm: cat,
      displaySpecimen: cleanTarget,
      ruleHeadline: highlight || cat,
      isTransformation: false,
    };
  }

  // Replace '?'-arrow patterns or '__' placeholders with the resolved transformed form
  const hasArrowPrompt = raw.includes('→ ?') || raw.includes('⇄ ?') || raw.includes('= ?');
  if (hasArrowPrompt || /__+/.test(raw)) {
    const parenSymbol = ans.match(/\(([^)]+)\)/)?.[1]?.trim();
    const cleanAnswer = ans.replace(/\s*\([^)]*\)\s*/g, '').trim() || cat;
    const slotReplacement = parenSymbol && /__+/.test(raw) ? parenSymbol : cleanAnswer;

    let resolved = raw;
    if (raw.includes('|') && raw.includes('→ ?') && cleanAnswer.includes('/')) {
      const leftParts = raw.split('|').map((s) => s.trim());
      const rightParts = cleanAnswer.split('/').map((s) => s.trim());
      if (leftParts.length === rightParts.length) {
        resolved = leftParts
          .map((lp, idx) => lp.replace(/\?/g, rightParts[idx] || ''))
          .join('  |  ');
      }
    } else if (hasArrowPrompt) {
      resolved = resolved.replace(/([→⇄=])\s*\?/g, `$1 ${cleanAnswer}`);
    }

    resolved = resolved
      .replace(/__+/g, slotReplacement)
      .replace(/\s+/g, ' ')
      .trim();

    const beforeClean = raw
      .replace(/\s*→\s*\?/g, '')
      .replace(/\s*⇄\s*\?/g, '')
      .replace(/\s*=\s*\?/g, '')
      .replace(/__+/g, '…')
      .replace(/\(शुद्ध वर्तनी चुनें\)/g, '')
      .trim();

    return {
      beforeForm: beforeClean,
      afterForm: parenSymbol ? `${cleanAnswer} (${parenSymbol})` : cleanAnswer,
      displaySpecimen: resolved.replace(/\(शुद्ध वर्तनी चुनें\)/g, '').trim(),
      ruleHeadline: cat,
      isTransformation: true,
    };
  }

  // Strip trailing "(शुद्ध वर्तनी चुनें)" etc.
  const cleanRaw = raw.replace(/\(शुद्ध वर्तनी चुनें\)/g, '').trim();

  // Check if already a "before → after" or "before | after" pair
  if (cleanRaw.includes('→')) {
    const parts = cleanRaw.split('→');
    return {
      beforeForm: parts[0].trim(),
      afterForm: parts.slice(1).join('→').trim(),
      displaySpecimen: cleanRaw,
      ruleHeadline: cat,
      isTransformation: true,
    };
  }

  return {
    beforeForm: cleanRaw,
    afterForm: ans || cat,
    displaySpecimen: cleanRaw,
    ruleHeadline: cat,
    isTransformation: Boolean(ans && ans !== cleanRaw),
  };
}
