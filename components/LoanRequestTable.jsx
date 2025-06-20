import React, { useEffect, useState } from 'react';
import { getLoanRequests } from '../services/api';
import LoanRequestRow from './LoanRequestRow';
import * as XLSX from 'xlsx';

export default function LoanRequestTable({ filters }) {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 50;

  useEffect(() => {
    getLoanRequests(filters)
      .then((res) => {
        setRequests(res.data);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError('שגיאת רשת');
      });
  }, [filters]);

  const handleDoubleClick = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedRequests = [...requests].sort((a, b) => {
    if (!sortColumn) return 0;
    const valA = a[sortColumn] || '';
    const valB = b[sortColumn] || '';
    if (!isNaN(valA) && !isNaN(valB)) {
      return sortDirection === 'asc' ? valA - valB : valB - valA;
    }
    return sortDirection === 'asc'
      ? String(valA).localeCompare(String(valB), 'he')
      : String(valB).localeCompare(String(valA), 'he');
  });

  const indexOfLast = currentPage * requestsPerPage;
  const indexOfFirst = indexOfLast - requestsPerPage;
  const currentRequests = sortedRequests.slice(indexOfFirst, indexOfLast);

  const exportToExcel = () => {
    const exportData = sortedRequests.map((r) => ({
      'תאריך': new Date(r.timestamp_created).toLocaleDateString('he-IL'),
      'קבוצה': r.group_name,
      'סכום': r.amount_requested,
      'סטטוס': r.status,
      'תוכן': r.content,
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'בקשות');
    XLSX.writeFile(workbook, 'LoanRequests.xlsx');
  };

  const fetchRequests = () => {
    return getLoanRequests(filters)
      .then((res) => {
        setRequests(res.data);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError('שגיאת רשת');
      });
  };

  const handleManualCreate = async (row) => {
    try {
      const res = await fetch('/api/loan_requests/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          group_name: row.group_name,
          content: row.content,
          sender_name: row.sender_name,
        }),
      });
      if (res.ok) {
        alert('✅ הבקשה נוספה לרשימת בקשות המימון');
        fetchRequests();
      } else {
        alert('❌ שגיאה ביצירת הבקשה');
      }
    } catch (err) {
      console.error('שגיאה בבקשה ידנית:', err);
      alert('⚠️ תקלה בביצוע הבקשה');
    }
  };

  return (
    <div>
      <button onClick={exportToExcel} style={{ marginBottom: '1rem' }}>
        📤 ייצוא לאקסל
      </button>
      <table style={{ width: '100%', borderCollapse: 'collapse', direction: 'rtl' }}>
        <thead>
          <tr>
            <th onDoubleClick={() => handleDoubleClick('timestamp_created')} style={{ textAlign: 'center', cursor: 'pointer' }}>
              תאריך
            </th>
            <th onDoubleClick={() => handleDoubleClick('timestamp_created')} style={{ textAlign: 'center', cursor: 'pointer' }}>
              שעה
            </th>
            <th onDoubleClick={() => handleDoubleClick('group_name')} style={{ textAlign: 'center', cursor: 'pointer' }}>
              קבוצה
            </th>
            <th onDoubleClick={() => handleDoubleClick('amount_requested')} style={{ textAlign: 'center', cursor: 'pointer' }}>
              סכום
            </th>
            <th onDoubleClick={() => handleDoubleClick('status')} style={{ textAlign: 'center', cursor: 'pointer' }}>
              סטטוס
            </th>
            <th onDoubleClick={() => handleDoubleClick('content')} style={{ textAlign: 'center', cursor: 'pointer' }}>
              תוכן
            </th>
            <th style={{ textAlign: 'center' }}>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {error && (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', color: 'red' }}>
                ❌ {error}
              </td>
            </tr>
          )}
          {currentRequests.map((r) => (
            <LoanRequestRow key={r.id} data={r} onManualCreate={handleManualCreate} />
          ))}
        </tbody>
      </table>
      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>⬅️ קודם</button>
        <span style={{ margin: '0 1rem' }}>{currentPage}</span>
        <button disabled={indexOfLast >= sortedRequests.length} onClick={() => setCurrentPage(currentPage + 1)}>הבא ➡️</button>
      </div>
    </div>
  );
}