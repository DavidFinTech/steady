# Steady: proposed NYC client pilot

Status: student-built prototype. No Accenture affiliation, commissioned client, research results or production readiness is claimed.

## Proposed client and users
A nonprofit serving NYC independent workers (partner to be confirmed). Start with freelancers navigating variable income, coverage questions and unpaid work. The product guides visitors to resources; it does not determine eligibility, give personalized advice, submit applications or process payments.

## Delivered experience
- Account-free guided flow: select one of four needs and NYC or elsewhere in the US.
- Three-action checklist with location-appropriate referrals and in-session completion state.
- English/Spanish guided flow and print-to-PDF through the browser.
- Existing tax and weekly planning tools remain available.
- Removed disconnected account form and unnecessary authentication CDN from the homepage. Original account implementation remains in the repository for future work.
- No new tracking, account collection, financial storage or external integration.

## Proposed six-week pilot (not completed)
1. Weeks 1–2: confirm partner, interview 5–8 workers, inventory resources and review accessibility.
2. Weeks 3–4: validate guided flows with the partner and review calculator scope and assumptions.
3. Week 5: observe task completion in usability sessions; fix demonstrated problems.
4. Week 6: report results and decide whether to extend the pilot.

## Measures to agree before testing
- Primary: proportion of participants who can find an appropriate resource and explain their next action without help.
- Secondary: median completion time, confusing wording, broken referrals, keyboard completion and mobile usability.
- Suggested pilot target: at least 80% unassisted completion; this is a proposal, not a result or statistically established benchmark.
- Compare equivalent tasks using the previous directory and new flow; alternate task order to reduce learning effects.
- Checklist ticks and referral clicks are NOT evidence of receiving services or benefits.
- Collect observations with consent. No automatic analytics is implemented.

## Team ownership to assign
- Product/research: client goals, interview protocol and acceptance criteria.
- Design/accessibility: language, mobile, keyboard and screen-reader checks.
- Engineering: implementation, review, release and rollback.
- Content: provider verification, change log and monthly resource checks.
- QA/delivery: test scenarios, issue triage and pilot report.

## Release gates and open issues
- Confirm current official resource destinations, program wording and geographic coverage with the content owner. Automated web verification was unavailable during this change; no fresh verification date is claimed.
- Tax assumptions and existing financial/legal copy require qualified review before real-world launch. Calculator formulas were not changed in this work.
- Review the full site's existing Spanish translations with a fluent reviewer. The new guided flow has bilingual strings; this is not a certification of complete site localization.
- Complete screen-reader and target-device tests. Browser smoke tests are not a full accessibility audit.
- Confirm a named operating partner, support/escalation process and content maintenance budget.
- Estimate costs from engineering hours, content review hours, testing, hosting and ongoing monthly maintenance. No unsupported dollar estimate or ROI is asserted.
- Authenticate and store profiles only if validated user needs justify them and a real backend is designed. No credentials should be collected by an inactive form.

## Validation
Run `node support-navigator.test.cjs` and `node tax-calculator.test.cjs`.
Smoke-test all four choices and both locations, checklist changes, reset, language switching, printing and mobile layout.
The existing tax suite exercises tax-calculator.js; the homepage uses resource-tax-calculator.js. Passing the existing suite does not certify the homepage's tax accuracy.
