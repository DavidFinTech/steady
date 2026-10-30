'use strict';
// Explicit resource routing, not a benefits eligibility assessment.
const STEADY_PATHS = {
  budget: {
    title: ['Make room for an uneven week', 'Organiza una semana de ingresos variables'],
    source: ['Steady weekly planner', 'Planificador semanal de Steady'], url: 'planner.html#planner',
    steps: [
      ['List expected income and essential expenses for the same week.', 'Anota los ingresos previstos y los gastos esenciales de la misma semana.'],
      ['Open the planner and try a lower-income scenario.', 'Abre el planificador y prueba un escenario de menores ingresos.'],
      ['Write down one expense or payment date to review.', 'Anota un gasto o una fecha de pago que quieras revisar.']
    ]
  },
  tax: {
    title: ['Get your tax records together', 'Organiza tus registros de impuestos'],
    source: ['IRS estimated tax guidance', 'Guía del IRS sobre impuestos estimados'], url: 'https://www.irs.gov/businesses/small-businesses-self-employed/estimated-taxes',
    steps: [
      ['Gather income records and business expense receipts.', 'Reúne tus registros de ingresos y recibos de gastos del negocio.'],
      ['Read the IRS guidance and note questions about your situation.', 'Lee la guía del IRS y anota preguntas sobre tu situación.'],
      ['Confirm the next action with a qualified tax preparer if you need help.', 'Confirma el siguiente paso con un preparador de impuestos calificado si necesitas ayuda.']
    ]
  },
  health: {
    title: ['Find a starting point for coverage', 'Encuentra un punto de partida para tu cobertura'],
    source: ['NY State of Health application assistors', 'Asistentes de solicitudes de NY State of Health'], url: 'https://nystateofhealth.ny.gov/agent/assistors?lang=en',
    outside: ['HealthCare.gov coverage guidance', 'Guía de cobertura de HealthCare.gov', 'https://www.healthcare.gov/self-employed/coverage/'],
    steps: [
      ['Note whether you need insurance, medical care, or both.', 'Anota si necesitas seguro, atención médica o ambos.'],
      ['Open the official resource and ask about your available options.', 'Abre el recurso oficial y pregunta por las opciones disponibles.'],
      ['Ask what documents and enrollment dates apply before starting an application.', 'Pregunta qué documentos y fechas de inscripción corresponden antes de solicitar cobertura.']
    ]
  },
  pay: {
    title: ['Prepare to ask about unpaid work', 'Prepárate para consultar sobre trabajo no pagado'],
    source: ['NYC DCWP freelance worker guidance', 'Guía de NYC DCWP para trabajadores independientes'], url: 'https://www.nyc.gov/site/dca/workers/workersrights/freelancer-workers.page',
    outside: ['Legal Services Corporation directory', 'Directorio de Legal Services Corporation', 'https://www.lsc.gov/about-lsc/what-legal-aid/i-need-legal-help'],
    steps: [
      ['Collect your contract, invoices and messages about payment.', 'Reúne tu contrato, facturas y mensajes sobre el pago.'],
      ['Make a timeline of the work, agreed payment and follow-ups.', 'Haz una cronología del trabajo, pago acordado y seguimientos.'],
      ['Ask the provider whether they handle your issue and what deadlines apply.', 'Pregunta al proveedor si atiende tu caso y qué plazos corresponden.']
    ]
  }
};
function getSupportPath(need, location) {
  if (!Object.hasOwn(STEADY_PATHS, need) || !['nyc', 'other'].includes(location)) throw new Error('Choose a supported need and location.');
  const path = STEADY_PATHS[need];
  return {...path, source: location === 'other' && path.outside ? path.outside.slice(0, 2) : path.source, url: location === 'other' && path.outside ? path.outside[2] : path.url};
}
if (typeof module !== 'undefined') module.exports = {getSupportPath};
if (typeof document !== 'undefined') {
  const root = document.getElementById('next-step');
  if (root) {
    let need = 'budget', region = 'nyc', shown = false, checked = new Set();
    const t = (en, es) => document.documentElement.lang === 'es' ? es : en;
    const pair = value => t(...value);
    function render(focus = false) {
      const path = getSupportPath(need, region);
      root.innerHTML = `
      <div class="navigator-heading"><div><span class="eyebrow">${t('A SMALL STEP STARTS HERE', 'TU PRIMER PASO EMPIEZA AQUÍ')}</span><h2 id="navigator-title">${t('What would help today?', '¿Qué te ayudaría hoy?')}</h2><p>${t('Choose your priority. Leave with a practical plan.', 'Elige tu prioridad. Llévate un plan práctico.')}</p></div><span class="pilot-label">${t('NYC PILOT', 'PILOTO NYC')}</span></div>
      <div class="navigator-layout"><form id="support-form">
      <fieldset><legend>${t('1. What do you need help with?', '1. ¿Con qué necesitas ayuda?')}</legend><div class="need-grid">
      ${[['budget','Plan my week','Planificar mi semana','01'],['tax','Prepare for taxes','Prepararme para impuestos','02'],['health','Find health coverage','Buscar cobertura médica','03'],['pay','Address unpaid work','Consultar un pago pendiente','04']].map(([key,en,es,num])=>`<label class="need-option"><input type="radio" name="need" value="${key}" ${need===key?'checked':''}><span><small>${num}</small>${t(en,es)}</span></label>`).join('')}
      </div></fieldset><label for="support-location">${t('2. Where are you looking for support?', '2. ¿Dónde buscas apoyo?')}</label>
      <select id="support-location"><option value="nyc" ${region==='nyc'?'selected':''}>${t('New York City', 'Ciudad de Nueva York')}</option><option value="other" ${region==='other'?'selected':''}>${t('Elsewhere in the United States', 'Otro lugar de Estados Unidos')}</option></select>
      <p class="fine">${t('No income, identity or contact details needed. This guide suggests resources; providers determine eligibility.', 'No necesitas dar ingresos, identidad ni datos de contacto. Esta guía sugiere recursos; los proveedores determinan la elegibilidad.')}</p>
      <button class="button" type="submit">${t('Build my checklist →', 'Crear mi lista →')}</button></form>
      <div class="next-plan ${shown?'has-plan':''}" id="next-plan" tabindex="-1" aria-labelledby="plan-title">
      ${shown ? `<span class="eyebrow">${t('YOUR NEXT THREE STEPS', 'TUS PRÓXIMOS TRES PASOS')}</span><h3 id="plan-title">${pair(path.title)}</h3><p class="plan-location">${region==='nyc'?t('Resources for NYC', 'Recursos para NYC'):t('National starting points', 'Puntos de partida nacionales')}</p>
      <div class="plan-progress"><span id="completion" role="status">${checked.size} / 3 ${t('steps checked', 'pasos marcados')}</span><progress value="${checked.size}" max="3" aria-label="${t('Checklist progress','Progreso de la lista')}"></progress></div>
      <div class="checklist">${path.steps.map((step,i)=>`<label><input type="checkbox" data-step="${i}" ${checked.has(i)?'checked':''}><span>${pair(step)}</span></label>`).join('')}</div>
      <a class="resource-action" href="${path.url}">${pair(path.source)} ↗</a><p class="fine">${need==='budget'?t('Local planning tool. No money moves.', 'Herramienta de planificación. No mueve dinero.'):t('External provider. Confirm current rules and availability on their website.', 'Proveedor externo. Confirma las reglas y disponibilidad actuales en su sitio web.')}</p>
      <div class="plan-actions"><button type="button" class="button small" id="print-plan">${t('Print / save PDF', 'Imprimir / guardar PDF')}</button><button type="button" class="reset" id="clear-plan">${t('Start over', 'Empezar de nuevo')}</button></div><p class="fine">${t('Your checklist is not saved. Print it before leaving this page.', 'Tu lista no se guarda. Imprímela antes de salir de esta página.')}</p>` : `<span class="plan-star" aria-hidden="true">✳</span><h3 id="plan-title">${t('One priority. A clear next step.', 'Una prioridad. Un siguiente paso claro.')}</h3><p>${t('Your checklist will appear here, with a useful resource and three actions you can take.', 'Tu lista aparecerá aquí, con un recurso útil y tres acciones que puedes realizar.')}</p><span class="privacy-chip">${t('No sign-up. No personal details.', 'Sin cuenta. Sin datos personales.')}</span>`}
      </div></div>`;
      root.querySelector('#support-form').addEventListener('submit', event => {
        event.preventDefault();
        const nextNeed = root.querySelector('[name="need"]:checked').value;
        const nextRegion = root.querySelector('#support-location').value;
        if (nextNeed !== need || nextRegion !== region) checked.clear();
        need = nextNeed; region = nextRegion; shown = true; render(true);
      });
      root.querySelectorAll('[data-step]').forEach(box => box.addEventListener('change', () => {
        const i = Number(box.dataset.step); box.checked ? checked.add(i) : checked.delete(i);
        root.querySelector('#completion').textContent = `${checked.size} / 3 ${t('steps checked','pasos marcados')}`;
        root.querySelector('progress').value = checked.size;
      }));
      root.querySelector('#print-plan')?.addEventListener('click', () => window.print());
      root.querySelector('#clear-plan')?.addEventListener('click', () => { shown=false; checked.clear(); render(); root.querySelector('[name="need"]:checked').focus(); });
      if (focus) root.querySelector('#next-plan').focus();
    }
    window.addEventListener('steady-language-change', () => {
      render();
    });
    render();
  }
}
