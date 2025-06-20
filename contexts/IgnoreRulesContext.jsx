import React, { createContext, useContext, useState, useEffect } from 'react';

const IgnoreRulesContext = createContext();

export function IgnoreRulesProvider({ children }) {
  const [ignoredGroups, setIgnoredGroups] = useState([]);
  const [ignoredContent, setIgnoredContent] = useState([]);
  const [ignoredContacts, setIgnoredContacts] = useState([]);

  const API_URL = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/ignore_rules`;

  // ✅ טוען את הכללים מהשרת (קובץ ignoreRules.json)
  useEffect(() => {
    const loadRules = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();

        console.log('📥 כללים נטענו מהשרת:', data);

        setIgnoredGroups(data.ignoredGroups || []);
        setIgnoredContent(data.ignoredContent || []);
        setIgnoredContacts(data.ignoredContacts || []);
      } catch (err) {
        console.error('❌ שגיאה בטעינת כללי התעלמות מהשרת:', err.message);
      }
    };

    loadRules();
  }, []);

  return (
    <IgnoreRulesContext.Provider value={{
      ignoredGroups,
      ignoredContent,
      ignoredContacts,
      setIgnoredGroups,
      setIgnoredContent,
      setIgnoredContacts
    }}>
      {children}
    </IgnoreRulesContext.Provider>
  );
}

export function useIgnoreRules() {
  return useContext(IgnoreRulesContext);
}
