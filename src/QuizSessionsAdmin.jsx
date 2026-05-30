import React, { useState, useEffect, useMemo } from 'react';
import { db } from './firebase';
import { collection, onSnapshot, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Search, X, Users, Monitor, Clock, CheckCircle2, AlertCircle, Globe, Trash2, RefreshCcw, Download } from 'lucide-react';

const QuizSessionsAdmin = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all | in_progress | completed | abandoned
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, startDate, endDate]);

  useEffect(() => {
    setLoading(true);
    const q = collection(db, 'quiz_sessions');

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map(d => {
        const raw = d.data();
        return {
          id: d.id,
          sessionId: raw.sessionId || d.id,
          ip: raw.ip || 'Unknown',
          location: raw.location || 'Unknown',
          source: raw.source || 'organic',
          currentQuestion: raw.currentQuestion ?? 0,
          currentQuestionId: raw.currentQuestionId || '—',
          totalQuestions: raw.totalQuestions || 8,
          quizFinished: raw.quizFinished || false,
          startedAt: raw.startedAt?.toDate?.() || (raw.startedAt ? new Date(raw.startedAt) : null),
          finishedAt: raw.finishedAt?.toDate?.() || (raw.finishedAt ? new Date(raw.finishedAt) : null),
          lastUpdated: raw.lastUpdated?.toDate?.() || (raw.lastUpdated ? new Date(raw.lastUpdated) : new Date()),
          name: raw.name || '',
          email: raw.email || '',
        };
      }).sort((a, b) => b.lastUpdated - a.lastUpdated); // Sort client-side by most recent
      setSessions(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching quiz sessions:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Question ID to label mapping
  const questionLabels = {
    'name': 'Name',
    'gender': 'Gender',
    'primaryGoal': 'Health Goals',
    'sleepQuality': 'Sleep Quality',
    'tiredness': 'Tiredness',
    'specificFocus': 'Focus Areas',
    'motivationFocus': 'Motivation',
    'performanceDecline': 'Performance',
    'completed': 'Completed ✓'
  };

  const getStatus = (session) => {
    if (session.quizFinished) return 'completed';
    // If last updated more than 30 min ago and not finished, consider abandoned
    const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000);
    if (session.lastUpdated < thirtyMinAgo) return 'abandoned';
    return 'in_progress';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return { bg: '#dcfce7', color: '#166534', label: 'Completed', icon: <CheckCircle2 size={12} /> };
      case 'in_progress':
        return { bg: '#fef3c7', color: '#92400e', label: 'In Progress', icon: <Clock size={12} /> };
      case 'abandoned':
        return { bg: '#fee2e2', color: '#991b1b', label: 'Abandoned', icon: <AlertCircle size={12} /> };
      default:
        return { bg: '#f1f5f9', color: '#64748b', label: 'Unknown', icon: null };
    }
  };

  const filteredSessions = useMemo(() => {
    return sessions.filter(s => {
      const matchSearch = s.ip.includes(searchTerm) ||
        s.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.sessionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase());

      let matchDate = true;
      if (startDate || endDate) {
        const sessionDate = new Date(s.startedAt || s.lastUpdated);
        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          if (sessionDate < start) matchDate = false;
        }
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          if (sessionDate > end) matchDate = false;
        }
      }

      if (filterStatus === 'all') return matchSearch && matchDate;
      return matchSearch && matchDate && getStatus(s) === filterStatus;
    });
  }, [sessions, searchTerm, filterStatus, startDate, endDate]);

  const paginatedSessions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSessions.slice(start, start + pageSize);
  }, [filteredSessions, currentPage, pageSize]);


  const stats = useMemo(() => {
    const total = sessions.length;
    const completed = sessions.filter(s => s.quizFinished).length;
    const inProgress = sessions.filter(s => getStatus(s) === 'in_progress').length;
    const abandoned = sessions.filter(s => getStatus(s) === 'abandoned').length;
    const completionRate = total > 0 ? ((completed / total) * 100).toFixed(1) : 0;

    // Average drop-off question
    const droppedSessions = sessions.filter(s => !s.quizFinished);
    const avgDropoff = droppedSessions.length > 0
      ? (droppedSessions.reduce((sum, s) => sum + (s.currentQuestion || 0), 0) / droppedSessions.length).toFixed(1)
      : '—';

    return { total, completed, inProgress, abandoned, completionRate, avgDropoff };
  }, [sessions]);

  const handleClearAll = async () => {
    if (window.confirm('Permanently delete ALL quiz session records? This cannot be undone.')) {
      try {
        const snapshot = await getDocs(collection(db, 'quiz_sessions'));
        await Promise.all(snapshot.docs.map(d => deleteDoc(d.ref)));
        alert('All quiz session records cleared.');
      } catch (e) {
        alert('Error clearing records: ' + e.message);
      }
    }
  };

  const handleExport = () => {
    const headers = ['Session ID', 'Started', 'IP Address', 'Name', 'Email', 'Location', 'Source', 'Progress', 'Current Question', 'Status', 'Duration'];
    const rows = filteredSessions.map(s => {
      const status = getStatus(s);
      const progress = s.totalQuestions > 0 ? `${s.currentQuestion}/${s.totalQuestions}` : '0/0';
      let duration = '—';
      if (s.startedAt) {
        const endTime = s.finishedAt || s.lastUpdated;
        const diffSec = Math.floor((endTime - s.startedAt) / 1000);
        if (diffSec < 60) duration = `${diffSec}s`;
        else if (diffSec < 3600) duration = `${Math.floor(diffSec / 60)}m ${diffSec % 60}s`;
        else duration = `${Math.floor(diffSec / 3600)}h ${Math.floor((diffSec % 3600) / 60)}m`;
      }
      return [
        s.sessionId,
        s.startedAt ? s.startedAt.toLocaleString() : '—',
        s.ip,
        `"${s.name || ''}"`,
        `"${s.email || ''}"`,
        `"${s.location}"`,
        s.source,
        `"${progress}"`,
        `"${questionLabels[s.currentQuestionId] || s.currentQuestionId}"`,
        status,
        duration
      ];
    });
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `quiz_sessions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteSession = async (id) => {
    if (window.confirm('Delete this quiz session record?')) {
      try {
        await deleteDoc(doc(db, 'quiz_sessions', id));
      } catch (e) {
        alert('Error deleting: ' + e.message);
      }
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted-site)' }}>Loading quiz sessions...</div>;
  }

  return (
    <div className="quiz-sessions-admin fade-enter">
      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Openers', value: stats.total, color: 'var(--primary)', icon: <Users size={18} /> },
          { label: 'Completed', value: stats.completed, color: '#10b981', icon: <CheckCircle2 size={18} /> },
          { label: 'In Progress', value: stats.inProgress, color: '#f59e0b', icon: <Clock size={18} /> },
          { label: 'Abandoned', value: stats.abandoned, color: '#ef4444', icon: <AlertCircle size={18} /> },
          { label: 'Completion Rate', value: `${stats.completionRate}%`, color: '#8b5cf6', icon: <Monitor size={18} /> },
          { label: 'Avg Drop-off Q', value: stats.avgDropoff, color: '#ec4899', icon: <AlertCircle size={18} /> },
        ].map((stat, i) => (
          <div key={i} style={{
            background: 'var(--bg-surface)',
            borderRadius: '14px',
            padding: '1.25rem',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: stat.color }}>
              {stat.icon}
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted-site)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>{stat.label}</span>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main-site)' }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
          <input
            type="text"
            placeholder="Search by IP, Location, or Session ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '12px 16px 12px 40px', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main-site)', fontSize: '0.95rem' }}
          />
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}>
              <X size={16} />
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {['all', 'in_progress', 'completed', 'abandoned'].map(f => (
            <button
              key={f}
              onClick={() => setFilterStatus(f)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: filterStatus === f ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                background: filterStatus === f ? 'rgba(0, 255, 102, 0.1)' : 'var(--bg-surface)',
                color: filterStatus === f ? 'var(--primary)' : 'var(--text-muted-site)',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: '600',
                textTransform: 'capitalize'
              }}
            >
              {f === 'all' ? 'All' : f.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main-site)', fontSize: '0.85rem' }}
          />
          <span style={{ color: 'var(--text-muted-site)' }}>to</span>
          <input 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main-site)', fontSize: '0.85rem' }}
          />
          {(startDate || endDate) && (
            <button onClick={() => { setStartDate(''); setEndDate(''); }} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <X size={16} />
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-surface)', padding: '0 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', fontSize: '0.85rem', color: 'var(--text-muted-site)', fontWeight: '600', height: '42px' }}>
          {filteredSessions.length} Records
        </div>
      </div>


      {/* Table */}
      <div className="admin-table-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem' }}>
            <Monitor size={20} color="var(--primary)" /> Quiz Session Tracker
          </h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleExport}
              className="btn-secondary"
              style={{ padding: '6px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Download size={14} /> Export CSV
            </button>
            <button
              onClick={handleClearAll}
              className="btn-secondary"
              style={{ padding: '6px 14px', fontSize: '0.8rem', border: '1px solid #ef4444', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Trash2 size={14} /> Clear All
            </button>
          </div>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Started</th>
              <th>IP Address</th>
              <th>Location</th>
              <th>Source</th>
              <th style={{ textAlign: 'center' }}>Progress</th>
              <th>Current Question</th>
              <th style={{ textAlign: 'center' }}>Status</th>
              <th>Duration</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {paginatedSessions.map((session) => {
              const status = getStatus(session);
              const badge = getStatusBadge(status);
              const progress = session.totalQuestions > 0
                ? Math.round((session.currentQuestion / session.totalQuestions) * 100)
                : 0;

              // Calculate duration
              let duration = '—';
              if (session.startedAt) {
                const endTime = session.finishedAt || session.lastUpdated;
                const diffMs = endTime - session.startedAt;
                const diffSec = Math.floor(diffMs / 1000);
                if (diffSec < 60) duration = `${diffSec}s`;
                else if (diffSec < 3600) duration = `${Math.floor(diffSec / 60)}m ${diffSec % 60}s`;
                else duration = `${Math.floor(diffSec / 3600)}h ${Math.floor((diffSec % 3600) / 60)}m`;
              }

              return (
                <tr key={session.id}>
                  <td style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                    {session.startedAt ? session.startedAt.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : '—'}
                  </td>
                  <td style={{ fontWeight: '600', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                    {session.ip}
                    {session.name && <div style={{ fontSize: '0.75rem', color: 'var(--text-main-site)', fontFamily: 'sans-serif', marginTop: '2px', fontWeight: '500' }}>{session.name}</div>}
                    {session.email && <div style={{ fontSize: '0.7rem', color: 'var(--text-muted-site)', fontFamily: 'sans-serif', fontWeight: 'normal' }}>{session.email}</div>}
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Globe size={12} color="var(--accent-green)" /> {session.location}
                    </div>
                  </td>
                  <td>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      background: session.source === 'meta' ? 'rgba(24, 119, 242, 0.1)' : 'rgba(0, 255, 102, 0.1)',
                      color: session.source === 'meta' ? '#1877F2' : 'var(--accent-green)',
                      textTransform: 'uppercase'
                    }}>
                      {session.source}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                      <div style={{ flex: 1, maxWidth: '100px', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{
                          width: `${progress}%`,
                          height: '100%',
                          background: session.quizFinished ? '#10b981' : (status === 'abandoned' ? '#ef4444' : 'var(--primary)'),
                          borderRadius: '4px',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted-site)', minWidth: '50px' }}>
                        {session.currentQuestion}/{session.totalQuestions}
                      </span>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>
                    <span style={{
                      padding: '3px 10px',
                      borderRadius: '6px',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}>
                      {questionLabels[session.currentQuestionId] || session.currentQuestionId}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      background: badge.bg,
                      color: badge.color,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      {badge.icon} {badge.label}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-muted-site)', fontWeight: '600' }}>
                    {duration}
                  </td>
                  <td>
                    <button
                      onClick={() => handleDeleteSession(session.id)}
                      style={{
                        background: 'transparent',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#ef4444',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.75rem'
                      }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </td>
                </tr>
              );
            })}
            {filteredSessions.length === 0 && (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted-site)' }}>
                  No quiz sessions found matching your criteria.
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
              Showing {filteredSessions.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, filteredSessions.length)} of {filteredSessions.length} entries
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
              disabled={currentPage >= Math.ceil(filteredSessions.length / pageSize)} 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredSessions.length / pageSize)))}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.8rem', opacity: currentPage >= Math.ceil(filteredSessions.length / pageSize) ? 0.4 : 1, cursor: currentPage >= Math.ceil(filteredSessions.length / pageSize) ? 'not-allowed' : 'pointer' }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizSessionsAdmin;
