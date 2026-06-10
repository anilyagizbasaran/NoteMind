"use client";

import { useState } from "react";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Tag,
  Copy,
  Check,
  Printer,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface Summary {
  overview: string;
  keyPoints: string[];
  importantTerms: { term: string; definition: string }[];
}

interface SummaryCardProps {
  summary: Summary;
  onGoToQuiz: () => void;
}

const SummaryCard = ({ summary, onGoToQuiz }: SummaryCardProps) => {
  const { t, lang } = useLanguage();
  const [expandedTerm, setExpandedTerm] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const lines: string[] = [];
    lines.push(t.copyOverview);
    lines.push(summary.overview);
    lines.push("");
    lines.push(t.copyKeyPoints);
    summary.keyPoints?.forEach((p, i) => lines.push(`${i + 1}. ${p}`));
    if (summary.importantTerms?.length) {
      lines.push("");
      lines.push(t.copyTerms);
      summary.importantTerms.forEach((item) => lines.push(`• ${item.term}: ${item.definition}`));
    }
    navigator.clipboard.writeText(lines.join("\n")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePrint = () => {
    const dateStr = new Date().toLocaleDateString(lang === "tr" ? "tr-TR" : "en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8"/>
  <title>NoteMind – ${t.printTitle}</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 700px; margin: 40px auto; color: #1e293b; line-height: 1.6; }
    h1 { font-size: 1.5rem; font-weight: 800; margin-bottom: 4px; }
    .date { font-size: 0.8rem; color: #94a3b8; margin-bottom: 24px; }
    h2 { font-size: 1rem; font-weight: 700; color: #4f46e5; margin: 20px 0 8px; text-transform: uppercase; letter-spacing: 0.05em; }
    p { margin: 0 0 8px; }
    ol { padding-left: 20px; }
    li { margin-bottom: 6px; }
    .term { margin-bottom: 8px; }
    .term strong { display: block; }
    .term span { font-size: 0.9rem; color: #475569; }
    @media print { body { margin: 20px; } }
  </style>
</head>
<body>
  <h1>${t.printTitle}</h1>
  <div class="date">${dateStr}</div>
  <h2>${t.sectionOverview}</h2>
  <p>${summary.overview}</p>
  <h2>${t.sectionKeyPoints}</h2>
  <ol>${summary.keyPoints?.map((p) => `<li>${p}</li>`).join("") ?? ""}</ol>
  ${summary.importantTerms?.length ? `<h2>${t.sectionTerms}</h2>${summary.importantTerms.map((item) => `<div class="term"><strong>${item.term}</strong><span>${item.definition}</span></div>`).join("")}` : ""}
</body>
</html>`;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.documentElement.innerHTML = html;
    w.focus();
    setTimeout(() => w.print(), 300);
  };

  return (
    <div className="w-full space-y-4 animate-fade-in">
      {/* Toolbar */}
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition-all text-xs font-medium"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? t.btnCopied : t.btnCopy}
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition-all text-xs font-medium"
        >
          <Printer className="w-3.5 h-3.5" />
          {t.btnPrint}
        </button>
      </div>

      {/* Overview */}
      <div className="glass rounded-2xl p-6 border-slate-800/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">{t.sectionOverview}</h2>
        </div>
        <p className="text-slate-300 leading-relaxed">{summary.overview}</p>
      </div>

      {/* Key Points */}
      <div className="glass rounded-2xl p-6 border-slate-800/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
            <Lightbulb className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">{t.sectionKeyPoints}</h2>
        </div>
        <ul className="space-y-3">
          {summary.keyPoints?.map((point, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <p className="text-slate-300 leading-relaxed">{point}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Important Terms */}
      {summary.importantTerms?.length > 0 && (
        <div className="glass rounded-2xl p-6 border-slate-800/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Tag className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">{t.sectionTerms}</h2>
            <span className="text-xs text-slate-500 ml-auto">{t.termHint}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {summary.importantTerms.map((item, i) => (
              <button
                key={i}
                onClick={() => setExpandedTerm(expandedTerm === i ? null : i)}
                className="text-left p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/40 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-emerald-300 text-sm">{item.term}</span>
                  {expandedTerm === i ? (
                    <ChevronUp className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors flex-shrink-0" />
                  )}
                </div>
                {expandedTerm === i && (
                  <p className="mt-2 text-slate-400 text-sm leading-relaxed border-t border-slate-700/50 pt-2">
                    {item.definition}
                  </p>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Go to Quiz */}
      <button
        onClick={onGoToQuiz}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 hover:text-white transition-all font-medium"
      >
        {t.btnGoToQuiz}
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default SummaryCard;
