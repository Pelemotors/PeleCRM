// 📁 IgnoreRulesPanel.jsx – ממשק ניהול כללי התעלמות עם קונטקסט + שמירה וטעינה מהשרת
import React, { useState, useEffect } from 'react';
import { useIgnoreRules } from '../contexts/IgnoreRulesContext';
 // 🧠 שימוש בקונטקסט הגלובלי

export default function IgnoreRulesPanel() {
  // שליפה ועדכון של הכללים מתוך הקונטקסט
  const {
    ignoredGroups,
    ignoredContent,
    ignoredContacts,
    setIgnoredGroups,
    setIgnoredContent,
    setIgnoredContacts
  } = useIgnoreRules();

  const [newContent, setNewContent] = useState('');
  const [newContact, setNewContact] = useState('');
  const [newGroup, setNewGroup] = useState('');

  const API_URL = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/ignore_rules`;

  // 🚀 טען את הכללים מהשרת עם עליית הרכיב – ועדכן את הקונטקסט
  useEffect(() => {
    loadRulesFromServer();
  }, []);

  const loadRulesFromServer = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setIgnoredGroups(data.ignoredGroups || []);
      setIgnoredContent(data.ignoredContent || []);
      setIgnoredContacts(data.ignoredContacts || []);
    } catch (err) {
      console.error('❌ שגיאה בטעינת כללי התעלמות מהשרת:', err.message);
    }
  };

  const saveRulesToServer = async () => {
    try {
      const rulesToSave = {
        ignoredGroups,
        ignoredContent,
        ignoredContacts
      };

      const res = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rulesToSave)
      });

      if (res.ok) {
        alert('✅ הכללים נשמרו בהצלחה לשרת');
      } else {
        alert('❌ שמירת הכללים לשרת נכשלה');
      }
    } catch (err) {
      console.error('❌ שגיאה בשמירת הכללים לשרת:', err.message);
    }
  };

  const addItem = (listSetter, list, value) => {
    if (!value) return;
    const updated = [...new Set([...list, value.trim()])];
    listSetter(updated);
  };

  const removeItem = (listSetter, list, index) => {
    const updated = list.filter((_, i) => i !== index);
    listSetter(updated);
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', marginTop: '1rem' }}>
      <h2>🛑 ניהול כללי התעלמות</h2>

      {/* Ignore Content */}
      <div style={{ marginBottom: '1rem' }}>
        <h3>📝 תוכן להתעלמות</h3>
        <input value={newContent} onChange={e => setNewContent(e.target.value)} placeholder="הוסף ביטוי" />
        <button onClick={() => { addItem(setIgnoredContent, ignoredContent, newContent); setNewContent(''); }}>➕</button>
        <ul>
          {ignoredContent.map((item, idx) => (
            <li key={idx}>{item} <button onClick={() => removeItem(setIgnoredContent, ignoredContent, idx)}>🗑️</button></li>
          ))}
        </ul>
      </div>

      {/* Ignore Contacts */}
      <div style={{ marginBottom: '1rem' }}>
        <h3>👤 אנשי קשר להתעלמות</h3>
        <input value={newContact} onChange={e => setNewContact(e.target.value)} placeholder="הוסף שם" />
        <button onClick={() => { addItem(setIgnoredContacts, ignoredContacts, newContact); setNewContact(''); }}>➕</button>
        <ul>
          {ignoredContacts.map((item, idx) => (
            <li key={idx}>{item} <button onClick={() => removeItem(setIgnoredContacts, ignoredContacts, idx)}>🗑️</button></li>
          ))}
        </ul>
      </div>

      {/* Ignore Groups */}
      <div style={{ marginBottom: '1rem' }}>
        <h3>👥 קבוצות להתעלמות</h3>
        <input value={newGroup} onChange={e => setNewGroup(e.target.value)} placeholder="הוסף מחרוזת שם קבוצה" />
        <button onClick={() => { addItem(setIgnoredGroups, ignoredGroups, newGroup); setNewGroup(''); }}>➕</button>
        <ul>
          {ignoredGroups.map((item, idx) => (
            <li key={idx}>{item} <button onClick={() => removeItem(setIgnoredGroups, ignoredGroups, idx)}>🗑️</button></li>
          ))}
        </ul>
      </div>

      {/* כפתורי פעולה */}
      <button onClick={saveRulesToServer} style={{ marginRight: '1rem' }}>💾 שמור</button>
      <button onClick={loadRulesFromServer}>♻️ טען מחדש מהשרת</button>
    </div>
  );
}
