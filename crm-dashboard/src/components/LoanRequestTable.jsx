import React, { useEffect, useState } from 'react';
import { getLoanRequests } from '../services/api';
import LoanRequestRow from './LoanRequestRow';

export default function LoanRequestTable({ filters }) {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    getLoanRequests(filters).then((res) => setRequests(res.data));
  }, [filters]);

  return (
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Group</th>
          <th>Amount</th>
          <th>Status</th>
          <th>Content</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {requests.map((r) => (
          <LoanRequestRow key={r.id} data={r} />
        ))}
      </tbody>
    </table>
  );
}
