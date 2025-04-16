"use client"
import { useEffect, useState } from 'react';
import Papa from 'papaparse';

export default function QuestionsPage() {
  const [dataByCategory, setDataByCategory] = useState({});

  useEffect(() => {
    // Load and parse CSV
    Papa.parse('/questions.csv', {
      download: true,
      header: true,
      complete: (results) => {
        const grouped = {};

        results.data.forEach((row) => {
          const category = row.Category?.trim() || 'Uncategorized';
          if (!grouped[category]) grouped[category] = [];
          grouped[category].push({
            questionNumber: row['Question Number'],
            question: row.Question,
            answer: row.Answer,
            difficulty: row.Difficulty,
          });
        });

        setDataByCategory(grouped);
      },
    });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Questions by Category</h1>

      {Object.entries(dataByCategory).map(([category, items]) => (
        <div key={category} className="mb-8 border p-4 rounded-md shadow">
          <h2 className="text-xl font-semibold mb-2">{category}</h2>
          {items.map((item, idx) => (
            <div key={idx} className="mb-4">
              <p><strong>Q{item.questionNumber}:</strong> {item.question}</p>
              <p><strong>Answer:</strong> {item.answer}</p>
              <p className="text-sm text-gray-500">Difficulty: {item.difficulty}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
