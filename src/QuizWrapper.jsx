// @ts-nocheck
"use client";

import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import Quiz from "./Quiz";

export default function QuizWrapper() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCSV() {
      const url =
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vRjxEFn1oFCBuEhK3vToYAlwSA3LDRiVfnTZShFGx8Z1u3hIBRv0G17AaqJhxY-Dq1Ysh5BdamBdTNe/pub?gid=0&single=true&output=csv";
      const csv = await (await fetch(url)).text();
      const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true });
      const formatted = parsed.data.map(row => ({
        question: row.question,
        options: row.options.split("¤").map(o=>o.trim()),
        answer: row.answer,
        explanation: row.explanation,
        theme: row.theme
      }));
      setQuestions(formatted);
      setLoading(false);
    }
    fetchCSV();
  }, []);

  if (loading) return <p>Laster …</p>;
  return <Quiz questions={questions} />;
}
