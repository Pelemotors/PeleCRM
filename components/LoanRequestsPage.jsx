import React, { useState } from 'react';
import LoanRequestFilters from './LoanRequestFilters';
import SummaryPanel from './SummaryPanel';
import LoanRequestTable from './LoanRequestTable';
import IgnoreRulesPanel from './IgnoreRulesPanel';
import DetectionRulesPanel from './DetectionRulesPanel';
import { useIgnoreRules } from '../contexts/IgnoreRulesContext';

const LoanRequestsPage = () => {
  const [filters, setFilters] = useState({});
  const [showRulesPanel, setShowRulesPanel] = useState(false);
  const [applyFilters, setApplyFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const {
    ignoredGroups,
    ignoredContent,
    ignoredContacts
  } = useIgnoreRules();

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleAddIgnoredGroup = () => {
    const groupName = prompt('הזן שם קבוצה שלא נרצה להאזין לה');
    if (groupName) {
      const cleaned = groupName.trim();
      const updated = [...new Set([...ignoredGroups, cleaned])];

      localStorage.setItem('ignoreRules', JSON.stringify({
        ignoredGroups: updated,
        ignoredContent,
        ignoredContacts
      }));
      setFilters((prev) => ({ ...prev }));
    }
  };

  const handleCleanupOrphans = async () => {
    if (window.confirm('למחוק הודעות שאין להן קבוצה או שולח?')) {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/loan_requests/cleanup-orphans`, {
          method: 'DELETE'
        });
        if (res.ok) {
          alert('✅ ההודעות הלא מזוהות נמחקו');
          setFilters((prev) => ({ ...prev }));
        } else {
          alert('❌ שגיאה במחיקת הודעות');
        }
      } catch (err) {
        console.error('❌ שגיאה בבקשה:', err);
        alert('⚠️ תקלה בבקשת המחיקה');
      }
    }
  };

  const handleManualSubmit = async () => {
    const group_name = document.getElementById('group_name').value;
    const content = document.getElementById('content').value;
    const sender_name = document.getElementById('sender_name').value;
    const amount_requested = document.getElementById('amount_requested').value;

    if (!group_name || !content || !sender_name) {
      alert('יש למלא את כל השדות החובה');
      return;
    }

    try {
      const res = await fetch('/api/loan_requests/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          group_name,
          content,
          sender_name,
          amount_requested: amount_requested ? parseInt(amount_requested) : null
        })
      });

      if (res.ok) {
        alert('✅ בקשה נוצרה בהצלחה');
        setShowModal(false);
        window.location.reload();
      } else {
        alert('❌ שגיאה ביצירת הבקשה');
      }
    } catch (err) {
      console.error(err);
      alert('⚠️ תקלה בשליחה');
    }
  };

  const filteredWithIgnore = {
    ...filters,
    apply_rules: applyFilters ? 'true' : 'false',
    ignored_groups: applyFilters ? ignoredGroups.join(',') : '',
    ignored_content: applyFilters ? ignoredContent.join(',') : '',
    ignored_contacts: applyFilters ? ignoredContacts.join(',') : ''
  };

  return (
    <div dir="rtl" style={{ padding: '2rem', fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#f5f6fa', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: '1rem', color: '#2c3e50' }}>📄 דשבורד בקשות מימון</h1>

      <button onClick={() => setShowModal(true)} style={{ marginBottom: '1em' }}>
        ➕ צור בקשה חדשה
      </button>

      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2em',
            borderRadius: '10px',
            width: '90%',
            maxWidth: '500px'
          }}>
            <h3>📝 בקשה חדשה</h3>
            <input placeholder="שם הקבוצה" id="group_name" style={{ width: '100%', marginBottom: '0.5em' }} />
            <input placeholder="תוכן ההודעה" id="content" style={{ width: '100%', marginBottom: '0.5em' }} />
            <input placeholder="שם השולח" id="sender_name" style={{ width: '100%', marginBottom: '0.5em' }} />
            <input placeholder="סכום מבוקש (אופציונלי)" id="amount_requested" type="number" style={{ width: '100%', marginBottom: '0.5em' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => setShowModal(false)}>❌ ביטול</button>
              <button onClick={handleManualSubmit}>✅ צור בקשה</button>
            </div>
          </div>
        </div>
      )}

      {/* סינון לפי תאריך/סטטוס */}
      <div style={{ marginBottom: '1rem', background: '#fff', padding: '1rem', borderRadius: '12px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
        <LoanRequestFilters onChange={handleFilterChange} />
      </div>

      {/* כפתורי ניהול */}
      <div style={{ marginBottom: '1rem', textAlign: 'right' }}>
        <button onClick={handleAddIgnoredGroup} style={{ marginLeft: '0.5rem' }}>➖ הוסף קבוצה חסומה</button>
        <button onClick={handleCleanupOrphans} style={{ marginLeft: '0.5rem' }}>🧹 נקה הודעות לא מזוהות</button>
        <button onClick={() => setShowRulesPanel(!showRulesPanel)} style={{ marginLeft: '0.5rem' }}>
          {showRulesPanel ? '🔽 הסתר כללים' : '🔼 הצג כללי סינון'}
        </button>
        <button onClick={() => setApplyFilters(true)} style={{ marginLeft: '0.5rem' }}>✅ החל סינון לפי כללים</button>
        <button onClick={() => setApplyFilters(false)} style={{ marginLeft: '0.5rem' }}>🔄 בטל סינון</button>

        {ignoredGroups.length > 0 && (
          <p style={{ marginTop: '0.5rem' }}>
            <strong>קבוצות חסומות:</strong> {ignoredGroups.join(', ')}
          </p>
        )}
        <p style={{ marginTop: '0.5rem', color: 'gray' }}>
          מצב סינון מתקדם: {applyFilters ? 'פעיל' : 'כבוי'}
        </p>
      </div>

      {/* פאנל סיכום */}
      <SummaryPanel filters={filteredWithIgnore} />

      {/* פאנל כללים – מיזעור אחד כולל גם Ignore וגם Detection */}
      {showRulesPanel && (
        <div style={{ background: '#fff', marginTop: '1.5rem', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.2rem', color: '#333' }}>🛑 ניהול כללי סינון</h2>
          <IgnoreRulesPanel />
          <hr style={{ margin: '2rem 0' }} />
          <DetectionRulesPanel />
        </div>
      )}

      {/* טבלת הבקשות */}
      <div style={{ background: '#fff', marginTop: '1.5rem', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
        <LoanRequestTable filters={filteredWithIgnore} />
      </div>
    </div>
  );
};

export default LoanRequestsPage;
