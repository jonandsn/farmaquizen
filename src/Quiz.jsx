import React, { useState } from "react";

export default function Quiz({ questions }) {
  // Finn unike tema
  const themes = [...new Set(questions.map((q) => q.theme))];

  // lokal state
  const [theme, setTheme] = useState("");
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);

  // Velg tema først
  if (!theme) {
    return (
      <div style={{ textAlign: "center" }}>
        <h2>Velg tema</h2>
        {themes.map((t) => (
          <button
            key={t}
            onClick={() => {
              setTheme(t);
              setIndex(0);
            }}
            style={{ margin: "0.5rem" }}
          >
            {t}
          </button>
        ))}
      </div>
    );
  }

  // Filtrer spørsmål på valgt tema
  const qs = questions.filter((q) => q.theme === theme);
  const q = qs[index];

  // Ferdig med temaet
  if (!q) {
    return (
      <div style={{ textAlign: "center" }}>
        <h3>Du er ferdig med «{theme}»!</h3>
        <button
          onClick={() => {
            setTheme("");
            setSelected("");
            setShowFeedback(false);
          }}
        >
          Velg nytt tema
        </button>
      </div>
    );
  }

  // Håndter svarvalg
  const handleSelect = (opt) => {
    setSelected(opt);
    setShowFeedback(true);
  };

  // Gå til neste spørsmål
  const next = () => {
    setSelected("");
    setShowFeedback(false);
    setIndex(index + 1);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      <h3>
        {index + 1}/{qs.length}: {q.question}
      </h3>

      {/* Vis svaralternativer */}
      {q.options.map((opt) => {
        // fargelegging for feedback
        let bg = "";
        if (showFeedback) {
          if (opt === q.answer) bg = "lightgreen";
          else if (opt === selected) bg = "salmon";
        }

        return (
          <button
            key={opt}
            onClick={() => handleSelect(opt)}
            disabled={showFeedback}
            style={{
              display: "block",
              margin: "0.4rem 0",
              padding: "0.6rem",
              width: "100%",
              background: bg,
            }}
          >
            {opt}
          </button>
        );
      })}

      {/* Feedback-seksjon */}
      {showFeedback && (
        <div style={{ marginTop: "1rem" }}>
          <p>
            {selected === q.answer ? "✅ Riktig!" : "❌ Feil."}{" "}
            {q.explanation}
          </p>
          <button onClick={next} style={{ marginTop: "0.5rem" }}>
            Neste spørsmål
          </button>
        </div>
      )}
    </div>
  );
}
