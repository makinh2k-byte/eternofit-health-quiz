import React, { useEffect, useMemo } from 'react';
import { ArrowLeft, CheckCircle2, Shield, ChevronRight, Activity, Info, AlertTriangle, Award, Users, ClipboardCheck, ChevronRight as ArrowR } from 'lucide-react';
import { trackEvent } from './analytics';
import { articles as allArticles } from './data/articles';
import SEO from './components/SEO';

// Maps product categories / subniches to a plain-language "who it's for" summary.
const audienceFor = (product) => {
  const cat = (product.category || '').toLowerCase();
  const sub = (product.subniche || '').toLowerCase();
  const gender = product.gender;

  if (sub.includes('testosterone') || cat.includes("men's")) {
    return 'Men noticing the typical signs of declining testosterone — lower energy, slower recovery, reduced drive, or difficulty maintaining muscle — who want to support their hormonal health through researched, non-prescription ingredients.';
  }
  if (sub.includes('hgh') || cat.includes('anti-aging')) {
    return 'Adults focused on healthy aging who want to support energy, recovery, skin, and vitality by encouraging the body\'s own natural processes rather than synthetic hormones.';
  }
  if (cat.includes('skin')) {
    return 'People looking to support skin health, elasticity, and appearance from the inside out as part of a broader skincare and nutrition routine.';
  }
  if (cat.includes('muscle') || cat.includes('fitness')) {
    return 'Active people and lifters who want to support training output, recovery, and body composition alongside a consistent strength and nutrition program.';
  }
  if (gender === 'male') return 'Men who want targeted support for the areas this formula focuses on, as part of an evidence-based health routine.';
  if (gender === 'female') return 'Women who want targeted support for the areas this formula focuses on, as part of an evidence-based health routine.';
  return 'Adults who want to support their general health and performance with a researched, clearly-formulated supplement as one part of a broader healthy lifestyle.';
};

const ProductPage = ({ slug, globalProducts, navigateTo }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const product = useMemo(() => {
    if (!globalProducts) return null;
    return globalProducts.find(p => p.name.toLowerCase().replace(/\s+/g, '-') === slug);
  }, [globalProducts, slug]);

  // Surface on-site articles matched to this product's topic.
  const relatedArticles = useMemo(() => {
    if (!product) return [];
    const pHay = `${product.category} ${product.subniche} ${product.name} ${product.description || ''}`.toLowerCase();

    const topicMap = [
      { triggers: ['testosterone', "men's health", 'androgenic', 'libido'], articleKeys: ['testosterone', 'hormone', 'low t', 'androgenic'] },
      { triggers: ['hgh', 'anti-aging', 'longevity', 'growth hormone'], articleKeys: ['aging', 'longevity', 'anti-aging', 'biological age', 'healthspan'] },
      { triggers: ['brain', 'focus', 'cognitive', 'nootropic', 'adhd'], articleKeys: ['adhd', 'focus', 'dopamine', 'brain', 'attention', 'cognitive'] },
      { triggers: ['sleep', 'relaxation', 'stress', 'adaptogen', 'cortisol'], articleKeys: ['sleep', 'cortisol', 'stress', 'hrv', 'circadian', 'anxiety'] },
      { triggers: ['weight', 'fat', 'metabolism', 'thermogenic'], articleKeys: ['fat loss', 'metabolism', 'weight', 'fasting', 'calorie', 'intermittent'] },
      { triggers: ['hair', 'skin', 'collagen', 'beauty'], articleKeys: ['hair', 'skin', 'collagen'] },
      { triggers: ['muscle', 'fitness', 'protein', 'creatine', 'pre-workout'], articleKeys: ['muscle', 'strength', 'workout', 'training', 'fitness', 'fat loss'] },
      { triggers: ['joint', 'pain', 'inflamm', 'musculo', 'bone'], articleKeys: ['joint', 'pain', 'back', 'headache', 'stiff', 'inflam'] },
      { triggers: ['women', 'female', 'estrogen', 'pcos'], articleKeys: ['hormone', 'cortisol', 'stress', 'sleep', 'thyroid'] },
      { triggers: ['digest', 'gut', 'probiotic', 'enzyme'], articleKeys: ['heartburn', 'gut', 'digest', 'acid'] },
      { triggers: ['senior', 'elderly', 'older'], articleKeys: ['senior', 'aging', 'joint', 'longevity', 'fall'] },
    ];

    // Gather relevant article keywords for this product
    const articleKeywords = [];
    topicMap.forEach(({ triggers, articleKeys }) => {
      if (triggers.some(t => pHay.includes(t))) articleKeywords.push(...articleKeys);
    });

    // Score articles
    const scored = allArticles
      .map(a => {
        const aHay = `${a.title} ${a.category} ${a.metaDesc || ''}`.toLowerCase();
        const score = articleKeywords.filter(k => aHay.includes(k)).length;
        return { article: a, score };
      })
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(x => x.article);

    // Fallback: most recent articles
    if (scored.length === 0) return allArticles.slice(0, 3);
    return scored;
  }, [product]);

  if (!globalProducts || globalProducts.length === 0) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-dark-site)' }}>
        <Activity size={40} color="var(--accent-green)" style={{ animation: 'pulse 2s infinite ease-in-out' }} />
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-dark-site)', color: 'white' }}>
        <h2>Product Not Found</h2>
        <button className="btn-secondary" onClick={() => navigateTo('marketplace')} style={{ marginTop: '1rem' }}>Return to Marketplace</button>
      </div>
    );
  }

  const handleBuyClick = () => {
    trackEvent(`${window.userSource || 'organic'}_affiliate_link_clicked`, { product: product.name, location: 'product_detail_page' });
  };

  const sectionCard = {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '16px',
    padding: '2rem',
  };

  const AffiliateCTA = ({ label }) => (
    <a
      href={product.affiliateLink || '#'}
      onClick={handleBuyClick}
      target="_blank"
      rel="sponsored noopener noreferrer"
      className="site-btn-primary"
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', textDecoration: 'none', padding: '16px 32px', fontSize: '1.1rem', width: '100%' }}
    >
      {label} <ChevronRight size={20} />
    </a>
  );

  return (
    <div className="product-page page-bg" style={{ minHeight: '100vh', padding: '100px 0 60px', color: 'var(--text-main-site)' }}>
      <SEO
        title={`${product.name} Review — Benefits, Ingredients & Where to Buy | EternoFit`}
        description={product.metaDesc || product.description || product.rationale}
        url={`https://eternofit.com/product/${slug}`}
        image={product.image ? `https://eternofit.com${product.image}` : undefined}
        schema={{
          "@context": "https://schema.org",
          "@type": "Product",
          "name": product.name,
          "description": product.metaDesc || product.description,
          "image": product.image ? `https://eternofit.com${product.image}` : undefined,
          "category": product.category,
          "url": `https://eternofit.com/product/${slug}`,
          "brand": { "@type": "Organization", "name": "EternoFit" },
          "review": {
            "@type": "Review",
            "reviewBody": product.rationale,
            "author": { "@type": "Organization", "name": "EternoFit Editorial Team" },
            "publisher": { "@type": "Organization", "name": "EternoFit", "url": "https://eternofit.com" }
          },
          "offers": {
            "@type": "Offer",
            "url": product.affiliateLink || `https://eternofit.com/product/${slug}`,
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
          }
        }}
      />

      <div className="site-container" style={{ maxWidth: '980px' }}>
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" style={{ marginBottom: '1.5rem' }}>
          <ol style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px', listStyle: 'none', padding: 0, margin: 0, fontSize: '0.82rem', color: 'var(--text-muted-site)' }}>
            <li><button onClick={() => navigateTo('home')} style={{ background: 'none', border: 'none', color: 'var(--accent-green)', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}>Home</button></li>
            <li style={{ opacity: 0.4 }}>/</li>
            <li><button onClick={() => navigateTo('marketplace')} style={{ background: 'none', border: 'none', color: 'var(--accent-green)', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}>Marketplace</button></li>
            <li style={{ opacity: 0.4 }}>/</li>
            <li style={{ opacity: 0.6 }}>{product.category}</li>
            <li style={{ opacity: 0.4 }}>/</li>
            <li style={{ color: 'var(--text-main-site)', fontWeight: '600' }}>{product.name}</li>
          </ol>
        </nav>

        {/* Affiliate disclosure banner */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', background: 'rgba(255,193,7,0.06)', border: '1px solid rgba(255,193,7,0.2)', borderRadius: '12px', padding: '0.85rem 1.1rem', marginBottom: '2.5rem' }}>
          <Info size={16} color="#ffc107" style={{ flexShrink: 0, marginTop: '2px' }} />
          <p style={{ margin: 0, fontSize: '0.82rem', lineHeight: '1.6', color: 'var(--text-muted-site)' }}>
            <strong style={{ color: '#ffc107' }}>Affiliate disclosure:</strong> EternoFit may earn a commission if you buy through links on this page, at no extra cost to you. This never changes our editorial assessment — see our{' '}
            <button onClick={() => navigateTo('affiliate')} style={{ background: 'none', border: 'none', color: 'var(--accent-green)', cursor: 'pointer', padding: 0, fontSize: 'inherit', textDecoration: 'underline' }}>Affiliate Disclosure</button>.
          </p>
        </div>

        {/* Hero */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'start', marginBottom: '4rem' }}>
          {/* Photo */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '320px' }}>
            {product.image ? (
              <img src={product.image} alt={product.name} style={{ width: 'auto', maxWidth: '100%', maxHeight: '440px', objectFit: 'contain', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))' }} />
            ) : (
              <Shield size={64} color="rgba(255,255,255,0.2)" />
            )}
          </div>

          {/* Info */}
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-green)', background: 'rgba(0, 255, 102, 0.1)', padding: '4px 12px', borderRadius: '50px' }}>
              {product.category}
            </span>

            <h1 style={{ fontSize: 'clamp(1.9rem, 4.5vw, 3rem)', lineHeight: '1.1', margin: '1rem 0', color: '#fff' }}>
              {product.name}
            </h1>

            <p style={{ fontSize: '1.05rem', color: 'var(--text-muted-site)', lineHeight: '1.7', marginBottom: '1.75rem' }}>
              {product.description}
            </p>

            {product.bullets && product.bullets.length > 0 && (
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {product.bullets.map((b, i) => (
                  <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <CheckCircle2 size={20} color="var(--accent-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ fontSize: '0.98rem', color: '#e2e8f0', lineHeight: '1.5' }}>{b}</span>
                  </li>
                ))}
              </ul>
            )}

            {product.price && (
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff', marginBottom: '1rem' }}>{product.price}</div>
            )}

            <AffiliateCTA label="Check Latest Price" />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '1rem', color: 'var(--text-muted-site)', fontSize: '0.8rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Shield size={14} /> Ships from official retailer</span>
              <span>•</span>
              <span>Price shown on retailer site</span>
            </div>
          </div>
        </div>

        {/* Why we recommend it */}
        {product.rationale && (
          <div style={{ ...sectionCard, marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px', color: '#fff' }}>
              <Award size={22} color="var(--accent-green)" /> Why We Recommend It
            </h2>
            <p style={{ color: 'var(--text-muted-site)', lineHeight: '1.85', fontSize: '1rem', margin: 0 }}>
              {product.rationale}
            </p>
          </div>
        )}

        {/* Who it's for */}
        <div style={{ ...sectionCard, marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px', color: '#fff' }}>
            <Users size={22} color="var(--accent-green)" /> Who It's For
          </h2>
          <p style={{ color: 'var(--text-muted-site)', lineHeight: '1.85', fontSize: '1rem', margin: 0 }}>
            {audienceFor(product)}
          </p>
        </div>

        {/* What to know before buying — honest, value-adding editorial */}
        <div style={{ background: 'rgba(255,193,7,0.05)', border: '1px solid rgba(255,193,7,0.18)', borderRadius: '16px', padding: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '10px', color: '#ffc107' }}>
            <AlertTriangle size={22} /> What to Know Before You Buy
          </h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              'Supplements are not a substitute for the fundamentals. Sleep, training, protein intake, and stress management drive the majority of results — a supplement supports that foundation, it doesn\'t replace it.',
              'Dietary supplements are not evaluated by the FDA to diagnose, treat, cure, or prevent any disease. Individual results vary, and timelines depend on your starting point and consistency.',
              'Check the full ingredient label for anything you\'re sensitive or allergic to, and favour brands that publish third-party testing for purity and dosing.',
              'If you take prescription medication, are pregnant or nursing, or have an existing medical condition, talk to a qualified healthcare provider before starting any new supplement.',
            ].map((t, i) => (
              <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <ChevronRight size={18} color="#ffc107" style={{ flexShrink: 0, marginTop: '3px' }} />
                <span style={{ fontSize: '0.95rem', color: 'var(--text-muted-site)', lineHeight: '1.7' }}>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* How we evaluate */}
        <div style={{ ...sectionCard, marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '10px', color: '#fff' }}>
            <ClipboardCheck size={22} color="var(--accent-green)" /> How EternoFit Evaluates Products
          </h2>
          <p style={{ color: 'var(--text-muted-site)', lineHeight: '1.8', fontSize: '0.98rem', marginBottom: '1.25rem' }}>
            We list a product only when its core ingredients have a plausible, research-backed mechanism for the benefit being claimed. We prioritise formulas with transparent labels and clinically studied dosages over proprietary blends, and we read the available evidence critically rather than relying on marketing copy. Our assessment is independent of any affiliate relationship.
          </p>
          <button
            onClick={() => navigateTo('about')}
            className="site-btn-secondary"
            style={{ padding: '10px 22px', border: '1px solid var(--accent-green)' }}
          >
            Read Our Editorial Standards <ArrowR size={16} style={{ marginLeft: '6px' }} />
          </button>
        </div>

        {/* Related articles for internal linking */}
        {relatedArticles.length > 0 && (
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '3rem', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1.5rem', color: '#fff' }}>Related Reading</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              {relatedArticles.map(a => (
                <div
                  key={a.id}
                  onClick={() => navigateTo(`article/${a.id}`)}
                  style={{ cursor: 'pointer', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', overflow: 'hidden', transition: 'transform 0.2s, border-color 0.2s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = 'var(--accent-green)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
                >
                  {a.image && (
                    <div style={{ height: '130px', overflow: 'hidden' }}>
                      <img src={a.image} alt={a.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  <div style={{ padding: '1rem 1.25rem' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--accent-green)', letterSpacing: '0.06em' }}>{a.category}</span>
                    <h4 style={{ fontSize: '0.98rem', color: '#fff', lineHeight: '1.4', margin: '0.5rem 0 0' }}>{a.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div style={{ ...sectionCard, textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '0.75rem', color: '#fff' }}>Ready to try {product.name}?</h2>
          <p style={{ color: 'var(--text-muted-site)', marginBottom: '1.5rem', fontSize: '0.95rem', maxWidth: '520px', margin: '0 auto 1.5rem' }}>
            You'll be taken to the official retailer to see current pricing and complete your purchase securely.
          </p>
          <div style={{ maxWidth: '360px', margin: '0 auto' }}>
            <AffiliateCTA label="Check Latest Price" />
          </div>
          <p style={{ color: 'var(--text-muted-site)', fontSize: '0.75rem', marginTop: '1rem', marginBottom: 0 }}>
            As an affiliate, EternoFit may earn a commission from qualifying purchases.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
