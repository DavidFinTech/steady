(() => {
  const translations = {
    "Skip to content":"Saltar al contenido","Skip to planner":"Saltar al planificador",
    "Tax calculator":"Calculadora de impuestos","Health care":"Atención médica","Legal protection":"Protección legal","Profile / Sign in":"Perfil / Iniciar sesión",
    "Weekly planner ↗":"Planificador semanal ↗","Resource hub":"Centro de recursos","Back to homepage ↗":"Volver al inicio ↗","Back to resources ↗":"Volver a los recursos ↗",
    "Resource hub ":"Centro de recursos ","Financial wellbeing ":"Bienestar financiero ","Government & community resources":"Recursos gubernamentales y comunitarios",
    "YOUR WORK CHANGES. YOUR SUPPORT STAYS.":"TU TRABAJO CAMBIA. TU APOYO PERMANECE.",
    "A little more clarity.":"Más claridad.","A lot more support.":"Mucho más apoyo.",
    "Taxes, health care, and your rights at work.":"Impuestos, atención médica y tus derechos laborales.",
    "Find practical tools and trusted resources for life between gigs.":"Encuentra herramientas prácticas y recursos confiables para la vida entre trabajos.",
    "Estimate my taxes":"Calcular mis impuestos","Explore the resources ↓":"Explorar los recursos ↓",
    "For freelancers, gig workers & independent contractors":"Para trabajadores independientes, por encargo y contratistas",
    "YOUR NEXT STEP":"TU SIGUIENTE PASO","A steadier tomorrow.":"Un mañana más estable.","Plan for taxes":"Planifica tus impuestos","Find your coverage":"Encuentra cobertura médica","Protect your work":"Protege tu trabajo","Small steps. Real peace of mind.":"Pequeños pasos. Tranquilidad real.",
    "START WITH WHAT YOU NEED":"EMPIEZA CON LO QUE NECESITAS","Support, without the search.":"Apoyo sin tener que buscar.","You don’t need to figure everything out at once.":"No tienes que resolverlo todo de una vez.","Choose one useful next step.":"Elige un siguiente paso útil.",
    "Make sense of taxes":"Entiende tus impuestos","Estimate what to set aside":"Calcula cuánto reservar","Find a path to care":"Encuentra atención médica","Explore coverage and affordable care":"Explora cobertura y atención asequible","Know your rights":"Conoce tus derechos","Protect your pay and your work":"Protege tu pago y tu trabajo",
    "01 / PLAN AHEAD":"01 / PLANIFICA","Less tax guesswork.":"Menos dudas sobre impuestos.","More breathing room.":"Más tranquilidad.",
    "A starting estimate for a self-employed worker":"Una estimación inicial para una persona autónoma","with no other income. Your numbers stay in this browser.":"sin otros ingresos. Tus cifras permanecen en este navegador.",
    "Your annual picture":"Tu panorama anual","2026 TAX YEAR":"AÑO FISCAL 2026","Annual self-employment revenue":"Ingresos anuales por trabajo autónomo","Annual business expenses":"Gastos comerciales anuales","Filing status":"Estado civil para la declaración","Single":"Soltero/a","Married filing jointly — one earner":"Casados que declaran juntos: un solo ingreso",
    "Assumes under age 65, not a dependent, standard deduction, and no other household income.":"Supone menos de 65 años, no ser dependiente, deducción estándar y ningún otro ingreso familiar.",
    "Calculate estimate ↗":"Calcular estimación ↗","Reset":"Restablecer","ESTIMATED ANNUAL FEDERAL TAX":"IMPUESTOS FEDERALES ANUALES ESTIMADOS",
    "Before tax credits and the QBI deduction":"Antes de créditos fiscales y de la deducción por ingresos comerciales calificados",
    "Net business profit":"Ganancia neta del negocio","Federal income tax":"Impuesto federal sobre la renta","Self-employment tax":"Impuesto por trabajo autónomo","Additional Medicare tax":"Impuesto adicional de Medicare","Monthly planning amount":"Monto mensual para planificar",
    "Annual estimate ÷ 12. Not a required payment schedule or a balance due.":"Estimación anual ÷ 12. No es un calendario de pagos obligatorio ni un saldo adeudado.",
    "What this estimate includes & leaves out ":"Qué incluye y qué no incluye esta estimación ","Uses 2026 federal tax brackets and standard deductions ($16,100 single; $32,200 joint), 92.35% of business profit for self-employment earnings, the $184,500 Social Security wage base, and the deduction for half of regular self-employment tax.":"Usa los tramos fiscales federales de 2026 y las deducciones estándar (16.100 $ para solteros; 32.200 $ para declaración conjunta), el 92,35 % de las ganancias para calcular ingresos de trabajo autónomo, la base salarial de Seguro Social de 184.500 $ y la deducción de la mitad del impuesto regular por trabajo autónomo.",
    "Excludes state and local taxes, QBI, credits, itemized deductions, special deductions, other income, withholding, prior payments, and alternative minimum tax. Joint mode assumes only one spouse earns income. A business loss is treated as zero here. This simplified planning estimate is not a tax return or individualized advice.":"No incluye impuestos estatales o locales, ingresos comerciales calificados, créditos, deducciones detalladas o especiales, otros ingresos, retenciones, pagos previos ni el impuesto mínimo alternativo. La declaración conjunta supone que solo una persona de la pareja obtiene ingresos. Las pérdidas comerciales se consideran cero. Esta estimación simplificada no es una declaración de impuestos ni asesoramiento personalizado.",
    "IRS 2026 tax tables ↗":"Tablas fiscales del IRS para 2026 ↗","IRS small business tax guide ↗":"Guía fiscal del IRS para pequeñas empresas ↗","Estimated payment guidance ↗":"Guía de pagos estimados ↗",
    "You may be able to file for free.":"Es posible que puedas declarar gratis.","Check IRS VITA for volunteer tax help or IRS Free File for guided filing options.":"Consulta VITA del IRS para recibir ayuda voluntaria o IRS Free File para opciones guiadas de declaración.","Find tax help ↗":"Encontrar ayuda fiscal ↗","Explore Free File ↗":"Explorar Free File ↗",
    "02 / LOOK AFTER YOURSELF":"02 / CUIDA DE TI","Independent work.":"Trabajo independiente.","Connected to care.":"Con acceso a atención médica.","Coverage and care are different needs.":"La cobertura y la atención son necesidades distintas.","Start with the option that fits your situation.":"Empieza con la opción que mejor se adapte a tu situación.",
    "HEALTH INSURANCE":"SEGURO MÉDICO","Find Marketplace coverage":"Encuentra cobertura en el Mercado","Explore plans through HealthCare.gov. Your estimated household income helps determine whether financial assistance is available.":"Explora planes en HealthCare.gov. Los ingresos familiares estimados ayudan a determinar si puedes recibir ayuda económica.",
    "Compare premiums, deductibles, and networks":"Compara primas, deducibles y redes médicas","Check enrollment windows and life-event options":"Consulta los períodos de inscripción y las opciones por cambios de vida","Update your application when income changes":"Actualiza tu solicitud si cambian tus ingresos","Explore HealthCare.gov ↗":"Explorar HealthCare.gov ↗",
    "LOW-COST COVERAGE":"COBERTURA DE BAJO COSTO","Check Medicaid & CHIP":"Consulta Medicaid y CHIP","These programs offer coverage to eligible adults and children. Rules depend on your state and household circumstances.":"Estos programas ofrecen cobertura a adultos y niños que cumplen los requisitos. Las reglas dependen del estado y de la situación familiar.","Applications are accepted year-round":"Se aceptan solicitudes durante todo el año","Your state makes the eligibility decision":"Tu estado determina la elegibilidad","Ask about coverage for your children, too":"Pregunta también por la cobertura de tus hijos","See Medicaid & CHIP options ↗":"Ver opciones de Medicaid y CHIP ↗",
    "CARE IN YOUR COMMUNITY":"ATENCIÓN EN TU COMUNIDAD","Find a health center":"Encuentra un centro de salud","Search for a community health center near you and ask about services and fees based on your income.":"Busca un centro de salud comunitario cercano y pregunta por los servicios y las tarifas según tus ingresos.","Ask about care without insurance":"Pregunta por atención sin seguro","Check primary, dental, and mental health services":"Consulta servicios de atención primaria, dental y de salud mental","Confirm fees and appointment availability":"Confirma las tarifas y la disponibilidad de citas","Find a local health center ↗":"Encontrar un centro de salud cercano ↗",
    "Based in New York?":"¿Vives en Nueva York?","Get free application help from ":"Recibe ayuda gratuita para solicitar cobertura de ","NY State of Health assistors ↗":"asistentes de NY State of Health ↗",". Uninsured NYC residents can also explore ":". Los residentes de NYC sin seguro también pueden consultar ","NYC Care ↗":"NYC Care ↗",", a care access program, not insurance.":", un programa de acceso a la atención, no un seguro.",
    "03 / PROTECT YOUR WORK":"03 / PROTEGE TU TRABAJO","Your work has value.":"Tu trabajo tiene valor.","Your rights matter.":"Tus derechos importan.","Keep your contracts, invoices, and payment records.":"Guarda tus contratos, facturas y registros de pago.","Then find the right place to ask for help.":"Después, encuentra el lugar adecuado para pedir ayuda.",
    "NYC FREELANCERS":"FREELANCERS DE NYC","Get paid for your work":"Cobra por tu trabajo","NYC’s Freelance Isn’t Free Act provides protections around written contracts, timely payment, and retaliation for covered freelance work.":"La ley Freelance Isn’t Free de NYC protege ciertos trabajos independientes mediante contratos escritos, pagos puntuales y protección contra represalias.",
    "DCWP explains the rules and how to submit a complaint. Confirm whether the law applies to your situation.":"DCWP explica las reglas y cómo presentar una queja. Confirma si la ley se aplica a tu situación.","Explore freelance worker rights ↗":"Conoce los derechos de trabajadores independientes ↗",
    "WORKER CLASSIFICATION":"CLASIFICACIÓN LABORAL","Employee or contractor?":"¿Empleado o contratista?","A job title or a 1099 form doesn’t settle every question about your rights. Classification affects which wage protections apply.":"El título del puesto o un formulario 1099 no determinan por sí solos todos tus derechos. La clasificación afecta las protecciones salariales aplicables.","Use official guidance to learn where to raise concerns about classification or unpaid wages.":"Consulta la orientación oficial para saber dónde plantear dudas sobre la clasificación o los salarios impagos.","Find classification help ↗":"Encontrar ayuda sobre clasificación ↗",
    "CIVIL LEGAL SUPPORT":"ASISTENCIA JURÍDICA CIVIL","Find legal aid near you":"Encuentra asistencia legal cercana","Legal Services Corporation’s directory connects you with local organizations offering civil legal aid to eligible people.":"El directorio de Legal Services Corporation te conecta con organizaciones locales que ofrecen asistencia jurídica civil a personas elegibles.","Contact the provider about your issue, eligibility, and deadlines. Available help varies by location.":"Contacta al proveedor sobre tu caso, elegibilidad y plazos. La ayuda disponible varía según el lugar.","Find local legal aid ↗":"Encontrar asistencia legal local ↗",
    "NOT SURE WHERE TO START?":"¿NO SABES POR DÓNDE EMPEZAR?","One conversation can help.":"Una conversación puede ayudar.","211 can connect you with local food, housing, utility, and community support.":"El 211 puede conectarte con apoyo local para alimentos, vivienda, servicios públicos y recursos comunitarios.","Find support through 211 ↗":"Encontrar apoyo a través del 211 ↗",
    "A few things worth knowing.":"Algunas cosas que conviene saber.","Does Steady determine whether I qualify? ":"¿Steady determina si cumplo los requisitos? ","No. Each program or agency reviews your circumstances and determines eligibility. Follow the official links for current rules and application steps.":"No. Cada programa o agencia revisa tus circunstancias y determina la elegibilidad. Consulta los enlaces oficiales para conocer las reglas y los pasos actuales.",
    "Does the calculator save my financial information? ":"¿La calculadora guarda mi información financiera? ","No. Calculations happen on this page. Inputs are not sent to a server or saved by Steady. Reloading restores the sample values.":"No. Los cálculos se realizan en esta página. Steady no envía los datos a un servidor ni los guarda. Al recargar, se restauran los valores de ejemplo.",
    "What if my income changes month to month? ":"¿Qué pasa si mis ingresos cambian cada mes? ","Use a realistic annual projection and revisit it as work changes. Keep income and expense records, and ask your Marketplace or tax professional how to update estimates.":"Usa una proyección anual realista y revísala cuando cambie tu trabajo. Lleva registros de ingresos y gastos, y pregunta al Mercado o a un profesional fiscal cómo actualizar las estimaciones.",
    "Your Steady profile":"Tu perfil de Steady","Make your support personal.":"Personaliza tu apoyo.","Create a profile with a username, email, and password, or sign in to an existing account. Sign-in is not available yet; you can use all planning tools without an account.":"Crea un perfil con nombre de usuario, correo y contraseña, o inicia sesión en una cuenta existente. El inicio de sesión aún no está disponible; puedes usar todas las herramientas sin una cuenta.",
    "Sign in":"Iniciar sesión","Create profile":"Crear perfil","Username":"Nombre de usuario","Profile picture ":"Foto de perfil ","(optional)":"(opcional)","About you ":"Sobre ti ","Occupation":"Ocupación","Industry":"Sector","Location":"Ubicación","Bio":"Biografía","Background":"Experiencia","Email address":"Correo electrónico","Password":"Contraseña","Remove picture":"Quitar foto","Choose a JPG, PNG, WebP, or GIF image up to 2 MB. Your picture appears beside your username in the top-right corner.":"Elige una imagen JPG, PNG, WebP o GIF de hasta 2 MB. Tu foto aparecerá junto a tu nombre de usuario en la esquina superior derecha.",
    "e.g. Freelance designer":"p. ej., diseñador/a independiente","e.g. Design and creative services":"p. ej., diseño y servicios creativos","e.g. Brooklyn, NY":"p. ej., Brooklyn, NY","A short introduction (optional)":"Una breve presentación (opcional)","Share relevant experience, skills, or context (optional)":"Comparte experiencia, habilidades o contexto relevante (opcional)","At least 8 characters":"Al menos 8 caracteres","Signed in":"Sesión iniciada","Sign out":"Cerrar sesión","Account access is not connected yet. No sign-in details are sent until authentication is enabled. Your calculator inputs are not saved to a profile.":"El acceso a cuentas aún no está conectado. No se envían datos de inicio de sesión hasta activar la autenticación. Los datos de la calculadora no se guardan en el perfil.",
    "Built around trusted starting points.":"Basado en fuentes confiables.","Sources include the IRS, HealthCare.gov, HRSA, NYC DCWP, USAGov, and Legal Services Corporation. Links appear next to the relevant tools and resources. General information only; confirm tax calculations, program rules, and legal deadlines with the relevant provider. This independent Steady project is not affiliated with these organizations or Indeed Flex.":"Las fuentes incluyen el IRS, HealthCare.gov, HRSA, NYC DCWP, USAGov y Legal Services Corporation. Los enlaces aparecen junto a las herramientas y recursos pertinentes. Información general: confirma los cálculos fiscales, las reglas de los programas y los plazos legales con la entidad correspondiente. Este proyecto independiente de Steady no está afiliado a estas organizaciones ni a Indeed Flex.",
    "Your work changes. Your support stays.":"Tu trabajo cambia. Tu apoyo permanece.",
    "YOUR WEEKLY PLANNER":"TU PLANIFICADOR SEMANAL","What does your week look like?":"¿Cómo será tu semana?","Adjust this sample budget to see how an income change affects your buffer.":"Ajusta este presupuesto de ejemplo para ver cómo un cambio de ingresos afecta tu reserva.",
    "Expected weekly income ($)":"Ingresos semanales previstos ($)","Essential weekly expenses ($)":"Gastos semanales esenciales ($)","Current emergency savings ($)":"Ahorros actuales para emergencias ($)","Tax reserve (%)":"Reserva para impuestos (%)","Income change: ":"Cambio de ingresos: ","Tax percentage is an editable planning assumption, not a tax calculation. No money moves and nothing is saved or sent. ":"El porcentaje de impuestos es una suposición editable para planificar, no un cálculo fiscal. No se mueve dinero ni se guarda o envía nada. ",
    "Try the 2026 tax calculator →":"Prueba la calculadora de impuestos de 2026 →","Reset sample":"Restablecer ejemplo","Available after essentials and tax reserve":"Disponible después de gastos esenciales y reserva de impuestos","Scenario income":"Ingresos del escenario","Tax reserve":"Reserva para impuestos","Savings cover essential expenses for":"Los ahorros cubren los gastos esenciales durante","weeks":"semanas","Consider putting some of the remainder toward your buffer.":"Considera destinar parte del sobrante a tu reserva.","This is a weekly estimate. It does not model debt interest, benefit eligibility, or payment timing within the week.":"Esta es una estimación semanal. No calcula intereses de deudas, elegibilidad para beneficios ni fechas de pago dentro de la semana."
  };
  const attributes = {
    "Skip to content":"Saltar al contenido","Skip to planner":"Saltar al planificador",
    "Default profile picture":"Foto de perfil predeterminada","Selected profile picture preview":"Vista previa de la foto de perfil seleccionada",
    "e.g. maya_design":"p. ej., maya_design","you@example.com":"tu@ejemplo.com",
    "At least 8 characters":"Al menos 8 caracteres"
  };
  const original = new WeakMap();
  function applyLanguage(spanish) {
    document.documentElement.lang = spanish ? "es" : "en";
    document.title = spanish
      ? (location.pathname.endsWith("planner.html") ? "Planificador semanal — Steady" : "Steady — Recursos para trabajadores independientes")
      : (location.pathname.endsWith("planner.html") ? "Weekly planner — Steady" : "Steady — Resources for independent workers");
    document.querySelectorAll("[data-language-toggle]").forEach(button => {
      button.textContent = spanish ? "English" : "Español";
      button.setAttribute("aria-label", spanish ? "Switch website language to English" : "Cambiar el idioma del sitio web a español");
      button.setAttribute("aria-pressed", String(spanish));
    });
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (!original.has(node)) original.set(node, node.nodeValue);
      const source = original.get(node);
      const trimmed = source.trim();
      if (!trimmed) continue;
      const translated = translations[trimmed];
      if (spanish && translated) {
        const start = source.match(/^\s*/)[0], end = source.match(/\s*$/)[0];
        node.nodeValue = start + translated + end;
      } else if (!spanish) node.nodeValue = source;
    }
    document.querySelectorAll("input[placeholder],textarea[placeholder],img[alt],a[aria-label],button[aria-label]").forEach(el => {
      for (const attr of ["placeholder", "alt", "aria-label"]) {
        if (!el.hasAttribute(attr)) continue;
        const key = attr + ":" + el.getAttribute(attr);
        if (!el.dataset["langOriginal" + attr]) el.dataset["langOriginal" + attr] = el.getAttribute(attr);
        const originalValue = el.dataset["langOriginal" + attr];
        const translated = attributes[originalValue] || translations[originalValue];
        if (spanish && translated) el.setAttribute(attr, translated);
        else if (!spanish) el.setAttribute(attr, originalValue);
      }
    });
    document.querySelectorAll("[data-language-toggle]").forEach(button => button.setAttribute("aria-pressed", String(spanish)));
    try { localStorage.setItem("steady-language", spanish ? "es" : "en"); } catch (_) {}
    window.dispatchEvent(new CustomEvent("steady-language-change", { detail: { language: spanish ? "es" : "en" } }));
  }
  function init() {
    const header = document.querySelector("header");
    if (header && !header.querySelector("[data-language-toggle]")) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "language-toggle";
      button.dataset.languageToggle = "";
      button.textContent = "Español";
      button.setAttribute("aria-label", "Cambiar el idioma del sitio web a español");
      button.addEventListener("click", () => applyLanguage(document.documentElement.lang !== "es"));
      const profile = header.querySelector(".header-profile");
      if (profile) header.insertBefore(button, profile);
      else header.appendChild(button);
    }
    let spanish = false;
    try { spanish = localStorage.getItem("steady-language") === "es"; } catch (_) {}
    applyLanguage(spanish);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
  const observer = new MutationObserver(() => {
    if (document.documentElement.lang !== "es") return;
    document.querySelectorAll("#account-status, #account-signed-in h3, #account-profile-summary, #changeLabel, #advice").forEach(el => {
      const text = el.textContent.trim();
      if (translations[text]) el.textContent = translations[text];
    });
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();