// All site wording, in one place. English is the key; add a language by adding
// its code to LANGUAGES and a value to each entry below.
(() => {
  const LANGUAGES = [['en', 'English'], ['es', 'Español'], ['zh-Hans', '简体中文'], ['bn', 'বাংলা'], ['ur', 'اردو'], ['hi', 'हिन्दी']];
  const RTL = new Set(['ur']);
  const W = (es, zh, bn, ur, hi) => ({ es, 'zh-Hans': zh, bn, ur, hi });
  const DICTIONARY = {
    'Skip to content': W('Saltar al contenido', '跳到主要内容', 'মূল অংশে যান', 'مواد پر جائیں', 'सामग्री पर जाएँ'),
    'Main navigation': W('Navegación principal', '主导航', 'প্রধান নেভিগেশন', 'مرکزی نیویگیشن', 'मुख्य नेविगेशन'),
    Taxes: W('Impuestos', '税务', 'কর', 'ٹیکس', 'कर'),
    Health: W('Salud', '医疗', 'স্বাস্থ্য', 'صحت', 'स्वास्थ्य'),
    Rights: W('Derechos', '权益', 'অধিকার', 'حقوق', 'अधिकार'),
    Planner: W('Planificador', '规划', 'পরিকল্পনা', 'منصوبہ', 'योजनाकार'),
    Community: W('Comunidad', '社区', 'কমিউনিটি', 'کمیونٹی', 'समुदाय'),
    'Sign in': W('Iniciar sesión', '登录', 'সাইন ইন', 'سائن ان', 'साइन इन'),
    'Resources for independent workers': W('Recursos para trabajadores independientes', '独立工作者资源', 'স্বাধীন কর্মীদের জন্য সহায়তা', 'آزاد کارکنوں کے لیے وسائل', 'स्वतंत्र कामगारों के लिए संसाधन'),
    'Weekly planner': W('Planificador semanal', '每周规划', 'সাপ্তাহিক পরিকল্পনা', 'ہفتہ وار منصوبہ', 'साप्ताहिक योजनाकार'),

    'A little more clarity.': W('Más claridad.', '多一点清晰。', 'আরেকটু স্পষ্টতা।', 'تھوڑی اور وضاحت۔', 'थोड़ी और स्पष्टता।'),
    'A lot more support.': W('Mucho más apoyo.', '多一份支持。', 'অনেক বেশি সহায়তা।', 'بہت زیادہ مدد۔', 'बहुत अधिक सहयोग।'),
    'What do you need today?': W('¿Qué necesitas hoy?', '您今天需要什么？', 'আজ আপনার কী দরকার?', 'آج آپ کو کیا چاہیے؟', 'आज आपको क्या चाहिए?'),
    'My week': W('Mi semana', '我的一周', 'আমার সপ্তাহ', 'میرا ہفتہ', 'मेरा सप्ताह'),
    'My taxes': W('Mis impuestos', '我的税务', 'আমার কর', 'میرا ٹیکس', 'मेरे कर'),
    'My health': W('Mi salud', '我的健康', 'আমার স্বাস্থ্য', 'میری صحت', 'मेरा स्वास्थ्य'),
    'My pay': W('Mi pago', '我的报酬', 'আমার পাওনা', 'میری اجرت', 'मेरा भुगतान'),
    'Free. No account needed.': W('Gratis. Sin cuenta.', '免费，无需账户。', 'বিনামূল্যে। অ্যাকাউন্ট লাগবে না।', 'مفت۔ اکاؤنٹ کی ضرورت نہیں۔', 'मुफ़्त। खाते की ज़रूरत नहीं।'),

    'New York City': W('Nueva York', '纽约市', 'নিউ ইয়র্ক সিটি', 'نیویارک سٹی', 'न्यूयॉर्क सिटी'),
    'Elsewhere in the U.S.': W('Otro lugar de EE. UU.', '美国其他地区', 'যুক্তরাষ্ট্রের অন্য কোথাও', 'امریکہ میں کہیں اور', 'अमेरिका में कहीं और'),
    'Plan an uneven week': W('Organiza una semana irregular', '规划收入不稳定的一周', 'অনিয়মিত সপ্তাহের পরিকল্পনা করুন', 'غیر یقینی ہفتے کی منصوبہ بندی کریں', 'अनिश्चित सप्ताह की योजना बनाएँ'),
    'Get your tax records together': W('Reúne tus registros de impuestos', '整理您的税务记录', 'আপনার করের নথি গুছিয়ে নিন', 'اپنے ٹیکس کے ریکارڈ جمع کریں', 'अपने कर के रिकॉर्ड जुटाएँ'),
    'Find a starting point for coverage': W('Empieza a buscar cobertura', '从这里开始了解医保', 'স্বাস্থ্য কভারেজ খোঁজা শুরু করুন', 'صحت کوریج کی تلاش شروع کریں', 'स्वास्थ्य कवरेज की शुरुआत करें'),
    'Get ready to ask about unpaid work': W('Prepárate para reclamar un pago', '准备询问未付款工作', 'বকেয়া পাওনা নিয়ে জানতে প্রস্তুত হন', 'بقایا اجرت کے بارے میں پوچھنے کی تیاری کریں', 'बकाया भुगतान के बारे में पूछने की तैयारी करें'),
    "List this week's income and bills.": W('Anota los ingresos y gastos de esta semana.', '列出本周的收入和账单。', 'এই সপ্তাহের আয় ও বিল লিখে রাখুন।', 'اس ہفتے کی آمدنی اور بل لکھ لیں۔', 'इस सप्ताह की आय और बिल लिख लें।'),
    'Try a lower-income week in the planner.': W('Prueba una semana de menos ingresos en el planificador.', '在规划工具中试算收入较低的一周。', 'পরিকল্পনায় কম আয়ের একটি সপ্তাহ যাচাই করুন।', 'منصوبے میں کم آمدنی والا ہفتہ آزمائیں۔', 'योजनाकार में कम आय वाला सप्ताह आज़माएँ।'),
    'Pick one bill or date to review.': W('Elige un gasto o una fecha para revisar.', '选一笔账单或一个日期进行查看。', 'পর্যালোচনার জন্য একটি বিল বা তারিখ বেছে নিন।', 'جائزے کے لیے ایک بل یا تاریخ چنیں۔', 'समीक्षा के लिए एक बिल या तारीख चुनें।'),
    'Gather income records and receipts.': W('Reúne registros de ingresos y recibos.', '收集收入记录和收据。', 'আয়ের নথি ও রসিদ জড়ো করুন।', 'آمدنی کے ریکارڈ اور رسیدیں جمع کریں۔', 'आय के रिकॉर्ड और रसीदें जुटाएँ।'),
    'Read the IRS guide. Note your questions.': W('Lee la guía del IRS. Anota tus preguntas.', '阅读 IRS 指南，记下您的问题。', 'IRS গাইড পড়ুন। আপনার প্রশ্ন লিখে রাখুন।', 'IRS کی گائیڈ پڑھیں۔ اپنے سوال لکھ لیں۔', 'IRS गाइड पढ़ें। अपने सवाल लिख लें।'),
    'Ask a tax preparer if you need help.': W('Consulta a un preparador si necesitas ayuda.', '如需帮助，请咨询报税人员。', 'সাহায্য লাগলে একজন কর প্রস্তুতকারীকে জিজ্ঞাসা করুন।', 'مدد چاہیے تو ٹیکس تیار کرنے والے سے پوچھیں۔', 'मदद चाहिए तो कर तैयार करने वाले से पूछें।'),
    'Decide: insurance, care or both?': W('Decide: ¿seguro, atención o ambos?', '确定需求：保险、医疗服务，还是两者？', 'ঠিক করুন: বিমা, চিকিৎসা, নাকি দুটোই?', 'طے کریں: انشورنس، علاج یا دونوں؟', 'तय करें: बीमा, इलाज या दोनों?'),
    'Open the official site. Ask about options.': W('Abre el sitio oficial. Pregunta por opciones.', '打开官方网站，询问可选方案。', 'সরকারি সাইট খুলুন। বিকল্প সম্পর্কে জিজ্ঞাসা করুন।', 'سرکاری سائٹ کھولیں۔ اختیارات کے بارے میں پوچھیں۔', 'आधिकारिक साइट खोलें। विकल्पों के बारे में पूछें।'),
    'Ask which documents and dates apply.': W('Pregunta qué documentos y fechas aplican.', '询问需要哪些文件和日期。', 'কোন কাগজপত্র ও তারিখ লাগবে জিজ্ঞাসা করুন।', 'پوچھیں کون سے کاغذات اور تاریخیں لاگو ہیں۔', 'पूछें कौन से दस्तावेज़ और तारीखें लागू हैं।'),
    'Collect contract, invoices and messages.': W('Reúne contrato, facturas y mensajes.', '收集合同、发票和消息记录。', 'চুক্তি, ইনভয়েস ও বার্তা জড়ো করুন।', 'معاہدہ، انوائس اور پیغامات جمع کریں۔', 'अनुबंध, इनवॉइस और संदेश जुटाएँ।'),
    'Write a timeline of work and payments.': W('Escribe una cronología de trabajo y pagos.', '写下工作和付款的时间线。', 'কাজ ও পেমেন্টের সময়রেখা লিখুন।', 'کام اور ادائیگیوں کی ٹائم لائن لکھیں۔', 'काम और भुगतान की समयरेखा लिखें।'),
    'Ask about help and deadlines.': W('Pregunta por ayuda y plazos.', '询问可用帮助和截止日期。', 'সহায়তা ও সময়সীমা সম্পর্কে জিজ্ঞাসা করুন।', 'مدد اور آخری تاریخوں کے بارے میں پوچھیں۔', 'मदद और समय-सीमा के बारे में पूछें।'),
    'Open the planner': W('Abrir el planificador', '打开规划工具', 'পরিকল্পনা খুলুন', 'منصوبہ کھولیں', 'योजनाकार खोलें'),
    'IRS estimated tax guide': W('Guía del IRS sobre impuestos estimados', 'IRS 预估税指南', 'IRS আনুমানিক কর গাইড', 'IRS تخمینی ٹیکس گائیڈ', 'IRS अनुमानित कर गाइड'),
    'NY State of Health helpers': W('Asistentes de NY State of Health', 'NY State of Health 协助人员', 'NY State of Health সহায়তাকারী', 'NY State of Health کے معاونین', 'NY State of Health सहायक'),
    'HealthCare.gov': W('HealthCare.gov', 'HealthCare.gov', 'HealthCare.gov', 'HealthCare.gov', 'HealthCare.gov'),
    'NYC freelance worker rights': W('Derechos de freelancers en NYC', '纽约市自由职业者权益', 'NYC ফ্রিল্যান্স কর্মীদের অধিকার', 'NYC فری لانس کارکنوں کے حقوق', 'NYC फ्रीलांस कामगारों के अधिकार'),
    'Find legal aid': W('Buscar ayuda legal', '寻找法律援助', 'আইনি সহায়তা খুঁজুন', 'قانونی مدد تلاش کریں', 'कानूनी सहायता खोजें'),
    'All done. Nice work.': W('Todo listo. ¡Buen trabajo!', '全部完成，做得好！', 'সব শেষ। দারুণ কাজ!', 'سب مکمل۔ بہت خوب!', 'सब पूरा। बहुत बढ़िया!'),
    '{n} of 3 done': W('{n} de 3 listos', '已完成 {n}/3', '৩টির মধ্যে {n}টি শেষ', '3 میں سے {n} مکمل', '3 में से {n} पूरे'),
    Print: W('Imprimir', '打印', 'প্রিন্ট', 'پرنٹ', 'प्रिंट'),
    'Start over': W('Empezar de nuevo', '重新开始', 'আবার শুরু করুন', 'دوبارہ شروع کریں', 'फिर से शुरू करें'),
    'Not saved. Print to keep it.': W('No se guarda. Imprímelo para conservarlo.', '不会保存。如需保留请打印。', 'সংরক্ষিত হয় না। রাখতে প্রিন্ট করুন।', 'محفوظ نہیں ہوتا۔ رکھنے کے لیے پرنٹ کریں۔', 'सहेजा नहीं जाता। रखने के लिए प्रिंट करें।'),

    'Less tax guesswork.': W('Menos dudas sobre impuestos.', '报税少一点猜测。', 'করের হিসাবে কম অনুমান।', 'ٹیکس میں کم اندازے۔', 'कर में कम अंदाज़ा।'),
    'Move the sliders.': W('Mueve los controles.', '拖动滑块。', 'স্লাইডার সরান।', 'سلائیڈر ہلائیں۔', 'स्लाइडर खिसकाएँ।'),
    'Set aside about': W('Aparta cerca de', '建议预留约', 'আলাদা রাখুন প্রায়', 'تقریباً الگ رکھیں', 'लगभग अलग रखें'),
    'a month': W('al mes', '每月', 'প্রতি মাসে', 'ماہانہ', 'हर महीने'),
    'a year in federal tax': W('al año en impuestos federales', '每年联邦税', 'প্রতি বছর ফেডারেল কর', 'سالانہ وفاقی ٹیکس', 'हर साल संघीय कर'),
    'A planning number, not a bill.': W('Un número para planificar, no una factura.', '这是规划数字，不是账单。', 'এটি পরিকল্পনার সংখ্যা, বিল নয়।', 'یہ منصوبہ بندی کا عدد ہے، بل نہیں۔', 'यह योजना का आँकड़ा है, बिल नहीं।'),
    'Yearly income': W('Ingresos anuales', '年收入', 'বার্ষিক আয়', 'سالانہ آمدنی', 'सालाना आय'),
    'Yearly business expenses': W('Gastos anuales del negocio', '年度业务支出', 'বার্ষিক ব্যবসায়িক খরচ', 'سالانہ کاروباری اخراجات', 'सालाना व्यावसायिक खर्च'),
    Single: W('Soltero/a', '单身', 'অবিবাহিত', 'غیر شادی شدہ', 'अविवाहित'),
    'Married, one earner': W('Casado/a, un ingreso', '已婚，一人有收入', 'বিবাহিত, একজন উপার্জনকারী', 'شادی شدہ، ایک کمانے والا', 'विवाहित, एक कमाने वाला'),
    'Filing status': W('Estado civil para la declaración', '报税身份', 'ফাইলিং অবস্থা', 'فائلنگ کی حیثیت', 'फाइलिंग स्थिति'),
    Expenses: W('Gastos', '支出', 'খরচ', 'اخراجات', 'खर्च'),
    'Income tax': W('Impuesto sobre la renta', '所得税', 'আয়কর', 'انکم ٹیکس', 'आयकर'),
    'Self-employment tax': W('Impuesto de trabajo autónomo', '自雇税', 'স্ব-কর্মসংস্থান কর', 'سیلف ایمپلائمنٹ ٹیکس', 'स्व-रोज़गार कर'),
    'Extra Medicare tax': W('Impuesto adicional de Medicare', '附加医疗保险税', 'অতিরিক্ত মেডিকেয়ার কর', 'اضافی میڈیکیئر ٹیکس', 'अतिरिक्त मेडिकेयर कर'),
    'Left over': W('Queda', '剩余', 'বাকি থাকে', 'باقی', 'बाकी'),
    'See the math': W('Ver el cálculo', '查看计算', 'হিসাব দেখুন', 'حساب دیکھیں', 'हिसाब देखें'),
    Profit: W('Ganancia', '利润', 'মুনাফা', 'منافع', 'मुनाफ़ा'),
    'Yearly federal estimate': W('Estimación federal anual', '联邦税年度估算', 'বার্ষিক ফেডারেল অনুমান', 'سالانہ وفاقی تخمینہ', 'सालाना संघीय अनुमान'),
    'Estimate for self-employed people under 65 with no other income and the 2026 standard deduction. Leaves out state and local tax, credits, QBI and payments already made. Not tax advice.': W(
      'Estimación para autónomos menores de 65 años, sin otros ingresos y con la deducción estándar de 2026. No incluye impuestos estatales y locales, créditos, QBI ni pagos ya hechos. No es asesoría fiscal.',
      '适用于 65 岁以下、无其他收入、使用 2026 年标准扣除额的自雇人士。不含州税和地方税、税收抵免、QBI 及已缴款项。并非税务建议。',
      '৬৫ বছরের কম বয়সী, অন্য আয় নেই এমন স্ব-নিযুক্ত ব্যক্তিদের জন্য ২০২৬ সালের স্ট্যান্ডার্ড ডিডাকশনসহ অনুমান। রাজ্য ও স্থানীয় কর, ক্রেডিট, QBI এবং আগে দেওয়া পেমেন্ট ধরা হয়নি। এটি কর পরামর্শ নয়।',
      '65 سال سے کم عمر، بغیر دیگر آمدنی والے خود روزگار افراد کے لیے 2026 کی معیاری کٹوتی کے ساتھ تخمینہ۔ ریاستی و مقامی ٹیکس، کریڈٹ، QBI اور پہلے کی گئی ادائیگیاں شامل نہیں۔ یہ ٹیکس مشورہ نہیں۔',
      '65 वर्ष से कम आयु के, बिना अन्य आय वाले स्व-रोज़गार लोगों के लिए 2026 की मानक कटौती के साथ अनुमान। राज्य व स्थानीय कर, क्रेडिट, QBI और पहले किए गए भुगतान शामिल नहीं। यह कर सलाह नहीं है।'
    ),
    'Stays on your device.': W('Se queda en tu dispositivo.', '数据仅保留在您的设备上。', 'আপনার ডিভাইসেই থাকে।', 'آپ کے آلے پر ہی رہتا ہے۔', 'आपके डिवाइस पर ही रहता है।'),
    'Free tax help': W('Ayuda fiscal gratis', '免费报税帮助', 'বিনামূল্যে কর সহায়তা', 'مفت ٹیکس مدد', 'मुफ़्त कर सहायता'),
    'Free File': W('Free File', 'Free File', 'Free File', 'Free File', 'Free File'),
    'Enter amounts from $0 to $10,000,000.': W('Escribe cantidades de $0 a $10,000,000.', '请输入 $0 至 $10,000,000 之间的金额。', '$0 থেকে $10,000,000 এর মধ্যে পরিমাণ লিখুন।', '$0 سے $10,000,000 تک رقم درج کریں۔', '$0 से $10,000,000 के बीच राशि लिखें।'),
    'Expenses are higher than income. Losses count as zero here.': W('Los gastos superan los ingresos. Aquí las pérdidas cuentan como cero.', '支出高于收入。此处亏损按零计算。', 'খরচ আয়ের চেয়ে বেশি। এখানে লোকসান শূন্য ধরা হয়।', 'اخراجات آمدنی سے زیادہ ہیں۔ یہاں نقصان صفر شمار ہوتا ہے۔', 'खर्च आय से ज़्यादा है। यहाँ घाटा शून्य गिना जाता है।'),

    'Care, connected.': W('Atención a tu alcance.', '医疗，触手可及。', 'চিকিৎসা, আপনার নাগালে।', 'علاج، آپ کی پہنچ میں۔', 'इलाज, आपकी पहुँच में।'),
    Insurance: W('Seguro', '保险', 'বিমা', 'انشورنس', 'बीमा'),
    'Low-cost': W('Bajo costo', '低费用', 'কম খরচে', 'کم لاگت', 'कम लागत'),
    'Near me': W('Cerca de mí', '我附近', 'আমার কাছে', 'میرے قریب', 'मेरे पास'),
    'Compare plans': W('Compara planes', '比较保险计划', 'প্ল্যান তুলনা করুন', 'پلانز کا موازنہ کریں', 'प्लान की तुलना करें'),
    'Your income may lower the price.': W('Tus ingresos pueden bajar el precio.', '您的收入可能使价格降低。', 'আপনার আয় অনুযায়ী দাম কমতে পারে।', 'آپ کی آمدنی سے قیمت کم ہو سکتی ہے۔', 'आपकी आय से कीमत कम हो सकती है।'),
    'Medicaid & CHIP': W('Medicaid y CHIP', 'Medicaid 和 CHIP', 'Medicaid ও CHIP', 'Medicaid اور CHIP', 'Medicaid और CHIP'),
    'Your state decides who qualifies.': W('Tu estado decide quién califica.', '由您所在的州决定资格。', 'কে যোগ্য তা আপনার রাজ্য ঠিক করে।', 'آپ کی ریاست طے کرتی ہے کہ کون اہل ہے۔', 'आपका राज्य तय करता है कि कौन पात्र है।'),
    'See your options': W('Ver tus opciones', '查看可选方案', 'আপনার বিকল্প দেখুন', 'اپنے اختیارات دیکھیں', 'अपने विकल्प देखें'),
    'Find a health center': W('Busca un centro de salud', '寻找社区医疗中心', 'স্বাস্থ্যকেন্দ্র খুঁজুন', 'صحت مرکز تلاش کریں', 'स्वास्थ्य केंद्र खोजें'),
    'Fees may depend on your income.': W('Las tarifas pueden depender de tus ingresos.', '费用可能取决于您的收入。', 'ফি আপনার আয়ের ওপর নির্ভর করতে পারে।', 'فیس آپ کی آمدنی پر منحصر ہو سکتی ہے۔', 'फ़ीस आपकी आय पर निर्भर हो सकती है।'),
    'Find a center': W('Buscar un centro', '查找中心', 'কেন্দ্র খুঁজুন', 'مرکز تلاش کریں', 'केंद्र खोजें'),
    'In New York:': W('En Nueva York:', '在纽约：', 'নিউ ইয়র্কে:', 'نیویارک میں:', 'न्यूयॉर्क में:'),
    'Free application help': W('Ayuda gratis para solicitar', '免费申请帮助', 'আবেদনে বিনামূল্যে সহায়তা', 'درخواست میں مفت مدد', 'आवेदन में मुफ़्त मदद'),
    'NYC Care (not insurance)': W('NYC Care (no es un seguro)', 'NYC Care（不是保险）', 'NYC Care (বিমা নয়)', 'NYC Care (انشورنس نہیں)', 'NYC Care (बीमा नहीं)'),

    'Your work has value.': W('Tu trabajo tiene valor.', '您的工作有价值。', 'আপনার কাজের মূল্য আছে।', 'آپ کے کام کی قدر ہے۔', 'आपके काम का मूल्य है।'),
    "I wasn't paid": W('No me pagaron', '我没有收到报酬', 'আমি টাকা পাইনি', 'مجھے ادائیگی نہیں ملی', 'मुझे भुगतान नहीं मिला'),
    'Am I an employee?': W('¿Soy empleado?', '我是雇员吗？', 'আমি কি কর্মচারী?', 'کیا میں ملازم ہوں؟', 'क्या मैं कर्मचारी हूँ?'),
    'I need legal help': W('Necesito ayuda legal', '我需要法律帮助', 'আমার আইনি সহায়তা দরকার', 'مجھے قانونی مدد چاہیے', 'मुझे कानूनी मदद चाहिए'),
    'NYC freelance protections': W('Protecciones para freelancers en NYC', '纽约市自由职业者保护', 'NYC ফ্রিল্যান্স সুরক্ষা', 'NYC فری لانس تحفظات', 'NYC फ्रीलांस सुरक्षा'),
    'Check if the law covers your work.': W('Comprueba si la ley cubre tu trabajo.', '确认法律是否适用于您的工作。', 'আইন আপনার কাজে প্রযোজ্য কিনা দেখুন।', 'دیکھیں کیا قانون آپ کے کام پر لاگو ہے۔', 'देखें कि कानून आपके काम पर लागू है या नहीं।'),
    'See your rights': W('Ver tus derechos', '查看您的权益', 'আপনার অধিকার দেখুন', 'اپنے حقوق دیکھیں', 'अपने अधिकार देखें'),
    'Employee or contractor?': W('¿Empleado o contratista?', '雇员还是承包商？', 'কর্মচারী নাকি ঠিকাদার?', 'ملازم یا کنٹریکٹر؟', 'कर्मचारी या ठेकेदार?'),
    "A job title or 1099 doesn't settle it.": W('Un cargo o un 1099 no lo decide todo.', '职位名称或 1099 表并不能决定一切。', 'পদবি বা 1099 দিয়ে বিষয়টি নিশ্চিত হয় না।', 'عہدہ یا 1099 سے یہ طے نہیں ہوتا۔', 'पद या 1099 से यह तय नहीं होता।'),
    'Find out more': W('Más información', '了解更多', 'আরও জানুন', 'مزید جانیں', 'और जानें'),
    'Civil legal aid': W('Ayuda legal civil', '民事法律援助', 'দেওয়ানি আইনি সহায়তা', 'دیوانی قانونی مدد', 'दीवानी कानूनी सहायता'),
    'Local groups help people who qualify.': W('Grupos locales ayudan a quienes califican.', '当地组织为符合条件的人提供帮助。', 'স্থানীয় সংস্থাগুলো যোগ্য ব্যক্তিদের সাহায্য করে।', 'مقامی ادارے اہل افراد کی مدد کرتے ہیں۔', 'स्थानीय संगठन पात्र लोगों की मदद करते हैं।'),
    'Keep your:': W('Guarda tus:', '请保留：', 'রেখে দিন:', 'سنبھال کر رکھیں:', 'सँभालकर रखें:'),
    Contracts: W('Contratos', '合同', 'চুক্তি', 'معاہدے', 'अनुबंध'),
    Invoices: W('Facturas', '发票', 'ইনভয়েস', 'انوائس', 'इनवॉइस'),
    'Payment records': W('Registros de pago', '付款记录', 'পেমেন্টের নথি', 'ادائیگی کا ریکارڈ', 'भुगतान के रिकॉर्ड'),

    'Need help right now?': W('¿Necesitas ayuda ahora?', '现在就需要帮助吗？', 'এখনই সাহায্য দরকার?', 'ابھی مدد چاہیے؟', 'अभी मदद चाहिए?'),
    'Food. Housing. Bills.': W('Comida. Vivienda. Facturas.', '食物、住房、账单。', 'খাবার। বাসস্থান। বিল।', 'خوراک۔ رہائش۔ بل۔', 'भोजन। आवास। बिल।'),
    'Find help through 211': W('Buscar ayuda con 211', '通过 211 寻求帮助', '211-এর মাধ্যমে সাহায্য খুঁজুন', '211 کے ذریعے مدد تلاش کریں', '211 से मदद खोजें'),

    'Good to know.': W('Bueno saberlo.', '温馨提示。', 'জেনে রাখুন।', 'جاننا اچھا ہے۔', 'जानने योग्य।'),
    'Do you decide if I qualify?': W('¿Ustedes deciden si califico?', '你们决定我是否符合资格吗？', 'আমি যোগ্য কিনা আপনারা ঠিক করেন?', 'کیا آپ طے کرتے ہیں کہ میں اہل ہوں؟', 'क्या आप तय करते हैं कि मैं पात्र हूँ?'),
    'No. Each program decides.': W('No. Cada programa decide.', '不。由各项目自行决定。', 'না। প্রতিটি প্রোগ্রাম নিজে ঠিক করে।', 'نہیں۔ ہر پروگرام خود طے کرتا ہے۔', 'नहीं। हर कार्यक्रम खुद तय करता है।'),
    'Do you save my numbers?': W('¿Guardan mis cifras?', '你们会保存我的数字吗？', 'আপনারা কি আমার সংখ্যা সংরক্ষণ করেন?', 'کیا آپ میرے اعداد محفوظ کرتے ہیں؟', 'क्या आप मेरे आँकड़े सहेजते हैं?'),
    'No. They stay on this page.': W('No. Se quedan en esta página.', '不。它们只留在此页面。', 'না। এগুলো এই পেজেই থাকে।', 'نہیں۔ یہ اسی صفحے پر رہتے ہیں۔', 'नहीं। वे इसी पेज पर रहते हैं।'),
    'My income changes. Now what?': W('Mis ingresos cambian. ¿Y ahora?', '我的收入会变化，怎么办？', 'আমার আয় বদলায়। এখন কী করব?', 'میری آمدنی بدلتی رہتی ہے۔ اب کیا کروں؟', 'मेरी आय बदलती है। अब क्या करूँ?'),
    'Use your best yearly guess. Update it as work changes.': W('Usa tu mejor estimación anual. Actualízala cuando cambie tu trabajo.', '用您对全年的最佳估计，并随工作变化更新。', 'বছরের সেরা অনুমান ব্যবহার করুন। কাজ বদলালে আপডেট করুন।', 'سال کا بہترین اندازہ لگائیں۔ کام بدلنے پر اسے اپ ڈیٹ کریں۔', 'साल का सबसे अच्छा अनुमान लगाएँ। काम बदलने पर उसे अपडेट करें।'),

    'Your work changes. Your support stays.': W('Tu trabajo cambia. Tu apoyo permanece.', '工作在变，支持不变。', 'কাজ বদলায়। সহায়তা থাকে।', 'کام بدلتا ہے۔ مدد قائم رہتی ہے۔', 'काम बदलता है। सहयोग बना रहता है।'),
    'General information only. Confirm details with each provider. Not affiliated with these organizations or Accenture. Student-built pilot.': W(
      'Solo información general. Confirma los detalles con cada proveedor. Sin afiliación con estas organizaciones ni con Accenture. Piloto creado por estudiantes.',
      '仅为一般信息，请向各提供方确认详情。与这些机构或 Accenture 无关联。由学生开发的试点项目。',
      'শুধু সাধারণ তথ্য। প্রতিটি প্রদানকারীর কাছে বিস্তারিত নিশ্চিত করুন। এই সংস্থাগুলো বা Accenture-এর সঙ্গে সম্পর্কিত নয়। শিক্ষার্থীদের তৈরি পাইলট।',
      'صرف عمومی معلومات۔ تفصیلات ہر ادارے سے تصدیق کریں۔ ان اداروں یا Accenture سے وابستہ نہیں۔ طلبہ کا بنایا ہوا پائلٹ۔',
      'केवल सामान्य जानकारी। विवरण हर प्रदाता से पुष्टि करें। इन संगठनों या Accenture से संबद्ध नहीं। छात्रों द्वारा बनाया गया पायलट।'
    ),
    'Your language choice is saved in this browser. Community posts are public.': W(
      'Tu idioma se guarda en este navegador. Las publicaciones de la comunidad son públicas.',
      '语言选择保存在此浏览器中。社区帖子是公开的。',
      'আপনার ভাষার পছন্দ এই ব্রাউজারে থাকে। কমিউনিটির পোস্ট সর্বজনীন।',
      'زبان کا انتخاب اس براؤزر میں محفوظ رہتا ہے۔ کمیونٹی کی پوسٹس عوامی ہیں۔',
      'भाषा की पसंद इस ब्राउज़र में सहेजी जाती है। समुदाय की पोस्ट सार्वजनिक हैं।'
    ),
    Sources: W('Fuentes', '来源', 'সূত্র', 'ذرائع', 'स्रोत'),

    'Your week.': W('Tu semana.', '您的一周。', 'আপনার সপ্তাহ।', 'آپ کا ہفتہ۔', 'आपका सप्ताह।'),
    Income: W('Ingresos', '收入', 'আয়', 'آمدنی', 'आय'),
    Essentials: W('Gastos esenciales', '基本开支', 'জরুরি খরচ', 'ضروری اخراجات', 'ज़रूरी खर्च'),
    Savings: W('Ahorros', '储蓄', 'সঞ্চয়', 'بچت', 'बचत'),
    'Tax reserve %': W('Reserva para impuestos %', '税款储备 %', 'করের জন্য রাখা %', 'ٹیکس کے لیے الگ %', 'कर के लिए अलग %'),
    'Tax reserve': W('Reserva para impuestos', '税款储备', 'করের জন্য রাখা', 'ٹیکس کے لیے الگ', 'कर के लिए अलग'),
    'What if income changes?': W('¿Y si cambian los ingresos?', '如果收入变化呢？', 'আয় বদলালে কী হবে?', 'اگر آمدنی بدل جائے تو؟', 'अगर आय बदल जाए तो?'),
    'Left this week': W('Te queda esta semana', '本周剩余', 'এই সপ্তাহে বাকি', 'اس ہفتے باقی', 'इस सप्ताह बाकी'),
    'Short this week': W('Te falta esta semana', '本周缺口', 'এই সপ্তাহে ঘাটতি', 'اس ہفتے کمی', 'इस सप्ताह कमी'),
    Short: W('Falta', '缺口', 'ঘাটতি', 'کمی', 'कमी'),
    'This week’s income': W('Ingresos de esta semana', '本周收入', 'এই সপ্তাহের আয়', 'اس ہفتے کی آمدنی', 'इस सप्ताह की आय'),
    'Savings last': W('Los ahorros duran', '储蓄可支撑', 'সঞ্চয় চলবে', 'بچت چلے گی', 'बचत चलेगी'),
    '{n} weeks': W('{n} semanas', '{n} 周', '{n} সপ্তাহ', '{n} ہفتے', '{n} सप्ताह'),
    Reset: W('Restablecer', '重置', 'রিসেট', 'ری سیٹ', 'रीसेट'),
    'An estimate. Tax % is your own guess. Nothing is saved or sent.': W(
      'Es una estimación. El % de impuestos es tu suposición. Nada se guarda ni se envía.',
      '这只是估算。税率是您自己的假设。不会保存或发送任何内容。',
      'এটি একটি অনুমান। করের % আপনার নিজের ধারণা। কিছুই সংরক্ষণ বা পাঠানো হয় না।',
      'یہ ایک تخمینہ ہے۔ ٹیکس % آپ کا اپنا اندازہ ہے۔ کچھ محفوظ یا بھیجا نہیں جاتا۔',
      'यह एक अनुमान है। कर % आपका अपना अंदाज़ा है। कुछ भी सहेजा या भेजा नहीं जाता।'
    ),
    'Try the tax calculator': W('Probar la calculadora de impuestos', '试用税务计算器', 'কর ক্যালকুলেটর ব্যবহার করুন', 'ٹیکس کیلکولیٹر آزمائیں', 'कर कैलकुलेटर आज़माएँ')
  };

  if (typeof module !== 'undefined') module.exports = { DICTIONARY, LANGUAGES };
  if (typeof document === 'undefined') return;

  const missing = new Set();
  const t = text => {
    const language = document.documentElement.lang;
    if (language === 'en') return text;
    const value = DICTIONARY[text]?.[language];
    if (!value) missing.add(text);
    return value || text;
  };
  function setLanguage(language) {
    const root = document.documentElement;
    root.lang = language;
    root.dir = RTL.has(language) ? 'rtl' : 'ltr';
    const pageTitle = document.body.dataset.title;
    if (pageTitle) document.title = `Steady — ${t(pageTitle)}`;
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => el.setAttribute('aria-label', t(el.dataset.i18nAria)));
    try { localStorage.setItem('steady-language', language); } catch (_) { /* private browsing */ }
    window.dispatchEvent(new CustomEvent('steady-language-change', { detail: { language } }));
  }
  window.STEADY = { t, setLanguage, LANGUAGES, missing };

  const select = document.createElement('select');
  select.setAttribute('data-language-selector', '');
  LANGUAGES.forEach(([value, name]) => {
    const option = document.createElement('option');
    option.value = value; option.textContent = name;
    select.append(option);
  });
  document.querySelector('.lang-slot')?.append(select);
  select.addEventListener('change', () => setLanguage(select.value));
  let saved = 'en';
  try { saved = localStorage.getItem('steady-language') || 'en'; } catch (_) { /* private browsing */ }
  if (!LANGUAGES.some(([code]) => code === saved)) saved = 'en';
  select.value = saved;
  document.documentElement.lang = saved;
  document.documentElement.dir = RTL.has(saved) ? 'rtl' : 'ltr';
  const start = () => setLanguage(select.value);
  // Page scripts listen for the language event, so announce it once they have loaded.
  if (document.readyState === 'complete') start(); else window.addEventListener('DOMContentLoaded', start);
})();
