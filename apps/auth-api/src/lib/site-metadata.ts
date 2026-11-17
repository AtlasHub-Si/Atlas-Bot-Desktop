// No Vite-only import belongs in this file. `vite.config.ts` reads it, through the
// news artwork generator, while plain Node loads the config, and Node cannot
// resolve an `?url` specifier. That is why the font asset arrives as an argument
// from the root route instead of as an import here.

import type { LandingQuestion } from "./landing-faq";


export const OPENBOT_SITE_URL = "https://www.atlas-si.com/";
export const OPENBOT_SITE_TITLE = "AtlasBot — AtlasHub.SI";
export const OPENBOT_SITE_DESCRIPTION =
  "AtlasBot is an AI-agent application from ATLAS GLOBAL TECH LTD. Signed downloads and hosted services are subject to release approval.";
export const OPENBOT_SOCIAL_IMAGE_URL = `${OPENBOT_SITE_URL}og.png`;
/** The account `OPENBOT_LINKS.x` opens, which a shared card names. */
export const OPENBOT_X_HANDLE = ""; // No verified official AtlasBot social account yet.
const OPENBOT_REPOSITORY_URL = "https://github.com/AtlasHub-Si/Atlas-Bot-Desktop";
const OPENBOT_LICENSE_URL = "https://github.com/AtlasHub-Si/Atlas-Bot-Desktop/blob/main/LICENSE";
// One id for each entity, so that every page describes the same organization,
// site and app, and an assistant can join what the pages say about each.
const OPENBOT_ORGANIZATION_ID = `${OPENBOT_SITE_URL}#organization`;
const OPENBOT_WEBSITE_ID = `${OPENBOT_SITE_URL}#website`;
const OPENBOT_APPLICATION_ID = `${OPENBOT_SITE_URL}#app`;
/** Square, as schema.org wants for a publisher logo. */
export const OPENBOT_LOGO_URL = `${OPENBOT_SITE_URL}icon.png`;
export const OPENBOT_SOCIAL_IMAGE_ALT = "AtlasBot — AtlasHub.SI";

/** Institutional Atlas-SI Open Graph image, 1200x630. */
export const OPENBOT_SOCIAL_IMAGE_META = [
  { property: "og:image", content: OPENBOT_SOCIAL_IMAGE_URL },
  { property: "og:image:type", content: "image/png" },
  { property: "og:image:width", content: "1200" },
  { property: "og:image:height", content: "630" },
  { property: "og:image:alt", content: OPENBOT_SOCIAL_IMAGE_ALT },
] as const;

/** The site's card in the shape of `pageSocialImageMeta`, for a page that can have either. */
export const OPENBOT_SOCIAL_IMAGE_TAGS = {
  openGraph: OPENBOT_SOCIAL_IMAGE_META,
  twitter: [
    { name: "twitter:image", content: OPENBOT_SOCIAL_IMAGE_URL },
    { name: "twitter:image:alt", content: OPENBOT_SOCIAL_IMAGE_ALT },
  ],
} as const;

/** A page's own social card: a 1600x900 JPEG in `public/social/`, the size of the site's card. */
export interface PageSocialImage {
  /** The path from the site root, for example `/social/teams.jpg`. */
  path: string;
  alt: string;
}

/** The card of the terms, the privacy policy and the DPA. */
export const OPENBOT_LEGAL_SOCIAL_IMAGE: PageSocialImage = {
  path: "/social/legal.jpg",
  alt: "Plain terms. No surprises. OpenBot agents beside a paper map",
};

/**
 * The Open Graph and X tags of a page's own social card. The image URL uses the site that
 * serves the page, so a pull-request preview names an image that it has.
 */
export function pageSocialImageMeta(image: PageSocialImage, siteUrl: string) {
  const url = OPENBOT_SOCIAL_IMAGE_URL;
  // The legacy page art belongs to the earlier project; use the verified institutional OG.
  void image;
  void siteUrl;
  return {
    openGraph: [
      { property: "og:image", content: url },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: OPENBOT_SOCIAL_IMAGE_ALT },
    ],
    twitter: [
      { name: "twitter:image", content: url },
      { name: "twitter:image:alt", content: OPENBOT_SOCIAL_IMAGE_ALT },
    ],
  } as const;
}

// Atlas-SI is the canonical public brand; Account API staging is not the public website.
const OPENBOT_PRODUCTION_HOSTS = new Set(["atlas-si.com", "www.atlas-si.com"]);

/**
 * The site that the head tags of a page served at `pageUrl` name. Social sites fetch
 * `og:url` and `og:image` themselves and show no card when those answer 404. A
 * pull-request preview serves pages that are not the canonical institutional Atlas website,
 * so any host other than production names itself. Cloudflare marks preview URLs
 * `noindex`, so a preview canonical does not compete with production.
 */
export function siteUrlForPage(pageUrl: URL): string {
  return OPENBOT_PRODUCTION_HOSTS.has(pageUrl.hostname) ? OPENBOT_SITE_URL : `${pageUrl.origin}/`;
}

/** What the app's structured data names and that this file can not import: see the note at the top. */
export interface OpenBotApplicationFacts {
  /** The version of the newest release. */
  version: string;
  /** An absolute URL of a picture of the app. */
  screenshot: string;
}

export function openBotSoftwareApplication(facts: OpenBotApplicationFacts) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": OPENBOT_APPLICATION_ID,
    name: "AtlasBot",
    url: OPENBOT_SITE_URL,
    image: OPENBOT_SOCIAL_IMAGE_URL,
    description: OPENBOT_SITE_DESCRIPTION,
    applicationCategory: "DeveloperApplication",
    applicationSubCategory: "AI agent app",
    operatingSystem: [
      "macOS 13 or later (Apple silicon or Intel)",
      "Windows 10 or later (x64)",
      "Linux (x64 or arm64)",
    ],
    // The installers themselves: schema.org's `downloadUrl` is the file, not a page about it.

    // What people ask an assistant for. Keep it to what the released app does.
    featureList: [
      "Runs Codex, Claude Code, Gemini (Antigravity), Grok and OpenCode agents",
      "Uses your ChatGPT, Claude, Google AI Pro or Ultra, or Grok plan",
      "Any OpenAI-compatible model server, also one on your own computer",
      "Agents that work as a team and keep their workspace and history",
      "Chats, files and workspaces stay on your computer",
      "Source repository available under AtlasBot MIT license",
    ],
    softwareVersion: facts.version,
    screenshot: facts.screenshot,
    license: OPENBOT_LICENSE_URL,
    publisher: { "@id": OPENBOT_ORGANIZATION_ID },
    sameAs: [OPENBOT_REPOSITORY_URL],
  } as const;
}

export type OpenBotSoftwareApplication = ReturnType<typeof openBotSoftwareApplication>;

// Search engines read these two for the site name and the logo next to a result.
const OPENBOT_ORGANIZATION = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": OPENBOT_ORGANIZATION_ID,
  name: "ATLAS GLOBAL TECH LTD",
  url: OPENBOT_SITE_URL,
  logo: OPENBOT_LOGO_URL,
  sameAs: [OPENBOT_REPOSITORY_URL],
} as const;

const OPENBOT_WEBSITE = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": OPENBOT_WEBSITE_ID,
  name: "AtlasBot",
  url: OPENBOT_SITE_URL,
  publisher: { "@id": OPENBOT_ORGANIZATION_ID },
} as const;

export const OPENBOT_SECURITY_HEADERS = {
  "Permissions-Policy": "camera=(), geolocation=(), microphone=(), payment=(), usb=()",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
  "X-Robots-Tag": "noindex, nofollow", // Legacy Account API marketing is not the canonical Atlas website.
} as const;

/**
 * @param interLatinFont The hashed URL of Inter's upright latin range, the one font
 * file this site downloads. It is reached through two levels of CSS `@import`, so a
 * browser only learns of it after the stylesheet has parsed. That is late enough
 * that the first paint uses a fallback face and every line of text moves when Inter
 * replaces it. The caller passes the same hashed asset the `@font-face` rule asks
 * for, so the preload below is that request and not a second one.
 */
export function openBotRootHead(interLatinFont: string) {
  return {
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: OPENBOT_SITE_TITLE },
      { name: "description", content: OPENBOT_SITE_DESCRIPTION },
      { name: "application-name", content: "AtlasBot" },
      // The inherited Account API marketing/SEO surface is not the official Atlas-SI website.
      { name: "robots", content: "noindex,nofollow" },
      { name: "color-scheme", content: "dark" },
      { name: "theme-color", content: "#1a1a1a" },
    ],
    links: [
      {
        rel: "preload",
        as: "font" as const,
        type: "font/woff2",
        href: interLatinFont,
        crossorigin: "anonymous" as const,
      },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "icon", href: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
      { rel: "manifest", href: "/site.webmanifest" },
    ],
  };
}

/** The home page's own social card. Other pages without a card of their own keep the site's card. */
const OPENBOT_HOME_SOCIAL_IMAGE: PageSocialImage = {
  path: "/og.png",
  alt: OPENBOT_SOCIAL_IMAGE_ALT,
};

/** The text and the address of the home page in one language. */
export interface HomePageHead {
  title: string;
  description: string;
  questions: readonly LandingQuestion[];
  /** The path of this language's home page, such as `/`, `/pl` or `/pt`. */
  path: string;
  openGraphLocale: string;
  /** The home page in each language, for `hreflang` links. The first is also `x-default`. */
  alternates: readonly { hreflang: string; path: string }[];
}

export function openBotHomeHead(application: OpenBotSoftwareApplication, siteUrl: string, page: HomePageHead) {
  void application; // No release-homologated application structured data is published.
  const image = pageSocialImageMeta(OPENBOT_HOME_SOCIAL_IMAGE, siteUrl);
  const url = new URL(page.path, OPENBOT_SITE_URL).toString();
  const [fallback] = page.alternates;
  return {
    meta: [
      { title: OPENBOT_SITE_TITLE },
      { name: "description", content: OPENBOT_SITE_DESCRIPTION },
      { "script:ld+json": OPENBOT_ORGANIZATION },
      { "script:ld+json": OPENBOT_WEBSITE },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "AtlasBot" },
      { property: "og:locale", content: page.openGraphLocale },
      { property: "og:url", content: url },
      { property: "og:title", content: OPENBOT_SITE_TITLE },
      { property: "og:description", content: OPENBOT_SITE_DESCRIPTION },
      ...image.openGraph,
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: OPENBOT_SITE_TITLE },
      { name: "twitter:description", content: OPENBOT_SITE_DESCRIPTION },
      ...image.twitter,
      // Original FAQ is not approved for Atlas SEO; omit inherited structured data.
    ],
    links: [
      { rel: "canonical", href: url },
      ...page.alternates.map((alternate) => ({
        rel: "alternate",
        hreflang: alternate.hreflang,
        href: new URL(alternate.path, OPENBOT_SITE_URL).toString(),
      })),
      ...(fallback
        ? [{ rel: "alternate", hreflang: "x-default", href: new URL(fallback.path, OPENBOT_SITE_URL).toString() }]
        : []),
    ],
  };
}
