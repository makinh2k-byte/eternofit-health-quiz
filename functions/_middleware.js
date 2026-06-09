/**
 * EternoFit – Cloudflare Pages Edge Middleware
 * Serves dynamic Open Graph / Twitter Card meta tags to social crawlers.
 * Regular browsers pass through to the SPA unchanged.
 */

import metaData from './_meta-data.json';

const { articleMap, productMap } = metaData;

// ── Crawler detection ────────────────────────────────────────────────────────
const CRAWLER_RE = /facebookexternalhit|Twitterbot|LinkedInBot|WhatsApp|TelegramBot|Slackbot|Discordbot|Googlebot|bingbot|Applebot|Pinterest|Snapchat|vkShare|W3C_Validator|preview|crawler|spider|bot/i;

// ── Static page meta ─────────────────────────────────────────────────────────
const STATIC_PAGES = {
  '/': {
    title: 'EternoFit | Evidence-Based Health & Fitness Programs',
    desc: 'Free health assessment, science-backed articles, and clinical-grade supplements to help you optimize your biology and build lasting health.',
    image: 'https://eternofit.com/og/og-homepage.jpg',
    url: 'https://eternofit.com/',
  },
  '/quiz': {
    title: 'Free Health Assessment | EternoFit',
    desc: 'Discover exactly what your body is missing in 60 seconds. Get your FREE personalized health report and supplement recommendations.',
    image: 'https://eternofit.com/og/og-quiz.jpg',
    url: 'https://eternofit.com/quiz',
  },
  '/marketplace': {
    title: 'Health & Wellness Supplements | EternoFit Marketplace',
    desc: 'Shop clinical-grade supplements for testosterone, sexual health, brain function, anti-aging, and more. All products vetted for safety and efficacy.',
    image: 'https://eternofit.com/og/og-marketplace.jpg',
    url: 'https://eternofit.com/marketplace',
  },
  '/articles': {
    title: 'Health Articles & Guides | EternoFit',
    desc: 'Science-backed articles on testosterone, sleep, stress, ADHD, fat loss, and more. Evidence-based health content written by medical professionals.',
    image: 'https://eternofit.com/og/og-articles.jpg',
    url: 'https://eternofit.com/articles',
  },
  '/tools': {
    title: 'Free Health Tools & Calculators | EternoFit',
    desc: 'Free diagnostic tools — BMI Calculator, Testosterone Quiz, Sleep Analyzer, Stress Checker, ADHD Screening, Longevity Score, and more.',
    image: 'https://eternofit.com/og/og-tools.jpg',
    url: 'https://eternofit.com/tools',
  },
  '/affiliate-program': {
    title: 'Earn 50% Commission | EternoFit Affiliate Program',
    desc: 'Join the EternoFit affiliate program and earn 50% commission on every digital wellness product sale you refer. Paid automatically via Gumroad.',
    image: 'https://eternofit.com/og/og-affiliate.jpg',
    url: 'https://eternofit.com/affiliate-program',
  },
  '/about': {
    title: 'About EternoFit | Evidence-Based Health & Fitness',
    desc: 'EternoFit was built to provide honest, evidence-based health content and tools. Learn about our mission, editorial standards, and team.',
    image: 'https://eternofit.com/og/og-homepage.jpg',
    url: 'https://eternofit.com/about',
  },
  '/contact': {
    title: 'Contact EternoFit | Get in Touch',
    desc: 'Have a question or feedback? Get in touch with the EternoFit team.',
    image: 'https://eternofit.com/og/og-homepage.jpg',
    url: 'https://eternofit.com/contact',
  },
};

// Tool-specific meta
const TOOL_META = {
  bmi:          { title: 'Free BMI Calculator | EternoFit Tools', desc: 'Calculate your BMI and get a personalised metabolic health score in 30 seconds. Free tool by EternoFit.' },
  testosterone: { title: 'Free Testosterone Quiz | EternoFit Tools', desc: 'Find out if your symptoms point to low testosterone with our evidence-based quiz. Get your free T-health score.' },
  realage:      { title: 'Real Age Calculator | EternoFit Tools', desc: 'How old is your body biologically? Answer 20 questions and find out your true biological age.' },
  longevity:    { title: 'Longevity Score | EternoFit Tools', desc: 'Calculate your personalised longevity score based on lifestyle, habits, and health markers. Free tool.' },
  sleep:        { title: 'Free Sleep Analyzer | EternoFit Tools', desc: 'Analyse your sleep quality, identify what\'s disrupting your rest, and get a personalised improvement plan.' },
  meal:         { title: 'Free Meal Planner | EternoFit Tools', desc: 'Build a personalised meal plan based on your goals, dietary preferences, and calorie targets. Free tool.' },
  stress:       { title: 'Free Stress Checker | EternoFit Tools', desc: 'Measure your stress and cortisol load with our evidence-based checker. Get personalised management strategies.' },
  adhd:         { title: 'Free ADHD Screening | EternoFit Tools', desc: 'Evidence-based ADHD screening for adults. Get a personalised focus profile and strategy recommendations.' },
  mental:       { title: 'Mental Health Wellness Assessment | EternoFit Tools', desc: 'A 10-question evidence-informed mental wellness check covering mood, anxiety, resilience, purpose, and self-care.' },
};

// ── Meta resolver ────────────────────────────────────────────────────────────
function resolveMeta(url) {
  const path = url.pathname.replace(/\/$/, '') || '/';
  const tool = url.searchParams.get('tool');

  // /tools?tool=xxx
  if (path === '/tools' && tool && TOOL_META[tool]) {
    return {
      ...TOOL_META[tool],
      image: 'https://eternofit.com/og/og-tools.jpg',
      url: `https://eternofit.com/tools?tool=${tool}`,
    };
  }

  // Static pages
  if (STATIC_PAGES[path]) return STATIC_PAGES[path];

  // /article/:slug
  const articleMatch = path.match(/^\/article\/([^/]+)$/);
  if (articleMatch) {
    const slug = articleMatch[1];
    const meta = articleMap[slug];
    if (meta) return { ...meta, url: `https://eternofit.com/article/${slug}` };
  }

  // /product/:slug
  const productMatch = path.match(/^\/product\/([^/]+)$/);
  if (productMatch) {
    const slug = productMatch[1];
    const meta = productMap[slug];
    if (meta) return { ...meta, url: `https://eternofit.com/product/${slug}` };
  }

  // Fallback — articles/products without a specific image fall back to articles/marketplace OG image
  const isArticle = path.startsWith('/article/');
  const isProduct = path.startsWith('/product/');
  return {
    ...STATIC_PAGES['/'],
    image: isArticle
      ? 'https://eternofit.com/og/og-articles.jpg'
      : isProduct
      ? 'https://eternofit.com/og/og-marketplace.jpg'
      : 'https://eternofit.com/og/og-homepage.jpg',
  };
}

// ── HTML generator ───────────────────────────────────────────────────────────
function buildHTML(meta) {
  const { title, desc, image, url } = meta;
  const safeTitle = title.replace(/"/g, '&quot;');
  const safeDesc = desc.replace(/"/g, '&quot;');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${safeTitle}</title>
  <meta name="description" content="${safeDesc}" />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${safeTitle}" />
  <meta property="og:description" content="${safeDesc}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="${url}" />
  <meta property="og:site_name" content="EternoFit" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${safeTitle}" />
  <meta name="twitter:description" content="${safeDesc}" />
  <meta name="twitter:image" content="${image}" />
  <meta name="twitter:site" content="@EternoFit" />

  <!-- Canonical -->
  <link rel="canonical" href="${url}" />

  <!-- Redirect real browsers to the SPA -->
  <script>window.location.href = window.location.href;</script>
</head>
<body>
  <p>${safeTitle}</p>
  <p>${safeDesc}</p>
</body>
</html>`;
}

// ── Middleware export ────────────────────────────────────────────────────────
export async function onRequest(context) {
  const { request, next } = context;
  const userAgent = request.headers.get('user-agent') || '';

  // Only intercept known social/search crawlers
  if (!CRAWLER_RE.test(userAgent)) {
    return next();
  }

  // Skip API routes
  const url = new URL(request.url);
  if (url.pathname.startsWith('/api/')) {
    return next();
  }

  const meta = resolveMeta(url);
  return new Response(buildHTML(meta), {
    status: 200,
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      'X-Robots-Tag': 'index, follow',
    },
  });
}
