import simKaalImg from '../assets/images/sim_kaal_observatory_1795588260633.jpg';
import simKarakImg from '../assets/images/sim_karak_physics_1795588261531.jpg';
import simVakyaImg from '../assets/images/sim_vakya_railway_1795588261423.jpg';
import simVachyaImg from '../assets/images/sim_vachya_spotlight_1795588261305.jpg';
import simMuhavaraSkyImg from '../assets/images/sim_muhavara_sky_1795588264418.jpg';
import simMuhavaraLampImg from '../assets/images/sim_muhavara_lamp_1795588264863.jpg';
import simSandhiImg from '../assets/images/sim_sandhi_forge_1795588264465.jpg';
import simSamasImg from '../assets/images/sim_samas_scroll_1795588266008.jpg';
import simKriyaImg from '../assets/images/sim_kriya_action_1795588264003.jpg';
import simShabdRootsImg from '../assets/images/sim_shabd_roots_1795588266429.jpg';

export interface ImageInterpretiveHotspot {
  id: string;
  x: number; // percentage 0..100
  y: number; // percentage 0..100
  labelHindi: string;
  clueHindi: string;
  grammarLinkHindi: string;
  grammarLinkEnglish: string;
}

export interface SimulationVisualConfig {
  moduleId: string;
  imageUrl: string;
  secondaryImageUrl: string;
  imageAlt: string;
  sceneTitleHindi: string;
  sceneTitleEnglish: string;
  interpretivePromptHindi: string;
  hotspots: ImageInterpretiveHotspot[];
}

export const SIMULATION_IMAGES = {
  kaal: simKaalImg,
  karak: simKarakImg,
  vakya: simVakyaImg,
  vachya: simVachyaImg,
  muhavaraSky: simMuhavaraSkyImg,
  muhavaraLamp: simMuhavaraLampImg,
  sandhi: simSandhiImg,
  samas: simSamasImg,
  kriya: simKriyaImg,
  shabdRoots: simShabdRootsImg,
} as const;

export const SIMULATION_VISUALS: Record<string, SimulationVisualConfig> = {
  kaal: {
    moduleId: 'kaal',
    imageUrl: simKaalImg,
    secondaryImageUrl: simKriyaImg,
    imageAlt: 'काल चक्र खगोलीय वेधशाला — भूत, वर्तमान और भविष्यत् समय-दर्शक यंत्र',
    sceneTitleHindi: 'चित्र-अवलोकन: खगोलीय समय-चक्र (Temporal Astrolabe)',
    sceneTitleEnglish: 'Visual Scene: Celestial Time Astrolabe',
    interpretivePromptHindi: 'चित्र के ३ चमकते समय-क्षेत्रों पर क्लिक करके समझें कि दृश्य की स्थिति क्रिया के काल-चिह्न को कैसे तय करती है:',
    hotspots: [
      {
        id: 'kaal_past',
        x: 34,
        y: 52,
        labelHindi: 'अस्त होता सुनहरा सूर्य (बीता क्षण)',
        clueHindi: 'बायाँ सुनहरा भाग दिखाता है कि घटना पहले ही घटित हो चुकी है और पीछे छूट गई है।',
        grammarLinkHindi: 'दृश्य संकेत → क्रिया के अंत में ‘आ/ई/ए’ या ‘था/थे/थी’ लगने से भूतकाल सिद्ध होता है।',
        grammarLinkEnglish: 'Past horizon indicates completed action → marks Bhootkaal (था/थे/थी).',
      },
      {
        id: 'kaal_present',
        x: 50,
        y: 48,
        labelHindi: 'मध्य उज्ज्वल चंद्र-केंद्र (अभी का क्षण)',
        clueHindi: 'केंद्र का चमकता अर्धचंद्र दर्शाता है कि कार्य ठीक इस समय आँखों के सामने जारी है या नित्य होता है।',
        grammarLinkHindi: 'दृश्य संकेत → ‘ता है / रहा है / चुका है’ से वर्तमान काल की पहचान होती है।',
        grammarLinkEnglish: 'Glowing center lens marks ongoing or habitual Present (है/हैं).',
      },
      {
        id: 'kaal_future',
        x: 65,
        y: 44,
        labelHindi: 'तारामय उषा क्षितिज (आने वाला कल)',
        clueHindi: 'दायाँ तारामय क्षितिज दर्शाता है कि कार्य अभी हुआ नहीं, बल्कि आगे होने की संभावना या योजना है।',
        grammarLinkHindi: 'दृश्य संकेत → क्रिया के अंत में ‘गा/गे/गी’ या ‘ए/एँ’ जुड़ने से भविष्यत् काल बनता है।',
        grammarLinkEnglish: 'Starry dawn horizon marks upcoming Future intent (गा/गे/गी).',
      },
    ],
  },
  'kriya-kaal': {
    moduleId: 'kriya-kaal',
    imageUrl: simKriyaImg,
    secondaryImageUrl: simKaalImg,
    imageAlt: 'चाक पर घूमती मिट्टी — क्रिया और समय का प्रत्यक्ष चित्रण',
    sceneTitleHindi: 'चित्र-अवलोकन: चाक पर क्रिया-प्रभाव एवं समय-प्रवाह',
    sceneTitleEnglish: 'Visual Scene: Kinetic Action & Time Flow',
    interpretivePromptHindi: 'चित्र के मुख्य बिंदुओं पर क्लिक करें — देखें हाथ का बल मिट्टी (कर्म) पर कैसे जाता है और समय कैसे बदलता है:',
    hotspots: [
      {
        id: 'kk_agent',
        x: 64,
        y: 26,
        labelHindi: 'कुम्हार के हाथ (कर्ता व क्रिया)',
        clueHindi: 'कर्ता के हाथ गति उत्पन्न कर रहे हैं — यही वाक्य की मुख्य क्रिया (‘बनाना/गढ़ना’) है।',
        grammarLinkHindi: 'यदि क्रिया का प्रभाव किसी बाहरी वस्तु पर न पड़े, तो वह अकर्मक (जैसे: चाक घूमता है) रहती है।',
        grammarLinkEnglish: 'Action centered on the doer alone marks Intransitive (अकर्मक).',
      },
      {
        id: 'kk_object',
        x: 52,
        y: 48,
        labelHindi: 'चमकता घड़ा (कर्म पर प्रभाव)',
        clueHindi: 'हाथों की क्रिया का सीधा फल मिट्टी के घड़े पर पड़ रहा है और उसका आकार बदल रहा है।',
        grammarLinkHindi: '“क्या गढ़ा?” → घड़ा! उत्तर मिलने से क्रिया ‘सकर्मक’ और समय के साथ काल-रूप बदलता है।',
        grammarLinkEnglish: 'Visible effect on the clay pot proves Transitive (सकर्मक) object impact.',
      },
      {
        id: 'kk_motion',
        x: 41,
        y: 58,
        labelHindi: 'सुनहरी गति-रेखाएँ (निरंतर काल)',
        clueHindi: 'चाक के चारों ओर सुनहरी गति-रेखाएँ बताती हैं कि काम अभी बीच में चल रहा है, रुका नहीं।',
        grammarLinkHindi: 'निरंतर गति-रेखा = ‘गढ़ रहा है’ (अपूर्ण वर्तमान) बनाम रुका चाक = ‘गढ़ लिया था’ (पूर्ण भूत)।',
        grammarLinkEnglish: 'Active motion arcs visualize continuous aspect (रहा है / रहा था).',
      },
    ],
  },
  karak: {
    moduleId: 'karak',
    imageUrl: simKarakImg,
    secondaryImageUrl: simKriyaImg,
    imageAlt: 'कारक बल-केबल बनाम अलगाव चित्र — छेनी-चक्र जुड़ाव और डाल से गिरता पत्ता',
    sceneTitleHindi: 'चित्र-अवलोकन: जुड़ाव-बल (करण) बनाम अलगाव-दूरी (अपादान)',
    sceneTitleEnglish: 'Visual Scene: Contact Tool Force vs Detachment Distance',
    interpretivePromptHindi: 'चित्र के बाएँ और दाएँ हिस्से पर क्लिक करके दोनों ‘से’ विभक्तियों का भौतिक अंतर देखें:',
    hotspots: [
      {
        id: 'karak_tool',
        x: 24,
        y: 50,
        labelHindi: 'छेनी और चक्र का कसा जुड़ाव (करण)',
        clueHindi: 'बाएँ चित्र में छेनी और पीतल का चक्र एक चमकती केबल से मजबूती से जुड़े हुए काम कर रहे हैं।',
        grammarLinkHindi: 'जहाँ ‘से’ किसी औज़ार या माध्यम से जुड़ाव दिखाए = करण कारक (जैसे: छेनी से तराशा)।',
        grammarLinkEnglish: 'Tight energy cable connecting tool & work = Karan Karak (Instrument).',
      },
      {
        id: 'karak_detach',
        x: 80,
        y: 62,
        labelHindi: 'डाल से दूर जाता पत्ता (अपादान)',
        clueHindi: 'दाएँ चित्र में सुनहरा पत्ता पेड़ की टहनी से टूटकर हवा में अलग होता हुआ दूर जा रहा है।',
        grammarLinkHindi: 'जहाँ ‘से’ अलग होने, गिरने या दूरी बढ़ने का भाव दे = अपादान कारक (पेड़ से पत्ता गिरा)।',
        grammarLinkEnglish: 'Leaf separating from branch = Apadan Karak (Detachment/Separation).',
      },
    ],
  },
  vakya: {
    moduleId: 'vakya',
    imageUrl: simVakyaImg,
    secondaryImageUrl: simSamasImg,
    imageAlt: 'वाक्य रेल-कपलर पुल — इंजन, डिब्बे और योजक पिन',
    sceneTitleHindi: 'चित्र-अवलोकन: वादी रेल-पुल और उपवाक्य कपलर पिन',
    sceneTitleEnglish: 'Visual Scene: Viaduct Train & Clause Coupler Pin',
    interpretivePromptHindi: 'रेल के इंजन, मध्य डिब्बे और सुनहरे कपलर पिन पर क्लिक करके उपवाक्यों की स्वतंत्रता परखें:',
    hotspots: [
      {
        id: 'vakya_engine',
        x: 22,
        y: 44,
        labelHindi: 'मुख्य लोकोमोटिव इंजन (सरल / प्रधान)',
        clueHindi: 'इंजन में स्वयं की शक्ति है — यह बिना किसी दूसरे डिब्बे के भी पटरी पर पूरा सफर कर सकता है।',
        grammarLinkHindi: 'जिसमें एक मुख्य क्रिया और पूर्ण अर्थ हो, वह स्वतंत्र/प्रधान उपवाक्य या सरल वाक्य है।',
        grammarLinkEnglish: 'Self-propelled locomotive represents an independent main clause.',
      },
      {
        id: 'vakya_coupler',
        x: 73,
        y: 52,
        labelHindi: 'सुनहरा कपलर पिन (योजक चिह्न)',
        clueHindi: 'यह चमकता पिन ‘और, परंतु’ जैसा समानाधिकरण योजक है या ‘क्योंकि, जब-तब’ जैसा आश्रित जोड़।',
        grammarLinkHindi: 'योजक हटाकर देखें: दोनों भाग स्वतंत्र हों तो संयुक्त; एक अधूरा हो तो मिश्र वाक्य!',
        grammarLinkEnglish: 'Coupler pin models conjunctions linking equal or dependent clauses.',
      },
      {
        id: 'vakya_bogie',
        x: 54,
        y: 40,
        labelHindi: 'यात्री डिब्बा (सह-उपवाक्य / आश्रित)',
        clueHindi: 'यदि यह डिब्बा स्वयं स्वतंत्र वाक्य जैसा पूरा है तो संयुक्त रेल बनाता है; वरना इंजन पर आश्रित रहता है।',
        grammarLinkHindi: 'आश्रित उपवाक्य अकेले पढ़ने पर अधूरा लगता है और मुख्य क्रिया से अर्थ पूरा करता है।',
        grammarLinkEnglish: 'Trailing carriage shows dependent vs coordinate clause behavior.',
      },
    ],
  },
  vachya: {
    moduleId: 'vachya',
    imageUrl: simVachyaImg,
    secondaryImageUrl: simKriyaImg,
    imageAlt: 'रंगमंच पर चमकती स्पॉटलाइट किरण और खुला ग्रंथ',
    sceneTitleHindi: 'चित्र-अवलोकन: रंगमंच स्पॉटलाइट और क्रिया-नियंत्रण',
    sceneTitleEnglish: 'Visual Scene: Theater Spotlight & Verb Control',
    interpretivePromptHindi: 'मंच के अलग-अलग बिंदुओं पर क्लिक करें — देखें रोशनी का केंद्र बदलने पर क्रिया किसे सलाम करती है:',
    hotspots: [
      {
        id: 'vachya_actors',
        x: 14,
        y: 66,
        labelHindi: 'बाएँ बैठे पात्र (कर्ता — छाया/प्रकाश)',
        clueHindi: 'जब स्पॉटलाइट पात्र (कर्ता) पर हो, तो मंच की सारी गतिविधि सीधे कर्ता के अनुसार चलती है।',
        grammarLinkHindi: 'कर्ता पर स्पॉटलाइट = कर्तृवाच्य (लड़का पत्र लिखता है — क्रिया कर्ता के लिंग-वचन से)।',
        grammarLinkEnglish: 'Spotlight on performers = Kartrivachya (Active Voice).',
      },
      {
        id: 'vachya_desk',
        x: 50,
        y: 58,
        labelHindi: 'केंद्र में खुला ग्रंथ (कर्म की प्रधानता)',
        clueHindi: 'इस दृश्य में तेज सुनहरी रोशनी पात्रों पर नहीं, बल्कि मेज पर रखे ग्रंथ/पत्र (कर्म) पर पड़ रही है!',
        grammarLinkHindi: '‘के द्वारा’ लगाकर स्पॉटलाइट कर्म पर आते ही = कर्मवाच्य (पत्र लिखा जाता है)।',
        grammarLinkEnglish: 'Beam fixed center-stage on the book = Karmvachya (Passive Voice).',
      },
      {
        id: 'vachya_beam',
        x: 50,
        y: 22,
        labelHindi: 'ऊपरी लैंप (क्रिया व भाव का केंद्र)',
        clueHindi: 'जब मंच पर कोई वस्तु (कर्म) न हो और केवल क्रिया के होने या न हो पाने की भावना केंद्र बने।',
        grammarLinkHindi: 'अकर्मक क्रिया + असमर्थता का भाव = भाववाच्य (चला नहीं जाता — सदैव पुल्लिंग एकवचन)।',
        grammarLinkEnglish: 'Focus solely on action ability without object = Bhavvachya.',
      },
    ],
  },
  muhavare: {
    moduleId: 'muhavare',
    imageUrl: simMuhavaraSkyImg,
    secondaryImageUrl: simMuhavaraLampImg,
    imageAlt: 'बादलों व तारों को छूती ऊँची मीनार — मुहावरे का दृश्य रूपक',
    sceneTitleHindi: 'चित्र-अवलोकन: शाब्दिक छवि से छिपे अर्थ की खोज',
    sceneTitleEnglish: 'Visual Scene: Decoding Figurative Meaning from Imagery',
    interpretivePromptHindi: 'चित्र के प्रतीकों पर क्लिक करें — बिना रटे समझें कि आँखों के सामने दिखने वाला दृश्य मन की कौन-सी बात कहता है:',
    hotspots: [
      {
        id: 'muh_sky_spire',
        x: 50,
        y: 35,
        labelHindi: 'तारों से बात करती ऊँची मीनार',
        clueHindi: 'इतनी ऊँची इमारत मानो बादलों और तारों के कान में फुसफुसा रही हो — यह असाधारण ऊँचाई का दृश्य है।',
        grammarLinkHindi: '“आसमान से बातें करना” = बहुत ऊँचा होना या अत्यधिक उन्नति करना (चित्र ही अर्थ बता देता है!)।',
        grammarLinkEnglish: 'Spire piercing the stars visualizes extreme height or grandeur.',
      },
      {
        id: 'muh_sky_clouds',
        x: 72,
        y: 55,
        labelHindi: 'क्षितिज के सुनहरे बादल',
        clueHindi: 'आम वस्तुएँ धरती पर होती हैं, पर जो बादलों की सीमा पार कर जाए वह सामान्य से कहीं श्रेष्ठ होता है।',
        grammarLinkHindi: 'मुहावरा हमेशा शाब्दिक बात को छोड़कर लाक्षणिक विशेषता (ऊँचाई/अद्भुतता) पर बल देता है।',
        grammarLinkEnglish: 'Rising above cloud-line translates literal scale into figurative excellence.',
      },
    ],
  },
  sandhi: {
    moduleId: 'sandhi',
    imageUrl: simSandhiImg,
    secondaryImageUrl: simSamasImg,
    imageAlt: 'दो स्वरित्र द्विभुजों से टकराती ध्वनि-तरंगें और केंद्र में संयुक्त प्रकाश-गोला',
    sceneTitleHindi: 'चित्र-अवलोकन: ध्वनि-तरंग टक्कर व वर्ण-संलयन',
    sceneTitleEnglish: 'Visual Scene: Phonetic Wave Collision & Fusion',
    interpretivePromptHindi: 'बाएँ द्विभुज, मध्य संगम गोले और दाएँ तरंग-यंत्र पर क्लिक करके संधि का ध्वनि-नियम समझें:',
    hotspots: [
      {
        id: 'sandhi_left',
        x: 20,
        y: 55,
        labelHindi: 'पहला ध्वनि-स्रोत (प्रथम शब्द का अंतिम वर्ण)',
        clueHindi: 'बायाँ स्वरित्र पहले शब्द के बिल्कुल अंतिम अक्षर (जैसे सूर्य का ‘अ’) की तरंग छोड़ रहा है।',
        grammarLinkHindi: 'संधि पूरे शब्द में नहीं, केवल पहले शब्द के अंतिम वर्ण पर काम करती है।',
        grammarLinkEnglish: 'Left tuning fork emits the final phoneme of the first word.',
      },
      {
        id: 'sandhi_core',
        x: 50,
        y: 50,
        labelHindi: 'ध्वनि-संगम गोला (संधि विकार)',
        clueHindi: 'जहाँ बाईं और दाईं तरंगें टकराती हैं, वहाँ दोनों अलग रहकर नहीं बल्कि एक नई चमकती ध्वनि (जैसे ‘ओ’) बन जाती हैं!',
        grammarLinkHindi: 'अ + उ = ओ (सूर्य + उदय = सूर्योदय) — यही ध्वनि-विकार संधि है।',
        grammarLinkEnglish: 'Center collision creates a transformed vowel/sound (Sandhi Vikar).',
      },
      {
        id: 'sandhi_scope',
        x: 76,
        y: 26,
        labelHindi: 'तरंग-मापी ग्राफ़ (स्वर/व्यंजन/विसर्ग)',
        clueHindi: 'मॉनिटर पर दिख रही तरंगें बताती हैं कि टकराव दो स्वरों का है, व्यंजन का है या विसर्ग का।',
        grammarLinkHindi: 'टकराने वाले दोनों वर्णों की प्रकृति देखकर स्वर, व्यंजन या विसर्ग संधि तय होती है।',
        grammarLinkEnglish: 'Oscilloscope identifies whether vowels, consonants, or visarga collided.',
      },
    ],
  },
  samas: {
    moduleId: 'samas',
    imageUrl: simSamasImg,
    secondaryImageUrl: simShabdRootsImg,
    imageAlt: 'ताड़पत्र पांडुलिपि और आवर्धक लेंस के नीचे जुड़ी मुहरें',
    sceneTitleHindi: 'चित्र-अवलोकन: पांडुलिपि आवर्धक व पद-संक्षेपण',
    sceneTitleEnglish: 'Visual Scene: Manuscript Magnifier & Compound Compression',
    interpretivePromptHindi: 'ताड़पत्र की गाँठ, आवर्धक लेंस और नक्षत्र-मुहरों पर क्लिक करके समास-विग्रह का रहस्य जानें:',
    hotspots: [
      {
        id: 'samas_scroll',
        x: 34,
        y: 58,
        labelHindi: 'बंधा हुआ ताड़पत्र (समस्तपद)',
        clueHindi: 'लपेटा हुआ ताड़पत्र कम जगह में पूरा संदेश समेटे रहता है — जैसे कई शब्दों की जगह एक शब्द ‘रसोईघर’।',
        grammarLinkHindi: 'अनेक शब्दों को संक्षिप्त करके एक सार्थक शब्द बनाना ही समास (समस्तपद) है।',
        grammarLinkEnglish: 'Rolled scroll represents compressed compound (Samastpad).',
      },
      {
        id: 'samas_lens',
        x: 74,
        y: 66,
        labelHindi: 'पीतल आवर्धक लेंस (विग्रह परीक्षण)',
        clueHindi: 'आवर्धक लेंस लगाकर पढ़ने पर ताड़पत्र के बीच छिपे छोटे-छोटे कारक चिह्न (‘के लिए’, ‘का’, ‘में’) साफ दिखते हैं!',
        grammarLinkHindi: 'समस्तपद खोलते ही जो विभक्ति/योजक प्रकट हो (रसोई के लिए घर = तत्पुरुष), वही भेद बताता है।',
        grammarLinkEnglish: 'Magnifying lens reveals hidden case postpositions during Vigraha.',
      },
      {
        id: 'samas_seals',
        x: 78,
        y: 35,
        labelHindi: 'जुड़े हुए मोहर-खंड (पूर्व व उत्तर पद)',
        clueHindi: 'सुनहरी तारों से जुड़ी चार मुहरें दिखाती हैं कि दो पद मिलकर कभी पहला, कभी दूसरा और कभी तीसरा अर्थ प्रधान बनाते हैं।',
        grammarLinkHindi: 'पूर्वपद प्रधान = अव्ययीभाव · उत्तरपद = तत्पुरुष · दोनों = द्वंद्व · तीसरा अर्थ = बहुव्रीहि।',
        grammarLinkEnglish: 'Connected seals illustrate head-word dominance across Samas types.',
      },
    ],
  },
  'upsarg-pratyay': {
    moduleId: 'upsarg-pratyay',
    imageUrl: simShabdRootsImg,
    secondaryImageUrl: simSandhiImg,
    imageAlt: 'सुनहरी जड़ों और पत्तियों वाला प्राचीन शब्द-वृक्ष',
    sceneTitleHindi: 'चित्र-अवलोकन: मूल शब्द की जड़ें व शब्दांश कोंपलें',
    sceneTitleEnglish: 'Visual Scene: Root Tree Trunk & Affix Sprouts',
    interpretivePromptHindi: 'वृक्ष की जड़, तने और चमकती पत्तियों पर क्लिक करें — देखें उपसर्ग आगे और प्रत्यय पीछे कैसे जुड़ता है:',
    hotspots: [
      {
        id: 'up_roots',
        x: 50,
        y: 74,
        labelHindi: 'चमकती सुनहरी जड़ें (उपसर्ग — आरंभ)',
        clueHindi: 'जड़ें सबसे नीचे व आगे रहकर पूरे पेड़ के रस और दिशा को बदल देती हैं।',
        grammarLinkHindi: 'उपसर्ग हमेशा मूल शब्द के आरंभ (आगे) जुड़कर शब्द का अर्थ या दिशा बदल देते हैं।',
        grammarLinkEnglish: 'Roots anchoring the base represent prefixes altering direction at the start.',
      },
      {
        id: 'up_trunk',
        x: 50,
        y: 48,
        labelHindi: 'मजबूत मुख्य तना (सार्थक मूल शब्द)',
        clueHindi: 'यह सार्थक तना (‘मान’, ‘योग’, ‘समाज’) शब्दांश अलग करने के बाद भी अपने आप अर्थ रखता है।',
        grammarLinkHindi: 'नियम: उपसर्ग या प्रत्यय अलग करने पर बीच में एक सार्थक ‘मूल शब्द’ अवश्य बचना चाहिए।',
        grammarLinkEnglish: 'Solid trunk stands for the independent meaningful root word.',
      },
      {
        id: 'up_canopy',
        x: 52,
        y: 22,
        labelHindi: 'हरी-सुनहरी पत्तियाँ (प्रत्यय — अंत)',
        clueHindi: 'टहनियों के अंतिम सिरे पर खिली पत्तियाँ पूरे वृक्ष को नया रूप, रंग और श्रेणी देती हैं।',
        grammarLinkHindi: 'प्रत्यय मूल शब्द के अंत (पीछे) जुड़कर संज्ञा से विशेषण/भाववाचक रूप बनाते हैं (जैसे समाज + इक = सामाजिक)।',
        grammarLinkEnglish: 'Canopy leaves at the end represent suffixes transforming word class.',
      },
    ],
  },
};

const GENERIC_MODULE_VISUAL_MAP: Record<
  string,
  {
    primary: string;
    secondary: string;
    sceneTitleHindi: string;
    sceneTitleEnglish: string;
    alt: string;
    hotspots: ImageInterpretiveHotspot[];
  }
> = {
  sangya: {
    primary: simShabdRootsImg,
    secondary: simSamasImg,
    sceneTitleHindi: 'चित्र-अवलोकन: दृश्य वस्तु से भाव तक संज्ञा की पहचान',
    sceneTitleEnglish: 'Visual Scene: Tangible Object to Abstract Emotion',
    alt: 'शब्द-वृक्ष — जड़ें, तना और प्रकाशमान पत्तियाँ',
    hotspots: [
      {
        id: 'san_special',
        x: 50,
        y: 48,
        labelHindi: 'एक विशिष्ट प्राचीन वटवृक्ष (व्यक्तिवाचक)',
        clueHindi: 'यदि चित्र का यह वृक्ष कोई प्रसिद्ध ऐतिहासिक ‘अक्षयवट’ हो, तो वह केवल एक विशेष नाम बन जाता है।',
        grammarLinkHindi: 'किसी विशेष एक नाम (गंगा, हिमालय, भारत) = व्यक्तिवाचक संज्ञा।',
        grammarLinkEnglish: 'One unique named entity = Vyakti-vachak (Proper Noun).',
      },
      {
        id: 'san_class',
        x: 34,
        y: 28,
        labelHindi: 'संपूर्ण वृक्ष-जाति और पत्ते (जातिवाचक)',
        clueHindi: '‘पेड़, पत्ता, पहाड़, तारा’ कहने से दुनिया की उस पूरी श्रेणी या वर्ग का बोध होता है।',
        grammarLinkHindi: 'पूरी जाति या वर्ग का बोध कराने वाले शब्द = जातिवाचक संज्ञा।',
        grammarLinkEnglish: 'Category covering all trees/leaves = Jati-vachak (Common Noun).',
      },
      {
        id: 'san_feel',
        x: 72,
        y: 34,
        labelHindi: 'शीतलता व हरियाली का अनुभव (भाववाचक)',
        clueHindi: 'हम पत्तों को छू सकते हैं, पर रात्रि की ‘सुंदरता’, ‘शीतलता’ और ‘प्राचीनता’ को केवल महसूस कर सकते हैं।',
        grammarLinkHindi: 'जिसे छुआ न जा सके, केवल गुण या भाव महसूस हो = भाववाचक संज्ञा।',
        grammarLinkEnglish: 'Felt qualities (beauty, coolness) = Bhav-vachak (Abstract Noun).',
      },
    ],
  },
  sarvanam: {
    primary: simVachyaImg,
    secondary: simVakyaImg,
    sceneTitleHindi: 'चित्र-अवलोकन: मंच पर पात्र-संकेत व सर्वनाम प्रतिस्थापन',
    sceneTitleEnglish: 'Visual Scene: Stage Pointers & Pronoun Substitution',
    alt: 'मंच के किनारे बैठे पात्र और केंद्र का प्रकाश',
    hotspots: [
      {
        id: 'sar_speaker',
        x: 16,
        y: 66,
        labelHindi: 'संवाद करते दो वक्ता (पुरुषवाचक — मैं/तुम)',
        clueHindi: 'बाएँ बैठे पात्र आपस में बात कर रहे हैं — बोलने वाला ‘मैं’, सुनने वाला ‘तुम’।',
        grammarLinkHindi: 'वक्ता, श्रोता व अन्य व्यक्ति के नाम की जगह आने वाले शब्द = पुरुषवाचक सर्वनाम।',
        grammarLinkEnglish: 'Speaker/listener roles correspond to Personal Pronouns (मैं, तुम, वह).',
      },
      {
        id: 'sar_center',
        x: 50,
        y: 55,
        labelHindi: 'रोशनी में रखी ठीक यह वस्तु (निश्चयवाचक)',
        clueHindi: 'मंच के बीच उजाले में रखी किताब पर उँगली रखकर कहा जाए — “यह ग्रंथ प्राचीन है”।',
        grammarLinkHindi: 'पास या दूर की निश्चित वस्तु की ओर संकेत (‘यह/वह’) = निश्चयवाचक सर्वनाम।',
        grammarLinkEnglish: 'Spotlighted definite object indicates Demonstrative (निश्चयवाचक).',
      },
    ],
  },
  visheshan: {
    primary: simKriyaImg,
    secondary: simMuhavaraLampImg,
    sceneTitleHindi: 'चित्र-अवलोकन: वस्तु के गुण, संख्या और माप का विश्लेषण',
    sceneTitleEnglish: 'Visual Scene: Inspecting Quality, Number & Measure',
    alt: 'सुनहरे प्रकाश में चमकता घड़ा और कुम्हार के हाथ',
    hotspots: [
      {
        id: 'vis_quality',
        x: 52,
        y: 48,
        labelHindi: '‘सुनहरा’ व ‘चिकना’ घड़ा (गुणवाचक)',
        clueHindi: 'यहाँ घड़े का रंग (सुनहरा), रूप (गोल) और बनावट दिख रही है — प्रश्न करें: “कैसा घड़ा?”।',
        grammarLinkHindi: '‘कैसा/कैसी?’ का उत्तर देने वाले रंग-गुण-दोष = गुणवाचक विशेषण।',
        grammarLinkEnglish: 'Visual traits answering “what kind?” mark Qualitative Adjective.',
      },
      {
        id: 'vis_quantity',
        x: 78,
        y: 78,
        labelHindi: '‘थोड़ा’ पानी व ‘तीन’ बर्तन (परिमाण बनाम संख्या)',
        clueHindi: 'गिने जा सकने वाले बर्तन (१, २, ३) संख्या हैं; पर बर्तन में भरा जल नापा-तौला जाता है (२ लीटर / थोड़ा)।',
        grammarLinkHindi: 'गिने जाने योग्य = संख्यावाचक · नाप-तौल वाली मात्रा = परिमाणवाचक।',
        grammarLinkEnglish: 'Countable objects = Sankhya; measured liquid/clay = Pariman.',
      },
    ],
  },
  ling: {
    primary: simShabdRootsImg,
    secondary: simSamasImg,
    sceneTitleHindi: 'चित्र-अवलोकन: ‘मेरा-मेरी’ वाक्य-परीक्षण व शब्द रूप',
    sceneTitleEnglish: 'Visual Scene: Contextual Gender Agreement Lens',
    alt: 'प्राचीन वृक्ष और चमकता चंद्रमा',
    hotspots: [
      {
        id: 'ling_masc',
        x: 26,
        y: 24,
        labelHindi: 'चंद्रमा, वृक्ष, तना (मेरा / अच्छा = पुल्लिंग)',
        clueHindi: 'चित्र की वस्तुओं के साथ बोलकर देखें: “मेरा पेड़ हरा है”, “आकाश नीला है” — क्रिया ‘आ’ पर समाप्त हुई।',
        grammarLinkHindi: '‘मेरा/अच्छा/होता है’ के साथ मेल खाने वाले शब्द सदैव पुल्लिंग होते हैं।',
        grammarLinkEnglish: 'Matches with ‘मेरा / अच्छा / होता है’ = Masculine (पुल्लिंग).',
      },
      {
        id: 'ling_fem',
        x: 74,
        y: 28,
        labelHindi: 'चाँदनी, टहनी, पत्ती, रात (मेरी / अच्छी = स्त्रीलिंग)',
        clueHindi: 'अब बोलें: “मेरी पत्ती हरी है”, “रात ठंडी है” — क्रिया व विशेषण ‘ई’ स्वर पर झुक गए।',
        grammarLinkHindi: '‘मेरी/अच्छी/होती है’ से मेल और इकारांत प्रत्यय (‘ई’, ‘नी’, ‘इका’) स्त्रीलिंग बनाते हैं।',
        grammarLinkEnglish: 'Matches with ‘मेरी / अच्छी / होती है’ = Feminine (स्त्रीलिंग).',
      },
    ],
  },
  vachan: {
    primary: simShabdRootsImg,
    secondary: simVakyaImg,
    sceneTitleHindi: 'चित्र-अवलोकन: एक इकाई बनाम अनेक समूह (स्वर-परिवर्तन)',
    sceneTitleEnglish: 'Visual Scene: Single Unit vs Multiple Cluster',
    alt: 'एक मुख्य तना और सैकड़ों चमकती पत्तियाँ',
    hotspots: [
      {
        id: 'vac_one',
        x: 50,
        y: 52,
        labelHindi: 'एक अकेला तना / चाँद (एकवचन)',
        clueHindi: 'पूरे चित्र में मुख्य वृक्ष एक है और आकाश में चाँद भी एक है — गिनती = १।',
        grammarLinkHindi: 'एक संख्या का बोध कराने पर शब्द अपने मूल रूप में एकवचन रहता है।',
        grammarLinkEnglish: 'Single trunk or moon represents Singular (एकवचन).',
      },
      {
        id: 'vac_many',
        x: 52,
        y: 22,
        labelHindi: 'असंख्य पत्तियाँ, टहनियाँ व तारे (बहुवचन)',
        clueHindi: 'ऊपर अनगिनत तारे और पत्तियाँ हैं — ध्यान दें: बहुवचन बनते समय ‘पत्ती’ से ‘पत्तियाँ’ (बड़ी ई → छोटी इ) हो गया!',
        grammarLinkHindi: 'नियम: अंत की दीर्घ ‘ई’ बहुवचन में ह्रस्व ‘इ’ + ‘याँ’ बनती है (पत्ती → पत्तियाँ)।',
        grammarLinkEnglish: 'Long final ई shortens to इ + याँ when pluralized across leaves/branches.',
      },
    ],
  },
  kriya: {
    primary: simKriyaImg,
    secondary: simKarakImg,
    sceneTitleHindi: 'चित्र-अवलोकन: कार्य-व्यापार और कर्म पर प्रभाव',
    sceneTitleEnglish: 'Visual Scene: Action Execution & Object Impact',
    alt: 'कुम्हार द्वारा चाक पर मिट्टी का घड़ा गढ़ने का दृश्य',
    hotspots: [
      {
        id: 'kr_doer',
        x: 64,
        y: 24,
        labelHindi: 'गढ़ना (सकर्मक क्रिया का केंद्र)',
        clueHindi: 'कुम्हार के हाथ गति कर रहे हैं। तुरंत प्रश्न करें — “क्या गढ़ रहा है?” → उत्तर मिलता है: “घड़ा”!',
        grammarLinkHindi: '‘क्या/किसे’ प्रश्न का प्रत्यक्ष उत्तर वाक्य में मौजूद हो तो सकर्मक क्रिया होती है।',
        grammarLinkEnglish: 'Answering “what is being shaped?” proves Transitive Verb.',
      },
      {
        id: 'kr_wheel',
        x: 34,
        y: 66,
        labelHindi: 'चाक घूमना (अकर्मक क्रिया)',
        clueHindi: 'पहिया अपने आप गोल घूम रहा है — घूमने का प्रभाव किसी अलग कर्म पर नहीं, स्वयं पहिये पर है।',
        grammarLinkHindi: '‘क्या घूमता है?’ में कर्ता (पहिया) ही उत्तर बने तो अकर्मक क्रिया होती है।',
        grammarLinkEnglish: 'Self-contained wheel motion without separate object is Intransitive.',
      },
    ],
  },
  'viram-chinh': {
    primary: simMuhavaraLampImg,
    secondary: simSamasImg,
    sceneTitleHindi: 'चित्र-अवलोकन: दीपक की रोशनी व विराम-ठहराव से अर्थ-रक्षा',
    sceneTitleEnglish: 'Visual Scene: Illumination Clues & Pause Boundaries',
    alt: 'अँधेरे में जलता पीतल का दीपक',
    hotspots: [
      {
        id: 'vr_stop',
        x: 56,
        y: 38,
        labelHindi: 'दीपक की लौ — पूर्ण विराम ( । ) का ठहराव',
        clueHindi: 'जैसे प्रकाश एक निश्चित दायरे को स्पष्ट कर देता है, वैसे ही पूर्ण विराम एक विचार को पूरा करके विराम देता है।',
        grammarLinkHindi: 'सरल, संयुक्त या मिश्र सामान्य कथन पूरा होने पर ‘।’ लगाना अनिवार्य है।',
        grammarLinkEnglish: 'Purna Viram (।) cleanly closes every complete declarative thought.',
      },
      {
        id: 'vr_comma',
        x: 42,
        y: 66,
        labelHindi: 'तले की सीढ़ियाँ — अल्पविराम ( , ) का मोड़',
        clueHindi: 'मूर्ति व सीढ़ियों के बीच हल्का अंतर जैसे शब्दों में अल्प ठहराव देकर अर्थ को उलटने से बचाता है (“रोको, मत जाने दो”)।',
        grammarLinkHindi: 'अल्पविराम की जगह बदलने मात्र से पूरे वाक्य का भाव उलट सकता है!',
        grammarLinkEnglish: 'Comma placement shifts pause boundaries and prevents ambiguity.',
      },
    ],
  },
  avikari: {
    primary: simVakyaImg,
    secondary: simSamasImg,
    sceneTitleHindi: 'चित्र-अवलोकन: अडिग पत्थर के खंभे (अपरिवर्तित अव्यय)',
    sceneTitleEnglish: 'Visual Scene: Unchanging Stone Pillars (Invariants)',
    alt: 'चलती ट्रेन के नीचे खड़े अडिग पत्थर के पुल-स्तंभ',
    hotspots: [
      {
        id: 'av_pillars',
        x: 52,
        y: 66,
        labelHindi: 'अडिग पत्थर के स्तंभ (अविकारी / अव्यय)',
        clueHindi: 'ऊपर चाहे नया इंजन आए या पुराने डिब्बे (लिंग/वचन/काल बदले), नीचे के पत्थर के खंभे जरा भी रूप नहीं बदलते!',
        grammarLinkHindi: '‘धीरे-धीरे, अचानक, और, के ऊपर, वाह!’ — लिंग-वचन-काल बदलने पर भी ज्यों के त्यों रहते हैं।',
        grammarLinkEnglish: 'Bridge pillars never morph even as trains/tenses pass over them.',
      },
      {
        id: 'av_bridge',
        x: 68,
        y: 44,
        labelHindi: '‘पुल के ऊपर’ — संबंधबोधक अव्यय',
        clueHindi: 'ट्रेन और पुल के बीच ‘के ऊपर’ शब्द स्थान का पक्का रिश्ता जोड़ रहा है।',
        grammarLinkHindi: 'संज्ञा के साथ ‘के बिना, के ऊपर, के पीछे’ आए तो संबंधबोधक अव्यय होता है।',
        grammarLinkEnglish: 'Connects noun position spatially (के ऊपर) = Sambandhbodhak.',
      },
    ],
  },
  paryayvachi: {
    primary: simMuhavaraSkyImg,
    secondary: simMuhavaraLampImg,
    sceneTitleHindi: 'चित्र-अवलोकन: एक ही आकाश — अनेक पर्याय नाम',
    sceneTitleEnglish: 'Visual Scene: One Subject, Multiple Synonym Names',
    alt: 'तारों भरा आकाश, मेघ और प्राचीन मीनार',
    hotspots: [
      {
        id: 'par_sky',
        x: 28,
        y: 26,
        labelHindi: 'तारामय आकाश = गगन, नभ, अंबर, व्योम',
        clueHindi: 'चित्र में ऊपर फैले अनंत नीले विस्तार को देखें — नाम अलग होने पर भी दृश्य और भाव बिल्कुल एक है।',
        grammarLinkHindi: 'एक ही मूल तत्व को अलग-अलग रूपक नामों से बुलाने पर पर्यायवाची समूह बनता है।',
        grammarLinkEnglish: 'Same celestial sky described from different poetic roots.',
      },
      {
        id: 'par_clouds',
        x: 78,
        y: 52,
        labelHindi: 'बादल = जलद (जल देने वाला), मेघ, नीरद',
        clueHindi: '‘जल’ शब्द में ‘द’ (देने वाला) जोड़ते ही बादल का पर्यायवाची (जलद) बिना रटे स्वयं बन जाता है!',
        grammarLinkHindi: 'मूल सूत्र: जल + द = बादल · जल + ज = कमल · जल + धि = समुद्र।',
        grammarLinkEnglish: 'Root formula: जल + द (giver) = cloud; + ज (born) = lotus.',
      },
    ],
  },
  vilom: {
    primary: simMuhavaraLampImg,
    secondary: simKaalImg,
    sceneTitleHindi: 'चित्र-अवलोकन: प्रकाश बनाम तिमिर (विपरीत ध्रुव दर्पण)',
    sceneTitleEnglish: 'Visual Scene: Light vs Shadow Polarity Mirror',
    alt: 'अँधेरे में जलता प्रकाशमान दीपक',
    hotspots: [
      {
        id: 'vil_light',
        x: 58,
        y: 38,
        labelHindi: 'चमकता प्रकाश (आलोक / उजाला)',
        clueHindi: 'दीपक की लौ ‘तत्सम/हिंदी’ स्तर की रोशनी का प्रतीक है।',
        grammarLinkHindi: 'नियम: तत्सम शब्द का विलोम तत्सम (आलोक ↔ तिमिर) और तद्भव का तद्भव (उजाला ↔ अँधेरा) होता है।',
        grammarLinkEnglish: 'Opposite pairs must match register: आलोक ↔ तिमिर.',
      },
      {
        id: 'vil_dark',
        x: 24,
        y: 66,
        labelHindi: 'गहन अंधकार (तिमिर / अँधेरा)',
        clueHindi: 'ठीक उसी चित्र में दीपक के नीचे गहरा अँधेरा है — दोनों एक-दूसरे के पूर्ण विपरीत ध्रुव हैं।',
        grammarLinkHindi: '‘अ, अन्, निस्, वि, प्रति’ उपसर्ग जोड़कर भी सटीक विलोम बनते हैं (उदा. न्याय ↔ अन्याय)।',
        grammarLinkEnglish: 'Shadow polarity illustrates balanced antonym symmetry.',
      },
    ],
  },
  'shabd-vichar': {
    primary: simShabdRootsImg,
    secondary: simSamasImg,
    sceneTitleHindi: 'चित्र-अवलोकन: शब्द की जड़ें (तत्सम-तद्भव) व रचना',
    sceneTitleEnglish: 'Visual Scene: Word Origin Roots & Compound Structure',
    alt: 'सुनहरी जड़ों वाला वृक्ष और प्राचीन पांडुलिपि',
    hotspots: [
      {
        id: 'sv_roots',
        x: 50,
        y: 76,
        labelHindi: 'संस्कृत जड़ (तत्सम) → हिंदी तना (तद्भव)',
        clueHindi: 'गहरी जड़ों में छुपे ‘क्ष, त्र, ज्ञ, ऋ, र्’ वाले शब्द संस्कृत से सीधे आए तत्सम रूप हैं; ऊपर आकर सरल बने तद्भव।',
        grammarLinkHindi: '‘क्ष → ख’ (क्षेत्र → खेत), ‘अग्नि → आग’ — ध्वनि सरल होकर तद्भव बनती है।',
        grammarLinkEnglish: 'Deep Sanskrit roots soften phonetically into everyday Tadbhav.',
      },
      {
        id: 'sv_yog',
        x: 68,
        y: 38,
        labelHindi: 'यौगिक बनाम योगरूढ़ (विशेष अर्थ)',
        clueHindi: 'दो भाग जुड़कर सामान्य अर्थ दें तो यौगिक (पाठशाला); पर जुड़कर किसी एक विशेष देव/वस्तु की ओर इशारा करें तो योगरूढ़ (पंकज = कमल)।',
        grammarLinkHindi: 'जो शब्द जुड़कर भी अपना सामान्य अर्थ छोड़ एक विशेष अर्थ में रूढ़ हो जाए = योगरूढ़!',
        grammarLinkEnglish: 'Yogarudh locks a compound onto a single culturally specific referent.',
      },
    ],
  },
  shrutisam: {
    primary: simSandhiImg,
    secondary: simSamasImg,
    sceneTitleHindi: 'चित्र-अवलोकन: दो लगभग समान ध्वनि-तरंगों का सूक्ष्म अंतर',
    sceneTitleEnglish: 'Visual Scene: Subtle Phonetic Wave Distinction',
    alt: 'दो ध्वनि तरंगें और ऑसिलोस्कोप ग्राफ़',
    hotspots: [
      {
        id: 'shr_wave1',
        x: 20,
        y: 54,
        labelHindi: 'लघु मात्रा तरंग (जैसे ‘दिन’ / ‘अनल’)',
        clueHindi: 'बाएँ यंत्र की ध्वनि सुनने में दाएँ जैसी लगती है, पर छोटी इ या एक मात्रा का सूक्ष्म अंतर है।',
        grammarLinkHindi: '‘दिन’ = दिवस · ‘दीन’ = गरीब! केवल ह्रस्व-दीर्घ मात्रा से पूरा अर्थ पलट जाता है।',
        grammarLinkEnglish: 'One vowel-length shift changes day (दिन) into poor (दीन).',
      },
      {
        id: 'shr_wave2',
        x: 78,
        y: 54,
        labelHindi: 'दीर्घ/वर्ण-भेद तरंग (जैसे ‘दीन’ / ‘अनिल’)',
        clueHindi: 'दाईं तरंग में स/श/ष या इ/ई का हल्का कंपन अर्थ को बिल्कुल दूसरी दिशा में ले जाता है।',
        grammarLinkHindi: 'वाक्य प्रयोग मन में बोलकर देखें: “हवा (अनिल) ठंडी है” बनाम “आग (अनल) गरम है”।',
        grammarLinkEnglish: 'Always verify homophone pairs inside a mental sentence context.',
      },
    ],
  },
  anekarthi: {
    primary: simMuhavaraSkyImg,
    secondary: simSamasImg,
    sceneTitleHindi: 'चित्र-अवलोकन: एक शब्द — प्रसंग के अनुसार बदलते अनेक रूप',
    sceneTitleEnglish: 'Visual Scene: One Word Shifting Meaning by Context',
    alt: 'तारों भरा आकाश, चाँद और वस्त्र की लहरें',
    hotspots: [
      {
        id: 'an_sky',
        x: 40,
        y: 25,
        labelHindi: 'प्रसंग १: ‘अंबर’ = आकाश',
        clueHindi: 'यदि वाक्य रात, चाँद और तारों के बारे में है, तो चित्र के ऊपरी भाग की तरह ‘अंबर’ का अर्थ आकाश होगा।',
        grammarLinkHindi: '“नीले अंबर में तारे चमके” → यहाँ अंबर = गगन/आकाश।',
        grammarLinkEnglish: 'In a celestial sentence, अंबर resolves to sky.',
      },
      {
        id: 'an_cloth',
        x: 52,
        y: 66,
        labelHindi: 'प्रसंग २: ‘अंबर’ = वस्त्र (कपड़ा)',
        clueHindi: 'पर यदि वाक्य पीतांबर (पीले वस्त्र) या पहनने के प्रसंग में हो, तो वही शब्द वस्त्र का अर्थ देता है।',
        grammarLinkHindi: 'शब्द वही है, पर वाक्य का संदर्भ (Context) असली अर्थ को अनलॉक करता है।',
        grammarLinkEnglish: 'In apparel context (पीतांबर), the same word means garment.',
      },
    ],
  },
  'pad-parichay': {
    primary: simSamasImg,
    secondary: simVachyaImg,
    sceneTitleHindi: 'चित्र-अवलोकन: आवर्धक लेंस से वाक्य के प्रत्येक पद का एक्स-रे',
    sceneTitleEnglish: 'Visual Scene: X-Raying Every Word Token Under Magnifier',
    alt: 'पांडुलिपि और पीतल का आवर्धक लेंस',
    hotspots: [
      {
        id: 'pp_lens',
        x: 72,
        y: 66,
        labelHindi: 'लेंस से शब्द का पूरा व्याकरणिक परिचय',
        clueHindi: 'जब वाक्य का कोई शब्द इस लेंस के नीचे आता है, तो उसके ५ गुण एक साथ दिखते हैं: भेद, लिंग, वचन, कारक व क्रिया-संबंध।',
        grammarLinkHindi: 'केवल शब्द न देखें — वाक्य में उसकी भूमिका से तय करें (जैसे एक ही ‘अच्छा’ कभी विशेषण, कभी क्रियाविशेषण)।',
        grammarLinkEnglish: 'Sentence role determines exact grammatical identity under the lens.',
      },
      {
        id: 'pp_scroll',
        x: 36,
        y: 54,
        labelHindi: 'वाक्य संदर्भ सूत्र',
        clueHindi: 'पांडुलिपि पर आस-पास के शब्दों से जुड़कर हर पद अपना वचन और कारक तय करता है।',
        grammarLinkHindi: '“हम (सर्वनाम, उत्तम पुरुष, बहुवचन, पुल्लिंग, कर्ता कारक)” — यही पूर्ण पद-परिचय है।',
        grammarLinkEnglish: 'Combine word class + gender + number + case + syntactic relation.',
      },
    ],
  },
  'vartani-shuddhi': {
    primary: simSandhiImg,
    secondary: simSamasImg,
    sceneTitleHindi: 'चित्र-अवलोकन: ध्वनि-उच्चारण से शुद्ध वर्तनी व रेफ़-पहचान',
    sceneTitleEnglish: 'Visual Scene: Phonetic Verification of Spelling & Ref Marks',
    alt: 'ध्वनि प्रयोगशाला और ऑसिलोस्कोप तरंग',
    hotspots: [
      {
        id: 'vs_wave',
        x: 50,
        y: 50,
        labelHindi: 'ध्वनि-उच्चारण और मात्रा-संतुलन',
        clueHindi: 'जैसा शुद्ध उच्चारण होगा, वैसी ही मात्रा लगेगी: ‘क-व-यि-त्री’ न कि कवित्री; ‘उज्-ज्व-ल’ (दोनों ज आधे)।',
        grammarLinkHindi: 'रेफ़ (र्) की ध्वनि जिस अक्षर से ठीक पहले सुनाई दे, वह उसी अगले अक्षर के ऊपर बैठता है (आशीर्-वाद → आशीर्वाद)।',
        grammarLinkEnglish: 'Pronounce slowly: Ref (र्) mounts onto the immediately following consonant.',
      },
      {
        id: 'vs_scope',
        x: 75,
        y: 28,
        labelHindi: 'इक प्रत्यय का प्रथम-स्वर नियम',
        clueHindi: '‘इक’ प्रत्यय जुड़ने पर शब्द के पहले स्वर में वृद्धि होती है: ‘व्यवहार + इक = व्यावहारिक’, ‘समाज + इक = सामाजिक’।',
        grammarLinkHindi: 'यह एक सूत्र वर्तनी-शुद्धि के सबसे कठिन बोर्ड प्रश्नों को तुरंत हल कर देता है।',
        grammarLinkEnglish: 'Initial vowel lengthening rule unlocks high-level Vartani items.',
      },
    ],
  },
  'vakya-vichar': {
    primary: simVakyaImg,
    secondary: simVachyaImg,
    sceneTitleHindi: 'चित्र-अवलोकन: इंजन (उद्देश्य) बनाम डिब्बे (विधेय)',
    sceneTitleEnglish: 'Visual Scene: Subject Engine vs Predicate Carriages',
    alt: 'पुल पर चलती रेलगाड़ी — इंजन और यात्री डिब्बे',
    hotspots: [
      {
        id: 'vv_sub',
        x: 22,
        y: 44,
        labelHindi: 'उद्देश्य (इंजन — जिसके बारे में बात हो)',
        clueHindi: 'लोकोमोटिव इंजन व उसका चालक मिलकर ‘उद्देश्य’ हैं — वाक्य में किसके विषय में कहा जा रहा है!',
        grammarLinkHindi: 'कर्ता और कर्ता का विस्तार (‘परिश्रमी छात्र’) मिलकर वाक्य का उद्देश्य कहलाता है।',
        grammarLinkEnglish: 'Subject + its modifiers form the Uddeshya (engine).',
      },
      {
        id: 'vv_pred',
        x: 62,
        y: 44,
        labelHindi: 'विधेय (डिब्बे — जो कुछ कहा जाए)',
        clueHindi: 'इंजन के पीछे जुड़े सभी डिब्बे (कर्म, स्थान, समय और क्रिया) मिलकर ‘विधेय’ बनाते हैं।',
        grammarLinkHindi: 'उद्देश्य को छोड़कर शेष पूरा वाक्य (क्रिया सहित) विधेय होता है।',
        grammarLinkEnglish: 'Everything predicated about the subject forms the Vidheya.',
      },
    ],
  },
  'vakya-ashuddhi': {
    primary: simVakyaImg,
    secondary: simKarakImg,
    sceneTitleHindi: 'चित्र-अवलोकन: पटरी के जोड़ (पदक्रम) व वचन-संतुलन जाँच',
    sceneTitleEnglish: 'Visual Scene: Track Alignment & Syntax Repair',
    alt: 'रेलगाड़ी की पटरी व पुल संरचना',
    hotspots: [
      {
        id: 'va_order',
        x: 42,
        y: 62,
        labelHindi: 'सीधी पटरी = सटीक पदक्रम व पुनरुक्ति जाँच',
        clueHindi: 'यदि पटरी में दो पिन एक ही जगह (“कृपया … करने की कृपा करें”) लग जाएँ या क्रम बिगड़े, तो गाड़ी अटकती है!',
        grammarLinkHindi: 'पुनरुक्ति हटाएँ: “कृपया समय पर आएँ” और लिंग-वचन क्रिया से मिलाएँ (“मैंने पुस्तक पढ़ी”)।',
        grammarLinkEnglish: 'Eliminate redundant words and align verb with object gender/number.',
      },
    ],
  },
  'vakya-shuddhi': {
    primary: simVakyaImg,
    secondary: simKarakImg,
    sceneTitleHindi: 'चित्र-अवलोकन: ५-बिंदु वाक्य शुद्धि व पदक्रम निरीक्षक',
    sceneTitleEnglish: 'Visual Scene: 5-Point Syntax & Agreement Inspection',
    alt: 'पुल और रेल-पटरी का संतुलित निर्माण',
    hotspots: [
      {
        id: 'vs5_bridge',
        x: 50,
        y: 55,
        labelHindi: '५-बिंदु संतुलन जाँच (लिंग · वचन · कारक · पुनरुक्ति · पदक्रम)',
        clueHindi: 'पुल के हर खंभे की तरह वाक्य के पाँचों नियम मजबूत हों तभी शुद्ध वाक्य बनता है।',
        grammarLinkHindi: '‘मेरे को’ → ‘मुझे’ · ‘अनेकों’ → ‘अनेक’ · ‘वापस लौट’ → ‘लौट’ (पुनरुक्ति निवारण)।',
        grammarLinkEnglish: 'Checks pronoun form, plural traps, ne-karak verb match, and redundancy.',
      },
    ],
  },
  'vakya-parivartan': {
    primary: simVachyaImg,
    secondary: simVakyaImg,
    sceneTitleHindi: 'चित्र-अवलोकन: अर्थ वही रखकर वाक्य का रूप बदलना',
    sceneTitleEnglish: 'Visual Scene: Reshaping Form While Preserving Meaning',
    alt: 'रंगमंच की रोशनी में खुला ग्रंथ',
    hotspots: [
      {
        id: 'vp_keep',
        x: 50,
        y: 54,
        labelHindi: 'मूल अर्थ (पुस्तक का संदेश अपरिवर्तित)',
        clueHindi: 'रोशनी का कोण बदलने पर भी मेज पर खुला मूल संदेश वही रहता है — बस कहने का ढंग (निषेध/प्रश्न/विस्मय/संयुक्त) बदलता है।',
        grammarLinkHindi: '“यह दृश्य सुंदर है” → निषेध (अर्थ न बदले): “यह दृश्य असुंदर नहीं है।”',
        grammarLinkEnglish: 'Affirmative to negative transformation preserves truth using antonyms.',
      },
    ],
  },
  'visheshan-nirman': {
    primary: simKriyaImg,
    secondary: simShabdRootsImg,
    sceneTitleHindi: 'चित्र-अवलोकन: मिट्टी से घड़ा — संज्ञा से विशेषण निर्माण',
    sceneTitleEnglish: 'Visual Scene: Shaping Nouns into Adjectives',
    alt: 'कच्ची मिट्टी का सुंदर घड़े में रूपांतरण',
    hotspots: [
      {
        id: 'vn_clay',
        x: 52,
        y: 52,
        labelHindi: 'कच्ची संज्ञा (‘समाज/इतिहास’) → घड़ा विशेषण (‘सामाजिक/ऐतिहासिक’)',
        clueHindi: 'जैसे कुम्हार मिट्टी को चाक पर घुमाकर नया आकार देता है, वैसे ही ‘इक, ईय, मान, वान’ प्रत्यय संज्ञा को विशेषण में ढालते हैं।',
        grammarLinkHindi: 'अ → आ (समाज → सामाजिक) · इ → ऐ (इतिहास → ऐतिहासिक) · उ → औ (भूगोल → भौगोलिक)।',
        grammarLinkEnglish: 'Suffix -इक triggers first-syllable vowel strengthening.',
      },
    ],
  },
  'anek-shabd': {
    primary: simSamasImg,
    secondary: simMuhavaraSkyImg,
    sceneTitleHindi: 'चित्र-अवलोकन: लंबे वाक्य को एक सटीक शब्द-मुहर में ढालना',
    sceneTitleEnglish: 'Visual Scene: Condensing Clauses into One Precision Term',
    alt: 'पांडुलिपि और लकड़ी की मुहरें',
    hotspots: [
      {
        id: 'as_seal',
        x: 78,
        y: 35,
        labelHindi: 'एक शब्द की मुहर (‘जो सब कुछ जानता हो’ → सर्वज्ञ)',
        clueHindi: 'पूरे पैराग्राफ की बात को एक सटीक संस्कृत-मूल मुहर (‘ज्ञ’ जानने वाला, ‘जीवी’ जीने वाला) में बंद किया जाता है।',
        grammarLinkHindi: 'अंत के संकेत पहचानें: ‘ज्ञ’ = जानने वाला (अल्पज्ञ/सर्वज्ञ) · ‘अ’ = नहीं (अमर/अदृश्य)।',
        grammarLinkEnglish: 'Root endings (-ज्ञ, -दायी, अ-) compress long descriptions cleanly.',
      },
    ],
  },
  'shabd-bhandar': {
    primary: simShabdRootsImg,
    secondary: simMuhavaraLampImg,
    sceneTitleHindi: 'चित्र-अवलोकन: शब्द-संपदा की चार शाखाएँ',
    sceneTitleEnglish: 'Visual Scene: Four Branches of Vocabulary Mastery',
    alt: 'चमकता प्राचीन ज्ञान-वृक्ष',
    hotspots: [
      {
        id: 'sb_tree',
        x: 50,
        y: 38,
        labelHindi: 'पर्याय · विलोम · अनेकार्थी · वाक्यांश',
        clueHindi: 'एक ही शब्द-वृक्ष से समान अर्थ (पर्याय), विपरीत अर्थ (विलोम), बहु-प्रसंग (अनेकार्थी) और संक्षेपण जुड़ते हैं।',
        grammarLinkHindi: 'शब्द के मूल अर्थ को समझकर इन चारों रूपों का तुरंत निर्माण किया जा सकता है।',
        grammarLinkEnglish: 'Connect synonyms, antonyms, polysemy, and one-word forms from root sense.',
      },
    ],
  },
};

export function getSimulationVisual(moduleId: string): SimulationVisualConfig {
  if (SIMULATION_VISUALS[moduleId]) {
    return SIMULATION_VISUALS[moduleId];
  }
  const gen = GENERIC_MODULE_VISUAL_MAP[moduleId];
  if (gen) {
    return {
      moduleId,
      imageUrl: gen.primary,
      secondaryImageUrl: gen.secondary,
      imageAlt: gen.alt,
      sceneTitleHindi: gen.sceneTitleHindi,
      sceneTitleEnglish: gen.sceneTitleEnglish,
      interpretivePromptHindi:
        'चित्र के चमकते संकेत-बिंदुओं (1, 2) पर क्लिक करके देखें कि यह दृश्य व्याकरण के नियम को कैसे सिद्ध करता है:',
      hotspots: gen.hotspots,
    };
  }
  return {
    moduleId,
    imageUrl: simSamasImg,
    secondaryImageUrl: simShabdRootsImg,
    imageAlt: 'व्याकरण पांडुलिपि और विश्लेषण लेंस',
    sceneTitleHindi: 'चित्र-अवलोकन: व्याकरणिक संरचना और तर्क',
    sceneTitleEnglish: 'Visual Scene: Structural Grammar Inspection',
    interpretivePromptHindi: 'चित्र के संकेत बिंदु पर क्लिक करके दृश्य-आधारित तर्क समझें:',
    hotspots: [
      {
        id: `${moduleId}_clue_1`,
        x: 42,
        y: 52,
        labelHindi: 'संरचना व नियम-आधार',
        clueHindi: 'ध्यानपूर्वक शब्द के मूल खंडों और वाक्य में उसके स्थान का निरीक्षण करें।',
        grammarLinkHindi: 'मूल सिद्धांत और उदाहरण के बीच तार्किक संबंध ही सही उत्तर की कुंजी है।',
        grammarLinkEnglish: 'Inspect root elements and syntactic placement carefully.',
      },
    ],
  };
}

const MUHAVARA_SCENE_POOL = [
  simMuhavaraSkyImg,
  simMuhavaraLampImg,
  simShabdRootsImg,
  simKarakImg,
  simKaalImg,
  simKriyaImg,
  simVachyaImg,
  simVakyaImg,
];

export function getMuhavaraSceneImage(index: number, muhavaraText?: string): string {
  const txt = (muhavaraText || '').toLowerCase();
  if (txt.includes('अँधेरा') || txt.includes('चिराग') || txt.includes('दीया') || txt.includes('रोशनी')) {
    return simMuhavaraLampImg;
  }
  if (txt.includes('आसमान') || txt.includes('चाँद') || txt.includes('तारा') || txt.includes('ईद')) {
    return simMuhavaraSkyImg;
  }
  if (txt.includes('पत्ता') || txt.includes('जड़') || txt.includes('पेड़')) {
    return simShabdRootsImg;
  }
  if (txt.includes('चाक') || txt.includes('कमर') || txt.includes('हाथ') || txt.includes('लोहा')) {
    return simKriyaImg;
  }
  return MUHAVARA_SCENE_POOL[index % MUHAVARA_SCENE_POOL.length];
}
