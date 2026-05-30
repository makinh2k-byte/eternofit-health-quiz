import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, ArrowRight, Activity, Shield, ChevronDown, X, ArrowLeft, ShoppingCart } from 'lucide-react';
import { trackEvent } from './analytics';
import SEO from './components/SEO';

const Marketplace = ({ globalProducts, navigateTo }) => {
  const [search, setSearch] = useState('');
  const initialCategory = new URLSearchParams(window.location.search).get('category') || 'All';
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('Default');
  const [currentPage, setCurrentPage] = useState(1);

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

  const filteredProducts = useMemo(() => {
    if (!globalProducts) return [];
    
    let result = globalProducts.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          (p.desc || p.description || '').toLowerCase().includes(search.toLowerCase());
      const matchCategory = selectedCategory === 'All' || p.category === selectedCategory;
      return matchSearch && matchCategory;
    });

    if (sortBy === 'Name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [globalProducts, search, selectedCategory, sortBy]);

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
    <div className="marketplace-page" style={{ background: 'var(--bg-dark-site)', minHeight: '100vh', padding: '120px 0 60px' }}>
      <SEO 
        title={seoTitle} 
        description="A curated selection of clinical-grade supplements and performance-enhancing tools for professional-grade optimization." 
        url={`https://eternofit.com/marketplace${selectedCategory !== 'All' ? `?category=${encodeURIComponent(selectedCategory)}` : ''}`}
        schema={marketplaceSchema}
      />
      <div className="site-container">
        <div className="marketplace-header" style={{ textAlign: 'center', marginBottom: '3rem', padding: '0 1rem' }}>
          <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', color: 'var(--text-main-site)', marginBottom: '1rem', lineHeight: '1.1', textTransform: 'uppercase' }}>
            ETERNO<span style={{ color: 'var(--accent-green)' }}>FIT</span> Marketplace
          </h1>
          <p style={{ color: 'var(--text-muted-site)', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>
            A curated selection of clinical-grade supplements and performance-enhancing tools for professional-grade optimization.
          </p>
        </div>

        <div className="products-controls" style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '1.5rem', 
          marginBottom: '3rem',
          background: 'rgba(255,255,255,0.03)',
          padding: '1.5rem',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.05)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ flex: '1 1 300px', position: 'relative' }}>
            <input 
              type="text" 
              placeholder="Search elite products..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '14px 16px 14px 44px', 
                borderRadius: '12px', 
                border: '1px solid var(--accent-green-dim)', 
                background: 'rgba(0,0,0,0.4)', 
                color: 'var(--text-main-site)',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
            />
            <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-green)' }} />
            {search && (
              <button 
                onClick={() => setSearch('')}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <select 
                value={selectedCategory} 
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedCategory(val);
                  window.history.replaceState({}, '', `/marketplace${val !== 'All' ? '?category=' + encodeURIComponent(val) : ''}`);
                }}
                style={{ 
                  padding: '14px 40px 14px 16px', 
                  borderRadius: '12px', 
                  border: '1px solid var(--accent-green-dim)', 
                  background: 'rgba(0,0,0,0.4)', 
                  color: 'var(--text-main-site)',
                  fontSize: '1rem',
                  outline: 'none',
                  appearance: 'none',
                  cursor: 'pointer',
                  minWidth: '160px',
                  transition: 'all 0.3s ease'
                }}
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <ChevronDown size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-green)', pointerEvents: 'none' }} />
            </div>

            <div style={{ position: 'relative' }}>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                style={{ 
                  padding: '14px 40px 14px 16px', 
                  borderRadius: '12px', 
                  border: '1px solid var(--accent-green-dim)', 
                  background: 'rgba(0,0,0,0.4)', 
                  color: 'var(--text-main-site)',
                  fontSize: '1rem',
                  outline: 'none',
                  appearance: 'none',
                  cursor: 'pointer',
                  minWidth: '180px',
                  transition: 'all 0.3s ease'
                }}
              >
                <option value="Default">Default Sorting</option>
                <option value="Name">Name</option>
              </select>
              <ChevronDown size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-green)', pointerEvents: 'none' }} />
            </div>
          </div>
        </div>

        {digitalProducts.length > 0 && (
          <div style={{ marginBottom: '5rem' }}>
            <h2 style={{ fontSize: '2rem', color: '#fff', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Shield size={28} color="var(--accent-green)" /> Digital Protocols & Guides
            </h2>
            <div className="site-product-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
              {digitalProducts.map((p, i) => (
                <div key={p.id || i} className="site-product-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'rgba(0, 255, 102, 0.02)', border: '1px solid rgba(0, 255, 102, 0.1)' }}>
                  <div className="site-product-img" style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {p.image ? (
                      <img src={p.image} alt={p.name} style={{ maxHeight: '80%', objectFit: 'contain' }} />
                    ) : (
                      <Shield size={48} color="rgba(255,255,255,0.1)" />
                    )}
                  </div>
                  <div className="site-product-info" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--accent-green)', letterSpacing: '0.05em' }}>{p.category}</span>
                    </div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>{p.name}</h3>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-muted-site)', marginBottom: '1.5rem', flex: 1 }}>{p.desc || p.description}</p>
                    <div className="site-product-footer" style={{ marginTop: 'auto' }}>
                      <span className="price" style={{ fontSize: '1.25rem' }}>Instant Access</span>
                      <button 
                        onClick={() => navigateTo('product/' + encodeURIComponent(p.name.toLowerCase().replace(/\s+/g, '-')))}
                        className="site-btn-primary" 
                        style={{ textDecoration: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        View Details <ArrowRight size={16} className="inline ml-1" />
                      </button>
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
            <div className="site-product-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
              {paginatedPhysicalProducts.map((p, i) => (
                <div key={p.id || i} className="site-product-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div className="site-product-img">
                    <img src={p.image || `https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&q=80&sig=${i+20}`} alt={p.name} />
                  </div>
                  <div className="site-product-info" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--accent-green)', letterSpacing: '0.05em' }}>{p.category}</span>
                    </div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>{p.name}</h3>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-muted-site)', marginBottom: '1.5rem', flex: 1 }}>{p.desc || p.description}</p>
                    <div className="site-product-footer" style={{ marginTop: 'auto' }}>
                      <span className="price" style={{ fontSize: '1.25rem' }}>{p.price || 'Check Price'}</span>
                      <a 
                        href={p.affiliateLink || '#'} 
                        onClick={() => trackEvent(`${window.userSource || 'organic'}_affiliate_link_clicked`, { product: p.name, location: 'products_page' })}
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={`site-btn-secondary ${p.affiliateLink?.includes('lemonsqueezy.com') ? 'lemonsqueezy-button' : ''}`}
                        style={{ textDecoration: 'none' }}
                      >
                        Buy Now
                      </a>
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


      </div>
    </div>
  );
};

export default Marketplace;
