/**
 * SoloForge LLC — Core interactions
 */
(function () {
  "use strict";

  const page = document.body.dataset.page || "";
  if (typeof SiteLayout !== "undefined") SiteLayout.init(page);

  const FALLBACK = "./assets/images/fallback.svg";
  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", function () {
      if (this.dataset.fallbackApplied) return;
      this.dataset.fallbackApplied = "1";
      this.src = FALLBACK;
    });
  });

  const navbar = document.querySelector(".navbar-consult, .navbar-sf");
  if (navbar) {
    window.addEventListener("scroll", () => {
      navbar.classList.toggle("scrolled", window.scrollY > 20);
      navbar.style.boxShadow = window.scrollY > 20 ? "0 2px 20px rgba(0,0,0,0.08)" : "none";
    }, { passive: true });
  }

  document.querySelectorAll(".navbar .nav-link, .dropdown-item").forEach((link) => {
    link.addEventListener("click", () => {
      const c = document.querySelector(".navbar-collapse.show");
      if (c && typeof bootstrap !== "undefined") bootstrap.Collapse.getInstance(c)?.hide();
    });
  });

  if (document.querySelector(".testimonial-swiper") && typeof Swiper !== "undefined") {
    new Swiper(".testimonial-swiper", {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      autoplay: { delay: 6000 },
      pagination: { el: ".swiper-pagination", clickable: true },
      breakpoints: { 768: { slidesPerView: 2 }, 1200: { slidesPerView: 3 } },
    });
  }

  document.querySelectorAll("[data-count]").forEach((el) => {
    if (typeof countUp === "undefined") return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const end = parseFloat(el.dataset.count) || 0;
        new countUp.CountUp(el, end, {
          duration: 2.2,
          suffix: el.dataset.suffix || "",
          decimalPlaces: (String(end).split(".")[1] || "").length,
        }).start();
        obs.unobserve(el);
      });
    }, { threshold: 0.3 });
    obs.observe(el);
  });

  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const orig = btn.innerHTML;
      btn.disabled = true;
      btn.textContent = "Submitted — we will contact you soon";
      form.reset();
      setTimeout(() => { btn.disabled = false; btn.innerHTML = orig; }, 3000);
    });
  }

  ["signinForm", "signupForm"].forEach((id) => {
    const f = document.getElementById(id);
    if (f) f.addEventListener("submit", (e) => { e.preventDefault(); alert("Connect authentication backend for SoloForge client portal."); });
  });

  document.querySelectorAll("[data-sso]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const provider = btn.dataset.sso;
      const label = provider === "google" ? "Google" : "Microsoft";
      alert(`SSO with ${label} — connect your OAuth / SAML identity provider for SoloForge.`);
    });
  });

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
