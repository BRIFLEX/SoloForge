/**
 * SoloForge LLC — Consulting-firm layout (Andersen / Software Mind style)
 */
window.SiteLayout = (function () {
  const IMG = "./assets/images/";
  const FALLBACK = IMG + "fallback.svg";

  const navItems = [
    { href: "index.html", label: "Home", id: "index" },
    {
      label: "Services",
      id: "services",
      dropdown: [
        { href: "services.html", label: "All Services" },
        { href: "service-ai-data.html", label: "AI & Data" },
        { href: "service-cloud.html", label: "Cloud Development" },
        { href: "service-engineering.html", label: "Software Engineering" },
        { href: "service-legacy.html", label: "Legacy Modernization" },
        { href: "service-staff.html", label: "Staff Augmentation" },
      ],
    },
    {
      label: "Industries",
      id: "industries",
      dropdown: [
        { href: "industry-finance.html", label: "Finance & FinTech" },
        { href: "industry-healthcare.html", label: "Healthcare" },
        { href: "industry-logistics.html", label: "Logistics" },
        { href: "industry-ecommerce.html", label: "eCommerce" },
        { href: "industry-energy.html", label: "Energy" },
        { href: "industry-edtech.html", label: "EdTech" },
      ],
    },
    { href: "portfolio.html", label: "Case Studies", id: "portfolio" },
    {
      label: "Company",
      id: "company",
      dropdown: [
        { href: "about.html", label: "About Us" },
        { href: "how-we-work.html", label: "How We Work" },
        { href: "careers.html", label: "Careers" },
        { href: "insights.html", label: "Insights" },
        { href: "events.html", label: "Events" },
      ],
    },
    { href: "contact.html", label: "Contact", id: "contact" },
  ];

  const servicePages = [
    { href: "service-ai-data.html", label: "AI & Data" },
    { href: "service-cloud.html", label: "Cloud Development" },
    { href: "service-engineering.html", label: "Software Engineering" },
    { href: "service-legacy.html", label: "Legacy Modernization" },
    { href: "service-staff.html", label: "Staff Augmentation" },
  ];

  const industryPages = [
    { href: "industry-finance.html", label: "Finance & FinTech" },
    { href: "industry-healthcare.html", label: "Healthcare" },
    { href: "industry-logistics.html", label: "Logistics" },
    { href: "industry-ecommerce.html", label: "eCommerce" },
    { href: "industry-energy.html", label: "Energy" },
    { href: "industry-edtech.html", label: "EdTech" },
  ];

  function img(file) {
    return IMG + file;
  }

  function isActive(item, activePage) {
    if (item.id === activePage) return true;
    if (item.dropdown) {
      return item.dropdown.some((d) => d.href.replace(".html", "") === activePage.replace(".html", "") || activePage.startsWith(item.id));
    }
    return false;
  }

  function renderNavLink(item, activePage) {
    if (item.dropdown) {
      const active = isActive(item, activePage);
      const items = item.dropdown
        .map((d) => `<li><a class="dropdown-item" href="${d.href}">${d.label}</a></li>`)
        .join("");
      return `
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle${active ? " active" : ""}" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">${item.label}</a>
          <ul class="dropdown-menu">${items}</ul>
        </li>`;
    }
    return `<li class="nav-item"><a class="nav-link${item.id === activePage ? " active" : ""}" href="${item.href}">${item.label}</a></li>`;
  }

  function logoBrand() {
    return `
      <span class="navbar-brand-lockup">
        <img src="${img("logo.png")}?v=18" alt="" class="navbar-brand-mark-img" height="42" onerror="this.onerror=null;this.src='${img("logo-icon.svg")}?v=18'">
        <span class="navbar-brand-name">SoloForge</span>
      </span>`;
  }

  function logoFooter() {
    return `
      <a href="index.html" class="footer-brand-lockup" aria-label="SoloForge">
        <img src="${img("logo.png")}?v=18" alt="" class="footer-brand-mark-img" height="44" onerror="this.onerror=null;this.src='${img("logo-icon.svg")}?v=18'">
        <span class="footer-brand-name">SoloForge</span>
      </a>`;
  }

  function renderNav(activePage) {
    const links = navItems.map((n) => renderNavLink(n, activePage)).join("");
    return `
    <nav class="navbar navbar-expand-lg navbar-consult fixed-top">
      <div class="container">
        <a class="navbar-brand" href="index.html" aria-label="SoloForge">
          ${logoBrand()}
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-label="Menu">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="mainNav">
          <ul class="navbar-nav navbar-nav-main">${links}</ul>
          <div class="navbar-actions ms-lg-3">
            <a href="signin.html" class="nav-link navbar-portal-link d-none d-lg-inline-flex">Client Portal</a>
            <a class="btn btn-nav" href="contact.html">Free IT Consultation</a>
          </div>
        </div>
      </div>
    </nav>`;
  }

  function renderFooter() {
    const serviceLinks = servicePages.map((s) => `<a href="${s.href}">${s.label}</a>`).join("");
    const industryLinks = industryPages.map((i) => `<a href="${i.href}">${i.label}</a>`).join("");
    return `
    <footer class="footer-consult">
      <div class="container">
        <div class="row g-4">
          <div class="col-lg-3 footer-brand">
            ${logoFooter()}
            <p>SoloForge is a software development company delivering custom engineering, cloud, AI, and mobile solutions for enterprises worldwide.</p>
          </div>
          <div class="col-6 col-lg-2">
            <h5>Services</h5>
            ${serviceLinks}
          </div>
          <div class="col-6 col-lg-2">
            <h5>Industries</h5>
            ${industryLinks}
          </div>
          <div class="col-6 col-lg-2">
            <h5>Company</h5>
            <a href="about.html">About Us</a>
            <a href="how-we-work.html">How We Work</a>
            <a href="careers.html">Careers</a>
            <a href="insights.html">Insights</a>
            <a href="events.html">Events</a>
            <a href="terms.html">Terms & Privacy</a>
          </div>
          <div class="col-lg-3">
            <h5>Contact</h5>
            <p class="footer-contact-line mb-1"><i class="fa-solid fa-envelope" aria-hidden="true"></i><a href="mailto:contact@soloforge.net">contact@soloforge.net</a></p>
            <p class="footer-contact-line mb-1"><i class="fa-solid fa-phone" aria-hidden="true"></i><a href="tel:+18126182969">+1 (812) 618-2969</a></p>
            <p class="footer-contact-line mb-0"><i class="fa-solid fa-location-dot" aria-hidden="true"></i><span>1330 York Street, Denver, CO 80206</span></p>
          </div>
        </div>
        <div class="footer-consult-bottom d-flex flex-wrap justify-content-between gap-2">
          <span>&copy; <span id="year"></span> SoloForge. All rights reserved.</span>
          <span><a href="terms.html" class="d-inline">Privacy Policy</a> · <a href="terms.html" class="d-inline">Terms</a></span>
        </div>
      </div>
    </footer>`;
  }

  function renderServiceSidebar(activeHref) {
    return servicePages
      .map((s) => `<a href="${s.href}" class="${s.href === activeHref ? "active" : ""}">${s.label}</a>`)
      .join("");
  }

  function renderIndustrySidebar(activeHref) {
    return industryPages
      .map((i) => `<a href="${i.href}" class="${i.href === activeHref ? "active" : ""}">${i.label}</a>`)
      .join("");
  }

  function bindImageFallbacks() {
    document.querySelectorAll("img[data-sf-src]").forEach((el) => {
      const file = el.getAttribute("data-sf-src");
      if (file && !el.getAttribute("src")) el.src = img(file);
      el.onerror = function () {
        if (this.src.indexOf("fallback.svg") === -1) this.src = FALLBACK;
      };
    });
  }

  function init(activePage) {
    bindImageFallbacks();
    const navEl = document.getElementById("site-nav");
    const footerEl = document.getElementById("site-footer");
    if (navEl) navEl.innerHTML = renderNav(activePage);
    if (footerEl) footerEl.innerHTML = renderFooter();

    const sidebarEl = document.getElementById("service-sidebar");
    if (sidebarEl) sidebarEl.innerHTML = renderServiceSidebar(document.body.dataset.sidebar || "");

    const industrySidebarEl = document.getElementById("industry-sidebar");
    if (industrySidebarEl) industrySidebarEl.innerHTML = renderIndustrySidebar(document.body.dataset.sidebar || "");

    bindImageFallbacks();
  }

  return { init, img, renderServiceSidebar, renderIndustrySidebar };
})();
