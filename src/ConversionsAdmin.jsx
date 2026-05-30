import React, { useState, useEffect, useMemo } from 'react';
import { db } from './firebase';
import { collection, query, orderBy, limit, onSnapshot, getDocs, deleteDoc, doc, where } from 'firebase/firestore';
import { TrendingUp, Users, MousePointer2, ClipboardCheck, Mail, ShoppingCart, Calendar, Eye, Globe, Facebook, RefreshCcw, Search, X, MapPin } from 'lucide-react';

const ConversionsAdmin = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    setLoading(true);
    // Fetch last 500 events to build visitor journeys
    const q = query(collection(db, 'analytics_events'), orderBy('timestamp', 'desc'), limit(500));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      }));
      setEvents(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching events:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const visitorJourneys = useMemo(() => {
    const journeys = {};
    
    events.forEach(event => {
      const sid = event.sessionId || event.ip || 'unknown';
      if (!journeys[sid]) {
        journeys[sid] = {
          sid,
          ip: event.ip || 'Unknown',
          location: event.location || 'Unknown',
          source: event.source || 'organic',
          startTime: event.timestamp,
          events: [],
          quizStarted: false,
          quizCompleted: false,
          emailSent: false
        };
      }
      
      journeys[sid].events.push(event);
      if (event.event && (event.event === 'quiz_started' || event.event.endsWith('_quiz_started'))) journeys[sid].quizStarted = true;
      if (event.event && (event.event === 'email_submitted' || event.event.endsWith('_email_submitted') || event.event.endsWith('_quiz_completed'))) journeys[sid].quizCompleted = true;
      if (event.event && (event.event === 'email_sent' || event.event.endsWith('_email_sent'))) journeys[sid].emailSent = true;
      
      // Update startTime to be the earliest timestamp
      if (event.timestamp < journeys[sid].startTime) {
        journeys[sid].startTime = event.timestamp;
      }
    });

    return Object.values(journeys).sort((a, b) => b.startTime - a.startTime);
  }, [events]);

  const filteredJourneys = visitorJourneys.filter(j => 
    j.ip.includes(searchTerm) || 
    j.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedJourneys = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredJourneys.slice(start, start + pageSize);
  }, [filteredJourneys, currentPage, pageSize]);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Analyzing visitor datasets...</div>;

  const totalPages = Math.ceil(filteredJourneys.length / pageSize);

  return (
    <div className="conversions-admin fade-enter">
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Search by IP, Location, or Source..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '12px 16px 12px 40px', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main-site)' }}
          />
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}>
              <X size={16} />
            </button>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-surface)', padding: '0 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', fontSize: '0.85rem', color: 'var(--text-muted-site)' }}>
          {filteredJourneys.length} Visitors Detected
        </div>
      </div>

      <div className="admin-table-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={20} color="var(--primary)" /> Real-Time Website Visitor Logs
          </h3>
          <button 
            onClick={async () => {
              if (window.confirm("Permanently clear all visitor logs?")) {
                const snapshot = await getDocs(collection(db, 'analytics_events'));
                await Promise.all(snapshot.docs.map(d => deleteDoc(d.ref)));
                alert("Logs cleared.");
              }
            }}
            className="btn-secondary" 
            style={{ padding: '6px 12px', fontSize: '0.8rem', border: '1px solid #ef4444', color: '#ef4444' }}
          >
            Clear All Logs
          </button>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date/Time</th>
              <th>IP Address</th>
              <th>Location</th>
              <th style={{ textAlign: 'center' }}>Quiz Started</th>
              <th style={{ textAlign: 'center' }}>Email Input</th>
              <th style={{ textAlign: 'center' }}>Email Sent</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            {paginatedJourneys.map((j, i) => (
              <tr key={j.sid || i}>
                <td style={{ fontSize: '0.85rem' }}>{j.startTime.toLocaleString()}</td>
                <td style={{ fontWeight: '600', fontFamily: 'monospace' }}>{j.ip}</td>
                <td style={{ fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12} color="var(--accent-green)" /> {j.location}
                  </div>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span style={{ color: j.quizStarted ? 'var(--accent-green)' : '#666' }}>
                    {j.quizStarted ? '✅ Yes' : '❌ No'}
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span style={{ color: j.quizCompleted ? 'var(--accent-green)' : '#666' }}>
                    {j.quizCompleted ? '✅ Yes' : '❌ No'}
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span style={{ color: j.emailSent ? 'var(--accent-green)' : '#666' }}>
                    {j.emailSent ? '✅ Yes' : '❌ No'}
                  </span>
                </td>
                <td>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '0.75rem', 
                    fontWeight: '700',
                    background: j.source === 'meta' ? 'rgba(24, 119, 242, 0.1)' : 'rgba(0, 255, 102, 0.1)',
                    color: j.source === 'meta' ? '#1877F2' : 'var(--accent-green)',
                    textTransform: 'uppercase'
                  }}>
                    {j.source}
                  </span>
                </td>
              </tr>
            ))}
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
              Showing {filteredJourneys.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, filteredJourneys.length)} of {filteredJourneys.length} entries
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
              disabled={currentPage >= totalPages} 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.8rem', opacity: currentPage >= totalPages ? 0.4 : 1, cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer' }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversionsAdmin;
