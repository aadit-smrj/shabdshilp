import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Send,
  Loader2,
  Check,
  PlusCircle,
  HelpCircle,
  Lightbulb,
  BookOpen,
  ArrowRight,
  MessageSquare,
  Wand2,
  Smile,
  RefreshCw,
  Zap,
  CheckCircle2,
  X,
  Cpu
} from 'lucide-react';
import { GradeLevel } from '../types';

export const QUICK_DOUBT_CHIPS = [
  { label: '🎯 करण vs अपादान में अंतर', query: 'कारक में करण और अपादान के "से" में क्या अंतर है? उदाहरण सहित समझाइए।' },
  { label: '🚆 सरल, संयुक्त व मिश्र वाक्य', query: 'सरल, संयुक्त और मिश्र वाक्य को पहचानने और रूपांतरित करने का नियम क्या है?' },
  { label: '🎭 कर्तृवाच्य ↔ कर्मवाच्य', query: 'कर्तृवाच्य को कर्मवाच्य में बदलने का सटीक नियम और सूत्र क्या है?' },
  { label: '⏳ हेतुहेतुमद् भूतकाल', query: 'हेतुहेतुमद् भूतकाल और सामान्य भूतकाल में क्या अंतर है?' },
  { label: '🧩 उपसर्ग-प्रत्यय विग्रह', query: 'मूल शब्द और उपसर्ग-प्रत्यय का सटीक विच्छेद कैसे किया जाता है?' },
  { label: '📜 अपठित गद्यांश तकनीक', query: 'अपठित गद्यांश का सटीक शीर्षक और मुख्य भाव कैसे निकाला जाता है?' },
  { label: '✨ मुहावरा प्रयोग', query: "'दाँतों तले उँगली दबाना' और 'फूला न समाना' का अर्थ व वाक्य बताएं।" },
  { label: '🔤 संधि vs समास', query: 'संधि और समास में मुख्य अंतर क्या होता है?' }
];

export interface ShabdSahyogProps {
  storyContext?: string;
  characterName?: string;
  genre?: string;
  grade?: GradeLevel;
  bilingualMode: boolean;
  onInsertText?: (text: string) => void;
  onAddWordCoins?: (coins: number) => void;
  isFloatingModal?: boolean;
  onClose?: () => void;
  currentAppTab?: string;
}

export type TabMode = 'chat' | 'hinglish' | 'simple_words' | 'fix_sentence' | 'next_ideas' | 'idioms';

export const ShabdSahyog: React.FC<ShabdSahyogProps> = ({
  storyContext = '',
  characterName = 'आरव',
  genre = 'साहसिक कथा',
  grade = 'कक्षा 8',
  bilingualMode,
  onInsertText,
  onAddWordCoins,
  isFloatingModal = false,
  onClose,
  currentAppTab,
}) => {
  const [activeTab, setActiveTab] = useState<TabMode>(isFloatingModal ? 'chat' : 'chat');
  const [loading, setLoading] = useState<boolean>(false);
  const [justInsertedId, setJustInsertedId] = useState<string | null>(null);

  // Tab 1: Hinglish state
  const [hinglishInput, setHinglishInput] = useState<string>('ek din jungle me ek bhalu gum ho gaya');
  const [hinglishResult, setHinglishResult] = useState<{
    hindiText: string;
    englishMeaning: string;
    tip: string;
  } | null>({
    hindiText: 'एक दिन जंगल में एक भालू गुम हो गया।',
    englishMeaning: 'One day a bear got lost in the jungle.',
    tip: 'सरल और सुंदर हिंदी वाक्य! इसे सीधे अपनी कहानी में जोड़ सकते हैं।'
  });

  // Tab 2: Simple Words state
  const [wordInput, setWordInput] = useState<string>('प्रसन्न');
  const [wordResult, setWordResult] = useState<{
    originalWord: string;
    simpleAlternatives: Array<{ word: string; meaningEnglish: string; exampleSentence: string }>;
    tip: string;
  } | null>({
    originalWord: 'प्रसन्न',
    simpleAlternatives: [
      { word: 'खुश', meaningEnglish: 'Happy / Glad', exampleSentence: 'आरव नया खिलौना देखकर बहुत खुश हुआ।' },
      { word: 'राजी', meaningEnglish: 'Willing / Pleased', exampleSentence: 'सब उसकी बात सुनकर राजी हो गए।' },
      { word: 'आनंदित', meaningEnglish: 'Joyful', exampleSentence: 'कहानी सुनकर बच्चे आनंदित हो उठे।' }
    ],
    tip: "'प्रसन्न' की जगह 'खुश' का प्रयोग करने से कहानी पढ़ना और समझना बहुत आसान हो जाता है।"
  });

  // Tab 3: Next Line Ideas state
  const [ideasResult, setIdeasResult] = useState<Array<{
    id: string;
    vibe: string;
    hindiSentence: string;
    englishMeaning: string;
  }>>([
    {
      id: 'idea_init_1',
      vibe: 'रोमांचक मोड़ (Twist)',
      hindiSentence: `तभी झाड़ियों के पीछे से एक हल्की सी सरसराहट हुई और ${characterName} चौंक कर रुक गया।`,
      englishMeaning: `Suddenly there was a rustle behind the bushes and ${characterName} stopped startled.`
    },
    {
      id: 'idea_init_2',
      vibe: 'बातचीत (Dialogue)',
      hindiSentence: `'डरो मत, मैं तुम्हारी मदद करूँगा,' पेड़ की डाल से एक नन्हे पक्षी ने मीठी आवाज़ में कहा।`,
      englishMeaning: `'Don't be afraid, I will help you,' said a tiny bird sweetly from a tree branch.`
    },
    {
      id: 'idea_init_3',
      vibe: 'साहस भरा कदम (Brave Action)',
      hindiSentence: `${characterName} ने गहरी साँस ली, अपना बस्ता सँभाला और हिम्मत से आगे कदम बढ़ा दिया।`,
      englishMeaning: `${characterName} took a deep breath, adjusted his bag, and boldly stepped forward.`
    }
  ]);

  // Tab 4: Fix Sentence state
  const [fixInput, setFixInput] = useState<string>('woh bola ki mai kal jarur aaunga lekin nahi aaya');
  const [fixResult, setFixResult] = useState<{
    originalText: string;
    improvedHindi: string;
    englishMeaning: string;
    explanationHindi: string;
    explanationEnglish: string;
  } | null>(null);

  // Tab 5: Idioms state
  const [idiomsList] = useState([
    {
      muhavara: 'फूले न समाना',
      meaningHindi: 'बहुत खुश होना (Very happy)',
      meaningEnglish: 'To be overjoyed',
      example: 'इनाम पाकर वह फूले न समाया।'
    },
    {
      muhavara: 'दंग रह जाना',
      meaningHindi: 'हैरान होना (Amazed)',
      meaningEnglish: 'To be astonished',
      example: 'जादू देखकर सभी बच्चे दंग रह गए।'
    },
    {
      muhavara: 'पीठ थपथपाना',
      meaningHindi: 'शाबाशी देना (Encourage)',
      meaningEnglish: 'To praise / pat on back',
      example: 'सच्चाई बताने पर माँ ने उसकी पीठ थपथपाई।'
    },
    {
      muhavara: 'हाथ बंटाना',
      meaningHindi: 'मदद करना (Help)',
      meaningEnglish: 'To lend a helping hand',
      example: 'उसने अपने दोस्त का हाथ बंटाकर काम पूरा किया।'
    },
    {
      muhavara: 'आँखों का तारा',
      meaningHindi: 'बहुत प्यारा होना',
      meaningEnglish: 'Beloved / apple of eye',
      example: 'अपनी मीठी बातों से वह सबका आँखों का तारा बन गया।'
    },
    {
      muhavara: 'नौ दो ग्यारह होना',
      meaningHindi: 'तुरंत भाग जाना',
      meaningEnglish: 'To run away quickly',
      example: 'आहट सुनते ही चोर नौ दो ग्यारह हो गया।'
    }
  ]);

  // Tab 6: Chat state (Universal across entire app)
  const [chatMessages, setChatMessages] = useState<Array<{
    sender: 'user' | 'shabdsahyog';
    textHindi: string;
    textEnglish?: string;
    suggestedSentence?: string;
  }>>([
    {
      sender: 'shabdsahyog',
      textHindi: 'नमस्ते! मैं शब्दसहयोग AI हूँ—आपका सार्वभौमिक हिंदी व्याकरण, शब्दावली व लेखन साथी! कारक, वाच्य, वाक्य भेद, काल, मुहावरे, उपसर्ग-प्रत्यय, संधि-समास, अपठित गद्यांश, हिंग्लिश अनुवाद या कहानी लेखन—मुझसे पूरे ऐप में कहीं भी कोई भी प्रश्न पूछें!',
      textEnglish: 'Hello! I am ShabdSahyog AI—your universal Hindi grammar, vocab and writing companion! Ask me anything about Karak, Voice, Sentence types, Tenses, Idioms, Affixes, Comprehension, or Story writing!',
      suggestedSentence: 'कारक के आठों भेदों के विभक्ति चिह्न याद रखने की आसान ट्रिक क्या है?'
    }
  ]);
  const [chatInput, setChatInput] = useState<string>('');

  const handleInsert = (text: string, id: string) => {
    if (onInsertText) {
      onInsertText(text);
      setJustInsertedId(id);
      setTimeout(() => setJustInsertedId(null), 1800);
    }
  };

  // 1. Convert Hinglish to Simple Hindi
  const handleConvertHinglish = async (customText?: string) => {
    const textToUse = customText || hinglishInput.trim();
    if (!textToUse || loading) return;

    setLoading(true);
    try {
      const res = await fetch('/api/ai/shabdsahyog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'hinglish_to_hindi',
          input: textToUse,
          characterName,
          genre,
          grade
        })
      });
      const data = await res.json();
      if (data && data.hindiText) {
        setHinglishResult({
          hindiText: data.hindiText,
          englishMeaning: data.englishMeaning || '',
          tip: data.tip || 'हिंग्लिश को सरल हिंदी में बदल दिया गया है!'
        });
      }
    } catch (e) {
      console.warn('Hinglish conversion error:', e);
    } finally {
      setLoading(false);
    }
  };

  // 2. Simplify Word
  const handleSimplifyWord = async (customWord?: string) => {
    const wordToUse = customWord || wordInput.trim();
    if (!wordToUse || loading) return;

    setLoading(true);
    try {
      const res = await fetch('/api/ai/shabdsahyog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'simplify_word',
          input: wordToUse,
          grade
        })
      });
      const data = await res.json();
      if (data && data.simpleAlternatives) {
        setWordResult(data);
      }
    } catch (e) {
      console.warn('Simplify word error:', e);
    } finally {
      setLoading(false);
    }
  };

  // 3. Generate Next Line Ideas
  const handleGetNextIdeas = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch('/api/ai/shabdsahyog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'next_ideas',
          storyContext,
          characterName,
          genre,
          grade
        })
      });
      const data = await res.json();
      if (data && Array.isArray(data.ideas)) {
        setIdeasResult(data.ideas);
      }
    } catch (e) {
      console.warn('Next ideas error:', e);
    } finally {
      setLoading(false);
    }
  };

  // 4. Fix Sentence
  const handleFixSentence = async () => {
    if (!fixInput.trim() || loading) return;
    setLoading(true);
    try {
      const res = await fetch('/api/ai/shabdsahyog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'fix_sentence',
          input: fixInput.trim(),
          grade
        })
      });
      const data = await res.json();
      if (data && data.improvedHindi) {
        setFixResult(data);
      }
    } catch (e) {
      console.warn('Fix sentence error:', e);
    } finally {
      setLoading(false);
    }
  };

  // 6. Chat with ShabdSahyog (Universal Grammar, Vocab & Writing Companion)
  const handleSendChat = async (customQuery?: string) => {
    const query = (customQuery || chatInput).trim();
    if (!query || loading) return;

    const userMsg = { sender: 'user' as const, textHindi: query };
    setChatMessages((prev) => [...prev, userMsg]);
    if (!customQuery) setChatInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/shabdsahyog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'chat',
          input: query,
          storyContext,
          characterName,
          genre,
          grade
        })
      });
      const data = await res.json();
      if (data && data.replyHindi) {
        setChatMessages((prev) => [
          ...prev,
          {
            sender: 'shabdsahyog',
            textHindi: data.replyHindi,
            textEnglish: data.replyEnglish,
            suggestedSentence: data.suggestedSentence
          }
        ]);
      }
    } catch (e) {
      console.warn('Chat error:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className={`bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-indigo-950/15 flex flex-col h-full overflow-hidden ${isFloatingModal ? 'border-2 border-indigo-500/40' : ''}`}>
      {/* Header Bar - Modern Indigo & Violet Gradient */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-violet-900 text-white p-4 sm:p-5 shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <img
              src="/assets/aistudio/mail.google_a65ce30f.png"
              alt="शब्दशिल्प (ShabdShilp) Logo"
              className="w-10 h-10 rounded-xl object-cover object-center bg-[#091124] border border-white/25 shadow-xs shrink-0"
            />
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-base font-black font-serif-display text-white tracking-wide">
                  शब्दसहयोग AI (ShabdSahyog)
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/25 text-emerald-300 text-[10px] font-bold border border-emerald-400/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Universal AI
                </span>
              </div>
              <p className="text-[11px] text-indigo-200">
                ⚡ <span className="text-amber-300 font-bold">स्मार्ट हिंदी व्याकरण सहायक</span> | पूरे ऐप में कभी भी पूछें
              </p>
            </div>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
              title="बंद करें (Close)"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Mode Switcher Tabs */}
        <div className="mt-3.5 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'chat'
                ? 'bg-white text-indigo-900 shadow-xs'
                : 'bg-white/10 text-white/85 hover:bg-white/20'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>💬 व्याकरण व सवाल (Ask AI)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('hinglish')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'hinglish'
                ? 'bg-white text-indigo-900 shadow-xs'
                : 'bg-white/10 text-white/85 hover:bg-white/20'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>हिंग्लिश ➔ हिंदी</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('simple_words')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'simple_words'
                ? 'bg-white text-indigo-900 shadow-xs'
                : 'bg-white/10 text-white/85 hover:bg-white/20'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>सरल शब्द</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('fix_sentence')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'fix_sentence'
                ? 'bg-white text-indigo-900 shadow-xs'
                : 'bg-white/10 text-white/85 hover:bg-white/20'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>वाक्य सुधारें</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('next_ideas')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'next_ideas'
                ? 'bg-white text-indigo-900 shadow-xs'
                : 'bg-white/10 text-white/85 hover:bg-white/20'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>कहानी विचार</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('idioms')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'idioms'
                ? 'bg-white text-indigo-900 shadow-xs'
                : 'bg-white/10 text-white/85 hover:bg-white/20'
            }`}
          >
            <Smile className="w-3.5 h-3.5" />
            <span>सरल मुहावरे</span>
          </button>
        </div>
      </div>

      {/* Main Assistant Body */}
      <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 text-stone-800 bg-[#FAF8F3]/60">
        {/* ================= TAB 1: HINGLISH TO SIMPLE HINDI ================= */}
        {activeTab === 'hinglish' && (
          <div className="space-y-3.5 animate-in fade-in duration-200">
            <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-3 text-xs text-amber-900">
              <span className="font-bold">हिंग्लिश कीबोर्ड से लिखें: </span>
              <span>
                अगर हिंदी टाइप करना मुश्किल लगता है, तो यहाँ अंग्रेजी अक्षरों में लिखें (उदा. <em>'ek din chintu jungle me gaya'</em>). शब्दसहयोग इसे सरल हिंदी में बदल देगा!
              </span>
            </div>

            {/* Quick Prompts */}
            <div className="flex flex-wrap gap-1.5">
              {[
                'tum kaise ho',
                'ek din jungle me',
                'usne achanak dekha',
                'dost ne bola chalo sath chalein'
              ].map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setHinglishInput(p);
                    handleConvertHinglish(p);
                  }}
                  className="text-[11px] bg-white border border-stone-200 hover:border-[#2A5847] px-2.5 py-1 rounded-lg text-stone-700 transition-colors cursor-pointer"
                >
                  "{p}"
                </button>
              ))}
            </div>

            {/* Input Box */}
            <div className="space-y-2">
              <textarea
                value={hinglishInput}
                onChange={(e) => setHinglishInput(e.target.value)}
                rows={2}
                placeholder="यहाँ हिंग्लिश लिखें (e.g. ek samay ki baat hai raja ne aadesh diya...)"
                className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#2A5847] bg-white"
              />
              <button
                type="button"
                disabled={!hinglishInput.trim() || loading}
                onClick={() => handleConvertHinglish()}
                className="w-full py-2.5 bg-[#2A5847] hover:bg-[#1E4336] text-white font-bold text-xs rounded-xl shadow-xs disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 text-[#EAB869]" />
                    <span>सरल हिंदी में बदलें (Convert to Simple Hindi)</span>
                  </>
                )}
              </button>
            </div>

            {/* Result Display */}
            {hinglishResult && (
              <div className="bg-white border-2 border-[#EAB869]/60 rounded-2xl p-4 space-y-2.5 shadow-xs">
                <div className="flex items-center justify-between text-xs font-bold text-[#2A5847]">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>सरल हिंदी रूप:</span>
                  </span>
                  <span className="text-[10px] text-stone-500 font-normal">
                    {hinglishResult.englishMeaning}
                  </span>
                </div>

                <div className="p-3 bg-[#FAF8F3] rounded-xl text-base font-bold text-stone-900 font-hindi border border-stone-200">
                  {hinglishResult.hindiText}
                </div>

                {hinglishResult.tip && (
                  <p className="text-[11px] text-stone-600 italic">
                    💡 {hinglishResult.tip}
                  </p>
                )}

                {onInsertText && (
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleInsert(hinglishResult.hindiText, 'hinglish_res')}
                      className="flex-1 py-2 bg-[#EAB869] hover:bg-[#DCA251] text-[#2A5847] font-black text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      {justInsertedId === 'hinglish_res' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-800" />
                          <span>कहानी में जुड़ गया!</span>
                        </>
                      ) : (
                        <>
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>कहानी में जोड़ें (+ Insert)</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: SIMPLE WORDS (सरल शब्द) ================= */}
        {activeTab === 'simple_words' && (
          <div className="space-y-3.5 animate-in fade-in duration-200">
            <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-3 text-xs text-emerald-950">
              <span className="font-bold">कठिन शब्दों को सरल बनाएँ: </span>
              <span>
                मुश्किल संस्कृत शब्दों से कहानी भारी हो जाती है। कोई भी कठिन शब्द लिखें और उसके आसान, रोज़मर्रा के शब्द जानें!
              </span>
            </div>

            {/* Quick Word Chips */}
            <div className="flex flex-wrap gap-1.5">
              {['प्रसन्न', 'कठिन', 'विशाल', 'शीघ्र', 'नेत्र', 'भोजन', 'क्रोधित', 'वृक्ष', 'अंधकार', 'साहस'].map(
                (w, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setWordInput(w);
                      handleSimplifyWord(w);
                    }}
                    className={`text-[11px] px-2.5 py-1 rounded-lg transition-colors cursor-pointer border ${
                      wordInput === w
                        ? 'bg-[#2A5847] text-white border-[#2A5847]'
                        : 'bg-white border-stone-200 text-stone-700 hover:border-[#2A5847]'
                    }`}
                  >
                    {w}
                  </button>
                )
              )}
            </div>

            {/* Search Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={wordInput}
                onChange={(e) => setWordInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSimplifyWord()}
                placeholder="कठिन शब्द लिखें (उदा. प्रसन्न, विशाल, शीघ्र)..."
                className="flex-1 text-xs p-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#2A5847] bg-white font-hindi font-semibold"
              />
              <button
                type="button"
                disabled={!wordInput.trim() || loading}
                onClick={() => handleSimplifyWord()}
                className="px-4 py-2 bg-[#2A5847] hover:bg-[#1E4336] text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>सरल रूप खोजें</span>}
              </button>
            </div>

            {/* Results */}
            {wordResult && (
              <div className="bg-white border border-stone-200 rounded-2xl p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <div>
                    <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">मूल कठिन शब्द:</span>
                    <h4 className="text-lg font-bold text-[#D47758] font-hindi">
                      {wordResult.originalWord}
                    </h4>
                  </div>
                  <span className="text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md font-bold">
                    सरल विकल्प
                  </span>
                </div>

                <div className="space-y-2">
                  {wordResult.simpleAlternatives.map((alt, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#FAF8F3] border border-stone-200/80 rounded-xl space-y-1.5 hover:border-[#2A5847]/40 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-[#2A5847] font-hindi">
                          {alt.word}
                        </span>
                        <span className="text-[11px] text-stone-500 font-medium">
                          ({alt.meaningEnglish})
                        </span>
                      </div>

                      <p className="text-xs text-stone-700 font-hindi">
                        <strong className="text-stone-500">उदा.</strong> {alt.exampleSentence}
                      </p>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleInsert(alt.word, `word_alt_${idx}`)}
                          className="px-2.5 py-1 bg-white hover:bg-[#EAB869]/20 text-[#2A5847] text-[11px] font-bold rounded-lg border border-[#2A5847]/30 transition-all cursor-pointer flex items-center gap-1"
                        >
                          {justInsertedId === `word_alt_${idx}` ? (
                            <Check className="w-3 h-3 text-emerald-700" />
                          ) : (
                            <PlusCircle className="w-3 h-3" />
                          )}
                          <span>शब्द कहानी में जोड़ें</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleInsert(alt.exampleSentence, `ex_alt_${idx}`)}
                          className="px-2.5 py-1 bg-white hover:bg-stone-100 text-stone-600 text-[11px] font-medium rounded-lg border border-stone-200 transition-colors cursor-pointer"
                        >
                          + पूरा वाक्य जोड़ें
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {wordResult.tip && (
                  <p className="text-[11px] text-stone-500 italic pt-1">
                    💡 {wordResult.tip}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: NEXT LINE IDEAS (आगे क्या लिखें?) ================= */}
        {activeTab === 'next_ideas' && (
          <div className="space-y-3.5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between bg-amber-50/80 border border-amber-200/90 rounded-2xl p-3 text-xs text-amber-900">
              <div>
                <span className="font-bold">लेखन रुकावट? (Writer's Block?): </span>
                <span>कहानी को आगे बढ़ाने के लिए शब्दसहयोग से ३ नए सरल विचार पाएँ!</span>
              </div>
              <button
                type="button"
                disabled={loading}
                onClick={handleGetNextIdeas}
                className="px-3 py-1.5 bg-[#2A5847] hover:bg-[#1E4336] text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0 ml-2 shadow-xs"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5 text-[#EAB869]" />}
                <span>नए विचार</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {ideasResult.map((idea, idx) => (
                <div
                  key={idea.id || idx}
                  className="bg-white border border-stone-200 rounded-2xl p-3.5 space-y-2 hover:border-[#2A5847]/40 transition-all shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                      {idea.vibe}
                    </span>
                    <span className="text-[11px] text-stone-500 font-sans italic">
                      {idea.englishMeaning}
                    </span>
                  </div>

                  <p className="text-sm font-bold text-stone-900 font-hindi leading-relaxed">
                    {idea.hindiSentence}
                  </p>

                  {onInsertText && (
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleInsert(idea.hindiSentence, `idea_${idx}`)}
                        className="flex-1 py-1.5 bg-[#EAB869] hover:bg-[#DCA251] text-[#2A5847] font-black text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        {justInsertedId === `idea_${idx}` ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-800" />
                            <span>कहानी में जुड़ गया!</span>
                          </>
                        ) : (
                          <>
                            <PlusCircle className="w-3.5 h-3.5" />
                            <span>कहानी में जोड़ें (+ Insert)</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 4: FIX & POLISH (वाक्य सुधारें) ================= */}
        {activeTab === 'fix_sentence' && (
          <div className="space-y-3.5 animate-in fade-in duration-200">
            <div className="bg-blue-50/80 border border-blue-200/90 rounded-2xl p-3 text-xs text-blue-950">
              <span className="font-bold">वाक्य सुधारें और सरल बनाएँ: </span>
              <span>
                अगर वाक्य में कोई वर्तनी, व्याकरण या बनावट की कमी लगती है, तो यहाँ लिखें। शब्दसहयोग उसे सुंदर, सरल हिंदी में सुधार देगा।
              </span>
            </div>

            <div className="space-y-2">
              <textarea
                value={fixInput}
                onChange={(e) => setFixInput(e.target.value)}
                rows={2}
                placeholder="यहाँ अपना वाक्य लिखें या पेस्ट करें..."
                className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#2A5847] bg-white"
              />
              <button
                type="button"
                disabled={!fixInput.trim() || loading}
                onClick={handleFixSentence}
                className="w-full py-2.5 bg-[#2A5847] hover:bg-[#1E4336] text-white font-bold text-xs rounded-xl shadow-xs disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-3.5 h-3.5 text-[#EAB869]" />}
                <span>सुधारें और सरल बनाएँ (Fix & Polish)</span>
              </button>
            </div>

            {fixResult && (
              <div className="bg-white border-2 border-emerald-300 rounded-2xl p-4 space-y-2.5 shadow-xs">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>सुधरा हुआ सरल वाक्य:</span>
                  </span>
                </div>

                <div className="p-3 bg-emerald-50/70 rounded-xl text-base font-bold text-stone-900 font-hindi border border-emerald-200">
                  {fixResult.improvedHindi}
                </div>

                <div className="text-[11px] text-stone-700 space-y-0.5">
                  <p><strong className="text-stone-900 font-bold">सुधार व स्पष्टीकरण: </strong> <span className="font-bold text-stone-900">{fixResult.explanationHindi}</span></p>
                  {bilingualMode && fixResult.explanationEnglish && (
                    <p className="text-stone-600 font-bold italic">({fixResult.explanationEnglish})</p>
                  )}
                </div>

                {onInsertText && (
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleInsert(fixResult.improvedHindi, 'fix_insert')}
                      className="flex-1 py-2 bg-[#EAB869] hover:bg-[#DCA251] text-[#2A5847] font-black text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      {justInsertedId === 'fix_insert' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-800" />
                          <span>कहानी में जुड़ गया!</span>
                        </>
                      ) : (
                        <>
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>कहानी में जोड़ें (+ Insert)</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 5: IDIOMS (सरल मुहावरे) ================= */}
        {activeTab === 'idioms' && (
          <div className="space-y-3.5 animate-in fade-in duration-200">
            <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-3 text-xs text-amber-900">
              <span className="font-bold">सरल मुहावरे जोड़ें: </span>
              <span>
                मुहावरों से कहानी में जान आ जाती है! किसी भी मुहावरे का उदाहरण देखें और एक क्लिक में कहानी में जोड़ें।
              </span>
            </div>

            <div className="space-y-2.5">
              {idiomsList.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-stone-200 rounded-2xl p-3.5 space-y-2 hover:border-[#D47758]/50 transition-colors shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <h5 className="font-black text-[#D47758] font-hindi text-sm">
                      {item.muhavara}
                    </h5>
                    <span className="text-[11px] text-stone-500 font-medium">
                      अर्थ: {item.meaningHindi}
                    </span>
                  </div>

                  <p className="text-xs text-stone-700 font-hindi">
                    <strong className="text-stone-500">उदा.</strong> {item.example}
                  </p>

                  {onInsertText && (
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleInsert(item.example, `idiom_ex_${idx}`)}
                        className="flex-1 py-1.5 bg-[#FAF8F3] hover:bg-[#EAB869]/20 text-[#2A5847] font-bold text-xs rounded-xl border border-[#2A5847]/30 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        {justInsertedId === `idiom_ex_${idx}` ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-700" />
                            <span>जुड़ गया!</span>
                          </>
                        ) : (
                          <>
                            <PlusCircle className="w-3.5 h-3.5" />
                            <span>कहानी में जोड़ें</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 6: CHAT (सार्वभौमिक AI व्याकरण व संदेह समाधान) ================= */}
        {activeTab === 'chat' && (
          <div className="space-y-3 flex flex-col flex-1 min-h-[440px] animate-in fade-in duration-200">
            {/* Quick Grammar Doubt Prompt Chips */}
            <div className="bg-[#FAF8F3] border border-[#2A5847]/15 rounded-2xl p-2.5">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#2A5847] mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D47758]" />
                <span>त्वरित व्याकरण संदेह (Quick Doubt Prompts - Click to ask):</span>
              </div>
              <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {QUICK_DOUBT_CHIPS.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendChat(chip.query)}
                    disabled={loading}
                    className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 hover:border-[#2A5847] hover:bg-[#FAF6EC] text-[#2A5847] text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer shadow-2xs shrink-0 disabled:opacity-50"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Message Scroll Area */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs min-h-[220px]">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-3.5 rounded-2xl leading-relaxed relative group ${
                    msg.sender === 'user'
                      ? 'bg-[#2A5847] text-white ml-6 shadow-xs'
                      : 'bg-white border border-stone-200 text-stone-900 mr-3 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold opacity-75">
                      {msg.sender === 'user' ? '👤 आप (You)' : '🤖 शब्दसहयोग AI (Universal Tutor)'}
                    </span>
                  </div>

                  <p className="font-hindi text-sm whitespace-pre-line leading-relaxed font-normal">
                    {msg.textHindi}
                  </p>

                  {bilingualMode && msg.textEnglish && (
                    <p className="text-[11px] opacity-80 italic mt-1.5 font-sans border-t border-black/5 pt-1">
                      {msg.textEnglish}
                    </p>
                  )}

                  {msg.suggestedSentence && (
                    <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between gap-2 bg-[#FAF8F3]/80 p-2 rounded-xl">
                      <span className="text-[11px] font-hindi text-[#2A5847] font-bold truncate">
                        💡 {msg.suggestedSentence}
                      </span>
                      {onInsertText && (
                        <button
                          type="button"
                          onClick={() => handleInsert(msg.suggestedSentence!, `chat_sent_${i}`)}
                          className="px-2.5 py-1 bg-[#EAB869] text-[#2A5847] text-[10px] font-bold rounded-lg hover:bg-[#DCA251] transition-all cursor-pointer shrink-0 shadow-2xs"
                        >
                          {justInsertedId === `chat_sent_${i}` ? 'जुड़ गया!' : '+ उपयोग करें'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 p-3 bg-white/70 rounded-2xl border border-stone-200 text-stone-600 text-xs italic">
                  <Loader2 className="w-4 h-4 animate-spin text-[#2A5847]" />
                  <span>शब्दसहयोग AI नियम व उत्तर तैयार कर रहा है...</span>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="flex gap-2 pt-2 border-t border-stone-200">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                placeholder="पूछें: कारक के नियम, वाच्य परिवर्तन, वाक्य भेद, काल, मुहावरे या कोई भी संदेह..."
                className="flex-1 text-xs p-3 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#2A5847] bg-white font-hindi"
              />
              <button
                type="button"
                disabled={!chatInput.trim() || loading}
                onClick={() => handleSendChat()}
                className="px-4 py-3 bg-[#2A5847] hover:bg-[#1E4336] text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-xs"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">पूछें</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
