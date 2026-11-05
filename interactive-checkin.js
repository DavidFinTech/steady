(() => {
  const form = document.getElementById('support-form');
  const plan = document.getElementById('next-plan');
  if (!form || !plan) return;
  const content = {
    en: {
      eyebrow: 'YOUR NEXT THREE STEPS',
      labels: { week: 'Plan my week', taxes: 'Prepare for taxes', health: 'Find health coverage', pay: 'Address unpaid work' },
      plans: {
        week: ['Make room for an uneven week', ['List expected income and essential expenses for the same week.', 'Open the planner and try a lower-income scenario.', 'Write down one expense or payment date to review.'], 'planner.html#planner', 'Steady weekly planner ↗', 'Local planning tool. No money moves.'],
        taxes: ['Get your tax records together', ['Gather income records and business expense receipts.', 'Read IRS guidance and note questions about your situation.', 'Confirm the next action with a qualified tax preparer if you need help.'], 'https://www.irs.gov/businesses/small-businesses-self-employed/estimated-taxes', 'IRS estimated tax guidance ↗', 'External provider. Confirm current rules and availability on their website.'],
        health: ['Find a coverage starting point', ['Check whether you can enroll or update coverage after a life change.', 'Compare plans, costs, and nearby providers.', 'Write down one question to bring to an assister or enrollment helper.'], 'https://www.healthcare.gov/self-employed/coverage/', 'Explore HealthCare.gov ↗', 'External provider. Confirm current rules and availability on their website.'],
        pay: ['Protect your unpaid work', ['Save your contract, invoice, and payment records in one place.', 'Write down the amount owed and the payment due date.', 'Review the right resource before deciding on your next step.'], 'https://www.nyc.gov/site/dca/workers/workersrights/freelancer-workers.page', 'Explore NYC freelance worker rights ↗', 'External provider. Confirm current rules and availability on their website.']
      },
      elsewhere: { week: 'Resources for the United States', taxes: 'Resources for the United States', health: 'Resources for the United States', pay: 'Resources for the United States' },
      nyc: 'Resources for NYC',
      progress: 'steps checked',
      print: 'Print / save PDF',
      restart: 'Start over',
      unsaved: 'Your checklist is not saved. Print it before leaving this page.',
      emptyTitle: 'One priority. A clear next step.',
      emptyBody: 'Your checklist will appear here, with a useful resource and three actions you can take.',
      emptyNote: 'No sign-up. No personal details.'
    },
    es: {
      eyebrow: 'TUS PRÓXIMOS TRES PASOS',
      labels: { week: 'Planificar mi semana', taxes: 'Prepararme para impuestos', health: 'Encontrar cobertura médica', pay: 'Resolver trabajo sin pagar' },
      plans: {
        week: ['Haz espacio para una semana irregular', ['Anota los ingresos esperados y gastos esenciales de la misma semana.', 'Abre el planificador y prueba un escenario con menos ingresos.', 'Anota un gasto o fecha de pago que debas revisar.'], 'planner.html#planner', 'Planificador semanal de Steady ↗', 'Herramienta de planificación local. No mueve dinero.'],
        taxes: ['Reúne tus documentos fiscales', ['Reúne registros de ingresos y recibos de gastos del negocio.', 'Lee la guía del IRS y anota preguntas sobre tu situación.', 'Confirma el siguiente paso con un preparador de impuestos calificado si necesitas ayuda.'], 'https://www.irs.gov/businesses/small-businesses-self-employed/estimated-taxes', 'Guía de impuestos estimados del IRS ↗', 'Proveedor externo. Confirma las reglas y disponibilidad actuales en su sitio web.'],
        health: ['Encuentra un punto de partida para cobertura', ['Revisa si puedes inscribirte o actualizar tu cobertura tras un cambio de vida.', 'Compara planes, costos y proveedores cercanos.', 'Anota una pregunta para un asistente de inscripción.'], 'https://www.healthcare.gov/self-employed/coverage/', 'Explorar HealthCare.gov ↗', 'Proveedor externo. Confirma las reglas y disponibilidad actuales en su sitio web.'],
        pay: ['Protege tu trabajo no pagado', ['Guarda tu contrato, factura y registros de pago en un solo lugar.', 'Anota el monto adeudado y la fecha de pago.', 'Revisa el recurso adecuado antes de decidir tu siguiente paso.'], 'https://www.nyc.gov/site/dca/workers/workersrights/freelancer-workers.page', 'Explorar derechos de freelancers de NYC ↗', 'Proveedor externo. Confirma las reglas y disponibilidad actuales en su sitio web.']
      },
      elsewhere: { week: 'Recursos para Estados Unidos', taxes: 'Recursos para Estados Unidos', health: 'Recursos para Estados Unidos', pay: 'Recursos para Estados Unidos' },
      nyc: 'Recursos para NYC',
      progress: 'pasos completados',
      print: 'Imprimir / guardar PDF',
      restart: 'Empezar de nuevo',
      unsaved: 'Tu lista no se guarda. Imprímela antes de salir de esta página.',
      emptyTitle: 'Una prioridad. Un siguiente paso claro.',
      emptyBody: 'Tu lista aparecerá aquí, con un recurso útil y tres acciones que puedes realizar.',
      emptyNote: 'Sin registro. Sin datos personales.'
    }
  };
  let active = null;
  const language = () => document.documentElement.lang === 'es' ? 'es' : 'en';
  const renderEmpty = () => {
    const t = content[language()];
    plan.innerHTML = '<h3>' + t.emptyTitle + '</h3><p>' + t.emptyBody + '</p><p class="next-plan-note">' + t.emptyNote + '</p>';
  };
  const renderPlan = () => {
    if (!active) return renderEmpty();
    const t = content[language()];
    const priority = form.elements.priority.value;
    const location = form.elements.location.value;
    const item = t.plans[priority];
    const context = location === 'nyc' ? t.nyc : t.elsewhere[priority];
    plan.innerHTML = '<span class="eyebrow">' + t.eyebrow + '</span><h3>' + item[0] + '</h3><p class="plan-context">' + context + '</p><div class="plan-progress"><span id="plan-progress-text">0 / 3 ' + t.progress + '</span><progress id="plan-progress" value="0" max="3">0 of 3</progress></div><div class="plan-steps">' + item[1].map((step, index) => '<label><input type="checkbox" data-plan-step="' + index + '"><span>' + step + '</span></label>').join('') + '</div><a class="text-link plan-resource" href="' + item[2] + '">' + item[3] + '</a><p class="plan-provider">' + item[4] + '</p><div class="plan-actions"><button type="button" class="outline" id="print-plan">' + t.print + '</button><button type="button" class="reset" id="clear-plan">' + t.restart + '</button></div><p class="next-plan-note">' + t.unsaved + '</p>';
    const checks = [...plan.querySelectorAll('[data-plan-step]')];
    const updateProgress = () => {
      const done = checks.filter(check => check.checked).length;
      plan.querySelector('#plan-progress-text').textContent = done + ' / 3 ' + t.progress;
      plan.querySelector('#plan-progress').value = done;
    };
    checks.forEach(check => check.addEventListener('change', updateProgress));
    plan.querySelector('#print-plan').addEventListener('click', () => window.print());
    plan.querySelector('#clear-plan').addEventListener('click', () => { active = null; form.reset(); renderEmpty(); });
  };
  form.addEventListener('submit', event => { event.preventDefault(); active = true; renderPlan(); });
  window.addEventListener('steady-language-change', renderPlan);
  renderEmpty();
})();