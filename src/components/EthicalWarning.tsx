import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const EthicalWarning = () => {
  const { t } = useLanguage();
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl glass-indigo border-indigo-500/30 text-indigo-200 text-sm animate-fade-in">
      <AlertCircle className="w-5 h-5 flex-shrink-0 text-indigo-400" />
      <p>{t.ethicalWarning}</p>
    </div>
  );
};

export default EthicalWarning;
