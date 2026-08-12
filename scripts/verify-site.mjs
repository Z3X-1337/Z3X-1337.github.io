import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve, relative, dirname, extname, normalize } from 'node:path';

const root = process.cwd();
const ignored = new Set(['.git', 'node_modules']);
const errors = [];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (ignored.has(entry.name)) continue;
    const target = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(target));
    if (entry.isFile()) files.push(target);
  }
  return files;
}

function isExternal(href) {
  return /^(?:https?:|mailto:|tel:|#|data:|javascript:)/i.test(href);
}

function resolveHref(file, href) {
  const clean = href.split('#')[0].split('?')[0];
  if (!clean) return null;
  const target = clean.startsWith('/')
    ? resolve(root, `.${clean}`)
    : resolve(dirname(file), clean);
  if (extname(target)) return target;
  return resolve(target, 'index.html');
}

const files = await walk(root);
const htmlFiles = files.filter((file) => extname(file) === '.html');
const titles = new Map();

for (const file of htmlFiles) {
  const source = await readFile(file, 'utf8');
  const display = relative(root, file).replaceAll('\\', '/');
  const title = source.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim();
  const description = source.match(/<meta\s+name="description"\s+content="([^"]+)"\s*\/?/i)?.[1]?.trim();

  if (!title) errors.push(`${display}: missing <title>`);
  if (!description) errors.push(`${display}: missing meta description`);
  if (title) {
    if (titles.has(title)) errors.push(`${display}: duplicates title used by ${titles.get(title)}`);
    titles.set(title, display);
  }
  if (!source.includes('<main')) errors.push(`${display}: missing main landmark`);
  if (!source.includes('class="skip-link"')) errors.push(`${display}: missing skip link`);

  const hrefs = [...source.matchAll(/\s(?:href|src)="([^"]+)"/gi)].map((match) => match[1]);
  for (const href of hrefs) {
    if (isExternal(href)) continue;
    const target = resolveHref(file, href);
    if (!target) continue;
    try {
      const info = await stat(target);
      if (info.isDirectory()) errors.push(`${display}: ${href} resolves to a directory`);
    } catch {
      errors.push(`${display}: broken internal reference ${href}`);
    }
  }
}

if (errors.length) {
  console.error(`Static verification found ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log(`Static verification passed for ${htmlFiles.length} HTML document(s).`);
}
