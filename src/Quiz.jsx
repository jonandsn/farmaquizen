import React, { useState } from "react";

export default function Quiz({ questions, onFinish }) {
  const themes = [...new Set(questions.map((q) => q.theme))];

  const [theme, setTheme] = useState("");
  const [i, setI] = useState(0);
  const [selected, setSelected] = useState("");
  const [score, setScore] = useState(0);

  if (!theme) {
    return (
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-semibold">Velg tema</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {themes.map((t) => (
            <button
              key={t}
              className="px-4 py-2 rounded-md bg-blue-600 text-white"
              onClick={() => {
                setTheme(t);
                setI(0);
                setScore(0);
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const qs = questions.filter((q) => q.theme === theme);
  const q = qs[i];
  if (!q) {
    onFinish?.(score);
    return (
      <div className="text-center space-y-4">
        <h3 className="text-xl">Ferdig! Du fikk {score} / {qs.length} riktige.</h3>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded-md"
          onClick={() => {
            setTheme("");
            setSelected("");
          }}
        >
          Velg nytt tema
        </button>
      </div>
    );
  }

  const choose = (opt) => {
    setSelected(opt);
    if (opt === q.answer) setScore((s) => s + 1);
  };

  const next = () => {
    setSelected("");
    setI(i + 1);
  };

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-500">
        {i + 1} / {qs.length} – Tema: {theme}
      </div>
      <h3 className="text-lg font-semibold">{q.question}</h3>

      {q.options.map((opt) => {
        const correct = opt === q.answer;
        const chosen = opt === selected;
        const base = "block w-full text-left px-4 py-2 rounded-md border";
        const neutral = "border-gray-300";
        const right = "bg-green-100 border-green-400";
        const wrong = "bg-red-100 border-red-400";

        let cls = base + " " + neutral;
        if (selected) cls = correct ? base + " " + right : chosen ? base + " " + wrong : cls;

        return (
          <button
            key={opt}
            disabled={!!selected}
            className={cls}
            onClick={() => choose(opt)}
          >
            {opt}
          </button>
        );
      })}

      {selected && (
        <div className="space-y-2">
          <p>
            {selected === q.answer ? "✅ Riktig!" : "❌ Feil."} {q.explanation}
          </p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md" onClick={next}>
            Neste
          </button>
        </div>
      )}
    </div>
  );
}
