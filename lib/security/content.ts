import sanitizeHtml from "sanitize-html";

const PLACEHOLDER_COVER_IMAGE = "/placeholder.svg?height=600&width=1200";

const BLOG_ALLOWED_TAGS = [
  "p",
  "br",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "ul",
  "ol",
  "li",
  "blockquote",
  "pre",
  "code",
  "strong",
  "em",
  "u",
  "s",
  "hr",
  "a",
  "img",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
  "span",
  "div",
];

const BLOG_ALLOWED_ATTRIBUTES: sanitizeHtml.IOptions["allowedAttributes"] = {
  a: ["href", "name", "target", "rel", "title"],
  img: ["src", "alt", "title", "width", "height", "loading", "decoding"],
  "*": ["class", "id"],
};

export const sanitizeBlogHtml = (rawHtml: string): string => {
  return sanitizeHtml(rawHtml || "", {
    allowedTags: BLOG_ALLOWED_TAGS,
    allowedAttributes: BLOG_ALLOWED_ATTRIBUTES,
    allowedSchemes: ["http", "https", "mailto", "tel", "data"],
    allowProtocolRelative: false,
    enforceHtmlBoundary: true,
    transformTags: {
      a: (tagName, attribs) => {
        const href = attribs.href || "";
        const isExternal = /^https?:\/\//i.test(href);

        return {
          tagName,
          attribs: {
            ...attribs,
            rel: "noopener noreferrer nofollow",
            ...(isExternal ? { target: "_blank" } : {}),
          },
        };
      },
    },
  });
};

export const sanitizePlainText = (value: string, maxLength = 200): string => {
  const stripped = sanitizeHtml(value || "", {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();
  return stripped.slice(0, maxLength);
};

export const sanitizeSlug = (value: string): string => {
  return sanitizePlainText(value, 180)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "");
};

export const sanitizeCategories = (categories: unknown): string[] => {
  if (!Array.isArray(categories)) return ["Uncategorized"];

  const cleaned = categories
    .map((category) => sanitizePlainText(String(category), 60))
    .filter((category) => Boolean(category));

  return cleaned.length ? cleaned.slice(0, 10) : ["Uncategorized"];
};

export const normalizeCoverImage = (coverImage: unknown): string => {
  if (typeof coverImage !== "string" || !coverImage.trim())
    return PLACEHOLDER_COVER_IMAGE;

  if (coverImage.startsWith("/")) return coverImage;

  try {
    const parsed = new URL(coverImage);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.toString();
    }
  } catch {
    return PLACEHOLDER_COVER_IMAGE;
  }

  return PLACEHOLDER_COVER_IMAGE;
};

export const isPrivilegedRole = (role?: string | null): boolean => {
  const normalizedRole = (role || "").toLowerCase();
  return normalizedRole === "admin" || normalizedRole === "editor";
};
