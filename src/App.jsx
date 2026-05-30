import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowRight, Sparkles, CheckCircle2, Activity, Dumbbell, Zap, Brain, Shield, HeartPulse, Flame, Target, Droplets, Smile, Sunrise, Lock, LayoutDashboard, User, Mail, Globe, Clock, Moon, ChevronRight, ChevronDown, Search, X, Play, Apple, Facebook, Instagram, Youtube, Menu, Sliders } from 'lucide-react';
import { getFilteredProducts, getAdditionalRecommendations, calculateHealthScore, products as allProducts } from './data/products';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, getDoc, setDoc, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { db, auth } from './firebase';
import { useProducts } from './useProducts';
import ProductsAdmin from './ProductsAdmin';
import ConversionsAdmin from './ConversionsAdmin';
import QuizSessionsAdmin from './QuizSessionsAdmin';
import EmailMarketingAdmin from './EmailMarketingAdmin';
import Marketplace from './Marketplace';
import DigitalProductPage from './DigitalProductPage';
import { trackEvent, trackQuizSession } from './analytics';
import { Articles } from './Articles';
import { articles as globalArticles } from './data/articles';
import { ToolsPage } from './ToolsPage';
import SEO from './components/SEO';

const LoadingOverlay = ({ message }) => (
  <div className="fade-enter" style={{ position: 'fixed', inset: 0, background: 'rgba(245,247,250,0.95)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
    <div className="icon-circle" style={{ width: '80px', height: '80px', marginBottom: '2rem', animation: 'pulse 2s infinite ease-in-out' }}>
      <Activity size={40} color="var(--accent-green)" />
    </div>
    <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main-site)', marginBottom: '1rem' }}>{message}</h3>
    <div style={{ width: '200px', height: '4px', background: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
      <div style={{ width: '100%', height: '100%', background: 'var(--accent-green)', animation: 'progress 1.5s infinite linear', transformOrigin: 'left' }} />
    </div>
  </div>
);

const VisualEmailTemplate = ({ globalProducts }) => {
  const [data, setData] = useState(null);
  const [products, setProducts] = useState([]);
  const [complementary, setComplementary] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAdmin(!!user);
      setCheckingAuth(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchTemplate = async () => {
      // Support both search params and hash params for flexibility
      const searchParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.includes('?') ? window.location.hash.split('?')[1] : '');
      const id = searchParams.get('id') || hashParams.get('id');
      if (!id) return;

      try {
        const docRef = doc(db, "submissions", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const submission = { id: docSnap.id, ...docSnap.data() };
          setData(submission);
          const mainRecs = getFilteredProducts(submission.answers, globalProducts);
          setProducts(mainRecs);
          const mainNames = mainRecs.map(p => p.name);
          const others = getAdditionalRecommendations(submission.answers, mainNames, globalProducts);
          setComplementary(others);
        } else {
          throw new Error("Not found in Firebase");
        }
      } catch (e) {
        console.warn("Firebase fetch failed, trying local storage:", e);
        const allData = JSON.parse(localStorage.getItem('quiz_submissions') || '[]');
        const submission = allData.find(s => s.id === id);
        if (submission) {
          setData(submission);
          const mainRecs = getFilteredProducts(submission.answers, globalProducts);
          setProducts(mainRecs);
          const mainNames = mainRecs.map(p => p.name);
          const others = getAdditionalRecommendations(submission.answers, mainNames, globalProducts);
          setComplementary(others);
        }
      }
    };
    fetchTemplate();
  }, []);

  const handleAutoSend = async () => {
    if (!data) return;
    setIsSending(true);
    setSendStatus(null);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: data.email,
          subject: `Your EternoFit Health Summary - ${data.answers.name}`,
          htmlName: data.answers.name,
          reportUrl: window.location.origin,
          products: products.map(p => ({ ...p, image: p.image?.startsWith('http') ? p.image : `${window.location.origin}${p.image}` })),
          complementary: complementary.map(p => ({ ...p, image: p.image?.startsWith('http') ? p.image : `${window.location.origin}${p.image}` })),
          answers: { ...data.answers, id: data.id },
          healthScore: calculateHealthScore(data.answers)
        })
      });

      const result = await response.json();
      if (response.ok) {
        setSendStatus('success');
        alert('✨ Clinical report sent successfully!');
      } else {
        throw new Error(result.error || 'Failed to send');
      }
    } catch (err) {
      console.error(err);
      setSendStatus('error');
      alert(`❌ Error: ${err.message}. Make sure you set your RESEND_API_KEY in the Cloudflare Dashboard.`);
    } finally {
      setIsSending(false);
    }
  };

  const handleCopy = async () => {
    const el = document.getElementById('email-content-root');
    if (!el) return;
    try {
      const type = "text/html";
      const blob = new Blob([el.innerHTML], { type });
      const data = [new ClipboardItem({ [type]: blob })];
      await navigator.clipboard.write(data);
      alert('Email content copied to clipboard! You can now paste it directly into your email body.');
    } catch (err) {
      console.error('Failed to copy: ', err);
      alert('Failed to copy. Please select the content manually and copy.');
    }
  };

  if (checkingAuth) return <LoadingOverlay message="Verifying Administrative Access..." />;
  
  if (!isAdmin) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '2rem', textAlign: 'center' }}>
        <div className="icon-circle" style={{ width: '80px', height: '80px', marginBottom: '1.5rem' }}>
          <Lock size={40} />
        </div>
        <h2 style={{ color: 'var(--text-main-site)', marginBottom: '1rem', fontSize: '1.5rem' }}>Clinical Access Restricted</h2>
        <p style={{ color: 'var(--text-muted-site)', maxWidth: '400px', marginBottom: '2rem', lineHeight: '1.6' }}>
          This interface is reserved for authorized clinical staff. Visitors should refer to the assessment summary sent to their primary inbox.
        </p>
        <button className="btn-primary" onClick={() => { window.history.pushState({}, '', '/admin'); window.dispatchEvent(new PopStateEvent('popstate')); }}>
          Personnel Login
        </button>
      </div>
    );
  }

  if (!data) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading clinical details...</div>;

  return (
    <div style={{ background: '#f1f5f9', minHeight: '100vh', padding: '2rem 1rem', fontFamily: 'Inter, sans-serif' }}>
      <div id="email-content-root" style={{ maxWidth: '650px', margin: '0 auto', background: '#ffffff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}>
        <div style={{ background: '#ffffff', padding: '2.5rem', textAlign: 'center', color: '#1e293b', borderBottom: '4px solid #00ff66' }}>
          <img src={`${window.location.origin}/logo-dark-bg.png`} alt="EternoFit" style={{ height: '44px', marginBottom: '1.5rem', filter: 'invert(1) brightness(0)' }} />
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '700', color: '#1e293b' }}>Clinical Evaluation Report</h1>
          <p style={{ color: '#64748b', marginTop: '0.5rem', fontSize: '0.95rem' }}>Prepared exclusively for {data.answers.name}</p>
          <p style={{ color: '#94a3b8', fontSize: '11px', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Evaluation ID: #{data.id.toUpperCase()}</p>
        </div>
        
        <div style={{ padding: '2.5rem' }}>
          {/* Redesigned Vitality Index - Premium Spectrum Design */}
          {(() => {
            const h = calculateHealthScore(data.answers);
            return (
              <div style={{ marginBottom: '3rem', background: '#f8fafc', padding: '2.5rem', borderRadius: '24px', border: '1px solid #e2e8f0', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: '700' }}>Vitality Index</h3>
                    <div style={{ fontSize: '3rem', fontWeight: '800', color: '#1e293b', lineHeight: '1' }}>{h.score}<span style={{ fontSize: '1.25rem', color: '#94a3b8', fontWeight: '500' }}>/100</span></div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ background: h.color, color: 'white', padding: '6px 18px', borderRadius: '100px', fontSize: '0.9rem', fontWeight: '700', marginBottom: '8px', display: 'inline-block' }}>
                      Status: {h.status}
                    </div>
                  </div>
                </div>
                
                {/* Spectrum Bar */}
                <div style={{ position: 'relative', height: '12px', background: '#e2e8f0', borderRadius: '6px', marginBottom: '2.5rem', overflow: 'visible' }}>
                  {/* Gradient Overlay */}
                  <div style={{ position: 'absolute', inset: 0, borderRadius: '6px', background: 'linear-gradient(to right, #ef4444, #f59e0b, #10b981)' }}></div>
                  
                  {/* Pointer */}
                  <div style={{ 
                    position: 'absolute', 
                    left: `${h.score}%`, 
                    top: '50%', 
                    transform: 'translate(-50%, -50%)',
                    width: '24px',
                    height: '24px',
                    background: '#ffffff',
                    border: `4px solid ${h.color}`,
                    borderRadius: '50%',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 2,
                    transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }}></div>

                  {/* Marker Labels */}
                  <div style={{ position: 'absolute', top: '24px', left: 0, right: 0, display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>
                    <span>Baseline</span>
                    <span>Average</span>
                    <span>Peak</span>
                  </div>
                </div>

                <p style={{ margin: 0, fontSize: '0.95rem', color: '#475569', lineHeight: '1.6', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
                  Your score of <strong>{h.score}</strong> indicates that your physiological systems are currently operating in the <strong>{h.status.toLowerCase()}</strong> range. Our recommended formulations are specifically calibrated to move you toward the <strong>Peak</strong> vitality spectrum.
                </p>
              </div>
            );
          })()}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
            <div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Report ID</p>
              <p style={{ margin: 0, fontWeight: '600' }}>#{data.id.toUpperCase()}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Analysis Date</p>
              <p style={{ margin: 0, fontWeight: '600' }}>{new Date(data.timestamp).toLocaleDateString()}</p>
            </div>
          </div>

          <p style={{ fontSize: '1.1rem', color: '#1e293b', lineHeight: '1.6', marginBottom: '2rem' }}>
            Hello <strong>{data.answers.name}</strong>,<br /><br />
            Our clinical review of your assessment is complete. Based on your stated goal to improve <strong>{data.answers.primaryGoal.join(' & ')}</strong> and your specific focus on <strong>{Array.isArray(data.answers.specificFocus) ? data.answers.specificFocus.join(', ') : data.answers.specificFocus}</strong>, we have authorized the following formulation roadmap.
          </p>
          
          <h2 style={{ fontSize: '1.1rem', color: '#0084ff', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Target size={18} /> Authorized Formulations
          </h2>
          
          {products.map((prod, idx) => (
            <div key={idx} style={{ background: '#f8fafc', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem' }}>
                <img src={prod.image?.startsWith('http') ? prod.image : `${window.location.origin}${prod.image}`} alt={prod.name} style={{ width: '100px', height: '100px', borderRadius: '12px', objectFit: 'contain', border: '1px solid #e2e8f0', background: '#fff' }} />
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 6px 0', fontSize: '1.2rem', color: '#1e293b' }}>{prod.name}</h3>
                  <div style={{ fontSize: '0.85rem', color: '#0084ff', fontWeight: '600', marginBottom: '8px' }}>High Affinity Match</div>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569', lineHeight: '1.5' }}>{prod.description}</p>
                  {prod.bullets && (
                    <ul style={{ margin: '8px 0 0 0', paddingLeft: '1.2rem', fontSize: '0.85rem', color: '#475569', lineHeight: '1.4' }}>
                      {prod.bullets.map((b, i) => <li key={i}>{b}</li>)}
                    </ul>
                  )}
                </div>
              </div>
              <div style={{ background: '#ffffff', borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem', borderLeft: '4px solid #0084ff' }}>
                <p style={{ margin: '0 0 6px 0', fontSize: '0.85rem', fontWeight: '700', color: '#1e293b' }}>Clinical Rationale:</p>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: '1.5' }}>
                  {prod.rationale || `Based on your focus on ${Array.isArray(data.answers.specificFocus) ? data.answers.specificFocus[0] : data.answers.specificFocus}, this formulation is authorized for its high-affinity absorption and proven efficacy in supporting ${data.answers.primaryGoal[0]}.`}
                </p>
              </div>
              <a 
                href={prod.affiliateLink} 
                onClick={() => trackEvent(`${window.userSource || 'organic'}_affiliate_link_clicked`, { product: prod.name, source: 'web_report' })}
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ display: 'block', background: '#0084ff', color: 'white', padding: '12px', borderRadius: '10px', textDecoration: 'none', fontSize: '1rem', fontWeight: '600', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,132,255,0.2)' }}
              >
                Shop Now <ArrowRight size={18} className="inline ml-1" />
              </a>
            </div>
          ))}

          {complementary.length > 0 && (
            <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '2px dashed #e2e8f0' }}>
              <h2 style={{ fontSize: '1rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>Additional Recommendation</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {complementary.map((prod, idx) => (
                  <div key={idx} style={{ textAlign: 'center' }}>
                    <img src={prod.image?.startsWith('http') ? prod.image : `${window.location.origin}${prod.image}`} alt={prod.name} style={{ width: '120px', height: '120px', borderRadius: '12px', objectFit: 'contain', marginBottom: '1rem', border: '1px solid #e2e8f0', background: '#fff' }} />
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem' }}>{prod.name}</h4>
                    <p style={{ margin: '0 0 8px 0', fontSize: '0.8rem', color: '#64748b', lineHeight: '1.3' }}>{prod.description}</p>
                    <a 
                      href={prod.affiliateLink} 
                      onClick={() => trackEvent(`${window.userSource || 'organic'}_affiliate_link_clicked`, { product: prod.name, source: 'web_report_complementary' })}
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{ display: 'inline-block', background: '#ffffff', color: '#0084ff', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontWeight: '700', fontSize: '0.85rem', border: '1px solid #0084ff', marginTop: '0.5rem' }}
                    >
                      Shop Now
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Signature Section */}
          <div style={{ marginTop: '2rem', padding: '2rem 0', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <img 
              src={`${window.location.origin}/Eterno Fit Logo Design.png`} 
              alt="EternoFit" 
              style={{ width: '64px', height: '64px', borderRadius: '12px', background: '#000', objectFit: 'contain' }} 
            />
            <div>
              <p style={{ margin: 0, fontWeight: '700', color: '#1e293b', fontSize: '1.05rem' }}>The EternoFit Team</p>
              <p style={{ margin: '2px 0 0 0', color: '#64748b', fontSize: '0.9rem', lineHeight: '1.4' }}>Clinical Wellness & Performance<br/>Authorized Diagnostic Division</p>
            </div>
          </div>

          <div style={{ marginTop: '3rem', textAlign: 'center', padding: '2rem', background: '#f0fdf4', borderRadius: '16px', border: '1px solid #dcfce7' }}>
            <p style={{ margin: '0 0 1rem 0', color: '#166534', fontWeight: '700' }}>✓ Evaluation Authenticated - EternoFit Clinical Engine</p>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#166534', opacity: 0.8 }}>This protocol is generated based on your current physiological baseline.</p>
          </div>
        </div>

        <div style={{ padding: '2rem', textAlign: 'center', background: '#f8fafc', color: '#94a3b8', fontSize: '0.8rem', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ margin: '0 0 8px 0', fontWeight: '600', color: '#64748b' }}>🔒 Secure & Verified Communication</p>
            <p style={{ margin: 0, lineHeight: '1.4' }}>EternoFit will never ask for your password or payment details over email. This email was sent securely following CAN-SPAM regulations.</p>
          </div>
          <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <a href={`${window.location.origin}/support`} style={{ color: '#94a3b8', textDecoration: 'underline' }}>Clinical Support</a>
            <a href={`${window.location.origin}/privacy`} style={{ color: '#94a3b8', textDecoration: 'underline' }}>Privacy Policy</a>
            <a href={`${window.location.origin}/terms`} style={{ color: '#94a3b8', textDecoration: 'underline' }}>Terms of Service</a>
          </div>
          <p style={{ margin: '0 0 8px 0' }}>© 2026 EternoFit Wellness. All rights reserved.</p>
          <p style={{ margin: '0 0 1rem 0' }}>clinical@eternofit.com | Secure ID: {data.id}</p>
          <a href="#unsubscribe" style={{ color: '#ef4444', textDecoration: 'underline', fontWeight: '600' }}>Unsubscribe from future health insights</a>
        </div>
      </div>
      
      <div style={{ maxWidth: '650px', margin: '2rem auto', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button onClick={() => window.print()} className="btn-secondary" style={{ padding: '12px 24px', borderRadius: '12px' }}>Print / Download PDF</button>
        <button 
          onClick={handleAutoSend} 
          disabled={isSending}
          className="btn-primary" 
          style={{ padding: '12px 24px', borderRadius: '12px', background: sendStatus === 'success' ? '#10b981' : 'var(--primary)' }}
        >
          {isSending ? 'Sending...' : sendStatus === 'success' ? '✓ Email Sent' : 'Resend Clinical Email'}
        </button>
        <button onClick={handleCopy} className="btn-secondary" style={{ padding: '12px 24px', borderRadius: '12px' }}>Copy Template HTML</button>
      </div>
    </div>
  );
};

const TermsOfService = () => (
  <div className="glass-card fade-enter" style={{ maxWidth: '800px', margin: '2rem auto', textAlign: 'left', padding: '3rem' }}>
    <SEO title="Terms of Service | EternoFit" description="EternoFit clinical assessment terms of service." url="https://eternofit.com/terms" />
    <h1 className="title" style={{ textAlign: 'left', fontSize: '2rem' }}>Terms of Service</h1>
    <div style={{ color: 'var(--text-muted-site)', lineHeight: '1.8' }}>
      <p>By accessing EternoFit, you agree to our professional clinical assessment terms. Our recommendations are based on your personal inputs and clinical wellness standards.</p>
      <h3 style={{ color: 'var(--text-main-site)', marginTop: '1.5rem' }}>Clinical Disclaimer</h3>
      <p>Recommendations provided by EternoFit are for informational purposes only and do not replace professional medical advice. Always consult with a physician before starting any new supplement protocol.</p>
    </div>
    <button className="btn-secondary" onClick={() => { window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); }} style={{ marginTop: '2rem' }}>Return Home</button>
  </div>
);

const PrivacyPolicy = () => (
  <div className="glass-card fade-enter" style={{ maxWidth: '800px', margin: '2rem auto', textAlign: 'left', padding: '3rem' }}>
    <SEO title="Privacy Policy | EternoFit" description="EternoFit privacy policy. Your health data is encrypted and secure." url="https://eternofit.com/privacy" />
    <h1 className="title" style={{ textAlign: 'left', fontSize: '2rem' }}>Privacy Policy</h1>
    <div style={{ color: 'var(--text-muted-site)', lineHeight: '1.8' }}>
      <p>Your health data is encrypted and secure. We never sell your personal information to third parties.</p>
      <p>Data collected during the assessment is used solely to generate your personalized wellness protocol and to provide requested clinical support.</p>
    </div>
    <button className="btn-secondary" onClick={() => { window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); }} style={{ marginTop: '2rem' }}>Return Home</button>
  </div>
);

const ClinicalSupport = () => (
  <div className="glass-card fade-enter" style={{ maxWidth: '600px', margin: '2rem auto', textAlign: 'center', padding: '3rem' }}>
    <SEO title="Clinical Support | EternoFit" description="Direct access to the EternoFit human health team for clinical support." url="https://eternofit.com/support" />
    <div className="icon-circle" style={{ margin: '0 auto 1.5rem' }}><Mail size={32} /></div>
    <h1 className="title">Clinical Support</h1>
    <p className="subtitle">Direct access to our human health team.</p>
    <p style={{ color: 'var(--text-main-site)', fontSize: '1.2rem', marginBottom: '2rem' }}>
      Contact our clinical team directly at:<br/>
      <strong style={{ color: 'var(--accent-green)' }}>clinical@eternofit.com</strong>
    </p>
    <button className="btn-secondary" onClick={() => { window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); }}>Return Home</button>
  </div>
);

const AboutUs = () => (
  <div className="glass-card fade-enter" style={{ maxWidth: '800px', margin: '2rem auto', textAlign: 'left', padding: '3rem' }}>
    <SEO title="About EternoFit | Clinical Wellness Specialists" description="We are a premier collective of clinical wellness specialists, bio-optimization coaches, and performance nutritionists dedicated to helping individuals unlock high-performance biological states." url="https://eternofit.com/about" />
    <h1 className="title" style={{ textAlign: 'left', fontSize: '2.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
      <Activity size={32} color="var(--accent-green)" /> About EternoFit
    </h1>
    <div style={{ color: 'var(--text-muted-site)', lineHeight: '1.8', fontSize: '1.05rem' }}>
      <p style={{ marginBottom: '1.5rem' }}>
        Welcome to <strong>EternoFit</strong>. We are a premier collective of clinical wellness specialists, bio-optimization coaches, and performance nutritionists dedicated to helping individuals unlock high-performance biological states.
      </p>
      <p style={{ marginBottom: '1.5rem' }}>
        We believe that human potential is optimized through precision, evidence-based health assessments, and disciplined lifestyle adaptation. Unlike traditional "one-size-fits-all" fitness programs, we use data-driven insights to tailor specific protocols to your body's unique demands.
      </p>
      
      <h3 style={{ color: 'var(--text-main-site)', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.3rem' }}>Our Core Pillars:</h3>
      <ul style={{ paddingLeft: '1.5rem', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <li>
          <strong>Biological Precision:</strong> Every recommendation is backed by peer-reviewed research and tailored to address exact biological deficits.
        </li>
        <li>
          <strong>Sustainable Optimization:</strong> We emphasize gradual, compounding adaptations in sleep architecture, training volume, and smart supplementation rather than unsustainable quick fixes.
        </li>
        <li>
          <strong>Uncompromised Integrity:</strong> We only advocate for pure, clinically studied ingredients and therapeutic tools that align with longevity and systemic health.
        </li>
      </ul>
      
      <p style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', fontStyle: 'italic' }}>
        "Physical capability and biological resilience are not random occurrences—they are the direct results of structural discipline, consistent metrics, and evidence-backed protocols."
      </p>
    </div>
    <button className="btn-secondary" onClick={() => { window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); }} style={{ marginTop: '2rem' }}>Return Home</button>
  </div>
);

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 1000);
  };

  if (submitted) {
    return (
      <div className="glass-card fade-enter" style={{ maxWidth: '600px', margin: '2rem auto', textAlign: 'center', padding: '4rem 2rem' }}>
        <div className="icon-circle" style={{ margin: '0 auto 2rem', width: '80px', height: '80px' }}>
          <CheckCircle2 size={40} color="var(--accent-green)" />
        </div>
        <h2 className="title" style={{ fontSize: '2rem', marginBottom: '1rem' }}>Message Transmitted</h2>
        <p className="subtitle" style={{ fontSize: '1.1rem', maxWidth: '450px', margin: '0 auto 2rem' }}>
          Thank you, <strong>{formData.name}</strong>. Our clinical support team has received your transmission and will respond to <strong>{formData.email}</strong> within 24 hours.
        </p>
        <button className="btn-primary" onClick={() => { window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); }} style={{ maxWidth: '250px', margin: '0 auto' }}>
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="glass-card fade-enter" style={{ maxWidth: '650px', margin: '2rem auto', padding: '3rem' }}>
      <SEO title="Contact EternoFit | Clinical Support" description="Have questions about your health report? Get in touch with our support division." url="https://eternofit.com/contact" />
      <h1 className="title" style={{ fontSize: '2.25rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
        <Mail size={32} color="var(--accent-green)" /> Contact EternoFit
      </h1>
      <p className="subtitle" style={{ fontSize: '1.05rem', marginBottom: '2rem' }}>
        Have questions about your health report? Get in touch with our support division.
      </p>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-muted-site)', fontWeight: '600', marginLeft: '4px' }}>Full Name</label>
          <input 
            type="text" 
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="John Doe"
            style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main-site)', fontSize: '1rem', width: '100%', outline: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-muted-site)', fontWeight: '600', marginLeft: '4px' }}>Email Address</label>
          <input 
            type="email" 
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="john@example.com"
            style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main-site)', fontSize: '1rem', width: '100%', outline: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-muted-site)', fontWeight: '600', marginLeft: '4px' }}>Subject</label>
          <input 
            type="text" 
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            placeholder="Query regarding my Health Report"
            style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main-site)', fontSize: '1rem', width: '100%', outline: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-muted-site)', fontWeight: '600', marginLeft: '4px' }}>Message</label>
          <textarea 
            required
            rows={5}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Write your detailed inquiry here..."
            style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main-site)', fontSize: '1rem', width: '100%', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
          />
        </div>
        <button 
          type="submit" 
          className="btn-primary" 
          disabled={loading || !formData.name || !formData.email || !formData.message}
          style={{ marginTop: '0.5rem', width: '100%', opacity: (formData.name && formData.email && formData.message) ? 1 : 0.5 }}
        >
          {loading ? 'Transmitting...' : 'Send Message'} <ChevronRight size={18} style={{ marginLeft: '6px' }} />
        </button>
      </form>
      
      <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '2.5rem', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted-site)' }}>Or contact our clinical support team directly at:</p>
        <strong style={{ fontSize: '1.1rem', color: 'var(--accent-green)' }}>clinical@eternofit.com</strong>
      </div>
    </div>
  );
};

const Unsubscribe = () => {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const handleUnsubscribe = async () => {
    if (!email) return;
    try {
      const q = query(collection(db, "submissions"), where("email", "==", email));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        alert("Email not found in our records.");
        return;
      }
      for (const d of snapshot.docs) {
        await updateDoc(doc(db, "submissions", d.id), { unsubscribed: true });
      }
      setDone(true);
    } catch (e) {
      alert("Error processing request. Please contact clinical@eternofit.com.");
    }
  };

  if (done) return (
    <div className="glass-card fade-enter" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <CheckCircle2 size={48} color="var(--accent-green)" style={{ margin: '0 auto 1.5rem' }} />
      <h2 className="title">Unsubscribed Successfully</h2>
      <p className="subtitle">Your email has been removed from our update list.</p>
      <button className="btn-secondary" onClick={() => { window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); }}>Return Home</button>
    </div>
  );

  return (
    <div className="glass-card fade-enter" style={{ maxWidth: '500px', margin: '4rem auto', padding: '3rem' }}>
      <h1 className="title" style={{ fontSize: '1.5rem' }}>Unsubscribe</h1>
      <p className="subtitle">Enter your email to stop receiving updates from us.</p>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        placeholder="your@email.com"
        style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main-site)', marginBottom: '1.5rem', outline: 'none' }}
      />
      <button className="btn-primary" onClick={handleUnsubscribe}>Confirm Unsubscribe</button>
    </div>
  );
};

const AdminPanel = ({ onBack, globalProducts, reloadProducts, deliveryMode, onToggleDeliveryMode }) => {
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState('visitors');
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('desc');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortKey, sortOrder]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const q = query(collection(db, "submissions"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setData(fetchedData);
    }, (error) => {
      console.warn("Firebase onSnapshot failed, falling back to local storage.", error);
      const savedData = JSON.parse(localStorage.getItem('quiz_submissions') || '[]');
      setData(savedData);
    });

    return () => unsubscribe();
  }, [isAuthenticated]);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError('');
    } catch (err) {
      setError('Invalid administrative credentials.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const handleQuickSend = async (item) => {
    if (item.unsubscribed) {
      alert("⚠️ This user has unsubscribed and cannot receive automated emails.");
      return;
    }
    
    if (!window.confirm(`Send health summary to ${item.answers.name} (${item.email})?`)) return;

    try {
      const recommendations = getFilteredProducts(item.answers, globalProducts);
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: item.email,
          subject: `Your EternoFit Health Summary - ${item.answers.name}`,
          htmlName: item.answers.name,
          reportUrl: window.location.origin,
          products: recommendations,
          complementary: getAdditionalRecommendations(item.answers, recommendations.map(r => r.name), globalProducts),
          answers: { ...item.answers, id: item.id },
          healthScore: calculateHealthScore(item.answers)
        })
      });

      if (response.ok) {
        alert("✨ Email sent successfully!");
        trackEvent('email_sent', { targetEmail: item.email, submissionId: item.id });
        toggleStatus(item.id); // Mark as emailed
      } else {
        alert("❌ Failed to send. Check console.");
      }
    } catch (e) {
      alert("❌ Error: " + e.message);
    }
  };

  const toggleStatus = async (id) => {
    const itemToUpdate = data.find(item => item.id === id);
    if (!itemToUpdate) return;

    let nextStatus;
    if (itemToUpdate.status === 'Received') nextStatus = 'Emailed';
    else if (itemToUpdate.status === 'Emailed') nextStatus = 'Rejected';
    else nextStatus = 'Received';

    const newData = data.map(item => item.id === id ? { ...item, status: nextStatus } : item);
    setData(newData);

    try {
      const docRef = doc(db, "submissions", id);
      await updateDoc(docRef, { status: nextStatus });
    } catch (e) {
      console.warn("Firebase update failed, updating local storage.", e);
      localStorage.setItem('quiz_submissions', JSON.stringify(newData));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this visitor record?')) {
      const newData = data.filter(item => item.id !== id);
      setData(newData);
      
      try {
        await deleteDoc(doc(db, "submissions", id));
      } catch (e) {
        console.warn("Firebase delete failed, deleting from local storage.", e);
        localStorage.setItem('quiz_submissions', JSON.stringify(newData));
      }
    }
  };

  const handleExport = () => {
    const headers = ['ID', 'Timestamp', 'Name', 'Email', 'IP', 'Goals', 'Focus', 'Urgency', 'Products', 'Status'];
    const rows = filteredData.map(s => [
      s.id,
      new Date(s.timestamp).toLocaleString(),
      s.answers.name,
      s.email,
      s.ip,
      s.answers.primaryGoal.join('; '),
      Array.isArray(s.answers.specificFocus) ? s.answers.specificFocus.join('; ') : s.answers.specificFocus,
      s.answers.urgency,
      s.recommendations ? s.recommendations.join('; ') : '',
      s.status || 'Received'
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `eternofit_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredData = data
    .filter(item => {
      const searchLower = search.toLowerCase();
      const nameMatch = item.answers?.name?.toLowerCase().includes(searchLower);
      const emailMatch = item.email?.toLowerCase().includes(searchLower);
      const goalMatch = item.answers?.primaryGoal?.some(g => g.toLowerCase().includes(searchLower));
      const focusMatch = Array.isArray(item.answers?.specificFocus) 
        ? item.answers.specificFocus.some(f => f.toLowerCase().includes(searchLower))
        : item.answers?.specificFocus?.toLowerCase().includes(searchLower);
      
      return nameMatch || emailMatch || goalMatch || focusMatch;
    })
    .sort((a, b) => {
      const valA = sortKey === 'timestamp' ? new Date(a[sortKey]) : a[sortKey];
      const valB = sortKey === 'timestamp' ? new Date(b[sortKey]) : b[sortKey];
      return sortOrder === 'asc' ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
    });

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--text-muted)' }}>Loading admin portal...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="glass-card fade-enter" style={{ maxWidth: '400px', margin: '2rem auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="icon-circle" style={{ margin: '0 auto 1rem' }}>
            <Lock size={24} color="var(--accent-green)" />
          </div>
          <h2 className="title" style={{ fontSize: '1.5rem' }}>Admin Authentication</h2>
          <p className="subtitle">Secure portal for EternoFit admin access only.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Admin Email"
            style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main-site)', fontSize: '1rem', width: '100%', outline: 'none' }}
          />
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Secure Password"
            style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main-site)', fontSize: '1rem', width: '100%', outline: 'none' }}
          />
          {error && <p style={{ color: '#ef4444', fontSize: '0.85rem', textAlign: 'center' }}>{error}</p>}
          <button className="btn-primary" onClick={handleLogin}>
            Access Dashboard <ChevronRight size={18} />
          </button>
          <button onClick={onBack} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted-site)', cursor: 'pointer', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Return to Assessment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container fade-enter" style={{ maxWidth: '1400px' }}>
      
      {/* Row 1: Dashboard Header Title & Actions */}
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <LayoutDashboard size={24} color="var(--primary)" />
          <h2 style={{ margin: 0, fontSize: '1.65rem', fontWeight: '800', letterSpacing: '-0.02em' }}>Visitor Analytics Dashboard</h2>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={handleExport} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Target size={14} /> Export CSV
          </button>
          <button onClick={handleLogout} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem', border: '1px solid #ef4444', color: '#ef4444' }}>
            Logout
          </button>
          <button onClick={onBack} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            Exit Dashboard
          </button>
        </div>
      </div>

      {/* Row 2: Sub-bar with Navigation Tabs and Quiz Mode Toggle Switch */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'nowrap', gap: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '1.25rem', overflowX: 'auto', width: '100%' }}>
        {/* Left Side: Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'nowrap' }}>
          <button 
            onClick={() => setActiveTab('visitors')} 
            className={activeTab === 'visitors' ? 'btn-primary' : 'btn-secondary'} 
            style={{ padding: '8px 16px', fontSize: '0.85rem', borderRadius: '8px', width: 'auto', color: activeTab === 'visitors' ? '#000000' : 'var(--text-main-site)' }}
          >
            Visitors
          </button>
          <button 
            onClick={() => setActiveTab('quizSessions')} 
            className={activeTab === 'quizSessions' ? 'btn-primary' : 'btn-secondary'} 
            style={{ padding: '8px 16px', fontSize: '0.85rem', borderRadius: '8px', width: 'auto', color: activeTab === 'quizSessions' ? '#000000' : 'var(--text-main-site)' }}
          >
            Quiz Sessions
          </button>
          <button 
            onClick={() => setActiveTab('conversions')} 
            className={activeTab === 'conversions' ? 'btn-primary' : 'btn-secondary'} 
            style={{ padding: '8px 16px', fontSize: '0.85rem', borderRadius: '8px', width: 'auto', color: activeTab === 'conversions' ? '#000000' : 'var(--text-main-site)' }}
          >
            Conversions
          </button>
          <button 
            onClick={() => setActiveTab('products')} 
            className={activeTab === 'products' ? 'btn-primary' : 'btn-secondary'} 
            style={{ padding: '8px 16px', fontSize: '0.85rem', borderRadius: '8px', width: 'auto', color: activeTab === 'products' ? '#000000' : 'var(--text-main-site)' }}
          >
            Products
          </button>
          <button 
            onClick={() => setActiveTab('emailMarketing')} 
            className={activeTab === 'emailMarketing' ? 'btn-primary' : 'btn-secondary'} 
            style={{ padding: '8px 16px', fontSize: '0.85rem', borderRadius: '8px', width: 'auto', color: activeTab === 'emailMarketing' ? '#000000' : 'var(--text-main-site)' }}
          >
            Email Marketing
          </button>
        </div>

        {/* Right Side: Quiz Delivery Mode Switch */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'nowrap', flexShrink: 0 }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted-site)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Quiz Mode:</span>
          <div className="admin-toggle-switch" style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '30px', padding: '2px', boxShadow: '0 0 15px rgba(0, 255, 102, 0.05)' }}>
            <button 
              onClick={() => onToggleDeliveryMode('email')} 
              className={`admin-toggle-btn ${deliveryMode === 'email' ? 'active' : ''}`}
              style={{
                background: deliveryMode === 'email' ? 'var(--primary)' : 'transparent',
                color: deliveryMode === 'email' ? '#000000' : 'var(--text-muted-site)',
                border: 'none',
                borderRadius: '20px',
                padding: '6px 14px',
                fontSize: '0.75rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <Mail size={12} /> Send to Email
            </button>
            <button 
              onClick={() => onToggleDeliveryMode('instant')} 
              className={`admin-toggle-btn ${deliveryMode === 'instant' ? 'active' : ''}`}
              style={{
                background: deliveryMode === 'instant' ? 'var(--primary)' : 'transparent',
                color: deliveryMode === 'instant' ? '#000000' : 'var(--text-muted-site)',
                border: 'none',
                borderRadius: '20px',
                padding: '6px 14px',
                fontSize: '0.75rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <Globe size={12} /> Instant Web
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'products' ? (
        <ProductsAdmin products={globalProducts} onProductChange={reloadProducts} />
      ) : activeTab === 'quizSessions' ? (
        <QuizSessionsAdmin />
      ) : activeTab === 'conversions' ? (
        <ConversionsAdmin />
      ) : activeTab === 'emailMarketing' ? (
        <EmailMarketingAdmin globalProducts={globalProducts} />
      ) : (
        <>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Search by name, email, or focus area..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: '100%', padding: '12px 16px 12px 40px', borderRadius: '10px', border: '1px solid var(--border-subtle)', fontSize: '0.95rem', background: 'var(--bg-surface)', color: 'var(--text-main-site)' }}
              />
              <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              {search && (
                <button 
                  onClick={() => setSearch('')}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
                >
                  <X size={12} />
                </button>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-surface)', padding: '0 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', fontSize: '0.85rem', color: 'var(--text-muted-site)', fontWeight: '600' }}>
              {filteredData.length} Records
            </div>
            <select 
              value={sortKey} 
              onChange={(e) => setSortKey(e.target.value)}
              style={{ padding: '0 1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main-site)' }}
            >
              <option value="timestamp">Sort by Date</option>
              <option value="email">Sort by Email</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>

          <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} style={{ cursor: 'pointer' }}>
                <Clock size={14} /> Timestamp {sortKey === 'timestamp' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th><User size={14} /> Visitor</th>
              <th><Target size={14} /> Focus & Goals</th>
              <th><Zap size={14} /> Recommendations</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, idx) => (
              <tr key={item.id || idx} style={{ opacity: item.unsubscribed ? 0.6 : 1 }}>
                <td>{new Date(item.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</td>
                <td>
                  <div style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {item.answers.name}
                    {item.unsubscribed && <span style={{ background: '#fee2e2', color: '#ef4444', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px' }}>Unsubscribed</span>}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.email}</div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>{item.ip || 'Unknown'}</div>
                </td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {item.answers.primaryGoal.map((g, i) => (
                        <span key={i} className="admin-tag">{g}</span>
                      ))}
                    </div>
                  </div>
                </td>
                <td>
                  {item.recommendations ? item.recommendations.map((r, i) => (
                    <div key={i} style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '600' }}>• {r}</div>
                  )) : 'N/A'}
                </td>
                <td>
                  <button 
                    onClick={() => toggleStatus(item.id)}
                    className={`admin-tag`}
                    style={{ 
                      cursor: 'pointer', 
                      border: 'none', 
                      background: item.status === 'Emailed' ? '#dcfce7' : (item.status === 'Rejected' ? '#fee2e2' : '#fef08a'),
                      color: item.status === 'Emailed' ? '#166534' : (item.status === 'Rejected' ? '#991b1b' : '#854d0e'),
                      padding: '4px 10px'
                    }}
                  >
                    {item.status || 'Received'}
                  </button>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button 
                      onClick={() => handleQuickSend(item)} 
                      className="admin-link-btn"
                      disabled={item.unsubscribed}
                      style={{ background: 'var(--primary)', color: '#1e293b', border: 'none', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700' }}
                    >
                      <Mail size={12} /> Send Email
                    </button>
                    <button 
                      onClick={() => window.open(`${window.location.origin}/email-template?id=${item.id}`, '_blank')} 
                      className="admin-link-btn"
                    >
                      View Report
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)} 
                      className="admin-link-btn"
                      style={{ border: '1px solid #ef4444', color: '#ef4444', padding: '4px 10px' }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No records found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted-site)' }}>
            <span>Show</span>
            <select 
              value={pageSize} 
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main-site)', outline: 'none' }}
            >
              <option value={20}>20</option>
              <option value={100}>100</option>
            </select>
            <span>entries</span>
            <span style={{ marginLeft: '1rem' }}>
              Showing {filteredData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length} entries
            </span>
          </div>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.8rem', opacity: currentPage === 1 ? 0.4 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
            >
              Previous
            </button>
            <button 
              disabled={currentPage >= Math.ceil(filteredData.length / pageSize)} 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredData.length / pageSize)))}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.8rem', opacity: currentPage >= Math.ceil(filteredData.length / pageSize) ? 0.4 : 1, cursor: currentPage >= Math.ceil(filteredData.length / pageSize) ? 'not-allowed' : 'pointer' }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
};

const TestimonialCarousel = () => {
  const testimonials = [
    { quote: "I had no idea my fatigue was linked to vitamin deficiency. The results were eye-opening!", name: "Sarah M.", location: "Texas" },
    { quote: "Took 60 seconds and completely changed how I approach my health. Highly recommend!", name: "James K.", location: "California" },
    { quote: "Finally understand what my body actually needs. The personalized recommendations were spot on!", name: "Michelle R.", location: "Florida" },
    { quote: "I was skeptical at first but the results were shockingly accurate. Already seeing improvements!", name: "David L.", location: "New York" },
    { quote: "Best free health tool I've ever used. Wish I found this sooner!", name: "Amanda T.", location: "Ohio" },
  ];

  // Double the list for seamless looping
  const displayList = [...testimonials, ...testimonials];

  return (
    <div className="testimonial-marquee-container">
      <div className="testimonial-marquee-track">
        {displayList.map((t, i) => (
          <div key={i} className="testimonial-marquee-card">
            <p className="testimonial-quote">"{t.quote}"</p>
            <p className="testimonial-author">
              — {t.name}, {t.location} <span className="testimonial-stars">★★★★★</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const LandingPage = ({ onStart }) => {
  useEffect(() => {
    trackQuizSession('quiz_opened', 0, 'landing', 8);
  }, []);

  return (
    <div className="landing-layout fade-in-up">
      <SEO title="Free Health Assessment Quiz | EternoFit" description="Discover exactly what your body is missing in 60 seconds. Get your FREE personalized health report." url="https://eternofit.com/quiz" />
      <div className="glass-card" style={{ position: 'relative', marginBottom: '3rem' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div style={{ background: 'var(--accent-green-dim)', color: 'var(--accent-green)', padding: '6px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} />
              Secure & Confidential
            </div>
          </div>

          <h1 className="title" style={{ fontSize: 'clamp(1.75rem, 5vw, 2.75rem)', letterSpacing: '-0.03em', lineHeight: '1.2' }}>Discover Exactly What Your Body Is Missing</h1>
          <p className="subtitle" style={{ fontSize: 'clamp(0.95rem, 2.5vw, 1.15rem)', maxWidth: '480px', margin: '0 auto 1.75rem auto', color: 'var(--accent-green) !important', fontWeight: '600' }}>
            Get your FREE personalized health report in 60 seconds
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center', maxWidth: '400px', margin: '0 auto' }}>
            <button 
              className="btn-primary" 
              onClick={onStart} 
              style={{ width: '100%', fontSize: '1.15rem', padding: '1.15rem 2rem' }}
            >
              Begin Assessment <ArrowRight className="inline ml-2" size={20} />
            </button>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', margin: 0 }}>Takes approximately 1 minute • 100% Free</p>
          </div>
        </div>
      </div>

      <div className="social-proof-section">
        <h3 className="social-proof-title">Trusted by Thousands of High-Performers</h3>
        <TestimonialCarousel />
      </div>
    </div>
  );
};

const Quiz = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  // Track each question change
  useEffect(() => {
    trackQuizSession('question_answered', step, questions[step]?.id || 'gender', questions.length);
  }, [step]);


  const questions = [
    {
      id: 'gender',
      question: "What is your biological sex?",
      options: [
        { label: 'Male', desc: 'Biological Male' },
        { label: 'Female', desc: 'Biological Female' },
        { label: 'Other', desc: 'Intersex or other' }
      ]
    },
    {
      id: 'primaryGoal',
      question: "What are your main health goals? (Select up to 2):",
      options: (ans) => {
        let opts = [];
        if (ans.gender === 'Male') {
          opts.push({ label: 'Intimate Performance', desc: 'Erection quality and stamina', icon: <HeartPulse size={24} /> });
          opts.push({ label: 'Muscle & Physique', desc: 'Strength, mass, and testosterone', icon: <Dumbbell size={24} /> });
        } else if (ans.gender === 'Female') {
          opts.push({ label: 'Intimate Performance', desc: 'Boost libido and desire', icon: <HeartPulse size={24} /> });
          opts.push({ label: 'Skin & Beauty', desc: 'Collagen, wrinkles, and complexion', icon: <Sparkles size={24} /> });
        } else {
          opts.push({ label: 'Intimate Performance', desc: 'Sexual health and vitality', icon: <HeartPulse size={24} /> });
          opts.push({ label: 'Skin & Beauty', desc: 'Collagen, wrinkles, and complexion', icon: <Sparkles size={24} /> });
          opts.push({ label: 'Muscle & Physique', desc: 'Strength, mass, and fat loss', icon: <Dumbbell size={24} /> });
        }
        
        opts.push({ label: 'Anti-aging & Vitality', desc: 'Energy, youthfulness, and longevity', icon: <Zap size={24} /> });
        opts.push({ label: 'Brain & Focus', desc: 'Memory, clarity, and cognitive support', icon: <Brain size={24} /> });

        return opts;
      },
      multiple: true,
      maxSelect: 2
    },
    {
      id: 'sleepQuality',
      question: "Assess your Sleep Architecture & Recovery Quality:",
      options: [
        { label: 'Deep & Restful', desc: 'Wake up feeling refreshed' },
        { label: 'Occasionally Restless', desc: 'Trouble falling or staying asleep sometimes' },
        { label: 'Often Waking Up', desc: 'Fragmented sleep, frequent interruptions' },
        { label: 'Poor', desc: 'Chronic insomnia or very low energy' }
      ]
    },
    {
      id: 'tiredness',
      question: "How often do you feel tired during the day?",
      options: [
        'Rarely, I have consistent energy',
        'Sometimes, usually in the afternoon',
        'Often, I feel drained',
        'Constantly, I struggle to stay awake'
      ]
    },
    {
      id: 'specificFocus',
      question: (ans, opts) => `What would you most like to improve? (Select up to ${Math.min(4, opts.length)}):`,
      multiple: true,
      maxSelect: (ans, opts) => Math.min(4, opts.length),
      options: (ans) => {
        let opts = [];
        const goals = Array.isArray(ans.primaryGoal) ? ans.primaryGoal : [ans.primaryGoal].filter(Boolean);
        const isFemale = ans.gender === 'Female';
        
        if (goals.includes('Intimate Performance')) {
          if (isFemale) {
             opts.push({ label: 'Low Libido', desc: 'Increase desire', icon: <Flame size={20} /> });
             opts.push({ label: 'Intimate Sensation', desc: 'Heighten sensitivity', icon: <Sparkles size={20} /> });
             opts.push({ label: 'Intimate Energy', desc: 'Endurance & vitality', icon: <Zap size={20} /> });
          } else {
             // Male or Other defaults
             opts.push({ label: 'Erection Quality', desc: 'Hardness & duration', icon: <Shield size={20} /> });
             opts.push({ label: 'Low Libido', desc: 'Increase desire', icon: <Flame size={20} /> });
             opts.push({ label: 'Semen Volume', desc: 'Increase output', icon: <Droplets size={20} /> });
             opts.push({ label: 'Stamina', desc: 'Last longer', icon: <Zap size={20} /> });
          }
        }
        if (goals.includes('Muscle & Physique')) {
          if (isFemale) {
             opts.push({ label: 'Lean Muscle', desc: 'Tone & sculpt physique', icon: <Activity size={20} /> });
          } else {
             opts.push({ label: 'Low Testosterone', desc: 'Boost natural T', icon: <Activity size={20} /> });
          }
          opts.push({ label: 'Stubborn Fat', desc: 'Burn fat faster', icon: <Flame size={20} /> });
          opts.push({ label: 'Slow Recovery', desc: 'Heal and grow', icon: <HeartPulse size={20} /> });
        }
        if (goals.includes('Anti-aging & Vitality')) {
           opts.push({ label: 'Low Energy', desc: 'Daily vitality', icon: <Sunrise size={20} /> });
           opts.push({ label: 'Anti-aging', desc: 'Cellular support', icon: <Target size={20} /> });
        }
        if (goals.includes('Skin & Beauty')) {
           opts.push({ label: 'Fine Lines & Wrinkles', desc: 'Smooth skin', icon: <Smile size={20} /> });
           opts.push({ label: 'Acne Scars', desc: 'Clear complexion', icon: <Sparkles size={20} /> });
        }
        if (goals.includes('Brain & Focus')) {
           opts.push({ label: 'Brain Fog', desc: 'Clear thinking', icon: <Brain size={20} /> });
           opts.push({ label: 'Memory Decline', desc: 'Sharper recall', icon: <Target size={20} /> });
        }
        if (opts.length === 0) opts.push({ label: 'General Health', desc: 'Overall wellness', icon: <Shield size={20} /> }, { label: 'More Energy', desc: 'Daily boost', icon: <Zap size={20} /> });
        return opts;
      }
    },
    {
      id: 'motivationFocus',
      question: "Do you struggle with motivation or focus?",
      options: [
        'Rarely, I am highly motivated',
        'Sometimes, depending on the task',
        'Frequently, I find it hard to concentrate',
        'Constantly, I struggle with severe brain fog'
      ]
    },
    {
      id: 'performanceDecline',
      question: "Do you feel your performance (physical or personal) has declined recently?",
      options: [
        'No, I feel as strong as ever',
        'A little bit, noticeable but manageable',
        'Yes, a significant decline',
        'Yes, a severe decline affecting my confidence'
      ]
    }
  ];

  const currentQ = questions[step];
  const currentOptions = typeof currentQ.options === 'function' ? currentQ.options(answers) : currentQ.options;
  
  // Local state for multiple selection and text input
  const [currentInput, setCurrentInput] = useState('');
  const [currentSelection, setCurrentSelection] = useState([]);

  const handleNext = (value) => {
    const newAnswers = { ...answers, [currentQ.id]: value };
    setAnswers(newAnswers);
    setCurrentInput('');
    setCurrentSelection([]);
    
    if (step < questions.length - 1) {
      const nextStep = step + 1;
      setStep(nextStep);
    } else {
      // Track quiz finished
      trackQuizSession('quiz_finished', questions.length, 'completed', questions.length, true);
      onComplete(newAnswers);
    }
  };

  const handleSelect = (option) => {
    if (currentQ.multiple) {
      if (currentSelection.includes(option)) {
        setCurrentSelection(currentSelection.filter(item => item !== option));
      } else {
        const maxSelect = typeof currentQ.maxSelect === 'function' ? currentQ.maxSelect(answers, currentOptions) : (currentQ.maxSelect || 3);
        if (currentSelection.length >= maxSelect) {
          // Prevent selecting more than the maximum allowed
          return;
        }
        setCurrentSelection([...currentSelection, option]);
      }
    } else {
      // Single selection auto-advances
      setTimeout(() => handleNext(option), 200);
    }
  };

  const progressPercentage = ((step + 1) / questions.length) * 100;

  return (
    <div className="glass-card fade-enter" key={step}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ width: '80px' }}>
          {step > 0 && (
            <button 
              onClick={() => {
                setStep(step - 1);
                setCurrentInput('');
                setCurrentSelection([]);
              }} 
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted-site)', cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '0.95rem', padding: 0 }}
            >
              <ArrowRight size={16} style={{ transform: 'rotate(180deg)', marginRight: '6px' }} /> Back
            </button>
          )}
        </div>
        <div className="progress-text" style={{ position: 'static', color: 'var(--primary)' }}>Question {step + 1} of {questions.length}</div>
        <div style={{ width: '80px' }}></div>
      </div>
      
      <div className="progress-container">
        <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
      </div>

      <h2 style={{ fontSize: '1.75rem', marginBottom: '2rem', color: 'var(--text-main-site)' }}>
        {typeof currentQ.question === 'function' ? currentQ.question(answers, currentOptions) : currentQ.question}
      </h2>
      
      {currentQ.type === 'text' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input 
            type="text" 
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            placeholder="Enter your name"
            style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main-site)', fontSize: '1.1rem', width: '100%', outline: 'none' }}
          />
          <button 
            className="btn-primary" 
            onClick={() => handleNext(currentInput)}
            disabled={currentQ.id === 'name' ? !/^[A-Za-z\s]{3,}$/.test(currentInput) : !currentInput.trim()}
            style={{ opacity: (currentQ.id === 'name' ? /^[A-Za-z\s]{3,}$/.test(currentInput) : currentInput.trim()) ? 1 : 0.5 }}
          >
            Continue <ArrowRight className="inline ml-2" size={18} />
          </button>
        </div>
      ) : (
        <>
          <div className="options-grid" style={currentQ.id === 'specificFocus' ? { gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' } : {}}>
            {currentOptions.map((optObj, i) => {
              const label = typeof optObj === 'string' ? optObj : optObj.label;
              const desc = typeof optObj === 'string' ? null : optObj.desc;
              const icon = typeof optObj === 'string' ? null : optObj.icon;
              const isSelected = currentQ.multiple ? currentSelection.includes(label) : false;
              return (
                <button 
                  key={i}
                  className={`option-btn ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelect(label)}
                  style={currentQ.id === 'specificFocus' 
                    ? { flexDirection: 'column', alignItems: 'center', gap: '6px', textAlign: 'center', padding: '1.25rem 1rem' } 
                    : { flexDirection: 'row', alignItems: 'center', gap: '12px' }}
                >
                  {currentQ.id === 'specificFocus' ? (
                    // Compact vertical layout for Q5
                    <>
                      <div style={{ color: isSelected ? 'var(--primary)' : 'var(--text-muted-site)', marginBottom: '4px' }}>
                        {icon}
                      </div>
                      <span style={{ fontWeight: '600', fontSize: '0.95rem', color: isSelected ? 'var(--primary)' : 'inherit', lineHeight: '1.2' }}>{label}</span>
                      {desc && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted-site)', lineHeight: '1.2' }}>{desc}</span>}
                    </>
                  ) : (
                    // Default horizontal layout (with icon if available)
                    <>
                      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
                          {icon && <span style={{ color: isSelected ? 'var(--primary)' : 'var(--text-muted-site)' }}>{icon}</span>}
                          <span style={{ fontWeight: '600', color: isSelected ? 'var(--primary)' : 'inherit' }}>{label}</span>
                        </div>
                        {desc && <span style={{ fontSize: '0.85rem', color: 'var(--text-muted-site)', marginTop: '4px', paddingLeft: icon ? '34px' : '0' }}>{desc}</span>}
                      </div>
                      {isSelected ? <CheckCircle2 size={18} color="var(--primary)" /> : <ArrowRight size={18} style={{ opacity: 0.3 }} />}
                    </>
                  )}
                </button>
              );
            })}
          </div>
          {currentQ.multiple && (
            <button 
              className="btn-primary" 
              onClick={() => handleNext(currentSelection)}
              disabled={currentSelection.length === 0}
              style={{ marginTop: '2rem', opacity: currentSelection.length > 0 ? 1 : 0.5 }}
            >
              Continue <ArrowRight className="inline ml-2" size={18} />
            </button>
          )}
        </>
      )}
    </div>
  );
};

const EmailCollection = ({ onSubmit, deliveryMode }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const isValid = name.trim().length >= 2 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <div className="glass-card fade-enter">
      <SEO title="Your Results Are Ready | EternoFit" description="Enter your details to view your personalized health report." url="https://eternofit.com/quiz" />
      <div className="bg-glow"></div>
      <div className="icon-circle" style={{ margin: '0 auto 2rem', width: '80px', height: '80px', background: 'var(--accent-green-dim)', border: '1px solid var(--accent-green)' }}>
        <CheckCircle2 size={40} color="var(--accent-green)" />
      </div>
      <h2 className="title" style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>Your Results Are Ready!</h2>
      <p className="subtitle" style={{ fontSize: '1.1rem', maxWidth: '450px', margin: '0 auto' }}>
        {deliveryMode === 'instant' 
          ? "Enter your details below to view your personalized health report and product recommendations instantly."
          : "Enter your details below to receive your secure health summary in your primary inbox."
        }
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem', maxWidth: '420px', margin: '2rem auto 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-muted-site)', fontWeight: '600', marginLeft: '4px' }}>Full Name</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            style={{ padding: '1.1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main-site)', fontSize: '1.1rem', width: '100%', outline: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-muted-site)', fontWeight: '600', marginLeft: '4px' }}>Email Address</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            style={{ padding: '1.1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main-site)', fontSize: '1.1rem', width: '100%', outline: 'none' }}
          />
        </div>
        <button 
          className="btn-primary" 
          onClick={() => {
            onSubmit(name, email);
          }}
          disabled={!isValid}
          style={{ marginTop: '0.5rem', opacity: isValid ? 1 : 0.5 }}
        >
          {deliveryMode === 'instant' 
            ? "View My Results"
            : "Send & View My Results"
          } <ArrowRight className="inline ml-2" size={18} />
        </button>
      </div>
    </div>
  );
};

const Results = ({ answers, onRestart, globalProducts, deliveryMode }) => {
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState(null); // 'success' | 'error'
  const [emailInput, setEmailInput] = useState(answers?.email || '');

  if (!answers) {
    return (
      <div className="glass-card fade-enter" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h2 className="title">No Assessment Found</h2>
        <p className="subtitle">Please start the assessment to generate your report.</p>
        <button className="btn-primary" onClick={onRestart}>Start Assessment</button>
      </div>
    );
  }

  const products = getFilteredProducts(answers, globalProducts);
  const complementary = getAdditionalRecommendations(answers, products.map(p => p.name), globalProducts);
  const healthScore = calculateHealthScore(answers);
  const emailWasSent = answers.emailSent;

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput)) {
      alert("Please enter a valid email address.");
      return;
    }
    setIsSending(true);
    setSendStatus(null);
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: emailInput,
          subject: `Your EternoFit Health Summary - ${answers.name}`,
          htmlName: answers.name,
          reportUrl: `${window.location.origin}/email-template?id=${answers.id || 'local'}`,
          products: products,
          complementary: complementary,
          answers: answers,
          healthScore: healthScore
        })
      });

      if (response.ok) {
        setSendStatus('success');
        alert("✨ Secure wellness protocol successfully emailed!");
      } else {
        throw new Error("Could not send report");
      }
    } catch (e) {
      setSendStatus('error');
      alert("❌ Failed to dispatch email. Please try again or contact clinical@eternofit.com.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="results-dashboard-container fade-enter" style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', paddingTop: '3rem' }}>
      
      {/* Top Status Notification Banner */}
      <div style={{
        background: emailWasSent ? 'rgba(0, 229, 255, 0.1)' : 'rgba(0, 255, 102, 0.1)',
        border: emailWasSent ? '1px solid rgba(0, 229, 255, 0.3)' : '1px solid rgba(0, 255, 102, 0.3)',
        borderRadius: '16px',
        padding: '1.25rem 2rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        backdropFilter: 'blur(8px)',
        textAlign: 'left'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="icon-circle" style={{
            width: '40px',
            height: '40px',
            background: emailWasSent ? 'var(--accent-blue-dim)' : 'var(--accent-green-dim)',
            color: emailWasSent ? 'var(--accent-blue)' : 'var(--accent-green)'
          }}>
            <CheckCircle2 size={20} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#fff' }}>
              {emailWasSent ? "Clinical Protocol Dispatched!" : "Clinical Protocol Compiled!"}
            </h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted-site)' }}>
              {emailWasSent 
                ? `A secure copy of your report has been successfully sent to ${answers.email}.`
                : "Your biological evaluation has been generated successfully and is shown below."
              }
            </p>
          </div>
        </div>
        <button 
          className="btn-secondary" 
          onClick={() => window.print()}
          style={{ padding: '6px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          Print / PDF
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        
        {/* Main Dashboard Card */}
        <div className="glass-card" style={{ maxWidth: '100%', padding: '3rem', position: 'relative' }}>
          <div className="bg-glow"></div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '2rem', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ textAlign: 'left' }}>
              <span style={{
                background: 'var(--accent-green-dim)',
                color: 'var(--accent-green)',
                border: '1px solid var(--border-accent)',
                padding: '4px 12px',
                borderRadius: '50px',
                fontSize: '0.7rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                display: 'inline-block',
                marginBottom: '10px'
              }}>Evaluation Authenticated</span>
              <h1 style={{ textAlign: 'left', fontSize: '2.25rem', margin: 0, letterSpacing: '-1px' }}>Biological Wellness Protocol</h1>
              <p style={{ color: 'var(--text-muted-site)', margin: '4px 0 0', fontSize: '1rem' }}>Prepared for <strong style={{ color: '#fff' }}>{answers.name}</strong></p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px' }}>Evaluation ID</p>
              <p style={{ margin: 0, fontWeight: '700', color: 'var(--primary)' }}>#{answers.id?.toUpperCase() || 'LOCAL-EVAL'}</p>
              <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: 'var(--text-muted-site)' }}>{new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Health Vitality Index Gauge and Explanation */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '3rem', background: 'rgba(255, 255, 255, 0.02)', padding: '2rem', borderRadius: '20px', border: '1px solid var(--border-subtle)' }}>
            
            {/* Score Ring Display */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <div style={{ position: 'relative', width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* SVG circular progress indicator */}
                <svg width="150" height="150" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="75" cy="75" r="65" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="transparent" />
                  <circle 
                    cx="75" 
                    cy="75" 
                    r="65" 
                    stroke={healthScore.color || 'var(--accent-green)'} 
                    strokeWidth="8" 
                    fill="transparent" 
                    strokeDasharray={408}
                    strokeDashoffset={408 - (408 * healthScore.score) / 100}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                  />
                </svg>
                <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '3rem', fontWeight: '900', color: '#fff', lineHeight: 1 }}>{healthScore.score}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted-site)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '1px', marginTop: '2px' }}>Vitality Index</span>
                </div>
              </div>
              <div style={{
                background: healthScore.color || 'var(--accent-green)',
                color: '#000',
                fontWeight: '800',
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                padding: '4px 16px',
                borderRadius: '50px',
                marginTop: '1.5rem',
                boxShadow: `0 0 15px ${healthScore.color}40`
              }}>
                Status: {healthScore.status}
              </div>
            </div>

            {/* Explanation Content */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'left' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: '#fff' }}>Biological Evaluation Summary</h3>
              <p style={{ color: 'var(--text-muted-site)', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
                Your index of <strong>{healthScore.score}</strong> indicates that your physiological systems are currently operating in the <strong>{healthScore.status.toLowerCase()}</strong> range. 
                Based on your goals to optimize <strong>{Array.isArray(answers.primaryGoal) ? answers.primaryGoal.join(' & ') : answers.primaryGoal}</strong> and your focus on <strong>{Array.isArray(answers.specificFocus) ? answers.specificFocus.join(', ') : answers.specificFocus}</strong>, we have formulated the custom supplement protocol detailed below to accelerate your adaptation toward the <strong>Peak</strong> vitality spectrum.
              </p>
            </div>
          </div>

          {/* Metric Badges Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
              <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Biological Sex</span>
              <span style={{ display: 'block', fontSize: '1rem', fontWeight: '700', color: '#fff', marginTop: '4px' }}>{answers.gender || 'Not Specified'}</span>
            </div>
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
              <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Sleep Quality</span>
              <span style={{ display: 'block', fontSize: '1.0rem', fontWeight: '700', color: '#fff', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{answers.sleepQuality || 'Not Specified'}</span>
            </div>
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
              <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Daytime Energy</span>
              <span style={{ display: 'block', fontSize: '1.0rem', fontWeight: '700', color: '#fff', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {answers.tiredness ? answers.tiredness.split(',')[0] : 'Not Specified'}
              </span>
            </div>
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
              <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Primary Goal</span>
              <span style={{ display: 'block', fontSize: '1.0rem', fontWeight: '700', color: 'var(--primary)', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {Array.isArray(answers.primaryGoal) ? answers.primaryGoal[0] : (answers.primaryGoal || 'Longevity')}
              </span>
            </div>
          </div>

          {/* Supplement RoadMap Section */}
          <h2 style={{ fontSize: '1.5rem', color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Target size={20} color="var(--secondary)" /> Authorized Supplement Protocol
          </h2>

          {products.map((prod, idx) => (
            <div key={idx} className="product-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2rem', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '20px', marginBottom: '2rem', textAlign: 'left' }}>
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                <img 
                  src={prod.image?.startsWith('http') ? prod.image : `${window.location.origin}${prod.image}`} 
                  alt={prod.name} 
                  style={{ width: '120px', height: '120px', borderRadius: '16px', objectFit: 'contain', border: '1px solid var(--border-subtle)', background: '#fff', padding: '10px' }} 
                />
                <div style={{ flex: 1, minWidth: '240px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.4rem', color: '#fff' }}>{prod.name}</h3>
                    <span style={{
                      background: 'rgba(0, 229, 255, 0.1)',
                      color: 'var(--secondary)',
                      border: '1px solid rgba(0, 229, 255, 0.3)',
                      padding: '4px 10px',
                      borderRadius: '30px',
                      fontSize: '0.75rem',
                      fontWeight: '700'
                    }}>High Affinity Match</span>
                  </div>
                  <p style={{ margin: '8px 0', fontSize: '0.95rem', color: 'var(--text-muted-site)', lineHeight: '1.5' }}>{prod.description}</p>
                  {prod.bullets && (
                    <ul style={{ margin: '8px 0 0 0', paddingLeft: '1.2rem', fontSize: '0.9rem', color: 'var(--text-muted-site)', lineHeight: '1.5', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {prod.bullets.map((b, i) => <li key={i} style={{ color: 'var(--text-muted-site)' }}>{b}</li>)}
                    </ul>
                  )}
                </div>
              </div>
              
              <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '12px', padding: '1.25rem', borderLeft: '4px solid var(--secondary)', border: '1px solid var(--border-subtle)', borderLeftWidth: '4px', borderLeftColor: 'var(--secondary)' }}>
                <p style={{ margin: '0 0 4px 0', fontSize: '0.9rem', fontWeight: '700', color: '#fff' }}>Clinical Rationale:</p>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted-site)', lineHeight: '1.5' }}>
                  {prod.rationale || `Calibrated specifically to address your focus on ${Array.isArray(answers.specificFocus) ? answers.specificFocus.join(', ') : answers.specificFocus}. High-affinity bio-absorption to optimize daily ${Array.isArray(answers.primaryGoal) ? answers.primaryGoal[0] : answers.primaryGoal}.`}
                </p>
              </div>

              <a 
                href={prod.affiliateLink} 
                onClick={() => trackEvent(`${window.userSource || 'organic'}_affiliate_link_clicked`, { product: prod.name, source: 'web_results_dashboard' })}
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-primary"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '8px', 
                  textDecoration: 'none', 
                  padding: '12px', 
                  borderRadius: '12px',
                  background: 'var(--secondary)',
                  color: '#000',
                  boxShadow: '0 8px 20px rgba(0, 229, 255, 0.15)'
                }}
              >
                Shop Now <ArrowRight size={18} />
              </a>
            </div>
          ))}

          {/* Complementary Recommendations */}
          {complementary.length > 0 && (
            <div style={{ marginTop: '4rem', paddingTop: '2.5rem', borderTop: '2px dashed var(--border-subtle)' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main-site)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2rem', textAlign: 'center' }}>
                Additional Calibrated Support
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
                {complementary.map((prod, idx) => (
                  <div key={idx} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <img 
                        src={prod.image?.startsWith('http') ? prod.image : `${window.location.origin}${prod.image}`} 
                        alt={prod.name} 
                        style={{ width: '100px', height: '100px', borderRadius: '12px', objectFit: 'contain', marginBottom: '1rem', border: '1px solid var(--border-subtle)', background: '#fff', padding: '6px' }} 
                      />
                      <h4 style={{ margin: '0 0 6px 0', fontSize: '1.1rem', color: '#fff' }}>{prod.name}</h4>
                      <p style={{ margin: '0 0 12px 0', fontSize: '0.85rem', color: 'var(--text-muted-site)', lineHeight: '1.4' }}>{prod.description}</p>
                    </div>
                    <a 
                      href={prod.affiliateLink} 
                      onClick={() => trackEvent(`${window.userSource || 'organic'}_affiliate_link_clicked`, { product: prod.name, source: 'web_results_complementary' })}
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn-secondary"
                      style={{ textDecoration: 'none', width: '100%', padding: '10px', fontSize: '0.85rem', fontWeight: '700' }}
                    >
                      Shop Now
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Signature Block */}
          <div style={{ marginTop: '4rem', padding: '2rem 0 0', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '1.25rem', alignItems: 'center', textAlign: 'left' }}>
            <img 
              src={`${window.location.origin}/Eterno Fit Logo Design.png`} 
              alt="EternoFit" 
              style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#000', objectFit: 'contain', border: '2px solid var(--border-subtle)' }} 
            />
            <div>
              <p style={{ margin: 0, fontWeight: '800', color: '#fff', fontSize: '1.1rem' }}>The EternoFit Team</p>
              <p style={{ margin: '2px 0 0 0', color: 'var(--text-muted-site)', fontSize: '0.85rem', lineHeight: '1.4' }}>Clinical Wellness & Performance<br/>Authorized Diagnostic Division</p>
            </div>
          </div>
        </div>

        {/* Dashboard Actions and Email Copy Card */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          
          {/* Email Dispatch Card */}
          <div className="glass-card" style={{ maxWidth: '100%', padding: '2rem', textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#fff' }}>Email Secure Report</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted-site)', marginBottom: '1.5rem', lineHeight: '1.4' }}>
              Want to keep a copy in your primary inbox? Enter your email below to dispatch a fully compiled clinical report.
            </p>
            <form onSubmit={handleSendEmail} style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="email" 
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="your@email.com"
                style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
              />
              <button 
                type="submit" 
                disabled={isSending}
                className="btn-primary" 
                style={{ width: 'auto', padding: '10px 16px', fontSize: '0.9rem', whiteSpace: 'nowrap' }}
              >
                {isSending ? "Sending..." : "Send Report"}
              </button>
            </form>
            {sendStatus === 'success' && <p style={{ color: 'var(--accent-green)', fontSize: '0.8rem', marginTop: '8px', fontWeight: '600' }}>✓ Sent successfully! Check your inbox.</p>}
          </div>

          {/* Restart Assessment Card */}
          <div className="glass-card" style={{ maxWidth: '100%', padding: '2rem', textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#fff' }}>Re-evaluate Biometrics</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted-site)', marginBottom: '1.5rem', lineHeight: '1.4' }}>
              Have your recovery markers or performance goals shifted? Retake the diagnostic evaluation to generate an updated protocol.
            </p>
            <button 
              className="btn-secondary" 
              onClick={onRestart}
              style={{ width: '100%', padding: '12px', fontSize: '0.95rem', fontWeight: '700' }}
            >
              Restart Quiz Assessment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const GlobalNavbar = ({ navigateTo, currentView }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileToolsOpen, setIsMobileToolsOpen] = useState(false);

  const handleNavClick = (e, targetView) => {
    e.preventDefault();
    setIsMenuOpen(false);
    setIsMobileToolsOpen(false);
    navigateTo(targetView);
  };

  const handleToolClick = (e, toolKey) => {
    e.preventDefault();
    setIsMenuOpen(false);
    setIsMobileToolsOpen(false);
    setIsHovered(false);
    navigateTo(`tools?tool=${toolKey}`);
  };

  const handleScrollClick = (e, targetId) => {
    e.preventDefault();
    setIsMenuOpen(false);
    setIsMobileToolsOpen(false);
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigateTo('home');
      setTimeout(() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  };

  const toolsList = [
    { key: 'bmi', label: 'BMI Calculator', icon: <Activity size={16} /> },
    { key: 'testosterone', label: 'Testosterone Quiz', icon: <Flame size={16} /> },
    { key: 'realage', label: 'Real Age Calculator', icon: <Clock size={16} /> },
    { key: 'longevity', label: 'Longevity Score', icon: <Sparkles size={16} /> },
    { key: 'sleep', label: 'Sleep Analyzer', icon: <Moon size={16} /> },
    { key: 'meal', label: 'Meal Planner', icon: <Apple size={16} /> },
    { key: 'stress', label: 'Stress Checker', icon: <HeartPulse size={16} /> }
  ];

  return (
    <nav className="site-navbar">
      <div className="site-container">
        <div onClick={() => navigateTo('home')} className="site-logo" style={{ cursor: 'pointer' }}>
          <img src="/logo-dark-bg.png" alt="EternoFit Logo" className="site-brand-logo" />
        </div>
        <div className={`site-nav-links ${isMenuOpen ? 'active' : ''}`}>
          <a href="/articles" onClick={(e) => handleNavClick(e, 'articles')} style={{ color: currentView === 'articles' ? 'var(--accent-green)' : 'inherit' }}>Articles</a>
          <a href="#education" onClick={(e) => handleScrollClick(e, 'education')}>Contents</a>
          <a href="/marketplace" onClick={(e) => handleNavClick(e, 'marketplace')} style={{ color: currentView === 'marketplace' ? 'var(--accent-green)' : 'inherit' }}>Marketplace</a>
          
          {/* Desktop Tools Dropdown */}
          <div 
            className="desktop-only-nav"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ position: 'relative', height: '80px', display: 'flex', alignItems: 'center' }}
          >
            <a 
              href="/tools" 
              onClick={(e) => handleNavClick(e, 'tools')} 
              style={{ 
                color: currentView === 'tools' ? 'var(--accent-green)' : 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                height: '100%',
                cursor: 'pointer'
              }}
            >
              Tools <ChevronDown size={14} style={{ transform: isHovered ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s ease' }} />
            </a>
            {isHovered && (
              <div 
                style={{
                  position: 'absolute',
                  top: '75px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(15, 15, 15, 0.96)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  padding: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  minWidth: '220px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
                  zIndex: 1001
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '-6px',
                  left: '50%',
                  transform: 'translateX(-50%) rotate(45deg)',
                  width: '10px',
                  height: '10px',
                  background: 'rgba(15, 15, 15, 0.96)',
                  borderLeft: '1px solid rgba(255,255,255,0.08)',
                  borderTop: '1px solid rgba(255,255,255,0.08)',
                }} />
                {toolsList.map(tool => (
                  <a
                    key={tool.key}
                    href={`/tools?tool=${tool.key}`}
                    onClick={(e) => handleToolClick(e, tool.key)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      color: 'var(--text-main-site)',
                      transition: 'all 0.2s ease',
                      textDecoration: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                      e.currentTarget.style.color = 'var(--accent-green)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--text-main-site)';
                    }}
                  >
                    <span style={{ color: 'var(--accent-green)', display: 'flex', alignItems: 'center' }}>
                      {tool.icon}
                    </span>
                    {tool.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Tools Accordion */}
          <div className="mobile-only-nav" style={{ width: '100%' }}>
            <div 
              onClick={() => setIsMobileToolsOpen(!isMobileToolsOpen)}
              style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                gap: '8px',
                color: currentView === 'tools' ? 'var(--accent-green)' : 'inherit',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '0.95rem',
                width: '100%',
                padding: '4px 0'
              }}
            >
              <span>Tools</span>
              <ChevronDown size={16} style={{ transform: isMobileToolsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease' }} />
            </div>
            {isMobileToolsOpen && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', marginTop: '0.75rem' }}>
                {toolsList.map(tool => (
                  <a
                    key={tool.key}
                    href={`/tools?tool=${tool.key}`}
                    onClick={(e) => handleToolClick(e, tool.key)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontSize: '0.9rem',
                      color: 'var(--text-muted-site)',
                      textDecoration: 'none',
                      width: '100%'
                    }}
                  >
                    <span style={{ color: 'var(--accent-green)', display: 'flex', alignItems: 'center' }}>{tool.icon}</span>
                    {tool.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          <button onClick={() => navigateTo('quiz')} className="site-btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>Health Quiz</button>
        </div>
        <button className="site-mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
};

const Header = ({ navigateTo }) => (
  <header className="app-header">
    <div className="header-content">
      <div onClick={() => navigateTo('home')} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '1.5rem' }}>
        <img src="/logo-dark-bg.png" alt="EternoFit Logo" className="app-logo" />

      </div>
    </div>
  </header>
);

const Footer = ({ navigateTo }) => (
  <footer className="site-footer">
    <div className="site-container">
      <div className="site-footer-grid">
        <div className="site-footer-brand">
          <img src="/logo-dark-bg.png" alt="Logo" className="site-brand-logo" style={{ marginBottom: '1rem', cursor: 'pointer' }} onClick={() => navigateTo('home')} />
          <p>Building elite health, fitness, and unbreakable mindsets through discipline and consistency.</p>
        </div>
        <div className="site-footer-links">
          <h4>Navigation</h4>
          <ul>
            <li><a href="/articles" onClick={(e) => { e.preventDefault(); navigateTo('articles'); }}>Articles</a></li>
            <li><a href="#education" onClick={(e) => { e.preventDefault(); const el = document.getElementById('education'); if (el) el.scrollIntoView({ behavior: 'smooth' }); else { navigateTo('home'); setTimeout(() => document.getElementById('education')?.scrollIntoView({ behavior: 'smooth' }), 100); } }}>Contents</a></li>
            <li><a href="/marketplace" onClick={(e) => { e.preventDefault(); navigateTo('marketplace'); }}>Marketplace</a></li>
            <li><a href="/tools" onClick={(e) => { e.preventDefault(); navigateTo('tools'); }}>Tools</a></li>
            <li><a href="/about" onClick={(e) => { e.preventDefault(); navigateTo('about'); }}>About Us</a></li>
            <li><a href="/contact" onClick={(e) => { e.preventDefault(); navigateTo('contact'); }}>Contact Us</a></li>
          </ul>
        </div>
        <div className="site-footer-links">
          <h4>Legal</h4>
          <ul>
            <li><a href="/privacy" onClick={(e) => { e.preventDefault(); navigateTo('privacy'); }}>Privacy Policy</a></li>
            <li><a href="/terms" onClick={(e) => { e.preventDefault(); navigateTo('terms'); }}>Terms of Service</a></li>
            <li><a href="/affiliate" onClick={(e) => { e.preventDefault(); navigateTo('affiliate'); }}>Affiliate Disclosure</a></li>
          </ul>
        </div>
      </div>
      <div className="site-footer-bottom">
        <p className="site-disclaimer">
          <strong>Disclaimer:</strong> Always consult with a physician before starting any exercise or diet program. This site contains affiliate links; we may earn a commission from purchases made through these links.
        </p>
        <div className="site-social-links">
          <a href="https://www.facebook.com/eternofitforlife" target="_blank" rel="noopener noreferrer"><Facebook size={20} /></a>
          <a href="https://www.instagram.com/eternofitforlife" target="_blank" rel="noopener noreferrer"><Instagram size={20} /></a>
          <a href="https://www.youtube.com/@EternoFit" target="_blank" rel="noopener noreferrer"><Youtube size={20} /></a>
        </div>
      </div>
    </div>
  </footer>
);

const VideoEmbed = ({ videoId, title }) => (
  <div className="video-embed-wrapper" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '12px', background: '#000' }}>
    <iframe
      onLoad={() => trackEvent('video_watched', { title })}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
      src={`https://www.youtube.com/embed/${videoId}`}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  </div>
);

const HomePage = ({ navigateTo, globalProducts }) => {
  return (
    <div className="home-page-wrapper">
      <SEO />
      <GlobalNavbar navigateTo={navigateTo} currentView="home" />

      <section className="site-hero">
        <div className="site-hero-bg">
          <img src="/Heroimage.jpeg" alt="EternoFit Hero" />
        </div>
        <div className="site-container">
          <div className="site-hero-content">
            <h1 className="fade-in-up">Performance Through <br /> <span style={{ color: 'var(--accent-green)' }}>Science</span> <span className="text-outline">&amp; Precision</span></h1>
            <p className="site-subheadline fade-in-up" style={{ animationDelay: '0.2s' }}>
              We provide science-based health programs to help you optimize your well-being, improve fitness, and sharpen your mind.
            </p>
            <div className="site-optin-form fade-in-up" style={{ animationDelay: '0.3s', justifyContent: 'center', background: 'transparent', border: 'none', backdropFilter: 'none' }}>
              <button className="site-btn-primary" style={{ padding: '1.25rem 3rem', fontSize: '1.25rem' }} onClick={() => {
                trackEvent(`${window.userSource || 'organic'}_cta_clicked`);
                navigateTo('quiz');
              }}>
                Start Free Health Quiz <ChevronRight size={24} style={{ marginLeft: '8px' }} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="homepage-articles" className="site-section" style={{ background: 'var(--bg-surface)' }}>
        <div className="site-container">
          <div className="site-section-header fade-in-up">
            <h2>Latest <span style={{ color: 'var(--accent-green)' }}>Health Insights</span></h2>
            <p>Science-backed guides and expert strategies to optimize your daily wellbeing.</p>
          </div>
          <div className="site-product-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            {useMemo(() => {
              // Take 3 random articles to showcase on the homepage
              const shuffled = [...globalArticles].sort(() => 0.5 - Math.random());
              return shuffled.slice(0, 3);
            }, []).map((art, i) => (
              <div 
                key={art.id} 
                className="site-product-card fade-in-up" 
                style={{ animationDelay: `${0.1 * i}s`, cursor: 'pointer' }}
                onClick={() => navigateTo(`article/${art.id}`)}
              >
                {art.image && (
                  <div className="site-article-img-wrapper">
                    <img src={art.image} alt={art.title} />
                  </div>
                )}
                <div className="site-product-info" style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ color: 'var(--accent-green)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: '600', marginBottom: '0.5rem' }}>{art.category}</span>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', lineHeight: '1.4' }}>{art.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted-site)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '1.5rem', flexGrow: 1 }}>{art.metaDesc}</p>
                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--accent-green)', fontSize: '0.85rem', fontWeight: '600' }}>
                    <span>{art.date ? `${art.date} • ` : ''}{art.readTime}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Read Article <ArrowRight size={14} /></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '3rem', textAlign: 'center' }} className="fade-in-up">
            <button 
              onClick={() => navigateTo('articles')} 
              className="site-btn-secondary" 
              style={{ padding: '1rem 2.5rem', border: '2px solid var(--accent-green)' }}
            >
              View All Articles <ArrowRight size={18} style={{ marginLeft: '8px' }} />
            </button>
          </div>
        </div>
      </section>

      <section id="education" className="site-section">
        <div className="site-container">
          <div className="site-section-header fade-in-up">
            <h2><span style={{ color: 'var(--accent-green)' }}>Educational</span> Contents</h2>
            <p>Science-backed insights for professional-grade performance.</p>
          </div>
          <div className="site-video-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            <div className="fade-in-up">
              <VideoEmbed videoId="Doev0iBuG-M" title="Clinical Protocol 01" />
            </div>
            <div className="fade-in-up" style={{ animationDelay: '0.1s' }}>
              <VideoEmbed videoId="Q2k0I_wWrN8" title="Clinical Protocol 02" />
            </div>
            <div className="fade-in-up" style={{ animationDelay: '0.2s' }}>
              <VideoEmbed videoId="Qt6U3uha3sE" title="Clinical Protocol 03" />
            </div>
          </div>
        </div>
      </section>

      <section id="fuel" className="site-section">
        <div className="site-container">
          <div className="site-section-header fade-in-up">
            <h2><span style={{ color: 'var(--accent-green)' }}>Marketplace</span> Recommendations</h2>
            <p>Premium-grade tools and nutrients to support elite performance and results.</p>
          </div>
          <div className="site-product-grid">
            {useMemo(() => {
              const products = globalProducts && globalProducts.length > 0 ? globalProducts.filter(p => p.category !== 'General Health') : [
                { name: 'Micronized Creatine Monohydrate', price: '$34.99', desc: 'Pharmaceutical-grade ATP support for power output and cognitive function.', image: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&q=80&sig=10', affiliateLink: '#' },
                { name: 'Magnesium Glycinate Complex', price: '$24.99', desc: 'High-bioavailability recovery support for central nervous system regulation.', image: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&q=80&sig=11', affiliateLink: '#' },
                { name: 'Vitamin D3 + K2 (Liposomal)', price: '$39.99', desc: 'Clinical-strength immune and hormonal support for year-round performance.', image: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&q=80&sig=12', affiliateLink: '#' }
              ];
              return [...products].sort(() => 0.5 - Math.random()).slice(0, 3);
            }, [globalProducts]).map((p, i) => (
              <div key={i} className="site-product-card fade-in-up" style={{ animationDelay: `${0.1 * i}s` }}>
                <div className="site-product-img">
                  <img src={p.image || `https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&q=80&sig=${i+10}`} alt={p.name} />
                </div>
                <div className="site-product-info">
                  <h3>{p.name}</h3>
                  <p>{p.desc || p.description}</p>
                  <div className="site-product-footer">
                    <span className="price">{p.price}</span>
                    <a 
                      href={p.affiliateLink || '#'} 
                      onClick={() => trackEvent(`${window.userSource || 'organic'}_affiliate_link_clicked`, { product: p.name })}
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="site-btn-secondary" 
                      style={{ textDecoration: 'none' }}
                    >
                      Buy Now
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '3rem', textAlign: 'center' }} className="fade-in-up">
            <button 
              onClick={() => navigateTo('marketplace')} 
              className="site-btn-secondary" 
              style={{ padding: '1rem 2.5rem', border: '2px solid var(--accent-green)' }}
            >
              View Full Marketplace <ArrowRight size={18} style={{ marginLeft: '8px' }} />
            </button>
          </div>
        </div>
      </section>

      <section className="site-section" style={{ background: 'var(--bg-dark-site)' }}>
        <div className="site-container">
          <div className="site-section-header fade-in-up">
            <h2>Free <span style={{ color: 'var(--accent-green)' }}>Optimization Tools</span></h2>
            <p>Click any tool to launch instantly — no sign-up required.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            {[
              { icon: <Activity size={20} />, label: 'BMI & Body Composition', desc: 'Calculate your BMI and optimal weight ranges.' },
              { icon: <Zap size={20} />, label: 'Testosterone Assessment', desc: 'Assess your biological vitality in 60 seconds.' },
              { icon: <Target size={20} />, label: 'Biological Age Calculator', desc: 'Find your biological age vs. chronological age.' },
              { icon: <HeartPulse size={20} />, label: 'Healthspan & Longevity Score', desc: 'Evaluate your cardio, grip, and wellness markers.' },
              { icon: <Moon size={20} />, label: 'Sleep Quality Analyzer', desc: 'Analyze your sleep and circadian efficiency.' },
              { icon: <Apple size={20} />, label: 'Personalized Meal Builder', desc: 'Get a custom meal plan tailored to your goals.' },
            ].map((tool, i) => (
              <button
                key={i}
                onClick={() => navigateTo('tools')}
                className="fade-in-up"
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: '1rem',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(0,230,118,0.15)',
                  borderRadius: '12px', padding: '1rem 1.25rem',
                  cursor: 'pointer', textAlign: 'left',
                  transition: 'all 0.2s ease', animationDelay: `${0.1 * i}s`
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,230,118,0.08)'; e.currentTarget.style.borderColor = 'rgba(0,230,118,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(0,230,118,0.15)'; }}
              >
                <div style={{ color: 'var(--accent-green)', marginTop: '2px', flexShrink: 0 }}>{tool.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '700', color: '#ffffff', fontSize: '0.9rem', marginBottom: '2px' }}>{tool.label}</div>
                  <div style={{ color: 'var(--text-muted-site)', fontSize: '0.8rem', lineHeight: '1.4' }}>{tool.desc}</div>
                </div>
                <ChevronRight size={16} style={{ color: 'var(--accent-green)', marginTop: '2px', flexShrink: 0 }} />
              </button>
            ))}
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="site-container">
          <div className="site-footer-grid">
            <div className="site-footer-brand">
              <img src="/logo-dark-bg.png" alt="Logo" className="site-brand-logo" style={{ marginBottom: '1rem', cursor: 'pointer' }} onClick={() => navigateTo('home')} />
              <p>Building elite health, fitness, and unbreakable mindsets through discipline and consistency.</p>
            </div>
            <div className="site-footer-links">
              <h4>Navigation</h4>
              <ul>
                <li><a href="#homepage-articles" onClick={(e) => { e.preventDefault(); document.getElementById('homepage-articles').scrollIntoView({ behavior: 'smooth' }); }}>Articles</a></li>
                <li><a href="#education" onClick={(e) => { e.preventDefault(); document.getElementById('education').scrollIntoView({ behavior: 'smooth' }); }}>Contents</a></li>
                <li><a href="/marketplace" onClick={(e) => { e.preventDefault(); navigateTo('marketplace'); }}>Marketplace</a></li>
                <li><a href="/tools" onClick={(e) => { e.preventDefault(); navigateTo('tools'); }}>Tools</a></li>
                <li><a href="/about" onClick={(e) => { e.preventDefault(); navigateTo('about'); }}>About Us</a></li>
                <li><a href="/contact" onClick={(e) => { e.preventDefault(); navigateTo('contact'); }}>Contact Us</a></li>
              </ul>
            </div>
            <div className="site-footer-links">
              <h4>Diagnostic Tools</h4>
              <ul>
                <li><a href="/tools?tool=testosterone" onClick={(e) => { e.preventDefault(); navigateTo('tools'); window.history.pushState({}, '', '/tools?tool=testosterone'); window.dispatchEvent(new PopStateEvent('popstate')); }}>Testosterone Quiz</a></li>
                <li><a href="/tools?tool=bmi" onClick={(e) => { e.preventDefault(); navigateTo('tools'); window.history.pushState({}, '', '/tools?tool=bmi'); window.dispatchEvent(new PopStateEvent('popstate')); }}>BMI & Body Fat Calculator</a></li>
                <li><a href="/tools?tool=realage" onClick={(e) => { e.preventDefault(); navigateTo('tools'); window.history.pushState({}, '', '/tools?tool=realage'); window.dispatchEvent(new PopStateEvent('popstate')); }}>Biological Age Calculator</a></li>
                <li><a href="/tools?tool=sleep" onClick={(e) => { e.preventDefault(); navigateTo('tools'); window.history.pushState({}, '', '/tools?tool=sleep'); window.dispatchEvent(new PopStateEvent('popstate')); }}>Sleep & Circadian Analyzer</a></li>
                <li><a href="/tools?tool=longevity" onClick={(e) => { e.preventDefault(); navigateTo('tools'); window.history.pushState({}, '', '/tools?tool=longevity'); window.dispatchEvent(new PopStateEvent('popstate')); }}>Healthspan Scorecard</a></li>
                <li><a href="/tools?tool=meal" onClick={(e) => { e.preventDefault(); navigateTo('tools'); window.history.pushState({}, '', '/tools?tool=meal'); window.dispatchEvent(new PopStateEvent('popstate')); }}>Meal Plan Builder</a></li>
                <li><a href="/tools?tool=stress" onClick={(e) => { e.preventDefault(); navigateTo('tools'); window.history.pushState({}, '', '/tools?tool=stress'); window.dispatchEvent(new PopStateEvent('popstate')); }}>ANS Adrenal Checker</a></li>
              </ul>
            </div>
            <div className="site-footer-links">
              <h4>Legal</h4>
              <ul>
                <li><a href="/privacy" onClick={(e) => { e.preventDefault(); navigateTo('privacy'); }}>Privacy Policy</a></li>
                <li><a href="/terms" onClick={(e) => { e.preventDefault(); navigateTo('terms'); }}>Terms of Service</a></li>
                <li><a href="/affiliate" onClick={(e) => { e.preventDefault(); navigateTo('affiliate'); }}>Affiliate Disclosure</a></li>
              </ul>
            </div>
          </div>
          <div className="site-footer-bottom">
            <p className="site-disclaimer">
              <strong>Disclaimer:</strong> Always consult with a physician before starting any exercise or diet program. This site contains affiliate links; we may earn a commission from purchases made through these links.
            </p>
            <div className="site-social-links">
              <a href="https://www.facebook.com/eternofitforlife" target="_blank" rel="noopener noreferrer"><Facebook size={20} /></a>
              <a href="https://www.instagram.com/eternofitforlife" target="_blank" rel="noopener noreferrer"><Instagram size={20} /></a>
              <a href="https://www.youtube.com/@EternoFit" target="_blank" rel="noopener noreferrer"><Youtube size={20} /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const AffiliateDisclosure = ({ navigateTo }) => (
  <div className="site-container" style={{ padding: '120px 24px', color: 'var(--text-main-site)' }}>
    <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem' }}>Affiliate Disclosure</h1>
    <div style={{ opacity: 0.8, lineHeight: '1.8' }}>
      <p style={{ marginBottom: '1.5rem' }}>
        In compliance with the FTC guidelines, please assume that any and all links on this website are affiliate links of which EternoFit receives a small commission from sales of certain items.
      </p>
      <p style={{ marginBottom: '1.5rem' }}>
        <strong>What is an Affiliate Link?</strong><br/>
        When you click an affiliate link and purchase an item, the seller pays us a small commission or other compensation for promoting their website or products through their affiliate program. Prices are exactly the same for you if your purchase is through an affiliate link or a non-affiliate link.
      </p>
      <p style={{ marginBottom: '1.5rem' }}>
        <strong>Why do we use them?</strong><br/>
        These commissions help us maintain the website and continue providing high-quality health and fitness content for free. We only recommend products we truly believe in and that align with the EternoFit philosophy of health and performance.
      </p>
      <button className="site-btn-secondary" onClick={() => navigateTo('home')}>Back to Home</button>
    </div>
  </div>
);

const CompletionScreen = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 1000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="glass-card fade-enter" style={{ textAlign: 'center', padding: '5rem 2rem', minHeight: '450px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div className="bg-glow"></div>
      <div className="fade-enter">
        <div className="icon-circle" style={{ margin: '0 auto 2.5rem', width: '100px', height: '100px', background: 'var(--accent-green-dim)', border: '1px solid var(--accent-green)', animation: 'pulse 2s infinite ease-in-out' }}>
          <Activity size={48} color="var(--accent-green)" />
        </div>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>Analysing Your Answers...</h2>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          <div className="loading-dots">
            <span></span><span></span><span></span>
          </div>
          <p style={{ color: 'var(--text-muted-site)', fontSize: '1.1rem', maxWidth: '400px', margin: '0 auto' }}>
            Finding the best products based on your health profile.
          </p>
        </div>
      </div>
    </div>
  );
};

const ClickRedirectHandler = ({ globalProducts }) => {
  const [statusText, setStatusText] = useState('Verifying attribution securely...');
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    const executeRedirect = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        let dest = urlParams.get('dest');
        const email = urlParams.get('email') || 'cold_lead@eternofit.com';
        const product = urlParams.get('product') || 'Wellness product';
        const campaign = urlParams.get('campaign') || 'Marketing Newsletter';

        if (!dest) {
          const foundProd = globalProducts.find(p => p.name.toLowerCase() === product.toLowerCase());
          if (foundProd && foundProd.affiliateLink) {
            dest = foundProd.affiliateLink;
          } else {
            dest = window.location.origin;
          }
        }

        setStatusText(`Applying exclusive clinical discount for ${product}...`);

        // Track the click event
        await trackEvent('email_affiliate_clicked', {
          recipient: email,
          product: product,
          campaign: campaign,
          destination: dest
        });

        setStatusText('Discount verified. Redirecting...');
        
        setTimeout(() => {
          window.location.href = dest;
        }, 1200);

      } catch (err) {
        console.error("Redirection attribution tracking error:", err);
        setErrorText("Verification link timeout. Transferring to clinical home...");
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      }
    };

    executeRedirect();
  }, [globalProducts]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#090d16',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif',
      color: '#fff',
      padding: '20px',
      zIndex: 10000
    }}>
      <style>{`
        @keyframes indeterminateProgressBar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes rotateDashedRing {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <div className="glass-card fade-enter" style={{
        maxWidth: '450px',
        padding: '3rem',
        borderRadius: '24px',
        border: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(20px)',
        textAlign: 'center',
        boxShadow: '0 20px 50px rgba(0, 255, 102, 0.05)'
      }}>
        <div style={{ 
          margin: '0 auto 2rem',
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          background: 'rgba(0, 255, 102, 0.05)',
          border: '2px dashed var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'rotateDashedRing 4s linear infinite'
        }}>
          <Globe size={30} color="var(--primary)" style={{ animation: 'pulse 1.8s ease-in-out infinite' }} />
        </div>

        <h3 style={{ margin: '0 0 10px 0', fontSize: '1.4rem', fontWeight: '800', letterSpacing: '-0.02em' }}>
          EternoFit Wellness
        </h3>

        {errorText ? (
          <p style={{ color: '#ef4444', fontSize: '0.95rem', margin: 0 }}>
            {errorText}
          </p>
        ) : (
          <>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', margin: '0 0 1.5rem 0', lineHeight: '1.5' }}>
              {statusText}
            </p>
            <div style={{
              width: '120px',
              height: '4px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '2px',
              margin: '0 auto',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '60px',
                height: '100%',
                background: 'var(--primary)',
                borderRadius: '2px',
                animation: 'indeterminateProgressBar 1.5s infinite ease-in-out'
              }} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

function App() {
  const [view, setView] = useState('home');
  const [answers, setAnswers] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMsg, setProcessingMsg] = useState('');
  const [deliveryMode, setDeliveryMode] = useState('email'); // 'email' | 'instant'
  const { products: globalProducts, loading: productsLoading, reloadProducts } = useProducts();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "settings", "quizConfig");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().deliveryMode) {
          setDeliveryMode(docSnap.data().deliveryMode);
        }
      } catch (e) {
        console.warn("Failed to fetch delivery mode from Firestore, using 'email'.", e);
        const localMode = localStorage.getItem('quiz_delivery_mode');
        if (localMode) setDeliveryMode(localMode);
      }
    };
    fetchSettings();
  }, []);

  const handleToggleDeliveryMode = async (newMode) => {
    setDeliveryMode(newMode);
    localStorage.setItem('quiz_delivery_mode', newMode);
    try {
      const docRef = doc(db, "settings", "quizConfig");
      await setDoc(docRef, { deliveryMode: newMode }, { merge: true });
    } catch (e) {
      console.error("Failed to update quiz settings in Firebase:", e);
    }
  };

  const transitionTo = (newView, msg = '') => {
    if (msg) {
      setIsProcessing(true);
      setProcessingMsg(msg);
      setTimeout(() => {
        window.history.pushState({}, '', `/${newView}`);
        setView(newView);
        setIsProcessing(false);
      }, 1200);
    } else {
      window.history.pushState({}, '', `/${newView}`);
      setView(newView);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const rawPath = window.location.pathname.substring(1);
      const path = rawPath.endsWith('/') ? rawPath.slice(0, -1) : rawPath;
      const urlParams = new URLSearchParams(window.location.search);
      const utmSource = urlParams.get('utm_source');
      const fbclid = urlParams.get('fbclid');
      
      const source = (utmSource === 'meta' || fbclid || urlParams.get('ref') === 'ad') ? 'meta' : 'organic';
      window.userSource = source; // Global for easy access in events
      if (!window.sessionTracked) {
        trackEvent(`view_${source}`);
        window.sessionTracked = true;
      }
      
      if (path === 'admin') setView('admin');
      else if (path === 'click') setView('click');
      else if (path.startsWith('email-template')) setView('emailTemplate');
      else if (path === 'terms') setView('terms');
      else if (path === 'privacy') setView('privacy');
      else if (path === 'affiliate') setView('affiliate');
      else if (path === 'about') setView('about');
      else if (path === 'contact' || path === 'support') setView('contact');
      else if (path === 'unsubscribe') setView('unsubscribe');
      else if (path === 'articles') setView('articles');
      else if (path.startsWith('article/')) { setView('article'); window.articleSlug = path.split('/')[1]; }
      else if (path === 'quiz') setView('landing');
      else if (path === 'marketplace' || path === 'products') setView('marketplace');
      else if (path.startsWith('product/')) { setView('digitalProduct'); window.productSlug = path.split('/')[1]; }
      else if (path === 'tools') setView('tools');
      else if (path === '' || path === 'home') setView('home');
    };
    handlePopState();
    window.addEventListener('popstate', handlePopState);
    
    // Also handle initial load with hash just in case of old links
    if (window.location.hash) {
      const hash = window.location.hash.substring(1);
      window.history.replaceState({}, '', `/${hash}`);
      handlePopState();
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleEmailSubmit = async (name, email) => {
    const updatedAnswers = { ...answers, name };
    const recs = getFilteredProducts(updatedAnswers, globalProducts);
    const fullData = {
      answers: updatedAnswers,
      email,
      recommendations: recs.map(r => r.name),
      status: deliveryMode === 'instant' ? 'InstantView' : 'Captured',
      timestamp: new Date().toISOString(),
      ip: 'Fetching...'
    };

    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      fullData.ip = data.ip;
    } catch (e) {
      fullData.ip = 'Unavailable';
    }

    try {
      const docRef = await addDoc(collection(db, "submissions"), fullData);
      setAnswers({ ...updatedAnswers, email, id: docRef.id, emailSent: deliveryMode === 'email' });
      fullData.id = docRef.id;
      trackEvent(`${window.userSource || 'organic'}_email_submitted`);
      trackQuizSession('email_submitted', 8, 'completed', 8, true, { name, email });
    } catch (e) {
      console.warn("Firebase add failed, saving to local storage.", e);
      fullData.id = Math.random().toString(36).substr(2, 9);
      const currentSubmissions = JSON.parse(localStorage.getItem('quiz_submissions') || '[]');
      currentSubmissions.push(fullData);
      localStorage.setItem('quiz_submissions', JSON.stringify(currentSubmissions));
      setAnswers({ ...updatedAnswers, email, id: fullData.id, emailSent: deliveryMode === 'email' });
    }

    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (deliveryMode === 'email' && !isLocalhost) {
      try {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: email,
            subject: `Your EternoFit Health Summary - ${name}`,
            htmlName: name,
            reportUrl: `${window.location.origin}/email-template?id=${fullData.id}`,
            products: recs,
            complementary: getAdditionalRecommendations(updatedAnswers, recs.map(r => r.name), globalProducts),
            answers: { ...updatedAnswers, id: fullData.id },
            healthScore: calculateHealthScore(updatedAnswers)
          })
        }).catch(e => console.warn('Auto send fetch failed', e));
      } catch (e) {
        console.warn('Auto send setup failed', e);
      }
    }

    transitionTo('results');
  };

  if (productsLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-dark-site)', textAlign: 'center', padding: '2rem' }}>
        <div className="icon-circle" style={{ width: '80px', height: '80px', marginBottom: '2rem', animation: 'pulse 2s infinite ease-in-out' }}>
          <Activity size={40} color="var(--accent-green)" />
        </div>
        <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main-site)', marginBottom: '1rem' }}>Loading...</h3>
        <div style={{ width: '200px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ width: '100%', height: '100%', background: 'var(--accent-green)', animation: 'progress 1.5s infinite linear', transformOrigin: 'left' }} />
        </div>
      </div>
    );
  }

  const navigateTo = (path) => {
    window.history.pushState({}, '', `/${path}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  // Use the new homepage for 'home' view
  if (view === 'home') return <HomePage navigateTo={navigateTo} globalProducts={globalProducts} />;

  return (
    <div className="app-container quiz-light" style={{ position: 'relative' }}>
      {/* Persistent quiz background */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'url(/Quizscreen.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 1, zIndex: -1, pointerEvents: 'none' }}></div>
      <div style={{ position: 'fixed', inset: 0, background: 'linear-gradient(to bottom, rgba(10,10,10,0.2), rgba(10,10,10,0.6))', zIndex: -1, pointerEvents: 'none' }}></div>
      {isProcessing && <LoadingOverlay message={processingMsg} />}
      {['landing', 'quiz', 'completion', 'email'].includes(view) ? (
        <Header navigateTo={navigateTo} />
      ) : (
        <GlobalNavbar navigateTo={navigateTo} currentView={view} />
      )}
      <main className="main-content">
        {view === 'landing' && <LandingPage onStart={() => {
          trackEvent(`${window.userSource || 'organic'}_quiz_started`);
          setView('quiz');
        }} />}
        {view === 'quiz' && <Quiz onComplete={(ans) => { 
          setAnswers(ans); 
          trackEvent(`${window.userSource || 'organic'}_quiz_completed`);
          setView('completion'); 
        }} />}
        {view === 'completion' && <CompletionScreen onFinish={() => setView('email')} />}
        {view === 'email' && <EmailCollection onSubmit={handleEmailSubmit} deliveryMode={deliveryMode} />}
        {view === 'results' && <Results answers={answers} onRestart={() => navigateTo('home')} globalProducts={globalProducts} deliveryMode={deliveryMode} />}
        {view === 'admin' && <AdminPanel onBack={() => navigateTo('home')} globalProducts={globalProducts} reloadProducts={reloadProducts} deliveryMode={deliveryMode} onToggleDeliveryMode={handleToggleDeliveryMode} />}
        {view === 'marketplace' && <Marketplace globalProducts={globalProducts} navigateTo={navigateTo} />}
        {view === 'digitalProduct' && <DigitalProductPage slug={window.productSlug} globalProducts={globalProducts} navigateTo={navigateTo} />}
        {view === 'emailTemplate' && <VisualEmailTemplate globalProducts={globalProducts} />}
        {view === 'terms' && <TermsOfService />}
        {view === 'privacy' && <PrivacyPolicy />}
        {view === 'affiliate' && <AffiliateDisclosure navigateTo={navigateTo} />}
        {view === 'about' && <AboutUs />}
        {view === 'contact' && <ContactUs />}
        {view === 'articles' && <Articles navigateTo={navigateTo} globalProducts={globalProducts} />}
        {view === 'article' && <Articles navigateTo={navigateTo} initialSlug={window.articleSlug} globalProducts={globalProducts} />}
        {view === 'support' && <ClinicalSupport />}
        {view === 'unsubscribe' && <Unsubscribe />}
        {view === 'tools' && <ToolsPage navigateTo={navigateTo} globalProducts={globalProducts} />}
        {view === 'click' && <ClickRedirectHandler globalProducts={globalProducts} />}
      </main>
      <Footer navigateTo={navigateTo} />
    </div>
  );
}

export default App;
