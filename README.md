# Scraper demo: books.toscrape.com → CSV

A small, dependency-free Node 18+ scraper, written as a portfolio sample.
It runs against [books.toscrape.com](https://books.toscrape.com), a public sandbox site made for scraping practice.

- Follows pagination until the last page, or stops after `maxPages`
- Retries with backoff, waits between requests, and sends an honest user agent
- Writes clean CSV (title, price, rating 1–5, stock, URL)

```
node scrape.mjs        # all 50 pages, about 1000 books
node scrape.mjs 3      # first 3 pages only
```

Sample output: `books.csv` (60 rows).

Built with AI assistance and reviewed by a human.
