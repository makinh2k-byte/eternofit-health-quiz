import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Clock, User, ChevronRight, BookOpen } from 'lucide-react';
import { articles } from './data/articles';
import SEO from './components/SEO';

export const Articles = ({ navigateTo, initialSlug, globalProducts }) => {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  
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

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  const relatedArticles = useMemo(() => {
    if (!selectedArticle) return [];
    // Deterministic related articles based on index to avoid layout shift re-renders
    const currentIndex = articles.findIndex(a => a.id === selectedArticle.id);
    return [
      articles[(currentIndex + 1) % articles.length],
      articles[(currentIndex + 2) % articles.length]
    ];
  }, [selectedArticle]);

  const recommendedProducts = useMemo(() => {
    if (!globalProducts || globalProducts.length === 0) return [];
    return [...globalProducts].sort(() => 0.5 - Math.random()).slice(0, 3);
  }, [globalProducts]);

  const handleOpenArticle = (article) => {
    window.history.pushState({}, '', `/article/${article.id}`);
    setSelectedArticle(article);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    window.history.pushState({}, '', '/articles');
    setSelectedArticle(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredArticles = useMemo(() => {
    return articles.filter(a => activeCategory === 'All' || a.category === activeCategory);
  }, [activeCategory]);

  const ITEMS_PER_PAGE = 12;
  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);

  const paginatedArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredArticles.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredArticles, currentPage]);

  if (selectedArticle) {
    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": selectedArticle.title,
      "image": [
        `https://eternofit.com${selectedArticle.image}`
      ],
      "datePublished": selectedArticle.date || new Date().toISOString(),
      "author": [{
          "@type": "Organization",
          "name": "EternoFit Health Team",
          "url": "https://eternofit.com"
      }]
    };

    return (
      <div className="site-container" style={{ padding: '120px 24px 60px', maxWidth: '800px', margin: '0 auto', color: 'var(--text-main-site)' }}>
        <SEO 
          title={`${selectedArticle.title} | EternoFit`} 
          description={selectedArticle.metaDesc} 
          image={`https://eternofit.com${selectedArticle.image}`}
          url={`https://eternofit.com/article/${selectedArticle.id}`}
          schema={articleSchema}
        />
        <button 
          onClick={handleBack}
          className="btn-secondary"
          style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'transparent', border: '1px solid var(--border-subtle)' }}
        >
          <ArrowLeft size={18} /> Back to Articles
        </button>
        
        <article className="glass-card fade-enter" style={{ padding: '3rem 2rem' }}>
          <h1 className="title" style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', textAlign: 'left', marginBottom: '1.5rem', lineHeight: '1.2' }}>
            {selectedArticle.title}
          </h1>
          
          {selectedArticle.image && (
            <div style={{ width: '100%', height: '400px', borderRadius: '16px', overflow: 'hidden', marginBottom: '2.5rem', border: '1px solid var(--border-subtle)' }}>
              <img src={selectedArticle.image} alt={selectedArticle.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '3rem', color: 'var(--text-muted-site)', fontSize: '0.9rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={16} /> EternoFit Health Team
            </div>
            {selectedArticle.date && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {selectedArticle.date}
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={16} /> {selectedArticle.readTime}
            </div>
          </div>
          
          <div 
            className="article-content"
            style={{ lineHeight: '1.8', fontSize: '1.1rem', color: 'var(--text-main-site)' }}
            dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
          />

          {selectedArticle.authorBio && (
            <div style={{ marginTop: '3rem', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-subtle)', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--accent-green-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <User size={30} color="var(--accent-green)" />
              </div>
              <div>
                <h4 style={{ color: 'var(--text-main-site)', marginBottom: '0.5rem', fontSize: '1.1rem' }}>About the Author: {selectedArticle.author || 'EternoFit Clinical Team'}</h4>
                <p style={{ color: 'var(--text-muted-site)', fontSize: '0.95rem', lineHeight: '1.5', margin: 0 }}>
                  {selectedArticle.authorBio}
                </p>
              </div>
            </div>
          )}

          <div style={{ marginTop: '4rem', padding: '2rem', background: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ color: 'var(--text-main-site)', marginBottom: '1rem', fontSize: '1.2rem' }}>Ready to optimize your health?</h4>
            <p style={{ color: 'var(--text-muted-site)', marginBottom: '1.5rem' }}>
              Take our comprehensive health assessment to get a personalized breakdown of exactly what your body needs to perform at its peak.
            </p>
            <button className="btn-primary" onClick={() => navigateTo('quiz')} style={{ width: '100%' }}>
              Start Free Assessment <ChevronRight size={18} className="inline ml-2" />
            </button>
          </div>

          {recommendedProducts.length > 0 && (
            <div style={{ marginTop: '4rem', paddingTop: '3rem', borderTop: '1px solid var(--border-subtle)' }}>
              <h3 style={{ color: 'var(--text-main-site)', marginBottom: '2rem', fontSize: '1.5rem' }}>Recommended Supplements</h3>
              <div className="site-product-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
                {recommendedProducts.map((p, i) => (
                  <div key={i} className="site-product-card fade-in-up" style={{ animationDelay: `${0.1 * i}s` }}>
                    <div className="site-product-img">
                      <img src={p.image || `https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&q=80&sig=${i+10}`} alt={p.name} />
                    </div>
                    <div className="site-product-info">
                      <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', lineHeight: '1.4' }}>{p.name}</h3>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted-site)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '1.5rem', flexGrow: 1 }}>{p.desc || p.description}</p>
                      <div className="site-product-footer" style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="price" style={{ color: 'var(--accent-green)', fontSize: '1.1rem', fontWeight: 'bold' }}>{p.price}</span>
                        <a 
                          href={p.affiliateLink || '#'} 
                          onClick={() => window.trackEvent && window.trackEvent(`${window.userSource || 'organic'}_affiliate_link_clicked`, { product: p.name })}
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="site-btn-secondary" 
                          style={{ textDecoration: 'none', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--accent-green)', color: 'var(--accent-green)', fontSize: '0.9rem', fontWeight: '600', transition: 'all 0.2s ease' }}
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
            <div style={{ marginTop: '4rem', paddingTop: '3rem', borderTop: '1px solid var(--border-subtle)' }}>
              <h3 style={{ color: 'var(--text-main-site)', marginBottom: '2rem', fontSize: '1.5rem' }}>Related Topics</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                {relatedArticles.map((article) => (
                  <div 
                    key={article.id} 
                    className="glass-card" 
                    style={{ padding: '1.5rem', cursor: 'pointer', transition: 'transform 0.2s, border-color 0.2s' }}
                    onClick={() => handleOpenArticle(article)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.borderColor = 'var(--accent-green)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    }}
                  >
                    {article.image && (
                      <div style={{ width: '100%', height: '140px', borderRadius: '8px', overflow: 'hidden', marginBottom: '1rem', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <img src={article.image} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-main-site)', lineHeight: '1.3' }}>
                      {article.title}
                    </h4>
                    <div style={{ color: 'var(--accent-green)', fontSize: '0.85rem', fontWeight: '600', marginTop: '1rem', display: 'flex', alignItems: 'center' }}>
                      Read Article <ChevronRight size={14} style={{ marginLeft: '4px' }}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    );
  }

  return (
    <div className="site-container" style={{ padding: '120px 24px 80px' }}>
      <SEO 
        title="Clinical Health Insights & Articles | EternoFit" 
        description="Science-backed articles, guides, and performance strategies to help you optimize your health and build biological resilience." 
        url="https://eternofit.com/articles" 
      />
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div className="icon-circle" style={{ margin: '0 auto 1.5rem', width: '80px', height: '80px', background: 'var(--accent-green-dim)', border: '1px solid var(--accent-green)' }}>
          <BookOpen size={32} color="var(--accent-green)" />
        </div>
        <h1 className="title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Health Insights</h1>
        <p className="subtitle" style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
          Science-backed articles, guides, and performance strategies to help you optimize your health and build biological resilience.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '3rem' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="btn-secondary fade-in-up"
            style={{ 
              padding: '0.5rem 1.25rem', 
              borderRadius: '999px',
              fontSize: '0.9rem',
              border: activeCategory === cat ? '1px solid var(--accent-green)' : '1px solid var(--border-subtle)',
              background: activeCategory === cat ? 'var(--accent-green-dim)' : 'transparent',
              color: activeCategory === cat ? 'var(--accent-green)' : 'var(--text-muted-site)',
              transition: 'all 0.2s ease'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="articles-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
        {paginatedArticles.map((article, idx) => (
          <div 
            key={article.id} 
            className="glass-card fade-in-up" 
            style={{ padding: '2rem', cursor: 'pointer', transition: 'transform 0.2s, border-color 0.2s', animationDelay: `${idx * 0.05}s` }}
            onClick={() => handleOpenArticle(article)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.borderColor = 'var(--accent-green)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
            }}
          >
            {article.image && (
              <div style={{ width: '100%', height: '200px', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <img src={article.image} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
            )}
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: 'var(--text-main-site)', lineHeight: '1.3' }}>
              {article.title}
            </h3>
            <p style={{ color: 'var(--text-muted-site)', fontSize: '0.95rem', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {article.metaDesc}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--accent-green)', fontSize: '0.9rem', fontWeight: '600', marginTop: 'auto' }}>
              <span>{article.date ? `${article.date} • ` : ''}{article.readTime}</span>
              <span style={{ display: 'flex', alignItems: 'center' }}>Read Article <ChevronRight size={16} style={{ marginLeft: '4px' }}/></span>
            </div>
          </div>
        ))}
      </div>

      {/* Premium Pagination Controls */}
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
            className="btn-secondary"
            style={{ 
              padding: '8px 16px', 
              fontSize: '0.85rem',
              opacity: currentPage === 1 ? 0.4 : 1,
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              background: 'transparent',
              border: '1px solid var(--border-subtle)'
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
            className="btn-secondary"
            style={{ 
              padding: '8px 16px', 
              fontSize: '0.85rem',
              opacity: currentPage === totalPages ? 0.4 : 1,
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              background: 'transparent',
              border: '1px solid var(--border-subtle)'
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
