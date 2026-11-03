export const siteBase = "https://keelantic.com/apps/34a-coach/";
export const sitePath = new URL(siteBase).pathname;
export const pagePaths = [
  "index.html",
  "datenschutz/index.html",
  "nutzungsbedingungen/index.html",
  "support/index.html",
  "konto-loeschen/index.html",
];
export const websiteFiles = [
  ...pagePaths,
  "404.html",
  ".htaccess",
  "sitemap.xml",
  "assets/styles.css",
];
export const redirectFiles = [...pagePaths, "404.html"];

export function pageUrl(path) {
  return new URL(path.replace(/index\.html$/, ""), siteBase).href;
}
