import React, { useState } from 'react';

export default function LoanRequestFilters({ onChange }) {
  const [local, setLocal] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    const next = { ...local, [name]: value };
    setLocal(next);
    onChange(next);
  };

  return (
    <div>
      <label>
        From:
        <input type="date" name="from" onChange={handleChange} />
      </label>
      <label>
        To:
        <input type="date" name="to" onChange={handleChange} />
      </label>
      <label>
        Group:
        <input type="text" name="group" onChange={handleChange} />
      </label>
      <label>
        Status:
        <select name="status" onChange={handleChange}>
          <option value="">All</option>
          <option value="pending">pending</option>
          <option value="approved">approved</option>
          <option value="rejected">rejected</option>
          <option value="unclear">unclear</option>
        </select>
      </label>
    </div>
  );
}