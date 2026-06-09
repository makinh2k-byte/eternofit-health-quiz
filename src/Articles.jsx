import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ArrowLeft, Clock, User, ChevronRight, BookOpen, X, Sun, Moon, Calendar, BadgeCheck, Search } from 'lucide-react';
import { articles } from './data/articles';
import SEO from './components/SEO';

export const Articles = ({ navigateTo, initialSlug, globalProducts }) => {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [lightMode, setLightMode] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;
  const panelRef = useRef(null);

  const categories = useMemo(() => {
    const cats = new Set(articles.map(a => a.category).filter(Boolean));
    return ['All', ...Array.from(cats)];
  }, []);

  useEffect(() => {
    if (initialSlug) {
      const found = articles.find(a => a.id === initialSlug);
      if (found) setSelectedArticle(found);
    } else {
      setSelectedArticle(null);
    }
  }, [initialSlug]);

  // Lock body scroll when panel is open
  useEffect(() => {
    if (selectedArticle) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedArticle]);

  const relatedArticles = useMemo(() => {
    if (!selectedArticle) return [];
    const art = selectedArticle;
    const artHay = `${art.title} ${art.category} ${art.metaDesc || ''}`.toLowerCase();
    const titleWords = art.title.toLowerCase().split(/\s+/).filter(w => w.length > 4);

    const scored = articles
      .filter(a => a.id !== art.id)
      .map(a => {
        let score = 0;
        if (a.category === art.category) score += 10;
        const aHay = `${a.title} ${a.category} ${a.metaDesc || ''}`.toLowerCase();
        titleWords.forEach(w => { if (aHay.includes(w)) score += 2; });
        // bonus for shared keywords in metaDesc
        const artWords = artHay.split(/\s+/).filter(w => w.length > 5);
        artWords.forEach(w => { if (aHay.includes(w)) score += 1; });
        return { article: a, score };
      })
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 2)
      .map(x => x.article);

    if (scored.length < 2) {
      const sameCat = articles.filter(a => a.id !== art.id && a.category === art.category).slice(0, 2 - scored.length);
      return [...scored, ...sameCat].slice(0, 2);
    }
    return scored;
  }, [selectedArticle]);

  const recommendedProducts = useMemo(() => {
    if (!globalProducts || globalProducts.length === 0 || !selectedArticle) return [];

    const art = selectedArticle;
    const artHay = `${art.title} ${art.category} ${art.id} ${art.metaDesc || ''}`.toLowerCase();

    // Topic → product category/subniche keywords
    const topicMap = [
      { triggers: ['testosterone', 'hormone', 'low t', 'libido', 'androgenic'], productKeys: ['testosterone', "men's health", 'androgenic'] },
      { triggers: ['adhd', 'focus', 'dopamine', 'brain', 'attention', 'cognitive', 'brain-fog'], productKeys: ['brain', 'focus', 'cognitive', 'nootropic', 'adhd'] },
      { triggers: ['sleep', 'circadian', 'hrv', 'insomnia', 'rest'], productKeys: ['sleep', 'stress', 'relaxation'] },
      { triggers: ['cortisol', 'stress', 'anxiety', 'burnout'], productKeys: ['stress', 'sleep', 'adaptogen'] },
      { triggers: ['fat loss', 'metabolism', 'weight', 'fasting', 'intermittent', 'calorie', 'obese'], productKeys: ['weight', 'fat', 'metabolism', 'muscle'] },
      { triggers: ['hair', 'skin', 'collagen'], productKeys: ['hair', 'skin', 'collagen'] },
      { triggers: ['senior', 'aging', 'longevity', 'elderly', 'older'], productKeys: ['anti-aging', 'longevity', 'joint'] },
      { triggers: ['joint', 'pain', 'back', 'headache', 'inflam'], productKeys: ['joint', 'pain', 'inflam', 'musculo'] },
      { triggers: ['muscle', 'strength', 'workout', 'training', 'fitness'], productKeys: ['muscle', 'fitness', 'protein', 'creatine'] },
      { triggers: ['heartburn', 'gut', 'digest', 'acid', 'nausea'], productKeys: ['digest', 'gut', 'probiotic'] },
    ];

    // Find matching product keywords based on article topic
    const matchedProductKeys = [];
    topicMap.forEach(({ triggers, productKeys }) => {
      if (triggers.some(t => artHay.includes(t))) matchedProductKeys.push(...productKeys);
    });

    const physicalProducts = globalProducts.filter(p => p.category !== 'Digital Products' && p.status !== 'inactive');

    let matched = physicalProducts.filter(p => {
      const pHay = `${p.category} ${p.subniche} ${p.name} ${p.description || ''}`.toLowerCase();
      return matchedProductKeys.some(k => pHay.includes(k));
    });

    // Fallback: any physical product
    if (matched.length === 0) matched = physicalProducts;

    return matched.slice(0, 3);
  }, [globalProducts, selectedArticle]);

  const filteredArticles = useMemo(() => {
    const parseDate = (d) => d ? new Date(d) : new Date(0);
    const q = search.toLowerCase();
    return articles
      .filter(a => {
        const matchCat = activeCategory === 'All' || a.category === activeCategory;
        const matchSearch = !q || a.title.toLowerCase().includes(q) || (a.metaDesc || '').toLowerCase().includes(q) || (a.category || '').toLowerCase().includes(q);
        return matchCat && matchSearch;
      })
      .sort((a, b) => parseDate(b.date) - parseDate(a.date));
  }, [activeCategory, search]);

  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);

  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredArticles.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredArticles, currentPage]);

  useEffect(() => { setCurrentPage(1); }, [search, activeCategory]);

  // ── LAYER 3: Article → Tool mapping ──────────────────────────────────────
  const ARTICLE_TOOL_MAP = {
    'low-testosterone-signs':            { key: 'testosterone', label: 'Testosterone Quiz', desc: 'Find out if your symptoms match low testosterone — takes 2 minutes.' },
    'how-to-boost-testosterone-naturally':{ key: 'testosterone', label: 'Testosterone Quiz', desc: 'Take our free quiz to get a personalised testosterone health score.' },
    'testosterone-sleep-connection':     { key: 'testosterone', label: 'Testosterone Quiz', desc: 'See how your sleep habits are affecting your testosterone levels.' },
    'best-testosterone-booster-supplements':{ key: 'testosterone', label: 'Testosterone Quiz', desc: 'Find out which testosterone booster matches your specific symptoms.' },
    'cant-sleep-what-to-do':             { key: 'sleep', label: 'Sleep Analyzer', desc: 'Analyse your sleep patterns and get a personalised score in 2 minutes.' },
    'better-sleep-as-you-age':           { key: 'sleep', label: 'Sleep Analyzer', desc: 'Check your sleep quality and get a personalised recovery plan.' },
    'fix-sleep-schedule':                { key: 'sleep', label: 'Sleep Analyzer', desc: 'Diagnose your sleep issues with our free Sleep Analyzer tool.' },
    'how-to-calm-anxiety':               { key: 'stress', label: 'Stress Checker', desc: 'Measure your stress load and get personalised management strategies.' },
    'cortisol-and-stress':               { key: 'stress', label: 'Stress Checker', desc: 'Check your cortisol and stress levels with our free diagnostic tool.' },
    'hrv-explained':                     { key: 'stress', label: 'Stress Checker', desc: 'See how your HRV and stress levels compare — free 2-minute tool.' },
    'brain-fog-causes-remedies':         { key: 'adhd', label: 'ADHD Screening', desc: 'Could brain fog be ADHD? Take our free screening to find out.' },
    'adhd-signs-in-adults':              { key: 'adhd', label: 'ADHD Screening', desc: 'Take our evidence-based ADHD screening tool — results in 3 minutes.' },
    'adhd-focus-strategies':             { key: 'adhd', label: 'ADHD Screening', desc: 'Get a personalised ADHD profile and focus strategy recommendations.' },
    'adhd-diet-and-nutrition':           { key: 'adhd', label: 'ADHD Screening', desc: 'Pair your nutrition knowledge with our free ADHD Screening tool.' },
    'dopamine-and-adhd':                 { key: 'adhd', label: 'ADHD Screening', desc: 'Understand your dopamine profile with our free ADHD Screening tool.' },
    'tired-all-the-time-causes':         { key: 'bmi', label: 'BMI Calculator', desc: 'Check your metabolic health baseline — free 30-second calculator.' },
    'why-not-losing-weight':             { key: 'bmi', label: 'BMI Calculator', desc: 'Get your BMI and metabolic health score with our free calculator.' },
    'speed-up-metabolism':               { key: 'bmi', label: 'BMI Calculator', desc: 'See how your metabolism compares — use our free BMI Calculator.' },
    'intermittent-fasting-guide':        { key: 'meal', label: 'Meal Planner', desc: 'Build a personalised fasting and meal schedule with our free tool.' },
    'foods-for-fat-loss':                { key: 'meal', label: 'Meal Planner', desc: 'Get a personalised fat-loss meal plan with our free Meal Planner.' },
    'feeling-lonely-ways-to-reconnect':  { key: 'mental', label: 'Mental Health Assessment', desc: 'Check your mental wellness score with our free 10-question assessment.' },
    'best-male-enhancement-pills':       { key: 'testosterone', label: 'Testosterone Quiz', desc: 'Check if low testosterone is affecting your sexual health — 2 minutes.' },
    'best-libido-supplements-for-women': { key: 'mental', label: 'Mental Health Assessment', desc: 'Explore how stress and mood may be affecting your libido.' },
    'memory-changes-what-is-normal':     { key: 'realage', label: 'Real Age Calculator', desc: 'Find out your biological age and cognitive health score — free tool.' },
    'lower-blood-pressure-simple-habits':{ key: 'longevity', label: 'Longevity Score', desc: 'See how your heart health habits affect your longevity score.' },
    'staying-active-after-65':           { key: 'realage', label: 'Real Age Calculator', desc: 'Calculate your biological age and see how active living compares.' },
  };

  // ── LAYER 1: Auto-link product names in article content ──────────────────
  const processedContent = useMemo(() => {
    if (!selectedArticle?.content || !globalProducts?.length) return selectedArticle?.content || '';
    const sorted = [...globalProducts]
      .filter(p => p.category !== 'Digital Products')
      .sort((a, b) => b.name.length - a.name.length);

    // Split on existing <a>...</a> blocks so we never double-link
    const parts = selectedArticle.content.split(/(<a\b[^>]*>[\s\S]*?<\/a>)/gi);
    return parts.map((part, i) => {
      if (i % 2 === 1) return part; // already an anchor — skip
      // Within non-anchor segments, replace only text nodes (not tag attributes)
      return part.replace(/(<[^>]+>|[^<]+)/g, (segment) => {
        if (segment.startsWith('<')) return segment; // HTML tag — skip
        let text = segment;
        for (const product of sorted) {
          const slug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
          const escaped = product.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          text = text.replace(
            new RegExp(`\\b${escaped}\\b`, 'g'),
            `<a href="/product/${slug}" class="article-internal-link">${product.name}</a>`
          );
        }
        return text;
      });
    }).join('');
  }, [selectedArticle, globalProducts]);

  const handleOpenArticle = (article) => {
    window.history.pushState({}, '', `/article/${article.id}`);
    setSelectedArticle(article);
    setLightMode(false);
    if (panelRef.current) panelRef.current.scrollTop = 0;
  };

  const handleBack = () => {
    window.history.pushState({}, '', '/articles');
    setSelectedArticle(null);
  };

  const articleSchema = selectedArticle ? {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "headline": selectedArticle.title,
    "description": selectedArticle.metaDesc || '',
    "image": [`https://eternofit.com${selectedArticle.image}`],
    "datePublished": selectedArticle.date || new Date().toISOString(),
    "dateModified": selectedArticle.updatedDate || selectedArticle.date || new Date().toISOString(),
    "inLanguage": "en-US",
    "url": `https://eternofit.com/article/${selectedArticle.id}`,
    "author": selectedArticle.author ? [{
      "@type": "Person",
      "name": selectedArticle.author,
      "description": selectedArticle.authorBio || '',
      "worksFor": { "@type": "Organization", "name": "EternoFit" }
    }] : [{ "@type": "Organization", "name": "EternoFit Health Team", "url": "https://eternofit.com" }],
    "publisher": {
      "@type": "Organization",
      "name": "EternoFit",
      "url": "https://eternofit.com",
      "logo": { "@type": "ImageObject", "url": "https://eternofit.com/logo-dark-bg.png" }
    },
    "mainEntityOfPage": { "@type": "WebPage", "@id": `https://eternofit.com/article/${selectedArticle.id}` },
    "medicalAudience": { "@type": "MedicalAudience", "audienceType": "Patient" },
    "keywords": selectedArticle.primaryKeyword || selectedArticle.category
  } : null;

  return (
    <>
      {/* Listing page — always rendered */}
      <div className="site-container page-bg" style={{ padding: '120px 24px 80px', minHeight: '100vh' }}>
        <SEO
          title={selectedArticle ? `${selectedArticle.title} | EternoFit` : "Clinical Health Insights & Articles | EternoFit"}
          description={selectedArticle ? selectedArticle.metaDesc : "Science-backed articles, guides, and performance strategies to help you optimize your health and build biological resilience."}
          image={selectedArticle ? `https://eternofit.com${selectedArticle.image}` : undefined}
          url={selectedArticle ? `https://eternofit.com/article/${selectedArticle.id}` : "https://eternofit.com/articles"}
          schema={articleSchema}
        />

        {/* Search bar */}
        <div style={{ maxWidth: '560px', margin: '0 auto 2rem', position: 'relative' }}>
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 16px 14px 46px',
              borderRadius: '12px',
              border: '1px solid var(--accent-green-dim)',
              background: 'rgba(0,0,0,0.4)',
              color: 'var(--text-main-site)',
              fontSize: '1rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-green)', pointerEvents: 'none' }} />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '3rem' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setCurrentPage(1); }}
              className="btn-secondary fade-in-up"
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '999px',
                fontSize: '0.9rem',
                border: activeCategory === cat ? '1px solid var(--accent-green)' : '1px solid rgba(255,255,255,0.22)',
                background: activeCategory === cat ? 'var(--accent-green-dim)' : 'rgba(10,10,10,0.75)',
                color: activeCategory === cat ? 'var(--accent-green)' : '#fff',
                transition: 'all 0.2s ease'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {paginatedArticles.map((article, idx) => (
            <div
              key={article.id}
              className="glass-card fade-in-up"
              onClick={() => handleOpenArticle(article)}
              style={{
                cursor: 'pointer',
                overflow: 'hidden',
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                animationDelay: `${idx * 0.04}s`,
                transition: 'transform 0.2s ease, border-color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = 'var(--accent-green)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
              }}
            >
              {article.image && (
                <div style={{ width: '100%', height: '190px', overflow: 'hidden', flexShrink: 0 }}>
                  <img
                    src={article.image}
                    alt={article.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s ease' }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                </div>
              )}
              <div style={{ padding: '1.25rem 1.5rem 1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <span style={{ fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--accent-green)', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                  {article.category}
                </span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main-site)', lineHeight: '1.4', marginBottom: '0.6rem' }}>
                  {article.title}
                </h3>
                <p style={{ color: 'var(--text-muted-site)', fontSize: '0.88rem', lineHeight: '1.55', marginBottom: '1.25rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {article.metaDesc}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.4rem', marginTop: 'auto' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-dim)', fontSize: '0.78rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><Clock size={12} />{article.readTime}</span>
                    {article.date && <span>{article.date}</span>}
                  </div>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--accent-green)', fontSize: '0.82rem', fontWeight: '700' }}>
                    Read <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '3rem', flexWrap: 'wrap' }}>
            <button
              disabled={currentPage === 1}
              onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="site-btn-secondary"
              style={{ padding: '8px 20px', opacity: currentPage === 1 ? 0.4 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
            >Previous</button>
            <span style={{ color: 'var(--text-muted-site)', fontSize: '0.9rem' }}>
              Page <strong style={{ color: '#fff' }}>{currentPage}</strong> of <strong style={{ color: '#fff' }}>{totalPages}</strong>
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="site-btn-secondary"
              style={{ padding: '8px 20px', opacity: currentPage === totalPages ? 0.4 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
            >Next</button>
          </div>
        )}
      </div>

      {/* Article overlay — backdrop + slide-in panel */}
      {selectedArticle && (
        <>
          {/* Solid black backdrop */}
          <div
            className="article-backdrop"
            onClick={handleBack}
            style={{
              position: 'fixed',
              inset: 0,
              background: '#000',
              zIndex: 999,
              cursor: 'pointer',
            }}
          />

          {/* Side panel */}
          <div
            ref={panelRef}
            className={`article-panel${lightMode ? ' article-panel--light' : ''}`}
            style={{
              position: 'fixed',
              top: '81px',
              right: 0,
              height: 'calc(100vh - 81px)',
              width: 'min(820px, 100vw)',
              background: lightMode ? '#fff' : 'var(--bg-dark-site)',
              borderLeft: lightMode ? '1px solid #e5e7eb' : '1px solid var(--border-subtle)',
              zIndex: 1000,
              overflowY: 'auto',
              overflowX: 'hidden',
              transition: 'background 0.2s, border-color 0.2s',
            }}
          >
            {/* Panel header */}
            <div style={{ position: 'sticky', top: 0, zIndex: 10, display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.5rem', background: lightMode ? '#fff' : 'var(--bg-dark-site)', borderBottom: lightMode ? '1px solid #e5e7eb' : '1px solid var(--border-subtle)', transition: 'background 0.2s' }}>
              <button
                onClick={handleBack}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: `1px solid ${lightMode ? '#d1d5db' : 'var(--border-subtle)'}`, borderRadius: '8px', color: lightMode ? '#374151' : 'var(--text-muted-site)', fontSize: '0.88rem', padding: '6px 14px', cursor: 'pointer' }}
              >
                <ArrowLeft size={15} /> Back to Articles
              </button>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {/* Light / dark toggle */}
                <button
                  onClick={() => setLightMode(m => !m)}
                  title={lightMode ? 'Switch to dark mode' : 'Switch to light mode'}
                  style={{ display: 'flex', alignItems: 'center', gap: '5px', background: lightMode ? '#f3f4f6' : 'rgba(255,255,255,0.07)', border: `1px solid ${lightMode ? '#d1d5db' : 'var(--border-subtle)'}`, borderRadius: '8px', color: lightMode ? '#374151' : 'var(--text-muted-site)', fontSize: '0.82rem', padding: '5px 12px', cursor: 'pointer' }}
                >
                  {lightMode ? <Moon size={14} /> : <Sun size={14} />}
                  {lightMode ? 'Dark' : 'Light'}
                </button>
                <button
                  onClick={handleBack}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', background: lightMode ? '#f3f4f6' : 'rgba(255,255,255,0.05)', border: `1px solid ${lightMode ? '#d1d5db' : 'var(--border-subtle)'}`, borderRadius: '50%', color: lightMode ? '#374151' : 'var(--text-muted-site)', cursor: 'pointer' }}
                  aria-label="Close"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Article content */}
            <div style={{ padding: '2.5rem 2.5rem 4rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--accent-green)', letterSpacing: '0.08em' }}>
                {selectedArticle.category}
              </span>
              <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', textAlign: 'left', marginBottom: '1.25rem', lineHeight: '1.15', color: lightMode ? '#111827' : 'var(--text-main-site)', fontWeight: '800', marginTop: '0.5rem' }}>
                {selectedArticle.title}
              </h1>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem', borderBottom: `1px solid ${lightMode ? '#e5e7eb' : 'var(--border-subtle)'}`, paddingBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: lightMode ? '#374151' : 'var(--text-muted-site)', fontSize: '0.88rem' }}>
                  <User size={15} /> <strong style={{ color: lightMode ? '#111827' : 'var(--text-main-site)' }}>By</strong>&nbsp;{selectedArticle.author || 'EternoFit Health Team'}
                </div>
                {selectedArticle.date && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: lightMode ? '#6b7280' : 'var(--text-muted-site)', fontSize: '0.88rem' }}>
                    <Calendar size={14} /> Published {selectedArticle.date}
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: lightMode ? '#6b7280' : 'var(--text-muted-site)', fontSize: '0.88rem' }}>
                  <Clock size={14} /> {selectedArticle.readTime}
                </div>
                {selectedArticle.author && selectedArticle.author.includes('Dr.') && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', fontWeight: '700', color: '#059669', background: 'rgba(5,150,105,0.1)', padding: '3px 10px', borderRadius: '50px' }}>
                    <BadgeCheck size={13} /> Medically Reviewed
                  </div>
                )}
              </div>

              {selectedArticle.image && (
                <div style={{ width: '100%', height: '380px', borderRadius: '16px', overflow: 'hidden', marginBottom: '2.5rem' }}>
                  <img src={selectedArticle.image} alt={selectedArticle.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}

              {/* LAYER 2: SPA link interceptor — catches /product/* and /article/* links injected by the auto-linker */}
              <div
                className={`article-content${lightMode ? ' article-content--light' : ''}`}
                style={{ lineHeight: '1.8', fontSize: '1.05rem', color: lightMode ? '#1f2937' : 'var(--text-main-site)' }}
                dangerouslySetInnerHTML={{ __html: processedContent }}
                onClick={(e) => {
                  const anchor = e.target.closest('a[href]');
                  if (!anchor) return;
                  const href = anchor.getAttribute('href');
                  if (href && href.startsWith('/') && !href.startsWith('//')) {
                    e.preventDefault();
                    navigateTo(href.slice(1));
                  }
                }}
              />

              {selectedArticle.authorBio && (
                <div style={{ marginTop: '3rem', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-subtle)', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--accent-green-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <User size={26} color="var(--accent-green)" />
                  </div>
                  <div>
                    <h4 style={{ color: 'var(--text-main-site)', marginBottom: '0.4rem', fontSize: '1rem' }}>About the Author: {selectedArticle.author || 'EternoFit Clinical Team'}</h4>
                    <p style={{ color: 'var(--text-muted-site)', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>
                      {selectedArticle.authorBio}
                    </p>
                  </div>
                </div>
              )}

              {/* LAYER 3: Free Tool CTA */}
              {selectedArticle && ARTICLE_TOOL_MAP[selectedArticle.id] && (() => {
                const tool = ARTICLE_TOOL_MAP[selectedArticle.id];
                return (
                  <div
                    onClick={() => navigateTo(`tools?tool=${tool.key}`)}
                    style={{ marginTop: '2.5rem', padding: '1.25rem 1.5rem', background: 'rgba(0,230,118,0.05)', border: '1px solid rgba(0,230,118,0.2)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', cursor: 'pointer', transition: 'border-color 0.2s, background 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-green)'; e.currentTarget.style.background = 'rgba(0,230,118,0.09)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,230,118,0.2)'; e.currentTarget.style.background = 'rgba(0,230,118,0.05)'; }}
                  >
                    <div>
                      <p style={{ fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-green)', margin: '0 0 4px' }}>Free Tool</p>
                      <p style={{ fontWeight: '700', color: 'var(--text-main-site)', margin: '0 0 3px', fontSize: '1rem' }}>{tool.label}</p>
                      <p style={{ color: 'var(--text-muted-site)', fontSize: '0.87rem', margin: 0 }}>{tool.desc}</p>
                    </div>
                    <ChevronRight size={20} color="var(--accent-green)" style={{ flexShrink: 0 }} />
                  </div>
                );
              })()}

              {recommendedProducts.length > 0 && (
                <div style={{ marginTop: '3rem', paddingTop: '2.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <h3 style={{ color: 'var(--text-main-site)', marginBottom: '1.5rem', fontSize: '1.4rem' }}>Recommended Supplements</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                    {recommendedProducts.map((p, i) => (
                      <div key={i} className="site-product-card fade-in-up" style={{ animationDelay: `${0.1 * i}s` }}>
                        <div className="site-product-img">
                          <img src={p.image || `https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&q=80&sig=${i + 10}`} alt={p.name} />
                        </div>
                        <div className="site-product-info">
                          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', lineHeight: '1.4' }}>{p.name}</h3>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted-site)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '1rem', flexGrow: 1 }}>{p.desc || p.description}</p>
                          <div className="site-product-footer" style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className="price" style={{ color: 'var(--accent-green)', fontSize: '1rem', fontWeight: 'bold' }}>{p.price}</span>
                            <a
                              href={p.affiliateLink || '#'}
                              onClick={() => window.trackEvent && window.trackEvent(`${window.userSource || 'organic'}_affiliate_link_clicked`, { product: p.name })}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="site-btn-secondary"
                              style={{ textDecoration: 'none', padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--accent-green)', color: 'var(--accent-green)', fontSize: '0.85rem', fontWeight: '600', transition: 'all 0.2s ease' }}
                            >
                              Buy Now
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {relatedArticles.length > 0 && (
                <div style={{ marginTop: '3rem', paddingTop: '2.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <h3 style={{ color: 'var(--text-main-site)', marginBottom: '1.5rem', fontSize: '1.4rem' }}>Related Topics</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                    {relatedArticles.map((article) => (
                      <div
                        key={article.id}
                        className="glass-card"
                        style={{ padding: '1.25rem', cursor: 'pointer', transition: 'transform 0.2s, border-color 0.2s', overflow: 'hidden' }}
                        onClick={() => { handleOpenArticle(article); if (panelRef.current) panelRef.current.scrollTop = 0; }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = 'var(--accent-green)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
                      >
                        {article.image && (
                          <div style={{ width: '100%', height: '120px', borderRadius: '8px', overflow: 'hidden', marginBottom: '0.75rem' }}>
                            <img src={article.image} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        )}
                        <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--text-main-site)', lineHeight: '1.35' }}>
                          {article.title}
                        </h4>
                        <div style={{ color: 'var(--accent-green)', fontSize: '0.82rem', fontWeight: '600', marginTop: '0.75rem', display: 'flex', alignItems: 'center' }}>
                          Read Article <ChevronRight size={13} style={{ marginLeft: '3px' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};
