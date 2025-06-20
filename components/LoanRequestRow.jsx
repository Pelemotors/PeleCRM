// LoanRequestRow.jsx – שורת טבלה עם סטטוסים בעברית, יישור מרכזי, יצירת בקשה ידנית
import React, { useState } from 'react';
import { updateLoanRequest } from '../services/api';

const formatCurrency = (amount) => {
  const n = Number(amount);
  if (!n || isNaN(n)) return '—';
  return `${n.toLocaleString('he-IL')} ₪`;
};

const translateStatus = (status) => {
  switch (status) {
    case 'pending': return 'ממתין';
    case 'approved': return 'אושר';
    case 'rejected': return 'נדחה';
    case 'unclear': return 'לא ברור';
    case 'delivered': return 'חזר אישור מסירה';
    case 'completed': return 'אושר לתשלום';
    default: return status || '—';
  }
};

export default function LoanRequestRow({ data }) {
  const [request, setRequest] = useState(data);
  const [error, setError] = useState(null);

  const handleStatus = (e) => {
    const status = e.target.value;
    updateLoanRequest(request.id, { status })
      .then((res) => {
        setRequest(res);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError('שגיאה בעדכון סטטוס');
      });
  };

  const handleAmount = () => {
    const amount = prompt('עדכן סכום (₪):', request.amount_requested || '');
    if (amount !== null) {
      updateLoanRequest(request.id, { amount_requested: amount })
        .then((res) => {
          setRequest(res);
          setError(null);
        })
        .catch((err) => {
          console.error(err);
          setError('שגיאה בעדכון סכום');
        });
    }
  };

  const handleManualCreate = async () => {
    try {
      const res = await fetch('/api/loan_requests/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          group_name: request.group_name,
          content: request.content,
          sender_name: request.sender_name || 'לא ידוע',
          amount_requested: request.amount_requested || null
        })
      });

      if (res.ok) {
        alert('✅ הבקשה נוצרה בהצלחה');
      } else {
        alert('❌ שגיאה ביצירת הבקשה');
      }
    } catch (err) {
      console.error('שגיאה:', err);
      alert('⚠️ תקלה ביצירת הבקשה');
    }
  };

  return (
    <>
      <tr>
        <td style={{ textAlign: 'center', whiteSpace: 'nowrap', minWidth: '90px' }}>
          {new Date(request.timestamp_created).toLocaleDateString('he-IL')}
        </td>
        <td style={{ textAlign: 'center', whiteSpace: 'nowrap', minWidth: '80px' }}>
          {new Date(request.timestamp_created).toLocaleTimeString('he-IL')}
        </td>
        <td style={{ textAlign: 'center', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {request.group_name}
        </td>
        <td style={{ textAlign: 'center', minWidth: '80px' }}>{formatCurrency(request.amount_requested)}</td>
        <td style={{ textAlign: 'center', minWidth: '120px' }}>
          <select value={request.status} onChange={handleStatus} style={{ width: '100%' }}>
            <option value="pending">ממתין</option>
            <option value="approved">אושר</option>
            <option value="rejected">נדחה</option>
            <option value="unclear">לא ברור</option>
            <option value="delivered">חזר אישור מסירה</option>
            <option value="completed">אושר לתשלום</option>
          </select>
        </td>
        <td style={{ textAlign: 'center', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          <div style={{ maxHeight: '5em', overflowY: 'auto' }}>{request.content}</div>
        </td>
        <td style={{ textAlign: 'center', minWidth: '80px' }}>
          <button onClick={handleAmount}>ערוך סכום</button>
        </td>

        {/* ✅ כפתור "צור בקשה" מוצג רק אם זו לא בקשה ידנית ולא זוהתה */}
        {(!request.is_manual && !request.is_probable) && (
          <td style={{ textAlign: 'center' }}>
            <button onClick={handleManualCreate}>➕ צור בקשה</button>
          </td>
        )}
      </tr>

      {error && (
        <tr>
          <td colSpan="8" style={{ color: 'red', textAlign: 'center' }}>
            ❌ {error}
          </td>
        </tr>
      )}
    </>
  );
}
