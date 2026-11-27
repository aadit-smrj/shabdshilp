import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  KeyRound,
  Layers,
  Link2,
  Scissors,
  Sparkles,
  Sun,
  Unlink2,
  Zap,
  Check,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import {
  GrammarModule,
  KarakData,
  MuhavaraItem,
  VachyaStageItem,
  VakyaItem,
} from '../types';
import {
  AffixSimItem,
  ClassifierSimItem,
  KarakCableScenario,
  SamasSimItem,
  SandhiSimItem,
} from '../data/expandedSimulationsData';
import {
  ChapterCheatNoteData,
  KAAL_MECHANISM_SPECS,
  KAAL_VERB_ROOTS,
  MUHAVARA_REASONING_MAP,
} from '../data/simulationCheatNotes';
import {
  getSimulationMetadata,
  sanitizeSpecimenForMechanism,
} from '../data/simulationMetadata';
import {
  getMuhavaraSceneImage,
  getSimulationVisual,
} from '../data/simulationVisuals';
import { KARAK_LIST } from '../data/grammarData';
import { SimulationImageInterpreter } from './SimulationImageInterpreter';

interface MechanismSimulationStageProps {
  moduleId: string;
  moduleObj: GrammarModule;
  cheatNote: ChapterCheatNoteData;
  bilingualMode: boolean;
  karakScenarios: KarakCableScenario[];
  vakyaItems: VakyaItem[];
  vachyaItems: VachyaStageItem[];
  muhavaraItems: MuhavaraItem[];
  affixItems: AffixSimItem[];
  sandhiItems: SandhiSimItem[];
  samasItems: SamasSimItem[];
  classifierItems: ClassifierSimItem[];
  isAlreadyUnlocked: boolean;
  onUnlockCheatNotes: () => void;
  onNavigateToUpsarg?: () => void;
}

const MUHAVARA_VISUAL_ICONS = [
  '🏃',
  '☁️',
  '⭐',
  '🐫',
  '😮',
  '🏺',
  '👎',
  '🌙',
  '🦯',
  '🫘',
  '🥋',
  '👂',
  '🪔',
  '🪨',
  '🍽️',
  '🌕',
  '💧',
  '🦉',
];

export const MechanismSimulationStage: React.FC<MechanismSimulationStageProps> = ({
  moduleId,
  moduleObj,
  cheatNote,
  bilingualMode,
  karakScenarios,
  vakyaItems,
  vachyaItems,
  muhavaraItems,
  affixItems,
  sandhiItems,
  samasItems,
  classifierItems,
  isAlreadyUnlocked,
  onUnlockCheatNotes,
  onNavigateToUpsarg,
}) => {
  const REQUIRED_EXPLORATIONS = 3;
  const [exploredKeys, setExploredKeys] = useState<string[]>([]);

  useEffect(() => {
    setExploredKeys([]);
  }, [moduleId]);

  const markExplored = (key: string) => {
    setExploredKeys((prev) => (prev.includes(key) ? prev : [...prev, key]));
  };

  const exploredCount = exploredKeys.length;
  const readyToUnlock = isAlreadyUnlocked || exploredCount >= REQUIRED_EXPLORATIONS;
  const progressPct = Math.min(
    100,
    Math.round((exploredCount / REQUIRED_EXPLORATIONS) * 100)
  );
  const simMeta = getSimulationMetadata(
    moduleId,
    moduleObj.interactionNameHindi,
    moduleObj.interactionNameEnglish
  );
  const moduleVisual = useMemo(() => getSimulationVisual(moduleId), [moduleId]);

  // =========================================================================
  // 1. KAAL / KRIYA-KAAL INTERACTIVE MECHANISM ENGINE
  // =========================================================================
  const [kaalEra, setKaalEra] = useState<'past' | 'present' | 'future'>('present');
  const [kaalSpecId, setKaalSpecId] = useState<string>('vartaman_samanya');
  const [kaalRootId, setKaalRootId] = useState<string>('likh');

  const eraSpecs = useMemo(
    () => KAAL_MECHANISM_SPECS.filter((s) => s.mainTense === kaalEra),
    [kaalEra]
  );

  const activeKaalSpec = useMemo(
    () =>
      KAAL_MECHANISM_SPECS.find((s) => s.id === kaalSpecId) ||
      eraSpecs[0] ||
      KAAL_MECHANISM_SPECS[0],
    [kaalSpecId, eraSpecs]
  );

  useEffect(() => {
    if (moduleId === 'kaal' || moduleId === 'kriya-kaal') {
      markExplored(`kaal:${activeKaalSpec.id}`);
    }
  }, [moduleId, activeKaalSpec.id]);

  // =========================================================================
  // 2. MUHAVARE 3-LAYER UNDERSTANDING BRIDGE (NOT MEMORISATION)
  // =========================================================================
  const [muhIndex, setMuhIndex] = useState<number>(0);
  const [muhStage, setMuhStage] = useState<1 | 2 | 3>(1);

  const activeMuh = muhavaraItems[muhIndex % Math.max(1, muhavaraItems.length)];
  const activeMuhReasoning = activeMuh ? MUHAVARA_REASONING_MAP[activeMuh.id] : undefined;

  // =========================================================================
  // 3. KARAK FORCE & DISTANCE CABLE LAB
  // =========================================================================
  const [karakIdx, setKarakIdx] = useState<number>(0);
  const [karakTested, setKarakTested] = useState<boolean>(false);
  const [selectedKarakInfo, setSelectedKarakInfo] = useState<KarakData>(KARAK_LIST[2]);
  const activeKarakScenario =
    karakScenarios[karakIdx % Math.max(1, karakScenarios.length)];

  // =========================================================================
  // 4. VAKYA CLAUSE COUPLER & SPLIT-TEST LAB
  // =========================================================================
  const [vakyaIdx, setVakyaIdx] = useState<number>(0);
  const [vakyaSplitOpen, setVakyaSplitOpen] = useState<boolean>(false);
  const activeVakya = vakyaItems[vakyaIdx % Math.max(1, vakyaItems.length)];

  // =========================================================================
  // 5. VACHYA STAGE SPOTLIGHT & AGREEMENT ENGINE
  // =========================================================================
  const [vachyaIdx, setVachyaIdx] = useState<number>(0);
  const [vachyaFocus, setVachyaFocus] = useState<'kartri' | 'karm' | 'bhav'>('kartri');
  const activeVachya = vachyaItems[vachyaIdx % Math.max(1, vachyaItems.length)];

  // =========================================================================
  // 6. UPSARG-PRATYAY MAGNETIC WORD ASSEMBLER
  // =========================================================================
  const [affixIdx, setAffixIdx] = useState<number>(0);
  const [affixMerged, setAffixMerged] = useState<boolean>(false);
  const activeAffix = affixItems[affixIdx % Math.max(1, affixItems.length)];

  // =========================================================================
  // 7. SANDHI PHONETIC COLLISION SLIDER LAB
  // =========================================================================
  const [sandhiIdx, setSandhiIdx] = useState<number>(0);
  const [sandhiFusion, setSandhiFusion] = useState<number>(0);
  const activeSandhi = sandhiItems[sandhiIdx % Math.max(1, sandhiItems.length)];

  // =========================================================================
  // 8. SAMAS COMPRESSION & DOMINANCE LAB
  // =========================================================================
  const [samasIdx, setSamasIdx] = useState<number>(0);
  const [samasExpanded, setSamasExpanded] = useState<boolean>(false);
  const activeSamas = samasItems[samasIdx % Math.max(1, samasItems.length)];

  // =========================================================================
  // 9. INTERACTIVE CONCEPT MECHANISM LAB (All other 20+ modules)
  // =========================================================================
  const [specimenIdx, setSpecimenIdx] = useState<number>(0);
  const [diagnosticRevealed, setDiagnosticRevealed] = useState<boolean>(false);

  useEffect(() => {
    setMuhIndex(0);
    setMuhStage(1);
    setKarakIdx(0);
    setKarakTested(false);
    setVakyaIdx(0);
    setVakyaSplitOpen(false);
    setVachyaIdx(0);
    setVachyaFocus('kartri');
    setAffixIdx(0);
    setAffixMerged(false);
    setSandhiIdx(0);
    setSandhiFusion(0);
    setSamasIdx(0);
    setSamasExpanded(false);
    setSpecimenIdx(0);
    setDiagnosticRevealed(false);
  }, [moduleId]);

  const activeSpecimen =
    classifierItems.length > 0
      ? classifierItems[specimenIdx % classifierItems.length]
      : null;

  // Footer Unlock Banner shared across all simulations (Dark Obsidian Studio)
  const renderUnlockFooter = () => (
    <div className="mt-6 rounded-2xl border border-slate-800 bg-[#0B1120] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
      <div className="space-y-1.5 flex-1">
        <div className="flex items-center justify-between gap-3 text-xs">
          <span className="font-extrabold text-slate-100 tracking-[0.01em]">
            {readyToUnlock
              ? 'सिमुलेशन अवधारणा पूर्ण! अब अध्याय के चीट कोड्स व नोट्स खोलें।'
              : `चीट कोड्स व नोट्स अनलॉक करने के लिए कम-से-कम ${REQUIRED_EXPLORATIONS} दृश्य-संकेत या प्रयोग परखें`}
          </span>
          <span className="font-black text-amber-300 tabular-nums shrink-0">
            {Math.min(exploredCount, REQUIRED_EXPLORATIONS)} / {REQUIRED_EXPLORATIONS}
          </span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden border border-slate-700/70">
          <div
            className={`h-full transition-all duration-300 ${
              readyToUnlock
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                : 'bg-gradient-to-r from-amber-500 to-amber-300'
            }`}
            style={{ width: `${isAlreadyUnlocked ? 100 : progressPct}%` }}
          />
        </div>
        {bilingualMode && (
          <p className="text-[11px] text-slate-400">
            {readyToUnlock
              ? 'Visual clues & mechanism explored — unlock printable Cheat Codes & Chapter Notes next.'
              : `Inspect ${REQUIRED_EXPLORATIONS} visual hotspots or interactive trials above to unlock Cheat Codes & Notes.`}
          </p>
        )}
      </div>

      <button
        type="button"
        disabled={!readyToUnlock}
        onClick={onUnlockCheatNotes}
        className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-black inline-flex items-center justify-center gap-2 transition-all whitespace-nowrap shrink-0 ${
          readyToUnlock
            ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_24px_rgba(16,185,129,0.28)] cursor-pointer'
            : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
        }`}
      >
        <KeyRound className="w-4 h-4 shrink-0" />
        <span>चीट कोड्स व नोट्स खोलें</span>
        <ArrowRight className="w-4 h-4 shrink-0" />
      </button>
    </div>
  );

  // =========================================================================
  // RENDERER 1: KAAL / KRIYA-KAAL TIME-MACHINE MECHANISM LAB
  // =========================================================================
  if (moduleId === 'kaal' || moduleId === 'kriya-kaal') {
    const activeEx =
      activeKaalSpec.examples[kaalRootId] || activeKaalSpec.examples.likh;

    const pastRef =
      KAAL_MECHANISM_SPECS.find((s) => s.id === 'bhoot_poorn')!.examples[kaalRootId];
    const presentRef =
      KAAL_MECHANISM_SPECS.find((s) => s.id === 'vartaman_apoorn')!.examples[kaalRootId];
    const futureRef =
      KAAL_MECHANISM_SPECS.find((s) => s.id === 'bhavishya_samanya')!.examples[kaalRootId];

    const kaalLensLabel =
      kaalEra === 'past'
        ? 'सक्रिय लेंस: बायाँ अतीत क्षितिज (भूतकाल)'
        : kaalEra === 'present'
        ? 'सक्रिय लेंस: केंद्रीय वर्तमान केंद्र (अभी)'
        : 'सक्रिय लेंस: दायाँ भविष्य क्षितिज (आने वाला कल)';

    return (
      <div className="space-y-5">
        <div className="bg-[#0B1120] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden text-slate-100">
          {/* Top Control Header */}
          <div className="bg-[#070B16] border-b border-slate-800 px-6 py-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                {simMeta.uniqueSimNameHindi} · {simMeta.uniqueSimNameEnglish}
              </div>
              <h3 className="text-lg sm:text-xl font-black font-serif-display mt-0.5 text-white">
                {moduleId === 'kriya-kaal'
                  ? 'देखें क्रिया (सकर्मक/अकर्मक) और काल का चिह्न समय व स्थिति कैसे बदलता है'
                  : 'देखें क्रिया का अंतिम चिह्न समय और स्थिति कैसे बदलता है'}
              </h3>
            </div>

            {/* Verb Root Selector */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-400 mr-1">
                मूल धातु चुनें:
              </span>
              {KAAL_VERB_ROOTS.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    setKaalRootId(r.id);
                    markExplored(`kaal-root:${r.id}`);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap border ${
                    kaalRootId === r.id
                      ? 'bg-amber-400 text-slate-950 border-amber-300'
                      : 'bg-[#111827] text-slate-200 border-slate-700 hover:border-amber-400/50'
                  }`}
                >
                  {r.labelHindi}
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 sm:p-7 space-y-6">
            {/* Image-Interpretive Celestial Time Scene */}
            <SimulationImageInterpreter
              visual={moduleVisual}
              bilingualMode={bilingualMode}
              activeLensZone={
                kaalEra === 'past'
                  ? 'left'
                  : kaalEra === 'present'
                  ? 'center'
                  : 'right'
              }
              lensLabelHindi={kaalLensLabel}
              exploredKeys={exploredKeys}
              onInterpretClue={markExplored}
            />

            {/* Step A: Era Switcher (3 Main Tenses) */}
            <div className="grid grid-cols-3 gap-2.5">
              {(
                [
                  { id: 'past', title: '१. भूतकाल', sub: 'बीता हुआ समय (Past)' },
                  { id: 'present', title: '२. वर्तमान काल', sub: 'चल रहा समय (Present)' },
                  { id: 'future', title: '३. भविष्यत् काल', sub: 'आने वाला समय (Future)' },
                ] as const
              ).map((era) => {
                const isActive = kaalEra === era.id;
                return (
                  <button
                    key={era.id}
                    type="button"
                    onClick={() => {
                      setKaalEra(era.id);
                      const firstSpec = KAAL_MECHANISM_SPECS.find(
                        (s) => s.mainTense === era.id
                      );
                      if (firstSpec) {
                        setKaalSpecId(firstSpec.id);
                        markExplored(`kaal:${firstSpec.id}`);
                      }
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isActive
                        ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg'
                        : 'bg-[#111827] text-slate-200 border-slate-800 hover:border-amber-400/50'
                    }`}
                  >
                    <div className="text-sm font-black font-display">{era.title}</div>
                    <div
                      className={`text-[11px] mt-0.5 ${
                        isActive ? 'text-slate-800 font-semibold' : 'text-slate-400'
                      }`}
                    >
                      {era.sub}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Step B: Sub-Tense Selector */}
            <div className="space-y-2">
              <div className="text-xs font-extrabold text-slate-300">
                उपभेद चुनकर क्रिया का बदलाव देखें (Select Sub-Tense Aspect):
              </div>
              <div className="flex flex-wrap gap-2">
                {eraSpecs.map((spec) => {
                  const selected = spec.id === activeKaalSpec.id;
                  const seen = exploredKeys.includes(`kaal:${spec.id}`);
                  return (
                    <button
                      key={spec.id}
                      type="button"
                      onClick={() => {
                        setKaalSpecId(spec.id);
                        markExplored(`kaal:${spec.id}`);
                      }}
                      className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap ${
                        selected
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm'
                          : 'bg-[#111827] text-slate-200 border-slate-700 hover:border-amber-400/50'
                      }`}
                    >
                      {seen && (
                        <CheckCircle2
                          className={`w-3.5 h-3.5 shrink-0 ${
                            selected ? 'text-slate-950' : 'text-emerald-400'
                          }`}
                        />
                      )}
                      <span>{spec.subTypeHindi}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Visual Timeline Axis */}
            <div className="rounded-2xl bg-[#111827] border border-slate-800 p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                <span>बीता समय (Past)</span>
                <span className="text-amber-300 font-black">अभी (Now)</span>
                <span>आने वाला समय (Future)</span>
              </div>
              <div className="relative h-3 rounded-full bg-slate-800 overflow-visible">
                <div className="absolute left-1/2 -top-1 bottom-0 w-0.5 h-5 bg-slate-500" />
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-amber-400 border-4 border-[#060913] shadow-[0_0_14px_rgba(245,158,11,0.65)] transition-all duration-500"
                  style={{ left: `${activeKaalSpec.timelinePosition}%` }}
                />
              </div>
              <div className="text-center text-xs font-extrabold text-slate-200 pt-1">
                सक्रिय स्थिति:{' '}
                <span className="text-amber-300">{activeKaalSpec.subTypeHindi}</span>
                {bilingualMode && (
                  <span className="text-slate-400 font-semibold">
                    {' '}
                    · {activeKaalSpec.subTypeEnglish}
                  </span>
                )}
              </div>
            </div>

            {/* Live Morpheme Sentence Anatomy */}
            <div className="rounded-2xl border border-indigo-500/30 bg-[#0F172A] p-5 space-y-4">
              <div className="text-xs font-extrabold text-amber-300 uppercase tracking-wide">
                वाक्य का यांत्रिक विच्छेदन (Live Morpheme Breakdown)
              </div>

              <div className="grid sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-xl bg-[#070B16] border border-slate-800">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">१. कर्ता</div>
                  <div className="text-base font-black text-slate-100 font-hindi mt-0.5">
                    {activeEx.subject}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#070B16] border border-slate-800">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">
                    २. कर्म / समय
                  </div>
                  <div className="text-base font-black text-slate-100 font-hindi mt-0.5">
                    {activeEx.objectPart}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#070B16] border border-indigo-500/40">
                  <div className="text-[10px] font-bold text-indigo-300 uppercase">
                    ३. मूल धातु
                  </div>
                  <div className="text-base font-black text-white font-hindi mt-0.5">
                    {activeEx.rootPart}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-400/40">
                  <div className="text-[10px] font-extrabold text-amber-300 uppercase">
                    ४. काल-सूचक चिह्न
                  </div>
                  <div className="text-base font-black text-amber-200 font-hindi mt-0.5">
                    +{activeEx.tenseEnding}
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-[#060913] border border-slate-800 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="text-lg sm:text-2xl font-black font-hindi text-white">
                    “{activeEx.fullSentence}”
                  </div>
                  {bilingualMode && (
                    <div className="text-xs text-slate-400 mt-0.5">{activeEx.english}</div>
                  )}
                </div>
                <div className="text-xs font-bold text-amber-300 font-hindi shrink-0">
                  सूत्र: {activeKaalSpec.formulaHindi}
                </div>
              </div>
            </div>

            {/* Reasoning + Signal Keywords */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border border-slate-800 bg-[#111827] space-y-2">
                <div className="text-xs font-black text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>तर्क व कारण (Why This Form Works)</span>
                </div>
                <p className="text-sm font-semibold text-slate-100 leading-relaxed font-hindi tracking-[0.01em]">
                  {activeKaalSpec.reasoningHindi}
                </p>
                {bilingualMode && (
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {activeKaalSpec.reasoningEnglish}
                  </p>
                )}
              </div>

              <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/25 space-y-2.5">
                <div className="text-xs font-black text-emerald-300 uppercase tracking-wide flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 shrink-0" />
                  <span>त्वरित पहचान कीवर्ड्स (Signal Keywords)</span>
                </div>
                <ul className="space-y-1.5 text-xs sm:text-sm font-bold text-emerald-100 font-hindi">
                  {activeKaalSpec.signalKeywords.map((kw, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-black">•</span>
                      <span>{kw}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Side-by-side 3-Era Comparison */}
            <div className="rounded-2xl border border-slate-800 bg-[#070B16] p-4 space-y-2.5">
              <div className="text-xs font-extrabold text-slate-300">
                एक ही धातु ({KAAL_VERB_ROOTS.find((r) => r.id === kaalRootId)?.labelHindi}) का तीनों कालों में प्रत्यक्ष अंतर:
              </div>
              <div className="grid sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-3 rounded-xl bg-[#111827] border border-slate-800">
                  <div className="font-bold text-slate-400">भूतकाल (पूर्ण)</div>
                  <div className="font-black text-slate-100 font-hindi mt-1">
                    {pastRef.fullSentence}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#111827] border border-amber-400/40">
                  <div className="font-bold text-amber-300">वर्तमान काल (अपूर्ण)</div>
                  <div className="font-black text-white font-hindi mt-1">
                    {presentRef.fullSentence}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#111827] border border-slate-800">
                  <div className="font-bold text-slate-400">भविष्यत् काल (सामान्य)</div>
                  <div className="font-black text-slate-100 font-hindi mt-1">
                    {futureRef.fullSentence}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {renderUnlockFooter()}
      </div>
    );
  }

  // =========================================================================
  // RENDERER 2: MUHAVARE 3-LAYER UNDERSTANDING BRIDGE (ZERO ROTE MEMORISATION)
  // =========================================================================
  if (moduleId === 'muhavare' && activeMuh) {
    const icon = MUHAVARA_VISUAL_ICONS[muhIndex % MUHAVARA_VISUAL_ICONS.length] || '✨';
    const dynamicMuhImage = getMuhavaraSceneImage(muhIndex, activeMuh.muhavara);

    const handleAdvanceMuhStage = (targetStage: 1 | 2 | 3) => {
      setMuhStage(targetStage);
      if (targetStage === 3) {
        markExplored(`muh:${activeMuh.id}`);
      }
    };

    const handleSelectMuh = (idx: number) => {
      setMuhIndex(idx);
      setMuhStage(1);
    };

    return (
      <div className="space-y-5">
        <div className="bg-[#0B1120] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden text-slate-100">
          <div className="bg-[#070B16] border-b border-slate-800 px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                {simMeta.uniqueSimNameHindi} · {simMeta.uniqueSimNameEnglish}
              </div>
              <h3 className="text-lg sm:text-xl font-black font-serif-display mt-0.5 text-white">
                शाब्दिक दृश्य से लाक्षणिक अर्थ तक का तर्क समझें (बिना रटे)
              </h3>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() =>
                  handleSelectMuh(
                    (muhIndex - 1 + muhavaraItems.length) % muhavaraItems.length
                  )
                }
                className="p-2 rounded-lg bg-[#111827] hover:bg-slate-800 border border-slate-700 text-white cursor-pointer"
                aria-label="पिछला मुहावरा"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold tabular-nums px-2 text-amber-300">
                {muhIndex + 1} / {muhavaraItems.length}
              </span>
              <button
                type="button"
                onClick={() =>
                  handleSelectMuh((muhIndex + 1) % muhavaraItems.length)
                }
                className="p-2 rounded-lg bg-[#111827] hover:bg-slate-800 border border-slate-700 text-white cursor-pointer"
                aria-label="अगला मुहावरा"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-5 sm:p-7 space-y-6">
            {/* Image-Interpretive Metaphor Scene Canvas (shifts dynamically per Muhavara) */}
            <SimulationImageInterpreter
              visual={moduleVisual}
              imageOverride={dynamicMuhImage}
              titleOverride={`चित्र-रूपक: ${activeMuh.muhavara}`}
              bilingualMode={bilingualMode}
              activeLensZone={
                muhStage === 1 ? 'left' : muhStage === 2 ? 'center' : 'right'
              }
              lensLabelHindi={
                muhStage === 1
                  ? 'चरण १: शाब्दिक दृश्य पहचान'
                  : muhStage === 2
                  ? 'चरण २: लाक्षणिक तर्क-सेतु'
                  : 'चरण ३: वास्तविक प्रसंग अर्थ'
              }
              exploredKeys={exploredKeys}
              onInterpretClue={markExplored}
            />

            {/* Idiom Selector Strip */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {muhavaraItems.map((m, idx) => {
                const isSelected = idx === muhIndex;
                const decoded = exploredKeys.includes(`muh:${m.id}`);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleSelectMuh(idx)}
                    className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer whitespace-nowrap inline-flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm'
                        : decoded
                        ? 'bg-emerald-950/60 text-emerald-200 border-emerald-500/40'
                        : 'bg-[#111827] text-slate-200 border-slate-700 hover:border-amber-400/50'
                    }`}
                  >
                    {decoded && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                    <span>{m.muhavara}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Idiom Stage Title */}
            <div className="rounded-2xl bg-[#111827] border border-slate-800 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#070B16] border border-amber-400/30 flex items-center justify-center text-3xl shrink-0">
                  {icon}
                </div>
                <div>
                  <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wide">
                    चयनित मुहावरा
                  </div>
                  <h4 className="text-2xl sm:text-3xl font-black text-white font-serif-display">
                    {activeMuh.muhavara}
                  </h4>
                </div>
              </div>

              {/* 3-Step Bridge Progress Switcher */}
              <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                {([1, 2, 3] as const).map((stepNum) => (
                  <button
                    key={stepNum}
                    type="button"
                    onClick={() => handleAdvanceMuhStage(stepNum)}
                    className={`px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap border ${
                      muhStage === stepNum
                        ? 'bg-amber-400 text-slate-950 border-amber-300'
                        : muhStage > stepNum
                        ? 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40'
                        : 'bg-[#070B16] border-slate-700 text-slate-300 hover:border-amber-400/50'
                    }`}
                  >
                    {stepNum === 1 && '१. दृश्य'}
                    {stepNum === 2 && '२. तर्क-सेतु'}
                    {stepNum === 3 && '३. वास्तविक अर्थ'}
                  </button>
                ))}
              </div>
            </div>

            {/* 3-Layer Progressive Cards */}
            <div className="grid lg:grid-cols-3 gap-4">
              {/* Layer 1: Literal Visual */}
              <div
                className={`p-5 rounded-2xl border transition-all space-y-2.5 ${
                  muhStage >= 1
                    ? 'bg-amber-500/10 border-amber-400/35'
                    : 'bg-[#111827] border-slate-800 opacity-60'
                }`}
              >
                <div className="text-xs font-black text-amber-300 uppercase tracking-wide">
                  चरण १ · शाब्दिक दृश्य (Literal Picture)
                </div>
                <div className="text-sm font-extrabold text-white font-hindi">
                  “{activeMuh.literalHindi}”
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-hindi">
                  {activeMuhReasoning?.literalBreakdownHindi ||
                    activeMuh.literalImageDescription}
                </p>
                {bilingualMode && (
                  <p className="text-[11px] text-slate-400">
                    Literal image: {activeMuh.literalEnglish}
                  </p>
                )}
                {muhStage === 1 && (
                  <button
                    type="button"
                    onClick={() => handleAdvanceMuhStage(2)}
                    className="mt-2 w-full py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black cursor-pointer transition-colors"
                  >
                    अब तर्क-सेतु समझें (Why does it mean this?) →
                  </button>
                )}
              </div>

              {/* Layer 2: Logical Reasoning Bridge */}
              <div
                className={`p-5 rounded-2xl border transition-all space-y-2.5 ${
                  muhStage >= 2
                    ? 'bg-indigo-950/40 border-indigo-400/40'
                    : 'bg-[#111827] border-slate-800'
                }`}
              >
                <div className="text-xs font-black text-indigo-300 uppercase tracking-wide">
                  चरण २ · तार्किक सेतु (Why It Means This)
                </div>
                {muhStage >= 2 ? (
                  <>
                    <p className="text-sm font-bold text-slate-100 leading-relaxed font-hindi">
                      {activeMuhReasoning?.logicalBridgeHindi ||
                        'यह दृश्य मानव अनुभव की उस सटीक भावना से जुड़ता है जिसे सीधे शब्दों से अधिक प्रभावशाली ढंग से कहा जा सके।'}
                    </p>
                    {bilingualMode && activeMuhReasoning?.logicalBridgeEnglish && (
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {activeMuhReasoning.logicalBridgeEnglish}
                      </p>
                    )}
                    {activeMuhReasoning?.memoryCueHindi && (
                      <div className="p-2.5 rounded-xl bg-[#070B16] border border-indigo-400/30 text-xs font-extrabold text-amber-200 font-hindi">
                        याद सूत्र: {activeMuhReasoning.memoryCueHindi}
                      </div>
                    )}
                    {muhStage === 2 && (
                      <button
                        type="button"
                        onClick={() => handleAdvanceMuhStage(3)}
                        className="mt-2 w-full py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black cursor-pointer transition-colors"
                      >
                        लाक्षणिक अर्थ व प्रसंग खोलें →
                      </button>
                    )}
                  </>
                ) : (
                  <div className="py-6 text-center space-y-2">
                    <p className="text-xs text-slate-400 font-hindi">
                      पहले शाब्दिक चित्र की कल्पना करें, फिर तार्किक सेतु खोलें।
                    </p>
                    <button
                      type="button"
                      onClick={() => handleAdvanceMuhStage(2)}
                      className="px-4 py-2 rounded-xl bg-[#070B16] border border-indigo-400/40 text-indigo-200 text-xs font-bold hover:bg-indigo-950/60 cursor-pointer"
                    >
                      तर्क-सेतु खोलें
                    </button>
                  </div>
                )}
              </div>

              {/* Layer 3: Real Figurative Meaning & Context Check */}
              <div
                className={`p-5 rounded-2xl border transition-all space-y-2.5 ${
                  muhStage >= 3
                    ? 'bg-emerald-950/35 border-emerald-500/40'
                    : 'bg-[#111827] border-slate-800'
                }`}
              >
                <div className="text-xs font-black text-emerald-300 uppercase tracking-wide">
                  चरण ३ · लाक्षणिक अर्थ व प्रसंग
                </div>
                {muhStage >= 3 ? (
                  <>
                    <div className="text-base font-black text-emerald-200 font-hindi">
                      अर्थ: {activeMuh.metaphorHindi}
                    </div>
                    {bilingualMode && (
                      <div className="text-xs text-emerald-300/80">
                        {activeMuh.metaphorEnglish}
                      </div>
                    )}
                    <div className="p-3 rounded-xl bg-[#070B16] border border-emerald-500/30 text-xs font-bold text-slate-100 font-hindi leading-relaxed">
                      वाक्य: “{activeMuh.sentenceHindi}”
                    </div>
                    {activeMuhReasoning && (
                      <div className="space-y-1.5 pt-1 text-[11px] font-hindi">
                        <div className="flex items-start gap-1.5 text-emerald-200">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>
                            <strong>कब प्रयोग करें:</strong> {activeMuhReasoning.fitContextHindi}
                          </span>
                        </div>
                        <div className="flex items-start gap-1.5 text-rose-200">
                          <X className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                          <span>
                            <strong>कब नहीं:</strong> {activeMuhReasoning.unfitContextHindi}
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="py-6 text-center space-y-2">
                    <p className="text-xs text-slate-400 font-hindi">
                      चरण २ के बाद वास्तविक अर्थ और सही-गलत प्रसंग खुलेंगे।
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {renderUnlockFooter()}
      </div>
    );
  }

  // =========================================================================
  // RENDERER 3: KARAK FORCE & DISTANCE CABLE LAB
  // =========================================================================
  if (moduleId === 'karak' && activeKarakScenario) {
    const isApadan = activeKarakScenario.answer === 'Apadan';

    return (
      <div className="space-y-5">
        <div className="bg-[#0B1120] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden text-slate-100">
          <div className="bg-[#070B16] border-b border-slate-800 px-6 py-5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
              {simMeta.uniqueSimNameHindi} · {simMeta.uniqueSimNameEnglish}
            </div>
            <h3 className="text-lg sm:text-xl font-black font-serif-display mt-0.5 text-white">
              ‘से’ विभक्ति में जुड़ाव (साधन) और अलगाव (दूरी) का अंतर प्रत्यक्ष देखें
            </h3>
          </div>

          <div className="p-5 sm:p-7 space-y-6">
            {/* Visual Connection vs Separation Scene Interpreter */}
            <SimulationImageInterpreter
              visual={moduleVisual}
              bilingualMode={bilingualMode}
              activeLensZone={!karakTested ? 'full' : isApadan ? 'right' : 'left'}
              lensLabelHindi={
                !karakTested
                  ? 'चित्र में दोनों पक्षों की तुलना करें'
                  : isApadan
                  ? 'लेंस दाएँ: टूटकर अलग होने का भाव (अपादान)'
                  : 'लेंस बाएँ: जुड़ा हुआ कार्य-साधन (करण)'
              }
              exploredKeys={exploredKeys}
              onInterpretClue={markExplored}
            />

            {/* Scenario selector */}
            <div className="flex flex-wrap gap-2">
              {karakScenarios.map((sc, idx) => {
                const selected = idx === karakIdx;
                const seen = exploredKeys.includes(`karak:${sc.id}`);
                return (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => {
                      setKarakIdx(idx);
                      setKarakTested(false);
                    }}
                    className={`px-3.5 py-2 rounded-xl border text-xs font-bold cursor-pointer transition-all inline-flex items-center gap-1.5 whitespace-nowrap ${
                      selected
                        ? 'bg-amber-400 text-slate-950 border-amber-300'
                        : seen
                        ? 'bg-emerald-950/60 text-emerald-200 border-emerald-500/40'
                        : 'bg-[#111827] text-slate-200 border-slate-700 hover:border-amber-400/50'
                    }`}
                  >
                    {seen && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                    <span>{sc.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Interactive Physics Stage */}
            <div className="rounded-2xl bg-[#111827] border border-slate-800 p-6 space-y-5">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-black text-white font-hindi">
                  “{activeKarakScenario.label}”
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  नीचे दिए गए बटन से देखें कि दोनों तत्वों के बीच ‘से’ केबल जुड़ा हुआ साधन है या टूटकर अलगाव पैदा कर रहा है।
                </p>
              </div>

              <div className="flex items-center justify-center gap-4 sm:gap-8 py-4">
                <div className="flex flex-col items-center gap-1.5 w-28 p-3 rounded-2xl bg-[#070B16] border border-slate-700">
                  <span className="text-3xl">{activeKarakScenario.node1Emoji}</span>
                  <span className="text-xs font-black text-slate-100 font-hindi">
                    {activeKarakScenario.node1Label}
                  </span>
                </div>

                <div className="flex-1 max-w-xs flex flex-col items-center gap-2">
                  {!karakTested ? (
                    <div className="w-full h-1.5 rounded-full bg-slate-700" />
                  ) : isApadan ? (
                    <div className="w-full flex items-center justify-center gap-3">
                      <div className="flex-1 h-1.5 rounded-full bg-rose-500" />
                      <Unlink2 className="w-6 h-6 text-rose-400 shrink-0" />
                      <div className="flex-1 h-1.5 rounded-full bg-rose-500" />
                    </div>
                  ) : (
                    <div className="w-full flex items-center justify-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-emerald-400" />
                      <Link2 className="w-6 h-6 text-emerald-400 shrink-0" />
                      <div className="flex-1 h-2 rounded-full bg-emerald-400" />
                    </div>
                  )}
                  <span className="text-xs font-black text-amber-300">
                    विभक्ति: ‘से’
                  </span>
                </div>

                <div
                  className={`flex flex-col items-center gap-1.5 w-28 p-3 rounded-2xl bg-[#070B16] border border-slate-700 transition-transform duration-500 ${
                    karakTested && isApadan ? 'translate-x-4 sm:translate-x-6' : ''
                  }`}
                >
                  <span className="text-3xl">{activeKarakScenario.node2Emoji}</span>
                  <span className="text-xs font-black text-slate-100 font-hindi">
                    {activeKarakScenario.node2Label}
                  </span>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setKarakTested(true);
                    markExplored(`karak:${activeKarakScenario.id}`);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black inline-flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Zap className="w-4 h-4" />
                  <span>
                    {karakTested
                      ? 'संबंध-परीक्षण सक्रिय है'
                      : '‘से’ बल व दूरी परीक्षण चलाएँ (Inspect Mechanism)'}
                  </span>
                </button>
              </div>

              {karakTested && (
                <div
                  className={`p-4 rounded-2xl border text-xs sm:text-sm space-y-1.5 ${
                    isApadan
                      ? 'bg-rose-950/40 border-rose-500/40 text-rose-100'
                      : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-100'
                  }`}
                >
                  <div className="font-black">
                    निष्कर्ष:{' '}
                    {isApadan
                      ? 'अपादान कारक (Separation — दूरी/अलगाव)'
                      : 'करण कारक (Instrument — कार्य का साधन)'}
                  </div>
                  <p className="font-hindi leading-relaxed">
                    {activeKarakScenario.successHindi}
                  </p>
                  {bilingualMode && (
                    <p className="text-xs opacity-80">
                      {activeKarakScenario.successEnglish}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* All 8 Karaks Explorer */}
            <div className="space-y-3">
              <div className="text-xs font-extrabold text-slate-300">
                सभी ८ कारकों की भूमिका परखें (Explore All 8 Case Markers):
              </div>
              <div className="flex flex-wrap gap-1.5">
                {KARAK_LIST.map((k: KarakData) => (
                  <button
                    key={k.name}
                    type="button"
                    onClick={() => {
                      setSelectedKarakInfo(k);
                      markExplored(`karak-all:${k.name}`);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer transition-colors ${
                      selectedKarakInfo.name === k.name
                        ? 'bg-amber-400 text-slate-950 border-amber-300'
                        : 'bg-[#111827] text-slate-200 border-slate-700 hover:border-amber-400/50'
                    }`}
                  >
                    {k.name} ({k.marker})
                  </button>
                ))}
              </div>
              <div className="p-4 rounded-2xl bg-[#111827] border border-slate-800 text-xs sm:text-sm space-y-1">
                <div className="font-black text-amber-300 font-hindi">
                  {selectedKarakInfo.name} · विभक्ति: {selectedKarakInfo.marker}
                </div>
                <div className="text-slate-200 font-hindi">
                  <strong>कार्यप्रणाली:</strong> {selectedKarakInfo.meaningHindi}
                </div>
                <div className="text-white font-bold font-hindi">
                  <strong>उदाहरण:</strong> “{selectedKarakInfo.exampleHindi}”
                </div>
                {bilingualMode && (
                  <div className="text-xs text-slate-400">
                    {selectedKarakInfo.meaningEnglish} — {selectedKarakInfo.exampleEnglish}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {renderUnlockFooter()}
      </div>
    );
  }

  // =========================================================================
  // RENDERER 4: VAKYA CLAUSE COUPLER & SPLIT-TEST LAB
  // =========================================================================
  if (moduleId === 'vakya' && activeVakya) {
    return (
      <div className="space-y-5">
        <div className="bg-[#0B1120] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden text-slate-100">
          <div className="bg-[#070B16] border-b border-slate-800 px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                {simMeta.uniqueSimNameHindi} · {simMeta.uniqueSimNameEnglish}
              </div>
              <h3 className="text-lg sm:text-xl font-black font-serif-display mt-0.5 text-white">
                उपवाक्यों को योजक से अलग करके देखें — कौन स्वतंत्र है और कौन आश्रित
              </h3>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setVakyaIdx((vakyaIdx - 1 + vakyaItems.length) % vakyaItems.length);
                  setVakyaSplitOpen(false);
                }}
                className="p-2 rounded-lg bg-[#111827] hover:bg-slate-800 border border-slate-700 text-white cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold tabular-nums px-2 text-amber-300">
                {vakyaIdx + 1} / {vakyaItems.length}
              </span>
              <button
                type="button"
                onClick={() => {
                  setVakyaIdx((vakyaIdx + 1) % vakyaItems.length);
                  setVakyaSplitOpen(false);
                }}
                className="p-2 rounded-lg bg-[#111827] hover:bg-slate-800 border border-slate-700 text-white cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-5 sm:p-7 space-y-6">
            <SimulationImageInterpreter
              visual={moduleVisual}
              bilingualMode={bilingualMode}
              activeLensZone={vakyaSplitOpen ? 'center' : 'full'}
              lensLabelHindi={
                vakyaSplitOpen
                  ? 'योजक पिन अलग हुई — उपवाक्यों की स्वतंत्रता देखें'
                  : 'दोनों डिब्बों को जोड़ने वाला योजक-बिंदु देखें'
              }
              exploredKeys={exploredKeys}
              onInterpretClue={markExplored}
            />

            <div className="rounded-2xl bg-[#111827] border border-slate-800 p-5 text-center space-y-2">
              <div className="text-xs font-bold text-amber-300 uppercase">
                प्रयोग वाक्य ({activeVakya.type})
              </div>
              <div className="text-xl sm:text-2xl font-black text-white font-hindi">
                “{activeVakya.sentenceHindi}”
              </div>
              {bilingualMode && (
                <div className="text-xs text-slate-400">{activeVakya.sentenceEnglish}</div>
              )}
            </div>

            {/* Clause Bogies Visualization */}
            <div
              className={`flex flex-col md:flex-row items-stretch justify-center transition-all duration-500 ${
                vakyaSplitOpen ? 'gap-6' : 'gap-2'
              }`}
            >
              {activeVakya.clauses.map((cl, i) => (
                <React.Fragment key={i}>
                  <div
                    className={`flex-1 p-4 rounded-2xl border-2 transition-all space-y-1.5 ${
                      cl.isIndependent
                        ? 'bg-emerald-950/35 border-emerald-500/45'
                        : 'bg-amber-500/10 border-amber-400/40'
                    }`}
                  >
                    <div
                      className={`text-[11px] font-black uppercase tracking-wide ${
                        cl.isIndependent ? 'text-emerald-300' : 'text-amber-300'
                      }`}
                    >
                      {cl.isIndependent
                        ? 'स्वतंत्र / प्रधान उपवाक्य (Complete Alone)'
                        : 'आश्रित उपवाक्य (Incomplete Alone)'}
                    </div>
                    <div className="text-base font-black text-white font-hindi">
                      {cl.text}
                    </div>
                    {vakyaSplitOpen && (
                      <div className="text-xs font-semibold text-slate-300 pt-1.5 border-t border-white/10 font-hindi">
                        {cl.isIndependent
                          ? 'अकेले पढ़ने पर इसका पूरा अर्थ स्पष्ट है।'
                          : 'अकेले पढ़ने पर अर्थ अधूरा रहता है — यह प्रधान उपवाक्य पर टिका है।'}
                      </div>
                    )}
                  </div>

                  {i < activeVakya.clauses.length - 1 && (
                    <div className="flex items-center justify-center shrink-0">
                      <div
                        className={`px-3 py-2 rounded-xl font-black text-xs border transition-all ${
                          vakyaSplitOpen
                            ? 'bg-rose-950/60 text-rose-200 border-rose-500/50'
                            : 'bg-amber-500/15 text-amber-200 border-amber-400/40'
                        }`}
                      >
                        योजक: {activeVakya.connectors.join(' / ') || '—'}
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => {
                  setVakyaSplitOpen((prev) => !prev);
                  markExplored(`vakya:${vakyaIdx}`);
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black inline-flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Scissors className="w-4 h-4" />
                <span>
                  {vakyaSplitOpen
                    ? 'उपवाक्यों को पुनः जोड़ें (Re-Couple Clauses)'
                    : 'योजक से काटकर स्वतंत्रता जाँचें (Run Split Test)'}
                </span>
              </button>
            </div>

            {vakyaSplitOpen && (
              <div className="p-4 rounded-2xl bg-[#111827] border border-indigo-400/35 text-xs sm:text-sm space-y-1">
                <div className="font-black text-amber-300">
                  संरचना-तर्क ({activeVakya.type}):
                </div>
                <p className="text-slate-100 font-hindi leading-relaxed">
                  {activeVakya.explanationHindi}
                </p>
                {bilingualMode && (
                  <p className="text-xs text-slate-400">{activeVakya.explanationEnglish}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {renderUnlockFooter()}
      </div>
    );
  }

  // =========================================================================
  // RENDERER 5: VACHYA STAGE SPOTLIGHT & AGREEMENT ENGINE
  // =========================================================================
  if (moduleId === 'vachya' && activeVachya) {
    return (
      <div className="space-y-5">
        <div className="bg-[#0B1120] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden text-slate-100">
          <div className="bg-[#070B16] border-b border-slate-800 px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                {simMeta.uniqueSimNameHindi} · {simMeta.uniqueSimNameEnglish}
              </div>
              <h3 className="text-lg sm:text-xl font-black font-serif-display mt-0.5 text-white">
                स्पॉटलाइट घुमाएँ और देखें क्रिया किसके अनुसार बदलती है
              </h3>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() =>
                  setVachyaIdx((vachyaIdx - 1 + vachyaItems.length) % vachyaItems.length)
                }
                className="p-2 rounded-lg bg-[#111827] hover:bg-slate-800 border border-slate-700 text-white cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold tabular-nums px-2 text-amber-300">
                {vachyaIdx + 1} / {vachyaItems.length}
              </span>
              <button
                type="button"
                onClick={() => setVachyaIdx((vachyaIdx + 1) % vachyaItems.length)}
                className="p-2 rounded-lg bg-[#111827] hover:bg-slate-800 border border-slate-700 text-white cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-5 sm:p-7 space-y-6">
            <SimulationImageInterpreter
              visual={moduleVisual}
              bilingualMode={bilingualMode}
              activeLensZone={
                vachyaFocus === 'kartri'
                  ? 'left'
                  : vachyaFocus === 'karm'
                  ? 'center'
                  : 'right'
              }
              lensLabelHindi={
                vachyaFocus === 'kartri'
                  ? 'स्पॉटलाइट बाएँ: कर्ता मंच पर (कर्तृवाच्य)'
                  : vachyaFocus === 'karm'
                  ? 'स्पॉटलाइट मध्य: कर्म मुख्य (कर्मवाच्य)'
                  : 'स्पॉटलाइट दाएँ: अकर्मक भाव (भाववाच्य)'
              }
              exploredKeys={exploredKeys}
              onInterpretClue={markExplored}
            />

            {/* Spotlight Focus Buttons */}
            <div className="grid sm:grid-cols-3 gap-2.5">
              {(
                [
                  { id: 'kartri', label: '१. कर्तृवाच्य (कर्ता प्रधान)', sub: 'Verb follows Subject' },
                  {
                    id: 'karm',
                    label: '२. कर्मवाच्य (कर्म प्रधान)',
                    sub: 'Verb follows Object + के द्वारा',
                  },
                  {
                    id: 'bhav',
                    label: '३. भाववाच्य (भाव प्रधान)',
                    sub: 'Intransitive · Masculine Singular',
                  },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setVachyaFocus(tab.id);
                    markExplored(`vachya:${vachyaIdx}:${tab.id}`);
                  }}
                  className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                    vachyaFocus === tab.id
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg'
                      : 'bg-[#111827] text-slate-200 border-slate-800 hover:border-amber-400/50'
                  }`}
                >
                  <div className="text-xs sm:text-sm font-black">{tab.label}</div>
                  <div
                    className={`text-[11px] mt-0.5 ${
                      vachyaFocus === tab.id ? 'text-slate-800 font-semibold' : 'text-slate-400'
                    }`}
                  >
                    {tab.sub}
                  </div>
                </button>
              ))}
            </div>

            {/* Stage Spotlight Panel */}
            <div className="rounded-2xl bg-[#070B16] border border-slate-800 p-6 space-y-4">
              <div className="flex items-center justify-between text-xs text-amber-300 font-bold">
                <span className="inline-flex items-center gap-1.5">
                  <Sun className="w-4 h-4" />
                  <span>
                    स्पॉटलाइट केंद्र:{' '}
                    {vachyaFocus === 'kartri'
                      ? `कर्ता (${activeVachya.subject})`
                      : vachyaFocus === 'karm'
                      ? `कर्म (${activeVachya.object})`
                      : 'क्रिया का भाव (अकर्मक — कोई कर्म नहीं)'}
                  </span>
                </span>
                <span className="text-slate-400">काल (Tense) अपरिवर्तित</span>
              </div>

              {vachyaFocus !== 'bhav' ? (
                <>
                  <div className="grid sm:grid-cols-3 gap-3 text-center">
                    <div
                      className={`p-4 rounded-xl border transition-all ${
                        vachyaFocus === 'kartri'
                          ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                          : 'bg-[#111827] text-slate-300 border-slate-800'
                      }`}
                    >
                      <div className="text-[10px] font-bold uppercase opacity-75">
                        कर्ता (Subject)
                      </div>
                      <div className="text-lg font-black font-hindi mt-1">
                        {activeVachya.subject}
                        {vachyaFocus === 'karm' ? ` ${activeVachya.connector}` : ''}
                      </div>
                    </div>
                    <div
                      className={`p-4 rounded-xl border transition-all ${
                        vachyaFocus === 'karm'
                          ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                          : 'bg-[#111827] text-slate-300 border-slate-800'
                      }`}
                    >
                      <div className="text-[10px] font-bold uppercase opacity-75">
                        कर्म (Object)
                      </div>
                      <div className="text-lg font-black font-hindi mt-1">
                        {activeVachya.object}
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-400/40">
                      <div className="text-[10px] font-bold uppercase text-emerald-300">
                        क्रिया (Verb)
                      </div>
                      <div className="text-lg font-black font-hindi mt-1 text-white">
                        {vachyaFocus === 'kartri'
                          ? activeVachya.verbActive
                          : activeVachya.verbPassive}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 text-center space-y-1">
                    <div className="text-xl sm:text-2xl font-black font-hindi text-white">
                      “
                      {vachyaFocus === 'kartri'
                        ? activeVachya.kartriHindi
                        : activeVachya.karmHindi}
                      ”
                    </div>
                    {bilingualMode && (
                      <div className="text-xs text-slate-400">
                        {vachyaFocus === 'kartri'
                          ? activeVachya.kartriEnglish
                          : activeVachya.karmEnglish}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="space-y-3 text-center py-2">
                  <div className="text-xl sm:text-2xl font-black font-hindi text-amber-300">
                    “{activeVachya.subject} से अब और चला नहीं जाता।”
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto font-hindi leading-relaxed">
                    भाववाच्य केवल <strong>अकर्मक क्रिया</strong> (चलना, सोना, हँसना, बैठना) से बनता है। इसमें कोई कर्म नहीं होता, इसलिए क्रिया सदैव{' '}
                    <strong>पुल्लिंग, एकवचन और अन्य पुरुष</strong> (‘जाता है’) में स्थिर रहती है।
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-[#111827] border border-slate-800 text-xs sm:text-sm font-hindi text-slate-200 leading-relaxed">
              <strong className="text-amber-300">कार्यप्रणाली तर्क: </strong>
              {vachyaFocus === 'kartri'
                ? `यहाँ स्पॉटलाइट कर्ता (‘${activeVachya.subject}’) पर है, इसलिए क्रिया (‘${activeVachya.verbActive}’) सीधे कर्ता के लिंग-वचन का पालन करती है।`
                : vachyaFocus === 'karm'
                ? `कर्ता के साथ ‘${activeVachya.connector}’ जुड़ते ही स्पॉटलाइट कर्म (‘${activeVachya.object}’) पर चली जाती है और क्रिया ‘जाना’ के रूप (‘${activeVachya.verbPassive}’) के साथ कर्म का अनुसरण करती है।`
                : 'अकर्मक क्रिया में कर्म अनुपस्थित होने के कारण असमर्थता या भाव ही मुख्य विषय बन जाता है।'}
            </div>
          </div>
        </div>

        {renderUnlockFooter()}
      </div>
    );
  }

  // =========================================================================
  // RENDERER 6: UPSARG-PRATYAY MAGNETIC WORD ASSEMBLER
  // =========================================================================
  if (moduleId === 'upsarg-pratyay' && activeAffix) {
    const isPrefix = activeAffix.kind.includes('उपसर्ग');
    return (
      <div className="space-y-5">
        <div className="bg-[#0B1120] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden text-slate-100">
          <div className="bg-[#070B16] border-b border-slate-800 px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                {simMeta.uniqueSimNameHindi} · {simMeta.uniqueSimNameEnglish}
              </div>
              <h3 className="text-lg sm:text-xl font-black font-serif-display mt-0.5 text-white">
                शब्दांश जोड़कर अर्थ और मात्रा का रूपांतरण प्रत्यक्ष देखें
              </h3>
            </div>
            {onNavigateToUpsarg && (
              <button
                type="button"
                onClick={onNavigateToUpsarg}
                className="px-3.5 py-2 rounded-xl bg-[#111827] hover:bg-slate-800 border border-amber-400/35 text-amber-300 text-xs font-bold cursor-pointer whitespace-nowrap"
              >
                पूर्ण उपसर्ग-प्रत्यय स्टूडियो →
              </button>
            )}
          </div>

          <div className="p-5 sm:p-7 space-y-6">
            <SimulationImageInterpreter
              visual={moduleVisual}
              bilingualMode={bilingualMode}
              activeLensZone={affixMerged ? 'center' : isPrefix ? 'left' : 'right'}
              lensLabelHindi={
                affixMerged
                  ? 'निर्मित शब्द-फल केंद्र में खिल उठा'
                  : isPrefix
                  ? 'उपसर्ग: मूल शब्द से पहले जुड़ता है'
                  : 'प्रत्यय: मूल शब्द के अंत में जुड़ता है'
              }
              exploredKeys={exploredKeys}
              onInterpretClue={markExplored}
            />

            <div className="flex flex-wrap gap-2">
              {affixItems.map((item, idx) => {
                const seen = exploredKeys.includes(`affix:${item.id}`);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setAffixIdx(idx);
                      setAffixMerged(false);
                    }}
                    className={`px-3 py-2 rounded-xl border text-xs font-bold cursor-pointer inline-flex items-center gap-1.5 ${
                      idx === affixIdx
                        ? 'bg-amber-400 text-slate-950 border-amber-300'
                        : seen
                        ? 'bg-emerald-950/60 text-emerald-200 border-emerald-500/40'
                        : 'bg-[#111827] text-slate-200 border-slate-700 hover:border-amber-400/50'
                    }`}
                  >
                    {seen && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                    <span>{item.combinedWord}</span>
                  </button>
                );
              })}
            </div>

            <div className="rounded-2xl bg-[#111827] border border-slate-800 p-6 text-center space-y-5">
              <div className="text-xs font-extrabold text-amber-300 uppercase">
                {activeAffix.kind} ·{' '}
                {isPrefix
                  ? 'मूल शब्द के आगे (बाएँ) जुड़ता है'
                  : 'मूल शब्द के पीछे (दाएँ) जुड़ता है'}
              </div>

              {!affixMerged ? (
                <div className="flex items-center justify-center gap-3 sm:gap-5 flex-wrap">
                  {isPrefix ? (
                    <>
                      <div className="px-5 py-3.5 rounded-2xl bg-amber-500/15 border-2 border-amber-400/50">
                        <div className="text-[10px] font-bold text-amber-300">उपसर्ग</div>
                        <div className="text-2xl font-black text-amber-200 font-hindi">
                          {activeAffix.affix}
                        </div>
                      </div>
                      <span className="text-2xl font-black text-slate-400">+</span>
                      <div className="px-5 py-3.5 rounded-2xl bg-[#070B16] border-2 border-indigo-400/50">
                        <div className="text-[10px] font-bold text-indigo-300">
                          सार्थक मूल शब्द
                        </div>
                        <div className="text-2xl font-black text-white font-hindi">
                          {activeAffix.rootWord}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="px-5 py-3.5 rounded-2xl bg-[#070B16] border-2 border-indigo-400/50">
                        <div className="text-[10px] font-bold text-indigo-300">
                          सार्थक मूल शब्द
                        </div>
                        <div className="text-2xl font-black text-white font-hindi">
                          {activeAffix.rootWord}
                        </div>
                      </div>
                      <span className="text-2xl font-black text-slate-400">+</span>
                      <div className="px-5 py-3.5 rounded-2xl bg-amber-500/15 border-2 border-amber-400/50">
                        <div className="text-[10px] font-bold text-amber-300">प्रत्यय</div>
                        <div className="text-2xl font-black text-amber-200 font-hindi">
                          {activeAffix.affix}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="inline-block px-7 py-4 rounded-2xl bg-[#070B16] border-2 border-emerald-400/60 text-white shadow-lg">
                    <div className="text-[10px] font-bold text-amber-300 uppercase">
                      निर्मित शब्द
                    </div>
                    <div className="text-3xl sm:text-4xl font-black font-hindi mt-0.5">
                      {activeAffix.combinedWord}
                    </div>
                  </div>
                  <div className="max-w-xl mx-auto p-4 rounded-xl bg-emerald-950/35 border border-emerald-500/35 text-left space-y-1 text-xs sm:text-sm font-hindi">
                    <div className="font-black text-emerald-200">
                      अर्थ: {activeAffix.meaningHindi}
                    </div>
                    {bilingualMode && (
                      <div className="text-xs text-slate-400">
                        {activeAffix.meaningEnglish}
                      </div>
                    )}
                    <div className="text-slate-200 pt-1">
                      वाक्य: “{activeAffix.exampleHindi}”
                    </div>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  setAffixMerged((prev) => !prev);
                  markExplored(`affix:${activeAffix.id}`);
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black cursor-pointer transition-colors"
              >
                {affixMerged
                  ? 'पुनः विच्छेद करें (Disassemble)'
                  : 'शब्दांश जोड़कर परिणाम देखें (Snap & Fuse)'}
              </button>
            </div>
          </div>
        </div>

        {renderUnlockFooter()}
      </div>
    );
  }

  // =========================================================================
  // RENDERER 7: SANDHI PHONETIC COLLISION SLIDER LAB
  // =========================================================================
  if (moduleId === 'sandhi' && activeSandhi) {
    const fused = sandhiFusion >= 75;
    return (
      <div className="space-y-5">
        <div className="bg-[#0B1120] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden text-slate-100">
          <div className="bg-[#070B16] border-b border-slate-800 px-6 py-5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
              {simMeta.uniqueSimNameHindi} · {simMeta.uniqueSimNameEnglish}
            </div>
            <h3 className="text-lg sm:text-xl font-black font-serif-display mt-0.5 text-white">
              स्लाइडर खिसकाकर दो सीमांत ध्वनियों का संधि-मेल देखें
            </h3>
          </div>

          <div className="p-5 sm:p-7 space-y-6">
            <SimulationImageInterpreter
              visual={moduleVisual}
              bilingualMode={bilingualMode}
              activeLensZone={fused ? 'center' : 'full'}
              lensLabelHindi={
                fused
                  ? 'केंद्र में दोनों ध्वनियों का स्वर्णिम संलयन (संधि-विकार)'
                  : 'स्लाइडर बढ़ाकर ध्वनि-टकराव देखें'
              }
              exploredKeys={exploredKeys}
              onInterpretClue={markExplored}
            />

            <div className="flex flex-wrap gap-2">
              {sandhiItems.map((sd, idx) => {
                const seen = exploredKeys.includes(`sandhi:${sd.id}`);
                return (
                  <button
                    key={sd.id}
                    type="button"
                    onClick={() => {
                      setSandhiIdx(idx);
                      setSandhiFusion(0);
                    }}
                    className={`px-3 py-2 rounded-xl border text-xs font-bold cursor-pointer inline-flex items-center gap-1.5 ${
                      idx === sandhiIdx
                        ? 'bg-amber-400 text-slate-950 border-amber-300'
                        : seen
                        ? 'bg-emerald-950/60 text-emerald-200 border-emerald-500/40'
                        : 'bg-[#111827] text-slate-200 border-slate-700 hover:border-amber-400/50'
                    }`}
                  >
                    {seen && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                    <span>
                      {sd.part1} + {sd.part2}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="rounded-2xl bg-[#111827] border border-slate-800 p-6 space-y-5">
              <div className="text-center text-xs font-extrabold text-amber-300">
                {activeSandhi.sandhiType}
              </div>

              <div className="flex items-center justify-center min-h-[96px]">
                {fused ? (
                  <div className="px-7 py-4 rounded-2xl bg-[#070B16] border-2 border-emerald-400/60 text-white text-center shadow-lg">
                    <div className="text-[10px] font-bold text-amber-300 uppercase">
                      संधि-युक्त शब्द
                    </div>
                    <div className="text-3xl sm:text-4xl font-black font-hindi mt-0.5">
                      {activeSandhi.result}
                    </div>
                  </div>
                ) : (
                  <div
                    className="flex items-center justify-center transition-all duration-150"
                    style={{
                      gap: `${Math.max(4, Math.round((100 - sandhiFusion) * 0.45))}px`,
                    }}
                  >
                    <div className="px-5 py-3.5 rounded-2xl bg-[#070B16] border-2 border-indigo-400/50 text-2xl font-black text-white font-hindi">
                      {activeSandhi.part1}
                    </div>
                    <span className="text-xl font-black text-amber-400">+</span>
                    <div className="px-5 py-3.5 rounded-2xl bg-[#070B16] border-2 border-amber-400/50 text-2xl font-black text-white font-hindi">
                      {activeSandhi.part2}
                    </div>
                  </div>
                )}
              </div>

              <div className="max-w-md mx-auto space-y-2">
                <div className="flex justify-between text-[11px] font-bold text-slate-400">
                  <span>विच्छेद (0%)</span>
                  <span className="text-amber-300 tabular-nums">
                    ध्वनि-मेल: {sandhiFusion}%
                  </span>
                  <span>पूर्ण संधि (100%)</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={sandhiFusion}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setSandhiFusion(val);
                    if (val >= 75) {
                      markExplored(`sandhi:${activeSandhi.id}`);
                    }
                  }}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="flex justify-center pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      const nextVal = fused ? 0 : 100;
                      setSandhiFusion(nextVal);
                      if (nextVal === 100) markExplored(`sandhi:${activeSandhi.id}`);
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black cursor-pointer"
                  >
                    {fused ? 'पुनः विच्छेद करें' : 'ध्वनि टक्कर चलाएँ (Fuse Now)'}
                  </button>
                </div>
              </div>

              {fused && (
                <div className="p-4 rounded-xl bg-emerald-950/35 border border-emerald-500/35 text-xs sm:text-sm font-hindi space-y-1">
                  <div className="font-black text-emerald-200">
                    ध्वनि-परिवर्तन सूत्र: {activeSandhi.ruleHindi}
                  </div>
                  {bilingualMode && (
                    <div className="text-xs text-slate-400">{activeSandhi.ruleEnglish}</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {renderUnlockFooter()}
      </div>
    );
  }

  // =========================================================================
  // RENDERER 8: SAMAS COMPRESSION & DOMINANCE LAB
  // =========================================================================
  if (moduleId === 'samas' && activeSamas) {
    return (
      <div className="space-y-5">
        <div className="bg-[#0B1120] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden text-slate-100">
          <div className="bg-[#070B16] border-b border-slate-800 px-6 py-5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
              {simMeta.uniqueSimNameHindi} · {simMeta.uniqueSimNameEnglish}
            </div>
            <h3 className="text-lg sm:text-xl font-black font-serif-display mt-0.5 text-white">
              समस्तपद को खोलकर (विग्रह) छिपे योजक और प्रधान पद को देखें
            </h3>
          </div>

          <div className="p-5 sm:p-7 space-y-6">
            <SimulationImageInterpreter
              visual={moduleVisual}
              bilingualMode={bilingualMode}
              activeLensZone={samasExpanded ? 'right' : 'left'}
              lensLabelHindi={
                samasExpanded
                  ? 'आवर्धक लेंस: समास-विग्रह में छिपा अर्थ खुला'
                  : 'संकुचित समस्तपद पर आवर्धक लेंस लगाएँ'
              }
              exploredKeys={exploredKeys}
              onInterpretClue={markExplored}
            />

            <div className="flex flex-wrap gap-2">
              {samasItems.map((sm, idx) => {
                const seen = exploredKeys.includes(`samas:${sm.id}`);
                return (
                  <button
                    key={sm.id}
                    type="button"
                    onClick={() => {
                      setSamasIdx(idx);
                      setSamasExpanded(false);
                    }}
                    className={`px-3 py-2 rounded-xl border text-xs font-bold cursor-pointer inline-flex items-center gap-1.5 ${
                      idx === samasIdx
                        ? 'bg-amber-400 text-slate-950 border-amber-300'
                        : seen
                        ? 'bg-emerald-950/60 text-emerald-200 border-emerald-500/40'
                        : 'bg-[#111827] text-slate-200 border-slate-700 hover:border-amber-400/50'
                    }`}
                  >
                    {seen && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                    <span>{sm.word}</span>
                  </button>
                );
              })}
            </div>

            <div className="rounded-2xl bg-[#111827] border border-slate-800 p-6 text-center space-y-5">
              {!samasExpanded ? (
                <div className="inline-block px-7 py-4 rounded-2xl bg-[#070B16] border-2 border-amber-400/40 text-white shadow-lg">
                  <div className="text-[10px] font-bold text-amber-300 uppercase">
                    समस्तपद (Compressed Compound)
                  </div>
                  <div className="text-3xl font-black font-hindi mt-1">
                    {activeSamas.word}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="inline-block px-7 py-4 rounded-2xl bg-indigo-950/70 border-2 border-indigo-400/50 text-white shadow-lg">
                    <div className="text-[10px] font-bold text-amber-300 uppercase">
                      समास-विग्रह (Expanded Meaning)
                    </div>
                    <div className="text-2xl sm:text-3xl font-black font-hindi mt-1">
                      {activeSamas.vigraha}
                    </div>
                  </div>
                  <div className="max-w-xl mx-auto p-4 rounded-xl bg-emerald-950/35 border border-emerald-500/35 text-left space-y-1 text-xs sm:text-sm font-hindi">
                    <div className="font-black text-emerald-200">
                      समास भेद: {activeSamas.samasType}
                    </div>
                    <div className="text-slate-100">{activeSamas.hintHindi}</div>
                    {bilingualMode && (
                      <div className="text-xs text-slate-400">
                        {activeSamas.hintEnglish}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div>
                <button
                  type="button"
                  onClick={() => {
                    setSamasExpanded((prev) => !prev);
                    markExplored(`samas:${activeSamas.id}`);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black cursor-pointer inline-flex items-center gap-2"
                >
                  <Layers className="w-4 h-4" />
                  <span>
                    {samasExpanded
                      ? 'वापस समस्तपद बनाएँ (Compress)'
                      : 'विग्रह खोलकर तर्क देखें (Expand & Inspect)'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {renderUnlockFooter()}
      </div>
    );
  }

  // =========================================================================
  // RENDERER 9: UNIVERSAL INTERACTIVE CONCEPT MECHANISM LAB (20+ Class Modules)
  // =========================================================================
  const fallbackSpecimens: ClassifierSimItem[] =
    classifierItems.length > 0
      ? classifierItems
      : moduleObj.rulesSummary.map((r, i) => ({
          id: `${moduleId}_rule_${i}`,
          wordOrSentence: r.exampleHindi,
          highlight: r.exampleHindi,
          category: r.ruleHindi,
          explanationHindi: r.ruleHindi,
          explanationEnglish: r.ruleEnglish,
        }));

  const currentItem =
    activeSpecimen || fallbackSpecimens[specimenIdx % Math.max(1, fallbackSpecimens.length)];

  const parsedSpecimen = currentItem
    ? sanitizeSpecimenForMechanism(
        currentItem.wordOrSentence,
        currentItem.category,
        currentItem.correctOption,
        currentItem.highlight
      )
    : null;

  const matchedKeyword =
    cheatNote.keywords[specimenIdx % Math.max(1, cheatNote.keywords.length)];

  return (
    <div className="space-y-5">
      <div className="bg-[#0B1120] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden text-slate-100">
        <div className="bg-[#070B16] border-b border-slate-800 px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
              {simMeta.uniqueSimNameHindi} · {simMeta.uniqueSimNameEnglish}
            </div>
            <h3 className="text-lg sm:text-xl font-black font-serif-display mt-0.5 text-white">
              {cheatNote.diagnosticTestLabelHindi}
            </h3>
            {bilingualMode && (
              <p className="text-xs text-slate-400 mt-0.5">
                {cheatNote.diagnosticTestLabelEnglish}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setSpecimenIdx(
                  (specimenIdx - 1 + fallbackSpecimens.length) % fallbackSpecimens.length
                );
                setDiagnosticRevealed(false);
              }}
              className="p-2 rounded-lg bg-[#111827] hover:bg-slate-800 border border-slate-700 text-white cursor-pointer"
              aria-label="पिछला उदाहरण"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold tabular-nums px-2 text-amber-300">
              {specimenIdx + 1} / {fallbackSpecimens.length}
            </span>
            <button
              type="button"
              onClick={() => {
                setSpecimenIdx((specimenIdx + 1) % fallbackSpecimens.length);
                setDiagnosticRevealed(false);
              }}
              className="p-2 rounded-lg bg-[#111827] hover:bg-slate-800 border border-slate-700 text-white cursor-pointer"
              aria-label="अगला उदाहरण"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-7 space-y-6">
          {/* Interactive Picture-Interpretation Canvas for this Chapter */}
          <SimulationImageInterpreter
            visual={moduleVisual}
            bilingualMode={bilingualMode}
            activeLensZone={diagnosticRevealed ? 'center' : 'full'}
            lensLabelHindi={
              diagnosticRevealed
                ? 'नियम-विश्लेषण सक्रिय · दृश्य संकेत मिलाएँ'
                : 'चित्र के संकेत-बिंदुओं पर क्लिक कर अवधारणा समझें'
            }
            exploredKeys={exploredKeys}
            onInterpretClue={markExplored}
          />

          {/* Secondary Visual Reference + Core Mechanism Strip */}
          <div className="grid md:grid-cols-[180px_1fr] gap-4 items-center p-4 rounded-2xl bg-[#111827] border border-slate-800">
            <div className="relative h-24 rounded-xl overflow-hidden border border-slate-700 bg-[#060913]">
              <img
                src={moduleVisual.secondaryImageUrl}
                alt={moduleVisual.imageAlt}
                className="w-full h-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060913]/90 via-transparent to-transparent" />
              <div className="absolute bottom-1.5 left-2 right-2 text-[10px] font-bold text-amber-300 flex items-center gap-1">
                <ImageIcon className="w-3 h-3 shrink-0" />
                <span className="truncate">दृश्य संदर्भ पट्टिका</span>
              </div>
            </div>
            <div className="text-xs sm:text-sm space-y-1">
              <div className="font-black text-amber-300 font-hindi">
                मूल कार्यप्रणाली (Core Mechanism):{' '}
                <span className="text-white font-semibold">{cheatNote.coreIdeaHindi}</span>
              </div>
              {bilingualMode && (
                <div className="text-xs text-slate-400">{cheatNote.coreIdeaEnglish}</div>
              )}
            </div>
          </div>

          {/* Specimen Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {fallbackSpecimens.map((sp, idx) => {
              const seen = exploredKeys.includes(`spec:${sp.id}`);
              return (
                <button
                  key={sp.id}
                  type="button"
                  onClick={() => {
                    setSpecimenIdx(idx);
                    setDiagnosticRevealed(false);
                  }}
                  className={`px-3 py-2 rounded-xl border text-xs font-bold cursor-pointer whitespace-nowrap inline-flex items-center gap-1.5 ${
                    idx === specimenIdx
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm'
                      : seen
                      ? 'bg-emerald-950/60 text-emerald-200 border-emerald-500/40'
                      : 'bg-[#111827] text-slate-200 border-slate-700 hover:border-amber-400/50'
                  }`}
                >
                  {seen && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                  <span>प्रयोग {idx + 1}</span>
                </button>
              );
            })}
          </div>

          {/* Interactive Mechanism Specimen Workbench (Zero Quiz Options — Pure Mechanism & Reasoning) */}
          {currentItem && parsedSpecimen && (
            <div className="rounded-2xl bg-[#111827] border border-slate-800 p-5 sm:p-6 space-y-5">
              {/* Stage Display */}
              <div className="text-center space-y-3">
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300">
                  {simMeta.mechanismTagHindi} · प्रयोग {specimenIdx + 1}
                </div>

                {parsedSpecimen.isTransformation ? (
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5">
                    <div className="px-5 py-3.5 rounded-2xl bg-[#070B16] border-2 border-slate-700">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">
                        मूल रूप (Input)
                      </div>
                      <div className="text-xl sm:text-2xl font-black text-white font-hindi mt-0.5">
                        {parsedSpecimen.beforeForm}
                      </div>
                    </div>

                    <div className="px-3 py-1.5 rounded-full bg-amber-500/15 text-amber-300 text-xs font-black border border-amber-400/35">
                      {diagnosticRevealed ? 'नियम लागू ──▶' : 'प्रक्रिया जाँचें →'}
                    </div>

                    <div
                      className={`px-5 py-3.5 rounded-2xl border-2 transition-all ${
                        diagnosticRevealed
                          ? 'bg-emerald-950/50 text-white border-emerald-400 shadow-md'
                          : 'bg-[#070B16]/70 text-slate-500 border-dashed border-slate-700'
                      }`}
                    >
                      <div
                        className={`text-[10px] font-bold uppercase ${
                          diagnosticRevealed ? 'text-emerald-300' : 'text-slate-500'
                        }`}
                      >
                        {diagnosticRevealed
                          ? 'रूपांतरित परिणाम (Output)'
                          : 'परिणाम जानने हेतु नीचे क्लिक करें'}
                      </div>
                      <div className="text-xl sm:text-2xl font-black font-hindi mt-0.5">
                        {diagnosticRevealed ? parsedSpecimen.afterForm : '• • •'}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="max-w-2xl mx-auto p-5 rounded-2xl bg-[#070B16] border border-slate-800 space-y-2.5">
                    <div className="text-xl sm:text-2xl font-black text-white font-hindi leading-snug">
                      “{parsedSpecimen.displaySpecimen}”
                    </div>
                    {currentItem.highlight && (
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-500/15 border border-amber-400/35 text-xs font-black text-amber-200 font-hindi">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>मुख्य संकेत / केंद्र अंश: {currentItem.highlight}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Probe Button */}
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setDiagnosticRevealed(true);
                    markExplored(`spec:${currentItem.id}`);
                  }}
                  className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-black inline-flex items-center gap-2 cursor-pointer transition-colors ${
                    diagnosticRevealed
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md'
                  }`}
                >
                  <Eye className="w-4 h-4 shrink-0" />
                  <span>
                    {diagnosticRevealed
                      ? 'तर्क व कार्यप्रणाली खुली है (अन्य प्रयोग भी परखें)'
                      : simMeta.probeActionHindi}
                  </span>
                </button>
              </div>

              {/* Detailed Mechanism & Reasoning Breakdown */}
              {diagnosticRevealed && (
                <div className="grid md:grid-cols-3 gap-3.5 pt-2 animate-in fade-in duration-200">
                  <div className="p-4 rounded-xl bg-emerald-950/35 border border-emerald-500/35 space-y-1.5">
                    <div className="text-[11px] font-black text-emerald-300 uppercase tracking-wide">
                      १. व्याकरणिक निष्कर्ष / नियम
                    </div>
                    <div className="text-sm sm:text-base font-black text-emerald-100 font-hindi">
                      {parsedSpecimen.ruleHeadline || currentItem.category}
                    </div>
                    {parsedSpecimen.isTransformation && currentItem.highlight && (
                      <div className="text-[11px] text-emerald-200/80 font-semibold font-hindi">
                        सूत्र संकेत: {currentItem.highlight}
                      </div>
                    )}
                  </div>

                  <div className="p-4 rounded-xl bg-[#070B16] border border-slate-800 space-y-1.5 md:col-span-2">
                    <div className="text-[11px] font-black text-amber-300 uppercase tracking-wide">
                      २. तार्किक कारण — ऐसा क्यों होता है? (Mechanism &amp; Reasoning)
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-100 font-hindi leading-relaxed tracking-[0.01em]">
                      {currentItem.explanationHindi}
                    </p>
                    {bilingualMode && currentItem.explanationEnglish && (
                      <p className="text-xs text-slate-400">
                        {currentItem.explanationEnglish}
                      </p>
                    )}
                    {matchedKeyword && (
                      <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] font-bold text-amber-200 bg-amber-500/10 px-3 py-1.5 rounded-lg font-hindi">
                        चीट-कोड संकेत:{' '}
                        <span className="font-black text-amber-300">
                          {matchedKeyword.keyword}
                        </span>{' '}
                        → {matchedKeyword.identifies}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {renderUnlockFooter()}
    </div>
  );
};
