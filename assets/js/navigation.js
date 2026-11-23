export function renderNavbar(activePath = "") {
  const links = [
    { href: "index.html", key: "navHome" },
    { href: "about.html", key: "navAbout" },
    { href: "projects.html", key: "navProjects" },
    { href: "impact.html", key: "navImpact" },
    { href: "stories.html", key: "navStories" },
    { href: "gallery.html", key: "navGallery" },
    { href: "videos.html", key: "navVideos" },
    { href: "get-involved.html", key: "navInvolved" },
    { href: "contact.html", key: "navContact" },
    { href: "faq.html", key: "navFaq" }
  ];

  const navItems = links
    .map(
      (item) => `
      <li class="nav-item">
        <a class="nav-link ${activePath === item.href ? "active" : ""}" href="${item.href}" data-i18n="${item.key}"></a>
      </li>`
    )
    .join("");

  return `
  <div class="announcement-bar" id="announcement-bar" hidden>
    <div class="container d-flex justify-content-between align-items-center gap-2">
      <span id="announcement-text"></span>
      <button type="button" class="btn btn-sm btn-link text-light p-0" id="dismiss-announcement" aria-label="Dismiss announcement">
        <i class="bi bi-x-lg"></i>
      </button>
    </div>
  </div>
  <header class="site-header">
    <nav class="navbar navbar-expand-xl py-2" aria-label="Primary Navigation">
      <div class="container">
        <a class="brand-mark" href="index.html">
          <span class="brand-mark-badge" aria-hidden="true">NF</span>
          <span data-i18n="brandName">Nirbhorota Foundation</span>
        </a>

        <div class="d-flex align-items-center gap-2 order-xl-3">
          <div class="btn-group btn-group-sm" role="group" aria-label="Language Switcher">
            <button type="button" class="btn btn-outline-secondary" data-lang-switch="en">EN</button>
            <button type="button" class="btn btn-outline-secondary" data-lang-switch="bn">বাং</button>
          </div>
          <a href="donate.html" class="btn btn-nf-accent btn-sm d-none d-sm-inline-flex" data-i18n="ctaDonate">Support Our Work</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nfNavbar" aria-controls="nfNavbar" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
        </div>

        <div class="collapse navbar-collapse order-xl-2" id="nfNavbar">
          <ul class="navbar-nav mx-auto mb-2 mb-xl-0">
            ${navItems}
          </ul>
        </div>
      </div>
    </nav>
  </header>`;
}

export function renderFooter() {
  return `
  <footer class="site-footer">
    <div class="container">
      <div class="row g-4 pb-4 border-bottom border-secondary border-opacity-25">
        <div class="col-lg-5">
          <h3 class="h5 text-white mb-2" data-i18n="brandName">Nirbhorota Foundation</h3>
          <p class="small mb-3" data-i18n="brandTagline">Community support, dignity, and sustainable local action.</p>
          <p class="small mb-1" id="footer-address">[Editable Address — Configure in Admin Settings]</p>
          <p class="small mb-0" id="footer-contact">[Editable Email &amp; Phone — Configure in Admin Settings]</p>
        </div>
        <div class="col-6 col-lg-3">
          <h4 class="h6 text-white mb-3">Organization</h4>
          <ul class="list-unstyled small d-flex flex-column gap-2 mb-0">
            <li><a href="about.html" data-i18n="navAbout">About Us</a></li>
            <li><a href="projects.html" data-i18n="navProjects">Projects</a></li>
            <li><a href="volunteer.html">Volunteer Registration</a></li>
            <li><a href="donate.html" data-i18n="navDonate">Donate</a></li>
          </ul>
        </div>
        <div class="col-6 col-lg-4">
          <h4 class="h6 text-white mb-3">Governance &amp; Access</h4>
          <ul class="list-unstyled small d-flex flex-column gap-2 mb-0">
            <li><a href="privacy.html" data-i18n="privacyLink">Privacy Policy</a></li>
            <li><a href="terms.html" data-i18n="termsLink">Terms &amp; Conditions</a></li>
            <li><a href="faq.html" data-i18n="navFaq">FAQ</a></li>
            <li><a href="admin/login.html" data-i18n="adminLink">Admin Portal</a></li>
          </ul>
        </div>
      </div>
      <div class="pt-3 d-flex flex-column flex-sm-row justify-content-between align-items-center small text-white-50 gap-2">
        <span>&copy; <span id="footer-year">2026</span> Nirbhorota Foundation. All rights reserved.</span>
        <span>Editorial &amp; Community Portal</span>
      </div>
    </div>
  </footer>`;
}
