"use client";

import { useState } from "react";
import { History, ChevronDown, ChevronUp, RotateCcw, Trash2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export interface HistoryItem {
  id: string;
  timestamp: number;
  noteSnippet: string;
  data: any;
}

interface HistoryPanelProps {
  onRestore: (item: HistoryItem) => void;
}

const formatDate = (ts: number, lang: string) => {
  const d = new Date(ts);
  return d.toLocaleDateString(lang === "tr" ? "tr-TR" : "en-US", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const saveToHistory = (noteSnippet: string, data: any) => {
  const item: HistoryItem = {
    id: Date.now().toString(),
    timestamp: Date.now(),
    noteSnippet: noteSnippet.slice(0, 80).trim() + (noteSnippet.length > 80 ? "…" : ""),
    data,
  };
  const existing: HistoryItem[] = JSON.parse(localStorage.getItem("notemind_history") || "[]");
  const updated = [item, ...existing].slice(0, 5);
  localStorage.setItem("notemind_history", JSON.stringify(updated));
};

export const loadHistory = (): HistoryItem[] => {
  try {
    return JSON.parse(localStorage.getItem("notemind_history") || "[]");
  } catch {
    return [];
  }
};

const HistoryPanel = ({ onRestore }: HistoryPanelProps) => {
  const { t, lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<HistoryItem[]>(() => loadHistory());

  if (items.length === 0) return null;

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = items.filter((i) => i.id !== id);
    setItems(updated);
    localStorage.setItem("notemind_history", JSON.stringify(updated));
  };

  return (
    <div className="glass rounded-2xl border-slate-800/50 overflow-hidden animate-fade-in">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-slate-300 hover:text-white transition-colors"
      >
        <div className="flex items-center gap-3">
          <History className="w-4 h-4 text-indigo-400" />
          <span className="text-sm font-semibold">{t.historyTitle}</span>
          <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full">
            {items.length}
          </span>
        </div>
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {open && (
        <div className="border-t border-slate-800/50 divide-y divide-slate-800/30">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 px-5 py-3 hover:bg-slate-800/30 transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-300 truncate">{item.noteSnippet}</p>
                <p className="text-xs text-slate-600 mt-0.5">{formatDate(item.timestamp, lang)}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onRestore(item)}
                  className="p-1.5 rounded-lg hover:bg-indigo-500/20 text-indigo-400 transition-colors"
                  title={t.historyLoadTitle}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => handleDelete(item.id, e)}
                  className="p-1.5 rounded-lg hover:bg-rose-500/20 text-rose-400 transition-colors"
                  title={t.historyDeleteTitle}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPanel;
