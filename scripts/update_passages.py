import re

passages_code = """export const APATHIT_GADYANSH_PASSAGES: ApathitGadyanshPassage[] = [
  {
    id: 'gad_easy',
    titleHindi: 'प्रकृति का अमूल्य वरदान: वृक्ष और हमारा पर्यावरण',
    titleEnglish: 'Nature\\'s Invaluable Boon: Trees & Our Environment',
    theme: 'पर्यावरण एवं जीवन संतुलन (Environment & Life Balance)',
    difficulty: 'easy',
    difficultyLabelHindi: 'सरल (Easy)',
    gradeLevel: 'कक्षा 8',
    passageHindi: `प्रकृति ने मानव जाति को जीवित रहने और सुखी जीवन बिताने के लिए अनगिनत अमूल्य उपहार प्रदान किए हैं, जिनमें वृक्षों का स्थान सर्वोपरि है। वृक्ष न केवल धरती का नैसर्गिक सौंदर्य बढ़ाते हैं, बल्कि वे समस्त जीव-जगत के प्राणदाता भी हैं। प्रातःकाल जब सूर्य की प्रथम किरणें हरी पत्तियों पर पड़ती हैं, तब पेड़ प्रकाश संश्लेषण की चमत्कारी प्रक्रिया द्वारा कार्बन डाइऑक्साइड को सोखकर हमें जीवनदायिनी ऑक्सीजन प्रदान करते हैं। यदि धरती पर वृक्ष न हों, तो शुद्ध वायु का अस्तित्व ही समाप्त हो जाएगा और जीव-जंतुओं के लिए साँस लेना भी असंभव हो जाएगा।\\n\\nइसके अतिरिक्त, वृक्ष पर्यावरण के संतुलन को बनाए रखने में एक रक्षक की भूमिका निभाते हैं। उनकी गहरी जड़ें मिट्टी को मजबूती से बाँधकर रखती हैं, जिससे वर्षा के दिनों में उपजाऊ मिट्टी बहने से बच जाती है और भयानक भू-क्षरण तथा बाढ़ जैसी आपदाओं की तीव्रता काफी कम हो जाती है। घने जंगल बादलों को आकर्षित करके समय पर वर्षा कराने में भी सहायक होते हैं। वृक्ष हमें मीठे फल, सुगन्धित फूल, बहुमूल्य औषधियाँ, इमारती लकड़ी और शीतल छाया प्रदान करते हैं। थका हुआ पथिक जब किसी विशाल वटवृक्ष या नीम के पेड़ की ठंडी छाँव में बैठता है, तो उसकी सारी थकान पल भर में दूर हो जाती है।\\n\\nपक्षी पेड़ों की डालियों पर अपने सुरक्षित घोंसले बनाकर रहते हैं और उनके मधुर कलरव से संपूर्ण प्रकृति गूँज उठती है। परंतु आज का मनुष्य अपने स्वार्थ और आधुनिक औद्योगीकरण की अंधी दौड़ में अंधाधुंध जंगलों को काट रहा है। यदि यह विनाशकारी क्रम इसी प्रकार चलता रहा, तो हरी-भरी धरती धीरे-धीरे बंजर मरुस्थल में बदल जाएगी। इसलिए हमारा परम कर्तव्य है कि हम न केवल पेड़ों की रक्षा करें, बल्कि प्रत्येक शुभ अवसर पर नए पौधे लगाकर उनका पालन-पोषण करें। वृक्षारोपण केवल एक औपचारिकता नहीं, बल्कि हमारी भावी पीढ़ियों के सुरक्षित भविष्य की अनिवार्य गारंटी है।`,
    englishSummary: `Nature has endowed mankind with countless gifts, among which trees hold the highest significance. They absorb carbon dioxide to generate life-giving oxygen, bind soil to avert erosion, invite seasonal rainfall, and shelter wildlife. Indiscriminate deforestation threatens this delicate balance, making afforestation an urgent moral duty.`,
    vocabularyList: [
      { word: 'नैसर्गिक (Natural)', meaningHindi: 'प्राकृतिक, स्वाभाविक', meaningEnglish: 'Natural / inherent' },
      { word: 'सर्वोपरि (Supreme)', meaningHindi: 'सबसे ऊँचा या सबसे प्रमुख', meaningEnglish: 'Supreme / paramount' },
      { word: 'भू-क्षरण (Soil erosion)', meaningHindi: 'मिट्टी का कटना या बह जाना', meaningEnglish: 'Soil erosion' },
      { word: 'कलरव (Chirping)', meaningHindi: 'पक्षियों की मीठी चहचहाहट', meaningEnglish: 'Sweet chirping of birds' }
    ],
    questions: [
      {
        id: 'gq_e1',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: 'गद्यांश के अनुसार समस्त जीव-जगत के प्राणदाता किन्हें माना गया है?',
        questionEnglish: 'According to the passage, who are considered life-givers of all living beings?',
        options: [
          { textHindi: 'वृक्षों को (Trees)', textEnglish: 'Trees' },
          { textHindi: 'उद्योगों को (Industries)', textEnglish: 'Industries' },
          { textHindi: 'इमारतों को (Buildings)', textEnglish: 'Buildings' },
          { textHindi: 'वाहनों को (Vehicles)', textEnglish: 'Vehicles' }
        ],
        correctIndex: 0,
        explanationHindi: "गद्यांश में स्पष्ट कहा गया है कि 'वृक्ष समस्त जीव-जगत के प्राणदाता हैं' क्योंकि वे ऑक्सीजन प्रदान करते हैं।",
        explanationEnglish: "The text states trees are life-givers because they generate oxygen via photosynthesis."
      },
      {
        id: 'gq_e2',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: 'वृक्ष भू-क्षरण (मिट्टी के कटाव) को कैसे रोकते हैं?',
        questionEnglish: 'How do trees prevent soil erosion?',
        options: [
          { textHindi: 'उनकी गहरी जड़ें मिट्टी को बाँधकर रखती हैं', textEnglish: 'Their deep roots bind the soil firmly' },
          { textHindi: 'वे बादलों को भगा देते हैं', textEnglish: 'They drive clouds away' },
          { textHindi: 'वे मिट्टी को कठोर बना देते हैं', textEnglish: 'They make soil rocky' },
          { textHindi: 'वे केवल फल गिराते हैं', textEnglish: 'They only drop fruits' }
        ],
        correctIndex: 0,
        explanationHindi: "वृक्षों की जड़ें वर्षा के जल में उपजाऊ मिट्टी को बहने से रोकती हैं।",
        explanationEnglish: "Deep tree roots anchor the topsoil and stop rain wash-off."
      },
      {
        id: 'gq_e3',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: "'नैसर्गिक' शब्द का सर्वाधिक उपयुक्त पर्यायवाची क्या है?",
        questionEnglish: "What is the most suitable synonym of 'नैसर्गिक'?",
        options: [
          { textHindi: 'प्राकृतिक (Natural)', textEnglish: 'Natural' },
          { textHindi: 'बनावटी (Artificial)', textEnglish: 'Artificial' },
          { textHindi: 'कठिन (Difficult)', textEnglish: 'Difficult' },
          { textHindi: 'क्षणिक (Momentary)', textEnglish: 'Momentary' }
        ],
        correctIndex: 0,
        explanationHindi: "'नैसर्गिक' का अर्थ जो प्रकृति द्वारा प्रदत्त हो, अर्थात् प्राकृतिक है।",
        explanationEnglish: "'नैसर्गिक' means innate or natural."
      },
      {
        id: 'gq_e4',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: 'मनुष्य के किस आचरण के कारण धरती बंजर होने का खतरा उत्पन्न हो रहा है?',
        questionEnglish: 'Which human behavior creates the risk of land desertification?',
        options: [
          { textHindi: 'अंधाधुंध वृक्षों की कटाई (Indiscriminate deforestation)', textEnglish: 'Indiscriminate felling of trees' },
          { textHindi: 'पौधों को सींचना (Watering plants)', textEnglish: 'Watering plants' },
          { textHindi: 'जैविक खेती अपनाना (Organic farming)', textEnglish: 'Organic farming' },
          { textHindi: 'समय की पाबंदी (Punctuality)', textEnglish: 'Punctuality' }
        ],
        correctIndex: 0,
        explanationHindi: "औद्योगिकीकरण और स्वार्थ में अंधाधुंध वनों की कटाई से धरती के बंजर होने का खतरा है।",
        explanationEnglish: "Rampant deforestation driven by short-term greed causes desertification."
      },
      {
        id: 'gq_e5',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: "प्रस्तुत गद्यांश का सर्वाधिक उपयुक्त शीर्षक क्या होगा?",
        questionEnglish: "What would be the most appropriate title for this passage?",
        options: [
          { textHindi: 'वृक्षों का महत्व और पर्यावरण संरक्षण', textEnglish: 'Significance of Trees & Environmental Conservation' },
          { textHindi: 'मिट्टी के प्रकार', textEnglish: 'Types of Soil' },
          { textHindi: 'पक्षियों के घोंसले', textEnglish: 'Nests of Birds' },
          { textHindi: 'वर्षा का विज्ञान', textEnglish: 'Science of Rain' }
        ],
        correctIndex: 0,
        explanationHindi: "सम्पूर्ण गद्यांश में वृक्षों के पर्यावरणीय महत्व और उनके संरक्षण पर बल दिया गया है।",
        explanationEnglish: "The central thesis revolves around ecological value of trees and conservation."
      },
      {
        id: 'gq_e6',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: "'पर्यावरण' शब्द का सही संधि-विच्छेद क्या है?",
        questionEnglish: "What is the correct sandhi-viched of 'पर्यावरण'?",
        options: [
          { textHindi: 'परि + आवरण', textEnglish: 'Pari + Aavaran' },
          { textHindi: 'पर्या + वरण', textEnglish: 'Parya + Varan' },
          { textHindi: 'पर + आवरण', textEnglish: 'Par + Aavaran' },
          { textHindi: 'परी + आवरण', textEnglish: 'Paree + Aavaran' }
        ],
        correctIndex: 0,
        explanationHindi: "परि (चारों ओर) + आवरण (ढकाव) = पर्यावरण (यण संधि)।",
        explanationEnglish: "Pari + Aavaran combines via Yan Sandhi to form Paryavaran."
      },
      {
        id: 'gq_e7',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: 'गद्यांश के अनुसार भावी पीढ़ियों के सुरक्षित भविष्य के लिए क्या अनिवार्य है?',
        questionEnglish: 'According to the passage, what is mandatory for the future generations?',
        options: [
          { textHindi: 'सक्रिय वृक्षारोपण और पौधों का पालन-पोषण', textEnglish: 'Active tree plantation and nurturing' },
          { textHindi: 'जंगलों को साफ करके फैक्ट्रियाँ लगाना', textEnglish: 'Clearing forests for factories' },
          { textHindi: 'केवल बातें करना और नियम बनाना', textEnglish: 'Making rules without action' },
          { textHindi: 'पेड़ों की लकड़ी बेचना', textEnglish: 'Selling timber' }
        ],
        correctIndex: 0,
        explanationHindi: "अंतिम अनुच्छेद में कहा गया है कि वृक्षारोपण और उनका पालन-पोषण भावी पीढ़ी की गारंटी है।",
        explanationEnglish: "Concludes that tree plantation and maintenance guarantee a secure future."
      },
      {
        id: 'gq_e8',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: "'जीवनदायिनी' शब्द में मूल शब्द और प्रत्यय क्या हैं?",
        questionEnglish: "What are the root word and suffix in 'जीवनदायिनी'?",
        options: [
          { textHindi: 'जीवन + दायिनी (देने वाली)', textEnglish: 'Jeevan + Dayini (giver)' },
          { textHindi: 'जीव + नदायिनी', textEnglish: 'Jeev + Nadayini' },
          { textHindi: 'जी + वनदायिनी', textEnglish: 'Jee + Vandayini' },
          { textHindi: 'जीवनदा + यिनी', textEnglish: 'Jeevanda + Yini' }
        ],
        correctIndex: 0,
        explanationHindi: "'जीवन' मूल शब्द है और 'दायिनी' (प्रदान करने वाली) प्रत्यय के रूप में जुड़ा है।",
        explanationEnglish: "'जीवन' is root, 'दायिनी' denotes one who bestows life."
      }
    ]
  },
  {
    id: 'gad_medium',
    titleHindi: 'समय का मूल्य, अनुशासन और वैज्ञानिक चेतना',
    titleEnglish: 'Value of Time, Discipline & Scientific Consciousness',
    theme: 'समय प्रबंधन व बौद्धिक विकास (Time Management & Intellectual Growth)',
    difficulty: 'medium',
    difficultyLabelHindi: 'मध्यम (Medium)',
    gradeLevel: 'कक्षा 9',
    passageHindi: `समय संसार की सर्वाधिक अमूल्य और अपरिवर्तनीय संपदा है। जीवन के प्रत्येक क्षेत्र में सफलता की आधारशिला समय के सदुपयोग और आत्म-अनुशासन पर ही टिकी हुई है। खोई हुई संपत्ति को कठिन परिश्रम से पुनः अर्जित किया जा सकता है, बिगड़े हुए स्वास्थ्य को उत्तम चिकित्सा और संतुलित दिनचर्या से सुधारा जा सकता है, यहाँ तक कि विस्मृत ज्ञान को भी सतत स्वाध्याय से दोबारा प्राप्त किया जा सकता है; किंतु जो क्षण एक बार हमारी उँगलियों से फिसलकर अतीत के गर्त में विलीन हो गया, वह इस ब्रह्मांड की किसी भी शक्ति द्वारा वापस नहीं लौटाया जा सकता।\\n\\nप्रकृति का समस्त चक्र समयबद्धता और अचूक अनुशासन का उत्कृष्ट प्रमाण है। सूर्य का नियमित उदय-अस्त, ऋतुओं का क्रमिक परिवर्तन, समुद्र का ज्वार-भाटा और आकाशीय नक्षत्रों की निर्धारित गति हमें यह संदेश देती है कि ब्रह्मांड की स्थिरता अनुशासन के नियम पर ही आधारित है। यदि किसान अनुकूल ऋतु में खेत की जुताई और बीज-वपन न करे, तो वर्षा बीत जाने पर उसका पश्चाताप किसी काम नहीं आता। ठीक इसी प्रकार, विद्यार्थी जीवन चरित्र निर्माण और बौद्धिक साधना की वह उर्वर भूमि है, जहाँ समय का एक-एक क्षण भविष्य की दिशा तय करता है। जो छात्र आज के कार्य को कल पर टालने की घातक प्रवृत्ति (प्रोक्रेस्टिनेशन) के शिकार होते हैं, वे अंततः परीक्षा के समय घबराहट और असफलता के भंवर में फँस जाते हैं।\\n\\nइसके साथ ही, आधुनिक युग में वैज्ञानिक चेतना का विकास भी समय के कुशल प्रबंधन पर निर्भर करता है। आज का युग तकनीकी क्रांति और तीव्र प्रतिस्पर्धा का युग है। वैज्ञानिक दृष्टिकोण हमें रूढ़ियों और अंधविश्वासों से मुक्त कर तर्क, प्रयोग और प्रमाण के आधार पर सत्य की खोज करना सिखाता है। जब समय की पाबंदी और वैज्ञानिक दृष्टिकोण का सुखद समन्वय होता है, तब समाज में नवाचार और प्रगति की नई किरणें प्रस्फुटित होती हैं। जो राष्ट्र समय का सम्मान करते हैं, वे ही वैश्विक मंच पर नेतृत्व करते हैं। अतः प्रत्येक जागरूक नागरिक को समय को केवल घड़ी की सुइयों का चलना नहीं, बल्कि जीवन की अनमोल पूँजी समझकर उसका प्रत्येक पल राष्ट्रहित और आत्म-उत्थान में समर्पित करना चाहिए।`,
    englishSummary: `Time is the most irreversible resource in existence. While wealth, health, and knowledge can be regained, spent moments vanish forever into history. Nature operates on meticulous punctuality, demonstrating that order and progress depend on discipline. Combined with a modern scientific temper that prizes reasoning over dogma, temporal stewardship fuels innovation and national prosperity.`,
    vocabularyList: [
      { word: 'अपरिवर्तनीय (Irreversible)', meaningHindi: 'जिसे बदला न जा सके', meaningEnglish: 'Unchangeable / irrevocable' },
      { word: 'उर्वर (Fertile)', meaningHindi: 'उपजाऊ, फलदायी', meaningEnglish: 'Fertile / productive' },
      { word: 'विस्मृत (Forgotten)', meaningHindi: 'भूला हुआ, स्मृति से ओझल', meaningEnglish: 'Forgotten / lapsed' },
      { word: 'प्रस्फुटित (Blossomed)', meaningHindi: 'खिलना या फूट पड़ना', meaningEnglish: 'Emerged / blossomed forth' }
    ],
    questions: [
      {
        id: 'gq_m1',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: 'गद्यांश के अनुसार ऐसी कौन सी संपदा है जिसे किसी भी शक्ति द्वारा वापस नहीं पाया जा सकता?',
        questionEnglish: 'According to the passage, which asset can never be retrieved by any force?',
        options: [
          { textHindi: 'बीता हुआ समय (Elapsed time)', textEnglish: 'Elapsed time' },
          { textHindi: 'खोया हुआ धन (Lost wealth)', textEnglish: 'Lost money' },
          { textHindi: 'बिगड़ा हुआ स्वास्थ्य (Impaired health)', textEnglish: 'Health' },
          { textHindi: 'विस्मृत ज्ञान (Forgotten knowledge)', textEnglish: 'Knowledge' }
        ],
        correctIndex: 0,
        explanationHindi: "गद्यांश स्पष्ट करता है कि धन, स्वास्थ्य और ज्ञान पुनः प्राप्त हो सकते हैं, किंतु बीता हुआ समय कभी वापस नहीं आता।",
        explanationEnglish: "The passage notes that wealth, health, and knowledge can be restored, but time cannot."
      },
      {
        id: 'gq_m2',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: "प्रकृति की कौन सी विशेषता मनुष्य को अनुशासन का पाठ पढ़ाती है?",
        questionEnglish: 'Which aspect of nature teaches humans the lesson of discipline?',
        options: [
          { textHindi: 'ऋतुओं और आकाशीय पिंडों की नियमित समयबद्ध गति', textEnglish: 'Punctual cyclical movement of seasons and celestial bodies' },
          { textHindi: 'अचानक आने वाले तूफान', textEnglish: 'Sudden unpredictable storms' },
          { textHindi: 'जंगलों की अनियंत्रित वृद्धि', textEnglish: 'Wild uncontrolled growth' },
          { textHindi: 'नदियों का मार्ग बदलना', textEnglish: 'Rivers changing courses' }
        ],
        correctIndex: 0,
        explanationHindi: "सूर्य का समय पर उदय होना, ऋतुओं का चक्र और नक्षत्रों की गति नियमित अनुशासन सिखाते हैं।",
        explanationEnglish: "Cyclical predictability of dawn, seasons, and orbits models cosmic discipline."
      },
      {
        id: 'gq_m3',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: "विद्यार्थी जीवन को किस रूप में निरूपित किया गया है?",
        questionEnglish: 'How has student life been characterized in the passage?',
        options: [
          { textHindi: 'चरित्र निर्माण और बौद्धिक साधना की उर्वर भूमि', textEnglish: 'Fertile ground for character building and intellectual cultivation' },
          { textHindi: 'केवल खेलकूद और आमोद-प्रमोद का समय', textEnglish: 'Time solely for amusement' },
          { textHindi: 'दूसरों की नकल करने की अवस्था', textEnglish: 'Stage for imitating others' },
          { textHindi: 'बिना किसी उत्तरदायित्व का काल', textEnglish: 'Period devoid of responsibilities' }
        ],
        correctIndex: 0,
        explanationHindi: "विद्यार्थी जीवन चरित्र निर्माण की वह उर्वर भूमि है जहाँ समय का सदुपयोग भविष्य संवारता है।",
        explanationEnglish: "Defined as fertile terrain where timely effort sows future leadership."
      },
      {
        id: 'gq_m4',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: "वैज्ञानिक दृष्टिकोण की मुख्य विशेषता क्या है?",
        questionEnglish: 'What is the hallmark of a scientific mindset?',
        options: [
          { textHindi: 'तर्क, प्रयोग और प्रमाण के आधार पर सत्य की खोज', textEnglish: 'Pursuit of truth based on logic, experimentation, and evidence' },
          { textHindi: 'पुरानी रूढ़ियों को आँख मूँदकर स्वीकारना', textEnglish: 'Blind adherence to ancient dogma' },
          { textHindi: 'केवल मशीनों का अधिक उपयोग करना', textEnglish: 'Solely using gadgets' },
          { textHindi: 'परंपराओं का बिना सोचे विरोध करना', textEnglish: 'Rejecting tradition without thought' }
        ],
        correctIndex: 0,
        explanationHindi: "वैज्ञानिक दृष्टिकोण रूढ़ियों से परे तर्क, परीक्षण और प्रमाण को सर्वोपरि मानता है।",
        explanationEnglish: "A scientific outlook relies on reason, empirical testing, and verifiable evidence."
      },
      {
        id: 'gq_m5',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: "'उर्वर' शब्द का विलोम शब्द क्या होगा?",
        questionEnglish: "What is the exact antonym of 'उर्वर' (Fertile)?",
        options: [
          { textHindi: 'ऊसर / बंजर (Barren)', textEnglish: 'Barren / sterile' },
          { textHindi: 'सरल (Simple)', textEnglish: 'Simple' },
          { textHindi: 'कठोर (Hard)', textEnglish: 'Hard' },
          { textHindi: 'शुद्ध (Pure)', textEnglish: 'Pure' }
        ],
        correctIndex: 0,
        explanationHindi: "'उर्वर' (उपजाऊ) का विलोम 'ऊसर' या 'बंजर' (अनुपजाऊ) होता है।",
        explanationEnglish: "'उर्वर' (fertile) has the exact antonym 'ऊसर' (barren/sterile)."
      },
      {
        id: 'gq_m6',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: "'आत्म-अनुशासन' में कौन सा समास है?",
        questionEnglish: "Which Samas is found in 'आत्म-अनुशासन' (Self-discipline)?",
        options: [
          { textHindi: 'तत्पुरुष समास (Tatpurush Samas)', textEnglish: 'Tatpurush Samas' },
          { textHindi: 'द्वंद्व समास (Dvandva Samas)', textEnglish: 'Dvandva Samas' },
          { textHindi: 'द्विगु समास (Dvigu Samas)', textEnglish: 'Dvigu Samas' },
          { textHindi: 'कर्मधारय समास (Karmadharaya Samas)', textEnglish: 'Karmadharaya Samas' }
        ],
        correctIndex: 0,
        explanationHindi: "आत्म (स्वयं) का अनुशासन = संबंध तत्पुरुष समास।",
        explanationEnglish: "Discipline of the self (संबंध तत्पुरुष समास)."
      },
      {
        id: 'gq_m7',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: "वैश्विक मंच पर कौन से राष्ट्र नेतृत्व करते हैं?",
        questionEnglish: 'Which nations lead on the global stage according to the passage?',
        options: [
          { textHindi: 'जो समय का सम्मान और वैज्ञानिक नवाचार करते हैं', textEnglish: 'Those that respect time and pioneer scientific innovation' },
          { textHindi: 'जिनके पास केवल प्राकृतिक संसाधन हों', textEnglish: 'Those having raw resources only' },
          { textHindi: 'जो प्राचीन मान्यताओं में ही अटके रहते हैं', textEnglish: 'Those stuck solely in past rituals' },
          { textHindi: 'जो परिश्रम से बचते हैं', textEnglish: 'Those avoiding hard work' }
        ],
        correctIndex: 0,
        explanationHindi: "गद्यांश बताता है कि समय की कद्र और वैज्ञानिक नवाचार करने वाले देश ही विश्व का मार्गदर्शन करते हैं।",
        explanationEnglish: "Nations that steward time and cultivate empirical innovation lead the global order."
      },
      {
        id: 'gq_m8',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: "विद्यार्थियों के लिए कार्य टालने की आदत को लेखक ने कैसा बताया है?",
        questionEnglish: 'How does the author describe the habit of procrastination among students?',
        options: [
          { textHindi: 'घातक प्रवृत्ति जो अंततः असफलता में धकेलती है', textEnglish: 'A fatal tendency leading to panic and failure' },
          { textHindi: 'आराम करने का अच्छा तरीका', textEnglish: 'A good way to relax' },
          { textHindi: 'बुद्धिमत्ता का प्रतीक', textEnglish: 'Sign of cleverness' },
          { textHindi: 'स्वाभाविक व हानिरहित आदत', textEnglish: 'A harmless natural habit' }
        ],
        correctIndex: 0,
        explanationHindi: "लेखक ने आज का काम कल पर टालने को 'घातक प्रवृत्ति' कहा है जो अंत में घबराहट और असफलता लाती है।",
        explanationEnglish: "Procrastination is explicitly termed a fatal trap causing panic and defeat."
      }
    ]
  },
  {
    id: 'gad_hard',
    titleHindi: 'सांस्कृतिक चेतना, भारतीय साहित्य और नैतिक मूल्यों का द्वंद्व',
    titleEnglish: 'Cultural Consciousness, Indian Literature & Moral Dilemma',
    theme: 'साहित्य, संस्कृति व दर्शन (Literature, Culture & Philosophy)',
    difficulty: 'hard',
    difficultyLabelHindi: 'अत्यंत कठिन (Very Hard)',
    gradeLevel: 'कक्षा 10',
    passageHindi: `किसी भी राष्ट्र की वास्तविक अस्मिता उसकी गगनचुम्बी अट्टालिकाओं अथवा विपुल भौतिक संपदा में नहीं, अपितु उसकी उस शाश्वत सांस्कृतिक चेतना और नैतिक जीवन-दृष्टि में संनिहित होती है, जो युग-युगांतरों के ऐतिहासिक झंझावातों को सहकर भी अक्षुण्ण बनी रहती है। भारतीय मनीषा ने अनादि काल से यह उद्घोष किया है कि ज्ञान का चरम साध्य केवल सूचनाओं का संचय अथवा व्यावहारिक उपयोगितावाद नहीं, प्रत्युत मनुष्य की अंतःचेतना का परिष्कार और उसमें सार्वभौमिक करुणा एवं सत्यनिष्ठा की प्रतिष्ठा है। हमारे उपनिषदों का अमर संदेश ‘आत्मवत् सर्वभूतेषु’ (समस्त प्राणियों को अपने समान देखना) केवल एक दार्शनिक आदर्श मात्र नहीं, अपितु सामाजिक समरसता और पारिस्थितिक संतुलन का आधारभूत स्तम्भ रहा है।\\n\\nइस सांस्कृतिक विरासत के संवहन में भारतीय साहित्य की भूमिका अद्वितीय रही है। वाल्मीकि के रामायण से लेकर कालिदास, तुलसीदास, कबीर और आधुनिक युग में रवींद्रनाथ ठाकुर तथा प्रेमचंद तक—हमारे मूर्धन्य साहित्यकारों ने केवल कल्पना-विलास नहीं किया, बल्कि समाज के अंतर्विरोधों, मानवीय संवेदनाओं और कर्तव्य-पथ की दुरूहता को वाणी दी। साहित्य समाज का केवल निष्क्रिय दर्पण नहीं है, बल्कि वह एक ऐसा प्रखर मशालची है जो अंधकारमय कालखंडों में भी सत्य, न्याय और मानवीय गरिमा का मार्ग आलोकित करता है। जब किसी समाज में संवेदनहीनता, स्वार्थपरता और नैतिक क्षरण का प्रसार होने लगता है, तब साहित्य ही वह संजीवनी बनकर उभरता है जो मुरझाते मानवीय मूल्यों को नवजीवन प्रदान करता है।\\n\\nतथापि, इक्कीसवीं सदी के उत्तर-आधुनिक युग में वैश्वीकरण और अनियंत्रित उपभोक्तावादी संस्कृति के तीव्र प्रभाव ने एक गंभीर वैचारिक द्वंद्व उत्पन्न कर दिया है। आज भौतिक सुख-सुविधाओं की अंधी मृगतृष्णा में व्यक्ति अपनी सांस्कृतिक जड़ों और नैतिक दायित्वों से विच्छिन्न होता जा रहा है। तकनीक ने जहाँ दूरियों को मिटाकर सम्पूर्ण विश्व को एक वैश्विक ग्राम में रूपांतरित किया है, वहीं विडंबना यह है कि उसने मानव-मन के मध्य परस्पर आत्मीयता और सह-अस्तित्व की भावना को संकुचित कर दिया है। इस विषम परिस्थिति में हमारी प्राचीन सांस्कृतिक धरोहर और आधुनिक वैज्ञानिक विवेक के मध्य एक संतुलित समन्वय स्थापित करना अपरिहार्य हो गया है। हमें अपनी जड़ों से पोषण प्राप्त करते हुए नवीन क्षितिजों की ओर अग्रसर होना होगा, ताकि विकास का रथ मानवीय संवेदनाओं को कुचलकर आगे न बढ़े।`,
    englishSummary: `A nation\\'s quintessential identity resides not in physical infrastructure, but within its timeless cultural ethos and moral equilibrium. Indian philosophical literature—from the Upanishads to Premchand—has served as an active beacon illuminating duty, universal empathy, and human dignity. Faced with post-modern consumerism and technological alienation, civilizational survival hinges upon synthesizing ancient ethical rootedness with modern critical scientific rationalism.`,
    vocabularyList: [
      { word: 'संनिहित (Inherent / Embodied)', meaningHindi: 'अंदर समाया हुआ या निहित', meaningEnglish: 'Embedded / inherent within' },
      { word: 'अक्षुण्ण (Intact / Undivided)', meaningHindi: 'जो कभी नष्ट न हुआ हो, अखंड', meaningEnglish: 'Unbroken / imperishable' },
      { word: 'अंतर्विरोध (Contradiction)', meaningHindi: 'आपसी टकराव या अंतःसंघर्ष', meaningEnglish: 'Internal contradictions / conflicts' },
      { word: 'अपरिहार्य (Inevitable)', meaningHindi: 'जिसका त्याग न किया जा सके, अत्यंत आवश्यक', meaningEnglish: 'Indispensable / unavoidable' }
    ],
    questions: [
      {
        id: 'gq_h1',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: "गद्यांश के अनुसार किसी राष्ट्र की वास्तविक अस्मिता किसमें संनिहित होती है?",
        questionEnglish: 'According to the passage, where does a nation\\'s true identity reside?',
        options: [
          { textHindi: 'सांस्कृतिक चेतना और नैतिक जीवन-दृष्टि में', textEnglish: 'In cultural consciousness and moral worldview' },
          { textHindi: 'विशाल इमारतों और भौतिक संपदा में', textEnglish: 'In skyscrapers and material assets' },
          { textHindi: 'केवल सामरिक हथियारों की संख्या में', textEnglish: 'In sheer military stockpile' },
          { textHindi: 'विदेशी तकनीकों के अंधानुकरण में', textEnglish: 'In blind imitation of foreign tech' }
        ],
        correctIndex: 0,
        explanationHindi: "प्रथम वाक्य स्पष्ट करता है कि राष्ट्र की पहचान भौतिक वैभव में नहीं, अपितु सांस्कृतिक चेतना और नैतिक दृष्टि में है।",
        explanationEnglish: "The opening sentence declares that identity lies in moral worldview rather than buildings."
      },
      {
        id: 'gq_h2',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: "'आत्मवत् सर्वभूतेषु' उपनिषदीय सूत्र का व्यवहारिक मर्म क्या है?",
        questionEnglish: 'What is the practical essence of the Upanishadic maxim \\'Atmavat Sarvabhuteshu\\'?',
        options: [
          { textHindi: 'समस्त प्राणियों के प्रति समभाव और सार्वभौमिक करुणा रखना', textEnglish: 'Universal empathy and regarding all beings as oneself' },
          { textHindi: 'केवल अपने लाभ और स्वार्थ की चिंता करना', textEnglish: 'Caring solely for personal gain' },
          { textHindi: 'प्रकृति के दोहन को जायज ठहराना', textEnglish: 'Justifying exploitation of nature' },
          { textHindi: 'समाज से अलग-थलग हो जाना', textEnglish: 'Isolating oneself from society' }
        ],
        correctIndex: 0,
        explanationHindi: "'आत्मवत् सर्वभूतेषु' का अर्थ सभी जीवों को अपने समान मानकर करुणा व समरसता से व्यवहार करना है।",
        explanationEnglish: "It commands viewing every sentient life as equivalent to one's own self."
      },
      {
        id: 'gq_h3',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: "लेखक ने साहित्य की भूमिका को 'निष्क्रिय दर्पण' से परे क्या संज्ञा दी है?",
        questionEnglish: 'Beyond a passive mirror, what title does the author ascribe to literature?',
        options: [
          { textHindi: 'अंधकार में मार्ग आलोकित करने वाला प्रखर मशालची', textEnglish: 'A blazing torchbearer illuminating truth in darkness' },
          { textHindi: 'कोरी कल्पनाओं का काल्पनिक संसार', textEnglish: 'A realm of mere escapist fantasy' },
          { textHindi: 'केवल व्याकरण के नियमों का संग्रह', textEnglish: 'A dry handbook of grammar rules' },
          { textHindi: 'शासकों की प्रशंसा करने वाला माध्यम', textEnglish: 'A tool for flattering monarchs' }
        ],
        correctIndex: 0,
        explanationHindi: "साहित्य केवल दर्पण नहीं, बल्कि कठिन कालखंडों में न्याय और सत्य का मार्ग दिखाने वाला मशालची है।",
        explanationEnglish: "Characterized as a fiery torchbearer charting the path of justice through historical gloom."
      },
      {
        id: 'gq_h4',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: "आधुनिक तकनीकी क्रांति की विडंबना गद्यांश में क्या बताई गई है?",
        questionEnglish: 'What paradox of modern technological revolution is highlighted?',
        options: [
          { textHindi: 'वैश्विक दूरियाँ घटीं किंतु दिलों की पारस्परिक आत्मीयता संकुचित हुई', textEnglish: 'Geographical distances shrank, yet human warmth and solidarity narrowed' },
          { textHindi: 'संचार के साधनों में भारी कमी आ गई', textEnglish: 'Communication tools decreased' },
          { textHindi: 'लोग केवल पुस्तकें पढ़ने लगे हैं', textEnglish: 'People only read books now' },
          { textHindi: 'प्रकृति का संरक्षण स्वतः हो गया', textEnglish: 'Nature protected itself automatically' }
        ],
        correctIndex: 0,
        explanationHindi: "विश्व एक ग्राम तो बना, किंतु मनुष्यों के बीच भावनात्मक दूरी और अलगाव बढ़ गया।",
        explanationEnglish: "The tragedy of the global village is the shrinkage of inner emotional communion."
      },
      {
        id: 'gq_h5',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: "'अक्षुण्ण' शब्द का सही अर्थ क्या है?",
        questionEnglish: "What is the precise meaning of 'अक्षुण्ण'?",
        options: [
          { textHindi: 'जो कभी खंडित या नष्ट न हुआ हो (Unbroken / Intact)', textEnglish: 'Intact / unbroken' },
          { textHindi: 'जो तुरंत नष्ट हो जाए (Transient)', textEnglish: 'Transient' },
          { textHindi: 'जो बहुत छोटा हो (Minute)', textEnglish: 'Minute' },
          { textHindi: 'जो दिखाई न दे (Invisible)', textEnglish: 'Invisible' }
        ],
        correctIndex: 0,
        explanationHindi: "'अक्षुण्ण' का अर्थ अखंड, सुरक्षित और न टूटने वाला है।",
        explanationEnglish: "'अक्षुण्ण' denotes unassailable wholeness that withstands dissolution."
      },
      {
        id: 'gq_h6',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: "'सार्वभौमिक' शब्द में मूल शब्द और प्रत्यय का सही युग्म क्या है?",
        questionEnglish: "Identify the root word and suffix in 'सार्वभौमिक':",
        options: [
          { textHindi: 'सर्वभूमि + इक', textEnglish: 'Sarvabhoomi + Ik' },
          { textHindi: 'सार्व + भौमिक', textEnglish: 'Saarva + Bhaumik' },
          { textHindi: 'सर्वभौम + इक', textEnglish: 'Sarvabhaum + Ik' },
          { textHindi: 'सार्वभौम + क', textEnglish: 'Saarvabhaum + K' }
        ],
        correctIndex: 0,
        explanationHindi: "सर्वभूमि (समस्त पृथ्वी) में 'इक' प्रत्यय लगने से आदि स्वर की वृद्धि होकर 'सार्वभौमिक' बनता है।",
        explanationEnglish: "Sarvabhoomi + suffix 'इक' yields vowel lengthening to form Saarvabhaumik."
      },
      {
        id: 'gq_h7',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: "वर्तमान विषम परिस्थिति में लेखक किस समन्वय को अपरिहार्य मानते हैं?",
        questionEnglish: 'Which synthesis does the author consider indispensable in our era?',
        options: [
          { textHindi: 'प्राचीन सांस्कृतिक धरोहर और आधुनिक वैज्ञानिक विवेक का संतुलन', textEnglish: 'Equilibrium between ancient cultural heritage and modern scientific reason' },
          { textHindi: 'आधुनिकता को त्यागकर केवल प्राचीन काल में लौट जाना', textEnglish: 'Abandoning modernity to retreat solely to antiquity' },
          { textHindi: 'नैतिक मूल्यों को पूरी तरह समाप्त कर देना', textEnglish: 'Discarding moral values altogether' },
          { textHindi: 'केवल उपभोक्तावादी दृष्टिकोण अपनाना', textEnglish: 'Embracing unchecked consumerism' }
        ],
        correctIndex: 0,
        explanationHindi: "लेखक के अनुसार जड़ों (संस्कृति) से जुड़े रहकर वैज्ञानिक विवेक के साथ आगे बढ़ना ही श्रेयस्कर है।",
        explanationEnglish: "Advocates dynamic synthesis: rootedness in ethical tradition coupled with modern empirical wisdom."
      },
      {
        id: 'gq_h8',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: "गद्यांश की समग्र शैली और भाषा-प्रकृति कैसी है?",
        questionEnglish: 'What is the overarching stylistic register and tone of the passage?',
        options: [
          { textHindi: 'गंभीर, तत्समप्रधान, वैचारिक एवं उद्बोधक शैली', textEnglish: 'Profound, Sanskritized (Tatsam), contemplative & exhortative' },
          { textHindi: 'हास्य-व्यंग्य प्रधान और बोलचाल की भाषा', textEnglish: 'Colloquial satire' },
          { textHindi: 'विदेशी शब्दों से भरी अनौपचारिक भाषा', textEnglish: 'Slang-laden informal diction' },
          { textHindi: 'रूखी और नीरस तथ्यात्मक रिपोर्ट', textEnglish: 'Dry factual journalism' }
        ],
        correctIndex: 0,
        explanationHindi: "गद्यांश में उच्च स्तरीय तत्सम शब्दावली और चिंतनशील, प्रेरणादायक वैचारिक शैली प्रयुक्त हुई है।",
        explanationEnglish: "Distinguished by classical Tatsam vocabulary and elevated philosophic prose."
      }
    ]
  }
];"""

with open('src/data/grammarData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace APATHIT_GADYANSH_PASSAGES block
content = re.sub(
    r"export const APATHIT_GADYANSH_PASSAGES: ApathitGadyanshPassage\[\] = \[[\s\S]*?\n\];",
    passages_code.strip(),
    content
)

with open('src/data/grammarData.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully updated APATHIT_GADYANSH_PASSAGES with long, lengthy passages across Easy, Medium, and Very Hard!")
