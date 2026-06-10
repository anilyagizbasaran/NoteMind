"use client";

import { useState } from "react";
import { Send, Loader2, Clock } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface NoteInputProps {
  onGenerate: (notes: string) => void;
  isLoading: boolean;
  cooldown?: number;
}

const MAX_CHARS = 8000;

const NoteInput = ({ onGenerate, isLoading, cooldown = 0 }: NoteInputProps) => {
  const { t } = useLanguage();
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (notes.trim() && notes.length <= MAX_CHARS && cooldown === 0) {
      onGenerate(notes);
    }
  };

  const isOverLimit = notes.length > MAX_CHARS;
  const isDisabled = isLoading || !notes.trim() || isOverLimit || cooldown > 0;

  return (
    <div className="w-full animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-lg font-medium text-slate-200 mb-2">
          {t.inputLabel}
        </label>
        <div className="relative group">
          <textarea
            className="input-field h-64 resize-none transition-all group-focus-within:border-indigo-500/50"
            placeholder={t.inputPlaceholder}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={isLoading}
          />
          <div className={`absolute top-4 right-4 text-xs font-mono ${isOverLimit ? "text-rose-400" : "text-slate-500"}`}>
            {notes.length} / {MAX_CHARS}
          </div>
        </div>

        {isOverLimit && (
          <p className="text-rose-400 text-sm">{t.inputOverLimit(MAX_CHARS)}</p>
        )}

        <button
          type="submit"
          className="btn-primary w-full flex items-center justify-center gap-2 group"
          disabled={isDisabled}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {t.btnLoading}
            </>
          ) : cooldown > 0 ? (
            <>
              <Clock className="w-5 h-5" />
              {t.btnCooldown(cooldown)}
            </>
          ) : (
            <>
              <Send className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              {t.btnAnalyze}
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default NoteInput;
