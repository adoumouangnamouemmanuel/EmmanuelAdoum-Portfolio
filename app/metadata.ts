import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Emmanuel Adoum | Portfolio",
  verification: {
    google: "UG8yAiR4WO2SeDElT5EWIWT2TegP2n3CDHk0PLUyoyw",
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://emmanueladoum.com",
  ),
  icons: {
    icon: "/images/emma-head.png",
    shortcut: "/images/emma-head.png",
  },
  keywords: [
    "Emmanuel Adoum",
    "Adoum Ouang-Namou Emmanuel",
    "Software Engineer",
    "Computer Engineer",
    "Portfolio",
    "Computer Engineering",
    "Artificial Intelligence",
    "Full Stack Developer",
    "Software Engineer",
    "Technology Leadership",
    "Next.js",
    "TypeScript",
    "React",
    "Node.js",
    "Python",
    "FastAPI",
    "Firebase",
    "Tailwind CSS",
    "PostgreSQL",
    "MongoDB",
    "Machine Learning",
    "Software Architecture",
    "Chad",
    "Ghana",
  ],
  authors: [
    {
      name: "Emmanuel Adoum",
      url: "https://www.linkedin.com/in/emmanueladoum",
    },
  ],
  creator: "Emmanuel Adoum",
  publisher: "Emmanuel Adoum",
  openGraph: {
    title: "Emmanuel Adoum | Software Engineer",
    description:
      "Software Engineer. Architecting scalable, data-intensive backend systems for high-stakes environments.",
    siteName: "Emmanuel Adoum | Portfolio",
    locale: "en_US",
    alternateLocale: ["fr_FR"],
    images: [
      {
        url: "/emma.png",
        width: 1200,
        height: 630,
        alt: "Emmanuel Adoum | Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Emmanuel Adoum | Software Engineer",
    description:
      "Software Engineer. Architecting scalable, data-intensive backend systems for high-stakes environments.",
    images: ["/emma.png"],
    creator: "@emmanueladoum",
  },
  description:
    "Emmanuel Adoum — Software Engineer. Architecting scalable, data-intensive backend systems for high-stakes environments.",
};

export const personJsonLd = (baseUrl: string) => ({
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Emmanuel Adoum",
  alternateName: "Adoum Ouang-Namou Emmanuel",
  jobTitle: "Software Engineer",
  alumniOf: [
    {
      "@type": "CollegeOrUniversity",
      name: "Ashesi University",
      url: "https://www.ashesi.edu.gh",
    },
  ],
  url: baseUrl,
  image: `${baseUrl}/images/emma.jpg`,
  nationality: "Chad",
  address: { "@type": "PostalAddress", addressCountry: "TD" },
  description:
    "Software Engineer. Architecting scalable, data-intensive backend systems for high-stakes environments.",
  sameAs: [
    "https://github.com/adoumouangnamouemmanuel",
    "https://www.linkedin.com/in/emmanueladoum/",
  ],
  knowsAbout: [
    "Computer Engineering",
    "Artificial Intelligence",
    "Full Stack Development",
    "Software Architecture",
    "Technology Leadership",
  ],
});
