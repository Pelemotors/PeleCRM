import React, { useEffect, useState } from 'react';
import { getLoanRequests } from '../services/api';

export default function SummaryPanel({ filters }) {
  const [summary, setSummary] = useState({ total: 0, amount: 0, approved: 0 });

  useEffect(() => {
    getLoanRequests(filters).then((res) => {
      const data = res.data;
      const total = data.length;
      const amount = data.reduce((sum, r) => sum + (Number(r.amount_requested) || 0), 0);
      const approved = data
        .filter((r) => r.status === 'approved')
        .reduce((sum, r) => sum + (Number(r.amount_requested) || 0), 0);
      setSummary({ total, amount, approved });
    });
  }, [filters]);

  return (
    <div style={{ marginTop: '1rem' }}>
      <strong>Total Requests:</strong> {summary.total}
      {' | '}
      <strong>Total Amount:</strong> {summary.amount}
      {' | '}
      <strong>Approved:</strong> {summary.approved}
    </div>
  );
}
