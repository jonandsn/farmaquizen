// @ts-nocheck
"use client";

import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import Quiz from "./Quiz";

// Enkel laster‑komponent (uten eksterne UI‑bibliotek)
function Loader() {
  return (
    <div style={{ display: "flex", justifyContent: "center", paddingTop: "4rem" }}>
      <div
        style={{
          padding: "2rem 3rem",
          border: "1px solid #ececec",
          borderRadius: 8,
          maxWidth: 400,
          width: "100%",
          textAlign: "center",
          color: "#666",
        }}
      >
        <div className="spinner" style={{ marginBottom: 12 }}>
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#888"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-spin"
          >
            <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
            <path d="M22 12a10 10 0 0 1-10 10" />
          </svg>
        </div>
        Laster inn spørsmål …
      </div>
    </div>
  );
}

export default function QuizWrapper() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCSV() {
      const url =
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vRjxEFn1oFCBuEhK3vToYAlwSA3LDRiVfnTZShFGx8Z1u3hIBRv0G17AaqJhxY-Dq1Ysh5BdamBdTNe/pub?gid=0&single=true&output=csv";

      const csv = await (await fetch(url)).text();

      const { data } = Papa.parse(csv, {
        header: true,
        skipEmptyLines: true,
      });

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
    <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
      <div style={{ maxWidth: 600, width: "100%" }}>
        <Quiz questions={questions} />
      </div>
    </div>
  );
}
