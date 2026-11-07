export const experiences = [

  {
    role: "Project Manager & Backend Engineer",
    company: "Ashesi Innovation Lab × Revna Biosciences",
    location: "Accra, Ghana",
    slug: "project-manager-revna-biosciences",
    website: "https://www.revnabio.com",
    startDate: "Aug 2026",
    endDate: "Sept 2026",
    logo: "/images/logos/Revna-Logo.svg",
    description:
      "Translated detailed product requirements into a buildable architecture and implementation roadmap covering workflow orchestration, RBAC, approvals, documents, auditability, notifications, dashboards, and external integrations.",
    technologies: ["FastAPI", "PostgreSQL", "Python", "RBAC", "Workflow Orchestration"],
    highlights: [
      { value: "12-step", label: "Partner onboarding wizard" },
      { value: "3", label: "Review gates: Admin, ClinOps, Finance" },
      { value: "85%+", label: "Platform complete at pilot cutover" },
      { value: "1", label: "Independent security audit passed" },
    ],
    responsibilities: [
      "Translated detailed product requirements into a buildable architecture and implementation roadmap",
      "Owned key backend workstreams for ROBIN, the role-aware onboarding platform",
      "Designed user workflows and supported frontend delivery",
      "Covered workflow orchestration, RBAC, approvals, documents, auditability, notifications, dashboards, and integrations",
    ],
    caseStudy: {
      problem: "RevnaBio needed a structured, auditable platform to onboard partner institutions. The manual process lacked strict review gates (Admin, ClinOps, Finance), corrections round-tripping, revision history, and automated provisioning into their Laboratory Information Management System (LIMS) ecosystem.",
      procedures: "I co-led the backend architecture for 'ROBIN', a unified onboarding platform. Using FastAPI, PostgreSQL, and Python, I engineered a highly layered backend supporting a 12-step partner wizard and internal reviewer console. The architecture enforced strict RBAC, soft-deletes, revision snapshots before writes, and mocked external services (HR, LIMS).",
      challenges: "Securing the platform for production go-live under a tight deadline was critical. I successfully navigated a rigorous independent technical audit, rapidly remediating critical vulnerabilities including development-route gating, bounded external uploads, strict fail-closed CORS configurations, and TLS enforcement.",
      solution: "We successfully delivered a functionally mature platform (85%+ complete) that takes a partner from an invitation link through internal approvals and automated LIMS provisioning. I managed the deployment pipeline and production cutover, readying the system for its pilot launch."
    },
    companyContext:
      "Revna Biosciences (RevnaBio) is Africa's premier A2LA triple ISO-accredited medical and clinical laboratory in Accra, Ghana, advancing precision medicine, molecular diagnostics, and clinical research across West Africa.",
    gallery: [
      // Placeholder images hidden until real screenshots are added
      // { image: "/images/emma.jpg", title: "ROBIN Platform" },
      // { image: "/images/emma.jpg", title: "Frontend Prototype" },
      // { image: "/images/emma.jpg", title: "Workflow Orchestration" },
    ],
    recommendation: {
      quote:
        "Emmanuel took our product vision and turned it into a buildable architecture with remarkable precision — a true bridge between product and engineering.",
      author: "Terrance",
      role: "Product Manager, Revna Biosciences",
    },
    relatedProjects: [],
    achievements: [
      "Lead cross-functional delivery of ROBIN, a role-aware onboarding platform for a unified laboratory, research, and biobank ecosystem, while owning key backend workstreams.",
      "Design and implement backend services with FastAPI/PostgreSQL and support frontend delivery by designing user workflows.",
    ],
  },
  {
    role: "Backend Engineering Intern",
    company: "Affinity Africa",
    location: "Accra, Ghana (Hybrid)",
    slug: "backend-intern-affinity-africa",
    website: "https://www.affinityafrica.com",
    startDate: "Jul 2026",
    endDate: "Aug 2026",
    logo: "/images/logos/affinity-logo.svg",
    description:
      "Co-developed the end-to-end backend engine for a loan automation platform using FastAPI and MongoDB, converting multi-stage lending operations into structured, auditable workflows.",
    technologies: ["FastAPI", "MongoDB", "Python", "REST APIs"],
    highlights: [
      { value: "6", label: "Loan lifecycle stages modeled" },
      { value: "5", label: "User roles with backend-enforced RBAC" },
      { value: "177", label: "Automated backend tests passing" },
      { value: "2 mo", label: "From kickoff to handoff-ready" },
    ],
    responsibilities: [
      "Co-developed the end-to-end backend engine for the loan automation platform",
      "Designed APIs and data models for loans, documents, batches, assessments, history, decisions, SLAs, audit logs, notifications, and configuration",
      "Converted multi-stage lending operations into structured, auditable workflows",
      "Collaborated with product and frontend contributors on integration and workflow behavior",
    ],
    caseStudy: {
      problem: "Affinity Africa needed to digitize their personal and business loan lifecycle. The manual lending process involved multiple complex stages (Application, Analysis, Appraisal, Approval, Contracting, Disbursement) across diverse roles (Customers, Relationship Officers, Analysts, Approvers, Admins), requiring strict workflow integrity, auditability, and data protection.",
      procedures: "I co-developed the end-to-end Loan Automation Platform backend using Python, FastAPI, and MongoDB. We built REST APIs handling JWT authentication, Role-Based Access Control (RBAC), loan intake, credit-referencing integration, state-transition rules, and secure document management, all deployed via Docker.",
      challenges: "Translating complex financial compliance rules into software state machines was difficult. We had to balance rapid implementation with financial-grade maintainability, explicitly enforcing authorization boundaries in the backend (not just the UI) and handling concurrent stage transitions securely.",
      solution: "Within a two-month internship, we delivered a handoff-ready, prototype backend that successfully modeled the entire six-stage loan lifecycle. We achieved 100% workflow structuring, passing 177 automated Pytest backend tests and providing comprehensive OpenAPI documentation for future engineers."
    },
    companyContext:
      "Affinity Africa is a digital banking platform headquartered in Accra, Ghana, on a mission to bring affordable, accessible financial services to underserved communities across the continent.",
    gallery: [
      // Placeholder images hidden until real screenshots are added
      // { image: "/images/emma.jpg", title: "Loan Automation Backend" },
      // { image: "/images/emma.jpg", title: "API Design" },
    ],
    recommendation: {
      quote:
        "Emmanuel delivered production-ready backend systems within a two-month internship — his pace, ownership, and engineering quality were exceptional.",
      author: "Andrew",
      role: "Engineering Lead, Affinity Africa",
    },
    relatedProjects: [],
    achievements: [
      "Designed APIs and data models spanning loans, documents, batches, assessments and history, decisions, stage SLAs, audit logs, notifications, and configuration.",
      "Delivered a handoff-ready system within the two-month internship while collaborating closely with product and frontend contributors on integration and workflow behavior.",
    ],
  },
  {
    role: "Quantitative Risk Intern & System Architect",
    company: "MTN Ghana",
    location: "Accra, Ghana",
    slug: "quantitative-risk-mtn-ghana",
    website: "https://www.mtn.com.gh",
    startDate: "May 2026",
    endDate: "Jul 2026",
    logo: "/images/logos/mtn-logo.svg",
    description:
      "Led architecture and technical delivery for a four-person team building a real-time risk intelligence platform that replaced manual, subjective assessments with quantitative, traceable analysis.",
    technologies: ["Python", "AI/NLP", "Monte Carlo Simulation", "Data Pipeline", "Forecasting"],
    highlights: [
      { value: "10,000", label: "Monte Carlo simulations per scenario" },
      { value: "87", label: "Real-world scenarios stress-tested" },
      { value: "18+", label: "News feeds ingested every 15 minutes" },
      { value: "90-day", label: "Financial impact forecasting horizon" },
    ],
    responsibilities: [
      "Led architecture and technical delivery for a four-person team building the real-time risk intelligence platform",
      "Designed ingestion pipelines across 18+ news feeds refreshed every 15 minutes",
      "Built a nine-stage AI/NLP pipeline that scored threats and estimated their financial impact in Ghana Cedis",
      "Developed 90-day forecasting and reverse stress testing to identify the exact shock combinations behind financial breaking points",
      "Enabled up to 10,000 Monte Carlo simulations per scenario, giving leadership a distribution of possible outcomes",
    ],
    caseStudy: {
      problem: "MTN was relying on manual, subjective assessments for financial risk. Leadership needed a quantitative system capable of forecasting exact financial exposure in Ghana Cedis under various stress scenarios.",
      procedures: "I led a 4-person team to architect a real-time intelligence platform. I designed the ingestion pipeline to pull 18+ live news feeds every 15 minutes, feeding them into a 9-stage NLP and machine learning (XGBoost/LSTM) pipeline.",
      challenges: "Providing a single risk number wasn't enough; leadership needed probability distributions. To achieve this, I engineered the backend to execute up to 10,000 Monte Carlo simulations per scenario without timeouts, accurately mapping out exact financial breaking points.",
      solution: "We successfully stress-tested 87 real-world scenarios and built a 90-day forecasting engine, completely shifting the enterprise from static, manual guesswork to real-time, automated financial forecasting."
    },
    companyContext:
      "MTN Ghana is the country's largest telecommunications operator, serving tens of millions of subscribers with mobile, data, and fintech services as part of the MTN Group — one of Africa's leading network operators.",
    gallery: [
      // Placeholder images hidden until real screenshots are added
      // { image: "/images/emma.jpg", title: "Risk Intelligence Dashboard" },
      // { image: "/images/emma.jpg", title: "Threat Scoring Pipeline" },
      // { image: "/images/emma.jpg", title: "Monte Carlo Simulation" },
    ],
    recommendation: {
      quote:
        "Emmanuel led the architecture of our real-time risk intelligence platform with remarkable clarity — he turned a manual, subjective process into a quantitative system that leadership actually trusts. His ability to combine deep technical design with a clear view of the business problem was exceptional.",
      author: "Boaz",
      role: "Product Lead, MTN Ghana",
    },
    relatedProjects: ["tumor-immune-dynamics-model", "twitter-x-data-scraper"],
    achievements: [
      "Architected a robust data pipeline that ingested and normalized data from 18+ live news feeds every 15 minutes.",
      "Engineered a high-performance backend capable of running 10,000 Monte Carlo simulations per scenario to generate accurate probability distributions of financial risk.",
      "Delivered a production-ready system that stress-tested 87 real-world scenarios, fundamentally transforming how MTN Ghana's leadership evaluated enterprise risk.",
    ],
  },
  {
    role: "Record-to-Report & Automation Intern",
    company: "Nestlé Business Services",
    location: "Accra, Ghana",
    slug: "record-to-report-nestle",
    website: "https://www.nestle.com",
    startDate: "Jun 2025",
    endDate: "Aug 2025",
    logo: "/images/logos/nestle-logo.jpg",
    description:
      "Automated KRI and OLI dashboards with Power BI, Excel, Power Automate, and Python, reducing monthly reporting time by approximately 99%.",
    technologies: ["Power BI", "Excel", "Power Automate", "Python", "ETL"],
    highlights: [
      { value: "99%", label: "Reduction in monthly reporting time" },
      { value: "100+", label: "Finance users across three teams" },
      { value: "10%", label: "Fewer manual reporting errors" },
      { value: "3", label: "Colleagues trained on new workflows" },
    ],
    responsibilities: [
      "Automated KRI and OLI dashboards with Power BI, Excel, Power Automate, and Python",
      "Built reusable ETL scripts and reporting templates for 100+ finance users",
      "Documented workflows and trained colleagues to support adoption and continuity",
    ],
    caseStudy: {
      problem: "Within Nestlé Business Services (NBS), the Record to Report (R2R) General Ledger team is responsible for massive, complex financial reporting and compliance across the region. They needed a more efficient, automated way to monitor Key Risk Indicators (KRI) and Operational Level Indicators (OLI) to improve transparency and strategic decision-making.",
      procedures: "I joined the General Ledger team to engineer automated KRI and OLI dashboards. Utilizing Power BI, Excel, and data analytics tools, I designed pipelines to extract raw financial data across various R2R sub-teams (Intercompany, Bank Reconciliation, Fixed Assets) and transform it into dynamic, insightful visual dashboards.",
      challenges: "As an engineer entering the highly regulated world of corporate finance, my primary challenge was navigating the sheer scale and sophistication of Nestlé’s global financial systems. I had to rapidly bridge the gap between technical data visualization skills and complex, real-world accounting processes under fast-paced corporate pressure.",
      solution: "The automated KRI and OLI dashboards I developed provided immediate, clear visibility into the department's financial operations, significantly improving the team's ability to monitor risk and efficiency. This experience fundamentally bridged the gap between my technical engineering background and global financial business acumen."
    },
    companyContext:
      "Nestlé Business Services is the shared-services arm of Nestlé, one of the world's largest food and beverage companies, consolidating finance, HR, and procurement operations across markets.",
    gallery: [
      // Placeholder images hidden until real screenshots are added
      // { image: "/images/emma.jpg", title: "KRI Dashboard" },
      // { image: "/images/emma.jpg", title: "OLI Reporting" },
    ],
    recommendation: {
      quote:
        "Emmanuel's automation work cut our monthly reporting time dramatically — and his documentation made it easy for the team to take over seamlessly.",
      author: "David",
      role: "Finance Manager, Nestlé Business Services",
    },
    relatedProjects: [],
    achievements: [
      "Built reusable ETL scripts and reporting templates that reduced manual errors by approximately 10% and improved KPI consistency for 100+ finance users across three teams.",
      "Documented workflows and trained three colleagues, supporting adoption and operational continuity after handover.",
    ],
  },
];

export const experiencesFr = [

  {
    role: "Chef de Projet & Ingénieur Backend",
    company: "Ashesi Innovation Lab × Revna Biosciences",
    location: "Accra, Ghana",
    slug: "project-manager-revna-biosciences",
    website: "https://www.revnabio.com",
    startDate: "Août 2026",
    endDate: "Sept 2026",
    logo: "/images/logos/Revna-Logo.svg",
    description:
      "Traduction des exigences produit détaillées en une architecture construisable et une feuille de route de mise en œuvre couvrant l'orchestration des flux, le RBAC, les approbations, les documents, l'auditabilité, les notifications, les tableaux de bord et les intégrations externes.",
    technologies: ["FastAPI", "PostgreSQL", "Python", "RBAC", "Orchestration de flux"],
    highlights: [
      { value: "12 étapes", label: "Assistant d'intégration des partenaires" },
      { value: "3", label: "Validations : Admin, ClinOps, Finance" },
      { value: "85 %+", label: "Plateforme complète au lancement pilote" },
      { value: "1", label: "Audit de sécurité indépendant réussi" },
    ],
    responsibilities: [
      "Traduction des exigences produit détaillées en une architecture construisable et une feuille de route de mise en œuvre",
      "Gestion des axes backend clés de ROBIN, la plateforme d'onboarding adaptative par rôle",
      "Conception de workflows utilisateur et accompagnement de la livraison frontend",
      "Couverture de l'orchestration des flux, du RBAC, des approbations, des documents, de l'auditabilité, des notifications, des tableaux de bord et des intégrations",
    ],
    caseStudy: {
      problem: "RevnaBio avait besoin d'une plateforme structurée et auditable pour intégrer ses institutions partenaires. Le processus manuel manquait de points de validation stricts (Admin, ClinOps, Finance), d'allers-retours de corrections, d'historique des révisions et d'un provisionnement automatisé vers son écosystème LIMS (système de gestion des informations de laboratoire).",
      procedures: "J'ai codirigé l'architecture backend de « ROBIN », une plateforme d'intégration unifiée. Avec FastAPI, PostgreSQL et Python, j'ai conçu un backend en couches prenant en charge un assistant partenaire en 12 étapes et une console de revue interne. L'architecture imposait un RBAC strict, des suppressions logiques, des instantanés de révision avant chaque écriture et des services externes simulés (RH, LIMS).",
      challenges: "Sécuriser la plateforme pour sa mise en production dans des délais serrés était essentiel. J'ai mené à bien un audit technique indépendant rigoureux en corrigeant rapidement des vulnérabilités critiques : verrouillage des routes de développement, limitation des téléversements externes, configuration CORS stricte en mode refus par défaut et application du TLS.",
      solution: "Nous avons livré une plateforme fonctionnellement mature (plus de 85 % achevée) qui accompagne un partenaire depuis le lien d'invitation jusqu'aux validations internes et au provisionnement automatisé dans le LIMS. J'ai géré le pipeline de déploiement et la bascule en production, préparant le système pour son lancement pilote.",
    },
    companyContext:
      "Revna Biosciences (RevnaBio) est le premier laboratoire médical et clinique d'Afrique accrédité A2LA triple ISO, basé à Accra (Ghana), faisant progresser la médecine de précision, les diagnostics moléculaires et la recherche clinique en Afrique de l'Ouest.",
    gallery: [
      // Placeholder images hidden until real screenshots are added
      // { image: "/images/emma.jpg", title: "Plateforme ROBIN" },
      // { image: "/images/emma.jpg", title: "Prototype Frontend" },
      // { image: "/images/emma.jpg", title: "Orchestration des flux" },
    ],
    recommendation: {
      quote:
        "Emmanuel a transformé notre vision produit en une architecture construisable avec une précision remarquable — un vrai pont entre produit et ingénierie.",
      author: "Terrance",
      role: "Chef de produit, Revna Biosciences",
    },
    relatedProjects: [],
    achievements: [
      "Direction de la livraison transversale de ROBIN, une plateforme d'onboarding adaptative par rôle pour un écosystème unifié de laboratoire, de recherche et de biobanque, tout en gérant les axes backend clés.",
      "Conception et implémentation de services backend avec FastAPI/PostgreSQL et accompagnement de la livraison frontend par la conception de workflows utilisateur.",
    ],
  },
  {
    role: "Stagiaire Ingénierie Backend",
    company: "Affinity Africa",
    location: "Accra, Ghana (Hybride)",
    slug: "backend-intern-affinity-africa",
    website: "https://www.affinityafrica.com",
    startDate: "Juil. 2026",
    endDate: "Août 2026",
    logo: "/images/logos/affinity-logo.svg",
    description:
      "Co-développement du moteur backend de bout en bout pour une plateforme d'automatisation de prêts, convertissant les opérations de prêt multi-étapes en flux de travail structurés et auditable.",
    technologies: ["FastAPI", "MongoDB", "Python", "APIs REST"],
    highlights: [
      { value: "6", label: "Étapes du cycle de prêt modélisées" },
      { value: "5", label: "Rôles avec contrôle d'accès côté backend" },
      { value: "177", label: "Tests backend automatisés réussis" },
      { value: "2 mois", label: "Du lancement à la remise" },
    ],
    responsibilities: [
      "Co-développement du moteur backend de bout en bout pour la plateforme d'automatisation de prêts",
      "Conception d'APIs et de modèles de données pour les prêts, documents, lots, évaluations, historique, décisions, SLA par étape, journaux d'audit, notifications et configuration",
      "Conversion des opérations de prêt multi-étapes en flux de travail structurés et auditable",
      "Collaboration avec les contributeurs produit et frontend sur l'intégration et le comportement des flux",
    ],
    caseStudy: {
      problem: "Affinity Africa devait numériser le cycle de vie de ses prêts personnels et professionnels. Le processus manuel comportait plusieurs étapes complexes (demande, analyse, évaluation, approbation, contractualisation, décaissement) réparties entre différents rôles (clients, chargés de relation, analystes, approbateurs, administrateurs), ce qui exigeait une intégrité stricte des flux, une traçabilité complète et la protection des données.",
      procedures: "J'ai codéveloppé le backend de bout en bout de la plateforme d'automatisation des prêts avec Python, FastAPI et MongoDB. Nous avons construit des API REST gérant l'authentification JWT, le contrôle d'accès basé sur les rôles (RBAC), la réception des demandes, l'intégration avec les bureaux de crédit, les règles de transition d'état et la gestion sécurisée des documents, le tout déployé avec Docker.",
      challenges: "Traduire des règles de conformité financière complexes en machines à états logicielles était difficile. Il fallait concilier une implémentation rapide avec une maintenabilité de niveau bancaire, en appliquant explicitement les contrôles d'autorisation côté backend (et pas seulement dans l'interface) et en gérant de façon sûre les transitions d'étape simultanées.",
      solution: "En deux mois de stage, nous avons livré un backend prototype prêt à être transmis, qui modélise l'intégralité du cycle de prêt en six étapes. Nous avons structuré 100 % des flux, validé 177 tests backend automatisés avec Pytest et fourni une documentation OpenAPI complète pour les futurs ingénieurs.",
    },
    companyContext:
      "Affinity Africa est une plateforme bancaire numérique basée à Accra (Ghana), avec pour mission d'apporter des services financiers abordables et accessibles aux communautés mal desservies du continent.",
    gallery: [
      // Placeholder images hidden until real screenshots are added
      // { image: "/images/emma.jpg", title: "Backend d'automatisation des prêts" },
      // { image: "/images/emma.jpg", title: "Conception d'API" },
    ],
    recommendation: {
      quote:
        "Emmanuel a livré des systèmes backend prêts pour la production en seulement deux mois de stage — son rythme, sa prise en main et sa qualité d'ingénierie étaient exceptionnels.",
      author: "Andrew",
      role: "Responsable ingénierie, Affinity Africa",
    },
    relatedProjects: [],
    achievements: [
      "Conception d'APIs et de modèles de données couvrant les prêts, les documents, les lots, les évaluations et l'historique, les décisions, les SLA par étape, les journaux d'audit, les notifications et la configuration.",
      "Livraison d'un système prêt pour la remise en main dans les deux mois de stage en collaboration étroite avec les équipes produit et frontend sur l'intégration et le comportement des flux.",
    ],
  },
  {
    role: "Stagiaire Risque Quantitatif & Architecte Système",
    company: "MTN Ghana",
    location: "Accra, Ghana",
    slug: "quantitative-risk-mtn-ghana",
    website: "https://www.mtn.com.gh",
    startDate: "Mai 2026",
    endDate: "Juil. 2026",
    logo: "/images/logos/mtn-logo.svg",
    description:
      "Direction de l'architecture et de la livraison technique d'une équipe de quatre personnes construisant une plateforme d'intelligence des risques en temps réel remplaçant les évaluations manuelles subjectives par une analyse quantitative traçable.",
    technologies: ["Python", "IA/NLP", "Simulation de Monte Carlo", "Pipeline de données", "Prévision"],
    highlights: [
      { value: "10,000", label: "Simulations de Monte Carlo par scénario" },
      { value: "87", label: "Scénarios réels testés en stress" },
      { value: "18+", label: "Flux d'actualités ingérés toutes les 15 minutes" },
      { value: "90 jours", label: "Horizon de prévision d'impact financier" },
    ],
    responsibilities: [
      "Direction de l'architecture et de la livraison technique d'une équipe de quatre personnes construisant la plateforme d'intelligence des risques en temps réel",
      "Conception de pipelines d'ingestion couvrant plus de 18 flux d'actualités rafraîchis toutes les 15 minutes",
      "Développement d'un pipeline IA/NLP à neuf étapes évaluant les menaces et estimant leur impact financier en Cedis ghanéens",
      "Développement de prévisions sur 90 jours et de tests de résistance inversés pour identifier les combinaisons de chocs derrière les points de rupture financiers",
      "Activation de jusqu'à 10 000 simulations de Monte Carlo par scénario, offrant à la direction une distribution de résultats possibles",
    ],
    caseStudy: {
      problem: "MTN s'appuyait sur des évaluations manuelles et subjectives du risque financier. La direction avait besoin d'un système quantitatif capable de prévoir l'exposition financière exacte en cedis ghanéens selon différents scénarios de stress.",
      procedures: "J'ai dirigé une équipe de 4 personnes pour concevoir une plateforme de renseignement en temps réel. J'ai conçu le pipeline d'ingestion qui collecte plus de 18 flux d'actualités toutes les 15 minutes et les transmet à un pipeline de NLP et d'apprentissage automatique (XGBoost/LSTM) en 9 étapes.",
      challenges: "Un seul chiffre de risque ne suffisait pas : la direction avait besoin de distributions de probabilité. Pour y parvenir, j'ai conçu le backend afin d'exécuter jusqu'à 10 000 simulations de Monte Carlo par scénario sans dépassement de délai, en identifiant précisément les points de rupture financiers.",
      solution: "Nous avons soumis 87 scénarios réels à des tests de résistance et construit un moteur de prévision à 90 jours, faisant passer l'entreprise d'estimations manuelles et statiques à des prévisions financières automatisées en temps réel.",
    },
    companyContext:
      "MTN Ghana est le plus grand opérateur de télécommunications du pays, au service de dizaines de millions d'abonnés avec des services mobiles, data et fintech, au sein du groupe MTN — l'un des principaux opérateurs réseaux d'Afrique.",
    gallery: [
      // Placeholder images hidden until real screenshots are added
      // { image: "/images/emma.jpg", title: "Dashboard d'intelligence des risques" },
      // { image: "/images/emma.jpg", title: "Pipeline de scoring des menaces" },
      // { image: "/images/emma.jpg", title: "Simulation de Monte Carlo" },
    ],
    recommendation: {
      quote:
        "Emmanuel a dirigé l'architecture de notre plateforme d'intelligence des risques en temps réel avec une clarté remarquable — il a transformé un processus manuel et subjectif en un système quantitatif fiable. Sa capacité à allier conception technique approfondie et vision claire du problème métier était exceptionnelle.",
      author: "Boaz",
      role: "Responsable produit, MTN Ghana",
    },
    relatedProjects: ["tumor-immune-dynamics-model", "twitter-x-data-scraper"],
    achievements: [
      "Conception d'une ingestion de plus de 18 flux d'actualités toutes les 15 minutes et d'un pipeline IA/NLP à neuf étapes évaluant les menaces et estimant leur impact financier en Cedis ghanéens.",
      "Développement de prévisions sur 90 jours, de tests de résistance sur 87 scénarios réels et de tests de résistance inversés pour identifier les combinaisons exactes de chocs derrière un point de rupture financier cible.",
      "Activation de jusqu'à 10 000 simulations de Monte Carlo par scénario, offrant à la direction une distribution de résultats possibles plutôt qu'une estimation à point unique ; déploiement de la plateforme pour l'aide à la décision en entreprise.",
    ],
  },
  {
    role: "Stagiaire - Record to Report & Automatisation",
    company: "Nestlé Business Services",
    location: "Accra, Ghana",
    slug: "record-to-report-nestle",
    website: "https://www.nestle.com",
    startDate: "Juin 2025",
    endDate: "Août 2025",
    logo: "/images/logos/nestle-logo.jpg",
    description:
      "Automatisation des tableaux de bord KRI et OLI avec Power BI, Excel, Power Automate et Python, réduisant le temps de reporting mensuel d'environ 99 %.",
    technologies: ["Power BI", "Excel", "Power Automate", "Python", "ETL"],
    highlights: [
      { value: "99%", label: "Réduction du temps de reporting mensuel" },
      { value: "100+", label: "Utilisateurs finance sur trois équipes" },
      { value: "10%", label: "Moins d'erreurs manuelles" },
      { value: "3", label: "Collègues formés aux nouveaux flux" },
    ],
    responsibilities: [
      "Automatisation des tableaux de bord KRI et OLI avec Power BI, Excel, Power Automate et Python",
      "Développement de scripts ETL réutilisables et de modèles de reporting pour plus de 100 utilisateurs finance",
      "Documentation des workflows et formation des collègues pour assurer l'adoption et la continuité",
      "Réduction du temps de reporting mensuel d'environ 99 %",
    ],
    caseStudy: {
      problem: "Au sein de Nestlé Business Services (NBS), l'équipe Grand Livre du Record to Report (R2R) assure un reporting financier et une conformité vastes et complexes à l'échelle régionale. Elle avait besoin d'un moyen plus efficace et automatisé de suivre les indicateurs clés de risque (KRI) et les indicateurs de niveau opérationnel (OLI) afin d'améliorer la transparence et la prise de décision stratégique.",
      procedures: "J'ai rejoint l'équipe Grand Livre pour concevoir des tableaux de bord KRI et OLI automatisés. Avec Power BI, Excel et des outils d'analyse de données, j'ai conçu des pipelines qui extraient les données financières brutes de plusieurs sous-équipes R2R (intersociétés, rapprochements bancaires, immobilisations) et les transforment en tableaux de bord visuels dynamiques et parlants.",
      challenges: "En tant qu'ingénieur découvrant l'univers très réglementé de la finance d'entreprise, mon principal défi était d'appréhender l'ampleur et la sophistication des systèmes financiers mondiaux de Nestlé. J'ai dû rapidement relier mes compétences techniques en visualisation de données à des processus comptables réels et complexes, sous la pression d'un environnement d'entreprise exigeant.",
      solution: "Les tableaux de bord KRI et OLI automatisés que j'ai développés ont offert une visibilité immédiate et claire sur les opérations financières du département, améliorant nettement la capacité de l'équipe à suivre les risques et l'efficacité. Cette expérience a fait le lien entre mon parcours d'ingénieur et une solide compréhension du monde financier international.",
    },
    companyContext:
      "Nestlé Business Services est la direction des services partagés de Nestlé, l'un des plus grands groupes agroalimentaires mondiaux, consolidant les opérations finance, RH et achats dans plusieurs marchés.",
    gallery: [
      // Placeholder images hidden until real screenshots are added
      // { image: "/images/emma.jpg", title: "Tableau de bord KRI" },
      // { image: "/images/emma.jpg", title: "Reporting OLI" },
    ],
    recommendation: {
      quote:
        "Le travail d'automatisation d'Emmanuel a considérablement réduit notre temps de reporting mensuel — et sa documentation a permis à l'équipe de reprendre la main en toute fluidité.",
      author: "David",
      role: "Responsable finance, Nestlé Business Services",
    },
    relatedProjects: [],
    achievements: [
      "Développement de scripts ETL réutilisables et de modèles de tableaux de bord, diminuant les erreurs manuelles d'environ 10 % et améliorant la précision des KPI pour plus de 100 utilisateurs finance répartis sur trois équipes.",
      "Documentation des workflows et formation de trois collègues, assurant l'adoption et la continuité opérationnelle après remise en main.",
    ],
  },
];
