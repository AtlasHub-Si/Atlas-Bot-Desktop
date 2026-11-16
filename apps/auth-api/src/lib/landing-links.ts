import type { FooterColumnId, FooterTextId } from "./site-text";

export const EXTERNAL_LINK_REL = "noopener noreferrer";

/** The installer each platform's download button starts: Apple silicon on macOS, x64 elsewhere. */
export const OPENBOT_DOWNLOAD_LINKS = {
  macos: "/download/macos/latest",
  windows: "/download/windows/latest",
  linux: "/download/linux/latest",
} as const;

/** The other installer of a platform that ships two architectures. Windows ships x64 only. */
export const OPENBOT_ALTERNATE_DOWNLOAD_LINKS = {
  macos: "/download/macos/latest?arch=x64",
  linux: "/download/linux/latest?arch=arm64",
} as const;

/**
 * The Android app as an APK, for a phone with no Google Play. It answers only while a version has
 * an APK (`ANDROID_APK_AVAILABLE` in ./android-apk.ts), so show the link only then.
 */
export const OPENBOT_ANDROID_APK_LINK = "/download/android/latest";

/** The pages that describe each installer: requirements, install steps and known limits. */
export const OPENBOT_DOWNLOAD_PAGE_LINKS = {
  hub: "/download",
  macos: "/download/macos",
  windows: "/download/windows",
  linux: "/download/linux",
  ios: "/download/ios",
  android: "/download/android",
} as const;

export const OPENBOT_LINKS = {
  /** The contact form page. */
  contact: "/contact",
  x: "https://x.com/OpenBot_",
  threads: "https://www.threads.com/@openbot.run",
  linkedin: "https://www.linkedin.com/company/openbot-si/",
  reddit: "https://www.reddit.com/r/OpenBot_/",
  instagram: "https://www.instagram.com/openbot.run/",
  tiktok: "https://www.tiktok.com/@openbot.run",
  facebook: "https://www.facebook.com/profile.php?id=61595425259628",
  /** A Redirect Rule in the openbot.run Cloudflare zone sends this to the current Discord invite. */
  discord: "https://discord.openbot.run",
  download: "#download",
  news: "/news",
  guides: "/guides",
  marketplace: "/marketplace",
  changelog: "/changelog",
  releases: "https://github.com/AtlasHub-Si/Atlas-Bot-Desktop/releases",
  repository: "https://github.com/AtlasHub-Si/Atlas-Bot-Desktop",
  license: "https://github.com/AtlasHub-Si/Atlas-Bot-Desktop/blob/main/LICENSE",
  privacy: "https://www.atlas-si.com/pt/privacy",
  documentation: "https://github.com/AtlasHub-Si/Atlas-Bot-Desktop#readme",
  troubleshooting: "https://github.com/AtlasHub-Si/Atlas-Bot-Desktop/blob/main/docs/TROUBLESHOOTING.md",
  /** GitHub Pages hosts the status page, so it stays up when Cloudflare does not. */
  status: "https://status.openbot.run",
  selfHostedServer: "https://github.com/AtlasHub-Si/Atlas-Bot-Desktop/blob/main/docs/self-hosted-server.md",
  dockerDocumentation: "https://github.com/AtlasHub-Si/Atlas-Bot-Desktop/blob/main/docs/docker.md",
  dockerInstallUbuntu: "https://docs.docker.com/engine/install/ubuntu/",
  architecture: "https://github.com/AtlasHub-Si/Atlas-Bot-Desktop#architecture",
  contributing: "https://github.com/AtlasHub-Si/Atlas-Bot-Desktop/blob/main/CONTRIBUTING.md",
  codex: "https://learn.chatgpt.com/docs/app-server",
  claude: "https://code.claude.com/docs/en/overview",
  anthropicAgents: "https://www.anthropic.com/engineering/building-effective-agents",
} as const;

/**
 * The name of a footer entry: a product or page name that stays the same in every language, or the
 * id of its text in `SiteText`.
 */
type FooterLabel = string | { readonly text: FooterTextId };

/**
 * One entry in a footer column. An internal entry carries a route, not a string,
 * so the footer can render it as a client navigation. It also fixes a link that
 * only worked on one page: "#download" on its own finds nothing on /news, because
 * there is no download section there for it to scroll to.
 */
export type FooterLink =
  | { readonly label: FooterLabel; readonly external: true; readonly href: string }
  | {
      readonly label: FooterLabel;
      readonly external: false;
      readonly to:
        | "/"
        | "/download"
        | "/news"
        | "/guides"
        | "/marketplace"
        | "/changelog"
        | "/compare"
        | "/providers"
        | "/teams"
        | "/pricing"
        | "/brand"
        | "/contact"
        | "/privacy-policy"
        | "/terms"
        | "/commercial-license"
        | "/dpa"
        | "/cla";
      readonly hash?: string;
    }
  | {
      readonly label: FooterLabel;
      readonly external: false;
      readonly to: "/compare/$slug" | "/providers/$slug";
      readonly slug: string;
    };

export interface FooterColumn {
  /** The column title, in `SiteText`. */
  readonly id: FooterColumnId;
  readonly links: readonly FooterLink[];
}

export const FOOTER_COLUMNS: readonly FooterColumn[] = [
  {
    id: "product",
    links: [
      { label: { text: "download" }, external: false, to: "/download" },
      { label: { text: "news" }, external: false, to: "/news" },
      { label: { text: "guides" }, external: false, to: "/guides" },
      { label: { text: "marketplace" }, external: false, to: "/marketplace" },
      { label: { text: "changelog" }, external: false, to: "/changelog" },
      { label: { text: "teams" }, external: false, to: "/teams" },
      { label: { text: "pricing" }, external: false, to: "/pricing" },
      { label: { text: "contact" }, external: false, to: "/contact" },
      { label: { text: "brand" }, external: false, to: "/brand" },
      { label: { text: "sourceCode" }, external: true, href: OPENBOT_LINKS.repository },
      { label: { text: "license" }, external: true, href: OPENBOT_LINKS.license },
      // Website-only Atlas privacy; separate Atlas account policies are pending.
      { label: { text: "privacy" }, external: true, href: "https://www.atlas-si.com/pt/privacy" },
      // This Atlas page explicitly distinguishes original terms from future Atlas account terms.
      { label: { text: "terms" }, external: true, href: "https://www.atlas-si.com/pt/terms" },
    ],
  },
  {
    id: "resources",
    links: [
      { label: { text: "documentation" }, external: true, href: OPENBOT_LINKS.documentation },
      { label: { text: "troubleshooting" }, external: true, href: OPENBOT_LINKS.troubleshooting },
      { label: { text: "selfHosted" }, external: true, href: OPENBOT_LINKS.selfHostedServer },
      { label: { text: "architecture" }, external: true, href: OPENBOT_LINKS.architecture },
      { label: { text: "contributing" }, external: true, href: OPENBOT_LINKS.contributing },
      { label: "Codex", external: true, href: OPENBOT_LINKS.codex },
      { label: "Claude Code", external: true, href: OPENBOT_LINKS.claude },
    ],
  },
  {
    id: "providers",
    links: [
      { label: "Claude Code", external: false, to: "/providers/$slug", slug: "claude-code" },
      { label: "Codex", external: false, to: "/providers/$slug", slug: "codex" },
      { label: "Gemini", external: false, to: "/providers/$slug", slug: "gemini" },
      { label: "Grok", external: false, to: "/providers/$slug", slug: "grok" },
      { label: "Cursor", external: false, to: "/providers/$slug", slug: "cursor" },
      { label: "OpenCode", external: false, to: "/providers/$slug", slug: "opencode" },
      { label: "Cline", external: false, to: "/providers/$slug", slug: "cline" },
      { label: { text: "localModels" }, external: false, to: "/providers/$slug", slug: "local-models" },
      { label: { text: "allProviders" }, external: false, to: "/providers" },
    ],
  },
];
