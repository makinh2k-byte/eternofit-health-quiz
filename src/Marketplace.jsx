import React, { useState, useEffect, useMemo } from 'react';
import { Search, ArrowRight, Activity, Shield, X, Info, Lock, Eye } from 'lucide-react';
import { trackEvent } from './analytics';
import SEO from './components/SEO';

const Marketplace = ({ globalProducts, navigateTo }) => {
  const [search, setSearch] = useState('');
  const initialCategory = new URLSearchParams(window.location.search).get('category') || 'All';
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('Default');
  const [currentPage, setCurrentPage] = useState(1);
  const [ageVerified, setAgeVerified] = useState(() => {
    try { return localStorage.getItem('ef_age_verified') === 'true'; } catch { return false; }
  });
  const [showAgeModal, setShowAgeModal] = useState(false);

  const ITEMS_PER_PAGE = 12;

  const categories = useMemo(() => {
    const cats = new Set(['All']);
    if (globalProducts) {
      globalProducts.forEach(p => {
        if (p.category) cats.add(p.category);
      });
    }
    return Array.from(cats);
  }, [globalProducts]);

  const hiddenAdultCount = useMemo(() => {
    if (!globalProducts) return 0;
    return globalProducts.filter(p => p.status !== 'inactive' && p.ageGated && !ageVerified).length;
  }, [globalProducts, ageVerified]);

  const filteredProducts = useMemo(() => {
    if (!globalProducts) return [];

    let result = globalProducts.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                          (p.desc || p.description || '').toLowerCase().includes(search.toLowerCase());
      const matchCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const isActive = p.status !== 'inactive';
      const matchAge = ageVerified || !p.ageGated;
      return matchSearch && matchCategory && isActive && matchAge;
    });

    if (sortBy === 'Name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [globalProducts, search, selectedCategory, sortBy, ageVerified]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory, sortBy]);

  // Separate digital and physical products
  const digitalProducts = filteredProducts.filter(p => p.category === 'Digital Products');
  const physicalProducts = filteredProducts.filter(p => p.category !== 'Digital Products');

  const totalPages = Math.ceil(physicalProducts.length / ITEMS_PER_PAGE);

  const paginatedPhysicalProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return physicalProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [physicalProducts, currentPage]);

  const marketplaceSchema = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": filteredProducts.map((p, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "item": {
          "@type": "Product",
          "name": p.name,
          "description": p.description || p.desc || p.rationale || '',
          "image": p.image ? `https://eternofit.com${p.image}` : undefined,
          "category": p.category,
          "offers": {
             "@type": "Offer",
             "availability": "https://schema.org/InStock"
          }
        }
      }))
    };
  }, [filteredProducts]);

  const seoTitle = selectedCategory === 'All' 
    ? "High-Performance Marketplace | EternoFit" 
    : `${selectedCategory} Supplements & Products | EternoFit Marketplace`;

  return (
    <div className="marketplace-page page-bg" style={{ minHeight: '100vh', padding: '120px 0 60px' }}>
      <SEO 
        title={seoTitle} 
        description="A curated selection of clinical-grade supplements and performance-enhancing tools for professional-grade optimization." 
        url={`https://eternofit.com/marketplace${selectedCategory !== 'All' ? `?category=${encodeURIComponent(selectedCategory)}` : ''}`}
        schema={marketplaceSchema}
      />
      <div className="site-container">
        {/* Search bar */}
        <div style={{ maxWidth: '560px', margin: '0 auto 2rem', position: 'relative' }}>
          <input
            type="text"
            placeholder="Search products..."
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

        {/* Category pill filters */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '3rem' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(1);
                window.history.replaceState({}, '', `/marketplace${cat !== 'All' ? '?category=' + encodeURIComponent(cat) : ''}`);
              }}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '999px',
                fontSize: '0.9rem',
                border: selectedCategory === cat ? '1px solid var(--accent-green)' : '1px solid rgba(255,255,255,0.22)',
                background: selectedCategory === cat ? 'var(--accent-green-dim)' : 'rgba(10,10,10,0.75)',
                color: selectedCategory === cat ? 'var(--accent-green)' : '#fff',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {digitalProducts.length > 0 && (
          <div style={{ marginBottom: '5rem' }}>
            <h2 style={{ fontSize: '2rem', color: '#fff', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Shield size={28} color="var(--accent-green)" /> Digital Guides & Resources
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
              {digitalProducts.map((p, i) => (
                <div
                  key={p.id || i}
                  className="glass-card"
                  onClick={() => { trackEvent('marketplace_product_click', { product: p.name }); navigateTo('product/' + encodeURIComponent(p.name.toLowerCase().replace(/\s+/g, '-'))); }}
                  style={{ cursor: 'pointer', padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s ease, border-color 0.2s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'var(--accent-green)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
                >
                  <div style={{ width: '100%', height: '160px', overflow: 'hidden', flexShrink: 0, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img
                      src={p.image || `https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&sig=${i}`}
                      alt={p.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s ease' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  </div>
                  <div style={{ padding: '1.1rem 1.25rem 1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--accent-green)', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>{p.subniche || p.category}</span>
                    <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main-site)', lineHeight: '1.4', marginBottom: '0.5rem' }}>{p.name}</h3>
                    <p style={{ color: 'var(--text-muted-site)', fontSize: '0.83rem', lineHeight: '1.5', marginBottom: '1rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.desc || p.description}</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                      <span style={{ fontWeight: '800', fontSize: '1rem', color: p.isFree ? 'var(--accent-green)' : p.isBundle ? '#fbbf24' : '#fff' }}>
                        {p.isFree ? 'FREE' : p.price != null ? `$${p.price}` : 'Instant Access'}
                        {p.badge && <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: '700', color: 'var(--text-muted-site)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{p.badge}</span>}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--accent-green)', fontSize: '0.82rem', fontWeight: '700' }}>View <ArrowRight size={14} /></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {paginatedPhysicalProducts.length > 0 && (
          <div>
            <h2 style={{ fontSize: '2rem', color: '#fff', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Activity size={28} color="var(--accent-green)" /> Clinical Supplements
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
              {paginatedPhysicalProducts.map((p, i) => (
                <div
                  key={p.id || i}
                  className="glass-card"
                  onClick={() => { trackEvent('marketplace_product_click', { product: p.name }); navigateTo('product/' + encodeURIComponent(p.name.toLowerCase().replace(/\s+/g, '-'))); }}
                  style={{ cursor: 'pointer', padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s ease, border-color 0.2s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'var(--accent-green)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
                >
                  <div style={{ width: '100%', height: '160px', overflow: 'hidden', flexShrink: 0, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img
                      src={p.image || `https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&q=80&sig=${i+20}`}
                      alt={p.name}
                      style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '12px', display: 'block', transition: 'transform 0.3s ease' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  </div>
                  <div style={{ padding: '1.1rem 1.25rem 1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--accent-green)', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>{p.subniche || p.category}</span>
                    <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main-site)', lineHeight: '1.4', marginBottom: '0.5rem' }}>{p.name}</h3>
                    <p style={{ color: 'var(--text-muted-site)', fontSize: '0.83rem', lineHeight: '1.5', marginBottom: '1rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.desc || p.description}</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                      <span style={{ fontWeight: '800', fontSize: '1rem', color: '#fff' }}>{p.price || 'Check Price'}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--accent-green)', fontSize: '0.82rem', fontWeight: '700' }}>View <ArrowRight size={14} /></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                gap: '1rem', 
                marginTop: '3.5rem',
                background: 'rgba(255,255,255,0.02)',
                padding: '0.75rem 1.5rem',
                borderRadius: '50px',
                border: '1px solid rgba(255,255,255,0.05)',
                width: 'fit-content',
                margin: '3.5rem auto 0',
                backdropFilter: 'blur(10px)'
              }}>
                <button 
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage(prev => Math.max(1, prev - 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="site-btn-secondary"
                  style={{ 
                    padding: '8px 16px', 
                    fontSize: '0.85rem',
                    opacity: currentPage === 1 ? 0.4 : 1,
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                  }}
                >
                  Previous
                </button>
                <span style={{ color: 'var(--text-muted-site)', fontSize: '0.9rem' }}>
                  Page <strong style={{ color: '#ffffff' }}>{currentPage}</strong> of <strong style={{ color: '#ffffff' }}>{totalPages}</strong>
                </span>
                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage(prev => Math.min(totalPages, prev + 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="site-btn-secondary"
                  style={{ 
                    padding: '8px 16px', 
                    fontSize: '0.85rem',
                    opacity: currentPage === totalPages ? 0.4 : 1,
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
        
        {digitalProducts.length === 0 && paginatedPhysicalProducts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted-site)' }}>
            <Activity size={64} style={{ margin: '0 auto 1.5rem', opacity: 0.2 }} />
            <h3>No products found matching your criteria.</h3>
            <button
              onClick={() => { setSearch(''); setSelectedCategory('All'); }}
              style={{ background: 'none', border: 'none', color: 'var(--accent-green)', cursor: 'pointer', fontSize: '1rem', marginTop: '1rem', textDecoration: 'underline' }}
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Age gate banner */}
        {!ageVerified && hiddenAdultCount > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', margin: '3rem 0 0', padding: '1.25rem 1.5rem', background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Lock size={22} color="#a78bfa" />
              <div>
                <p style={{ margin: 0, fontWeight: '700', color: '#e9d5ff', fontSize: '1rem' }}>
                  {hiddenAdultCount} Adult Health Products Are Hidden
                </p>
                <p style={{ margin: '2px 0 0', color: 'rgba(233,213,255,0.6)', fontSize: '0.85rem' }}>
                  Sexual health &amp; enhancement products for adults only.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAgeModal(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 22px', background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.5)', borderRadius: '10px', color: '#c4b5fd', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s ease', whiteSpace: 'nowrap' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.35)'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.8)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.2)'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)'; }}
            >
              <Eye size={16} /> Confirm I&apos;m 18+
            </button>
          </div>
        )}

        {/* Age verification modal */}
        {showAgeModal && (
          <>
            <div
              onClick={() => setShowAgeModal(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 2000, backdropFilter: 'blur(4px)' }}
            />
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 2001, background: '#0f0f0f', border: '1px solid rgba(139,92,246,0.4)', borderRadius: '20px', padding: '2.5rem', maxWidth: '440px', width: 'calc(100vw - 2rem)', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', background: 'rgba(139,92,246,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <Lock size={26} color="#a78bfa" />
              </div>
              <h3 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: '800', marginBottom: '0.75rem' }}>Age Verification Required</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                The products you are about to view are intended for adults aged 18 and over. By continuing, you confirm that you are at least 18 years of age.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                <button
                  onClick={() => setShowAgeModal(false)}
                  style={{ flex: 1, padding: '12px 20px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', color: 'rgba(255,255,255,0.6)', fontWeight: '600', fontSize: '0.95rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    try { localStorage.setItem('ef_age_verified', 'true'); } catch {}
                    setAgeVerified(true);
                    setShowAgeModal(false);
                    trackEvent('age_gate_confirmed');
                  }}
                  style={{ flex: 1, padding: '12px 20px', background: 'linear-gradient(135deg, #7c3aed, #a855f7)', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer' }}
                >
                  Yes, I&apos;m 18+
                </button>
              </div>
            </div>
          </>
        )}

        {/* Affiliate disclosure */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', maxWidth: '760px', margin: '4rem auto 0', background: 'rgba(255,193,7,0.06)', border: '1px solid rgba(255,193,7,0.2)', borderRadius: '12px', padding: '0.85rem 1.1rem' }}>
          <Info size={16} color="#ffc107" style={{ flexShrink: 0, marginTop: '2px' }} />
          <p style={{ margin: 0, fontSize: '0.82rem', lineHeight: '1.6', color: 'var(--text-muted-site)' }}>
            <strong style={{ color: '#ffc107' }}>Affiliate disclosure:</strong> Some links in our Marketplace are affiliate links. EternoFit may earn a commission if you purchase through them, at no extra cost to you. Our product assessments are made independently — read our{' '}
            <button onClick={() => navigateTo('affiliate')} style={{ background: 'none', border: 'none', color: 'var(--accent-green)', cursor: 'pointer', padding: 0, fontSize: 'inherit', textDecoration: 'underline' }}>Affiliate Disclosure</button>.
          </p>
        </div>


      </div>
    </div>
  );
};

export default Marketplace;
