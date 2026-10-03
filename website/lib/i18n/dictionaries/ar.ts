import type { Dictionary } from "./en";

/** Arabic (RTL). Brand names and credential issuers stay in Latin script. */
const ar: Dictionary = {
  // needs native review (meta)
  meta: {
    siteTitle: "مدربك الشخصي في دبي | سعيد سليماني · FITologist.me",
    siteTitleCertified: "مدربك الشخصي المعتمد في دبي | سعيد سليماني · FITologist.me",
    siteDescription:
      "مرحباً، أنا سعيد، مدربك الشخصي في دبي. تدريب مصمَّم حول جدولك المزدحم: فردي وثنائي وأونلاين وهجين في منزلك أو في الجداف. استشارة مجانية لمدة 30 دقيقة.",
    about: {
      title: "عن سعيد سليماني | FITologist.me",
      description: "تعرّف على سعيد سليماني، مدرب شخصي في دبي يدرّب المهنيين المشغولين بشكل فردي وأونلاين وهجين، وبثلاث لغات.",
    },
    method: {
      title: "منهجية FITologist | FITologist.me",
      description: "التقييم، البناء، التحوّل، التجاوز: منهجية FITologist بأربع مراحل، وأول 30 يوماً، ومتابعة التقدّم والتغذية.",
    },
    plans: {
      title: "خطط التدريب | FITologist.me",
      description: "Foundation وMomentum وAccelerate وElite: خطط تدريب شخصي بجلسات مدتها 60 دقيقة في دبي، إضافة إلى التدريب الثنائي والأونلاين والهجين.",
    },
    bmi: {
      title: "فحص مجاني لمؤشر كتلة الجسم والسعرات | FITologist.me",
      description: "فحص مجاني في 30 ثانية: مؤشر كتلة جسمك، ونطاق الوزن الصحي لطولك، وسعراتك اليومية التقديرية.",
    },
    start: {
      title: "احجز استشارة مجانية | FITologist.me",
      description: "احجز استشارة مجانية لمدة 30 دقيقة مع سعيد سليماني، مدرب شخصي في دبي. أونلاين أو حضورياً.",
    },
    terms: {
      title: "الإلغاء وإعادة الجدولة | FITologist.me",
      description: "شروط الإلغاء وإعادة الجدولة وصلاحية الخطط والدفع للتدريب الشخصي مع سعيد سليماني.",
    },
    privacy: {
      title: "سياسة الخصوصية | FITologist.me",
      description: "كيف يتعامل FITologist.me مع المعلومات التي تشاركها: ما نجمعه ولماذا وأين يُحفظ وحقوقك.",
    },
    notFound: "الصفحة غير موجودة | FITologist.me",
  },

  nav: {
    home: "الرئيسية",
    method: "كيف نعمل",
    plans: "خطط التدريب",
    about: "تعرّف على سعيد",
    bmi: "فحص BMI مجاني",
    cta: "احجز استشارة مجانية",
    ctaShort: "استشارة مجانية",
    primaryLabel: "القائمة الرئيسية",
    mobileLabel: "قائمة الجوال",
    footerLabel: "روابط التذييل",
    openMenu: "فتح القائمة",
    closeMenu: "إغلاق القائمة",
    menu: "القائمة",
    skip: "تخطَّ إلى المحتوى",
    backToTop: "العودة إلى الأعلى",
    changeLanguage: "تغيير اللغة",
    language: "اللغة",
    instagram: "FITologist على Instagram",
  },

  common: {
    location: "دبي، الإمارات",
    tagline: ["تدرّب", "تحوّل", "تجاوز"],
    whatsappSaeid: "راسل سعيد على واتساب",
    chatOnWhatsApp: "تحدث مع سعيد على واتساب",
    newTab: "يفتح في علامة تبويب جديدة",
    defaultWhatsAppMessage: "مرحباً سعيد، وجدتك على fitologist.me وأود معرفة المزيد.",
  },

  // needs native review (hero + trust strip)
  hero: {
    eyebrow: "مرحباً، أنا سعيد",
    /** H1 as two controlled lines (credentials off) */
    titleLines: ["مدربك الشخصي", "في دبي"],
    /** H1 as two controlled lines when the Active IQ certificate is on (§1) */
    titleCertifiedLines: ["مدربك الشخصي", "المعتمد في دبي"],
    subLead: "تدريب مصمَّم حول جدولك المزدحم:",
    sub: "تدريب فردي 1:1 وثنائي (للأزواج والأصدقاء)، وتدريب أونلاين وهجين.",
    primary: "احجز استشارة مجانية",
    secondary: "افحص مؤشر كتلة جسمك في 30 ثانية",
    alt: "سعيد، مدرب شخصي، يبتسم مكتوف الذراعين في صالة رياضية في دبي",
  },

  trust: {
    label: "لمحة سريعة",
    languages: "اللغات المستخدمة",
    reps: "REPs UAE",
    /** Short trust-strip line (one line, matches "Active IQ Level 3") */
    repsRegistered: "مسجّل لدى REPs UAE",
    repsNo: "رقم",
    activeIq: "Active IQ المستوى الثالث",
    area: "دبي، الجداف وما حولها",
    homeSessions: "جلسات في المنزل والنادي متاحة",
  },


  // needs native review (goals, bodyCheck, lead)
  goals: {
    fat: "خسارة الدهون",
    muscle: "بناء العضلات",
    strength: "زيادة القوة",
    mobility: "حركة أفضل",
    confidence: "بناء الثقة",
    unsure: "لست متأكداً بعد",
  },

  // needs native review (who)
  who: {
    eyebrow: "مع من أعمل",
    title: "مصمَّم للحياة الواقعية",
    intro: "لمن يريد نتائج حقيقية دون أن تصبح اللياقة حياته بأكملها.",
    profiles: [
      {
        title: "المهنيون المشغولون",
        body: "تدرّب وفق جدولك المزدحم، بجلسات تناسب أسبوعك.",
      },
      { title: "المبتدئون", body: "تعلّم الأداء الصحيح وابنِ ثقتك من اليوم الأول." },
      {
        title: "تتدرب بالفعل",
        body: "تتدرب دون خطة واضحة؟ احصل على برمجة منظمة وتقدّم ثابت.",
      },
    ],
  },

  meet: {
    eyebrow: "تعرّف على سعيد",
    lead: "أدرّب المشغولين كما أدرّب نفسي: بتنظيم وصدق ودون إضاعة للوقت.",
    body: "خمس سنوات من التدريب، واثنتا عشرة سنة في عالم الشركات، وتدريب بثلاث لغات.",
    link: "المزيد عن سعيد",
    photoAlt: "صورة لسعيد سليماني، مدرب شخصي في دبي",
  },

  testimonials: {
    title: "ماذا يقول المتدربون",
  },

  faq: {
    title: "أسئلة شائعة",
    items: [
      { q: "أين تُقام الجلسات؟", a: "في منزلك، أو في صالة مبناك، أو في صالة رياضية في الجداف والمناطق القريبة. التدريب الأونلاين متاح في أي مكان." },
      { q: "كم التكلفة؟", a: "كل خطة مصممة لك. في استشارتك المجانية لمدة 30 دقيقة، يوصي سعيد بالخطة المناسبة ويخبرك بسعرها." },
      { q: "هل أحتاج إلى اشتراك في صالة رياضية؟", a: "ليس بالضرورة. يمكننا التدريب في منزلك أو في صالة مبناك." },
      { q: "كم جلسة أسبوعياً يجب أن أحضر؟", a: "يبدأ معظم المهنيين المشغولين بجلستين أسبوعياً (Momentum). يمكنك الاختيار من جلسة إلى أربع." },
      { q: "هل التغذية مشمولة؟", a: "نعم. تشمل كل خطة إرشادات غذائية: أهداف السعرات والبروتين وعادات أكل عملية." },
      { q: "هل يمكنني التدريب مع شريك؟", a: "نعم. التدريب الثنائي متاح في الخطط الأربع، بسعر خاص للشريكين." },
      { q: "أنا مبتدئ تماماً. هل هذا مناسب؟", a: "بالتأكيد. ستتعلّم الأداء الصحيح من جلستك الأولى." },
      { q: "ما اللغات التي تدرّب بها؟", a: "الإنجليزية والفارسية والأذربيجانية." },
      { q: "ماذا لو احتجت إلى الإلغاء؟", a: "إعادة الجدولة مجانية مع إشعار قبل 24 ساعة. راجع", link: "سياسة الإلغاء كاملة" },
    ],
  },

  ctaBlock: {
    title: "خطوتك الأولى مجانية.",
  },

  bodyCheck: {
    title: "فحص الجسم المجاني",
    subtitle: "30 ثانية. اعرف مؤشر كتلة جسمك، ونطاق الوزن الصحي لطولك، وتقديراً لسعراتك اليومية.",
    formLabel: "فحص الجسم المجاني",
    units: "الوحدات",
    metric: "سم / كغ",
    imperial: "قدم-إنش / رطل",
    height: "الطول",
    weight: "الوزن",
    age: "العمر",
    sex: "الجنس",
    male: "ذكر",
    female: "أنثى",
    activity: "مستوى النشاط",
    activities: { sitting: "جلوس معظم الوقت", light: "نشاط خفيف", very: "نشاط عالٍ" },
    goals: "الأهداف",
    optional: "(اختياري)",
    unitCm: "سم",
    unitKg: "كغ",
    unitFt: "قدم",
    unitIn: "إنش",
    unitLb: "رطل",
    unitYrs: "سنة",
    calculate: "احسب أرقامي",
    yourBmi: "مؤشر كتلة جسمك",
    healthyRange: "النطاق الصحي لطولك",
    maintenance: "السعرات التقديرية للمحافظة على الوزن",
    kcal: "سعرة/يوم",
    categories: { under: "نقص الوزن", healthy: "صحي", over: "زيادة الوزن", obese: "سمنة" },
    explain: "مؤشر كتلة الجسم لا يميّز بين العضلات والدهون. في استشارتك المجانية، يحوّل سعيد هذه الأرقام إلى خطة لأهدافك",
    sendResult: "أرسل نتيجتي إلى سعيد",
    book: "احجز استشارة مجانية",
    disclaimer: "تقديرات فقط، وليست نصيحة طبية. للبالغين 18+.",
    whatsapp: {
      intro: "مرحباً سعيد، أجريت للتو فحص الجسم على fitologist.me.",
      bmi: "مؤشر كتلة الجسم",
      age: "العمر",
      goals: "الأهداف",
      outro: "أود حجز استشارة مجانية.",
    },
    errors: {
      heightCm: "أدخل طولك بالسنتيمتر (120–230).",
      heightFt: "أدخل طولك بالقدم والإنش (3 قدم 11 إنش – 7 قدم 6 إنش).",
      weightKg: "أدخل وزنك بالكيلوغرام (35–250).",
      weightLb: "أدخل وزنك بالرطل (77–551).",
      age: "أدخل عمرك (18–80).",
      minor: "هذا الفحص للبالغين 18+.",
      sex: "اختر الجنس.",
      activity: "اختر مستوى نشاطك.",
    },
  },

  // needs native review
  about: {
    eyebrow: "تعرّف على مدربك",
    subtitle: "مدرب شخصي · دبي",
    subtitleRegistered: "مدرب شخصي مسجّل لدى REPs UAE",
    subtitleCertified: "مدرب شخصي معتمد · دبي",
    languagesLine: {
      before: "أدرّب باللغات:",
      and: "و",
    },
    lead: "أدرّب المشغولين كما أدرّب نفسي: بتنظيم وصدق ودون إضاعة للوقت.",
    stats: [
      {
        value: "5 سنوات",
        label: "تدريب",
      },
      {
        value: "+12 سنة",
        label: "في الشركات",
      },
      {
        value: "3",
        label: "لغات",
      },
    ],
    storyTitle: "قصتي",
    story: [
      "قبل خمس سنوات بدأت التدرّب بجدية، مع مدرب وهيكل وخطة، بالطريقة نفسها التي أعمل بها الآن مع متدربيّ. غيّر ذلك أكثر من جسدي: غيّر شعوري وتركيزي وطريقة تعاملي مع مسيرة مهنية مرهقة. ومع الوقت أصبح التدريب أكثر من عادة. درسته بشكل منهجي،",
      "لأكثر من اثنتي عشرة سنة عملت في تطوير الأعمال في إيران ودول الخليج، وقبل ذلك قضيت خمس سنوات في التدريس. أعرف ما تفعله الأيام الطويلة والسفر والضغط بالنوايا الحسنة، وأعرف كيف أشرح الأمور ببساطة. هذا ما أقدّمه لكل متدرب: جلسات فعّالة، وخطة واضحة، وتقدّم يمكن قياسه، مصمَّم حول حياتك كما هي.",
    ],
    aiqPending: "وأنا الآن أُكمل دبلوم المستوى الثالث في تدريب الصالات الرياضية والتدريب الشخصي من Active IQ، وهو مؤهل خاضع للتنظيم في المملكة المتحدة.",
    aiqEarned: "وحصلت على دبلوم المستوى الثالث في تدريب الصالات الرياضية والتدريب الشخصي من Active IQ، وهو مؤهل خاضع للتنظيم في المملكة المتحدة.",
    credentialsTitle: "الشهادات المهنية في اللياقة",
    // needs native review (credentials)
    credentials: {
      aiq: { title: "دبلوم المستوى الثالث", line: "تدريب الصالات الرياضية والتدريب الشخصي", note: "مؤهل خاضع للتنظيم في المملكة المتحدة" },
      reps: { title: "مدرب شخصي مسجَّل", country: "الإمارات", level: "المستوى 3" },
    },
    /** Accessible names for the inline flag icons on the credential cards */
    flags: { uk: "المملكة المتحدة", uae: "الإمارات العربية المتحدة" },
    repsNo: "رقم",
    galleryLabel: "صور سعيد",
    portraitAlt: "صورة لسعيد سليماني، المدرب وراء FITologist، بقميص FITologist ومكتوف الذراعين",
    dictionary: {
      label: "قطعة ممزقة من صفحة قاموس إنجليزي، تشرح كلمات fit وfitness وFITologist",
      note: "هذا أنا!",
      translation: "FITologist (اسم): مدرب يدرس ما يجعل الناس في لياقة جيدة، ويجعله يناسب حياتك. ◂ انظر أيضاً: سعيد (دبي)",
    },
  },


  // needs native review (method)
  method: {
    eyebrow: "كيف نعمل",
    titleBefore: "منهجية",
    titleAfter: "",
    intro: "أربع مراحل. عملية واحدة واضحة، لتعرف دائماً أين أنت وما الخطوة التالية.",
    heroAlt: "صالة رياضية مظلمة فيها مقعد ومنشفة ودمبل في ضوء المساء",
    stages: [
      {
        label: "التقييم",
        title: "استشارة مجانية",
        body: "حديث لمدة 30 دقيقة، أونلاين أو حضورياً: أهدافك، وتاريخك التدريبي، وإصاباتك، وجدولك، وأين تحب أن تتدرب. في جلستك الأولى نضيف تقييماً للحركة وقياسات أساسية.",
      },
      {
        label: "البناء",
        title: "خطتك",
        body: "برنامجك وأهدافك الغذائية، مصممة حول هدفك ومستواك وجدولك والمعدات المتاحة، إضافة إلى الخطة التي تناسب عدد مرات تدريبك.",
      },
      {
        label: "التحوّل",
        title: "تدرّب وتابع",
        body: "نتدرب معاً، وتحصل على دعم بين الجلسات، وكل 4 أسابيع نراجع القياسات والصور والقوة، ثم نعدّل.",
      },
      {
        label: "التجاوز",
        title: "واصل التقدّم",
        body: "تتعلّم سبب كل تمرين وتبني عادات تدوم، ليستمر تقدّمك إلى ما بعد البرنامج.",
      },
    ],
    first30Title: "أول 30 يوماً",
    first30: [
      { when: "اليوم 1", what: "استشارة مجانية، ثم توصية بخطتك." },
      { when: "الأسبوع 1", what: "الجلسة الأولى، وتقييم الحركة، والقياسات والصور الأساسية." },
      { when: "الأسبوعان 1–2", what: "تعلّم الأداء الصحيح وضبط إيقاع تدريبك." },
      { when: "الأسبوعان 3–4", what: "تدريب تدريجي وعادات غذائية راسخة." },
      { when: "اليوم 30", what: "مراجعة التقدّم وكتلتك التدريبية التالية لـ 4 أسابيع." },
    ],
    trackTitle: "كيف نتابع التقدّم",
    track: ["قياسات الجسم", "الاستمرارية", "صور التقدّم", "أرقام القوة"],
    nutritionTitle: "تغذية ببساطة",
    nutrition:
      "تشمل كل خطة إرشادات غذائية: أهداف السعرات والبروتين وعادات أكل عملية تناسب حياتك. لا حميات قاسية. إن كانت لديك حالة صحية، سأعمل جنباً إلى جنب مع طبيبك أو أخصائي التغذية.",
  },

  // needs native review (plans)
  plans: {
    // needs native review
    eyebrow: "خطط التدريب",
    title: "ابنِ خطتك",
    intro: "اختر طريقة تدريبك وعدد مراته. سيؤكد سعيد الخطة المناسبة ويخبرك بالسعر في استشارتك المجانية.",
    heroAlt: "سعيد، مدرب شخصي، يكتب خطة تدريب على لوح FITologist في صالة رياضية",
    step1: "الخطوة 1",
    step2: "الخطوة 2",
    typeTitle: "كيف تريد أن تتدرب؟",
    bestForLabel: "الأنسب لـ:",
    types: [
      { key: "1to1", name: "تدريب شخصي فردي 1:1", line: "جلسات خاصة مع سعيد، في منزلك أو في صالة مبناك أو في صالة رياضية في الجداف وما حولها.", bestFor: "التدريب العملي المباشر والمبتدئين." },
      { key: "partner", name: "تدريب ثنائي (للأزواج والأصدقاء)", line: "شخصان في الجلسة نفسها بسعر خاص للثنائي. الأماكن نفسها كالتدريب الفردي.", bestFor: "التدرب معاً والحفاظ على الحماس." },
      { key: "online", name: "تدريب أونلاين", line: "برنامجك في تطبيق تدريب، مع متابعة أسبوعية ومراجعة الأداء بالفيديو. يناسب أي مكان.", bestFor: "التدرب بمفردك بتوجيه خبير." },
      { key: "hybrid", name: "تدريب هجين", line: "جلسات حضورية مع برنامج أونلاين للأيام التي تتدرب فيها وحدك.", bestFor: "المهنيين المشغولين الذين يريدون الاثنين." },
    ],
    freqTitle: "كم مرة؟",
    freqNote: "جميع الجلسات مدتها 60 دقيقة.",
    onlineNote: "التدريب الأونلاين شهري: متابعة أسبوعية وكتلة تدريب جديدة كل 4 أسابيع.",
    hybridNote: "يجمع التدريب الهجين حتى جلستين أسبوعياً مع التدريب الأونلاين.",
    summaryLabel: "خطتك:",
    summaryNone: "لست متأكداً بعد؟ هذا هو هدف الاستشارة.",
    monthly: "شهري",
    recommended: "موصى بها",
    perMonth: "جلسات / شهر",
    items: [
      { key: "1", name: "Foundation", freq: "مرة أسبوعياً", sessions: "4", bestFor: "تعلّم الأداء الصحيح وبناء العادة" },
      { key: "2", name: "Momentum", freq: "مرتان أسبوعياً", sessions: "8", bestFor: "المهنيون المشغولون الذين يريدون تقدّماً ثابتاً" },
      { key: "3", name: "Accelerate", freq: "3 مرات أسبوعياً", sessions: "12", bestFor: "تحوّل أسرع وأوضح في الجسم" },
      { key: "4", name: "Elite", freq: "4 مرات أسبوعياً", sessions: "16", bestFor: "أقصى النتائج والالتزام" },
    ],
    includesTitle: "تشمل كل خطة",
    includes: [
      { title: "برنامج شخصي", body: "مصمم حول أهدافك ومستواك وجدولك." },
      { title: "تعليم الأداء الصحيح", body: "تصحيح في كل تكرار وتقدّم آمن." },
      { title: "إرشادات غذائية", body: "أهداف السعرات والبروتين مع عادات أكل عملية." },
      { title: "مراجعة التقدّم كل 4 أسابيع", body: "القياسات والصور والقوة." },
      { title: "دعم عبر واتساب", body: "إجابة على أسئلتك خلال 24 ساعة." },
    ],
    firstStep: {
      title: "خطوتك الأولى مجانية",
      consultation: "استشارة لمدة 30 دقيقة",
      free: "مجانية",
      mode: "أونلاين أو حضورياً",
      intro: "سنتحدث عن وضعك الحالي، وإلى أين تريد أن تصل، والخطة المناسبة للوصول إلى هناك:",
      points: [
        "أهدافك وأولوياتك",
        "مستوى لياقتك الحالي، وتاريخك التدريبي، وأي إصابات",
        "جدولك وأين تحب أن تتدرب",
        "إجابات عن أسئلتك",
        "الخطة التي نوصي بها، وسعرها",
      ],
      outro: "دون ضغط. مجرد حديث.",
    },
  },

  start: {
    title: "خطوتك الأولى مجانية",
    body: "استشارة لمدة 30 دقيقة، أونلاين أو حضورياً. دون ضغط، مجرد حديث.",
    reply: "يرد سعيد شخصياً خلال ساعات قليلة.",
    // needs native review
    /** Home "What happens next" (above the form): step 1, step 2 = `reply`, step 3; then links. */
    next: {
      send: "أرسل بياناتك. يستغرق الأمر دقيقة تقريباً.",
      consultation: "استشارة مجانية لمدة 30 دقيقة، أونلاين أو حضورياً. دون ضغط، مجرد حديث.",
      details: "تريد التفاصيل أولاً؟",
      links: { method: "كيف نعمل", plans: "خطط التدريب", faq: "الأسئلة الشائعة" },
    },
  },

  lead: {
    name: "الاسم",
    phone: "رقم واتساب",
    countryCode: "رمز الدولة",
    age: "العمر",
    sex: "الجنس",
    sexOptions: { male: "ذكر", female: "أنثى" },
    goals: "الأهداف",
    type: "نوع التدريب",
    frequency: "عدد المرات",
    area: "منطقتك",
    areaPlaceholder: "مثلاً: الجداف، الخليج التجاري",
    times: "الوقت المفضل",
    notes: "هل هناك ما يجب أن يعرفه سعيد؟",
    notesPlaceholder: "إصابات، جدولك، أي شيء آخر",
    optional: "(اختياري)",
    consentBefore: "أوافق على التواصل معي عبر واتساب بخصوص التدريب.",
    privacy: "سياسة الخصوصية",
    submit: "أرسل إلى سعيد عبر واتساب",
    helper: "يفتح واتساب ومعلوماتك جاهزة. فقط اضغط إرسال.",
    honeypot: "الشركة",
    types: { "1to1": "فردي 1:1", partner: "ثنائي", online: "أونلاين", hybrid: "هجين", unsure: "لست متأكداً بعد" },
    frequencies: { "1": "مرة أسبوعياً", "2": "مرتان أسبوعياً", "3": "3 مرات أسبوعياً", "4": "4 مرات أسبوعياً", unsure: "لست متأكداً بعد" },
    timesOptions: { mornings: "الصباح", evenings: "المساء", weekends: "عطلة نهاية الأسبوع" },
    errors: {
      name: "أدخل اسمك (2–60 حرفاً).",
      phone: "أدخل رقم واتساب صحيحاً (7–15 رقماً).",
      age: "أدخل عمرك (18–80).",
      goals: "اختر هدفاً واحداً على الأقل.",
      type: "اختر نوع التدريب.",
      notes: "يرجى ألا يتجاوز النص 500 حرف.",
      consent: "يرجى الموافقة على التواصل عبر واتساب.",
    },
    sending: "جارٍ فتح واتساب…",
    success: {
      title: "تم إرسال الطلب ✓",
      bodyBefore: "استلم سعيد معلوماتك وسيرد خلال ساعات قليلة. واتساب مفتوح لتتحدث معه مباشرة. فقط اضغط",
      send: "إرسال",
      again: "افتح واتساب مجدداً",
      edit: "تعديل البيانات",
    },
    fallback: {
      title: "خطوة أخيرة",
      bodyBefore: "اضغط",
      bodyAfter: "في واتساب للتواصل مع سعيد.",
      open: "افتح واتساب",
      edit: "تعديل البيانات",
    },
    message: {
      intro: "مرحباً سعيد، أود حجز استشارة مجانية.",
      name: "الاسم",
      age: "العمر",
      sex: "الجنس",
      goals: "الأهداف",
      type: "نوع التدريب",
      frequency: "عدد المرات",
      area: "المنطقة",
      times: "الوقت المفضل",
      notes: "ملاحظات",
      footer: "(أُرسلت من fitologist.me)",
    },
  },

  // needs native review (terms, privacy)
  terms: {
    title: "الإلغاء وإعادة الجدولة",
    items: [
      { title: "إشعار قبل 24 ساعة", body: "يمكنك إعادة جدولة جلستك أو إلغاؤها قبل 24 ساعة على الأقل دون أي تكلفة." },
      { title: "الإلغاء المتأخر أو عدم الحضور", body: "الإلغاء خلال 24 ساعة، أو الجلسات الفائتة، تُحتسب كجلسات مستخدمة." },
      { title: "التأخر", body: "تنتهي الجلسات في موعدها المحدد." },
      { title: "إذا ألغى سعيد", body: "تُعاد جدولة جلستك دون أي تكلفة." },
      { title: "صلاحية الخطة", body: "الجلسات صالحة لمدة 30 يوماً من جلستك الأولى. يمكن ترحيل الجلسات الملغاة بإشعار مسبق مرة واحدة، بحد أقصى جلستين." },
      { title: "الإيقاف المؤقت", body: "في حالات السفر أو المرض، يمكن إيقاف خطتك مؤقتاً مرة واحدة في كل دورة لمدة تصل إلى 14 يوماً، بإشعار قبل 48 ساعة." },
      { title: "التدريب الثنائي", body: "إذا ألغى أحد الشريكين متأخراً، تُقام الجلسة للآخر بسعر الشريكين." },
      { title: "الدفع", body: "تُدفع الخطط مقدماً، قبل الجلسة الأولى من كل دورة." },
      { title: "الصحة", body: "يرجى إبلاغ سعيد بأي إصابة أو حالة صحية قبل التدريب. التدريب ليس بديلاً عن الاستشارة الطبية." },
    ],
  },

  privacy: {
    title: "سياسة الخصوصية",
    who: { title: "من نحن", body: "FITologist.me، تدريب شخصي مع سعيد سليماني، دبي، الإمارات. للتواصل: واتساب" },
    collect: {
      title: "ما نجمعه",
      body: "المعلومات التي تدخلها في النموذج (الاسم، ورقم واتساب، والعمر، والأهداف، وتفضيلات التدريب، والمنطقة، والملاحظات)، ومدخلات فحص الجسم فقط إذا اخترت إرسالها. قد تتضمن الملاحظات معلومات صحية تختار مشاركتها، مثل الإصابات.",
    },
    why: { title: "لماذا", body: "للرد عليك وترتيب التدريب. لا نبيع بياناتك ولا نستخدمها لأي غرض آخر." },
    stored: { title: "أين تُحفظ", body: "تُرسل طلبات النموذج إلى سعيد عبر إشعار خاص على Telegram وتُسجَّل في جدول Google خاص." },
    analytics: { title: "التحليلات", body: "نستخدم Google Analytics وMeta Pixel لفهم كيفية استخدام الموقع." },
    howLong: { title: "مدة الاحتفاظ", body: "إذا لم تصبح متدرباً، تُحذف معلوماتك خلال 12 شهراً." },
    rights: { title: "حقوقك", body: "راسل سعيد على واتساب للاطلاع على بياناتك أو تصحيحها أو حذفها." },
    updated: "آخر تحديث",
  },

  footer: {
    terms: "الشروط",
    privacy: "الخصوصية",
    line1: "تدريب شخصي مع سعيد",
    line2: "تدريب فردي، وثنائي، وأونلاين، وهجين",
  },

  // Not shown: the floor-test page is EN/FA only (Arabic hidden). English copy satisfies the type.
  /** Printed-card landing page (/floor-test). */
  floorTest: {
    metaTitle: "The Floor Test | FITologist.me",
    metaDescription: "You just tried the floor test from Saeid's card. See what your result means and send it to Saeid.",
    eyebrow: "The floor test",
    title: "How did it go?",
    intro: "You just tried the floor test: sit down and stand back up without using your hands.",
    optionsLabel: "How did your floor test go?",
    options: [
      { key: "a", label: "Perfect: no help at all", band: "Excellent, about 10/10", body: "Top group. Your strength, balance and mobility work together really well." },
      { key: "b", label: "Almost: I touched the floor once (hand or knee)", band: "Very good, about 9/10", body: "Strong result. One small weak link is easy to fix." },
      { key: "c", label: "I needed help 2–3 times", band: "Good, about 7–8/10", body: "Solid base, with clear room to improve your strength and mobility." },
      { key: "d", label: "I needed a lot of help / couldn't do it", band: "Needs attention, 6/10 or less", body: "Good news: this is very trainable, and it improves quickly with the right plan." },
    ],
    note: "Researchers use this test as a simple marker of strength, balance and flexibility. It's a guide, not a medical assessment.",
    bmiTitle: "Want to know your BMI too? It takes 10 seconds.",
    skip: "Skip",
    continue: "Continue",
    claimTitle: "Send your results to Saeid and claim your free first session",
    consultTitle: "Send your results to Saeid and book your free 30-minute consultation",
    validity: "Card holders only · valid until {date}",
    offer: "Your first session is free",
    success: { offer: "Saeid has your results and will message you within a few hours to book your free session.", consult: "Saeid has your results and will message you within a few hours to book your free consultation." },
    whatsapp: {
      intro: "Hi Saeid, I did the floor test from your card.",
      result: "Result: {band}.",
      bmi: "My BMI: {bmi} ({category}).",
      offer: "I'd like to claim my free first session.",
      consult: "I'd like to book my free 30-minute consultation.",
    },
  },

  notFound: {
    title: "الصفحة غير موجودة",
    body: "الصفحة التي تبحث عنها غير موجودة.",
    home: "العودة إلى الرئيسية",
  },
};

export default ar;
