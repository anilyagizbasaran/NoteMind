"use client";

import { useState, useRef, useEffect } from "react";
import NoteInput from "@/components/NoteInput";
import SummaryCard from "@/components/SummaryCard";
import QuizModule from "@/components/QuizModule";
import EthicalWarning from "@/components/EthicalWarning";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import HistoryPanel, { saveToHistory, HistoryItem } from "@/components/HistoryPanel";
import { GraduationCap, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const COOLDOWN_SECONDS = 15;

interface GeneratedData {
  summary: {
    overview: string;
    keyPoints: string[];
    importantTerms: { term: string; definition: string }[];
  };
  quiz: {
    question: string;
    options: string[];
    answer: string;
    explanation?: string;
  }[];
}

export default function Home() {
  const { lang, setLang, t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<GeneratedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"summary" | "quiz">("summary");
  const [cooldown, setCooldown] = useState(0);
  const lastNoteRef = useRef<string>("");
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, []);

  const startCooldown = () => {
    setCooldown(COOLDOWN_SECONDS);
    cooldownRef.current = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) {
          clearInterval(cooldownRef.current!);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const handleGenerate = async (notes: string) => {
    if (cooldown > 0) return;
    setIsLoading(true);
    setError(null);
    setData(null);
    setActiveTab("summary");
    lastNoteRef.current = notes;

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes, lang }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || t.errorGeneric);

      setData(result);
      saveToHistory(notes, result);
      startCooldown();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = (item: HistoryItem) => {
    setData(item.data);
    setActiveTab("summary");
    setError(null);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <header className="max-w-3xl mx-auto flex flex-col items-center mb-10 animate-fade-in">
        <div className="flex items-center gap-3 mb-3 w-full justify-center relative">
          <div className="p-3 rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-600/20">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">
            Note<span className="text-indigo-400">Mind</span>
          </h1>
          {/* Language switcher */}
          <div className="absolute right-0 flex items-center gap-1 p-1 bg-slate-900/60 border border-slate-800 rounded-lg">
            <button
              onClick={() => setLang("tr")}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                lang === "tr"
                  ? "bg-indigo-600 text-white shadow shadow-indigo-600/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              TR
            </button>
            <button
              onClick={() => setLang("en")}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                lang === "en"
                  ? "bg-indigo-600 text-white shadow shadow-indigo-600/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              EN
            </button>
          </div>
        </div>
        <p className="text-slate-400 flex items-center gap-2 text-base">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          {t.appTagline}
        </p>
      </header>

      <main className="max-w-3xl mx-auto space-y-5">
        {!data && !isLoading && (
          <div className="space-y-5 animate-fade-in">
            <HistoryPanel onRestore={handleRestore} />
            <NoteInput onGenerate={handleGenerate} isLoading={isLoading} cooldown={cooldown} />
            <EthicalWarning />
          </div>
        )}

        {isLoading && <LoadingSkeleton />}

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-center animate-fade-in">
            {error}
          </div>
        )}

        {data && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setData(null)}
                className="text-slate-500 hover:text-slate-300 text-sm font-medium transition-colors flex-shrink-0"
              >
                {t.newNote}
              </button>
              <EthicalWarning />
            </div>

            <div className="flex gap-1 p-1 bg-slate-900/60 border border-slate-800 rounded-xl">
              <button
                onClick={() => setActiveTab("summary")}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === "summary"
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {t.tabSummary}
              </button>
              <button
                onClick={() => setActiveTab("quiz")}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                  activeTab === "quiz"
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {t.tabQuiz}
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-mono ${activeTab === "quiz" ? "bg-white/20" : "bg-slate-700 text-slate-400"}`}>
                  {data.quiz.length}
                </span>
              </button>
            </div>

            {activeTab === "summary" && (
              <SummaryCard summary={data.summary} onGoToQuiz={() => setActiveTab("quiz")} />
            )}
            {activeTab === "quiz" && <QuizModule quiz={data.quiz} />}
          </div>
        )}
      </main>

      <footer className="max-w-3xl mx-auto mt-20 pt-8 border-t border-slate-800/50 text-center text-slate-600 text-sm">
        © {new Date().getFullYear()} NoteMind AI
      </footer>
    </div>
  );
}
