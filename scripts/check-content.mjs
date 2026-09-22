import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const contentRoot = path.join(process.cwd(), "content");
const publicRoot = path.join(process.cwd(), "public");
const contentKinds = ["projects", "notes", "downloads", "topics"];
const staticRoutes = new Set(["/", "/about", "/copyright", "/disclaimer", "/downloads", "/notes", "/privacy", "/projects", "/resume", "/topics"]);

function findMdxFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return findMdxFiles(entryPath);
    return entry.isFile() && entry.name.endsWith(".mdx") ? [entryPath] : [];
  });
}

function fail(message) {
  throw new Error(`Content check failed: ${message}`);
}

const publishedRoutes = new Set(staticRoutes);
const files = contentKinds.flatMap((kind) => findMdxFiles(path.join(contentRoot, kind)).map((filePath) => ({ kind, filePath })));

for (const { kind, filePath } of files) {
  const { data } = matter(fs.readFileSync(filePath, "utf8"));
  const relativePath = path.relative(process.cwd(), filePath);
  const slug = data.slug;

  if (typeof data.title !== "string" || data.title.trim() === "") fail(`${relativePath} needs a title`);
  if (typeof slug !== "string" || !/^[a-z0-9-]+$/.test(slug)) fail(`${relativePath} needs a kebab-case slug`);
  if (path.basename(filePath, ".mdx") !== slug) fail(`${relativePath} slug must match its filename`);
  if (data.status !== "draft" && data.status !== "published") fail(`${relativePath} status must be draft or published`);

  if (data.status === "published") {
    const route = kind === "projects" ? `/projects/${slug}` : kind === "notes" ? `/notes/${slug}` : kind === "downloads" ? `/downloads/${slug}` : "/topics";
    publishedRoutes.add(route);
  }

  if (kind === "downloads" && data.status === "published") {
    if (typeof data.downloadPath !== "string" || !data.downloadPath.startsWith("/files/")) fail(`${relativePath} needs a public downloadPath`);
    if (!fs.existsSync(path.join(publicRoot, data.downloadPath.slice(1)))) fail(`${relativePath} points to a missing public file`);
  }
}

for (const { filePath } of files) {
  const relativePath = path.relative(process.cwd(), filePath);
  const source = fs.readFileSync(filePath, "utf8");
  const links = source.matchAll(/\]\((\/[^)\s#?]+)(?:[?#][^)]*)?\)/g);
  for (const match of links) {
    const target = match[1];
    if (target.startsWith("/files/")) {
      if (!fs.existsSync(path.join(publicRoot, target.slice(1)))) fail(`${relativePath} links to missing ${target}`);
    } else if (!publishedRoutes.has(target)) {
      fail(`${relativePath} links to an unavailable public route: ${target}`);
    }
  }
}

console.log(`Content check passed for ${files.length} MDX files.`);
