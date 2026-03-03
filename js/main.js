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
  initSkillModal();
  initProjectModal();
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

  const roles = {
    en: [
      "Software Developer Student",
      "Web Developer",
      "Looking for an Internship",
      "Problem Solver",
      "Code Enthusiast",
    ],
    nl: [
      "Software Developer Student",
      "Webontwikkelaar",
      "Op zoek naar een Stage",
      "Probleemoplosser",
      "Code Enthousiasteling",
    ],
  };
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentRoles = roles[currentLang] || roles.en;
    const current = currentRoles[roleIndex % currentRoles.length];

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
      roleIndex = (roleIndex + 1) % (roles[currentLang] || roles.en).length;
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

// ─── SKILL MODAL ────────────────────────────────────────────
const skillDetails = {
  html: {
    icon: '<img src="./img/html-logo.png" alt="HTML" class="w-10 h-10 object-contain">',
    name: "HTML5",
    level: { en: "Intermediate / Advanced", nl: "Gemiddeld / Gevorderd" },
    levelClass: "skill-level-advanced",
    desc: {
      en: "One of the first languages I learned in school. HTML gave me a solid foundation in understanding web structure and logic, and led to building multiple projects from scratch.",
      nl: "Een van de eerste talen die ik op school heb geleerd. HTML gaf me een solide basis in het begrijpen van webstructuur en logica, en leidde tot het bouwen van meerdere projecten vanaf nul.",
    },
  },
  css: {
    icon: '<img src="./img/css-logo.png" alt="CSS" class="w-10 h-10 object-contain">',
    name: "CSS3",
    level: { en: "Intermediate / Advanced", nl: "Gemiddeld / Gevorderd" },
    levelClass: "skill-level-advanced",
    desc: {
      en: "Learned alongside HTML — the foundation for all my web design work. I use CSS to create responsive layouts, animations, and visually appealing interfaces.",
      nl: "Samen met HTML geleerd — de basis voor al mijn webdesign werk. Ik gebruik CSS voor responsive layouts, animaties en visueel aantrekkelijke interfaces.",
    },
  },
  javascript: {
    icon: '<img src="./img/js-logo.png" alt="JavaScript" class="w-10 h-10 object-contain">',
    name: "JavaScript",
    level: { en: "Beginner / Intermediate", nl: "Basis / Gemiddeld" },
    levelClass: "skill-level-intermediate",
    desc: {
      en: "My first scripting language, used across multiple school projects. JavaScript brought my web pages to life with interactivity and dynamic functionality.",
      nl: "Mijn eerste scripttaal, gebruikt in meerdere schoolprojecten. JavaScript bracht mijn webpagina's tot leven met interactiviteit en dynamische functionaliteit.",
    },
  },
  typescript: {
    icon: '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" alt="TypeScript" class="w-10 h-10 object-contain">',
    name: "TypeScript",
    level: { en: "Beginner", nl: "Beginner" },
    levelClass: "skill-level-beginner",
    desc: {
      en: "Started learning this school year through the Next.js framework. TypeScript adds type safety to JavaScript, which helps catch errors early and makes code more maintainable.",
      nl: "Dit schooljaar begonnen te leren via het Next.js framework. TypeScript voegt type-veiligheid toe aan JavaScript, wat helpt om fouten vroeg op te sporen en code beter onderhoudbaar maakt.",
    },
  },
  react: {
    icon: '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" alt="React" class="w-10 h-10 object-contain">',
    name: "React / Next.js",
    level: { en: "Beginner", nl: "Beginner" },
    levelClass: "skill-level-beginner",
    desc: {
      en: "Learned through the Next.js framework at school. Next.js provides much more structure, keeping projects organized and clean. Currently still learning and growing in this technology.",
      nl: "Geleerd via het Next.js framework op school. Next.js biedt veel meer structuur, waardoor projecten overzichtelijk en netjes blijven. Momenteel nog aan het leren en groeien in deze technologie.",
    },
  },
  tailwind: {
    icon: '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" alt="Tailwind CSS" class="w-10 h-10 object-contain">',
    name: "Tailwind CSS",
    level: { en: "Beginner", nl: "Beginner" },
    levelClass: "skill-level-beginner",
    desc: {
      en: "Used in my Next.js projects for utility-first styling. Tailwind makes it fast to build responsive, consistent UIs without writing custom CSS for everything.",
      nl: "Gebruikt in mijn Next.js projecten voor utility-first styling. Tailwind maakt het snel om responsive, consistente UIs te bouwen zonder overal custom CSS voor te schrijven.",
    },
  },
  php: {
    icon: '<img src="./img/php-1-logo-png-transparent.png" alt="PHP" class="w-10 h-10 object-contain">',
    name: "PHP",
    level: { en: "Intermediate (rusty)", nl: "Gemiddeld (roestig)" },
    levelClass: "skill-level-intermediate",
    desc: {
      en: "The first backend language I learned at school. I used PHP to connect MySQL databases and create master and detail pages using GET requests. A bit rusty since I haven't used it since last year.",
      nl: "De eerste backend taal die ik op school leerde. Ik gebruikte PHP om MySQL databases te verbinden en master- en detailpagina's aan te maken met GET requests. Een beetje roestig omdat ik het sinds vorig jaar niet meer heb aangeraakt.",
    },
  },
  mysql: {
    icon: '<img src="./img/mysql-icon.png" alt="MySQL" class="w-10 h-10 object-contain">',
    name: "MySQL",
    level: { en: "Intermediate", nl: "Gemiddeld" },
    levelClass: "skill-level-intermediate",
    desc: {
      en: "Database management used in multiple projects. Connected through PHP in earlier projects and through Prisma ORM in my more recent Next.js work.",
      nl: "Databasebeheer gebruikt in meerdere projecten. Verbonden via PHP in eerdere projecten en via Prisma ORM in mijn recentere Next.js werk.",
    },
  },
  prisma: {
    icon: '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/prisma/prisma-original.svg" alt="Prisma" class="w-10 h-10 object-contain dark:invert">',
    name: "Prisma ORM",
    level: { en: "Beginner", nl: "Beginner" },
    levelClass: "skill-level-beginner",
    desc: {
      en: "Used in the SDG Dashboard project with Next.js. Prisma provides a clean, type-safe way to interact with databases, making queries much easier to write and maintain.",
      nl: "Gebruikt in het SDG Dashboard project met Next.js. Prisma biedt een nette, type-veilige manier om met databases te werken, waardoor queries veel makkelijker te schrijven en onderhouden zijn.",
    },
  },
  java: {
    icon: '<img src="./img/java-logo.png" alt="Java" class="w-10 h-10 object-contain">',
    name: "Java",
    level: { en: "Beginner / Intermediate", nl: "Beginner / Gemiddeld" },
    levelClass: "skill-level-intermediate",
    desc: {
      en: "One of my favorite languages to code in. I wrote my personal Minecraft mod (BetterLeaderboards-MC) in Java. It's my go-to language when it comes to structure and reliability.",
      nl: "Een van mijn favoriete talen om in te schrijven. Ik heb mijn persoonlijke Minecraft mod (BetterLeaderboards-MC) in Java geschreven. Het is mijn go-to taal als het gaat om structuur en betrouwbaarheid.",
    },
  },
  symfony: {
    icon: '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/symfony/symfony-original.svg" alt="Symfony" class="w-10 h-10 object-contain dark:invert">',
    name: "Symfony",
    level: { en: "Beginner", nl: "Beginner" },
    levelClass: "skill-level-beginner",
    desc: {
      en: "A PHP framework I recently started learning. Symfony provides a structured way to build web applications with reusable components and best practices built in.",
      nl: "Een PHP framework dat ik onlangs ben begonnen te leren. Symfony biedt een gestructureerde manier om webapplicaties te bouwen met herbruikbare componenten en ingebouwde best practices.",
    },
  },
  git: {
    icon: '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg" alt="Git" class="w-10 h-10 object-contain">',
    name: "Git / GitHub",
    desc: {
      en: "Version control used across all my projects. I use Git for tracking changes, branching, and collaborating with classmates. GitHub is where I host and share my code.",
      nl: "Versiebeheer dat ik gebruik in al mijn projecten. Ik gebruik Git voor het bijhouden van wijzigingen, branching en samenwerking met klasgenoten. GitHub is waar ik mijn code host en deel.",
    },
  },
  agile: {
    icon: '<div class="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center"><i class="fa-solid fa-users text-blue-400"></i></div>',
    name: "Agile / Scrum",
    desc: {
      en: "Project methodology used at school. We work in sprints, do stand-ups, and use scrum boards to organize our tasks and track progress as a team.",
      nl: "Projectmethodiek die we op school gebruiken. We werken in sprints, doen stand-ups en gebruiken scrumborden om onze taken te organiseren en voortgang bij te houden als team.",
    },
  },
  linux: {
    icon: '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg" alt="Linux" class="w-10 h-10 object-contain">',
    name: "Linux",
    desc: {
      en: "Experience with Linux operating systems, terminal commands, and server management. Comfortable working in a command-line environment.",
      nl: "Ervaring met Linux besturingssystemen, terminal-commando's en serverbeheer. Comfortabel werken in een command-line omgeving.",
    },
  },
  ai: {
    icon: '<div class="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center"><i class="fa-solid fa-brain text-purple-400 text-lg"></i></div>',
    name: "AI / Prompt Engineering",
    desc: {
      en: "Skilled at leveraging AI tools effectively for coding assistance, problem-solving, and boosting productivity. Understanding how to write clear prompts to get the best results.",
      nl: "Bedreven in het effectief inzetten van AI-tools voor codeerhulp, probleemoplossing en het verhogen van productiviteit. Begrip van hoe je duidelijke prompts schrijft voor de beste resultaten.",
    },
  },
};

// ─── PROJECT MODAL ───────────────────────────────────────────
const projectDetails = {
  hogerlager: {
    gradient: "from-amber-900 to-orange-700",
    iconClass: "fa-solid fa-dice text-orange-300",
    name: "Hoger Lager",
    year: "2024",
    type: { en: "School Project", nl: "Schoolproject" },
    typeClass: "bg-neon-purple/20 text-neon-purple border border-neon-purple/30",
    status: { en: "Completed", nl: "Afgerond" },
    statusClass: "bg-green-500/20 text-green-400 border border-green-500/30",
    period: { en: "Period 1 — First Project", nl: "Periode 1 — Eerste Project" },
    desc: {
      en: "A classic higher-lower dice game where players guess whether the next dice roll will be higher or lower than the current one. This was my very first real programming project, built entirely from scratch with vanilla HTML, CSS, and JavaScript. It taught me the fundamentals of programming logic, DOM manipulation, and event handling.",
      nl: "Een klassiek hoger-lager dobbelspel waarbij spelers raden of de volgende worp hoger of lager zal zijn dan de huidige. Dit was mijn allereerste echte programmeerproject, volledig vanaf nul gebouwd met vanilla HTML, CSS en JavaScript. Het leerde me de basisprincipes van programmeerlogica, DOM-manipulatie en event handling.",
    },
    features: {
      en: ["Random dice roll generation", "Score tracking system", "Win/loss detection", "Clean UI with animations", "Responsive design"],
      nl: ["Willekeurige dobbelworp generatie", "Score bijhoud-systeem", "Win/verlies detectie", "Nette UI met animaties", "Responsive design"],
    },
    learned: {
      en: "This project gave me my first real taste of programming. I learned how to think logically, break down problems into smaller steps, and use JavaScript to make a webpage interactive. It was the starting point of my development journey.",
      nl: "Dit project gaf me mijn eerste echte kennismaking met programmeren. Ik leerde logisch denken, problemen opsplitsen in kleinere stappen, en JavaScript gebruiken om een webpagina interactief te maken. Het was het startpunt van mijn ontwikkelreis.",
    },
    tech: [
      { icon: "./img/html-logo.png", name: "HTML" },
      { icon: "./img/css-logo.png", name: "CSS" },
      { icon: "./img/js-logo.png", name: "JavaScript" },
    ],
    team: { en: "Solo", nl: "Solo" },
    duration: { en: "~8 weeks", nl: "~8 weken" },
    github: null,
  },
  whackamole: {
    gradient: "from-purple-900 to-fuchsia-700",
    iconClass: "fa-solid fa-gamepad text-fuchsia-300",
    name: "Whack a Mole",
    year: "2024",
    type: { en: "School Project", nl: "Schoolproject" },
    typeClass: "bg-neon-purple/20 text-neon-purple border border-neon-purple/30",
    status: { en: "Completed", nl: "Afgerond" },
    statusClass: "bg-green-500/20 text-green-400 border border-green-500/30",
    period: { en: "Period 2 — Game Development", nl: "Periode 2 — Game Development" },
    desc: {
      en: "A fun reaction-speed game where moles randomly pop up from holes and the player has to click them as fast as possible. Features score tracking, a countdown timer, and increasing difficulty as the game progresses. Built as my second school project to deepen my JavaScript skills.",
      nl: "Een leuk reactiesnelheidsspel waarbij mollen willekeurig uit gaten tevoorschijn komen en de speler ze zo snel mogelijk moet aanklikken. Met score-tracking, een afteltimer en toenemende moeilijkheid naarmate het spel vordert. Gebouwd als mijn tweede schoolproject om mijn JavaScript-vaardigheden te verdiepen.",
    },
    features: {
      en: ["Randomized mole appearances", "Countdown timer", "Increasing difficulty levels", "High score tracking", "Click accuracy detection", "Animated mole pop-ups"],
      nl: ["Willekeurige mol-verschijningen", "Afteltimer", "Toenemende moeilijkheidsgraden", "Highscore bijhouden", "Klik-nauwkeurigheid detectie", "Geanimeerde mol pop-ups"],
    },
    learned: {
      en: "This project taught me about timing functions (setInterval, setTimeout), random number generation, and how to create engaging user interactions. I also learned about game loops and managing game state in JavaScript.",
      nl: "Dit project leerde me over timing-functies (setInterval, setTimeout), willekeurige getallen genereren, en hoe je boeiende gebruikersinteracties maakt. Ik leerde ook over game loops en het beheren van game state in JavaScript.",
    },
    tech: [
      { icon: "./img/html-logo.png", name: "HTML" },
      { icon: "./img/css-logo.png", name: "CSS" },
      { icon: "./img/js-logo.png", name: "JavaScript" },
    ],
    team: { en: "Team (2 people)", nl: "Team (2 personen)" },
    duration: { en: "~8 weeks", nl: "~8 weken" },
    github: null,
  },
  review: {
    gradient: "from-indigo-900 to-blue-700",
    iconClass: "fa-solid fa-star-half-stroke text-blue-300",
    name: "Review Your Experience — Game Heaven",
    year: "2025",
    type: { en: "School Project", nl: "Schoolproject" },
    typeClass: "bg-neon-purple/20 text-neon-purple border border-neon-purple/30",
    status: { en: "Completed", nl: "Afgerond" },
    statusClass: "bg-green-500/20 text-green-400 border border-green-500/30",
    period: { en: "Period 3 — Full-Stack Development", nl: "Periode 3 — Full-Stack Ontwikkeling" },
    desc: {
      en: "A full-stack game catalog and review platform called 'Game Heaven'. Users can browse a catalog of games, write detailed reviews, and rate their gaming experiences. The project features a complete PHP backend with MySQL database, user-facing master and detail pages, and a Bootstrap-styled responsive frontend.",
      nl: "Een full-stack game catalogus en reviewplatform genaamd 'Game Heaven'. Gebruikers kunnen een catalogus van games doorbladeren, uitgebreide reviews schrijven en hun game-ervaringen beoordelen. Het project bevat een complete PHP backend met MySQL database, master- en detailpagina's, en een responsive Bootstrap-frontend.",
    },
    features: {
      en: ["Game catalog with search & filter", "User review & rating system", "Master and detail pages via GET requests", "MySQL database with relationships", "Bootstrap responsive UI", "CRUD operations for reviews"],
      nl: ["Game catalogus met zoek & filter", "Gebruiker review & beoordelingssysteem", "Master- en detailpagina's via GET requests", "MySQL database met relaties", "Bootstrap responsive UI", "CRUD-operaties voor reviews"],
    },
    learned: {
      en: "My first introduction to backend development. I learned how to connect PHP to a MySQL database, create dynamic pages using GET parameters, and build a full CRUD application. This project showed me how frontend and backend work together.",
      nl: "Mijn eerste kennismaking met backend development. Ik leerde hoe je PHP koppelt aan een MySQL database, dynamische pagina's maakt met GET parameters, en een volledige CRUD-applicatie bouwt. Dit project liet me zien hoe frontend en backend samenwerken.",
    },
    tech: [
      { icon: "./img/html-logo.png", name: "HTML" },
      { icon: "./img/css-logo.png", name: "CSS" },
      { icon: "./img/js-logo.png", name: "JavaScript" },
      { icon: "./img/php-1-logo-png-transparent.png", name: "PHP" },
      { icon: "./img/mysql-icon.png", name: "MySQL" },
      { icon: "./img/Bootstrap_logo.svg.png", name: "Bootstrap" },
    ],
    team: { en: "Team (4 people)", nl: "Team (4 personen)" },
    duration: { en: "~10 weeks", nl: "~10 weken" },
    github: null,
  },
  greenfoot: {
    gradient: "from-green-900 to-lime-700",
    iconClass: "fa-solid fa-tree text-lime-300",
    name: "Greenfoot Roodkapje",
    year: "2025",
    type: { en: "School Project", nl: "Schoolproject" },
    typeClass: "bg-neon-purple/20 text-neon-purple border border-neon-purple/30",
    status: { en: "Completed", nl: "Afgerond" },
    statusClass: "bg-green-500/20 text-green-400 border border-green-500/30",
    period: { en: "Period 4 — Java Development", nl: "Periode 4 — Java Development" },
    desc: {
      en: "A Little Red Riding Hood adventure game built in Java using the Greenfoot framework. The player controls Red Riding Hood through a forest, avoiding the wolf and collecting items to reach grandmother's house. Features character movement, collision detection, enemy AI, and multiple game levels.",
      nl: "Een Roodkapje avonturenspel gebouwd in Java met het Greenfoot framework. De speler bestuurt Roodkapje door een bos, ontwijkt de wolf en verzamelt items om het huis van oma te bereiken. Met karakterbewegingen, collision detection, vijand-AI en meerdere game levels.",
    },
    features: {
      en: ["Character movement & controls", "Collision detection system", "Enemy AI pathfinding", "Item collection mechanics", "Multiple game levels", "Score & lives system", "Game over & win conditions"],
      nl: ["Karakterbeweging & besturing", "Collision detection systeem", "Vijand-AI pathfinding", "Item verzamel-mechanica", "Meerdere game levels", "Score & levens systeem", "Game over & win condities"],
    },
    learned: {
      en: "This was my first Java project and it taught me object-oriented programming concepts like classes, inheritance, and encapsulation. Working with Greenfoot gave me insight into game development patterns and how to structure larger codebases.",
      nl: "Dit was mijn eerste Java-project en het leerde me object-georiënteerde programmeerconcepten zoals klassen, overerving en encapsulatie. Werken met Greenfoot gaf me inzicht in game development patronen en hoe je grotere codebases structureert.",
    },
    tech: [
      { icon: "./img/java-logo.png", name: "Java" },
    ],
    team: { en: "Solo", nl: "Solo" },
    duration: { en: "~8 weeks", nl: "~8 weken" },
    github: null,
  },
  leaderboards: {
    gradient: "from-emerald-900 to-green-700",
    iconClass: "fa-solid fa-trophy text-green-300",
    name: "BetterLeaderboards MC",
    year: "2025",
    type: { en: "Personal Project", nl: "Persoonlijk Project" },
    typeClass: "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30",
    status: { en: "Completed", nl: "Afgerond" },
    statusClass: "bg-green-500/20 text-green-400 border border-green-500/30",
    period: { en: "Personal — Minecraft Modding", nl: "Persoonlijk — Minecraft Modding" },
    desc: {
      en: "A Minecraft Forge mod (1.20.1) for creating fully customizable holographic leaderboards that display player statistics in real-time. Built entirely in my free time out of passion for both Java and Minecraft. The mod uses invisible armor-stand entities to render floating text displays in-game.",
      nl: "Een Minecraft Forge mod (1.20.1) voor het maken van volledig aanpasbare holografische leaderboards die spelersstatistieken in real-time weergeven. Volledig in mijn vrije tijd gebouwd uit passie voor zowel Java als Minecraft. De mod gebruikt onzichtbare armor-stand entities om zwevende tekst weer te geven in-game.",
    },
    features: {
      en: ["Holographic floating leaderboards", "Medal colors for top 3 (🥇🥈🥉)", "Multiple stat types: kills, deaths, K/D, playtime", "Auto-refresh at configurable intervals", "Persistent data storage (survives restarts)", "In-game commands for management", "Customizable display formatting"],
      nl: ["Holografische zwevende leaderboards", "Medaille kleuren voor top 3 (🥇🥈🥉)", "Meerdere stat types: kills, deaths, K/D, speeltijd", "Auto-refresh op configureerbare intervallen", "Persistente data-opslag (overleeft restarts)", "In-game commando's voor beheer", "Aanpasbare weergave-opmaak"],
    },
    learned: {
      en: "This was my most ambitious personal project. I deepened my Java skills significantly, learned about the Minecraft Forge API, entity rendering, event-driven programming, data serialization (NBT), and how to publish a mod. It proved to myself that I can build real software independently.",
      nl: "Dit was mijn meest ambitieuze persoonlijke project. Ik verdiepte mijn Java-vaardigheden aanzienlijk, leerde over de Minecraft Forge API, entity rendering, event-driven programming, data serialisatie (NBT), en hoe je een mod publiceert. Het bewees aan mezelf dat ik zelfstandig echte software kan bouwen.",
    },
    tech: [
      { icon: "./img/java-logo.png", name: "Java" },
    ],
    team: { en: "Solo", nl: "Solo" },
    duration: { en: "~3 months", nl: "~3 maanden" },
    github: "https://github.com/NadirKhoulali/BetterLeaderboards-MC",
  },
  sdg: {
    gradient: "from-blue-900 to-cyan-700",
    iconClass: "fa-solid fa-chart-line text-cyan-300",
    name: "SDG Dashboard",
    year: "2026",
    type: { en: "School Project", nl: "Schoolproject" },
    typeClass: "bg-neon-purple/20 text-neon-purple border border-neon-purple/30",
    status: { en: "Completed", nl: "Afgerond" },
    statusClass: "bg-green-500/20 text-green-400 border border-green-500/30",
    period: { en: "Period 6 — Advanced Web Development", nl: "Periode 6 — Geavanceerde Webontwikkeling" },
    desc: {
      en: "An interactive full-stack web application for tracking and visualizing the United Nations Sustainable Development Goals. The app features rich data visualization with Chart.js, user authentication via NextAuth, full CRUD operations, and a clean modern UI. Built with a professional tech stack used in the industry.",
      nl: "Een interactieve full-stack webapplicatie voor het volgen en visualiseren van de Duurzame Ontwikkelingsdoelen van de Verenigde Naties. De app heeft rijke datavisualisatie met Chart.js, gebruikersauthenticatie via NextAuth, volledige CRUD-operaties en een strakke moderne UI. Gebouwd met een professionele tech stack die in de industrie wordt gebruikt.",
    },
    features: {
      en: ["Interactive Chart.js data visualizations", "User authentication with NextAuth", "Prisma ORM with MySQL database", "Full CRUD operations", "Server-side rendering with Next.js", "Form validation with Zod", "Responsive Tailwind CSS design", "Type-safe codebase with TypeScript"],
      nl: ["Interactieve Chart.js datavisualisaties", "Gebruikersauthenticatie met NextAuth", "Prisma ORM met MySQL database", "Volledige CRUD-operaties", "Server-side rendering met Next.js", "Formuliervalidatie met Zod", "Responsive Tailwind CSS design", "Type-veilige codebase met TypeScript"],
    },
    learned: {
      en: "This project was a huge leap forward. I learned modern web development with Next.js, React, and TypeScript. Working with Prisma ORM taught me how professional database management works. I also gained experience with authentication systems, API design, and building a production-quality application.",
      nl: "Dit project was een enorme stap vooruit. Ik leerde moderne webontwikkeling met Next.js, React en TypeScript. Werken met Prisma ORM leerde me hoe professioneel databasebeheer werkt. Ik deed ook ervaring op met authenticatiesystemen, API-design en het bouwen van een productie-kwaliteit applicatie.",
    },
    tech: [
      { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg", name: "Next.js", invert: true },
      { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg", name: "React" },
      { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg", name: "TypeScript" },
      { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg", name: "Tailwind CSS" },
      { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/prisma/prisma-original.svg", name: "Prisma", invert: true },
      { icon: "./img/mysql-icon.png", name: "MySQL" },
    ],
    team: { en: "Team (5 people)", nl: "Team (5 personen)" },
    duration: { en: "~10 weeks", nl: "~10 weken" },
    github: null,
  },
  imperial: {
    gradient: "from-gray-800 to-gray-700",
    iconClass: "fa-solid fa-rocket text-neon-cyan",
    name: "L'Impérial",
    year: "2026",
    type: { en: "School Project", nl: "Schoolproject" },
    typeClass: "bg-neon-purple/20 text-neon-purple border border-neon-purple/30",
    status: { en: "In Progress", nl: "In Ontwikkeling" },
    statusClass: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
    period: { en: "Period 7 — Current Project", nl: "Periode 7 — Huidig Project" },
    desc: {
      en: "A new project currently in active development using the Next.js framework. Building on everything I've learned so far to create something ambitious. More details will be revealed as the project progresses.",
      nl: "Een nieuw project dat momenteel actief in ontwikkeling is met het Next.js framework. Voortbouwend op alles wat ik tot nu toe heb geleerd om iets ambitieus te creëren. Meer details worden onthuld naarmate het project vordert.",
    },
    features: {
      en: ["Built with Next.js", "More features coming soon..."],
      nl: ["Gebouwd met Next.js", "Meer features volgen binnenkort..."],
    },
    learned: {
      en: "Currently in progress — learning new things every day as this project evolves!",
      nl: "Momenteel in ontwikkeling — elke dag leer ik nieuwe dingen terwijl dit project zich ontwikkelt!",
    },
    tech: [
      { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg", name: "Next.js", invert: true },
    ],
    team: { en: "TBD", nl: "Nog te bepalen" },
    duration: { en: "Ongoing", nl: "Lopend" },
    github: null,
  },
};

function initProjectModal() {
  const modal = document.getElementById("projectModal");
  const closeBtn = document.getElementById("projectModalClose");
  if (!modal) return;

  document.querySelectorAll("[data-project]").forEach((card) => {
    card.addEventListener("click", (e) => {
      // Don't open modal if clicking a link inside the card
      if (e.target.closest("a")) return;

      const projectId = card.getAttribute("data-project");
      const proj = projectDetails[projectId];
      if (!proj) return;

      const lang = currentLang || "en";

      // Header
      const header = document.getElementById("projectModalHeader");
      header.className = "relative h-48 flex items-center justify-center bg-gradient-to-br " + proj.gradient;
      document.getElementById("projectModalIcon").className = proj.iconClass + " text-7xl opacity-30";
      document.getElementById("projectModalTitle").textContent = proj.name;

      // Meta
      const typeEl = document.getElementById("projectModalType");
      typeEl.textContent = proj.type[lang] || proj.type.en;
      typeEl.className = "text-xs font-mono px-2.5 py-1 rounded-full " + proj.typeClass;

      const statusEl = document.getElementById("projectModalStatus");
      statusEl.textContent = proj.status[lang] || proj.status.en;
      statusEl.className = "text-xs font-mono px-2.5 py-1 rounded-full " + proj.statusClass;

      document.getElementById("projectModalPeriod").textContent = proj.period[lang] || proj.period.en;
      document.getElementById("projectModalYear").textContent = proj.year;

      // Description
      document.getElementById("projectModalDesc").textContent = proj.desc[lang] || proj.desc.en;

      // Features
      const featuresLabel = document.getElementById("projectModalFeaturesLabel");
      featuresLabel.textContent = lang === "nl" ? "Belangrijkste Features" : "Key Features";
      const featuresList = document.getElementById("projectModalFeatures");
      const features = proj.features[lang] || proj.features.en;
      featuresList.innerHTML = features
        .map((f) => '<li class="flex items-start gap-2 text-sm text-gray-600 dark:text-slate-400"><i class="fa-solid fa-check text-neon-cyan text-xs mt-1 flex-shrink-0"></i><span>' + f + "</span></li>")
        .join("");

      // What I Learned
      const learnedLabel = document.getElementById("projectModalLearnedLabel");
      learnedLabel.textContent = lang === "nl" ? "Wat Ik Heb Geleerd" : "What I Learned";
      document.getElementById("projectModalLearned").textContent = proj.learned[lang] || proj.learned.en;

      // Tech Stack
      const techLabel = document.getElementById("projectModalTechLabel");
      techLabel.textContent = "Tech Stack";
      const techWrap = document.getElementById("projectModalTech");
      techWrap.innerHTML = proj.tech
        .map((t) => '<div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10"><img src="' + t.icon + '" alt="' + t.name + '" class="w-5 h-5 object-contain' + (t.invert ? " dark:invert" : "") + '"><span class="text-xs font-mono text-gray-700 dark:text-slate-300">' + t.name + "</span></div>")
        .join("");

      // Team & Duration
      const teamEl = document.getElementById("projectModalTeam");
      teamEl.querySelector("span").textContent = proj.team[lang] || proj.team.en;
      const durationEl = document.getElementById("projectModalDuration");
      durationEl.querySelector("span").textContent = proj.duration[lang] || proj.duration.en;

      // GitHub link
      const linkEl = document.getElementById("projectModalLink");
      if (proj.github) {
        linkEl.href = proj.github;
        linkEl.style.display = "";
      } else {
        linkEl.style.display = "none";
      }

      // Show modal
      modal.classList.remove("hidden");
      modal.setAttribute("aria-hidden", "false");
      requestAnimationFrame(() => {
        modal.classList.add("active");
      });
      document.body.style.overflow = "hidden";
    });
  });

  function closeModal() {
    modal.classList.remove("active");
    document.body.style.overflow = "";
    modal.setAttribute("aria-hidden", "true");
    setTimeout(() => {
      modal.classList.add("hidden");
    }, 300);
  }

  closeBtn?.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
      closeModal();
    }
  });
}

function initSkillModal() {
  const modal = document.getElementById("skillModal");
  const closeBtn = document.getElementById("skillModalClose");
  if (!modal) return;

  // Open modal on skill card click
  document.querySelectorAll("[data-skill]").forEach((card) => {
    card.addEventListener("click", () => {
      const skillId = card.getAttribute("data-skill");
      const skill = skillDetails[skillId];
      if (!skill) return;

      // Populate modal
      document.getElementById("skillModalIcon").innerHTML = skill.icon;
      document.getElementById("skillModalTitle").textContent = skill.name;
      document.getElementById("skillModalDesc").textContent =
        skill.desc[currentLang] || skill.desc.en;

      const levelEl = document.getElementById("skillModalLevel");
      if (skill.level) {
        levelEl.textContent = skill.level[currentLang] || skill.level.en;
        levelEl.className =
          "inline-block text-xs font-mono px-2.5 py-1 rounded-full mt-1 " +
          (skill.levelClass || "");
        levelEl.style.display = "";
      } else {
        levelEl.style.display = "none";
      }

      // Show modal
      modal.classList.remove("hidden");
      modal.setAttribute("aria-hidden", "false");
      requestAnimationFrame(() => {
        modal.classList.add("active");
      });
      document.body.style.overflow = "hidden";
    });
  });

  // Close modal
  function closeModal() {
    modal.classList.remove("active");
    document.body.style.overflow = "";
    modal.setAttribute("aria-hidden", "true");
    setTimeout(() => {
      modal.classList.add("hidden");
    }, 300);
  }

  closeBtn?.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
      closeModal();
    }
  });
}
