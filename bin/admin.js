#!/usr/bin/env node

/**
 * wiz-theme admin dashboard
 *
 * Usage (from theme consumer's project root):
 *   npx wiz-theme admin
 *   npx wiz-theme admin --port 4242 --data ./src/data
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── CLI args ─────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
let PORT = 4242;
let customDataDir = null;
let customConsumerId = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--port' && args[i + 1]) { PORT = parseInt(args[i + 1]); i++; }
  if (args[i] === '--data' && args[i + 1]) { customDataDir = args[i + 1]; i++; }
  if ((args[i] === '--consumer' || args[i] === '--site') && args[i + 1]) { customConsumerId = args[i + 1]; i++; }
}

// ─── Resolve data root (contains quotes/ and authors/ subdirs) ───────────────
const CWD = process.cwd();

function findDataRoot() {
  if (customDataDir) return path.resolve(CWD, customDataDir);
  const candidates = [
    path.join(CWD, 'src/data'),
    path.join(CWD, 'playground/src/data'),
    path.join(CWD, 'data'),
  ];
  for (const c of candidates) {
    if (fs.existsSync(path.join(c, 'quotes'))) return c;
  }
  const fallback = path.join(CWD, 'src/data');
  fs.mkdirSync(path.join(fallback, 'quotes'), { recursive: true });
  fs.mkdirSync(path.join(fallback, 'authors'), { recursive: true });
  return fallback;
}

const DATA_ROOT = findDataRoot();
const QUOTES_DIR = path.join(DATA_ROOT, 'quotes');
const AUTHORS_DIR = path.join(DATA_ROOT, 'authors');

// Ensure authors dir exists
if (!fs.existsSync(AUTHORS_DIR)) fs.mkdirSync(AUTHORS_DIR, { recursive: true });

const ADMIN_UI = path.join(__dirname, 'admin-ui.html');

function detectConsumerId() {
  if (customConsumerId) return customConsumerId.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '_');
  if (process.env.PUBLIC_FIREBASE_CONSUMER_ID) return process.env.PUBLIC_FIREBASE_CONSUMER_ID.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '_');
  if (process.env.PUBLIC_SITE_ID) return process.env.PUBLIC_SITE_ID.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '_');
  try {
    const pkgPath = path.join(CWD, 'package.json');
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      if (pkg.name) {
        const clean = pkg.name.replace(/^@[^/]+\//, '').replace(/[^a-z0-9_-]/gi, '_').toLowerCase();
        if (clean && clean !== 'wiz-theme') return clean;
      }
    }
  } catch {}
  return 'wisdom';
}

const CONSUMER_ID = detectConsumerId();

console.log(`\n🧠 Wiz Theme Admin`);
console.log(`📁 Data root  : ${DATA_ROOT}`);
console.log(`   ├ quotes  : ${QUOTES_DIR}`);
console.log(`   └ authors : ${AUTHORS_DIR}`);
console.log(`🏷️ Consumer ID: ${CONSUMER_ID}`);
console.log(`🌐 Dashboard  : http://localhost:${PORT}\n`);

// ─── Helpers ──────────────────────────────────────────────────────────────────
function readAll(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .map(f => { try { return JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); } catch { return null; } })
    .filter(Boolean);
}

function nextQuoteId() {
  const files = fs.readdirSync(QUOTES_DIR).filter(f => f.endsWith('.json'));
  const nums = files.map(f => parseInt(f.replace(/\D/g, '')) || 0);
  const max = nums.length ? Math.max(...nums) : 0;
  return `q${String(max + 1).padStart(3, '0')}`;
}

function toSlug(s) {
  return s.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function computeQuoteCounts(quotes, authors) {
  const counts = {};
  for (const q of quotes) {
    const slug = q.authorSlug || toSlug(q.author || '');
    counts[slug] = (counts[slug] || 0) + 1;
  }
  return authors.map(a => ({ ...a, quoteCount: counts[a.slug] || 0 }));
}

function json(res, data, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => { try { resolve(JSON.parse(body)); } catch { resolve({}); } });
    req.on('error', reject);
  });
}

// ─── Router ───────────────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;
  const method = req.method;

  // CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  // ── Serve admin UI ──────────────────────────────────────────────────────────
  if ((method === 'GET' || method === 'HEAD') && (pathname === '/' || pathname === '/index.html')) {
    if (!fs.existsSync(ADMIN_UI)) {
      res.writeHead(404);
      return res.end('Admin UI not found. Ensure admin-ui.html is in the bin/ directory.');
    }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    if (method === 'HEAD') return res.end();
    return res.end(fs.readFileSync(ADMIN_UI, 'utf8'));
  }

  // ════════════════════════════════════════════════════════════════════════════
  // QUOTES API
  // ════════════════════════════════════════════════════════════════════════════

  // GET /api/quotes
  if (method === 'GET' && pathname === '/api/quotes') {
    return json(res, readAll(QUOTES_DIR));
  }

  // POST /api/quotes (create)
  if (method === 'POST' && pathname === '/api/quotes') {
    const body = await parseBody(req);
    const id = body.id || nextQuoteId();
    const quote = { id, ...body };
    fs.writeFileSync(path.join(QUOTES_DIR, `${id}.json`), JSON.stringify(quote, null, 2));
    return json(res, quote, 201);
  }

  const quoteIdMatch = pathname.match(/^\/api\/quotes\/([^/]+)$/);

  // PUT /api/quotes/:id
  if (method === 'PUT' && quoteIdMatch) {
    const id = quoteIdMatch[1];
    const body = await parseBody(req);
    const quote = { ...body, id };
    fs.writeFileSync(path.join(QUOTES_DIR, `${id}.json`), JSON.stringify(quote, null, 2));
    return json(res, quote);
  }

  // PATCH /api/quotes/:id
  if (method === 'PATCH' && quoteIdMatch) {
    const id = quoteIdMatch[1];
    const filePath = path.join(QUOTES_DIR, `${id}.json`);
    if (!fs.existsSync(filePath)) return json(res, { error: 'Not found' }, 404);
    const existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const body = await parseBody(req);
    const updated = { ...existing, ...body, id };
    fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));
    return json(res, updated);
  }

  // DELETE /api/quotes/:id
  if (method === 'DELETE' && quoteIdMatch) {
    const id = quoteIdMatch[1];
    const filePath = path.join(QUOTES_DIR, `${id}.json`);
    if (!fs.existsSync(filePath)) return json(res, { error: 'Not found' }, 404);
    fs.unlinkSync(filePath);
    return json(res, { deleted: id });
  }

  // POST /api/quotes/bulk-delete
  if (method === 'POST' && pathname === '/api/quotes/bulk-delete') {
    const { ids } = await parseBody(req);
    const deleted = [];
    for (const id of (ids || [])) {
      const fp = path.join(QUOTES_DIR, `${id}.json`);
      if (fs.existsSync(fp)) { fs.unlinkSync(fp); deleted.push(id); }
    }
    return json(res, { deleted });
  }

  // POST /api/quotes/bulk-tag
  if (method === 'POST' && pathname === '/api/quotes/bulk-tag') {
    const { ids, addTags, removeTags } = await parseBody(req);
    const updated = [];
    for (const id of (ids || [])) {
      const fp = path.join(QUOTES_DIR, `${id}.json`);
      if (!fs.existsSync(fp)) continue;
      const q = JSON.parse(fs.readFileSync(fp, 'utf8'));
      let tags = Array.isArray(q.tags) ? [...q.tags] : [];
      if (addTags) tags = [...new Set([...tags, ...addTags])];
      if (removeTags) tags = tags.filter(t => !removeTags.includes(t));
      q.tags = tags;
      fs.writeFileSync(fp, JSON.stringify(q, null, 2));
      updated.push(id);
    }
    return json(res, { updated });
  }

  // ════════════════════════════════════════════════════════════════════════════
  // AUTHORS API
  // ════════════════════════════════════════════════════════════════════════════

  // GET /api/authors
  if (method === 'GET' && pathname === '/api/authors') {
    const quotes = readAll(QUOTES_DIR);
    const authors = readAll(AUTHORS_DIR);
    return json(res, computeQuoteCounts(quotes, authors));
  }

  // POST /api/authors (create)
  if (method === 'POST' && pathname === '/api/authors') {
    const body = await parseBody(req);
    const slug = body.slug || toSlug(body.name || 'author');
    const author = { id: slug, slug, ...body };
    fs.writeFileSync(path.join(AUTHORS_DIR, `${slug}.json`), JSON.stringify(author, null, 2));
    return json(res, author, 201);
  }

  const authorIdMatch = pathname.match(/^\/api\/authors\/([^/]+)$/);

  // GET /api/authors/:slug
  if (method === 'GET' && authorIdMatch) {
    const slug = authorIdMatch[1];
    const fp = path.join(AUTHORS_DIR, `${slug}.json`);
    if (!fs.existsSync(fp)) return json(res, { error: 'Not found' }, 404);
    return json(res, JSON.parse(fs.readFileSync(fp, 'utf8')));
  }

  // PUT /api/authors/:slug
  if (method === 'PUT' && authorIdMatch) {
    const slug = authorIdMatch[1];
    const body = await parseBody(req);
    const newSlug = body.slug || slug;
    const author = { ...body, id: newSlug, slug: newSlug };

    // If slug changed, rename file and update all quotes
    if (newSlug !== slug) {
      const oldFp = path.join(AUTHORS_DIR, `${slug}.json`);
      if (fs.existsSync(oldFp)) fs.unlinkSync(oldFp);
      // Update all quotes referencing old slug
      const quotes = readAll(QUOTES_DIR);
      for (const q of quotes) {
        if (q.authorSlug === slug) {
          q.authorSlug = newSlug;
          q.author = body.name || q.author;
          fs.writeFileSync(path.join(QUOTES_DIR, `${q.id}.json`), JSON.stringify(q, null, 2));
        }
      }
    }

    fs.writeFileSync(path.join(AUTHORS_DIR, `${newSlug}.json`), JSON.stringify(author, null, 2));
    return json(res, author);
  }

  // DELETE /api/authors/:slug
  if (method === 'DELETE' && authorIdMatch) {
    const slug = authorIdMatch[1];
    const fp = path.join(AUTHORS_DIR, `${slug}.json`);
    if (!fs.existsSync(fp)) return json(res, { error: 'Not found' }, 404);
    // Check if any quotes use this author
    const quotes = readAll(QUOTES_DIR);
    const linked = quotes.filter(q => q.authorSlug === slug).map(q => q.id);
    if (linked.length) {
      return json(res, { error: `Author is referenced by ${linked.length} quote(s): ${linked.join(', ')}. Reassign quotes first.` }, 409);
    }
    fs.unlinkSync(fp);
    return json(res, { deleted: slug });
  }

  // ════════════════════════════════════════════════════════════════════════════
  // META
  // ════════════════════════════════════════════════════════════════════════════

  // GET /api/meta
  if (method === 'GET' && pathname === '/api/meta') {
    const quotes = readAll(QUOTES_DIR);
    const authors = readAll(AUTHORS_DIR);
    const tags = [...new Set(quotes.flatMap(q => q.tags || []))].sort();
    const categories = [...new Set(quotes.map(q => q.category).filter(Boolean))].sort();
    const moods = [...new Set(quotes.map(q => q.mood).filter(Boolean))].sort();
    const authorNames = authors.map(a => ({ name: a.name, slug: a.slug }));
    return json(res, { tags, categories, moods, authors: authorNames, dataRoot: DATA_ROOT, consumerId: CONSUMER_ID });
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`✅ Admin server running at http://localhost:${PORT}`);
  console.log(`   Press Ctrl+C to stop.\n`);
});
