import { applyLanguage, getCurrentLang, setCurrentLang } from "./language.js";
import { renderNavbar, renderFooter } from "./navigation.js";
import { fetchSiteSettings, initFirebase } from "./firebase-service.js";

initFirebase();

const activeFile = window.location.pathname.split("/").pop() || "index.html";
const headerSlot = document.getElementById("site-header-slot");
const footerSlot = document.getElementById("site-footer-slot");

if (headerSlot) headerSlot.innerHTML = renderNavbar(activeFile);
if (footerSlot) footerSlot.innerHTML = renderFooter();

const yearEl = document.getElementById("footer-year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

document.querySelectorAll("[data-lang-switch]").forEach((btn) => {
  btn.addEventListener("click", () => {
    setCurrentLang(btn.getAttribute("data-lang-switch"));
  });
});

applyLanguage(getCurrentLang());

const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealEls = document.querySelectorAll(".reveal-on-scroll");
if (prefersReduced || !("IntersectionObserver" in window)) {
  revealEls.forEach((el) => el.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );
  revealEls.forEach((el) => observer.observe(el));
}

fetchSiteSettings().then((settings) => {
  if (!settings) return;
  const lang = getCurrentLang();
  const announcementText = lang === "bn" ? settings.announcementBn : settings.announcementEn;
  const bar = document.getElementById("announcement-bar");
  const textEl = document.getElementById("announcement-text");
  if (settings.announcementActive && announcementText && bar && textEl) {
    textEl.textContent = announcementText;
    bar.hidden = false;
  }
  const dismissBtn = document.getElementById("dismiss-announcement");
  if (dismissBtn && bar) {
    dismissBtn.addEventListener("click", () => {
      bar.hidden = true;
    });
  }
  const addrEl = document.getElementById("footer-address");
  const contactEl = document.getElementById("footer-contact");
  if (addrEl && settings.address) addrEl.textContent = settings.address;
  if (contactEl && (settings.email || settings.phone)) {
    contactEl.textContent = [settings.email, settings.phone].filter(Boolean).join(" • ");
  }
});
