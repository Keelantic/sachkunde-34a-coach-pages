import { access, readFile, readdir } from "node:fs/promises";
import { extname, join, relative } from "node:path";

const root = new URL("../", import.meta.url);
const requiredPaths = [
  "index.html",
  "datenschutz/index.html",
  "nutzungsbedingungen/index.html",
  "support/index.html",
  "konto-loeschen/index.html",
];
const errors = [];
const canonicalBase = "https://keelantic.github.io/sachkunde-34a-coach-pages/";

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
    const target = new URL(href, new URL(path, root));
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

for (const file of await walk(new URL(".", root))) {
  if (extname(file) !== ".html") continue;
  const html = await readFile(file, "utf8");
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
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const path = join(directoryUrl.pathname, entry.name);
    if (entry.isDirectory())
      paths.push(...(await walk(new URL(`${entry.name}/`, directoryUrl))));
    else paths.push(path);
  }
  return paths;
}
