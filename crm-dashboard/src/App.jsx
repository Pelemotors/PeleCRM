import React, { useState } from 'react';
import LoanRequestTable from './components/LoanRequestTable';
import LoanRequestFilters from './components/LoanRequestFilters';
import SummaryPanel from './components/SummaryPanel';
import './App.css';

export default function App() {
  const [filters, setFilters] = useState({});

  return (
    <div className="App">
      <h1>CRM Loan Requests</h1>
      <LoanRequestFilters onChange={setFilters} />
      <SummaryPanel filters={filters} />
      <LoanRequestTable filters={filters} />
    </div>
  );
}
