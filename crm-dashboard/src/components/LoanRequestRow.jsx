import React, { useState } from 'react';
import { updateLoanRequest } from '../services/api';

export default function LoanRequestRow({ data }) {
  const [request, setRequest] = useState(data);

  const handleStatus = (e) => {
    const status = e.target.value;
    updateLoanRequest(request.id, { status }).then((res) => {
      setRequest(res.data);
    });
  };

  const handleAmount = () => {
    const amount = prompt('Amount', request.amount_requested || '');
    if (amount !== null) {
      updateLoanRequest(request.id, { amount_requested: amount }).then((res) => {
        setRequest(res.data);
      });
    }
  };

  return (
    <tr>
      <td>{new Date(request.timestamp_created).toLocaleDateString()}</td>
      <td>{request.group_name}</td>
      <td>{request.amount_requested || '—'}</td>
      <td>
        <select value={request.status} onChange={handleStatus}>
          <option value="pending">pending</option>
          <option value="approved">approved</option>
          <option value="rejected">rejected</option>
          <option value="unclear">unclear</option>
        </select>
      </td>
      <td>{request.content}</td>
      <td>
        <button onClick={handleAmount}>Edit Amount</button>
      </td>
    </tr>
  );
}
