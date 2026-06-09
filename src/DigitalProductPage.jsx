import React, { useEffect, useMemo } from 'react';
import { ArrowLeft, Star, CheckCircle2, Shield, Download, ChevronRight, Activity, Gift, Package, Zap, Clock } from 'lucide-react';
import { trackEvent } from './analytics';
import SEO from './components/SEO';

const DigitalProductPage = ({ slug, globalProducts, navigateTo }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const product = useMemo(() => {
    if (!globalProducts) return null;
    return globalProducts.find(p => p.name.toLowerCase().replace(/\s+/g, '-') === slug);
  }, [globalProducts, slug]);

  // Bundle contents lookup
  const bundleItems = useMemo(() => {
    if (!product?.isBundle || !product?.bundleIncludes || !globalProducts) return [];
    return product.bundleIncludes
      .map(id => globalProducts.find(p => p.id === id))
      .filter(Boolean);
  }, [product, globalProducts]);

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

  const isLemonSqueezy = product.affiliateLink?.includes('lemonsqueezy.com');
  const isPending = !product.affiliateLink || product.affiliateLink === '#pending';
  const isFree = product.isFree === true;
  const isBundle = product.isBundle === true;

  // Calculate bundle total value
  const bundleTotalValue = bundleItems.reduce((sum, item) => {
    const price = typeof item.price === 'number' ? item.price : 0;
    return sum + price;
  }, 0);

  const displayPrice = isFree
    ? 'FREE'
    : typeof product.price === 'number'
    ? `$${product.price}`
    : product.price || null;

  const handleBuyClick = () => {
    if (isPending) return;
    trackEvent(`${window.userSource || 'organic'}_digital_product_checkout`, { product: product.name });
  };

  return (
    <div className="digital-product-page page-bg" style={{ minHeight: '100vh', padding: '100px 0 60px', color: 'var(--text-main-site)' }}>
      <SEO
        title={`${product.name} | EternoFit Digital Access`}
        description={product.description || product.rationale}
        url={`https://eternofit.com/product/${slug}`}
        schema={{
          "@context": "https://schema.org",
          "@type": "Product",
          "name": product.name,
          "description": product.description,
          "brand": { "@type": "Organization", "name": "EternoFit" },
          "offers": {
            "@type": "Offer",
            "price": isFree ? "0" : String(product.price || 0),
            "priceCurrency": "USD",
            "availability": isPending ? "https://schema.org/PreOrder" : "https://schema.org/InStock"
          }
        }}
      />

      <div className="site-container">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" style={{ marginBottom: '2rem' }}>
          <ol style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px', listStyle: 'none', padding: 0, margin: 0, fontSize: '0.82rem', color: 'var(--text-muted-site)' }}>
            <li><button onClick={() => navigateTo('home')} style={{ background: 'none', border: 'none', color: 'var(--accent-green)', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}>Home</button></li>
            <li style={{ opacity: 0.4 }}>/</li>
            <li><button onClick={() => navigateTo('marketplace')} style={{ background: 'none', border: 'none', color: 'var(--accent-green)', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}>Marketplace</button></li>
            <li style={{ opacity: 0.4 }}>/</li>
            <li style={{ opacity: 0.6 }}>{product.category}</li>
            <li style={{ opacity: 0.4 }}>/</li>
            <li style={{ color: 'white', fontWeight: '600' }}>{product.name}</li>
          </ol>
        </nav>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'start', marginBottom: '5rem' }}>

          {/* Photo / Cover Section */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            {/* Bundle badge */}
            {isBundle && (
              <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'rgba(251,191,36,0.2)', backdropFilter: 'blur(10px)', padding: '6px 12px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: '700', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.4)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Package size={14} /> Bundle
              </div>
            )}
            {product.image ? (
              <img src={product.image} alt={product.name} style={{ width: '100%', maxHeight: '500px', objectFit: 'contain', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))' }} />
            ) : (
              <div style={{ height: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.2)', gap: '1rem' }}>
                {isBundle ? <Package size={64} /> : <Shield size={64} />}
                <span style={{ fontSize: '0.9rem' }}>{product.name}</span>
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div>
            {/* Category + star row */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-green)', background: 'rgba(0, 255, 102, 0.1)', padding: '4px 12px', borderRadius: '50px' }}>
                {product.subniche || product.category}
              </span>
              {product.badge && (
                <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: isBundle ? '#fbbf24' : '#fff', background: isBundle ? 'rgba(251,191,36,0.15)' : 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: '50px', border: `1px solid ${isBundle ? 'rgba(251,191,36,0.4)' : 'rgba(255,255,255,0.2)'}` }}>
                  {product.badge}
                </span>
              )}
              {!product.badge && !isFree && (
                <div style={{ display: 'flex', gap: '2px', color: '#fbbf24' }}>
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                </div>
              )}
            </div>

            <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', lineHeight: '1.1', marginBottom: '0.75rem', color: '#fff' }}>
              {product.name}
            </h1>

            {/* Price display */}
            {displayPrice && (
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: '900', color: isFree ? 'var(--accent-green)' : '#fff', lineHeight: 1 }}>
                  {displayPrice}
                </span>
                {isBundle && bundleTotalValue > 0 && (
                  <>
                    <span style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.3)', textDecoration: 'line-through' }}>${bundleTotalValue}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#fbbf24', background: 'rgba(251,191,36,0.15)', padding: '3px 10px', borderRadius: '50px' }}>
                      Save ${bundleTotalValue - (product.price || 0)}
                    </span>
                  </>
                )}
              </div>
            )}

            <p style={{ fontSize: '1.05rem', color: 'var(--text-muted-site)', lineHeight: '1.6', marginBottom: '2rem' }}>
              {product.description}
            </p>

            {product.bullets && product.bullets.length > 0 && (
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2.5rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {product.bullets.map((b, i) => (
                  <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <CheckCircle2 size={20} color="var(--accent-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ fontSize: '1rem', color: '#e2e8f0', lineHeight: '1.5' }}>{b}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* CTA Button */}
            {isPending ? (
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '1.5rem', textAlign: 'center' }}>
                <Clock size={24} color="var(--accent-green)" style={{ marginBottom: '0.75rem' }} />
                <p style={{ color: '#fff', fontWeight: '700', margin: '0 0 0.4rem 0', fontSize: '1.05rem' }}>Coming Soon</p>
                <p style={{ color: 'var(--text-muted-site)', fontSize: '0.9rem', margin: 0 }}>
                  This product will be available shortly. Check back soon or take the health quiz to see your personalised recommendations.
                </p>
                <button
                  onClick={() => navigateTo('quiz')}
                  className="site-btn-secondary"
                  style={{ marginTop: '1.25rem', padding: '0.9rem 2rem', fontSize: '0.95rem', border: '1px solid rgba(255,255,255,0.2)' }}
                >
                  Take the Free Health Assessment <ChevronRight size={16} style={{ marginLeft: '6px' }} />
                </button>
              </div>
            ) : (
              <>
                <a
                  href={product.affiliateLink}
                  onClick={handleBuyClick}
                  target={isLemonSqueezy ? undefined : '_blank'}
                  rel={isLemonSqueezy ? undefined : 'noopener noreferrer'}
                  className={`site-btn-primary ${isLemonSqueezy ? 'lemonsqueezy-button' : ''}`}
                  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', textDecoration: 'none', padding: '16px 32px', fontSize: '1.1rem', width: '100%', boxSizing: 'border-box' }}
                >
                  {isFree ? (
                    <><Download size={20} /> Download for Free</>
                  ) : (
                    <>Get Instant Access {displayPrice && `— ${displayPrice}`} <ChevronRight size={20} /></>
                  )}
                </a>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem', color: 'var(--text-muted-site)', fontSize: '0.85rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Shield size={14} /> Secure Checkout</span>
                  {isFree ? (
                    <><span>•</span><span>No credit card needed</span></>
                  ) : (
                    <><span>•</span><span>One-Time Payment</span><span>•</span><span>Instant Delivery</span></>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Bundle includes section */}
        {isBundle && bundleItems.length > 0 && (
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '4rem', marginTop: '2rem', marginBottom: '4rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', color: '#fff', marginBottom: '0.75rem' }}>
                Everything Included in the <span style={{ color: 'var(--accent-green)' }}>Starter Kit</span>
              </h2>
              <p style={{ color: 'var(--text-muted-site)', fontSize: '1rem', maxWidth: '580px', margin: '0 auto' }}>
                Five complete wellness systems in one download. Total value ${bundleTotalValue} — yours for just $19.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {bundleItems.map((item, i) => (
                <div
                  key={item.id}
                  style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start', cursor: 'pointer', transition: 'border-color 0.2s' }}
                  onClick={() => navigateTo('product/' + encodeURIComponent(item.name.toLowerCase().replace(/\s+/g, '-')))}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,255,102,0.3)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
                >
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(0,255,102,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--accent-green)', fontWeight: '900', fontSize: '1rem' }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                      <h3 style={{ fontSize: '0.95rem', color: '#fff', margin: 0, lineHeight: '1.3', fontWeight: '700', paddingRight: '0.5rem' }}>{item.name}</h3>
                      <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--accent-green)', flexShrink: 0 }}>
                        ${item.price}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted-site)', margin: 0, lineHeight: '1.5' }}>
                      {item.description?.slice(0, 90)}{item.description?.length > 90 ? '…' : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {/* Savings callout */}
            <div style={{ marginTop: '2rem', background: 'linear-gradient(135deg, rgba(0,255,102,0.08) 0%, rgba(0,255,102,0.03) 100%)', border: '1px solid rgba(0,255,102,0.2)', borderRadius: '16px', padding: '1.5rem 2rem', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ margin: '0 0 0.3rem 0', color: '#fff', fontWeight: '700', fontSize: '1.05rem' }}>Complete Bundle — Best Value</p>
                <p style={{ margin: 0, color: 'var(--text-muted-site)', fontSize: '0.9rem' }}>All 5 products for the price of 2½. Instant access, one-time payment.</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted-site)', textDecoration: 'line-through' }}>Individual: ${bundleTotalValue}</span>
                <span style={{ display: 'block', fontSize: '1.8rem', fontWeight: '900', color: 'var(--accent-green)', lineHeight: 1 }}>${product.price}</span>
              </div>
            </div>
          </div>
        )}

        {/* How Instant Access Works */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '4rem', marginTop: isBundle ? 0 : '2rem' }}>
          <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '3rem' }}>How {isFree ? 'Your Free Download' : 'Instant Access'} Works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
            {(isFree ? [
              { step: '1', icon: <Download size={20} />, title: 'Click Free Download', body: 'Enter your email to receive your free tracker. No credit card — ever.' },
              { step: '2', icon: <Zap size={20} />, title: 'Instant Delivery', body: 'Your PDF lands in your inbox within seconds. Check spam if you don\'t see it.' },
              { step: '3', icon: <Shield size={20} />, title: 'Print or Use Digitally', body: 'Open on any device, print as many copies as you need, and start tracking today.' },
            ] : [
              { step: '1', icon: <Shield size={20} />, title: 'Complete Checkout', body: 'Purchase securely through our checkout partner. It\'s a one-time payment — no subscription and no recurring charges.' },
              { step: '2', icon: <Zap size={20} />, title: 'Get Your Access Link', body: 'Your download or access link is delivered to your email immediately after payment, so you can start right away.' },
              { step: '3', icon: <Download size={20} />, title: 'Use It On Any Device', body: 'Open it on desktop or mobile and keep lifetime access to the resource, including any future updates we publish.' },
            ]).map((s, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0,255,102,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-green)', fontWeight: '800', marginBottom: '1rem' }}>{s.step}</div>
                <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '0.6rem' }}>{s.title}</h3>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-muted-site)', lineHeight: '1.6', margin: 0 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Cross-sell — take the quiz */}
        {!isPending && (
          <div style={{ marginTop: '5rem', background: 'rgba(0,255,102,0.04)', border: '1px solid rgba(0,255,102,0.12)', borderRadius: '20px', padding: '2.5rem', textAlign: 'center' }}>
            <h3 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '0.75rem' }}>Want Personalised Recommendations?</h3>
            <p style={{ color: 'var(--text-muted-site)', maxWidth: '500px', margin: '0 auto 1.5rem', fontSize: '0.95rem' }}>
              Take the free 3-minute health quiz and we'll match you with the exact tools, trackers, and supplements suited to your health goals.
            </p>
            <button onClick={() => navigateTo('quiz')} className="site-btn-primary" style={{ padding: '0.9rem 2.5rem' }}>
              Take the Free Health Assessment <ChevronRight size={18} style={{ marginLeft: '6px' }} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DigitalProductPage;
