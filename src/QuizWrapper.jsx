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
        // Hopp over tomme linjer og parse bare rader med nok kolonner
        const data = rows
          .filter(line => line.trim().length > 0)
          .map(line => {
            // Bruk REGEX for å splitte kun på KOMMA som ikke er inni anførselstegn
            const parts = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
            // Fjern eventuelle anførselstegn rundt svar
            const clean = s => s?.replace(/^"|"$/g, "").trim();
            return {
              theme: clean(parts[0]),
              question: clean(parts[1]),
              options: [clean(parts[2]), clean(parts[3]), clean(parts[4]), clean(parts[5])].filter(Boolean),
              answer: clean(parts[6]),
              explanation: clean(parts[7])
            };
          })
          // Fjern rader som mangler tema eller spørsmål
          .filter(q => q.theme && q.question && q.options.length > 0 && q.answer);
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
