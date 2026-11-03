import { createServer } from "node:http";
import { readFile } from "node:fs/promises";

import { sitePath, websiteFiles } from "./site-files.mjs";

const root = new URL("../", import.meta.url);
const types = { css: "text/css", html: "text/html", xml: "application/xml" };
createServer(async (request, response) => {
  const pathname = new URL(request.url, "http://localhost").pathname;
  if (pathname === "/") {
    response.writeHead(302, { location: sitePath }).end();
    return;
  }
  const relative = pathname.startsWith(sitePath)
    ? pathname.slice(sitePath.length)
    : "";
  const file =
    relative.endsWith("/") || !relative ? `${relative}index.html` : relative;
  const allowed =
    pathname.startsWith(sitePath) &&
    file !== ".htaccess" &&
    websiteFiles.includes(file);
  const target = allowed ? file : "404.html";
  const content = await readFile(new URL(target, root));
  response
    .writeHead(allowed ? 200 : 404, {
      "content-type": `${types[target.split(".").pop()] ?? "text/plain"}; charset=utf-8`,
    })
    .end(content);
}).listen(4173, "127.0.0.1", () => {
  console.log(`Preview: http://127.0.0.1:4173${sitePath}`);
});
