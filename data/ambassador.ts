// Claude Ambassador content.
// TODO(Emmanuel): confirm the official title and start date, and replace the
// activity descriptions with what you have actually run (add real numbers
// like "120+ students reached" to `highlights` once you have them).

export type AmbassadorPillar = {
  icon: "workshop" | "community" | "build";
  title: string;
  description: string;
};

export type AmbassadorContent = {
  eyebrow: string;
  titleLead: string;
  titleAccent: string;
  role: string;
  organization: string;
  date: string;
  summary: string;
  pillars: AmbassadorPillar[];
  highlights: { value: string; label: string }[];
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
  signup: { title: string; text: string; label: string; href: string };
  whatIDo: string;
};

// Sign-up form for the Ashesi Claude community.
const SIGNUP_URL = "https://www.jotform.com/253555944387168";

export const ambassador: AmbassadorContent = {
  eyebrow: "AI Community",
  titleLead: "Claude",
  titleAccent: "Ambassador",
  role: "Claude Ambassador",
  organization: "Anthropic · Ashesi University",
  date: "2026 – Present",
  summary:
    "I help students and builders at Ashesi go from curious to shipping with Claude through hands-on workshops, a growing builder community, and real projects that put AI to work on African problems.",
  pillars: [
    {
      icon: "workshop",
      title: "Workshops & Talks",
      description:
        "Hands-on sessions on prompting, Claude Code, and building with the Claude API, from first prompt to deployed app.",
    },
    {
      icon: "community",
      title: "Builder Community",
      description:
        "Bringing together the Ashesi AI Club and campus builders to share projects, pair on ideas, and learn from each other.",
    },
    {
      icon: "build",
      title: "Built with Claude",
      description:
        "Shipping my own tools with Claude and showing the workflow openly, so others can learn by seeing real projects.",
    },
  ],
  highlights: [],
  ctaPrimary: { label: "Invite me to speak", href: "#contact" },
  ctaSecondary: { label: "See my projects", href: "#projects" },
  whatIDo: "What I do",
  signup: {
    title: "Join the Claude community at Ashesi",
    text: "Sign up to get workshop invites, builder meetups and Claude resources.",
    label: "Sign up",
    href: SIGNUP_URL,
  },
};

export const ambassadorFr: AmbassadorContent = {
  eyebrow: "Communauté IA",
  titleLead: "Ambassadeur",
  titleAccent: "Claude",
  role: "Ambassadeur Claude",
  organization: "Anthropic · Université Ashesi",
  date: "2026 – Présent",
  summary:
    "J'aide les étudiants et les créateurs d'Ashesi à passer de la curiosité à la réalisation avec Claude : ateliers pratiques, une communauté de créateurs en croissance, et des projets concrets qui mettent l'IA au service de problèmes africains.",
  pillars: [
    {
      icon: "workshop",
      title: "Ateliers & Conférences",
      description:
        "Des sessions pratiques sur le prompting, Claude Code et l'API Claude, du premier prompt à l'application déployée.",
    },
    {
      icon: "community",
      title: "Communauté de créateurs",
      description:
        "Rassembler le Club d'IA d'Ashesi et les créateurs du campus pour partager des projets, collaborer et apprendre ensemble.",
    },
    {
      icon: "build",
      title: "Construit avec Claude",
      description:
        "Développer mes propres outils avec Claude et montrer ouvertement ma méthode, pour que d'autres apprennent à partir de projets réels.",
    },
  ],
  highlights: [],
  ctaPrimary: { label: "M'inviter à intervenir", href: "#contact" },
  ctaSecondary: { label: "Voir mes projets", href: "#projects" },
  whatIDo: "Ce que je fais",
  signup: {
    title: "Rejoignez la communauté Claude d'Ashesi",
    text: "Inscrivez-vous pour recevoir les invitations aux ateliers, rencontres et ressources Claude.",
    label: "S'inscrire",
    href: SIGNUP_URL,
  },
};
