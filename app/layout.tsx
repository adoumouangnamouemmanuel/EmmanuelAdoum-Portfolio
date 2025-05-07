import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import "./globals.css";
import { ToastProvider } from "@/components/ui/ToastProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Emmanuel Adoum | Portfolio",
  icons: {
    icon: "/images/emma-head.png",
    shortcut: "/images/emma-head.png",
  },
  keywords: [
    "Emmanuel Adoum",
    "Adoum Ouang-Namou Emmanuel",
    "Portfolio",
    "Web Developer",
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Express",
    "MongoDB",
    "PostgreSQL",
    "Tailwind CSS",
    "CSS",
    "HTML",
    "UI/UX Design",
    "Responsive Design",
    "Web Design",
    "Web Development",
    "Software Development",
    "Software Engineering",
    "Agile",
    "Scrum",
    "Git",
    "GitHub",
    "Version Control",
    "API Development",
    "REST",
    "GraphQL",
    "Microservices",
    "Cloud Computing",
    "AWS",
    "Azure",
    "Google Cloud",
    "DevOps",
    "CI/CD",
    "Docker",
    "Kubernetes",
    "Testing",
    "Unit Testing",
    "Integration Testing",
    "End-to-End Testing",
    "Test-Driven Development",
    "TDD",
    "Behavior-Driven Development",
    "AI",
    "Machine Learning",
    "Data Science",
    "Data Analysis",
    "Data Visualization",
    "Data Engineering",
    "Big Data",
    "Data Mining",
    "Data Warehousing",
    "Data Modeling",
    "Data Architecture",
    "Data Governance",
    "Data Quality",
    "Data Security",
    "Data Privacy",
    "Data Ethics",
    "Data Management",
  ],
  authors: [
    {
      name: "Emmanuel Adoum",
      url: "https://www.linkedin.com/in/ouang-namou-emmanuel-adoum",
    },
  ],
  creator: "Emmanuel Adoum",
  publisher: "Emmanuel Adoum",
  openGraph: {
    title: "Emmanuel Adoum | Portfolio",
    description:
      "A professional portfolio showcasing my skills and projects as a web developer.",
    url: "https://adoumouangnamouemmanuel.vercel.app",
    siteName: "Emmanuel Adoum | Portfolio",
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
    title: "Emmanuel Adoum | Portfolio",
    description:
      "A professional portfolio showcasing my skills and projects as a web developer.",
    images: ["/emma.png"],
    creator: "@AdoumOuangnamou",
  },
  description: "A professional portfolio showcasing my skills and projects",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider children={children}/>
          <Footer />
          </ThemeProvider>
          
      </body>
    </html>
  );
}
