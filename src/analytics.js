import { db } from './firebase';
import { collection, addDoc, serverTimestamp, increment, doc, setDoc } from 'firebase/firestore';

let visitorInfo = null;

let inMemorySessionId = null;

export const getVisitorInfo = async () => {
  if (visitorInfo) return visitorInfo;

  let sessionId = 'unknown';
  try {
    sessionId = sessionStorage.getItem('eternofit_session_id');
    if (!sessionId) {
      sessionId = 'sess_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
      sessionStorage.setItem('eternofit_session_id', sessionId);
    }
  } catch (e) {
    console.warn("sessionStorage is blocked or unavailable:", e);
    if (!inMemorySessionId) {
      inMemorySessionId = 'sess_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }
    sessionId = inMemorySessionId;
  }

  try {
    const res = await fetch('/api/track-quiz', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
    const data = await res.json();
    visitorInfo = {
      sessionId,
      ip: data.ip || 'Unknown',
      location: data.location || 'Unknown',
      source: window.userSource || (window.location.search.includes('utm_source=meta') ? 'meta' : 'organic')
    };
    return visitorInfo;
  } catch (e) {
    console.warn("Failed to fetch visitor info from API:", e);
    return { 
      sessionId,
      ip: 'Unknown', 
      location: 'Unknown', 
      source: window.userSource || 'organic' 
    };
  }
};

/**
 * Tracks a conversion event in Firebase.
 */
export const trackEvent = async (eventName, metadata = {}) => {
  try {
    const info = await getVisitorInfo();
    const today = new Date().toISOString().split('T')[0];
    const statsRef = doc(db, 'analytics_stats', today);

    // Increment aggregated stats for the day
    await setDoc(statsRef, {
      [eventName]: increment(1),
      [`view_${info.source}`]: eventName.startsWith('view_') ? increment(1) : increment(0),
      lastUpdated: serverTimestamp()
    }, { merge: true });

    // Log individual event for deep analysis
    await addDoc(collection(db, 'analytics_events'), {
      event: eventName,
      sessionId: info.sessionId,
      ip: info.ip,
      location: info.location,
      source: info.source,
      ...metadata,
      timestamp: serverTimestamp()
    });

    // Track in Meta Pixel if available
    if (window.fbq) {
      if (eventName.includes('email_submitted')) {
        window.fbq('track', 'Lead', {
          content_name: 'Health Quiz',
          content_category: 'Health & Wellness',
          ...metadata
        });
      } else if (eventName.includes('affiliate_link_clicked')) {
        window.fbq('track', 'InitiateCheckout', { content_name: metadata.product, ...metadata });
      } else if (eventName.startsWith('view_')) {
        window.fbq('track', 'ViewContent', { content_name: eventName, ...metadata });
      } else {
        window.fbq('trackCustom', eventName, metadata);
      }
    }

    console.log(`[Analytics] Event tracked: ${eventName} (${info.ip})`);
  } catch (error) {
    console.warn(`[Analytics] Failed to track event ${eventName}:`, error);
  }
};

export const trackQuizSession = async (action, questionIndex, questionId, totalQuestions, quizFinished = false, extraData = {}) => {
  try {
    const info = await getVisitorInfo();
    const sessionRef = doc(db, 'quiz_sessions', info.sessionId);
    const baseData = {
      sessionId: info.sessionId,
      ip: info.ip,
      location: info.location,
      source: info.source,
      lastUpdated: new Date().toISOString(),
      ...extraData
    };

    if (action === 'quiz_opened') {
      await setDoc(sessionRef, {
        ...baseData,
        startedAt: new Date().toISOString(),
        currentQuestion: questionIndex ?? 0,
        currentQuestionId: questionId || 'landing',
        totalQuestions: totalQuestions || 8,
        quizFinished: false,
      }, { merge: true });
    } else if (action === 'question_answered') {
      await setDoc(sessionRef, {
        ...baseData,
        currentQuestion: questionIndex ?? 0,
        currentQuestionId: questionId || '',
        totalQuestions: totalQuestions || 8,
        quizFinished: false,
      }, { merge: true });
    } else if (action === 'quiz_finished') {
      await setDoc(sessionRef, {
        ...baseData,
        currentQuestion: totalQuestions || 8,
        currentQuestionId: 'completed',
        totalQuestions: totalQuestions || 8,
        quizFinished: true,
        finishedAt: new Date().toISOString(),
      }, { merge: true });
    } else if (action === 'email_submitted') {
      await setDoc(sessionRef, {
        ...baseData,
        quizFinished: true,
        emailSubmitted: true,
      }, { merge: true });
    }
  } catch (e) {
    console.warn('[QuizTracker] Failed to track session:', e);
  }
};
