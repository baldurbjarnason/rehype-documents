import { toc as parseToC } from "../src/epub/nav.js";
import { render } from "../src/epub/stringify/stringify-nav.js";
import { File, Base, Names } from "../src/zip/index.js";
import { readFile } from "fs/promises";
import * as path from "path";
import tap from "tap";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename).replace(process.cwd() + "/", "");

let results = [];

tap.test("parseToC - epub2", async (test) => {
  const chapter = await readFile(
    path.join(__dirname, "./fixtures/demo-epub/pg55456-images/OEBPS/toc.ncx"),
    "utf8"
  );
  const result = await parseToC(
    chapter,
    "https://example.com/fixtures/demo-epub/pg55456-images/OEBPS/toc.ncx"
  );
  test.matchSnapshot(result, "parseToC - epub2");
});
tap.test("parseToC - epub3", async (test) => {
  const chapter = await readFile(
    path.join(
      __dirname,
      "./fixtures/demo-epub/childrens-literature/EPUB/nav.xhtml"
    ),
    "utf8"
  );
  const result = await parseToC(
    chapter,
    "https://example.com/fixtures/demo-epub/childrens-literature/EPUB/nav.xhtml"
  );
  results = results.concat(result);
  test.matchSnapshot(result, "parseToC - epub3");
});

tap.test("parseToC - epub3 - 2", async (test) => {
  const result = await parseToC(
    `<?xml version="1.0" encoding="utf-8"?>
  <!DOCTYPE html>
  <html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops"
    lang="html-lang">
    <head>
      <title>Children's Literature</title>
      <link href="css/epub.css" rel="stylesheet" type="text/css"/>
      <link href="css/nav.css" rel="stylesheet" type="text/css"/>
    </head>
    <body>
      <nav epub:type="toc" id="toc">
        <ol id="tocList">
          <li id="np-313">
            <a href="s04.xhtml#pgepubid00492">SECTION IV FAIRY STORIES—MODERN FANTASTIC TALES</a>
          </li>
        </ol>
      </nav>
    </body>
  </html>
  `,
    "https://example.com/fixtures/demo-epub/childrens-literature/EPUB/nav.xhtml"
  );
  results = results.concat(result);
  test.matchSnapshot(result, "parseToC - epub3 - 2");
});
tap.test("parseToC - epub3 - 3", async (test) => {
  const result = await parseToC(
    `<?xml version="1.0" encoding="utf-8"?>
  <!DOCTYPE html>
  <html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
    <head>
      <title>Children's Literature</title>
      <link href="css/epub.css" rel="stylesheet" type="text/css"/>
      <link href="css/nav.css" rel="stylesheet" type="text/css"/>
    </head>
    <body>
      <nav epub:type="toc" id="toc" xml:lang="en">
        <h2>THE CONTENTS</h2>
        <ol id="tocList">
          <li id="np-313">
            <a href="s04.xhtml#pgepubid00492">SECTION IV FAIRY STORIES—MODERN FANTASTIC TALES</a>
          </li>
        </ol>
      </nav>
    </body>
  </html>
  `,
    "https://example.com/fixtures/demo-epub/childrens-literature/EPUB/nav.xhtml"
  );
  results = results.concat(result);
  test.matchSnapshot(result, "parseToC - epub3 - 3");
});

tap.test("render ToC - epub2", async (test) => {
  let counter = 0;

  function id() {
    counter = counter + 1;
    return counter + "_id";
  }

  const names = new Names(id);
  const base = new Base(
    {
      base: "http://test.example.com/",
      upload: "http://upload.example.com/",
    },
    { names }
  );
  const file = new File({
    value: results[0],
    path: "OEBPS/toc.ncx",
    base,
    id: names.id("OEBPS/toc.ncx"),
  });
  const result = render(file, { metadata: { inLanguage: "en" } });
  test.matchSnapshot(result, "render ToC - epub2");
});
