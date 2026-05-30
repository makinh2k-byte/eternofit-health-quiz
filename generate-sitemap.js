import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read files directly as text to avoid issues with ES imports of React components if any.
// Actually, data/products.js and data/articles.js seem pure. Let's just import them.
import { products } from './src/data/products.js';
import { articles } from './src/data/articles.js';

const SITE_URL = 'https://eternofit.com';

const staticRoutes = [
  '/',
  '/articles',
  '/marketplace',
  '/tools',
  '/tools?tool=bmi',
  '/tools?tool=testosterone',
  '/tools?tool=realage',
  '/tools?tool=longevity',
  '/tools?tool=sleep',
  '/tools?tool=meal',
  '/tools?tool=stress',
  '/quiz',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/affiliate'
];

// Extract unique categories
const categorySet = new Set(products.map(p => p.category).filter(Boolean));
const categories = Array.from(categorySet);

let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

const addUrl = (url) => {
  sitemap += `  <url>\n    <loc>${SITE_URL}${url.replace(/&/g, '&amp;')}</loc>\n    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
};

staticRoutes.forEach(addUrl);

// Add marketplace categories
categories.forEach(cat => {
  addUrl(`/marketplace?category=${encodeURIComponent(cat)}`);
});

// Add articles
articles.forEach(art => {
  addUrl(`/article/${art.id}`);
});

sitemap += `</urlset>`;

const publicPath = path.join(__dirname, 'public', 'sitemap.xml');
fs.writeFileSync(publicPath, sitemap);
console.log('sitemap.xml generated successfully at', publicPath);
