import { ModelExample, WritingFormatId } from './kathaShilpiData';

export interface InnovativeExample extends ModelExample {
  innovationTechniqueHindi: string;
  innovationTechniqueEnglish: string;
  whyItStandsOutHindi: string;
  whyItStandsOutEnglish: string;
}

export interface FormatSequenceStep {
  id: string;
  labelHindi: string;
  sampleSnippetHindi: string;
  correctOrder: number; // 0-indexed position in accurate ICSE format
}

export interface InnovativeSequenceExercise {
  id: string;
  gradeBand: 'कक्षा 5–7' | 'कक्षा 8–10' | 'सभी कक्षाएँ';
  titleHindi: string;
  titleEnglish: string;
  instructionHindi: string;
  instructionEnglish: string;
  shuffledSteps: FormatSequenceStep[];
  explanationHindi: string;
  explanationEnglish: string;
}

export interface InnovativeCreativeExercise {
  id: string;
  gradeBand: 'कक्षा 5–7' | 'कक्षा 8–10' | 'सभी कक्षाएँ';
  challengeTypeHindi: string;
  challengeTypeEnglish: string;
  scenarioHindi: string;
  scenarioEnglish: string;
  questionHindi: string;
  questionEnglish: string;
  options: { textHindi: string; textEnglish: string }[];
  correctIndex: number;
  explanationHindi: string;
  explanationEnglish: string;
}

export interface FormatInnovationsBundle {
  innovativeExamples: InnovativeExample[];
  sequenceExercise: InnovativeSequenceExercise;
  creativeExercises: InnovativeCreativeExercise[];
}

export const KATHA_SHILPI_INNOVATIONS: Record<WritingFormatId, FormatInnovationsBundle> = {
  nibandh: {
    innovativeExamples: [
      {
        id: 'nb_inn_1',
        gradeBand: 'कक्षा 5–7',
        titleHindi: 'मैं एक पुरानी नदी बोल रही हूँ (आत्मकथात्मक निबंध)',
        titleEnglish: 'I Am an Ancient River Speaking (Autobiographical Essay)',
        promptHindi: 'जल प्रदूषण की समस्या को किसी नदी की आत्मकथा के रूप में लगभग 140 शब्दों में प्रस्तुत कीजिए।',
        promptEnglish: 'Present water pollution innovatively as an autobiographical essay from a river’s POV (~140 words).',
        wordCountApprox: 142,
        innovationTechniqueHindi: 'आत्मकथात्मक दृष्टिकोण (First-Person River POV)',
        innovationTechniqueEnglish: 'Autobiographical Perspective',
        whyItStandsOutHindi:
          'साधारण सूचनात्मक निबंध के बजाय ‘मैं’ शैली में नदी की पीड़ा सुनाने से पाठक भावनात्मक रूप से जुड़ जाता है, जबकि प्रस्तावना-विस्तार-निष्कर्ष की ICSE संरचना पूर्णतः सुरक्षित रहती है।',
        whyItStandsOutEnglish:
          'Personifying the river creates instant emotional resonance while maintaining the strict 3-part ICSE essay structure.',
        blocks: [
          {
            tagHindi: 'नवाचारी शीर्षक',
            tagEnglish: 'Creative Title',
            textHindi: 'मैं एक पुरानी नदी बोल रही हूँ',
            alignment: 'center',
            isHeading: true,
          },
          {
            tagHindi: 'प्रस्तावना (उद्गम व बाल्यकाल)',
            tagEnglish: 'Intro (Origin)',
            textHindi:
              'हिमालय की बर्फीली चोटियों से जब मैं कल-कल करती हुई धरती पर उतरी थी, तब मेरा जल काँच की तरह निर्मल और अमृत समान मीठा था। किसान मेरे तट पर गीत गाते थे और पक्षी मेरी लहरों पर अठखेलियाँ करते थे।',
          },
          {
            tagHindi: 'विषय-विस्तार (वर्तमान पीड़ा)',
            tagEnglish: 'Body (Pollution Crisis)',
            textHindi:
              'परंतु आज जब मैं बड़े शहरों के पास से गुज़रती हूँ, तो मेरा दम घुटने लगता है। कारखानों का काला रसायन, प्लास्टिक की थैलियाँ और नालों की गंदगी ने मेरे स्वच्छ आँचल को मैला कर दिया है। मेरी गोद में पलने वाली मछलियाँ अब जीवन के लिए संघर्ष कर रही हैं।',
          },
          {
            tagHindi: 'उपसंहार (मानव से अपील)',
            tagEnglish: 'Conclusion (Call to Action)',
            textHindi:
              'हे मनुष्य! मैंने सदियों से बिना किसी स्वार्थ के तुम्हारी प्यास बुझाई और खेतों को सींचा है। अब मेरी रक्षा की बारी तुम्हारी है। यदि तुम मुझे स्वच्छ रखोगे, तभी तुम्हारा कल भी सुरक्षित और हरा-भरा रहेगा।',
          },
        ],
        examinerNoteHindi: 'आत्मकथात्मक निबंध ICSE परीक्षा का अत्यंत लोकप्रिय और उच्च-अंक दिलाने वाला नवाचारी रूप है।',
        examinerNoteEnglish: 'Autobiographical essays are an ICSE favorite when kept vivid and structured.',
      },
      {
        id: 'nb_inn_2',
        gradeBand: 'कक्षा 8–10',
        titleHindi: 'कृत्रिम बुद्धिमत्ता (AI) के युग में मानवीय संवेदना',
        titleEnglish: 'Human Empathy in the Age of Artificial Intelligence',
        promptHindi: '‘मशीनें गणना कर सकती हैं, पर करुणा नहीं’ — लगभग 245 शब्दों में एक मौलिक विचारात्मक निबंध लिखिए।',
        promptEnglish: 'Write a ~245-word reflective essay exploring AI capability vs human empathy.',
        wordCountApprox: 242,
        innovationTechniqueHindi: 'दार्शनिक व आधुनिक विज्ञान संश्लेषण (Tech + Philosophy)',
        innovationTechniqueEnglish: 'Tech-Humanities Contrast',
        whyItStandsOutHindi:
          'कक्षा 9–10 में रटे-रटाए विषयों से हटकर आधुनिक AI और भारतीय संवेदना (‘हृदय बनाम मस्तिष्क’) का तुलनात्मक विश्लेषण परीक्षक को तुरंत प्रभावित करता है।',
        whyItStandsOutEnglish:
          'Blends cutting-edge AI examples with timeless ethical depth within ICSE’s 250-word limit.',
        blocks: [
          {
            tagHindi: 'नवाचारी शीर्षक',
            tagEnglish: 'Title',
            textHindi: 'कृत्रिम बुद्धिमत्ता के युग में मानवीय संवेदना',
            alignment: 'center',
            isHeading: true,
          },
          {
            tagHindi: 'प्रस्तावना (रोचक प्रश्न हुक)',
            tagEnglish: 'Hook Intro',
            textHindi:
              'कल्पना कीजिए—एक ऐसा कक्ष जहाँ रोबोट रोगी की नब्ज़ गिन रहा है, कंप्यूटर कविता लिख रहा है और स्मार्ट यंत्र मौसम की सटीक भविष्यवाणी कर रहे हैं। किंतु क्या कोई मशीन किसी रोते हुए बच्चे के आँसू पोंछते समय उसका दर्द भी महसूस कर सकती है? यहीं कृत्रिम बुद्धिमत्ता और मानव हृदय के बीच की लक्ष्मण-रेखा स्पष्ट होती है।',
          },
          {
            tagHindi: 'प्रथम मध्य भाग (बौद्धिक शक्ति)',
            tagEnglish: 'Body 1: Computational Power',
            textHindi:
              'निःसंदेह कृत्रिम बुद्धिमत्ता ने विज्ञान, चिकित्सा और शिक्षा में क्रांति ला दी है। यह कुछ ही सेकंड में करोड़ों आंकड़ों का विश्लेषण कर कठिन रोगों की पहचान कर सकती है। समय की बचत और सटीक गणना में मानव मस्तिष्क से आगे निकलकर इसने असंभव को संभव बनाया है।',
          },
          {
            tagHindi: 'द्वितीय मध्य भाग (संवेदना की श्रेष्ठता)',
            tagEnglish: 'Body 2: Irreplaceable Empathy',
            textHindi:
              'फिर भी, सच्चा साहित्य, संगीत, त्याग, क्षमा और करुणा किसी कोड या एल्गोरिदम से नहीं उपजते। एक माँ की लोरी, सैनिक का देशप्रेम और संकट में मित्र का थाम लिया गया हाथ—ये मानवीय मूल्य किसी यंत्र की स्मृति में नहीं सहेजे जा सकते। यदि मनुष्य केवल स्क्रीन और मशीनों के सहारे जीने लगा, तो समाज यांत्रिक और संवेदनहीन हो जाएगा।',
          },
          {
            tagHindi: 'उपसंहार (सुदृढ़ संश्लेषण)',
            tagEnglish: 'Conclusion',
            textHindi:
              'अतः भविष्य का श्रेष्ठ मार्ग ‘मशीन बनाम मानव’ नहीं, बल्कि ‘संवेदना के साथ तकनीक’ है। हमें बुद्धिमान मशीनों का निर्माण अवश्य करना चाहिए, परंतु अपने भीतर की मानवता और दया को सदैव सर्वोपरि रखना होगा।',
          },
        ],
        examinerNoteHindi: 'सशक्त काल्पनिक दृश्य से आरंभ, संतुलित पक्ष-विपक्ष व प्रभावशाली सूत्रवाक्य (“संवेदना के साथ तकनीक”) पर समापन।',
        examinerNoteEnglish: 'Strong visual opening, balanced dual evaluation, and memorable closing thesis.',
      },
    ],
    sequenceExercise: {
      id: 'nb_seq_1',
      gradeBand: 'सभी कक्षाएँ',
      titleHindi: 'निबंध के नवाचारी अनुच्छेदों को तार्किक ICSE क्रम में सजाएँ',
      titleEnglish: 'Arrange the Essay Blocks into Logical ICSE Sequence',
      instructionHindi: 'नीचे दिए गए 4 अस्त-व्यस्त भागों पर सही क्रम (१ -> ४) में क्लिक करके पूर्ण निबंध बनाएँ।',
      instructionEnglish: 'Click the 4 shuffled essay blocks in exact order (Title -> Intro -> Body -> Conclusion).',
      shuffledSteps: [
        {
          id: 's3',
          labelHindi: 'विषय-विस्तार (चुनौती व तर्क)',
          sampleSnippetHindi: 'किंतु इस सुविधा के अत्यधिक प्रयोग ने लोगों से आपसी बातचीत और स्वास्थ्य छीन लिया है...',
          correctOrder: 2,
        },
        {
          id: 's1',
          labelHindi: 'शीर्षक (Title)',
          sampleSnippetHindi: '‘मौन होते संवाद और बढ़ता स्क्रीन-समय’',
          correctOrder: 0,
        },
        {
          id: 's4',
          labelHindi: 'उपसंहार (संतुलित निष्कर्ष)',
          sampleSnippetHindi: 'अतः तकनीक को अपना सेवक बनाकर रखें और परिवार के साथ ‘स्क्रीन-मुक्त’ समय अवश्य बिताएँ।',
          correctOrder: 3,
        },
        {
          id: 's2',
          labelHindi: 'प्रस्तावना (दृश्य हुक)',
          sampleSnippetHindi: 'आज एक ही कमरे में बैठे चार सदस्य एक-दूसरे से नहीं, बल्कि अपने-अपने फ़ोन से बात कर रहे हैं...',
          correctOrder: 1,
        },
      ],
      explanationHindi: 'सटीक क्रम: १. शीर्षक -> २. संवेदनात्मक प्रस्तावना हुक -> ३. विषय-विस्तार -> ४. समाधानपरक उपसंहार।',
      explanationEnglish: 'Exact order: Title -> Engaging Hook Intro -> Analytical Body -> Constructive Conclusion.',
    },
    creativeExercises: [
      {
        id: 'nb_cr_1',
        gradeBand: 'सभी कक्षाएँ',
        challengeTypeHindi: 'प्रभावशाली आरंभ (Creative Hook Upgrade)',
        challengeTypeEnglish: 'Upgrading a Flat Opening',
        scenarioHindi:
          'एक छात्र ने ‘अंतरिक्ष अन्वेषण’ निबंध की शुरुआत ऐसे की: “अंतरिक्ष बहुत बड़ा है और भारत ने रॉकेट भेजे हैं।” इसे ICSE स्तर का नवाचारी आरंभ बनाना है।',
        scenarioEnglish: 'Upgrade a plain flat opening on "Space Exploration" into an engaging ICSE hook.',
        questionHindi: 'निबंध की प्रस्तावना के लिए सबसे प्रभावशाली व नवाचारी प्रथम वाक्य कौन-सा होगा?',
        questionEnglish: 'Which opening line creates the strongest ICSE impression?',
        options: [
          {
            textHindi:
              'अनंत नीले आकाश की ओर टकटकी लगाकर देखने वाले आदिमानव ने कभी सोचा भी न था कि एक दिन उसके वंशज चंद्रमा के दक्षिणी ध्रुव पर तिरंगा फहराएँगे।',
            textEnglish: 'Connects ancient human curiosity directly to India’s Chandrayaan achievement.',
          },
          {
            textHindi: 'अंतरिक्ष में बहुत तारे हैं और मुझे तारे गिनना पसंद है।',
            textEnglish: 'Too childish and repetitive.',
          },
          {
            textHindi: 'सेवा में, अंतरिक्ष महोदय, आज हम निबंध लिख रहे हैं।',
            textEnglish: 'Wrong format (letter style).',
          },
        ],
        correctIndex: 0,
        explanationHindi:
          'ऐतिहासिक जिज्ञासा से आधुनिक चंद्रयान उपलब्धि को जोड़ना पाठक की रुचि तुरंत जगाता है और निबंध को 15/15 अंक के योग्य बनाता है।',
        explanationEnglish: 'Bridging timeless wonder with modern achievement creates an unforgettable ICSE intro.',
      },
      {
        id: 'nb_cr_2',
        gradeBand: 'कक्षा 8–10',
        challengeTypeHindi: 'आत्मकथात्मक अंत रूपांतरण',
        challengeTypeEnglish: 'Autobiographical Voice Check',
        scenarioHindi: 'आप ‘एक पुराने पुस्तकालय की आत्मकथा’ विषय पर निबंध समाप्त कर रहे हैं।',
        scenarioEnglish: 'Choose the strongest conclusion keeping 1st-person autobiographical consistency.',
        questionHindi: 'प्रथम पुरुष (मैं) की शैली बनाए रखने वाला सटीक उपसंहार चुनें:',
        questionEnglish: 'Select the conclusion that stays true to the Library’s 1st-person voice:',
        options: [
          {
            textHindi:
              'ई-बुक्स के इस तेज़ दौर में भी मुझे विश्वास है कि कागज़ की सोंधी खुशबू से प्रेम करने वाले पाठक मेरी अलमारियों की रौनक कभी कम नहीं होने देंगे।',
            textEnglish: 'Poetic, optimistic, and maintains 1st-person Library persona.',
          },
          {
            textHindi: 'अतः पुस्तकालय एक कमरा है जहाँ किताबें रखी जाती हैं और सभी को पढ़ना चाहिए।',
            textEnglish: 'Breaks 1st-person voice abruptly into 3rd-person.',
          },
          {
            textHindi: 'पुस्तकालय में शोर न करें। भवदीय, पुस्तकालय अध्यक्ष।',
            textEnglish: 'Notice/letter ending mismatch.',
          },
        ],
        correctIndex: 0,
        explanationHindi:
          'आत्मकथात्मक निबंध की सबसे बड़ी कसौटी आरंभ से उपसंहार तक ‘मैं’ (पात्र-स्वर) को सजीव बनाए रखना है।',
        explanationEnglish: 'Autobiographical essays require consistent 1st-person voice through the final sentence.',
      },
    ],
  },

  kahani: {
    innovativeExamples: [
      {
        id: 'kh_inn_1',
        gradeBand: 'कक्षा 5–7',
        titleHindi: 'सोलर लालटेन और दादी का चश्मा (विज्ञान-संवेदनशील कथा)',
        titleEnglish: 'The Solar Lantern and Grandma’s Glasses',
        promptHindi: 'एक ऐसे बालक की कहानी लिखिए जिसने अपने छोटे-से विज्ञान प्रयोग से दूसरों की कठिनाई दूर की।',
        promptEnglish: 'Write an innovative kids story where a small DIY science project solves a real problem.',
        wordCountApprox: 145,
        innovationTechniqueHindi: 'बाल-विज्ञान व मानवीय संवेदना का मेल (STEM Meets Empathy)',
        innovationTechniqueEnglish: 'Everyday Innovation Storytelling',
        whyItStandsOutHindi:
          'पुराने राजा-रानी की कहानियों से हटकर आधुनिक ग्राम्य जीवन व सौर-ऊर्जा प्रयोग को संवादों सहित पिरोना अत्यंत ताज़गी भरा है।',
        whyItStandsOutEnglish:
          'Moves beyond generic fables into relatable modern problem-solving with authentic dialogue.',
        blocks: [
          {
            tagHindi: 'नवाचारी शीर्षक',
            tagEnglish: 'Title',
            textHindi: 'सोलर लालटेन और दादी का चश्मा',
            alignment: 'center',
            isHeading: true,
          },
          {
            tagHindi: 'आरंभ',
            tagEnglish: 'Beginning',
            textHindi:
              'सोनपुर गाँव में शाम ढलते ही अक्सर बिजली चली जाती थी। दस वर्षीय ईशान की दादी को आँखों की कमज़ोरी के कारण अँधेरे में सुई में धागा पिरोने व अपनी रामायण पढ़ने में बड़ी कठिनाई होती थी। यह देखकर ईशान का मन उदास हो जाता था।',
          },
          {
            tagHindi: 'नवाचारी प्रयास व संवाद',
            tagEnglish: 'Innovation & Dialogue',
            textHindi:
              'विद्यालय के विज्ञान मेले से प्रेरणा लेकर ईशान ने अपनी बचत के पैसों से एक छोटा सौर पैनल, पुरानी बैटरी और एलईडी बल्ब खरीदे। पूरे सप्ताह धूप में परीक्षण करने के बाद उसने एक सुंदर ‘सोलर लालटेन’ तैयार की। शाम को जब बिजली गई, तो ईशान ने बटन दबाया और पूरा आँगन दूधिया रोशनी से जगमगा उठा। दादी ने चश्मा ठीक करते हुए मुस्कुराकर पूछा, “अरे वाह! यह जादुई चिराग कहाँ से लाए, ईशान?”',
          },
          {
            tagHindi: 'अंत व सीख',
            tagEnglish: 'Resolution & Moral',
            textHindi:
              'ईशान बोला, “दादी, यह जादू नहीं, सूरज की धूप से बना विज्ञान का उपहार है।” धीरे-धीरे उसने मोहल्ले के कई घरों में ऐसी लालटेनें बनाने में मदद की।\nसीख: सच्चा ज्ञान वही है जो किसी के जीवन से अँधेरा मिटाकर उजाला ला दे।',
          },
        ],
        examinerNoteHindi: 'आधुनिक परिवेश, सहज संवाद व विज्ञान के सामाजिक उपयोग का प्रेरणादायी संदेश।',
        examinerNoteEnglish: 'Modern setting, lively dialogue, and a crisp moral on purposeful science.',
      },
      {
        id: 'kh_inn_2',
        gradeBand: 'कक्षा 8–10',
        titleHindi: 'बंद लिफ़ाफ़े का रहस्य (प्रत्याशित मोड़ — Twist Ending)',
        titleEnglish: 'The Mystery of the Sealed Envelope',
        promptHindi: 'एक ऐसी कहानी लिखिए जिसमें संदेह धीरे-धीरे विश्वास और कृतज्ञता में बदल जाए। (लगभग 240 शब्द)',
        promptEnglish: 'Write a 240-word ICSE story with a suspense buildup and heartwarming twist ending.',
        wordCountApprox: 238,
        innovationTechniqueHindi: 'संदेह निर्माण और अप्रत्याशित मोड़ (Suspense & Surprise Twist)',
        innovationTechniqueEnglish: 'Suspense Arc + Meaningful Twist',
        whyItStandsOutHindi:
          'ICSE बोर्ड की 15 अंकों की कहानी में शुरुआत में छोटा-सा रहस्य बुनकर अंत में संवेदनशील मोड़ देने से पाठक अंत तक बंधा रहता है।',
        whyItStandsOutEnglish:
          'Hook mystery + psychological reveal creates high narrative engagement without losing plausibility.',
        blocks: [
          {
            tagHindi: 'नवाचारी शीर्षक',
            tagEnglish: 'Title',
            textHindi: 'बंद लिफ़ाफ़े का रहस्य',
            alignment: 'center',
            isHeading: true,
          },
          {
            tagHindi: 'आरंभ (रहस्य हुक)',
            tagEnglish: 'Mystery Hook',
            textHindi:
              'तेज़ बरसात की उस रात रेलवे स्टेशन के प्रतीक्षालय में राघव अपने बैग को कसकर थामे बैठा था। कल उसकी बहन के कॉलेज की फ़ीस जमा करने का अंतिम दिन था और बैग में बीस हज़ार रुपये रखे थे। अचानक किसी के धक्के से उसका ध्यान भटका और कुछ ही पलों बाद उसने देखा कि बैग के पास बैठा एक मज़दूर जैसा दिखने वाला वृद्ध व्यक्ति कहीं गायब हो चुका था।',
          },
          {
            tagHindi: 'तनाव व संदेह',
            tagEnglish: 'Rising Tension',
            textHindi:
              'राघव का कलेजा मुँह को आ गया। उसने घबराकर बैग की चेन खोली—भीतर रखा रुपयों का खाकी लिफ़ाफ़ा सचमुच नदारद था! वह चिल्लाता हुआ प्लेटफॉर्म पर दौड़ा, किंतु भीड़ में वह वृद्ध कहीं नज़र न आया। निराश होकर राघव बारिश में भीगता हुआ घर लौट आया। पूरी रात वह अपनी लापरवाही को कोसता रहा।',
          },
          {
            tagHindi: 'अप्रत्याशित मोड़ व समाधान',
            tagEnglish: 'The Twist Reveal',
            textHindi:
              'अगली सुबह जब उसने दरवाज़ा खोला, तो चौखट पर ठीक वही खाकी लिफ़ाफ़ा और उसके ऊपर एक मुड़ी हुई पर्ची रखी थी। काँपते हाथों से राघव ने पर्ची खोली—लिखा था: “बेटा, कल तुम्हारे खुले बैग से यह लिफ़ाफ़ा नीचे गिर गया था। तुम्हारी पीठ मुड़ी थी, मैं आवाज़ देता तब तक तुम चल दिए। तुम्हारी पते की पर्ची अंदर थी, सो सुबह पहली गाड़ी पकड़कर सीधे घर पहुँचाने आ गया। गिन लेना!” राघव की आँखों से संदेह के बादल छँट गए और पश्चाताप व श्रद्धा के आँसू बह निकले।',
          },
          {
            tagHindi: 'सीख',
            tagEnglish: 'Moral',
            textHindi: 'सीख: किसी के बाहरी पहनावे को देखकर उसके चरित्र पर संदेह नहीं करना चाहिए; ईमानदारी आज भी जीवित है।',
          },
        ],
        examinerNoteHindi: 'तेज़ गति, सस्पेंस, मानवीय मोड़ व सटीक भूतकाल संगति के कारण यह ICSE परीक्षा हेतु श्रेष्ठ उदाहरण है।',
        examinerNoteEnglish: 'Crisp pacing, grounded realism, and powerful emotional reversal.',
      },
    ],
    sequenceExercise: {
      id: 'kh_seq_1',
      gradeBand: 'सभी कक्षाएँ',
      titleHindi: 'कहानी के कथा-क्रम (Plot Arc) को सटीक क्रम में जोड़ें',
      titleEnglish: 'Reconstruct the Story Plot Sequence',
      instructionHindi: 'अस्त-व्यस्त दिए गए कहानी के 5 चरणों को आरंभ से सीख तक सही क्रम में क्लिक करें।',
      instructionEnglish: 'Tap the 5 shuffled narrative stages in exact chronological order.',
      shuffledSteps: [
        {
          id: 'k3',
          labelHindi: 'समस्या व संवाद (Climax)',
          sampleSnippetHindi: 'रास्ते में रोबोट का चक्का कीचड़ में फँस गया। आरव बोला, “डरो मत, हम मिलकर इसे बाहर निकालेंगे!”',
          correctOrder: 2,
        },
        {
          id: 'k1',
          labelHindi: 'शीर्षक (Title)',
          sampleSnippetHindi: '‘कबाड़ से बना कमाल का रोबोट’',
          correctOrder: 0,
        },
        {
          id: 'k5',
          labelHindi: 'सीख (Moral)',
          sampleSnippetHindi: 'सीख: रचनात्मक सोच से बेकार वस्तुएँ भी अमूल्य संसाधन बन सकती हैं।',
          correctOrder: 4,
        },
        {
          id: 'k2',
          labelHindi: 'आरंभ व पात्र (Setup)',
          sampleSnippetHindi: 'कक्षा सात के आरव ने पुरानी मोटर और गत्ते से एक सफ़ाई रोबोट बनाना शुरू किया।',
          correctOrder: 1,
        },
        {
          id: 'k4',
          labelHindi: 'समाधान व अंत (Resolution)',
          sampleSnippetHindi: 'दोनों मित्रों ने पहियों पर रबड़ की पट्टी लगाई और रोबोट ने विज्ञान प्रदर्शनी में प्रथम पुरस्कार जीता।',
          correctOrder: 3,
        },
      ],
      explanationHindi: 'कहानी का सटीक ढाँचा: १. शीर्षक -> २. आरंभ/पात्र -> ३. संकट व संवाद -> ४. समाधान -> ५. सीख।',
      explanationEnglish: 'Narrative flow: Title -> Character Setup -> Conflict & Dialogue -> Resolution -> Moral.',
    },
    creativeExercises: [
      {
        id: 'kh_cr_1',
        gradeBand: 'सभी कक्षाएँ',
        challengeTypeHindi: 'दृश्यात्मक लेखन (Show, Don’t Just Tell)',
        challengeTypeEnglish: 'Sensory Detail Upgrade',
        scenarioHindi: 'नीरस वाक्य: “रीमा को मंच पर जाते हुए बहुत डर लगा।” इसे रोचक कहानी की पंक्ति बनाना है।',
        scenarioEnglish: 'Turn "Reema was scared going on stage" into vivid storytelling.',
        questionHindi: 'कौन-सा विकल्प ‘दिखाने’ (Show, Don’t Tell) की नवाचारी तकनीक से डर को जीवंत करता है?',
        questionEnglish: 'Which sentence conveys stage fright vividly through sensory imagery?',
        options: [
          {
            textHindi:
              'मंच की तेज़ रोशनी में कदम रखते ही रीमा के हाथ ठंडे पड़ गए, माइक थामते समय उसकी साँस मानो थम-सी गई और शब्दों ने गले में ही डेरा डाल लिया।',
            textEnglish: 'Uses physical & sensory reactions instead of simply stating "she was scared".',
          },
          {
            textHindi: 'रीमा को डर लगा क्योंकि डर एक बुरी भावना होती है।',
            textEnglish: 'Dry essay definition.',
          },
          {
            textHindi: 'विषय: रीमा का डर। सविनय निवेदन है कि रीमा डर गई।',
            textEnglish: 'Formal letter format.',
          },
        ],
        correctIndex: 0,
        explanationHindi:
          'पात्र की धड़कन, ठंडे हाथ और माइक पकड़ने की झिझक दिखाने से पाठक उस दृश्य को स्वयं अनुभव करता है।',
        explanationEnglish: 'Showing physical sensations immerses the reader inside the scene.',
      },
      {
        id: 'kh_cr_2',
        gradeBand: 'कक्षा 8–10',
        challengeTypeHindi: 'प्रत्याशित मोड़ चयन (Meaningful Twist)',
        challengeTypeEnglish: 'Crafting a Logical Climax Twist',
        scenarioHindi:
          'कहानी में दो प्रतिद्वंद्वी तैराक नेहा और तारा फाइनल रेस में एक साथ तैर रही हैं। नेहा आगे है पर तारा की साँस फूलने लगती है।',
        scenarioEnglish: 'Choose the most authentic, moving ICSE ending without illogical miracles.',
        questionHindi: 'कहानी का सबसे स्वाभाविक और हृदयस्पर्शी अंत कौन-सा होगा?',
        questionEnglish: 'Which resolution feels realistic and impactful?',
        options: [
          {
            textHindi:
              'स्वर्ण पदक से मात्र कुछ मीटर दूर होने पर भी नेहा वापस मुड़ी, तारा को सहारा देकर किनारे लाई और दोनों की सद्भावना देख पूरा स्टेडियम गूँज उठा।',
            textEnglish: 'Realistic human sacrifice creating true emotional victory.',
          },
          {
            textHindi: 'अचानक एक उड़ती हुई परी आई और दोनों को जादुई छड़ी से किनारे फेंक दिया।',
            textEnglish: 'Implausible fairy-tale deus ex machina.',
          },
          {
            textHindi: 'तारा डूब गई और नेहा मेडल लेकर घर जाकर टीवी देखने लगी।',
            textEnglish: 'Cruel and lacks positive moral growth.',
          },
        ],
        correctIndex: 0,
        explanationHindi:
          'ICSE कहानी में ‘मनुष्य की नैतिक विजय’ वास्तविक घटनाओं के भीतर दिखाई जाती है, न कि जादुई चमत्कारों से।',
        explanationEnglish: 'Grounded human empathy beats implausible miracles in ICSE story evaluation.',
      },
    ],
  },

  anuched: {
    innovativeExamples: [
      {
        id: 'an_inn_1',
        gradeBand: 'कक्षा 5–7',
        titleHindi: 'मेरी छत की छोटी बगिया (इंद्रिय-चित्रण एकल अनुच्छेद)',
        titleEnglish: 'My Small Rooftop Garden (Sensory Single Paragraph)',
        promptHindi: 'संकेत-बिंदु: गमलों की दुनिया • सुबह की महक • पक्षियों का आगमन • पर्यावरण व मन की शांति। (~95 शब्द)',
        promptEnglish: 'Write an innovative sensory 95-word single paragraph about a rooftop garden.',
        wordCountApprox: 94,
        hintPoints: ['गमलों की दुनिया', 'ताज़ी महक व हरियाली', 'गौरैया-तितलियाँ', 'मानसिक शांति'],
        innovationTechniqueHindi: 'पंचेंद्रिय चित्रण (Five-Senses Imagery inside One Paragraph)',
        innovationTechniqueEnglish: 'Sensory Single-Block Cohesion',
        whyItStandsOutHindi:
          'तुलसी, पुदीने की महक, रंग-बिरंगी तितलियों व गौरैया की चहचहाहट को बिना पैराग्राफ तोड़े एक ही माला में पिरोया गया है।',
        whyItStandsOutEnglish:
          'Demonstrates how vivid sight, smell, and sound elevate an ordinary paragraph while obeying the 1-paragraph rule.',
        blocks: [
          { tagHindi: 'शीर्षक', tagEnglish: 'Title', textHindi: 'मेरी छत की छोटी बगिया', alignment: 'center', isHeading: true },
          {
            tagHindi: 'एकल नवाचारी अनुच्छेद',
            tagEnglish: 'Single Unified Paragraph',
            textHindi:
              'बड़े शहरों के संकरे घरों में भी हरियाली उगाई जा सकती है, इसका जीवंत प्रमाण मेरे घर की छत पर बसी नन्हीं बगिया है। पुराने डिब्बों व मिट्टी के गमलों में लगी तुलसी, पुदीने और गुलाब की सौंधी महक हर सुबह मन को तरोताज़ा कर देती है। टमाटर और मिर्च के पौधों पर लटके लाल-हरे फल मेहनत का मीठा स्वाद चखाते हैं। जब इन फूलों पर रंग-बिरंगी तितलियाँ मँडराती हैं और गौरैया आकर मधुर चहचहाती है, तो छत किसी प्राकृतिक उपवन से कम नहीं लगती। यह छोटी-सी हरित पट्टी न केवल घर के तापमान को ठंडा रखती है, बल्कि तनाव भगाकर प्रकृति से जुड़ने का अद्भुत सुख भी देती है।',
          },
        ],
        examinerNoteHindi: 'बिना एक भी पंक्ति तोड़े कचरे के पुनरुपयोग (पुराने डिब्बे) व प्रकृति-प्रेम का अनूठा संगम।',
        examinerNoteEnglish: 'Integrates upcycling and sensory richness seamlessly in a single 94-word paragraph.',
      },
      {
        id: 'an_inn_2',
        gradeBand: 'कक्षा 8–10',
        titleHindi: 'अंतरिक्ष कचरा: आसमान की अनदेखी समस्या',
        titleEnglish: 'Space Debris: The Unseen Problem in the Sky',
        promptHindi: 'संकेत-बिंदु: टूटे उपग्रह के टुकड़े • तेज़ गति से टकराने का ख़तरा • वैज्ञानिक समाधान। (~112 शब्द)',
        promptEnglish: 'Write a 112-word single paragraph on orbital space debris and clean space solutions.',
        wordCountApprox: 112,
        hintPoints: ['उपग्रहों के अवशेष', 'सोलर व संचार खतरा', 'सफाई मिशन व नियम'],
        innovationTechniqueHindi: 'आधुनिक STEM विषय + सटीक उपमा (Modern STEM Analogy)',
        innovationTechniqueEnglish: 'Modern STEM Topic in Tight Prose',
        whyItStandsOutHindi:
          'पृथ्वी के प्रदूषण से एक कदम आगे बढ़कर अंतरिक्ष कचरे जैसे ताज़ा वैज्ञानिक विषय को संक्षिप्त 112 शब्दों में सटीक उपमा के साथ समझाया गया है।',
        whyItStandsOutEnglish:
          'Transforms a complex astrophysics topic into crisp, accessible ICSE Hindi prose within 112 words.',
        blocks: [
          {
            tagHindi: 'शीर्षक',
            tagEnglish: 'Title',
            textHindi: 'अंतरिक्ष कचरा: आसमान की अनदेखी समस्या',
            alignment: 'center',
            isHeading: true,
          },
          {
            tagHindi: 'एकल अनुच्छेद',
            tagEnglish: 'Single Cohesive Paragraph',
            textHindi:
              'मनुष्य ने धरती ही नहीं, अब पृथ्वी के चारों ओर फैले अंतरिक्ष को भी अपने कचरे से भरना शुरू कर दिया है। दशकों से भेजे गए पुराने निष्क्रिय उपग्रह, रॉकेट के टूटे हिस्से और छोटे-छोटे धातु के टुकड़े हज़ारों किलोमीटर प्रति घंटे की रफ़्तार से हमारी कक्षा में घूम रहे हैं। इतनी तीव्र गति के कारण सुई के बराबर एक छोटा टुकड़ा भी किसी कार्यरत संचार या मौसम उपग्रह से टकराकर उसे नष्ट कर सकता है। इससे हमारी इंटरनेट, जीपीएस और मौसम प्रणाली बाधित हो सकती है। सुखद बात यह है कि अब वैज्ञानिक अंतरिक्ष को स्वच्छ रखने हेतु चुंबकीय जाल और लेज़र तकनीक विकसित कर रहे हैं, ताकि ब्रह्मांड भी स्वच्छ बना रहे।',
          },
        ],
        examinerNoteHindi: 'स्पष्ट तकनीकी तथ्य (“सुई के बराबर टुकड़ा”), कोई उपशीर्षक नहीं और सटीक एक-अनुच्छेद विन्यास।',
        examinerNoteEnglish: 'Crisp analogy, zero subheadings, strict single-paragraph adherence.',
      },
    ],
    sequenceExercise: {
      id: 'an_seq_1',
      gradeBand: 'सभी कक्षाएँ',
      titleHindi: 'एकल अनुच्छेद के वाक्यों को तार्किक प्रवाह में जोड़ें',
      titleEnglish: 'Order the Sentences into a Seamless Single Paragraph',
      instructionHindi: 'दिए गए 4 वाक्यों को क्रम से चुनकर एक सुगठित अनुच्छेद का निर्माण करें।',
      instructionEnglish: 'Click the 4 sentences in exact logical flow (Title/Topic -> Cause -> Impact -> Conclusion).',
      shuffledSteps: [
        {
          id: 'a3',
          labelHindi: 'संयुक्त परिणाम (Impact)',
          sampleSnippetHindi: 'नतीजतन, आज बच्चों की नींद, नेत्र-स्वास्थ्य और एकाग्रता पर गंभीर असर पड़ रहा है।',
          correctOrder: 2,
        },
        {
          id: 'a1',
          labelHindi: 'विषय-प्रवेश वाक्य (Topic Sentence)',
          sampleSnippetHindi: 'डिजिटल युग में ‘ई-स्पोर्ट्स व ऑनलाइन गेमिंग’ मनोरंजन का प्रमुख साधन बन चुके हैं।',
          correctOrder: 0,
        },
        {
          id: 'a4',
          labelHindi: 'निष्कर्ष सूत्र (Takeaway)',
          sampleSnippetHindi: 'अतः आवश्यक है कि स्क्रीन-समय सीमित रखकर मैदानी खेलों को प्राथमिकता दी जाए।',
          correctOrder: 3,
        },
        {
          id: 'a2',
          labelHindi: 'समस्या का कारण (Cause/Contrast)',
          sampleSnippetHindi: 'किंतु जब यह खेल घंटों की लत में बदल जाए, तो विद्यार्थी वास्तविक दुनिया से कटने लगते हैं।',
          correctOrder: 1,
        },
      ],
      explanationHindi: 'प्रभावी एकल अनुच्छेद का सूत्र: परिचय -> कारण/विस्तार -> प्रभाव -> संतुलित निष्कर्ष।',
      explanationEnglish: 'Paragraph unity moves smoothly: Topic -> Nuance/Cause -> Impact -> Solution.',
    },
    creativeExercises: [
      {
        id: 'an_cr_1',
        gradeBand: 'सभी कक्षाएँ',
        challengeTypeHindi: 'हेडिंग-मुक्त विलय (Merging Hints Seamlessly)',
        challengeTypeEnglish: 'Eliminating Forbidden Subheadings',
        scenarioHindi:
          'एक छात्र ने तीन संकेत-बिंदुओं के लिए अलग-अलग हेडिंग लिख दीं: “१. परिचय: खेल अच्छे हैं। २. लाभ: शरीर स्वस्थ रहता है। ३. निष्कर्ष: रोज़ खेलें।”',
        scenarioEnglish: 'Transform 3 rigid headings into one seamless ICSE Anuched flow.',
        questionHindi: 'इन तीनों संकेत-बिंदुओं को जोड़ने का सही व नवाचारी ICSE तरीका कौन-सा है?',
        questionEnglish: 'Which option merges all 3 hints cleanly into ONE paragraph?',
        options: [
          {
            textHindi:
              'खेल जीवन में आनंद और ऊर्जा के संचार का श्रेष्ठ माध्यम हैं, क्योंकि नियमित खेलकूद न केवल हमारे शरीर को स्वस्थ व स्फूर्तिवान रखते हैं, अपितु हमें टीम-भावना और अनुशासन सिखाकर एक सफल व्यक्तित्व भी गढ़ते हैं।',
            textEnglish: 'Weaves every hint using cohesive connectors inside one uninterrupted paragraph.',
          },
          {
            textHindi: 'शीर्षक १: परिचय\nशीर्षक २: लाभ\nशीर्षक ३: निष्कर्ष।',
            textEnglish: 'Keeps subheadings (invalid in Anuched).',
          },
          {
            textHindi: '• खेल अच्छे हैं  • सेहत बनती है  • रोज़ खेलो।',
            textEnglish: 'Bullet-list format (wrong for Anuched).',
          },
        ],
        correctIndex: 0,
        explanationHindi:
          '‘क्योंकि’, ‘न केवल... अपितु’ जैसे संयोजकों से अलग-अलग संकेत-बिंदु बिना हेडिंग के सुंदर गद्य बन जाते हैं।',
        explanationEnglish: 'Cohesive conjunctions fuse multiple cues into effortless single-paragraph prose.',
      },
      {
        id: 'an_cr_2',
        gradeBand: 'कक्षा 8–10',
        challengeTypeHindi: 'संक्षिप्तीकरण कौशल (Concise Synthesis)',
        challengeTypeEnglish: 'Trimming Wordiness for 100-Word Limit',
        scenarioHindi:
          'वाक्य है: “प्लास्टिक जो कि आजकल हर जगह बहुत ज्यादा इस्तेमाल किया जा रहा है और जो कभी नष्ट नहीं होता है और मिट्टी को खराब कर देता है, हमें उसका प्रयोग नहीं करना चाहिए।” (31 शब्द)',
        scenarioEnglish: 'Tighten a bloated 31-word sentence into crisp ICSE Anuched style.',
        questionHindi: 'समान अर्थ वाला सबसे सघन और प्रभावशाली संक्षिप्त रूप चुनें:',
        questionEnglish: 'Select the sharpest concise rewrite:',
        options: [
          {
            textHindi:
              'मिट्टी की उर्वरता नष्ट करने वाले अविनाशी प्लास्टिक का बहिष्कार करना अब अनिवार्य है।',
            textEnglish: 'Says everything cleanly in 13 crisp words with strong vocabulary.',
          },
          {
            textHindi: 'प्लास्टिक अच्छा नहीं है, प्लास्टिक गंदा है, प्लास्टिक मत लो।',
            textEnglish: 'Repetitive and weak.',
          },
          {
            textHindi: 'सूचित किया जाता है कि प्लास्टिक बंद है।',
            textEnglish: 'Notice style.',
          },
        ],
        correctIndex: 0,
        explanationHindi:
          'विशेषण (“अविनाशी प्लास्टिक”) और सटीक शब्द (“उर्वरता”, “बहिष्कार”) प्रयोग करके 31 शब्दों की बात 13 शब्दों में अधिक सुंदर ढंग से कही गई।',
        explanationEnglish: 'Strong modifiers compress wordy clauses into punchy ICSE prose.',
      },
    ],
  },

  patra_formal: {
    innovativeExamples: [
      {
        id: 'pf_inn_1',
        gradeBand: 'कक्षा 5–7',
        titleHindi: 'विद्यालय में ‘बस्ता-मुक्त शनिवार’ व नवाचार-प्रयोगशाला हेतु प्रधानाचार्य को पत्र',
        titleEnglish: 'Proposal to Principal for Bagless Saturday & Innovation Lab',
        promptHindi:
          'अपने विद्यालय के प्रधानाचार्य को माह में एक ‘बस्ता-मुक्त रचनात्मक शनिवार’ तथा बागवानी/विज्ञान गतिविधि आरंभ करने का विनम्र सुझाव देते हुए पत्र लिखिए।',
        promptEnglish:
          'Write an innovative formal application proposing a monthly Bagless Creative Saturday to your Principal.',
        wordCountApprox: 112,
        innovationTechniqueHindi: 'रचनात्मक छात्र-प्रस्ताव शैली (Constructive Student Proposal)',
        innovationTechniqueEnglish: 'Solution-Oriented Application',
        whyItStandsOutHindi:
          'केवल अवकाश या शिकायत के बजाय विद्यालय की भलाई हेतु रचनात्मक प्रस्ताव रखना, और वह भी शत-प्रतिशत बाएँ-संरेखित ICSE प्रारूप में, इसे अनूठा बनाता है।',
        whyItStandsOutEnglish:
          'Shows students how to write forward-looking proposals while keeping strict ICSE left-alignment.',
        blocks: [
          { tagHindi: 'प्रेषक पता', tagEnglish: 'Sender Address', textHindi: 'परीक्षा भवन,\nअ.ब.स. नगर।', alignment: 'left' },
          { tagHindi: 'दिनांक', tagEnglish: 'Date', textHindi: '18 नवंबर, 2026', alignment: 'left' },
          {
            tagHindi: 'प्रापक',
            tagEnglish: 'Recipient',
            textHindi: 'सेवा में,\nप्रधानाचार्य महोदय,\nक.ख.ग. पब्लिक विद्यालय, अ.ब.स. नगर।',
            alignment: 'left',
          },
          {
            tagHindi: 'विषय',
            tagEnglish: 'Subject',
            textHindi: 'विषय: विद्यालय में ‘बस्ता-मुक्त रचनात्मक शनिवार’ प्रारंभ करने के संबंध में।',
            alignment: 'left',
            isHeading: true,
          },
          { tagHindi: 'संबोधन', tagEnglish: 'Salutation', textHindi: 'महोदय,', alignment: 'left' },
          {
            tagHindi: 'मुख्य विषय-वस्तु',
            tagEnglish: 'Body',
            textHindi:
              'सविनय निवेदन यह है कि मैं आपके विद्यालय की कक्षा सात का छात्र और छात्र-परिषद का सदस्य हूँ। जैसा कि नई शिक्षा नीति में व्यावहारिक ज्ञान पर बल दिया गया है, हम सभी विद्यार्थी चाहते हैं कि प्रत्येक माह के अंतिम शनिवार को ‘बस्ता-मुक्त दिवस’ के रूप में मनाया जाए।\n\nइस दिन बिना भारी बस्ते लाए हम सब बागवानी, मिट्टी के बर्तन बनाने, विज्ञान के छोटे मॉडल तथा प्राथमिक चिकित्सा जैसी जीवनोपयोगी कलाएँ सीख सकेंगे। इससे पढ़ाई का तनाव कम होगा और रचनात्मकता बढ़ेगी। आशा है आप हमारे इस विनम्र प्रस्ताव पर सहानुभूतिपूर्वक विचार करेंगे।',
            alignment: 'left',
          },
          {
            tagHindi: 'अभिनिवेदन',
            tagEnglish: 'Subscription',
            textHindi: 'सधन्यवाद।\nआपका आज्ञाकारी शिष्य,\nक.ख.ग.\nकक्षा — सात',
            alignment: 'left',
          },
        ],
        examinerNoteHindi: 'सकारात्मक छात्र-पहल, सटीक औपचारिक विनम्रता और ICSE बाएँ प्रारूप का शत-प्रतिशत पालन।',
        examinerNoteEnglish: 'Polite constructive proposal following every ICSE formal letter rule.',
      },
      {
        id: 'pf_inn_2',
        gradeBand: 'कक्षा 8–10',
        titleHindi: 'ई-कचरा संग्रहण पेटी एवं सौर स्ट्रीट-लाइट हेतु नगर निगम आयुक्त को पत्र',
        titleEnglish: 'Letter to Municipal Commissioner for E-Waste Bins & Solar Streetlights',
        promptHindi:
          'अपने क्षेत्र में बढ़ते इलेक्ट्रॉनिक कचरे के सुरक्षित निपटान हेतु ‘ई-कचरा पेटी’ और सौर ऊर्जा लाइटें लगवाने हेतु नगर निगम आयुक्त को लगभग 125 शब्दों में पत्र लिखिए।',
        promptEnglish: 'Write a 125-word ICSE formal letter proposing municipal e-waste bins & solar lights.',
        wordCountApprox: 124,
        innovationTechniqueHindi: 'स्मार्ट-सिटी नागरिक सुझाव (Modern Eco-Civic Advocacy)',
        innovationTechniqueEnglish: 'Eco-Civic Formal Letter',
        whyItStandsOutHindi:
          'केवल नाली-सड़क की शिकायत से आगे बढ़कर ई-कचरे (बैटरी, टूटे चार्जर) जैसे आधुनिक पर्यावरणीय मुद्दे पर ठोस सुझाव के साथ पत्र लिखा गया है।',
        whyItStandsOutEnglish:
          'Tackles modern e-waste hazards with actionable municipal solutions inside the 120-word ICSE window.',
        blocks: [
          { tagHindi: 'प्रेषक पता', tagEnglish: 'Sender Address', textHindi: 'परीक्षा भवन,\nअ.ब.स. नगर।', alignment: 'left' },
          { tagHindi: 'दिनांक', tagEnglish: 'Date', textHindi: '18 नवंबर, 2026', alignment: 'left' },
          {
            tagHindi: 'प्रापक',
            tagEnglish: 'Recipient',
            textHindi: 'सेवा में,\nनगर निगम आयुक्त महोदय,\nअ.ब.स. नगर निगम।',
            alignment: 'left',
          },
          {
            tagHindi: 'विषय',
            tagEnglish: 'Subject',
            textHindi: 'विषय: मोहल्ले में ‘ई-कचरा संग्रहण पेटी’ तथा सौर ऊर्जा लाइटें लगवाने हेतु।',
            alignment: 'left',
            isHeading: true,
          },
          { tagHindi: 'संबोधन', tagEnglish: 'Salutation', textHindi: 'महोदय,', alignment: 'left' },
          {
            tagHindi: 'मुख्य विषय-वस्तु',
            tagEnglish: 'Body',
            textHindi:
              'इस पत्र के माध्यम से मैं आपका ध्यान विवेक विहार क्षेत्र में उत्पन्न हो रहे इलेक्ट्रॉनिक कचरे की गंभीर समस्या की ओर दिलाना चाहता हूँ। लोग जानकारी के अभाव में खराब बैटरियाँ, टूटे मोबाइल चार्जर और सीएफएल बल्ब सामान्य कूड़ेदान में फेंक रहे हैं, जिससे मिट्टी और भूजल विषैले हो रहे हैं।\n\nमेरा विनम्र सुझाव है कि क्षेत्र के मुख्य चौक पर एक अलग ‘ई-कचरा संग्रहण पेटी’ रखवाई जाए, ताकि इसका सुरक्षित पुनर्चक्रण हो सके। साथ ही, मुख्य मार्ग पर बिजली कटौती से बचने हेतु सौर ऊर्जा संचालित एलईडी लाइटें लगवाने की कृपा करें। हम स्थानीय युवा इस स्वच्छता अभियान में पूर्ण सहयोग देंगे।',
            alignment: 'left',
          },
          {
            tagHindi: 'अभिनिवेदन',
            tagEnglish: 'Subscription',
            textHindi: 'सधन्यवाद।\nभवदीय,\nक.ख.ग.',
            alignment: 'left',
          },
        ],
        examinerNoteHindi: 'आधुनिक ई-कचरा विषय, स्पष्ट समस्या-समाधान युग्म और निगम अधिकारी के लिए सटीक “भवदीय” समापन।',
        examinerNoteEnglish: 'Modern civic problem + clear recommendation + exact "भवदीय" subscription.',
      },
    ],
    sequenceExercise: {
      id: 'pf_seq_1',
      gradeBand: 'सभी कक्षाएँ',
      titleHindi: 'नए ICSE औपचारिक पत्र के 7 अंगों को ऊपर से नीचे सही क्रम में लगाएँ',
      titleEnglish: 'Order the 7 ICSE Left-Aligned Formal Letter Blocks',
      instructionHindi: 'नवीनतम ICSE बाएँ प्रारूप के अनुसार औपचारिक पत्र के इन 7 भागों पर क्रमशः (१ से ७) क्लिक करें।',
      instructionEnglish: 'Click all 7 formal letter blocks in exact top-to-bottom ICSE order.',
      shuffledSteps: [
        { id: 'f4', labelHindi: 'विषय (Subject)', sampleSnippetHindi: 'विषय: विद्यालय में स्वच्छ पेयजल व्यवस्था हेतु।', correctOrder: 3 },
        { id: 'f2', labelHindi: 'दिनांक (Date)', sampleSnippetHindi: '18 नवंबर, 2026', correctOrder: 1 },
        { id: 'f6', labelHindi: 'मुख्य विषय-वस्तु (Body)', sampleSnippetHindi: 'सविनय निवेदन यह है कि हमारे खंड के वाटर-कूलर खराब हैं...', correctOrder: 5 },
        { id: 'f1', labelHindi: 'प्रेषक का पता (Sender)', sampleSnippetHindi: 'परीक्षा भवन, अ.ब.स. नगर।', correctOrder: 0 },
        { id: 'f7', labelHindi: 'अभिनिवेदन व नाम', sampleSnippetHindi: 'सधन्यवाद। आपका आज्ञाकारी शिष्य, क.ख.ग.', correctOrder: 6 },
        { id: 'f5', labelHindi: 'संबोधन (Salutation)', sampleSnippetHindi: 'महोदय,', correctOrder: 4 },
        { id: 'f3', labelHindi: 'प्रापक का पद व पता', sampleSnippetHindi: 'सेवा में, प्रधानाचार्य महोदय, क.ख.ग. विद्यालय।', correctOrder: 2 },
      ],
      explanationHindi:
        'नया ICSE बायाँ क्रम: १. प्रेषक पता -> २. दिनांक -> ३. प्रापक -> ४. विषय -> ५. संबोधन -> ६. मुख्य भाग -> ७. समापन।',
      explanationEnglish: 'Official ICSE sequence: Sender -> Date -> Recipient -> Subject -> Salutation -> Body -> Sign-off.',
    },
    creativeExercises: [
      {
        id: 'pf_cr_1',
        gradeBand: 'सभी कक्षाएँ',
        challengeTypeHindi: 'अनौपचारिक से औपचारिक रूपांतरण',
        challengeTypeEnglish: 'Formal Register Transformation',
        scenarioHindi:
          'वाक्य को किसी दोस्त से बदलकर अब **पुस्तक विक्रेता (Bookstore Manager)** को औपचारिक पत्र में लिखना है: “अरे भाई, हिंदी की पाँच किताबें जल्दी घर भेज दो, पैसे दे दूँगा।”',
        scenarioEnglish: 'Convert a casual request into polite ICSE Formal Business Letter phrasing.',
        questionHindi: 'पुस्तक विक्रेता को मँगवाने के लिए सर्वाधिक शुद्ध औपचारिक वाक्य चुनें:',
        questionEnglish: 'Which sentence fits an ICSE formal order letter?',
        options: [
          {
            textHindi:
              'कृपया निम्नलिखित पाँच हिंदी व्याकरण पुस्तकें उचित विद्यार्थी छूट के साथ वी.पी.पी. अथवा डाक द्वारा शीघ्र भेजने का कष्ट करें; राशि की अदायगी प्राप्ति पर कर दी जाएगी।',
            textEnglish: 'Polite, precise business Hindi mentioning discount and payment mode.',
          },
          {
            textHindi: 'अरे दुकानदार भैया, किताबें फटाफट पार्सल कर देना। नमस्ते।',
            textEnglish: 'Too casual and colloquial.',
          },
          {
            textHindi: 'प्रिय पुस्तक मित्र, सादर चरण-स्पर्श।',
            textEnglish: 'Personal family greeting.',
          },
        ],
        correctIndex: 0,
        explanationHindi:
          'व्यावसायिक औपचारिक पत्र में “शीघ्र भेजने का कष्ट करें”, पुस्तक-सूची, छूट और भुगतान पद्धति का शिष्ट उल्लेख होता है।',
        explanationEnglish: 'Business letters rely on courteous verbs and clear delivery/payment terms.',
      },
      {
        id: 'pf_cr_2',
        gradeBand: 'कक्षा 8–10',
        challengeTypeHindi: 'सटीक संक्षिप्त विषय लेखन (Crisp Subject Builder)',
        challengeTypeEnglish: 'Crafting a 1-Line Formal Subject',
        scenarioHindi:
          'एक छात्र ने ‘विषय’ में चार पंक्तियों का पूरा पैराग्राफ लिख दिया कि गली में कूड़ा पड़ा है और कुत्ते घूमते हैं और बदबू आती है।',
        scenarioEnglish: 'Compress a rambling 4-line subject into an ICSE 1-line Subject.',
        questionHindi: 'ICSE परीक्षक के लिए सबसे सटीक व संक्षिप्त “विषय:” कौन-सा होगा?',
        questionEnglish: 'Choose the sharpest 1-line ICSE Subject:',
        options: [
          {
            textHindi: 'विषय: क्षेत्र में व्याप्त गंदगी एवं नियमित सफ़ाई व्यवस्था के संबंध में।',
            textEnglish: 'Concise, formal, covers the exact core issue in 11 words.',
          },
          {
            textHindi: 'विषय: हमारे घर के बाहर कल बहुत बदबू थी और कोई नहीं आया।',
            textEnglish: 'Conversational complaint instead of formal subject.',
          },
          {
            textHindi: 'विषय: नमस्ते महोदय।',
            textEnglish: 'Not a subject at all.',
          },
        ],
        correctIndex: 0,
        explanationHindi:
          'औपचारिक पत्र का विषय एक ही पंक्ति में संक्षिप्त, संज्ञा-प्रधान और ‘...के संबंध में / ...हेतु’ से समाप्त होना चाहिए।',
        explanationEnglish: 'An ideal ICSE Subject stays within 1 crisp line ending in "हेतु" or "के संबंध में".',
      },
    ],
  },

  patra_informal: {
    innovativeExamples: [
      {
        id: 'pi_inn_1',
        gradeBand: 'कक्षा 5–7',
        titleHindi: 'ग्रामीण विज्ञान शिविर से मित्र को ‘मिट्टी के फ़्रिज’ के अद्भुत अनुभव का पत्र',
        titleEnglish: 'Letter to Friend About a Rural Science Camp & Clay Fridge',
        promptHindi:
          'ग्रीष्मावकाश में आपने किसी गाँव के विज्ञान एवं शिल्प शिविर में बिना बिजली के ‘मिट्टी का फ़्रिज (मिट्टी-कूल)’ बनते देखा। मित्र को अपना रोमांचक अनुभव लिखिए।',
        promptEnglish: 'Write an informal letter describing a zero-electricity clay refrigerator you saw at a rural camp.',
        wordCountApprox: 114,
        innovationTechniqueHindi: 'रोमांचक अनुभव-साझा व सांस्कृतिक-विज्ञान स्पर्श',
        innovationTechniqueEnglish: 'Experiential Eco-Discovery Letter',
        whyItStandsOutHindi:
          'सिर्फ़ सामान्य “जन्मदिन पर आओ” लिखने के बजाय ग्रामीण शिल्प व विज्ञान की अनूठी सीख मित्र से साझा करना पत्र को सजीव और यादगार बनाता है।',
        whyItStandsOutEnglish:
          'Replaces predictable holiday small talk with a vivid eco-craft anecdote in exact ICSE informal format.',
        blocks: [
          { tagHindi: 'प्रेषक पता', tagEnglish: 'Sender Address', textHindi: 'परीक्षा भवन,\nअ.ब.स. नगर।', alignment: 'left' },
          { tagHindi: 'दिनांक', tagEnglish: 'Date', textHindi: '18 नवंबर, 2026', alignment: 'left' },
          { tagHindi: 'संबोधन', tagEnglish: 'Salutation', textHindi: 'प्रिय मित्र आरव,', alignment: 'left', isHeading: true },
          { tagHindi: 'अभिवादन', tagEnglish: 'Greeting', textHindi: 'सप्रेम नमस्ते।', alignment: 'left' },
          {
            tagHindi: 'मुख्य विषय-वस्तु',
            tagEnglish: 'Body',
            textHindi:
              'मैं यहाँ सपरिवार सकुशल हूँ और आशा करता हूँ कि तुम भी प्रसन्न होगे। इस बार मैंने गाँव के ‘ग्रामीण विज्ञान एवं शिल्प शिविर’ में एक ऐसा अद्भुत आविष्कार देखा, जिसे बताए बिना मैं रह नहीं सका!\n\nवहाँ एक कुम्हार चाचा ने हमें बिना बिजली के चलने वाला ‘मिट्टी का फ़्रिज’ दिखाया, जिसमें वाष्पीकरण के सिद्धांत से सब्ज़ियाँ व पानी कई दिनों तक बिल्कुल ताज़ा रहते हैं। सचमुच, हमारी पारंपरिक कारीगरी में भी गहरा विज्ञान छिपा है। अगली बार तुम भी मेरे साथ इस शिविर में अवश्य चलना। अंकल-आंटी को मेरा प्रणाम कहना।',
            alignment: 'left',
          },
          { tagHindi: 'अभिनिवेदन', tagEnglish: 'Sign-off', textHindi: 'तुम्हारा प्रिय मित्र,\nक.ख.ग.', alignment: 'left' },
        ],
        examinerNoteHindi: 'बिना “विषय:” के शुद्ध अनौपचारिक ढाँचा, जीवंत अनुभव और सहज मित्रवत भाषा।',
        examinerNoteEnglish: 'Zero formal elements, crisp left-alignment, and engaging storytelling inside the letter.',
      },
      {
        id: 'pi_inn_2',
        gradeBand: 'कक्षा 8–10',
        titleHindi: 'असफलता से न घबराकर पुनः प्रयास करने हेतु छोटी बहन को आत्मीय प्रेरणा पत्र',
        titleEnglish: 'Inspiring Younger Sister After an Exam Setback (ICSE Q2)',
        promptHindi:
          'आपकी छोटी बहन इस बार गणित ओलंपियाड के अंतिम चरण में चयनित न होने से निराश है। उसका हौसला बढ़ाते हुए लगभग 125 शब्दों में पत्र लिखिए।',
        promptEnglish: 'Write a 125-word heartfelt informal letter cheering up your younger sister after a competition loss.',
        wordCountApprox: 124,
        innovationTechniqueHindi: 'सहानुभूतिपूर्ण संवाद व उदाहरण-आधारित प्रेरणा (Mentoring Tone)',
        innovationTechniqueEnglish: 'Compassionate Sibling Mentoring',
        whyItStandsOutHindi:
          'असफलता को ‘सीख की सीढ़ी’ के रूप में प्रस्तुत करते हुए बड़े भाई/बहन का आत्मीय स्वर ICSE के भावात्मक मूल्यांकन में पूरे अंक दिलाता है।',
        whyItStandsOutEnglish:
          'Balances emotional warmth with practical encouragement using accurate elder-to-younger salutations.',
        blocks: [
          { tagHindi: 'प्रेषक पता', tagEnglish: 'Sender Address', textHindi: 'छात्रावास,\nअ.ब.स. नगर।', alignment: 'left' },
          { tagHindi: 'दिनांक', tagEnglish: 'Date', textHindi: '18 नवंबर, 2026', alignment: 'left' },
          { tagHindi: 'संबोधन', tagEnglish: 'Salutation', textHindi: 'स्नेही अनुजा अनन्या,', alignment: 'left', isHeading: true },
          { tagHindi: 'अभिवादन', tagEnglish: 'Greeting', textHindi: 'मधुर स्नेह एवं शुभाशीष।', alignment: 'left' },
          {
            tagHindi: 'मुख्य विषय-वस्तु',
            tagEnglish: 'Body',
            textHindi:
              'कल माताजी से ज्ञात हुआ कि गणित ओलंपियाड के अंतिम चरण में मात्र दो अंकों से पीछे रह जाने के कारण तुम बहुत उदास हो। प्यारी अनन्या, मैं तुम्हारी निराशा समझ सकता हूँ, पर याद रखो—राज्य स्तर के अंतिम दौर तक पहुँचना भी अपने आप में एक बड़ी जीत है!\n\nसफलता हमेशा पहली बार में नहीं मिलती; महान वैज्ञानिक भी सैकड़ों असफल प्रयोगों के बाद ही चमत्कार करते हैं। यह दो अंकों की कमी तुम्हारी कमज़ोरी नहीं, बल्कि अगली बार के लिए तुम्हें और निखारने का संकेत है। मुस्कुराओ, अपनी गलतियों को देखो और नए उत्साह से जुट जाओ। हम सभी को तुम पर गर्व है। उत्तर की प्रतीक्षा में।',
            alignment: 'left',
          },
          { tagHindi: 'अभिनिवेदन', tagEnglish: 'Sign-off', textHindi: 'तुम्हारा शुभचिंतक बड़ा भाई,\nक.ख.ग.', alignment: 'left' },
        ],
        examinerNoteHindi: 'सटीक “स्नेही अनुजा” व “मधुर स्नेह/शुभाशीष”, आत्मीय प्रेरणादायक शैली और ~124 शब्द।',
        examinerNoteEnglish: 'Exact sibling register, heartfelt encouragement, and ideal ICSE length.',
      },
    ],
    sequenceExercise: {
      id: 'pi_seq_1',
      gradeBand: 'सभी कक्षाएँ',
      titleHindi: 'अनौपचारिक पत्र के 6 ICSE अंगों को सही क्रम में व्यवस्थित करें',
      titleEnglish: 'Order the 6 ICSE Informal Letter Blocks',
      instructionHindi: 'ध्यान रहे: इसमें "विषय" नहीं होता! नीचे के 6 भागों को ऊपर से नीचे सही क्रम में क्लिक करें।',
      instructionEnglish: 'Tap the 6 personal letter blocks from top-left to bottom-left in exact order.',
      shuffledSteps: [
        { id: 'i4', labelHindi: 'अभिवादन (Greeting)', sampleSnippetHindi: 'सादर चरण-स्पर्श।', correctOrder: 3 },
        { id: 'i2', labelHindi: 'दिनांक (Date)', sampleSnippetHindi: '18 नवंबर, 2026', correctOrder: 1 },
        { id: 'i5', labelHindi: 'कुशल-क्षेम व मुख्य संदेश', sampleSnippetHindi: 'मैं यहाँ सकुशल हूँ और आपकी कुशलता की कामना करता हूँ...', correctOrder: 4 },
        { id: 'i1', labelHindi: 'प्रेषक का पता (Sender)', sampleSnippetHindi: 'छात्रावास, अ.ब.स. नगर।', correctOrder: 0 },
        { id: 'i6', labelHindi: 'अभिनिवेदन व नाम', sampleSnippetHindi: 'आपका स्नेही पुत्र, क.ख.ग.', correctOrder: 5 },
        { id: 'i3', labelHindi: 'संबोधन (Salutation)', sampleSnippetHindi: 'पूज्य पिताजी,', correctOrder: 2 },
      ],
      explanationHindi: 'अनौपचारिक पत्र का क्रम: १. प्रेषक पता -> २. दिनांक -> ३. संबोधन -> ४. अभिवादन -> ५. मुख्य भाग -> ६. समापन।',
      explanationEnglish: 'Informal order: Sender -> Date -> Salutation -> Greeting -> Body -> Sign-off (NO Subject!).',
    },
    creativeExercises: [
      {
        id: 'pi_cr_1',
        gradeBand: 'सभी कक्षाएँ',
        challengeTypeHindi: 'आत्मीय शुरुआत का चुनाव',
        challengeTypeEnglish: 'Warm Personal Opening',
        scenarioHindi: 'आप छात्रावास से अपनी दादी जी को पत्र लिखकर उनकी बनाई मूँगफली की गजक की याद कर रहे हैं।',
        scenarioEnglish: 'Choose the warmest opening line for a personal letter to your grandmother.',
        questionHindi: 'अनौपचारिक पत्र में सजीव आत्मीयता जगाने वाला सबसे सुंदर आरंभ चुनें:',
        questionEnglish: 'Which opening captures personal affection naturally?',
        options: [
          {
            textHindi:
              'जैसे ही सुबह पहली ठंडी हवा चली, मुझे आपकी बनाई गुड़ और मूँगफली की गरमा-गरम गजक और आपकी सुनाई कहानियों की बहुत याद आ गई!',
            textEnglish: 'Sensory memory creates immediate emotional intimacy.',
          },
          {
            textHindi: 'सविनय निवेदन यह है कि मैं छात्रावास में रहता हूँ और मुझे गजक चाहिए।',
            textEnglish: 'Sounds like a formal office application.',
          },
          {
            textHindi: 'सभी दादियों को सूचित किया जाता है कि ठंड आ गई है।',
            textEnglish: 'Notice style.',
          },
        ],
        correctIndex: 0,
        explanationHindi:
          'निजी अनुभव और स्मृतियों से शुरुआत करने पर अनौपचारिक पत्र बनावटी न लगकर सच्चा व आत्मीय लगता है।',
        explanationEnglish: 'Opening with a shared sensory memory feels authentic and deeply affectionate.',
      },
      {
        id: 'pi_cr_2',
        gradeBand: 'कक्षा 8–10',
        challengeTypeHindi: 'रिश्ते के अनुसार त्रुटिरहित युग्म',
        challengeTypeEnglish: 'Relation-Pair Precision',
        scenarioHindi: 'आपको अपने **ममेरे भाई (जो आपसे छोटा है)** को साइबर सुरक्षा के बारे में सावधान करते हुए पत्र लिखना है।',
        scenarioEnglish: 'Writing to a younger cousin brother warning about online safety.',
        questionHindi: 'संबोधन, अभिवादन और समापन की कौन-सी तिकड़ी (Set) 100% सटीक है?',
        questionEnglish: 'Which trio of Salutation + Greeting + Sign-off is 100% accurate?',
        options: [
          {
            textHindi: 'स्नेही अनुज समीर,  →  मधुर स्नेह/शुभाशीष।  →  तुम्हारा बड़ा भाई, क.ख.ग.',
            textEnglish: 'Matches elder-to-younger relationship consistently across all 3 slots.',
          },
          {
            textHindi: 'पूज्य छोटे भाई समीर,  →  सादर चरण-स्पर्श।  →  भवदीय, क.ख.ग.',
            textEnglish: 'Uses elder worship greeting + formal closing.',
          },
          {
            textHindi: 'महोदय समीर,  →  विषय: साइबर सुरक्षा।  →  आपका आज्ञाकारी शिष्य।',
            textEnglish: 'Mixes formal letter & student closing.',
          },
        ],
        correctIndex: 0,
        explanationHindi:
          'छोटे भाई के लिए संबोधन (स्नेही), अभिवादन (मधुर स्नेह/शुभाशीष) और समापन (तुम्हारा बड़ा भाई) तीनों का आपस में तालमेल होना ज़रूरी है।',
        explanationEnglish: 'Salutation, greeting, and closing must align consistently with the age gap.',
      },
    ],
  },

  soochna: {
    innovativeExamples: [
      {
        id: 'sc_inn_1',
        gradeBand: 'कक्षा 5–7',
        titleHindi: '‘शून्य-प्लास्टिक हरित मेला एवं पुस्तक अदला-बदली बाज़ार’ सूचना',
        titleEnglish: 'Zero-Plastic Green Fair & Book Swap Market Notice',
        promptHindi:
          'विद्यालय के इको-क्लब की ओर से ‘पुरानी पुस्तक व खिलौना अदला-बदली (Swap) मेले’ हेतु लगभग 50 शब्दों में एक आकर्षक बॉक्सयुक्त सूचना लिखिए।',
        promptEnglish: 'Draft a creative 50-word boxed notice for a school Eco-Book Swap Fair.',
        wordCountApprox: 52,
        innovationTechniqueHindi: 'रचनात्मक गतिविधि व 5W स्पष्टता (Eco-Swap Concept)',
        innovationTechniqueEnglish: 'Creative School Event Notice',
        whyItStandsOutHindi:
          'परंपरागत गायन/नृत्य प्रतियोगिता के बजाय ‘बिना पैसों के वस्तु अदला-बदली व शून्य प्लास्टिक’ का आधुनिक विद्यालयी कार्यक्रम संपूर्ण 5W के साथ।',
        whyItStandsOutEnglish:
          'Showcases an engaging sustainability event while hitting every single ICSE boxed notice checkpoint.',
        blocks: [
          { tagHindi: 'संस्था', tagEnglish: 'Institution', textHindi: 'क.ख.ग. मॉडल विद्यालय, अ.ब.स. नगर', alignment: 'center', isHeading: true },
          { tagHindi: 'सूचना टैग', tagEnglish: 'Notice Tag', textHindi: 'सूचना', alignment: 'center', isHeading: true },
          { tagHindi: 'दिनांक', tagEnglish: 'Date', textHindi: 'दिनांक: 18 नवंबर, 2026', alignment: 'left' },
          {
            tagHindi: 'नवाचारी शीर्षक',
            tagEnglish: 'Heading',
            textHindi: '‘शून्य-प्लास्टिक हरित मेला व पुस्तक अदला-बदली’',
            alignment: 'center',
            isHeading: true,
          },
          {
            tagHindi: 'मुख्य सूचना',
            tagEnglish: 'Body',
            textHindi:
              'सभी विद्यार्थियों को सूचित किया जाता है कि इको-क्लब द्वारा दिनांक 28 नवंबर, 2026 को प्रातः 10:00 बजे विद्यालय प्रांगण में ‘पुस्तक अदला-बदली मेला’ आयोजित किया जा रहा है। छात्र अपनी पढ़ी हुई दो कहानियों की किताबें लाकर बदले में नई किताबें ले जा सकते हैं। प्लास्टिक की थैलियाँ पूर्णतः वर्जित हैं। इच्छुक छात्र 24 नवंबर तक नाम लिखवाएँ।',
            alignment: 'left',
          },
          { tagHindi: 'जारीकर्ता', tagEnglish: 'Issuer', textHindi: 'क.ख.ग.\nसचिव, इको-क्लब', alignment: 'left' },
        ],
        examinerNoteHindi: 'आकर्षक आधुनिक विषय के बावजूद बॉक्स, दिनांक-क्रम (18 -> 24 -> 28), समय, स्थान व अन्य पुरुष शैली शत-प्रतिशत शुद्ध।',
        examinerNoteEnglish: 'Creative concept without sacrificing a single formal ICSE notice element.',
      },
      {
        id: 'sc_inn_2',
        gradeBand: 'कक्षा 8–10',
        titleHindi: '‘कचरे से नवाचार’ — अंतर्विद्यालयी विज्ञान हैकथॉन सूचना',
        titleEnglish: 'Trash-to-Tech Inter-School Science Hackathon Notice',
        promptHindi:
          'विज्ञान क्लब के अध्यक्ष के रूप में ‘कचरे से नवाचार’ (Best Out of E-Waste) मॉडल प्रतियोगिता की सूचना ~58 शब्दों में तैयार कीजिए।',
        promptEnglish: 'Write a 58-word boxed notice for an Inter-School Trash-to-Tech Innovation Hackathon.',
        wordCountApprox: 57,
        innovationTechniqueHindi: 'स्टीम/हैकथॉन शब्दावली व नियम-स्पष्टता (STEM Event Spec)',
        innovationTechniqueEnglish: 'Modern STEM Event Spec',
        whyItStandsOutHindi:
          'कक्षा 8–10 के छात्रों को दर्शाता है कि आधुनिक शब्दों (जैसे ‘नवाचार मॉडल’, ‘ई-वेस्ट’) के साथ भी सूचना कितनी संक्षिप्त व औपचारिक रहनी चाहिए।',
        whyItStandsOutEnglish:
          'Demonstrates formal brevity and chronological clarity for contemporary school innovation events.',
        blocks: [
          { tagHindi: 'संस्था', tagEnglish: 'Institution', textHindi: 'क.ख.ग. सीनियर सेकेंडरी विद्यालय', alignment: 'center', isHeading: true },
          { tagHindi: 'सूचना टैग', tagEnglish: 'Notice Tag', textHindi: 'सूचना', alignment: 'center', isHeading: true },
          { tagHindi: 'दिनांक', tagEnglish: 'Date', textHindi: 'दिनांक: 15 नवंबर, 2026', alignment: 'left' },
          {
            tagHindi: 'शीर्षक',
            tagEnglish: 'Heading',
            textHindi: 'अंतर्विद्यालयी ‘कचरे से नवाचार’ विज्ञान हैकथॉन',
            alignment: 'center',
            isHeading: true,
          },
          {
            tagHindi: 'मुख्य सूचना',
            tagEnglish: 'Body',
            textHindi:
              'कक्षा 8 से 10 के सभी विद्यार्थियों को सूचित किया जाता है कि दिनांक 30 नवंबर, 2026 को प्रातः 9:30 से दोपहर 1:00 बजे तक विज्ञान प्रयोगशाला हॉल में ‘कचरे से नवाचार’ प्रतियोगिता आयोजित की जाएगी। दो-दो छात्रों की टीम को पुराने इलेक्ट्रॉनिक/प्लास्टिक सामान से उपयोगी मॉडल बनाना होगा। टीम पंजीकरण की अंतिम तिथि 24 नवंबर है।',
            alignment: 'left',
          },
          { tagHindi: 'जारीकर्ता', tagEnglish: 'Issuer', textHindi: 'क.ख.ग.\nअध्यक्ष, विज्ञान नवाचार मंच', alignment: 'left' },
        ],
        examinerNoteHindi: 'लक्षित वर्ग (कक्षा 8–10), समय-अवधि, स्थान, प्रारूप नियम और अंतिम तिथि सब 57 शब्दों में समाहित।',
        examinerNoteEnglish: 'Target audience, exact hours, venue, rules, and deadline packed cleanly into 57 words.',
      },
    ],
    sequenceExercise: {
      id: 'sc_seq_1',
      gradeBand: 'सभी कक्षाएँ',
      titleHindi: 'बॉक्सयुक्त सूचना (Notice) के 6 अंगों को ऊपर से नीचे सही क्रम में लगाएँ',
      titleEnglish: 'Assemble the 6 Parts of an ICSE Boxed Notice',
      instructionHindi: 'बॉक्स के अंदर सूचना के इन 6 अंगों को सटीक ICSE क्रम में क्लिक करें।',
      instructionEnglish: 'Click the 6 boxed notice components in exact top-to-bottom ICSE order.',
      shuffledSteps: [
        { id: 's4', labelHindi: 'शीर्षक (केंद्र में)', sampleSnippetHindi: '‘स्वच्छ जल संरक्षण कार्यशाला’', correctOrder: 3 },
        { id: 's2', labelHindi: 'सूचना शब्द (केंद्र में)', sampleSnippetHindi: 'सूचना', correctOrder: 1 },
        { id: 's5', labelHindi: 'मुख्य विषय-वस्तु (क्या, कब, कहाँ, समय)', sampleSnippetHindi: 'सभी निवासियों को सूचित किया जाता है कि 29 नवंबर को प्रातः 10 बजे...', correctOrder: 4 },
        { id: 's1', labelHindi: 'संस्था / सोसाइटी का नाम', sampleSnippetHindi: 'ग्रीनवुड रेजिडेंट्स एसोसिएशन', correctOrder: 0 },
        { id: 's6', labelHindi: 'जारीकर्ता का नाम व पद', sampleSnippetHindi: 'क.ख.ग., सचिव (पर्यावरण समिति)', correctOrder: 5 },
        { id: 's3', labelHindi: 'जारी दिनांक (बाएँ ओर)', sampleSnippetHindi: 'दिनांक: 18 नवंबर, 2026', correctOrder: 2 },
      ],
      explanationHindi: 'सूचना क्रम: १. संस्था नाम -> २. सूचना -> ३. दिनांक -> ४. शीर्षक -> ५. मुख्य विषय-वस्तु -> ६. जारीकर्ता व पद।',
      explanationEnglish: 'Order inside box: Institution -> "सूचना" -> Date -> Heading -> Body -> Issuer & Designation.',
    },
    creativeExercises: [
      {
        id: 'sc_cr_1',
        gradeBand: 'सभी कक्षाएँ',
        challengeTypeHindi: 'खोई-वस्तु पहचान संवर्धन',
        challengeTypeEnglish: 'Precision Notice Upgrading',
        scenarioHindi:
          'एक छात्र ने खोई वस्तु की सूचना में केवल इतना लिखा: “मेरी पानी की बोतल खो गई है, कृपया लौटा दें।” इसमें 4 बड़े विवरण छूट गए हैं।',
        scenarioEnglish: 'Upgrade a vague "Lost Water Bottle" notice into a sharp 5W ICSE Notice.',
        questionHindi: 'कौन-सी पंक्ति खोई वस्तु की सबसे सटीक व उपयोगी सूचना बनाती है?',
        questionEnglish: 'Which sentence supplies all missing 5W identification details?',
        options: [
          {
            textHindi:
              'कल दिनांक 17 नवंबर को मध्याह्न अवकाश में पुस्तकालय के बाहर मेरी नीले रंग की ‘मिल्टन’ स्टील की बोतल खो गई है; मिलने पर कक्षा 6-ब में लौटाने की कृपा करें।',
            textEnglish: 'Specifies date, time-slot, exact location, color/brand, and return contact.',
          },
          {
            textHindi: 'मेरी बोतल बहुत महँगी थी और मुझे प्यास लग रही है, जल्दी खोजो।',
            textEnglish: 'Emotional but misses color, brand, venue, and class.',
          },
          {
            textHindi: 'प्रिय बोतल, तुम कहाँ चली गईं? शुभरात्रि।',
            textEnglish: 'Improper diary/poetic tone.',
          },
        ],
        correctIndex: 0,
        explanationHindi:
          'खोई-पाई वस्तु की सूचना में वस्तु का रंग/पहचान, खोने का स्थान व समय तथा लौटाने का ठिकाना अनिवार्य है।',
        explanationEnglish: 'Lost-and-found notices must give physical markers, venue, date/time, and return point.',
      },
      {
        id: 'sc_cr_2',
        gradeBand: 'कक्षा 8–10',
        challengeTypeHindi: 'तारीख-क्रम की सूक्ष्म जाँच',
        challengeTypeEnglish: 'Date Chronology Detective',
        scenarioHindi:
          'आप 25 नवंबर को होने वाली वाद-विवाद प्रतियोगिता के लिए सूचना लिख रहे हैं, जिसमें नाम 20 नवंबर तक देने हैं।',
        scenarioEnglish: 'Check logical issue date vs registration deadline vs event date.',
        questionHindi: 'सूचना के शीर्ष पर ‘दिनांक:’ में कौन-सी तारीख लिखना 100% तार्किक व शुद्ध होगा?',
        questionEnglish: 'Which notice issue date is logically valid?',
        options: [
          {
            textHindi: 'दिनांक: 12 नवंबर, 2026 (अंतिम तिथि 20 नवंबर व आयोजन 25 नवंबर से पहले)',
            textEnglish: 'Leaves 8 days for registration before 20 Nov deadline.',
          },
          {
            textHindi: 'दिनांक: 21 नवंबर, 2026 (पंजीकरण बंद होने के अगले दिन!)',
            textEnglish: 'Impossible—notice issued after registration deadline passed.',
          },
          {
            textHindi: 'दिनांक: 26 नवंबर, 2026 (आयोजन बीतने के बाद)',
            textEnglish: 'Impossible—event already happened.',
          },
        ],
        correctIndex: 0,
        explanationHindi:
          'सूचना जारी करने की तिथि < पंजीकरण की अंतिम तिथि < कार्यक्रम की तिथि — यह स्वर्णिम नियम हमेशा जाँचें।',
        explanationEnglish: 'Always verify: Issue Date < Registration Deadline < Event Date.',
      },
    ],
  },

  diary: {
    innovativeExamples: [
      {
        id: 'dr_inn_1',
        gradeBand: 'कक्षा 5–7',
        titleHindi: 'बिजली गुल होने की ‘डिजिटल-उपवास’ शाम — दादी के किस्सों की रात',
        titleEnglish: 'A Power-Cut "Digital Fast" Evening & Grandma’s Stories',
        promptHindi:
          'तेज़ आँधी के कारण पूरे इलाके की चार घंटे बिजली चली गई—न वाई-फ़ाई, न टीवी। उस ‘स्क्रीन-मुक्त’ शाम के अनोखे अनुभव को डायरी में लिखिए।',
        promptEnglish: 'Write a 85-word diary entry about how a 4-hour blackout turned into a magical family evening.',
        wordCountApprox: 88,
        innovationTechniqueHindi: 'निराशा से आनंद की ओर भावात्मक बदलाव (Contrast Mood Arc)',
        innovationTechniqueEnglish: 'Emotional Contrast Reflection',
        whyItStandsOutHindi:
          'बिजली कटने जैसी आम परेशानी को ‘डिजिटल उपवास’ के सकारात्मक अनुभव में बदलकर लिखना अत्यंत मौलिक और दिल को छूने वाला है।',
        whyItStandsOutEnglish:
          'Turns an everyday annoyance into a reflective discovery about family connection inside authentic diary bounds.',
        blocks: [
          { tagHindi: 'दिनांक व दिन', tagEnglish: 'Date & Day', textHindi: '18 नवंबर, 2026 (बुधवार)', alignment: 'left', isHeading: true },
          { tagHindi: 'समय', tagEnglish: 'Time', textHindi: 'रात्रि 10:00 बजे', alignment: 'left' },
          { tagHindi: 'संबोधन', tagEnglish: 'Salutation', textHindi: 'प्रिय डायरी,', alignment: 'left', isHeading: true },
          {
            tagHindi: 'प्रथम पुरुष विवरण',
            tagEnglish: '1st-Person Reflection',
            textHindi:
              'आज शाम जब अचानक तेज़ आँधी के कारण चार घंटे के लिए बिजली और वाई-फ़ाई दोनों चले गए, तो पहले मैं बहुत झुँझला उठा। सोचा—बिना टीवी और टैबलेट के समय कैसे कटेगा? तभी मम्मी ने आँगन में मोमबत्ती जलाई और हम सब चटाई बिछाकर बैठ गए। दादी ने बचपन की ऐसी मज़ेदार पहेलियाँ और भूत-प्रेतों के किस्से सुनाए कि हम हँसते-हँसते लोटपोट हो गए। आसमान में टिमटिमाते तारे भी आज पहली बार साफ़ दिखे! बिना इंटरनेट की यह ‘डिजिटल-उपवास’ शाम मेरे जीवन की सबसे यादगार शाम बन गई।',
            alignment: 'left',
          },
          { tagHindi: 'समापन', tagEnglish: 'Closing', textHindi: 'शुभरात्रि।\nक.ख.ग.', alignment: 'left' },
        ],
        examinerNoteHindi: 'सच्ची मानसिक हलचल (झुँझलाहट -> हर्ष), रात्रि समय, प्रथम पुरुष व ‘शुभरात्रि’ का पूर्ण संतुलन।',
        examinerNoteEnglish: 'Captures genuine mood shift from frustration to warmth cleanly inside 88 words.',
      },
      {
        id: 'dr_inn_2',
        gradeBand: 'कक्षा 8–10',
        titleHindi: 'नए दृष्टिबाधित सहपाठी की ‘ब्रेल पुस्तक’ व मित्रता का पहला दिन',
        titleEnglish: 'First Day Befriending a Visually Impaired Classmate & Braille Book',
        promptHindi:
          'आज आपकी कक्षा में एक नया दृष्टिबाधित विद्यार्थी आया है। उसकी उँगलियों से ‘ब्रेल लिपि’ पढ़ने और आपकी नई मित्रता पर 98 शब्दों की डायरी लिखिए।',
        promptEnglish: 'Write a 98-word reflective diary entry about meeting a new blind classmate and seeing Braille.',
        wordCountApprox: 98,
        innovationTechniqueHindi: 'संवेदनशील अवलोकन व आत्म-रूपांतरण (Empathy & Perspective Shift)',
        innovationTechniqueEnglish: 'Sensory Empathy Reflection',
        whyItStandsOutHindi:
          'समावेशी संवेदनशीलता और ‘स्पर्श से पढ़ने’ जैसे सूक्ष्म विवरण डायरी को मात्र घटना-वर्णन से उठाकर साहित्यिक गहराई देते हैं।',
        whyItStandsOutEnglish:
          'Deep tactile imagery and genuine personal growth give this entry extraordinary emotional weight.',
        blocks: [
          { tagHindi: 'दिनांक व दिन', tagEnglish: 'Date & Day', textHindi: '20 नवंबर, 2026 (शुक्रवार)', alignment: 'left', isHeading: true },
          { tagHindi: 'समय', tagEnglish: 'Time', textHindi: 'रात्रि 9:45 बजे', alignment: 'left' },
          { tagHindi: 'संबोधन', tagEnglish: 'Salutation', textHindi: 'प्रिय डायरी,', alignment: 'left', isHeading: true },
          {
            tagHindi: 'प्रथम पुरुष विवरण',
            tagEnglish: '1st-Person Reflection',
            textHindi:
              'आज का दिन मेरे मन में हमेशा के लिए बस गया। हमारी कक्षा में कबीर नाम का एक नया विद्यार्थी आया है, जो देख नहीं सकता। पहले मुझे संकोच हुआ कि मैं उससे क्या बात करूँगा, पर मध्याह्न अवकाश में मैंने देखा कि वह अपनी मोटी ‘ब्रेल लिपि’ की किताब पर उँगलियाँ फेरकर कितनी तेज़ी से कविता पढ़ रहा था! जब मैंने उससे ब्रेल बिंदुओं के बारे में पूछा, तो उसने मुस्कुराकर मुझे अपने नाम के उभरे बिंदु छूना सिखाया। जाते समय उसने कहा कि मेरी आवाज़ उसे बहुत शांत लगी। आज मैंने समझा कि देखने के लिए आँखों से अधिक संवेदनशील हृदय की आवश्यकता होती है।',
            alignment: 'left',
          },
          { tagHindi: 'समापन', tagEnglish: 'Closing', textHindi: 'शुभरात्रि।\nक.ख.ग.', alignment: 'left' },
        ],
        examinerNoteHindi: 'संकोच से संवेदनशीलता की यात्रा व अंतिम आत्ममंथन वाक्य परीक्षक के दिल को छू लेता है।',
        examinerNoteEnglish: 'Authentic personal hesitation transforming into deep insight.',
      },
    ],
    sequenceExercise: {
      id: 'dr_seq_1',
      gradeBand: 'सभी कक्षाएँ',
      titleHindi: 'बॉक्सयुक्त डायरी प्रविष्टि के 5 भागों को सही क्रम में लगाएँ',
      titleEnglish: 'Order the 5 ICSE Diary Entry Components',
      instructionHindi: 'ऊपर से नीचे की ओर सही ICSE डायरी क्रम (१ से ५) चुनें।',
      instructionEnglish: 'Click all 5 boxed diary parts from top to bottom in exact order.',
      shuffledSteps: [
        { id: 'd3', labelHindi: 'आत्मीय संबोधन', sampleSnippetHindi: 'प्रिय डायरी,', correctOrder: 2 },
        { id: 'd1', labelHindi: 'दिनांक व दिन', sampleSnippetHindi: '18 नवंबर, 2026 (बुधवार)', correctOrder: 0 },
        { id: 'd5', labelHindi: 'समापन व नाम', sampleSnippetHindi: 'शुभरात्रि। क.ख.ग.', correctOrder: 4 },
        { id: 'd2', labelHindi: 'समय (रात्रि)', sampleSnippetHindi: 'रात्रि 9:30 बजे', correctOrder: 1 },
        { id: 'd4', labelHindi: 'प्रथम पुरुष भावनात्मक विवरण', sampleSnippetHindi: 'आज जब मैंने पहली बार अपना लगाया हुआ पौधा खिलते देखा, तो मेरा मन झूम उठा...', correctOrder: 3 },
      ],
      explanationHindi: 'डायरी क्रम: १. दिनांक/दिन -> २. समय -> ३. प्रिय डायरी, -> ४. प्रथम-पुरुष अनुभव -> ५. शुभरात्रि + नाम।',
      explanationEnglish: 'Diary sequence: Date/Day -> Time -> "प्रिय डायरी," -> 1st-Person Reflection -> "शुभरात्रि" + Name.',
    },
    creativeExercises: [
      {
        id: 'dr_cr_1',
        gradeBand: 'सभी कक्षाएँ',
        challengeTypeHindi: 'समाचार रिपोर्ट बनाम डायरी भावना',
        challengeTypeEnglish: 'Transforming Dry Facts into Inner Feeling',
        scenarioHindi: 'नीरस पंक्ति: “आज स्कूल में नाटक हुआ और मैंने राजा का रोल किया और सबको अच्छा लगा।”',
        scenarioEnglish: 'Turn a flat summary sentence into intimate 1st-person diary reflection.',
        questionHindi: 'डायरी के लिए सबसे प्रामाणिक व संवेदनशील रूपांतरण चुनें:',
        questionEnglish: 'Which rewrite sounds truly like a personal diary?',
        options: [
          {
            textHindi:
              'मंच पर राजा का भारी मुकुट पहनते समय पहले तो मेरा दिल ज़ोरों से धड़क रहा था, पर जैसे ही पहला संवाद बोला और हॉल तालियों से गूँजा, सारा डर गर्व में बदल गया!',
            textEnglish: 'Shares inner heartbeat, sensory detail, and emotional transition.',
          },
          {
            textHindi: 'छात्र द्वारा नाटक में उत्तम प्रदर्शन किया गया। सभी को सूचित किया जाता है।',
            textEnglish: 'Cold 3rd-person notice tone.',
          },
          {
            textHindi: 'नाटक की टिकट मात्र ₹50 में उपलब्ध है! संपर्क करें: 98XXXXXXXX।',
            textEnglish: 'Advertisement copy.',
          },
        ],
        correctIndex: 0,
        explanationHindi:
          'डायरी केवल “क्या हुआ” नहीं बताती, बल्कि “उस समय मुझे कैसा महसूस हुआ” यह सच्चाई लिखती है।',
        explanationEnglish: 'A diary captures internal feelings ("heart pounding", "fear turning to pride"), not just facts.',
      },
      {
        id: 'dr_cr_2',
        gradeBand: 'कक्षा 8–10',
        challengeTypeHindi: 'अंतिम आत्ममंथन वाक्य (Reflective Closing Line)',
        challengeTypeEnglish: 'Crafting a Memorable Takeaway Before "शुभरात्रि"',
        scenarioHindi:
          'आपने किसी अजनबी का गिरा हुआ पर्स लौटाया। पूरी घटना लिखने के बाद अब ‘शुभरात्रि’ से ठीक पहले एक अंतिम वाक्य जोड़ना है।',
        scenarioEnglish: 'Pick the sharpest introspective final thought before "शुभरात्रि".',
        questionHindi: 'कौन-सा अंतिम वाक्य डायरी को गहरा और सार्थक बनाता है?',
        questionEnglish: 'Which closing thought best concludes this diary entry?',
        options: [
          {
            textHindi:
              'आज मैंने जाना कि ईमानदारी के बाद मिलने वाली सुकून भरी नींद किसी भी इनाम से कहीं अधिक मीठी होती है। अब चैन से सोऊँगा।',
            textEnglish: 'Deep personal realization leading naturally into "शुभरात्रि".',
          },
          {
            textHindi: 'पर्स लौटाने का काम सरकार का है, भवदीय क.ख.ग.।',
            textEnglish: 'Irrelevant and wrong formal closing.',
          },
          {
            textHindi: 'आप भी हमेशा पर्स लौटाएँ—विज्ञापन समाप्त।',
            textEnglish: 'Preachy ad phrasing instead of self-reflection.',
          },
        ],
        correctIndex: 0,
        explanationHindi:
          '‘शुभरात्रि’ से पहले दिन की सीख और सुकून से सोने की बात जोड़ने से डायरी की लय पूर्ण होती है।',
        explanationEnglish: 'Connecting personal insight to resting peacefully bridges naturally into "शुभरात्रि".',
      },
    ],
  },

  vigyapan: {
    innovativeExamples: [
      {
        id: 'vg_inn_1',
        gradeBand: 'कक्षा 5–7',
        titleHindi: '‘अंकुर’ बीज-पेंसिल (लिखें भी और लिखने के बाद गमले में बो दें!) विज्ञापन',
        titleEnglish: 'Plantable Eco Seed-Pencil Startup Advertisement',
        promptHindi:
          'एक ऐसी अनोखी पर्यावरण-अनुकूल ‘बीज-पेंसिल’ का विज्ञापन 42 शब्दों में तैयार कीजिए जिसके अंत में तुलसी व गेंदे के बीज लगे हैं।',
        promptEnglish: 'Create a 42-word boxed display ad for plantable eco seed-pencils.',
        wordCountApprox: 43,
        innovationTechniqueHindi: 'इको-स्टार्टअप उत्पाद + तुकबंदी नारा (Eco-Product Pitch)',
        innovationTechniqueEnglish: 'Eco-Startup Concept + Rhyme',
        whyItStandsOutHindi:
          'प्लांटएबल सीड-पेंसिल जैसे अनोखे आइडिया को छोटे बुलेट बिंदुओं, तुकबंदी नारे और ‘बाय वन गेट सीड’ जैसे आकर्षक ऑफर के साथ पेश किया गया है।',
        whyItStandsOutEnglish:
          'Demonstrates creative product thinking expressed with crisp ICSE advertisement brevity.',
        blocks: [
          {
            tagHindi: 'शीर्षक टैग',
            tagEnglish: 'Headline',
            textHindi: '🌱 लिखें शब्द, उगाएँ हरियाली — ‘अंकुर’ बीज-पेंसिल! 🌱',
            alignment: 'center',
            isHeading: true,
          },
          {
            tagHindi: 'तुकबंदी नारा',
            tagEnglish: 'Slogan',
            textHindi: '“लिखकर जब पेंसिल छोटी हो जाए, गमले में बो दें—नन्हा पौधा उग आए!”',
            alignment: 'center',
          },
          {
            tagHindi: 'विशेषताएँ (बुलेट)',
            tagEnglish: 'Key Features',
            textHindi:
              '• पुनर्नवीनीकृत कागज़ से निर्मित (वृक्ष-बचाओ तकनीक)\n• पीछे तुलसी, टमाटर व गेंदे के असली बीज\n• गहरे व चिकने लेखन हेतु सर्वश्रेष्ठ ग्रेफ़ाइट',
            alignment: 'left',
          },
          {
            tagHindi: 'विशेष ऑफर',
            tagEnglish: 'Offer',
            textHindi: '🎁 छात्र विशेष: 10 पेंसिल के पैक पर 1 छोटा गमला मुफ़्त! मूल्य मात्र ₹60/-',
            alignment: 'center',
            isHeading: true,
          },
          { tagHindi: 'संपर्क', tagEnglish: 'Contact', textHindi: 'हरित स्टेशनरी, अ.ब.स. नगर | संपर्क: 98XXXXXXXX', alignment: 'center' },
        ],
        examinerNoteHindi: 'पर्यावरण संदेश + व्यावहारिक उत्पाद आकर्षण और मात्र 43 शब्दों की सटीक सीमा।',
        examinerNoteEnglish: 'Memorable eco-product pitch with all mandatory ad components in 43 words.',
      },
      {
        id: 'vg_inn_2',
        gradeBand: 'कक्षा 8–10',
        titleHindi: '‘स्वर-ज्ञान’ निःशुल्क ऑडियो-पुस्तकालय सेवा (सामाजिक नवाचार विज्ञापन)',
        titleEnglish: 'Swar-Gyan Free Audio Library Service Advertisement',
        promptHindi:
          'दृष्टिबाधित पाठकों व साहित्य-प्रेमियों के लिए शुरू की गई निःशुल्क ‘ऑडियो-बुक लाइब्रेरी’ के प्रचार हेतु ~48 शब्दों का बॉक्स विज्ञापन लिखिए।',
        promptEnglish: 'Design a 48-word boxed ad promoting a free audio-book library for visually impaired & avid readers.',
        wordCountApprox: 47,
        innovationTechniqueHindi: 'सामाजिक सेवा व समावेशी अभियान (Social Impact Display Copy)',
        innovationTechniqueEnglish: 'Inclusive Social Initiative Ad',
        whyItStandsOutHindi:
          'केवल साबुन-शैंपू बेचने से हटकर एक समावेशी सामाजिक पहल के लिए आकर्षक विज्ञापन लिखना कक्षा 8–10 में विशेष सराहना दिलाता है।',
        whyItStandsOutEnglish:
          'Shows versatility of Vigyapan writing for social impact services within ICSE word limits.',
        blocks: [
          {
            tagHindi: 'शीर्षक',
            tagEnglish: 'Headline',
            textHindi: '🎧 अब किताबें बोल उठेंगी — ‘स्वर-ज्ञान’ ऑडियो पुस्तकालय! 🎧',
            alignment: 'center',
            isHeading: true,
          },
          {
            tagHindi: 'नारा',
            tagEnglish: 'Slogan',
            textHindi: '“आँखों की सीमा से परे, ज्ञान की गूँज हर कान तक!”',
            alignment: 'center',
          },
          {
            tagHindi: 'मुख्य सुविधाएँ',
            tagEnglish: 'Features',
            textHindi:
              '• ५,०००+ हिंदी, अंग्रेज़ी व विज्ञान की ऑडियो पुस्तकें\n• दृष्टिबाधित विद्यार्थियों हेतु घर बैठे निःशुल्क सदस्यता\n• स्पष्ट व मधुर वाचन शैली, बिना इंटरनेट के भी उपलब्ध',
            alignment: 'left',
          },
          {
            tagHindi: 'विशेष आमंत्रण',
            tagEnglish: 'Call to Action',
            textHindi: '✨ ‘वॉलंटियर वाचक’ बनकर आप भी अपनी आवाज़ दान करें! ✨',
            alignment: 'center',
            isHeading: true,
          },
          {
            tagHindi: 'संपर्क',
            tagEnglish: 'Contact',
            textHindi: 'संपर्क करें: 98XXXXXXXX | पता: सेवा सदन, क.ख.ग. मार्ग',
            alignment: 'center',
          },
        ],
        examinerNoteHindi: 'भावुक कर देने वाला नारा, सटीक बुलेट बिंदु, वॉलंटियर आमंत्रण और सुरक्षित काल्पनिक संपर्क।',
        examinerNoteEnglish: 'Compelling slogan, clean bullets, volunteer call-to-action, and masked contact.',
      },
    ],
    sequenceExercise: {
      id: 'vg_seq_1',
      gradeBand: 'सभी कक्षाएँ',
      titleHindi: 'बॉक्स विज्ञापन के 5 प्रमुख घटकों को आकर्षक दृश्य-क्रम में सजाएँ',
      titleEnglish: 'Order the 5 Display Blocks of an ICSE Advertisement',
      instructionHindi: 'एक आदर्श बॉक्स विज्ञापन को ऊपर से नीचे देखने पर किस क्रम में घटक होने चाहिए? क्लिक करें।',
      instructionEnglish: 'Tap the 5 advertisement components from top-banner to bottom-contact.',
      shuffledSteps: [
        { id: 'v3', labelHindi: 'मुख्य विशेषताएँ (बुलेट बिंदु)', sampleSnippetHindi: '• 100% जैविक कपास  • त्वचा के लिए कोमल  • 5 रंगों में उपलब्ध', correctOrder: 2 },
        { id: 'v1', labelHindi: 'बड़ा आकर्षक शीर्षक व टैग', sampleSnippetHindi: '✨ धमाकेदार पेशकश! ‘प्रकृति’ हैंडलूम कुर्ते ✨', correctOrder: 0 },
        { id: 'v5', labelHindi: 'पता व काल्पनिक संपर्क', sampleSnippetHindi: 'पता: क.ख.ग. बाज़ार | संपर्क: 98XXXXXXXX', correctOrder: 4 },
        { id: 'v2', labelHindi: 'तुकबंदी नारा (Slogan)', sampleSnippetHindi: '“देशी पहनावा अपनाएँ, हर मौसम में आराम पाएँ!”', correctOrder: 1 },
        { id: 'v4', labelHindi: 'विशेष छूट / ऑफर', sampleSnippetHindi: '💥 त्यौहार विशेष: सभी उत्पादों पर 25% सीधी छूट! 💥', correctOrder: 3 },
      ],
      explanationHindi: 'विज्ञापन क्रम: १. शीर्षक/टैग -> २. नारा -> ३. बुलेट विशेषताएँ -> ४. छूट/ऑफर -> ५. पता व संपर्क।',
      explanationEnglish: 'Display ad sequence: Headline -> Slogan -> Bullet Specs -> Offer -> Contact Info.',
    },
    creativeExercises: [
      {
        id: 'vg_cr_1',
        gradeBand: 'सभी कक्षाएँ',
        challengeTypeHindi: 'तुकबंदी नारा निर्माण (Rhyming Slogan Forge)',
        challengeTypeEnglish: 'Crafting a Catchy Rhyming Slogan',
        scenarioHindi: 'आप ‘सोलर साइकिल / ई-साइकिल’ का विज्ञापन बना रहे हैं जो प्रदूषण नहीं फैलाती।',
        scenarioEnglish: 'Pick the punchiest rhyming Hindi slogan for an Eco E-Bicycle advertisement.',
        questionHindi: 'सबसे यादगार व तुकबंदी वाला नारा चुनें:',
        questionEnglish: 'Which slogan has the strongest rhythm & persuasion?',
        options: [
          {
            textHindi: '“पेट्रोल का झंझट छोड़िए — ‘पवन’ ई-साइकिल से हर सफ़र को हरियाली से जोड़िए!”',
            textEnglish: 'Punchy rhyme ("छोड़िए... जोड़िए") highlighting zero-petrol eco travel.',
          },
          {
            textHindi: 'यह एक साइकिल है जो बैटरी से चलती है और दो पहिए होते हैं।',
            textEnglish: 'Dry factual sentence, not a slogan.',
          },
          {
            textHindi: 'साइकिल चलाने के लाभ पर हम 250 शब्दों का निबंध पढ़ेंगे।',
            textEnglish: 'Essay phrasing.',
          },
        ],
        correctIndex: 0,
        explanationHindi:
          'छोटी तुकबंदी (“छोड़िए — जोड़िए”) और मुख्य लाभ एक साथ आने से पाठक को विज्ञापन तुरंत याद हो जाता है।',
        explanationEnglish: 'Rhyming parallel verbs + core USP make Hindi ad slogans stick instantly.',
      },
      {
        id: 'vg_cr_2',
        gradeBand: 'कक्षा 8–10',
        challengeTypeHindi: 'गद्य से बुलेट रूपांतरण (Prose to Display Bullets)',
        challengeTypeEnglish: 'Converting Wordy Prose into Crisp Ad Bullets',
        scenarioHindi:
          'नीरस वाक्य: “हमारी नई स्मार्ट बोतल पानी को चौबीस घंटे ठंडा रखती है और इसमें तापमान दिखाने वाला ढक्कन लगा है और यह गिरने पर टूटती नहीं है।”',
        scenarioEnglish: 'Convert this 26-word sentence into punchy ICSE advertisement bullets.',
        questionHindi: 'विज्ञापन बॉक्स में इसे किस प्रकार लिखना सर्वाधिक प्रभावशाली होगा?',
        questionEnglish: 'Which display bullet layout works best inside an advertisement box?',
        options: [
          {
            textHindi: '• २४ घंटे शीतलता  • डिजिटल तापमान ढक्कन  • अटूट स्टेनलेस स्टील बॉडी',
            textEnglish: 'Crisp, scannable 3-part noun phrases.',
          },
          {
            textHindi: 'सविनय निवेदन है कि हमारी बोतल बहुत मजबूत है और नहीं टूटती है।',
            textEnglish: 'Formal application phrasing.',
          },
          {
            textHindi: 'प्रिय बोतल, तुम्हारा ढक्कन बहुत सुंदर है। शुभरात्रि।',
            textEnglish: 'Diary tone.',
          },
        ],
        correctIndex: 0,
        explanationHindi:
          'विज्ञापन में पूरी क्रिया (“रखती है, लगा है”) की जगह संक्षिप्त संज्ञा-वाक्यांशों के बुलेट बिंदु देखने में सुंदर व तुरंत पठनीय होते हैं।',
        explanationEnglish: 'Compact noun-phrase bullets maximize visual punch inside a boxed ad.',
      },
    ],
  },
};
