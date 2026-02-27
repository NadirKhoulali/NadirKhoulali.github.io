// ============================================================
// main.js — Theme toggle, Language switch, Scroll animations,
//           Navbar behavior, Copy-to-clipboard, Mobile menu
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initLanguage();
  initScrollAnimations();
  initNavbar();
  initMobileMenu();
  initCopyButtons();
  initTypingEffect();
  initSkillBars();
});

// ─── THEME TOGGLE (Dark / Light) ─────────────────────────────
function initTheme() {
  const toggle = document.getElementById("theme-toggle");
  const html = document.documentElement;

  // Load saved preference or default to dark
  const saved = localStorage.getItem("theme");
  if (saved === "light") {
    html.classList.remove("dark");
  } else {
    html.classList.add("dark");
  }
  updateThemeIcon();

  toggle?.addEventListener("click", () => {
    html.classList.toggle("dark");
    const isDark = html.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    updateThemeIcon();
  });
}

function updateThemeIcon() {
  const isDark = document.documentElement.classList.contains("dark");
  const icon = document.querySelector("#theme-toggle i");
  if (!icon) return;
  icon.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
}

// ─── LANGUAGE TOGGLE (EN / NL) ──────────────────────────────
let currentLang = "en";

function initLanguage() {
  const toggle = document.getElementById("lang-toggle");
  const saved = localStorage.getItem("lang");
  currentLang = saved || "en";
  applyTranslations();
  updateLangButton();

  toggle?.addEventListener("click", () => {
    currentLang = currentLang === "en" ? "nl" : "en";
    localStorage.setItem("lang", currentLang);
    applyTranslations();
    updateLangButton();
  });
}

function applyTranslations() {
  const t = translations[currentLang];
  if (!t) return;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (t[key] !== undefined) {
      // Handle elements with inner HTML (icons etc.)
      if (el.hasAttribute("data-i18n-html")) {
        el.innerHTML = t[key];
      } else {
        el.textContent = t[key];
      }
    }
  });
}

function updateLangButton() {
  const btn = document.getElementById("lang-toggle");
  if (!btn) return;
  btn.textContent = currentLang === "en" ? "NL" : "EN";
}

// ─── SCROLL ANIMATIONS ──────────────────────────────────────
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
          // Stagger children if it's a grid/container
          const children = entry.target.querySelectorAll("[data-animate-child]");
          children.forEach((child, i) => {
            child.style.transitionDelay = `${i * 100}ms`;
            child.classList.add("animate-in");
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
  );

  document.querySelectorAll("[data-animate]").forEach((el) => {
    observer.observe(el);
  });
}

// ─── NAVBAR SCROLL BEHAVIOR ─────────────────────────────────
function initNavbar() {
  const nav = document.getElementById("navbar");
  if (!nav) return;

  let lastScroll = 0;
  window.addEventListener("scroll", () => {
    const currentScroll = window.scrollY;

    // Add background blur when scrolled
    if (currentScroll > 50) {
      nav.classList.add("nav-scrolled");
    } else {
      nav.classList.remove("nav-scrolled");
    }

    // Active section highlighting
    updateActiveNav();

    lastScroll = currentScroll;
  });
}

function updateActiveNav() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active-nav");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active-nav");
    }
  });
}

// ─── MOBILE MENU ────────────────────────────────────────────
function initMobileMenu() {
  const btn = document.getElementById("mobile-menu-btn");
  const menu = document.getElementById("mobile-menu");
  if (!btn || !menu) return;

  btn.addEventListener("click", () => {
    menu.classList.toggle("hidden");
    const icon = btn.querySelector("i");
    if (menu.classList.contains("hidden")) {
      icon.className = "fa-solid fa-bars";
    } else {
      icon.className = "fa-solid fa-xmark";
    }
  });

  // Close menu on link click
  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.add("hidden");
      btn.querySelector("i").className = "fa-solid fa-bars";
    });
  });
}

// ─── COPY TO CLIPBOARD ──────────────────────────────────────
function initCopyButtons() {
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const text = btn.getAttribute("data-copy");
      navigator.clipboard.writeText(text).then(() => {
        const original = btn.innerHTML;
        const copiedText =
          currentLang === "nl" ? "Gekopieerd!" : "Copied!";
        btn.innerHTML = `<i class="fa-solid fa-check"></i> ${copiedText}`;
        btn.classList.add("text-green-400");
        setTimeout(() => {
          btn.innerHTML = original;
          btn.classList.remove("text-green-400");
        }, 2000);
      });
    });
  });
}

// ─── TYPING EFFECT ──────────────────────────────────────────
function initTypingEffect() {
  const el = document.getElementById("typing-text");
  if (!el) return;

  const roles = [
    "Software Developer Student",
    "Web Developer",
    "Problem Solver",
    "Code Enthusiast",
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const current = roles[roleIndex];

    if (isDeleting) {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === current.length) {
      typingSpeed = 2000; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500; // Pause before next word
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

// ─── SKILL BARS ANIMATION ───────────────────────────────────
function initSkillBars() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target.querySelector(".skill-fill");
          if (bar) {
            const width = bar.getAttribute("data-width");
            bar.style.width = width;
          }
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll(".skill-bar-container").forEach((el) => {
    observer.observe(el);
  });
}

// ─── SMOOTH SCROLL (offset for fixed nav) ───────────────────
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  });
});
