// SummaryPanel.jsx – פאנל סיכום בקשות בעברית כולל סכומים בפורמט תקני
import React, { useEffect, useState } from 'react';
import { getLoanRequests } from '../services/api';

// פונקציה לעיצוב סכום עם פסיקים וש"ח
const formatCurrency = (amount) => {
  const n = Number(amount);
  if (!n || isNaN(n)) return '—';
  return `${n.toLocaleString('he-IL')} ₪`;
};

// פונקציה לעיצוב מספר בקשות (עם פסיקים)
const formatCount = (count) => {
  return Number(count).toLocaleString('he-IL');
};

export default function SummaryPanel({ filters }) {
  const [summary, setSummary] = useState({
    total: 0,
    totalAmount: 0,
    approvedCount: 0,
    approvedAmount: 0,
    deliveredCount: 0,
    deliveredAmount: 0,
    completedCount: 0,
    completedAmount: 0,
  });

  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    getLoanRequests(filters)
      .then((res) => {
        const data = res.data;

        const total = data.length;
        const totalAmount = data.reduce((sum, r) => sum + (Number(r.amount_requested) || 0), 0);

        const approved = data.filter((r) => r.status === 'approved');
        const delivered = data.filter((r) => r.status === 'delivered');
        const completed = data.filter((r) => r.status === 'completed');

        const approvedAmount = approved.reduce((sum, r) => sum + (Number(r.amount_requested) || 0), 0);
        const deliveredAmount = delivered.reduce((sum, r) => sum + (Number(r.amount_requested) || 0), 0);
        const completedAmount = completed.reduce((sum, r) => sum + (Number(r.amount_requested) || 0), 0);

        setSummary({
          total,
          totalAmount,
          approvedCount: approved.length,
          approvedAmount,
          deliveredCount: delivered.length,
          deliveredAmount,
          completedCount: completed.length,
          completedAmount,
        });

        setLastUpdate(new Date());
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError('שגיאת רשת');
      });
  }, [filters]);

  return (
    <div style={{ background: '#fff', padding: '1rem', borderRadius: '12px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
      <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>📊 סיכום סטטיסטי</h3>

      <ul style={{ listStyle: 'none', padding: 0, lineHeight: '2em' }}>
        <li><strong>תאריך עדכון:</strong> {lastUpdate?.toLocaleDateString('he-IL')}</li>
        <li><strong>סה"כ בקשות:</strong> {formatCount(summary.total)} | <strong>סה"כ סכום:</strong> {formatCurrency(summary.totalAmount)}</li>
        <li><strong>אושרו:</strong> {formatCount(summary.approvedCount)} | <strong>סה"כ:</strong> {formatCurrency(summary.approvedAmount)}</li>
        <li><strong>חזר אישור מסירה:</strong> {formatCount(summary.deliveredCount)} | <strong>סה"כ:</strong> {formatCurrency(summary.deliveredAmount)}</li>
        <li><strong>אושרו לתשלום:</strong> {formatCount(summary.completedCount)} | <strong>סה"כ:</strong> {formatCurrency(summary.completedAmount)}</li>
      </ul>

      {error && (
        <div style={{ color: 'red', marginTop: '1rem' }}>
          ❌ {error}
        </div>
      )}
    </div>
  );
}
