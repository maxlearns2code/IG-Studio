import React, { useState } from "react";
import { Shield, Terminal, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Theme, AnalysisResults } from "@/types";
import { generateUserscript } from "@/lib/userscript";
import { Locale, translations } from "@/lib/translations";

interface AutomationModuleProps {
  theme: Theme;
  results: AnalysisResults | null;
  locale: Locale;
}

export default function AutomationModule({ theme, results, locale }: AutomationModuleProps) {
  const [copyFeedback, setCopyFeedback] = useState(false);
  const t = translations[locale];

  const handleCopy = () => {
    if (!results) return;
    navigator.clipboard.writeText(generateUserscript(results));
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-2xl flex gap-4 text-left">
        <Shield className="text-amber-500 shrink-0" size={24} />
        <div>
          <h4 className="font-bold text-amber-200">{t.safeAutomationProtocol}</h4>
          <p className="text-sm text-amber-200/70 mt-1">{t.safeAutomationDesc}</p>
        </div>
      </div>

      <div className="space-y-4 text-left">
        <div className="flex items-center gap-3 text-slate-300">
          <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold shrink-0">1</div>
          <span className="text-sm">{t.autoStep1}</span>
        </div>
        <div className="flex items-center gap-3 text-slate-300">
          <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold shrink-0">2</div>
          <span className="text-sm">{t.autoStep2}</span>
        </div>
        <div className="flex items-center gap-3 text-slate-300">
          <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold shrink-0">3</div>
          <span className="text-sm">{t.autoStep3}</span>
        </div>
      </div>

      <div className="relative group">
        <div className="absolute inset-0 bg-primary/5 blur-xl group-hover:bg-primary/10 transition-all" />
        <button 
          onClick={handleCopy}
          className={cn(
            "relative w-full glass p-6 rounded-2xl border-dashed border-2 flex items-center justify-between group transition-all cursor-pointer",
            copyFeedback ? "border-green-500/50 bg-green-500/5 transition-none" : "border-slate-700 hover:border-primary/50"
          )}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-slate-900 shadow-inner">
              <Terminal size={24} className={copyFeedback ? "text-green-500" : "text-primary"} />
            </div>
            <div className="text-left">
              <p className="font-bold">{copyFeedback ? t.copiedToClipboard : t.copyUserscript}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {t.customizedTargets.replace("{count}", String(results?.nonFollowers.length || 0))}
              </p>
            </div>
          </div>
          <Copy size={20} className="text-slate-600 group-hover:text-primary transition-colors" />
        </button>
      </div>
    </div>
  );
}
