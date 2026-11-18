/**
 * Long-form public text. Items are plain strings: "## Heading", "- Bullet", or a paragraph.
 * {email} is replaced with the official contact address when the page is rendered.
 * Every language must have the same number of items in the same order (a test checks it).
 */
export interface LegalDocs {
  aboutBody: string[]; privacyBody: string[]; termsBody: string[]; contactText: string[];
  introTitle: string; introBody: string[]; introPoints: string[];
  faqExtra: { q: string; a: string }[];
  lastUpdated: string; copyEmail: string; emailCopied: string; emailLabel: string; guidesLink: string;
}
