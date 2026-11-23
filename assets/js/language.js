const STORAGE_KEY = "nf_lang";

export const dictionary = {
  en: {
    brandName: "Nirbhorota Foundation",
    brandTagline: "Community support, dignity, and sustainable local action.",
    navHome: "Home",
    navAbout: "About Us",
    navProjects: "Projects",
    navImpact: "Impact",
    navStories: "Stories",
    navGallery: "Gallery",
    navVideos: "Videos",
    navInvolved: "Get Involved",
    navDonate: "Donate",
    navContact: "Contact",
    navFaq: "FAQ",
    heroTitle: "Practical support that strengthens families and local communities.",
    heroSubtitle:
      "Nirbhorota Foundation works alongside communities with care, transparency, and long-term commitment to education, health, and resilience.",
    ctaPrimary: "Explore Our Work",
    ctaSecondary: "Get Involved",
    ctaDonate: "Support Our Work",
    missionTitle: "Our Mission",
    missionBody:
      "To stand beside underserved individuals and families with respectful, accountable community initiatives rooted in local need.",
    visionTitle: "Our Vision",
    visionBody:
      "Resilient, self-reliant communities where every person has access to essential care, learning, and opportunity.",
    searchPlaceholder: "Search projects...",
    allCategories: "All Categories",
    allStatuses: "All Statuses",
    statusOngoing: "Ongoing",
    statusCompleted: "Completed",
    statusUpcoming: "Upcoming",
    formSuccess: "Thank you. Your submission has been received.",
    formError: "Please check your entries and try again.",
    privacyLink: "Privacy Policy",
    termsLink: "Terms & Conditions",
    adminLink: "Admin Portal"
  },
  bn: {
    brandName: "নির্ভরতা ফাউন্ডেশন",
    brandTagline: "মানবিক সহায়তা, মর্যাদা এবং টেকসই স্থানীয় উদ্যোগ।",
    navHome: "হোম",
    navAbout: "আমাদের সম্পর্কে",
    navProjects: "প্রকল্পসমূহ",
    navImpact: "প্রভাব",
    navStories: "গল্প ও সংবাদ",
    navGallery: "গ্যালারি",
    navVideos: "ভিডিও",
    navInvolved: "যুক্ত হোন",
    navDonate: "সহায়তা করুন",
    navContact: "যোগাযোগ",
    navFaq: "সাধারণ জিজ্ঞাসা",
    heroTitle: "পরিবার ও স্থানীয় জনগোষ্ঠীকে শক্তিশালী করার বাস্তবসম্মত সহায়তা।",
    heroSubtitle:
      "শিক্ষা, স্বাস্থ্য ও স্থিতিস্থাপকতায় স্বচ্ছতা ও দীর্ঘমেয়াদি অঙ্গীকার নিয়ে নির্ভরতা ফাউন্ডেশন মানুষের পাশে কাজ করে।",
    ctaPrimary: "কার্যক্রম দেখুন",
    ctaSecondary: "যুক্ত হোন",
    ctaDonate: "সহায়তা পাঠান",
    missionTitle: "আমাদের লক্ষ্য",
    missionBody:
      "স্থানীয় চাহিদার ভিত্তিতে দায়বদ্ধ ও সম্মানজনক সামাজিক উদ্যোগের মাধ্যমে পিছিয়ে পড়া মানুষ ও পরিবারের পাশে দাঁড়ানো।",
    visionTitle: "আমাদের রূপকল্প",
    visionBody:
      "এমন স্বাবলম্বী ও সহনশীল জনগোষ্ঠী গড়ে তোলা, যেখানে প্রত্যেকের মৌলিক সেবা, শিক্ষা ও এগিয়ে যাওয়ার সুযোগ থাকে।",
    searchPlaceholder: "প্রকল্প খুঁজুন...",
    allCategories: "সব বিভাগ",
    allStatuses: "সব অবস্থা",
    statusOngoing: "চলমান",
    statusCompleted: "সম্পন্ন",
    statusUpcoming: "আসন্ন",
    formSuccess: "ধন্যবাদ। আপনার তথ্য সফলভাবে পাঠানো হয়েছে।",
    formError: "অনুগ্রহ করে তথ্যগুলো যাচাই করে আবার চেষ্টা করুন।",
    privacyLink: "গোপনীয়তা নীতি",
    termsLink: "শর্তাবলি",
    adminLink: "অ্যাডমিন পোর্টাল"
  }
};

export function getCurrentLang() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved === "bn" ? "bn" : "en";
}

export function setCurrentLang(lang) {
  const normalized = lang === "bn" ? "bn" : "en";
  localStorage.setItem(STORAGE_KEY, normalized);
  applyLanguage(normalized);
  window.dispatchEvent(new CustomEvent("nf:languagechange", { detail: { lang: normalized } }));
}

export function t(key, lang = getCurrentLang()) {
  return dictionary[lang]?.[key] ?? dictionary.en[key] ?? key;
}

export function applyLanguage(lang = getCurrentLang()) {
  document.documentElement.lang = lang;
  document.body.setAttribute("lang", lang);

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    el.textContent = t(key, lang);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    el.setAttribute("placeholder", t(key, lang));
  });

  document.querySelectorAll("[data-lang-switch]").forEach((btn) => {
    const targetLang = btn.getAttribute("data-lang-switch");
    btn.classList.toggle("active", targetLang === lang);
    btn.setAttribute("aria-pressed", String(targetLang === lang));
  });
}
