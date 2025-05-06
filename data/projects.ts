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
    demo: "https://tchad-edu.vercel.app",
    featured: true,
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
    demo: "https://moussey.vercel.app",
    featured: true,
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
    title: "Social Media Platform",
    description:
      "A social networking platform with user profiles, posts, comments, likes, and real-time notifications.",
    image: "/placeholder.svg?height=600&width=800",
    technologies: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Supabase",
      "Pusher",
      "SWR",
    ],
    github: "https://github.com",
    demo: "https://example.com",
    featured: false,
    slug: "finance-dashboard",
  },
];
