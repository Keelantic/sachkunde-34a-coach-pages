import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";

import { pagePaths, pageUrl, siteBase, sitePath } from "./site-files.mjs";

const root = new URL("../", import.meta.url);
const baselineFile = new URL(".deploy/main-site-baseline.json", root);
const existingUrls = [
  "https://keelantic.com/",
  "https://keelantic.com/impressum/",
  "https://keelantic.com/robots.txt",
];

async function request(url) {
  const response = await fetch(url, {
    redirect: "manual",
    signal: AbortSignal.timeout(20000),
    headers: { "cache-control": "no-cache" },
  });
  return { response, text: await response.text() };
}

async function mainSiteSnapshot() {
  return Promise.all(
    existingUrls.map(async (url) => {
      const { response, text } = await request(url);
      if (response.status !== 200)
        throw new Error(`Existing page is unavailable: ${url}`);
      return {
        url,
        status: response.status,
        sha256: createHash("sha256").update(text).digest("hex"),
      };
    }),
  );
}

if (process.argv.includes("--record-baseline")) {
  const snapshot = await mainSiteSnapshot();
  await mkdir(new URL(".deploy/", root), { recursive: true });
  await writeFile(baselineFile, `${JSON.stringify(snapshot, null, 2)}\n`);
  console.log(
    "Recorded public main website, imprint and root robots.txt hashes.",
  );
} else {
  const results = await Promise.all(
    pagePaths.map(async (path) => {
      const url = pageUrl(path);
      const { response, text } = await request(url);
      if (response.status !== 200 || !text.includes("<main")) {
        throw new Error(`Public page failed: ${url} (${response.status})`);
      }
      const canonical = /<link\s+rel="canonical"\s+href="([^\"]+)"/.exec(
        text,
      )?.[1];
      if (canonical !== url)
        throw new Error(`Unexpected canonical URL: ${url}`);
      const stylesheet = /<link\s+rel="stylesheet"\s+href="([^\"]+)"/.exec(
        text,
      )?.[1];
      if (
        !stylesheet ||
        new URL(stylesheet, url).href !== `${siteBase}assets/styles.css`
      ) {
        throw new Error(`Unexpected stylesheet: ${url}`);
      }
      for (const [, href] of text.matchAll(/href="([^\"]+)"/g)) {
        if (/^(?:mailto:|#)/.test(href)) continue;
        const target = new URL(href, url);
        if (
          target.origin === new URL(siteBase).origin &&
          target.pathname.startsWith(sitePath)
        ) {
          if (
            !pagePaths.map(pageUrl).includes(target.href) &&
            target.href !== `${siteBase}assets/styles.css`
          ) {
            throw new Error(`Unexpected local link in ${url}: ${target.href}`);
          }
        }
      }
      return url;
    }),
  );
  const css = await request(`${siteBase}assets/styles.css`);
  if (
    css.response.status !== 200 ||
    !css.text.includes("prefers-color-scheme: dark")
  ) {
    throw new Error("The public stylesheet did not load.");
  }
  const sitemap = await request(`${siteBase}sitemap.xml`);
  if (
    sitemap.response.status !== 200 ||
    results.some((url) => !sitemap.text.includes(`<loc>${url}</loc>`))
  ) {
    throw new Error("The public sitemap is incomplete.");
  }
  const missing = await request(`${siteBase}__migration-check-missing-page__`);
  if (
    missing.response.status !== 404 ||
    !missing.text.includes("Seite nicht gefunden") ||
    !missing.text.includes(`${sitePath}assets/styles.css`)
  ) {
    throw new Error("The app-specific 404 page is not working.");
  }
  const insecure = await request(siteBase.replace("https:", "http:"));
  if (
    ![301, 302, 307, 308].includes(insecure.response.status) ||
    insecure.response.headers.get("location") !== siteBase
  ) {
    throw new Error("HTTP must redirect to the fixed HTTPS app URL.");
  }
  if (process.argv.includes("--check-baseline")) {
    const previous = JSON.parse(await readFile(baselineFile, "utf8"));
    const current = await mainSiteSnapshot();
    if (JSON.stringify(previous) !== JSON.stringify(current)) {
      throw new Error(
        "An existing main website, imprint or robots.txt response changed.",
      );
    }
  }
  console.log(
    "Five app pages, local links, CSS, sitemap, HTTPS and custom 404 passed.",
  );
}
