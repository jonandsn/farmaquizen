import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import Quiz from "./Quiz";

const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRjxEFn1oFCBuEhK3vToYAlwSA3LDRiVfnTZShFGx8Z1u3hIBRv0G17AaqJhxY-Dq1Ysh5BdamBdTNe/pub?gid=0&single=true&output=csv";

export default function QuizWrapper() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetch(SHEET_URL)
      .then((res) => res.text())
      .then((text) => {
        const result = Papa.parse(text, { header: true });
        const data = result.data
          .map(row => ({
            theme: row.theme || row.Tema || row.tema,
            question: row.question || row.Spørsmål || row.question,
            options: [row.option1, row.option2, row.option3, row.option4].filter(Boolean),
            answer: row.answer,
            explanation: row.explanation,
          }))
          .filter(q =>
            q.theme && q.question && q.options.length > 0 && q.answer
          );
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
