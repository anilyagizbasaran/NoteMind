"use client";

import { useState } from "react";
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  ChevronRight,
  Info,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface Question {
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
}

interface QuizModuleProps {
  quiz: Question[];
}

const QuizModule = ({ quiz }: QuizModuleProps) => {
  const { t } = useLanguage();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [answers, setAnswers] = useState<{ selected: string; correct: boolean }[]>([]);

  const getScoreMessage = (sc: number, total: number) => {
    const pct = sc / total;
    return (
      t.scoreMessages.find((m) => pct >= m.minPct) ??
      t.scoreMessages[t.scoreMessages.length - 1]
    );
  };

  const handleOptionSelect = (option: string) => {
    if (showResult) return;
    const isCorrect = option === quiz[currentQuestion].answer;
    setSelectedOption(option);
    setShowResult(true);
    if (isCorrect) setScore((s) => s + 1);
    setAnswers((prev) => [...prev, { selected: option, correct: isCorrect }]);
  };

  const handleNext = () => {
    if (currentQuestion + 1 < quiz.length) {
      setCurrentQuestion((q) => q + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      setQuizComplete(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setShowResult(false);
    setScore(0);
    setQuizComplete(false);
    setAnswers([]);
  };

  if (quizComplete) {
    const msg = getScoreMessage(score, quiz.length);
    return (
      <div className="w-full glass rounded-2xl p-10 animate-fade-in border-slate-800/50">
        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-full bg-indigo-500/20 text-indigo-400 mb-4">
            <Award className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-1">{t.quizComplete}</h2>
          <p className={`text-base font-medium ${msg.color}`}>{msg.text}</p>
        </div>

        <div className="flex items-center justify-center gap-6 mb-8">
          <div className="text-center">
            <div className="text-5xl font-black text-white">{score}</div>
            <div className="text-xs text-slate-500 mt-1">{t.quizCorrectLabel}</div>
          </div>
          <div className="text-3xl text-slate-700">/</div>
          <div className="text-center">
            <div className="text-5xl font-black text-slate-400">{quiz.length}</div>
            <div className="text-xs text-slate-500 mt-1">{t.quizTotalLabel}</div>
          </div>
        </div>

        <div className="space-y-3 mb-8">
          {quiz.map((q, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 p-3 rounded-xl border text-sm ${
                answers[i]?.correct
                  ? "bg-emerald-500/5 border-emerald-500/20"
                  : "bg-rose-500/5 border-rose-500/20"
              }`}
            >
              {answers[i]?.correct ? (
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
              ) : (
                <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
              )}
              <div className="space-y-1">
                <p className="font-medium text-slate-200">{q.question}</p>
                {!answers[i]?.correct && (
                  <p className="text-xs text-slate-400">
                    {t.quizCorrectAnswer}{" "}
                    <span className="text-emerald-400 font-medium">{q.answer}</span>
                  </p>
                )}
                {q.explanation && (
                  <p className="text-xs text-slate-500 leading-relaxed">{q.explanation}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <button onClick={resetQuiz} className="btn-primary w-full flex items-center justify-center gap-2">
          <RotateCcw className="w-4 h-4" />
          {t.btnRestart}
        </button>
      </div>
    );
  }

  const question = quiz[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.length) * 100;

  return (
    <div className="w-full glass rounded-2xl p-8 animate-fade-in border-slate-800/50">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">{t.quizTitle}</h2>
        </div>
        <span className="text-sm font-mono text-slate-500 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700">
          {currentQuestion + 1} / {quiz.length}
        </span>
      </div>

      <div className="w-full bg-slate-800/50 rounded-full h-1.5 mb-8">
        <div
          className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-lg text-slate-100 font-medium leading-relaxed mb-6">
        {question.question}
      </p>

      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => {
          const isCorrect = option === question.answer;
          const isSelected = option === selectedOption;

          let cls = "w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ";

          if (!showResult) {
            cls += "bg-slate-900/50 border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/50 text-slate-300 cursor-pointer";
          } else if (isCorrect) {
            cls += "bg-emerald-500/10 border-emerald-500/50 text-emerald-200";
          } else if (isSelected) {
            cls += "bg-rose-500/10 border-rose-500/50 text-rose-200";
          } else {
            cls += "bg-slate-900/20 border-slate-800/30 text-slate-600 opacity-50";
          }

          return (
            <button key={index} onClick={() => handleOptionSelect(option)} disabled={showResult} className={cls}>
              <div className="flex items-center gap-4">
                <span className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-lg bg-slate-800 border border-slate-700 text-xs font-bold text-slate-400">
                  {String.fromCharCode(65 + index)}
                </span>
                <span>{option}</span>
              </div>
              {showResult && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />}
              {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />}
            </button>
          );
        })}
      </div>

      {showResult && question.explanation && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 mb-4 animate-fade-in">
          <Info className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-slate-300 leading-relaxed">{question.explanation}</p>
        </div>
      )}

      {showResult && (
        <button onClick={handleNext} className="btn-primary w-full flex items-center justify-center gap-2 animate-fade-in">
          {currentQuestion + 1 === quiz.length ? t.btnSeeResults : t.btnNext}
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default QuizModule;
