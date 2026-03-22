export const projects = [
  {
    title: "Tchad Education System",
    description:
      "An educational technology initiative aimed at digitizing school management and learning systems across Chad. The platform supports schools, teachers, and students through enrollment, grade tracking, and communication tools.",
    image: "/images/projects/logo.png",
    goal: "To create a comprehensive educational platform that digitizes school management and learning systems across Chad.",
    outcome:
      "A fully functional platform that supports schools, teachers, and students through enrollment, grade tracking, and communication tools.",
    technologies: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Firebase",
      "Node.js",
      "Prisma",
      "Express",
      "Socket.io",
      "PostgreSQL",
      "Vercel",
      "GitHub Actions",
      "Figma",
    ],
    github: "https://github.com/adoumouangnamouemmanuel/Chad-education-system",
    demo: "https://github.com/adoumouangnamouemmanuel/Chad-education-system",
    featured: false,
    category: "EdTech",
    client: "Ministry of Education - Chad",
    date: "2025-05-06",
    slug: "tchad-education-system",
    challenges: [
      "Unstable internet connectivity in rural areas",
      "Limited access to digital devices in some schools",
      "Language and curriculum standardization",
    ],
    solutions: [
      "Implemented offline-first architecture with local data storage and background synchronization when connectivity is available.",
      "Developed a progressive web app with minimal resource requirements and SMS fallback for critical notifications.",
      "Created a flexible content management system with multilingual support and customizable curriculum templates.",
    ],
    developmentProcess: [
      "Conducted field research across 5 regions in Chad",
      "Built a modular architecture for role-based access (admin, teacher, student)",
      "Implemented real-time database sync using Firebase",
      "Deployed with CI/CD pipelines using Vercel and GitHub Actions",
    ],
    keyFeatures: [
      "Multi-role login and access control",
      "School and class management dashboard",
      "Real-time grade and attendance tracking",
      "Offline-first mobile support",
      "Bilingual support (French and Arabic)",
    ],
    gallery: [
      {
        image: "/images/projects/tchad-edu-dashboard.png",
        title: "Dashboard View",
      },
      {
        image: "/images/projects/tchad-edu-teacher-view.png",
        title: "Teacher View",
      },
      {
        image: "/images/projects/tchad-edu-mobile-app.png",
        title: "Homepage View",
      },
    ],
  },
  {
    title: "Moussey Numeric Dictionary",
    description:
      "A language preservation initiative to build a digital Moussey dictionary with numeric references, translations, and examples for each word, aimed at revitalizing and modernizing access to the Moussey language.",
    image: "/images/projects/moussey-logo.jpg",
    goal: "To document and digitize Moussey vocabulary with accurate translations and numeric categorization, enabling accessibility for learners, researchers, and native speakers.",
    outcome:
      "A digital platform offering an interactive Moussey dictionary sorted alphabetically and numerically, complete with translations, usage examples, and search functionality.",
    technologies: [
      "Next.js",
      "Tailwind CSS",
      "Firebase",
      "Google Sheets API",
      "Node.js",
      "TypeScript",
    ],
    github:
      "https://github.com/adoumouangnamouemmanuel/moussey-french-translator",
    demo: "https://github.com/adoumouangnamouemmanuel/moussey-french-translator",
    featured: false,
    category: "LanguageTech",
    client: "Community-led Moussey Language Preservation Group",
    date: "2025-02-18",
    slug: "moussey-numeric-dictionary",
    challenges: [
      "Lack of existing standardized Moussey spelling and grammar rules",
      "Missing or inaccurate translations in previous records",
      "Limited access to native speakers for validation",
      "Manual data cleaning across hundreds of words",
    ],
    solutions: [
      "Developed a flexible spelling and grammar framework based on linguistic research and community feedback.",
      "Cross-referenced translations with multiple sources and validated them with native speakers.",
      "Organized workshops with native speakers to validate and refine the vocabulary.",
      "Automated data cleaning using scripts to handle duplicates and inconsistencies.",
    ],
    developmentProcess: [
      "Gathered vocabulary from various sources including elders and older dictionaries",
      "Distributed tasks among 28 reviewers using alphabet-sorted Excel sheets",
      "Used Google Sheets as a real-time collaborative backend for review",
      "Built a searchable front-end interface integrated with Firebase for storage and updates",
      "Tested the translation functionality and example accuracy with native speakers",
    ],
    keyFeatures: [
      "Alphabetical and numerical word organization",
      "Integrated translation for French, Moussey, and English",
      "Live dictionary updates via Google Sheets integration",
      "Example correction and validation tools",
      "Mobile-friendly UI for access in rural areas",
    ],
    gallery: [
      {
        image: "/images/projects/moussey-dictionary-translate.png",
        title: "Translation Interface",
      },
      {
        image: "/images/projects/moussey-dictionary-translate.png",
        title: "Home Screen View",
      },
    ],
  },

  {
    title: "Tumor-Immune Dynamics Model",
    description:
      "An interactive web platform for exploring the Nonlinear Tumor-Immune Unstable Hybrid Dynamical Model (NTIUNHDM) — a mathematical framework investigating the complex interactions between tumor cells, immune response, and dietary factors through differential equations and numerical methods.",
    image: "/images/projects/tumor-model-cover.png",
    goal: "To make complex cancer research mathematics accessible through interactive visualizations and real-time differential equation simulations.",
    outcome:
      "A fully interactive research platform combining rigorous mathematical modeling with intuitive cell simulations, accessible to researchers, students, and the general public.",
    technologies: [
      "Next.js 14",
      "React",
      "Tailwind CSS",
      "shadcn/ui",
      "Framer Motion",
      "MathJax",
      "Canvas API",
      "Lucide React",
    ],
    github:
      "https://github.com/adoumouangnamouemmanuel/tumor_model_differential_equations",
    demo: "https://github.com/adoumouangnamouemmanuel/tumor_model_differential_equations",
    featured: true,
    category: "Research & Mathematics",
    client: "MATH221 & CE122 — Ashesi University",
    date: "2024-12-01",
    slug: "tumor-immune-dynamics-model",
    challenges: [
      "Visualizing complex differential equation behavior in real time",
      "Making advanced cancer research mathematics accessible to non-specialists",
      "Accurately representing multi-variable cell population dynamics on a canvas",
    ],
    solutions: [
      "Built a custom Canvas-based animation engine for real-time cell interaction visualization.",
      "Implemented MathJax for crisp inline equation rendering paired with plain-language explanations.",
      "Layered interactive parameter sliders so users can observe how changes affect tumor-immune equilibria.",
    ],
    developmentProcess: [
      "Studied the NTIUNHDM paper and translated its equations into numerical solvers",
      "Designed modular React components for each page section (equations, results, code)",
      "Integrated Framer Motion for smooth page transitions and data-driven animations",
      "Deployed to Vercel with continuous integration via GitHub",
    ],
    keyFeatures: [
      "Interactive real-time cell simulation (normal, tumor, and immune cells)",
      "Differential equation explorer with adjustable parameters",
      "Research results visualized through interactive charts",
      "ODE solver comparison and error analysis",
      "Dark/light mode toggle",
      "Fully responsive design",
    ],
    gallery: [],
  },
  {
    title: "Solar System Simulation",
    description:
      "A Python-based solar system simulation using Pygame for real-time visualization of planetary orbital mechanics, gravitational interactions, and celestial physics — including accurate Newton's law computations, orbital velocity, escape velocity, and data export to CSV.",
    image: "/images/projects/solar-system-cover.png",
    goal: "To build an educational tool that provides an interactive and physically accurate simulation of the solar system, enabling exploration of orbital mechanics and gravitational dynamics.",
    outcome:
      "A fully functional Pygame simulation with real-time planetary rendering, physics-based gravitational interactions, moon support, logging, and CSV data export.",
    technologies: [
      "Python",
      "Pygame",
      "Object-Oriented Programming",
      "CSV I/O",
      "Physics Simulation",
      "Decorators & Logging",
    ],
    github:
      "https://github.com/adoumouangnamouemmanuel/solar-system-simulation",
    demo: "https://github.com/adoumouangnamouemmanuel/solar-system-simulation",
    featured: true,
    category: "Simulation & Physics",
    client: "Academic Project",
    date: "2024-08-03",
    slug: "solar-system-simulation",
    challenges: [
      "Accurately simulating gravitational attraction between all planet pairs in real time",
      "Decomposing force vectors into x/y components for multi-body orbital paths",
      "Maintaining simulation stability across large time step variations",
    ],
    solutions: [
      "Implemented Newton's law of universal gravitation with full force decomposition using atan2.",
      "Optimized the simulation loop to iterate over all planet pairs efficiently using list comprehension.",
      "Added a configurable time-step parameter so users can slow down or speed up the simulation.",
    ],
    developmentProcess: [
      "Designed Planet, Sun, Moon, and Star classes with full physics method suites",
      "Loaded planet data dynamically from a structured CSV file",
      "Added logging decorators to track function entry/exit and execution time",
      "Built a CSV export feature to record computed planetary attributes",
    ],
    keyFeatures: [
      "Real-time gravitational force simulation between all bodies",
      "Accurate orbital velocity and period calculations (Kepler's 3rd Law)",
      "Moon and Star object support",
      "Escape velocity, surface gravity, and orbital period per planet",
      "CSV data export for all computed attributes",
      "Dynamic logging and error handling",
    ],
    gallery: [],
  },
  {
    title: "Ghana Road Transport Network",
    description:
      "A full-stack solution to the Ghana Road Transport Network Programming Challenge 2026 at Ashesi University. Models Ghana's intercity road network as a graph, implements Dijkstra, Yen's K-Shortest Paths, and cost analysis — exposed via a Java CLI, a Spring Boot REST API, and an interactive Next.js web frontend.",
    image: "/images/projects/ghana-transport-cover.png",
    goal: "To model Ghana's intercity road network as a graph and provide tools to explore routes, estimate costs, and manage road connectivity through a CLI, REST API, and interactive web interface.",
    outcome:
      "A production-grade multi-layer system handling all 10 challenge questions, with an interactive force-directed graph visualization, route exploration, real-time edge editing, and cost recommendation engine.",
    technologies: [
      "Java 17",
      "Spring Boot",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "React",
      "Maven",
      "REST API",
      "Graph Algorithms",
      "Dijkstra",
      "Yen's K-Shortest Paths",
    ],
    github:
      "https://github.com/adoumouangnamouemmanuel/ghana-transport-network-2026",
    demo: "https://github.com/adoumouangnamouemmanuel/ghana-transport-network-2026",
    featured: true,
    category: "Algorithms & Data Structures",
    client: "Ashesi University — CS Programming Challenge 2026",
    date: "2026-03-01",
    slug: "ghana-road-transport-network",
    challenges: [
      "6 duplicate bidirectional edges with conflicting weights in the raw dataset",
      "Efficiently finding top-K loopless shortest paths without modifying the main graph",
      "Bridging a Java backend and a Next.js frontend with CORS and shared state",
    ],
    solutions: [
      "Used a LinkedHashMap with case-insensitive town keys; addEdge silently overwrites duplicates to ensure a clean, deterministic graph.",
      "Implemented Yen's K-Shortest Paths algorithm with a temporary EdgeRemover to spur-path-explore without permanently mutating the graph.",
      "Configured Spring Boot CORS to allow localhost:3000 and designed a singleton graph bean shared across all API controllers.",
    ],
    developmentProcess: [
      "Parsed 557-entry road dataset, deduplicating to clean bidirectional edge set",
      "Built CLI answering all 10 challenge questions (Q1–Q10) via terminal",
      "Wrapped the same Java logic in a Spring Boot REST API (Q1–Q10 endpoints)",
      "Built an interactive Next.js frontend with force-directed graph visualization",
      "Added interactive edge editing (add, update, delete) through the frontend",
    ],
    keyFeatures: [
      "Dijkstra shortest distance and fastest time path (Q4, Q5)",
      "Yen's Top-3 K-Shortest loopless paths (Q6)",
      "Fuel and time cost recommendation engine (Q7, Q8)",
      "Interactive CLI session with multi-query support (Q9)",
      "Time complexity analysis scaling from 100 to 5,000 nodes (Q10)",
      "Force-directed interactive network graph with route highlights",
      "Real-time road editing (add, update, remove) from the browser",
    ],
    gallery: [],
  },
  {
    title: "Discrete Learn",
    description:
      "An online learning platform designed to help students master discrete mathematics with a focus on sets. Features interactive lessons, quizzes, progress tracking, and interactive Venn diagram visualizations to make learning engaging and effective.",
    image: "/images/projects/discrete-learn-cover.png",
    goal: "To create an accessible, interactive platform that makes discrete mathematics — specifically set theory — approachable for students through guided lessons and hands-on practice.",
    outcome:
      "A fully functional web learning platform with authentication, progress tracking, interactive Venn diagrams, practice problems, and a focused course environment.",
    technologies: [
      "React.js",
      "Vite",
      "Context API",
      "ShadCN UI",
      "Firebase",
      "TypeScript",
      "CSS3",
    ],
    github: "https://github.com/adoumouangnamouemmanuel/Discrete_Learn",
    demo: "https://discretelearn.web.app",
    featured: false,
    category: "EdTech",
    client: "Academic Project",
    date: "2024-06-01",
    slug: "discrete-learn",
    challenges: [
      "Designing an engaging learning flow that keeps students motivated through abstract math content",
      "Building dynamic, interactive Venn diagram components for set operations",
      "Tracking per-lesson completion state across sessions with Firebase",
    ],
    solutions: [
      "Created a focused course page layout with a sticky sidebar for seamless lesson navigation.",
      "Built custom interactive Venn diagram and set identity practice components from scratch.",
      "Leveraged Firebase for persistent user progress and authentication across sessions.",
    ],
    developmentProcess: [
      "Designed the lesson content structure using structured JSON data files",
      "Built reusable course components: sidebar, lesson content, footer controls",
      "Integrated Firebase Auth for login, signup, and password reset flows",
      "Added interactive visualizations: Venn diagrams, set operation tables, computer representation",
    ],
    keyFeatures: [
      "Step-by-step lessons on set theory fundamentals and advanced concepts",
      "Interactive Venn diagram and set operation visualizations",
      "Practice problems with real-time feedback",
      "Progress tracking with completion indicators",
      "User authentication (login, signup, password reset)",
      "Responsive design optimized for desktop and mobile",
    ],
    gallery: [],
  },
  {
    title: "Twitter / X Data Scraper",
    description:
      "A Python-based command-line tool that uses Selenium to scrape tweets from Twitter/X — by user profile, hashtag, or search query. Supports flexible authentication, configurable tweet limits, advanced search queries, and CSV export of scraped data.",
    image: "/images/projects/twitter-scraper-cover.png",
    goal: "To build a flexible, authenticated CLI tool for scraping and exporting tweet data from Twitter/X for research, social media analysis, and data collection use cases.",
    outcome:
      "A fully functional scraper supporting user, hashtag, and query-based scraping with configurable limits, additional data fields, and structured CSV output.",
    technologies: ["Python", "Selenium", "dotenv", "argparse", "CSV", "CLI"],
    github:
      "https://github.com/adoumouangnamouemmanuel/tweeter_scraper_selenimum",
    demo: "https://github.com/adoumouangnamouemmanuel/tweeter_scraper_selenimum",
    featured: false,
    category: "Data & Automation",
    client: "Personal / Research Tool",
    date: "2024-05-01",
    slug: "twitter-x-data-scraper",
    challenges: [
      "Handling Twitter's dynamic, JavaScript-rendered content reliably with Selenium",
      "Designing a flexible authentication system supporting environment variables, CLI args, and interactive prompts",
      "Implementing rate-limit-aware scraping without triggering account bans",
    ],
    solutions: [
      "Used Selenium WebDriver with explicit waits to reliably handle dynamic page rendering.",
      "Built a tiered authentication system: CLI args → .env variables → interactive prompt fallback.",
      "Added configurable tweet limits and optional no-limit mode for large-scale data collection.",
    ],
    developmentProcess: [
      "Set up Selenium with ChromeDriver for browser automation",
      "Designed the CLI interface using argparse with multiple authentication and scraping options",
      "Implemented user profile, hashtag, and query-based scraping modes",
      "Added CSV export with optional extended data fields (poster followers/following)",
    ],
    keyFeatures: [
      "Scrape tweets by user profile, hashtag, or search query",
      "Flexible authentication: CLI args, .env file, or interactive prompt",
      "Configurable tweet limit (default 50, or unlimited)",
      "Support for latest and top tweet sorting",
      "Advanced search query support (matches Twitter's advanced search syntax)",
      "CSV export with optional poster metadata (followers, following)",
    ],
    gallery: [],
  },
  {
    title: "Succès Masra — Incarceration Counter",
    description:
      "A French-language web interface displaying the number of days Chadian political leader Succès Masra has been imprisoned since May 17, 2025. Features an animated odometer-style day counter, secondary statistics (weeks, months, years), a Chadian flag progress bar, and a premium dark-mode design.",
    image: "/images/projects/masra-counter-cover.png",
    goal: "To create a dignified, informative public platform raising awareness about Succès Masra's imprisonment through elegant design and live day tracking.",
    outcome:
      "A fully responsive static web app with animated day counter, automatic midnight updates, floating particle animations, Chadian flag color accents, and a Martin Luther King Jr. quote in support of justice.",
    technologies: [
      "HTML5",
      "CSS3",
      "JavaScript (Vanilla)",
      "Google Fonts",
      "Vercel",
    ],
    github:
      "https://github.com/adoumouangnamouemmanuel/succes-masra-incarceration",
    demo: "https://succesmasra.vercel.app",
    featured: false,
    category: "Advocacy & Web",
    client: "Civil Society / Personal Initiative",
    date: "2025-12-01",
    slug: "succes-masra-incarceration-counter",
    challenges: [
      "Calculating the exact incarceration day count dynamically from a fixed start date",
      "Implementing a smooth odometer animation purely in CSS and Vanilla JS without dependencies",
      "Creating an auto-updating counter that refreshes at midnight without a page reload",
    ],
    solutions: [
      "Anchored the day count to May 17, 2025 using the verified public reference point: Day 200 = December 2, 2025.",
      "Built a CSS keyframe odometer animation timed with JavaScript to simulate digit rolling.",
      "Used setTimeout to schedule an automatic page state refresh at the next midnight boundary.",
    ],
    developmentProcess: [
      "Designed a dark glassmorphism layout with Chadian flag gradient accents",
      "Implemented floating particle background via CSS animation",
      "Built the primary day counter with animated digit transitions",
      "Added secondary stats (weeks, months, years) and annual progress bar",
      "Deployed as a zero-dependency static site on Vercel",
    ],
    keyFeatures: [
      "Live animated day counter (odometer-style) since May 17, 2025",
      "Secondary stats: weeks, months, and years elapsed",
      "Chadian flag-colored annual progress bar",
      "Automatic midnight refresh (no page reload needed)",
      "Floating particle background animation",
      "100% French language, fully responsive",
    ],
    gallery: [],
  },
  {
    title: "Custom Printf — C Implementation",
    description:
      "A custom implementation of the C standard library printf function, built from scratch in C. Supports a comprehensive set of conversion specifiers (%c, %s, %d, %i, %u, %o, %x, %X, %p, %b, %r, %R, %S) and follows the Betty style guidelines, compiled on Ubuntu 20.04 with gcc.",
    image: "/images/projects/custom-printf-cover.png",
    goal: "To deeply understand the internals of the C standard library by re-implementing printf from scratch, handling format string parsing, type conversions, and variadic argument processing.",
    outcome:
      "A modular, production-quality C implementation of printf that passes all standard tests, is compiled with strict gcc flags (-Wall -Werror -Wextra -pedantic), and covers 13+ conversion specifiers.",
    technologies: [
      "C (GNU89)",
      "gcc",
      "Variadic Functions",
      "Standard I/O",
      "Ubuntu 20.04 LTS",
      "Betty Style",
    ],
    github: "https://github.com/adoumouangnamouemmanuel/printf",
    demo: "https://github.com/adoumouangnamouemmanuel/printf",
    featured: false,
    category: "Systems Programming",
    client: "ALX Africa — Low-Level Programming",
    date: "2023-09-01",
    slug: "custom-printf-c-implementation",
    challenges: [
      "Parsing format strings with arbitrary combinations of flags, width, precision, and specifiers",
      "Handling variadic arguments safely across all supported conversion types",
      "Implementing non-standard specifiers like %b (binary), %r (reverse), and %R (ROT13)",
    ],
    solutions: [
      "Designed a modular dispatch table mapping each specifier character to its handler function.",
      "Used va_list, va_start, va_arg, and va_end idioms correctly across all conversion branches.",
      "Implemented separate helper modules (helpers.c, conversion.c, modifiers.c) to keep the codebase maintainable and Betty-compliant.",
    ],
    developmentProcess: [
      "Defined function prototypes and data structures in main.h",
      "Built the core format string parser loop in _printf",
      "Implemented each conversion specifier as a separate reusable function",
      "Added length modifier, field width, precision, and flag character handling in modifiers.c",
      "Compiled and tested with strict gcc flags on Ubuntu 20.04 LTS",
    ],
    keyFeatures: [
      "Supports %c, %s, %%, %d, %i, %u, %o, %x, %X, %p, %S, %b, %r, %R",
      "Modular source structure (helpers.c, conversion.c, modifiers.c)",
      "Handles length modifiers, field width, precision, and flag characters",
      "Compiled with -Wall -Werror -Wextra -pedantic -std=gnu89",
      "Follows Betty C style guidelines",
    ],
    gallery: [],
  },
  {
    title: "Emmanuel Adoum — Developer Portfolio",
    description:
      "A cinematic, full-stack personal portfolio website built with Next.js 15 and TypeScript. Features a blog with Firebase-backed comments and replies, Google OAuth authentication, an admin dashboard, dark/light mode, and premium glassmorphism UI with Framer Motion animations.",
    image: "/images/projects/portfolio-cover.png",
    goal: "To build a stunning, production-grade personal portfolio that showcases projects and writing while functioning as a full blog platform with authentication, comments, and admin management.",
    outcome:
      "A deployed portfolio and blog platform at emmanueladoum.com featuring cinematic animations, full authentication, a blog with nested comments, a project archive, and an admin dashboard.",
    technologies: [
      "Next.js 15",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "Firebase",
      "NextAuth.js",
      "Prisma",
      "Vercel",
      "ShadCN UI",
    ],
    github:
      "https://github.com/adoumouangnamouemmanuel/EmmanuelAdoum-Portfolio",
    demo: "https://emmanueladoum.com",
    featured: false,
    category: "Full Stack",
    client: "Personal Project",
    date: "2026-01-01",
    slug: "emmanuel-adoum-developer-portfolio",
    challenges: [
      "Building a secure nested comment system with reply threading and real-time updates on a static-first Next.js architecture",
      "Implementing Google OAuth with NextAuth.js on a custom domain with correct redirect URI configuration",
      "Achieving a cinematic, Apple-tier design with glassmorphism and smooth Framer Motion physics while maintaining excellent performance",
    ],
    solutions: [
      "Designed a Firebase-backed comment and reply data model with per-post collections and user-linked documents.",
      "Configured NextAuth.js with NEXTAUTH_URL pointing to the production domain and added the callback URI in Google Cloud Console.",
      "Used Framer Motion layout animations, spring physics, and staggered reveal transitions to achieve silky-smooth interactions without layout thrash.",
    ],
    developmentProcess: [
      "Built out core portfolio sections: Hero, About, Skills, Projects, Journey, Testimonials, Contact",
      "Developed a full blog system with MDX support, categories, tags, search, and related posts",
      "Implemented authentication (email + Google OAuth) with protected routes and an admin dashboard",
      "Added a nested comment and reply system backed by Firebase Firestore",
      "Deployed to Vercel with custom domain at emmanueladoum.com",
    ],
    keyFeatures: [
      "Cinematic glassmorphism UI with Framer Motion animations throughout",
      "Full blog platform with categories, tags, search, and table of contents",
      "Nested comment and reply system with user authentication",
      "Google OAuth and email/password login via NextAuth.js",
      "Admin dashboard for post and user management",
      "Dark/light mode with system preference detection",
      "Fully responsive across all screen sizes",
    ],
    gallery: [],
  },
];

const projectsFrOverrides: Record<
  string,
  Partial<(typeof projects)[number]>
> = {
  "tchad-education-system": {
    title: "Tchad Education System",
    description:
      "Initiative EdTech visant à numériser la gestion scolaire et l'apprentissage au Tchad. La plateforme accompagne écoles, enseignants et élèves avec l'inscription, le suivi des notes et des outils de communication.",
    goal: "Créer une plateforme éducative complète qui numérise la gestion des établissements et les systèmes d'apprentissage au Tchad.",
    outcome:
      "Une plateforme pleinement opérationnelle permettant l'inscription, le suivi des notes et l'amélioration de la communication entre acteurs scolaires.",
    category: "EdTech",
    client: "Ministère de l'Éducation - Tchad",
    challenges: [
      "Connectivité internet instable dans les zones rurales",
      "Accès limité aux appareils numériques dans certaines écoles",
      "Standardisation linguistique et curriculaire",
    ],
    solutions: [
      "Implémentation d'une architecture offline-first avec stockage local et synchronisation différée.",
      "Création d'une PWA légère avec fallback SMS pour les notifications critiques.",
      "Mise en place d'un CMS flexible avec support multilingue et programmes personnalisables.",
    ],
    developmentProcess: [
      "Recherche terrain dans 5 régions du Tchad",
      "Architecture modulaire avec accès par rôles (admin, enseignant, élève)",
      "Synchronisation temps réel via Firebase",
      "Déploiement CI/CD avec Vercel et GitHub Actions",
    ],
    keyFeatures: [
      "Authentification multi-role et gestion des permissions",
      "Dashboard de gestion des écoles et classes",
      "Suivi en temps réel des notes et présences",
      "Support mobile offline-first",
      "Support bilingue (français et arabe)",
    ],
  },
  "moussey-numeric-dictionary": {
    title: "Dictionnaire Numérique Moussey",
    description:
      "Initiative de préservation linguistique pour créer un dictionnaire Moussey numérique avec références, traductions et exemples d'usage.",
    goal: "Documenter et numériser le vocabulaire Moussey avec des traductions fiables et une catégorisation numérique.",
    outcome:
      "Une plateforme interactive proposant un dictionnaire Moussey avec recherche, tri alphabétique et numérique, exemples et traductions.",
    category: "LanguageTech",
    client: "Groupe communautaire de preservation de la langue Moussey",
    challenges: [
      "Absence de standard établi pour l'orthographe et la grammaire Moussey",
      "Traductions manquantes ou inexactes dans des sources antérieures",
      "Disponibilité limitée des locuteurs natifs pour validation",
      "Nettoyage manuel de centaines d'entrées",
    ],
    solutions: [
      "Mise en place d'un cadre flexible d'orthographe/grammaire avec retour communautaire.",
      "Validation croisée des traductions à partir de plusieurs sources.",
      "Ateliers de validation avec locuteurs natifs.",
      "Automatisation du nettoyage des données pour doublons et incohérences.",
    ],
    developmentProcess: [
      "Collecte du vocabulaire à partir de diverses sources communautaires",
      "Répartition des revues entre 28 relecteurs via feuilles triées",
      "Utilisation de Google Sheets comme backend collaboratif",
      "Construction d'une interface de recherche connectée à Firebase",
      "Tests de la qualité des traductions avec des locuteurs natifs",
    ],
    keyFeatures: [
      "Organisation alphabétique et numérique",
      "Traductions français, Moussey et anglais",
      "Mises à jour en direct via Google Sheets",
      "Outils de correction et validation des exemples",
      "UI mobile adaptée aux zones rurales",
    ],
  },
  "tumor-immune-dynamics-model": {
    title: "Modèle de Dynamique Tumeur-Système Immunitaire",
    description:
      "Plateforme web interactive pour explorer le modèle mathématique NTIUNHDM et les interactions complexes entre cellules tumorales, réponse immunitaire et facteurs nutritionnels.",
    goal: "Rendre accessibles des mathématiques complexes de recherche sur le cancer via des visualisations interactives et des simulations en temps réel.",
    outcome:
      "Une plateforme de recherche interactive combinant modélisation rigoureuse et simulation intuitive pour chercheurs, étudiants et public.",
    category: "Recherche & Mathématiques",
    client: "MATH221 & CE122 - Ashesi University",
  },
  "solar-system-simulation": {
    title: "Simulation du Système Solaire",
    description:
      "Simulation Python avec Pygame pour visualiser en temps réel la mécanique orbitale, les interactions gravitationnelles et les lois physiques célestes.",
    goal: "Construire un outil éducatif interactif et physiquement cohérent pour explorer la dynamique orbitale.",
    outcome:
      "Une simulation Pygame complète avec rendu des planètes, interactions gravitationnelles, support des lunes et export CSV.",
    category: "Simulation & Physique",
  },
  "ghana-road-transport-network": {
    title: "Réseau Routier du Ghana",
    description:
      "Solution full-stack du challenge Ghana Road Transport Network 2026: modélisation graphe, Dijkstra, Yen K-shortest paths, API Spring Boot, CLI Java et frontend Next.js interactif.",
    goal: "Modéliser le réseau routier interurbain du Ghana et fournir des outils de parcours, estimation de coûts et gestion de connectivité.",
    outcome:
      "Système multi-couches robuste couvrant les 10 questions du challenge avec visualisation force-directed et édition en temps réel des routes.",
    category: "Algorithmes & Structures de Données",
    client: "Ashesi University - Programming Challenge 2026",
  },
  "discrete-learn": {
    title: "Discrete Learn",
    description:
      "Plateforme d'apprentissage en ligne pour maîtriser les mathématiques discrètes, avec accent sur la théorie des ensembles, quiz interactifs et suivi de progression.",
    goal: "Rendre la théorie des ensembles plus accessible grâce à des leçons guidées et des exercices pratiques interactifs.",
    outcome:
      "Plateforme web complete avec authentification, progression, visualisations de Venn et exercices pratiques.",
    category: "EdTech",
  },
  "twitter-x-data-scraper": {
    title: "Scraper de Données Twitter / X",
    description:
      "Outil CLI Python basé sur Selenium pour extraire des tweets par profil, hashtag ou requête, avec authentification flexible et export CSV.",
    goal: "Construire un outil flexible et authentifié pour collecter des données Twitter/X à des fins d'analyse et de recherche.",
    outcome:
      "Un scraper opérationnel avec extraction multi-modes, limites configurables et sortie CSV structurée.",
    category: "Données & Automatisation",
  },
  "succes-masra-incarceration-counter": {
    title: "Compteur d'Incarcération - Succes Masra",
    description:
      "Interface web en français affichant le nombre de jours d'incarcération de Succes Masra depuis le 17 mai 2025, avec compteur animé et statistiques secondaires.",
    goal: "Créer une plateforme digne et informative pour sensibiliser sur cette incarcération via un design élégant et des données en direct.",
    outcome:
      "Application statique responsive avec compteur animé, mise à jour automatique quotidienne et design premium sombre.",
    category: "Plaidoyer & Web",
    client: "Société civile / Initiative personnelle",
  },
  "custom-printf-c-implementation": {
    title: "Custom Printf - Implementation C",
    description:
      "Réimplementation complète de printf en C, avec gestion de nombreux specifiers et respect des standards Betty sur Ubuntu 20.04.",
    goal: "Comprendre en profondeur les mécanismes internes de la libc en recréant printf (parseur, conversions, variadique).",
    outcome:
      "Implémentation modulaire robuste de printf couvrant 13+ specifiers et compilée avec des flags stricts gcc.",
    category: "Programmation Système",
    client: "ALX Africa - Low-Level Programming",
  },
  "emmanuel-adoum-developer-portfolio": {
    title: "Portfolio Développeur - Emmanuel Adoum",
    description:
      "Portfolio full-stack cinématographique construit avec Next.js 15 et TypeScript, incluant blog, commentaires Firebase, OAuth Google, dashboard admin et UI premium.",
    goal: "Construire un portfolio de niveau production qui présente mes projets et un blog complet avec authentification et administration.",
    outcome:
      "Plateforme portfolio/blog déployée sur emmanueladoum.com avec animations fluides, commentaires imbriqués et back-office admin.",
    category: "Full Stack",
  },
};

export const projectsFr = projects.map((project) => ({
  ...project,
  ...(projectsFrOverrides[project.slug] || {}),
}));
