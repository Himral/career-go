"use client";
import { useEffect, useState } from 'react';
import Papa from 'papaparse';

export default function QuestionsPage() {
  const [dataByCategory, setDataByCategory] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const difficultyLevels = ['Easy', 'Medium', 'Hard']; 

  useEffect(() => {
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

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setSelectedDifficulty(''); 
  };

  const handleDifficultyChange = (event) => {
    setSelectedDifficulty(event.target.value);
  };

  const filteredQuestions = Object.entries(dataByCategory)
    .filter(([category]) => !selectedCategory || category === selectedCategory)
    .reduce((acc, [category, items]) => {
      acc[category] = items.filter(
        (item) => !selectedDifficulty || item.difficulty === selectedDifficulty
      );
      return acc;
    }, {});

  return (
    <div className="p-6 w-full">
      <h1 className="text-xl font-bold mb-4 text-center text-gray-500">
        Domain-wise questions for interview preparation
      </h1>

      <div className="mb-4 flex items-center space-x-4">
        <div>
          <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">
            Select Domain:
          </label>
          <select
            id="category"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">All Domains</option>
            {Object.keys(dataByCategory).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="difficulty" className="block text-gray-700 text-sm font-bold mb-2">
            Select Difficulty:
          </label>
          <select
            id="difficulty"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={selectedDifficulty}
            onChange={handleDifficultyChange}
            disabled={!selectedCategory} 
          >
            <option value="">All Levels</option>
            {difficultyLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
      </div>

      {Object.entries(filteredQuestions).map(([category, items]) => (
        items.length > 0 && (
          <div key={category} className="mb-8 border p-4 rounded-md shadow-sm">
            <h2 className="text-xl font-semibold mb-2 text-gray-500">{category}</h2>
            {items.map((item, idx) => (
              <div key={idx} className="mb-4">
                <p>
                  <strong>Q{item.questionNumber}:</strong> {item.question}
                </p>
                <p>
                  <strong>Answer:</strong> {item.answer}
                </p>
                <p className="text-sm text-gray-500">Difficulty: {item.difficulty}</p>
              </div>
            ))}
          </div>
        )
      ))}

      {Object.keys(filteredQuestions).every(category => filteredQuestions[category].length === 0) && (
        <p className="text-gray-600 text-center">No questions found for the selected criteria.</p>
      )}
    </div>
  );
}