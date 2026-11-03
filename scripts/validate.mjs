import { access, readFile, readdir } from "node:fs/promises";
import { extname, join, relative } from "node:path";

import { pagePaths, pageUrl, siteBase, sitePath } from "./site-files.mjs";

const root = new URL("../", import.meta.url);
const requiredPaths = pagePaths;
const errors = [];
const canonicalBase = siteBase;

for (const path of requiredPaths) {
  const html = await readFile(new URL(path, root), "utf8");
  const compactHtml = html.replace(/\s+/g, " ");
  for (const required of [
    '<html lang="de">',
    'name="viewport"',
    "<main",
    "<h1>",
    "assets/styles.css",
  ]) {
    if (!html.includes(required)) errors.push(`${path}: missing ${required}`);
  }
  if (!/<title>[^<]+<\/title>/.test(html))
    errors.push(`${path}: missing title`);
  if (!/<meta\s+name="description"\s+content="[^\"]+"\s*\/?>/.test(html)) {
    errors.push(`${path}: missing description`);
  }
  if (!html.includes('<meta name="robots" content="index,follow" />')) {
    errors.push(`${path}: page is not indexable`);
  }
  if (
    !compactHtml.includes(
      `<link rel="canonical" href="${canonicalBase}${path === "index.html" ? "" : path.replace(/index\.html$/, "")}" />`,
    )
  ) {
    errors.push(`${path}: missing or incorrect canonical URL`);
  }
  if (/\[[^\]]*(?:ERFORDERLICH|FESTLEGEN|PRÜFEN)[^\]]*\]/.test(html)) {
    errors.push(`${path}: unresolved publication placeholder`);
  }
  if (/Unveröffentlich|Arbeitsentwurf|Stand des Entwurfs/.test(html)) {
    errors.push(`${path}: unresolved draft marker`);
  }
  if (/href="http:\/\//.test(html)) {
    errors.push(`${path}: insecure external link`);
  }
  for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
    if (/^(?:https:|mailto:|#)/.test(href)) continue;
    const publicTarget = new URL(href, new URL(path, siteBase));
    if (!publicTarget.pathname.startsWith(sitePath)) {
      errors.push(`${path}: local link escapes the app directory: ${href}`);
      continue;
    }
    const target = new URL(publicTarget.pathname.slice(sitePath.length), root);
    target.hash = "";
    target.search = "";
    if (target.pathname.endsWith("/")) target.pathname += "index.html";
    try {
      await access(target);
    } catch {
      errors.push(`${path}: missing local link target ${href}`);
    }
  }
}

const notFound = await readFile(new URL("404.html", root), "utf8");
for (const expected of [
  'name="robots" content="noindex"',
  `href="${sitePath}assets/styles.css"`,
  `href="${sitePath}"`,
]) {
  if (!notFound.includes(expected))
    errors.push(`404.html: missing ${expected}`);
}
const htaccess = await readFile(new URL(".htaccess", root), "utf8");
for (const directive of [
  "Options -Indexes",
  `ErrorDocument 404 ${sitePath}404.html`,
  "RewriteCond %{HTTPS} !=on",
  "RewriteRule ^ https://keelantic.com%{REQUEST_URI} [R=301,L,NE]",
]) {
  if (!htaccess.includes(directive))
    errors.push(`.htaccess: missing ${directive}`);
}
try {
  await access(new URL("robots.txt", root));
  errors.push(
    "robots.txt must stay at the main domain root, outside this deployment",
  );
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
const sitemap = await readFile(new URL("sitemap.xml", root), "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (match) => match[1],
);
const expectedUrls = requiredPaths.map(pageUrl);
if (
  sitemapUrls.length !== expectedUrls.length ||
  expectedUrls.some((url) => !sitemapUrls.includes(url))
) {
  errors.push(
    "sitemap.xml must contain exactly the five canonical app page URLs",
  );
}
const homepage = await readFile(new URL("index.html", root), "utf8");
if (
  !/<meta\s+name="google-site-verification"\s+content="[^\"]+"\s*\/>/.test(
    homepage,
  )
) {
  errors.push("index.html: Google ownership verification tag is missing");
}
for (const file of await walk(new URL(".", root))) {
  if (extname(file) !== ".html") continue;
  const html = await readFile(file, "utf8");
  if (/https?:\/\/[^/]+\.github\.io(?:\/|")/i.test(html)) {
    errors.push(
      `${relative(root.pathname, file)}: old GitHub website URL remains`,
    );
  }
  const ids = [...html.matchAll(/\sid="([^\"]+)"/g)].map((match) => match[1]);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicates.length)
    errors.push(
      `${relative(root.pathname, file)}: duplicate ids ${duplicates}`,
    );
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log("All public pages are structurally ready for publication.");
}

async function walk(directoryUrl) {
  const entries = await readdir(directoryUrl, { withFileTypes: true });
  const paths = [];
  for (const entry of entries) {
    if ([".git", "node_modules", "dist", ".deploy"].includes(entry.name))
      continue;
    const path = join(directoryUrl.pathname, entry.name);
    if (entry.isDirectory())
      paths.push(...(await walk(new URL(`${entry.name}/`, directoryUrl))));
    else paths.push(path);
  }
  return paths;
}
