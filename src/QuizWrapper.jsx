import React, { useEffect, useState } from "react";
import Quiz from "./Quiz";

const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRjxEFn1oFCBuEhK3vToYAlwSA3LDRiVfnTZShFGx8Z1u3hIBRv0G17AaqJhxY-Dq1Ysh5BdamBdTNe/pub?gid=0&single=true&output=csv";

export default function QuizWrapper() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetch(SHEET_URL)
      .then((res) => res.text())
      .then((text) => {
        const lines = text.trim().split("\n");
        const [header, ...rows] = lines;
        const get = (r, i) => r.split(",")[i]?.trim();
        const data = rows.map((line) => {
          const parts = line.split(",");
          return {
            theme: get(parts, 0),
            question: get(parts, 1),
            options: [get(parts, 2), get(parts, 3), get(parts, 4), get(parts, 5)].filter(Boolean),
            answer: get(parts, 6),
            explanation: get(parts, 7),
          };
        });
        setQuestions(data);
      });
  }, []);

  if (!questions.length) {
    return <div className="text-center mt-10">Laster spørsmål...</div>;
  }

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Farmaquizen</h1>
      <Quiz questions={questions} />
    </div>
  );
}
