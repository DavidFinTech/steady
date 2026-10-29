(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion || !("IntersectionObserver" in window)) return;

  document.documentElement.classList.add("scroll-effects-ready");
  const targets = document.querySelectorAll(
    ".intro, .jump-grid > a, .section-heading, .calculator, .method, .callout, .cards article, .local-note, .help-band, .faq details, .account-panel, .source-note"
  );
  targets.forEach((element, index) => {
    element.classList.add("scroll-reveal");
    if (element.matches(".jump-grid > a, .cards article")) {
      element.style.setProperty("--reveal-delay", (index % 3) * 75 + "ms");
    }
  });

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  targets.forEach(element => observer.observe(element));
})();