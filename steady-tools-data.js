// Facts for the rights, money and health tools. Checked against official sources in
// November 2026. Review these before launch and at least every April, when the NYC
// delivery pay rate changes. Eligibility is always decided by the provider.
(() => {
  const URLS = {
    delivery: 'https://www.nyc.gov/site/dca/workers/workersrights/Delivery-Workers.page',
    freelance: 'https://www.nyc.gov/site/dca/workers/workersrights/freelancer-workers.page',
    newLaws: 'https://www.nyc.gov/site/dca/about/new-laws-rules.page',
    tlcPay: 'https://www.nyc.gov/site/tlc/about/driver-pay-rates.page',
    nytwa: 'https://www.nytwa.org/deactivation',
    wjp: 'https://www.workersjustice.org',
    blackCar: 'https://www.nybcf.org',
    driversBenefits: 'https://www.driversbenefits.org',
    advocate: 'https://www.wcb.ny.gov/content/main/Workers/WhatIsAdvocateInjuredWkrs.jsp',
    fileClaim: 'https://www.wcb.ny.gov/content/main/Workers/file-claim.jsp',
    attorneyGeneral: 'https://ag.ny.gov/',
    misclass: 'https://www.usa.gov/job-misclassification',
    unemployment: 'https://dol.ny.gov/unemployment',
    legalAid: 'https://www.lsc.gov/about-lsc/what-legal-aid/i-need-legal-help',
    lawHelp: 'https://www.lawhelpny.org/',
    oneShot: 'https://access.nyc.gov/programs/one-shot-deal/',
    homebase: 'https://access.nyc.gov/programs/homebase/',
    snap: 'https://access.nyc.gov/programs/supplemental-nutrition-assistance-program-snap/',
    accessHra: 'https://on.nyc.gov/ACCESSHRA',
    heap: 'https://access.nyc.gov/programs/home-energy-assistance-program-heap/',
    counseling: 'https://access.nyc.gov/programs/nyc-financial-empowerment-centers/',
    nyHealth: 'https://nystateofhealth.ny.gov/',
    assistors: 'https://nystateofhealth.ny.gov/agent/assistors?lang=en',
    healthcareGov: 'https://www.healthcare.gov/self-employed/coverage/',
    nycCare: 'https://www.nyccare.nyc/',
    healthCenter: 'https://findahealthcenter.hrsa.gov/'
  };
  const HURT_GENERAL = { title: 'Get care first, then protect your claim', line: 'If workers’ comp applies, tell the company in writing within 30 days. File within 2 years.', cta: 'Advocate for Injured Workers', url: URLS.advocate, more: [{ label: 'File a claim', url: URLS.fileClaim }], proof: ['Photos', 'Medical records', 'Order or trip screenshot'] };
  const HURT_DRIVER = { title: 'The Black Car Fund may cover you', line: 'It can pay medical costs and lost wages if you’re hurt while dispatched by a member base, like Uber or Lyft.', cta: 'Black Car Fund', url: URLS.blackCar, more: [{ label: 'Drivers Benefits', url: URLS.driversBenefits }], proof: ['Trip details', 'Photos', 'Medical records'] };

  const RIGHTS = {
    delivery: {
      icon: 'receipt', label: 'Delivery apps', anyStatus: true,
      issues: {
        lowpay: { icon: 'coin', label: 'Pay looks too low', title: 'NYC sets a minimum for delivery apps', line: 'Apps must pay at least $22.13 an hour before tips for time spent on deliveries.', cta: 'File with DCWP', url: URLS.delivery, proof: ['Pay statements', 'Hours you worked', 'Order history'], note: true },
        deactivated: { icon: 'flag', label: 'Deactivated or locked out', title: 'New protection starts January 17, 2027', line: 'Apps would need just cause or a real business reason. Apps are challenging this in court.', cta: 'See the NYC rules', url: URLS.newLaws, more: [{ label: 'Workers Justice Project', url: URLS.wjp }], proof: ['The app’s message', 'Your ratings', 'Order history'], note: true },
        bathroom: { icon: 'pin', label: 'Denied a bathroom', title: 'You can ask to use the bathroom', line: 'At pickup, unless there’s a health or safety risk.', cta: 'File with DCWP', url: URLS.delivery, proof: ['Where it happened', 'Date and time', 'Who refused'], note: true },
        hurt: { icon: 'heart', label: 'I got hurt', ...HURT_GENERAL, note: true }
      }
    },
    driver: {
      icon: 'pin', label: 'Uber, Lyft or taxi',
      issues: {
        lowpay: { icon: 'coin', label: 'Pay looks too low', title: 'TLC sets minimum pay for Uber and Lyft trips', line: 'Rates are per mile and per minute. Compare them with your trip statements.', cta: 'See current rates', url: URLS.tlcPay, proof: ['Trip statements', 'Weekly pay summaries', 'Screenshots'], note: true },
        deactivated: { icon: 'flag', label: 'Deactivated or locked out', title: 'Ask why, in writing, right away', line: 'Ask about the company’s appeal process. TLC rules also limit some app lockouts.', cta: 'NY Taxi Workers Alliance', url: URLS.nytwa, more: [{ label: 'Find legal aid', url: URLS.legalAid }], proof: ['The app’s message', 'Trip history', 'Your appeal'], note: true },
        hurt: { icon: 'heart', label: 'I got hurt', ...HURT_DRIVER, note: true }
      }
    },
    freelance: {
      icon: 'doc', label: 'Freelance or contract', anyStatus: true,
      issues: {
        unpaid: { icon: 'coin', label: "I wasn't paid", title: 'You may be owed double', line: 'NYC law lets you seek double the unpaid amount, plus legal fees. Check that it covers your work.', cta: 'File with DCWP', url: URLS.freelance, more: [{ label: 'Outside NYC: Attorney General', url: URLS.attorneyGeneral }], proof: ['Contract', 'Invoices', 'Messages about payment'], overdue: true, note: true },
        contract: { icon: 'doc', label: 'No written contract', title: 'Work worth $800 or more needs a contract', line: 'That includes jobs for the same client that add up to $800 in 120 days.', cta: 'See the model contract', url: URLS.freelance, proof: ['Messages about the work', 'Invoices', 'Work you delivered'], note: true },
        threat: { icon: 'shield', label: 'They threatened me', title: 'Retaliation is illegal', line: 'Clients can’t threaten, blacklist or punish you for using your rights.', cta: 'File with DCWP', url: URLS.freelance, proof: ['Messages', 'Dates', 'Witnesses'], note: true }
      }
    },
    unsure: {
      icon: 'question', label: 'Not sure',
      issues: {
        employee: { icon: 'badge', label: 'Am I an employee?', title: 'Employee or contractor?', line: "A job title or 1099 doesn't settle it.", cta: 'Find out more', url: URLS.misclass, proof: ['Contract', 'Who sets your schedule', 'Who sets your pay'] },
        lostwork: { icon: 'calendar', label: 'I lost work', title: 'You can still apply for unemployment', line: 'New York has treated some app workers as employees for unemployment. Results vary.', cta: 'NY unemployment', url: URLS.unemployment, proof: ['Income records', 'Last day you worked', 'App or client messages'], note: true },
        hurt: { icon: 'heart', label: 'I got hurt', ...HURT_GENERAL, note: true },
        legal: { icon: 'scale', label: 'I need legal help', title: 'Civil legal aid', line: 'Local groups help people who qualify.', cta: 'Find legal aid', url: URLS.legalAid, more: [{ label: 'LawHelpNY', url: URLS.lawHelp }], proof: ['What happened', 'Dates', 'Documents'], note: true }
      }
    }
  };
  const CHOOSERS = {
    money: [
      { icon: 'pin', label: 'Rent', title: 'Behind on rent?', line: 'Ask about a One Shot Deal. Homebase can help you stay housed.', cta: 'One Shot Deal', url: URLS.oneShot, more: [{ label: 'Homebase', url: URLS.homebase }] },
      { icon: 'receipt', label: 'Food', title: 'Need help with food?', line: 'Apply for SNAP online or in the app.', cta: 'SNAP', url: URLS.snap, more: [{ label: 'ACCESS HRA', url: URLS.accessHra }] },
      { icon: 'calendar', label: 'Utilities', title: 'Behind on utilities?', line: 'HEAP is seasonal. A One Shot Deal may also help.', cta: 'HEAP', url: URLS.heap, more: [{ label: 'One Shot Deal', url: URLS.oneShot }] },
      { icon: 'coin', label: 'Debt', title: 'Debt piling up?', line: 'Get free one-on-one money counseling.', cta: 'Free counseling', url: URLS.counseling }
    ],
    care: [
      { icon: 'heart', label: 'NYC Care', title: 'NYC Care', line: 'For NYC residents who can’t get insurance, regardless of immigration status. Not insurance.', cta: 'NYC Care', url: URLS.nycCare },
      { icon: 'pin', label: 'Find a clinic', title: 'Find a health center', line: 'Fees may depend on your income.', cta: 'Find a center', url: URLS.healthCenter }
    ],
    injury: [
      { icon: 'pin', label: 'Driver', ...HURT_DRIVER },
      { icon: 'receipt', label: 'Delivery', ...HURT_GENERAL },
      { icon: 'doc', label: 'Other work', ...HURT_GENERAL }
    ]
  };
  // HHS 2026 poverty guidelines for the 48 contiguous states: $15,960 + $5,680 per extra person.
  const POVERTY_BASE = 15960, POVERTY_PER_PERSON = 5680;
  const COVERAGE = [
    { key: 'medicaid', upTo: 138, label: 'Medicaid', title: 'Start with Medicaid', line: 'Your income looks within New York’s adult limit.' },
    { key: 'essential', upTo: 200, label: 'Essential Plan', title: 'Start with the Essential Plan', line: 'Low or no premium for many adults in your income range.' },
    { key: 'marketplace', upTo: Infinity, label: 'Marketplace', title: 'Compare plans with free help', line: 'You may qualify for savings. A free helper can check.' }
  ];
  const OPEN_ENROLLMENT_ENDS = '2027-01-31';
  const data = { URLS, RIGHTS, CHOOSERS, COVERAGE, POVERTY_BASE, POVERTY_PER_PERSON, OPEN_ENROLLMENT_ENDS };
  if (typeof module !== 'undefined') module.exports = data;
  if (typeof window !== 'undefined') window.STEADY_TOOLS = data;
})();
