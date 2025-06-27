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
      <div className="text-center py-10 px-4">
        <h1 className="text-3xl font-bold mb-8">Velg tema</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-md mx-auto">
          {themes.map((t) => (
            <button
              key={t}
              className="bg-white border border-gray-300 rounded-xl px-6 py-3 shadow hover:shadow-md hover:bg-blue-50 transition"
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
      <div className="text-center py-10 px-4">
        <h2 className="text-2xl font-semibold mb-4">Du fikk {score} av {filtered.length} riktige!</h2>
        <button
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700"
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
    <div className="py-8 px-4 max-w-2xl mx-auto">
      <h2 className="text-lg font-semibold mb-6">
        {current + 1}. {question.question}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {question.options.map((option, i) => {
          const base = "px-4 py-3 border rounded-xl cursor-pointer text-left transition duration-150";
          const isCorrect = selected && option === question.answer;
          const isWrong = selected && option === selected && option !== question.answer;
          const classes = selected
            ? isCorrect
              ? `${base} border-green-500 bg-green-100`
              : isWrong
              ? `${base} border-red-500 bg-red-100`
              : `${base} opacity-60`
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
        <div className="mt-6 text-sm text-gray-700 bg-gray-50 p-4 rounded-xl">
          <strong>Forklaring:</strong> {question.explanation}
        </div>
      )}
    </div>
  );
}
