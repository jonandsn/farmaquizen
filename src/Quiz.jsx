// @ts-nocheck
"use client";

import React, { useState } from "react";

export default function Quiz({ questions, onFinish }) {
  const themes = [...new Set(questions.map((q) => q.theme))];
  const [theme, setTheme] = useState(null);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [selected, setSelected] = useState(null);

  const filtered = questions.filter((q) => q.theme === theme);
  const question = filtered[current];

  function handleAnswer(option) {
    if (selected) return;
    setSelected(option);
    if (option === question.answer) setScore(score + 1);
    setTimeout(() => {
      setSelected(null);
      if (current + 1 < filtered.length) {
        setCurrent(current + 1);
      } else {
        setFinished(true);
        onFinish(score + (option === question.answer ? 1 : 0));
      }
    }, 1000);
  }

  if (!theme) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-6">Velg tema</h1>
        <div className="flex flex-wrap justify-center gap-4">
          {themes.map((t) => (
            <button
              key={t}
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-blue-100 transition"
              onClick={() => setTheme(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Du fikk {score} av {filtered.length} riktige!</h2>
        <button
          className="mt-4 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
          onClick={() => {
            setTheme(null);
            setCurrent(0);
            setScore(0);
            setFinished(false);
          }}
        >
          Prøv igjen
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        {current + 1}. {question.question}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {question.options.map((option, i) => {
          const base = "px-4 py-3 border rounded cursor-pointer text-left";
          const isCorrect = selected && option === question.answer;
          const isWrong = selected && option === selected && option !== question.answer;
          const classes = selected
            ? isCorrect
              ? `${base} border-green-500 bg-green-100`
              : isWrong
              ? `${base} border-red-500 bg-red-100`
              : `${base} opacity-50`
            : `${base} hover:bg-gray-100`;
          return (
            <button
              key={i}
              onClick={() => handleAnswer(option)}
              className={classes}
              disabled={!!selected}
            >
              {option}
            </button>
          );
        })}
      </div>
      {selected && (
        <div className="mt-4 text-sm text-gray-600">
          <strong>Forklaring:</strong> {question.explanation}
        </div>
      )}
    </div>
  );
}
