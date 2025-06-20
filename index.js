// index.js – נקודת כניסה לאפליקציית React

import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css'; // טעינת עיצוב בסיסי
import App from './App'; // טעינת הרכיב הראשי
import { IgnoreRulesProvider } from './contexts/IgnoreRulesContext'; // ✅ ייבוא הקונטקסט

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <IgnoreRulesProvider> {/* ✅ עטיפה של האפליקציה */}
      <App />
    </IgnoreRulesProvider>
  </React.StrictMode>
);
