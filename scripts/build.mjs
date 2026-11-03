import { copyFile, lstat, mkdir, rm } from "node:fs/promises";
import { dirname } from "node:path";

import { redirectFiles, websiteFiles } from "./site-files.mjs";

const root = new URL("../", import.meta.url);
const legacy = process.argv.includes("--legacy");
const source = legacy ? new URL("legacy-pages/", root) : root;
const output = new URL(
  legacy ? "dist/github-redirects/" : "dist/strato/",
  root,
);

// Only a generated, local directory is removed. No remote sync/delete is performed.
await rm(output, { recursive: true, force: true });
for (const path of legacy ? redirectFiles : websiteFiles) {
  const input = new URL(path, source);
  if (!(await lstat(input)).isFile()) {
    throw new Error(`Refusing to publish a non-regular file: ${path}`);
  }
  const target = new URL(path, output);
  await mkdir(dirname(target.pathname), { recursive: true });
  await copyFile(input, target);
}
console.log(
  `Built ${legacy ? "GitHub redirect" : "STRATO website"} files only.`,
);
