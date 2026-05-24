/**
 * SoloForge — GSAP & interaction animations
 */
(function () {
  "use strict";

  if (typeof gsap === "undefined") return;

  if (typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* Hero entrance */
  const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
  heroTl
    .from(".hero-badge", { opacity: 0, y: 20, duration: 0.6 })
    .from(".hero-title .line", { opacity: 0, y: 40, stagger: 0.15, duration: 0.8 }, "-=0.3")
    .from(".hero-lead", { opacity: 0, y: 24, duration: 0.7 }, "-=0.4")
    .from(".hero-cta .btn", { opacity: 0, y: 20, stagger: 0.1, duration: 0.6 }, "-=0.35")
    .from(".hero-stat", { opacity: 0, scale: 0.9, stagger: 0.08, duration: 0.5 }, "-=0.3")
    .from(".hero-visual-wrap", { opacity: 0, x: 40, duration: 1 }, "-=0.8");

  /* Parallax sections */
  document.querySelectorAll("[data-parallax]").forEach((el) => {
    gsap.to(el, {
      yPercent: -12,
      ease: "none",
      scrollTrigger: {
        trigger: el.parentElement || el,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.2,
      },
    });
  });

  /* Section headings */
  gsap.utils.toArray(".section-header").forEach((header) => {
    gsap.from(header.children, {
      opacity: 0,
      y: 36,
      stagger: 0.12,
      duration: 0.85,
      ease: "power2.out",
      scrollTrigger: {
        trigger: header,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });
  });

  /* Image reveal masks */
  document.querySelectorAll(".img-reveal").forEach((block) => {
    ScrollTrigger.create({
      trigger: block,
      start: "top 82%",
      onEnter: () => block.classList.add("revealed"),
      once: true,
    });
  });

  /* Stagger grid children */
  document.querySelectorAll(".stagger-children").forEach((grid) => {
    ScrollTrigger.create({
      trigger: grid,
      start: "top 80%",
      onEnter: () => grid.classList.add("is-visible"),
      once: true,
    });
  });

  /* Reveal text blocks */
  document.querySelectorAll(".reveal-text").forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      onEnter: () => el.classList.add("is-visible"),
      once: true,
    });
  });

  /* Stat bars */
  document.querySelectorAll(".stat-bar-fill").forEach((bar) => {
    ScrollTrigger.create({
      trigger: bar,
      start: "top 90%",
      onEnter: () => bar.classList.add("animated"),
      once: true,
    });
  });

  /* Cards subtle rise */
  gsap.utils.toArray(".card-sf, .team-card, .testimonial-card-photo").forEach((card, i) => {
    gsap.from(card, {
      opacity: 0,
      y: 50,
      duration: 0.7,
      delay: (i % 4) * 0.05,
      ease: "power2.out",
      scrollTrigger: {
        trigger: card,
        start: "top 92%",
        toggleActions: "play none none none",
      },
    });
  });

  /* 3D tilt on cards */
  document.querySelectorAll(".tilt-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(card, {
        rotateY: x * 10,
        rotateX: -y * 10,
        transformPerspective: 800,
        duration: 0.4,
        ease: "power2.out",
      });
    });
    card.addEventListener("mouseleave", () => {
      gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });
    });
  });

  /* Magnetic buttons */
  document.querySelectorAll(".btn-magnetic").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, { x: x * 0.2, y: y * 0.25, duration: 0.3 });
    });
    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" });
    });
  });

  /* Counter + hero stats already in main.js */
})();
