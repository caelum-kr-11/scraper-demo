// Demo scraper: collects every book from books.toscrape.com (a public sandbox
// built for scraping practice) and writes books.csv. No dependencies, Node 18+.
// Usage: node scrape.mjs [maxPages]
import { writeFileSync } from 'node:fs';

const BASE = 'https://books.toscrape.com/catalogue/';
const maxPages = Number(process.argv[2] ?? Infinity);
const RATINGS = { One: 1, Two: 2, Three: 3, Four: 4, Five: 5 };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url, tries = 3) {
  for (let i = 1; ; i++) {
    try {
      const res = await fetch(url, { headers: { 'user-agent': 'portfolio-demo-scraper' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    } catch (err) {
      if (i >= tries) throw err;
      await sleep(1000 * i); // simple backoff
    }
  }
}

const decode = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const csv = (v) => `"${String(v).replace(/"/g, '""')}"`;

const rows = [];
let page = 1;
let next = 'page-1.html';
while (next && page <= maxPages) {
  const html = await get(BASE + next);
  for (const card of html.split('<article class="product_pod">').slice(1)) {
    rows.push({
      title: decode(card.match(/title="([^"]+)"/)[1]),
      price_gbp: card.match(/£([\d.]+)/)[1],
      rating: RATINGS[card.match(/star-rating (\w+)/)[1]],
      in_stock: /In stock/.test(card),
      url: BASE + card.match(/href="([^"]+)"/)[1],
    });
  }
  next = html.match(/<li class="next"><a href="([^"]+)"/)?.[1];
  console.error(`page ${page}: ${rows.length} books so far`);
  page++;
  await sleep(300); // be polite
}

const header = Object.keys(rows[0]);
writeFileSync('books.csv', [header.join(','), ...rows.map((r) => header.map((k) => csv(r[k])).join(','))].join('\n') + '\n');
console.error(`wrote ${rows.length} rows to books.csv`);
