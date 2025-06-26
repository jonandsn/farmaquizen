// @ts-nocheck
"use client";

import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import Quiz from "./Quiz";

function Loader() {
  return (
    <div className="flex justify-center pt-20">
      <div className="border rounded-xl max-w-md w-full p-10 text-center text-gray-500">
        <svg
          className="animate-spin mx-auto mb-4"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
          <path d="M22 12a10 10 0 0 1-10 10" />
        </svg>
        Laster inn spørsmål …
      </div>
    </div>
  );
}

// Lokal leaderboard via localStorage
function Leaderboard({ score }) {
  const [top, setTop] = useState([]);

  useEffect(() => {
    if (score === null) return;
    const list = JSON.parse(localStorage.getItem("farmaLB") || "[]");
    const name = prompt("Navn til leaderboard", "Anon") || "Anon";
    const newList = [...list, { name, score }]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    localStorage.setItem("farmaLB", JSON.stringify(newList));
    setTop(newList);
  }, [score]);

  if (!top.length) return null;
  return (
    <div className="max-w-md w-full mx-auto mt-10">
      <h3 className="text-xl font-semibold mb-2">Leaderboard</h3>
      <ol className="list-decimal pl-5 space-y-1">
        {top.map((e, i) => (
          <li key={i}>
            {e.name} – <span className="font-semibold">{e.score}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function QuizWrapper() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [finalScore, setFinalScore] = useState(null);

  useEffect(() => {
    async function fetchCSV() {
      const url =
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vRjxEFn1oFCBuEhK3vToYAlwSA3LDRiVfnTZShFGx8Z1u3hIBRv0G17AaqJhxY-Dq1Ysh5BdamBdTNe/pub?gid=0&single=true&output=csv";
      const csv = await (await fetch(url)).text();
      const { data } = Papa.parse(csv, { header: true, skipEmptyLines: true });
      const formatted = data.map((row) => ({
        question: row.question,
        options: row.options?.split("¤").map((o) => o.trim()) || [],
        answer: row.answer,
        explanation: row.explanation,
        theme: row.theme,
      }));
      setQuestions(formatted);
      setLoading(false);
    }
    fetchCSV();
  }, []);

  if (loading) return <Loader />;

  return (
    <>
      <div className="flex justify-center px-4 py-10">
        <div className="w-full max-w-xl">
          <Quiz questions={questions} onFinish={setFinalScore} />
        </div>
      </div>
      {finalScore !== null && <Leaderboard score={finalScore} />}
    </>
  );
}
