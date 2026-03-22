export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Emmanuel Adoum",
  url: "https://emmanueladoum.com",
  image: "https://emmanueladoum.com/images/emma-head.png",
  jobTitle: "Full Stack Developer | AI Engineer | Software Engineer",
  sameAs: [
    "https://github.com/adoumouangnamouemmanuel",
    "https://linkedin.com/in/emmanueladoum",
    "https://twitter.com/emmanueladoum",
  ],
  description:
    "Full Stack Developer & AI Engineer specializing in React, Next.js, Node.js, Python, Machine Learning, and cloud technologies. Building scalable web applications and intelligent AI solutions with modern tech stack.",
};

export const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Emmanuel Adoum Portfolio",
  url: "https://emmanueladoum.com",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://emmanueladoum.com/blog?search={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export function getBreadcrumbSchema(
  items: Array<{ name: string; url: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
