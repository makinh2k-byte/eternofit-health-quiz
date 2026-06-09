import React, { useEffect } from 'react';

const SEO = ({ 
  title = "EternoFit | High-Performance Clinical Health & Fitness Programs",
  description = "EternoFit provides evidence-based health assessments and clinical performance programs. Optimizing human biology through precision nutrition, tactical training, and hormonal health.",
  keywords = "clinical health assessment, performance optimization, tactical fitness, bio-identical nutrition, longevity programs, health coaching, hormone health",
  image = "https://eternofit.com/Metatag.jpg",
  url = "https://eternofit.com",
  schema = null
}) => {
  useEffect(() => {
    // 1. Update Title
    document.title = title;

    // Helper to update or create meta tags safely
    const setMetaTag = (selector, attribute, value, createAs) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        if (createAs.name) element.setAttribute('name', createAs.name);
        if (createAs.property) element.setAttribute('property', createAs.property);
        document.head.appendChild(element);
      }
      element.setAttribute(attribute, value);
    };

    // 2. Standard Meta Tags
    setMetaTag('meta[name="description"]', 'content', description, { name: 'description' });
    setMetaTag('meta[name="keywords"]', 'content', keywords, { name: 'keywords' });

    // 3. Open Graph (Facebook/LinkedIn)
    setMetaTag('meta[property="og:title"]', 'content', title, { property: 'og:title' });
    setMetaTag('meta[property="og:description"]', 'content', description, { property: 'og:description' });
    setMetaTag('meta[property="og:image"]', 'content', image, { property: 'og:image' });
    setMetaTag('meta[property="og:url"]', 'content', url, { property: 'og:url' });

    // 4. Twitter Cards
    setMetaTag('meta[property="twitter:title"]', 'content', title, { property: 'twitter:title' });
    setMetaTag('meta[property="twitter:description"]', 'content', description, { property: 'twitter:description' });
    setMetaTag('meta[property="twitter:image"]', 'content', image, { property: 'twitter:image' });
    setMetaTag('meta[property="twitter:url"]', 'content', url, { property: 'twitter:url' });

    // 5. Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    // 6. JSON-LD Schema
    let scriptTag = document.querySelector('script[id="dynamic-json-ld"]');
    if (schema) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.setAttribute('type', 'application/ld+json');
        scriptTag.setAttribute('id', 'dynamic-json-ld');
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(schema);
    } else if (scriptTag) {
      scriptTag.remove();
    }

  }, [title, description, keywords, image, url, schema]);

  return null;
};

export default SEO;
