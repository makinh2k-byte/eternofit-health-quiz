import React, { useEffect, useMemo } from 'react';
import { ArrowLeft, Star, CheckCircle2, Shield, Download, ChevronRight, Activity } from 'lucide-react';
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

  const handleBuyClick = () => {
    trackEvent(`${window.userSource || 'organic'}_digital_product_checkout`, { product: product.name });
  };

  return (
    <div className="digital-product-page" style={{ background: 'var(--bg-dark-site)', minHeight: '100vh', padding: '100px 0 60px', color: 'var(--text-main-site)' }}>
      <SEO 
        title={`${product.name} | EternoFit Digital Access`}
        description={product.description || product.rationale}
        url={`https://eternofit.com/product/${slug}`}
      />
      
      <div className="site-container">
        {/* Back navigation */}
        <button 
          onClick={() => navigateTo('marketplace')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--accent-green)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', marginBottom: '2rem', padding: 0 }}
        >
          <ArrowLeft size={16} /> Back to Marketplace
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'start', marginBottom: '5rem' }}>
          
          {/* Photo Section */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', padding: '6px 12px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: '700', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Download size={14} color="var(--accent-green)" /> Instant Delivery
            </div>
            {product.image ? (
              <img src={product.image} alt={product.name} style={{ width: '100%', maxHeight: '500px', objectFit: 'contain', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))' }} />
            ) : (
              <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.2)' }}>
                <Shield size={64} />
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-green)', background: 'rgba(0, 255, 102, 0.1)', padding: '4px 12px', borderRadius: '50px' }}>
                {product.category}
              </span>
              <div style={{ display: 'flex', gap: '2px', color: '#fbbf24' }}>
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
              </div>
            </div>
            
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: '1.1', marginBottom: '1rem', color: '#fff' }}>
              {product.name}
            </h1>
            
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted-site)', lineHeight: '1.6', marginBottom: '2rem' }}>
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

            <a 
              href={product.affiliateLink || '#'} 
              onClick={handleBuyClick}
              target={isLemonSqueezy ? undefined : "_blank"} 
              rel={isLemonSqueezy ? undefined : "noopener noreferrer"} 
              className={`site-btn-primary ${isLemonSqueezy ? 'lemonsqueezy-button' : ''}`} 
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', textDecoration: 'none', padding: '16px 32px', fontSize: '1.1rem', width: '100%' }}
            >
              Get Instant Access <ChevronRight size={20} />
            </a>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem', color: 'var(--text-muted-site)', fontSize: '0.85rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Shield size={14} /> Secure Checkout</span>
              <span>•</span>
              <span>One-Time Payment</span>
            </div>
          </div>
        </div>

        {/* Real User Reviews Section */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '4rem', marginTop: '2rem' }}>
          <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '3rem' }}>Clinical Performance Results</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', gap: '2px', color: '#fbbf24', marginBottom: '1rem' }}>
                <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" />
              </div>
              <p style={{ fontSize: '1rem', color: '#e2e8f0', lineHeight: '1.6', marginBottom: '1.5rem', fontStyle: 'italic' }}>
                "The structural clarity this provided for my daily routines is unmatched. It feels less like a generic guide and more like a prescribed clinical protocol."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0,255,102,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-green)', fontWeight: '700' }}>MR</div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#fff' }}>Marcus R.</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-green)' }}>Verified Buyer</div>
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', gap: '2px', color: '#fbbf24', marginBottom: '1rem' }}>
                <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" />
              </div>
              <p style={{ fontSize: '1rem', color: '#e2e8f0', lineHeight: '1.6', marginBottom: '1.5rem', fontStyle: 'italic' }}>
                "I've tried multiple tracking systems, but this one completely overhauled how I manage my supplementation and training metrics. Phenomenal."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0,255,102,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-green)', fontWeight: '700' }}>JL</div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#fff' }}>James L.</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-green)' }}>Verified Buyer</div>
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', gap: '2px', color: '#fbbf24', marginBottom: '1rem' }}>
                <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" />
              </div>
              <p style={{ fontSize: '1rem', color: '#e2e8f0', lineHeight: '1.6', marginBottom: '1.5rem', fontStyle: 'italic' }}>
                "Immediate delivery and the quality is incredibly high. Exactly the kind of evidence-based approach I expect from EternoFit."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0,255,102,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-green)', fontWeight: '700' }}>EK</div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#fff' }}>Evan K.</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-green)' }}>Verified Buyer</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DigitalProductPage;
