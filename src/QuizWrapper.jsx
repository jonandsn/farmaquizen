// @ts-nocheck
"use client";

import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import Quiz from "./Quiz";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export type Question = {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  theme: string;
};

// Enkel laster‑komponent for gjenbruk
function LoaderCard() {
  return (
    <div className="w-full flex justify-center pt-10">
      <Card className="max-w-xl w-full">
        <CardContent className="flex flex-col gap-2 py-10 items-center text-muted-foreground">
          <Loader2 className="animate-spin w-8 h-8" />
          Laster inn spørsmål …
        </CardContent>
      </Card>
    </div>
  );
}

export default function QuizWrapper() {
  const [questions, setQuestions] = useState<Question[]>([]);
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

      const formatted = (data as any[]).map((row) => ({
        question: row.question,
        options: row.options.split("¤").map((opt: string) => opt.trim()),
        answer: row.answer,
        explanation: row.explanation,
        theme: row.theme,
      }));

      setQuestions(formatted);
      setLoading(false);
    }

    fetchCSV();
  }, []);

  if (loading) return <LoaderCard />;

  return (
    <div className="flex justify-center px-4 py-8">
      <div className="max-w-xl w-full">
        <Quiz questions={questions} />
      </div>
    </div>
  );
}
