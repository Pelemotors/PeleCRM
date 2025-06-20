//C:\Users\chen elzam\Desktop\גל סממה\Pele_Field_CRM_\crm-dashboard\src\components\DetectionRulesPanel.jsx
import React, { useState, useEffect } from 'react';

// 🎯 רכיב לניהול כללי זיהוי בקשות רלוונטיות (ולא התעלמות)
export default function DetectionRulesPanel() {
  const [rules, setRules] = useState({
    keywordsToDetect: [],
    minAmount: 0,
    maxAmount: 250000,
    requiredWordsInMessage: []
  });

  const [newKeyword, setNewKeyword] = useState('');
  const [newRequiredWord, setNewRequiredWord] = useState('');
  const [minAmount, setMinAmount] = useState(0);
  const [maxAmount, setMaxAmount] = useState(250000);

  const API_URL = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/detection_rules`;

  // טעינת כללים מהשרת
  useEffect(() => {
    loadRules();
  }, []);

  const loadRules = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setRules(data);
      setMinAmount(data.minAmount || 0);
      setMaxAmount(data.maxAmount || 250000);
    } catch (err) {
      console.error('❌ שגיאה בטעינת כללי זיהוי:', err);
    }
  };

  const saveRules = async () => {
    try {
      const updated = {
        ...rules,
        minAmount: Number(minAmount),
        maxAmount: Number(maxAmount)
      };
      const res = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (res.ok) alert('✅ הכללים נשמרו');
      else alert('❌ שמירה נכשלה');
    } catch (err) {
      console.error('❌ שגיאה בשמירה:', err);
    }
  };

  const addItem = (key, value) => {
    if (!value) return;
    setRules(prev => ({
      ...prev,
      [key]: [...new Set([...prev[key], value.trim()])]
    }));
  };

  const removeItem = (key, index) => {
    setRules(prev => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index)
    }));
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', marginTop: '1rem' }}>
      <h2>🔍 ניהול כללים לזיהוי הודעות רלוונטיות</h2>

      <div style={{ marginBottom: '1rem' }}>
        <label>טווח סכומים:</label><br />
        מינימום: <input type="number" value={minAmount} onChange={e => setMinAmount(e.target.value)} />
        &nbsp; מקסימום: <input type="number" value={maxAmount} onChange={e => setMaxAmount(e.target.value)} />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <h3>🔑 מילות מפתח שצריך לזהות</h3>
        <input value={newKeyword} onChange={e => setNewKeyword(e.target.value)} placeholder="הוסף מילה" />
        <button onClick={() => { addItem('keywordsToDetect', newKeyword); setNewKeyword(''); }}>➕</button>
        <ul>
          {rules.keywordsToDetect.map((item, idx) => (
            <li key={idx}>{item} <button onClick={() => removeItem('keywordsToDetect', idx)}>🗑️</button></li>
          ))}
        </ul>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <h3>✍️ מילים שחייבות להופיע בהודעה</h3>
        <input value={newRequiredWord} onChange={e => setNewRequiredWord(e.target.value)} placeholder="הוסף מילה" />
        <button onClick={() => { addItem('requiredWordsInMessage', newRequiredWord); setNewRequiredWord(''); }}>➕</button>
        <ul>
          {rules.requiredWordsInMessage.map((item, idx) => (
            <li key={idx}>{item} <button onClick={() => removeItem('requiredWordsInMessage', idx)}>🗑️</button></li>
          ))}
        </ul>
      </div>

      <button onClick={saveRules} style={{ marginRight: '1rem' }}>💾 שמור</button>
      <button onClick={loadRules}>♻️ טען מחדש</button>
    </div>
  );
}
