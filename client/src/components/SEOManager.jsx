
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const BASE_URL = "https://project-unwind-mu.vercel.app";

const DEFAULT_DESCRIPTION =
  "Project Unwind is a privacy-focused mental wellness platform for journaling, wellness tracking, self-reflection, supportive AI conversations, and community connection.";

const PUBLIC_PAGES = {
  "/": {
    title: "Project Unwind | Mental Wellness & Self-Care",
    description: DEFAULT_DESCRIPTION,
  },

  "/info/about": {
    title: "About Us | Project Unwind",
    description:
      "Learn about Project Unwind, our mission to make mental wellness more accessible, and our privacy-focused approach to self-care.",
  },

  "/privacy": {
    title: "Privacy Policy | Project Unwind",
    description:
      "Read the Project Unwind Privacy Policy to understand how we handle personal information and support user privacy.",
  },

  "/terms": {
    title: "Terms of Service | Project Unwind",
    description:
      "Read the Project Unwind Terms of Service and understand the rules and responsibilities for using our platform.",
  },
};

function setMeta(attribute, key, content) {
  let element = document.head.querySelector(
    `meta[${attribute}="${key}"]`
  );

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
}

function setCanonical(url) {
  document.head
    .querySelectorAll('link[rel="canonical"]')
    .forEach((element) => element.remove());

  if (!url) return;

  const element = document.createElement("link");
  element.setAttribute("rel", "canonical");
  element.setAttribute("href", url);

  document.head.appendChild(element);
}

export default function SEOManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    const normalizedPath =
      pathname === "/"
        ? "/"
        : pathname.replace(/\/+$/, "");

    const page = PUBLIC_PAGES[normalizedPath];
    const isPublic = Boolean(page);

    const title = isPublic
      ? page.title
      : "Project Unwind";

    const description = isPublic
      ? page.description
      : DEFAULT_DESCRIPTION;

    const canonical = isPublic
      ? `${BASE_URL}${normalizedPath}`
      : null;

    document.title = title;

    setMeta("name", "description", description);

    setMeta(
      "name",
      "robots",
      isPublic
        ? "index, follow"
        : "noindex, nofollow"
    );

    setCanonical(canonical);

    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);

    setMeta("property", "og:site_name", "Project Unwind");

    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);

    let ogUrl = document.head.querySelector(
      'meta[property="og:url"]'
    );

    if (canonical) {
      setMeta("property", "og:url", canonical);
    } else if (ogUrl) {
      ogUrl.remove();
    }
  }, [pathname]);

  return null;
}
