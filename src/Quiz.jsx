import React, { useState } from "react";
export default function Quiz({ questions }) {
  const themes=[...new Set(questions.map(q=>q.theme))];
  const [theme,setTheme]=useState("");const [i,setI]=useState(0);
  if(!theme) return <div>{themes.map(t=><button key={t} onClick={()=>setTheme(t)}>{t}</button>)}</div>;
  const qs=questions.filter(q=>q.theme===theme);const q=qs[i];
  if(!q) return <p>Ferdig!</p>;
  return <div><h3>{q.question}</h3>{q.options.map(o=><button key={o} onClick={()=>setI(i+1)}>{o}</button>)}</div>;
}
