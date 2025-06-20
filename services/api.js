// src/services/api.js – קובץ API לממשק React

const BASE_URL = "http://localhost:5000/api/loan_requests";

// 1️⃣ שליפה כללית ללא פילטרים
export async function fetchLoanRequests() {
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) throw new Error(`שגיאת שרת: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("❌ שגיאה בשליפת בקשות:", error);
    throw error;
  }
}

// 2️⃣ שליפה עם פילטרים – תאריכים, סטטוס, קבוצה
export async function getLoanRequests(filters = {}) {
  try {
    const query = new URLSearchParams(filters).toString();
    const url = `${BASE_URL}?${query}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`שגיאת שרת: ${response.status}`);
    const data = await response.json();
    return { data };
  } catch (error) {
    console.error("❌ שגיאה בשליפת בקשות עם פילטרים:", error);
    throw error;
  }
}

// 3️⃣ עדכון בקשה – סטטוס או סכום
export async function updateLoanRequest(id, body) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`שגיאת עדכון: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("❌ שגיאה בעדכון בקשה:", error);
    throw error;
  }
}
