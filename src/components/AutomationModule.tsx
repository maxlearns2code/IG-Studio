import React, { useState } from "react";
import { Shield, Terminal, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Theme } from "./ThemeSwitcher";
import { generateUserscript } from "@/lib/userscript";
import { AnalysisResults } from "@/lib/analyzer";

interface AutomationModuleProps {
  theme: Theme;
  results: AnalysisResults | null;
}

export default function AutomationModule({ theme, results }: AutomationModuleProps) {
  const [copyFeedback, setCopyFeedback] = useState(false);

  const handleCopy = () => {
    if (!results) return;
    navigator.clipboard.writeText(generateUserscript(results));
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-2xl flex gap-4">
        <Shield className="text-amber-500 shrink-0" />
        <div>
          <h4 className="font-bold text-amber-200">Safe Automation Protocol</h4>
          <p className="text-sm text-amber-200/70 mt-1">This userscript runs directly in your browser with randomized 60-360s delays to avoid detection.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3 text-slate-300">
          <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold">1</div>
          <span>Copy your personalized userscript below</span>
        </div>
        <div className="flex items-center gap-3 text-slate-300">
          <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold">2</div>
          <span>Create a new script in **Tampermonkey**</span>
        </div>
      </div>

      <div className="relative group">
        <div className="absolute inset-0 bg-primary/5 blur-xl group-hover:bg-primary/10 transition-all" />
        <button 
          onClick={handleCopy}
          className={cn(
            "relative w-full glass p-6 rounded-2xl border-dashed border-2 flex items-center justify-between group transition-all",
            copyFeedback ? "border-green-500/50 bg-green-500/5 transition-none" : "border-slate-700 hover:border-primary/50"
          )}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-slate-900 shadow-inner">
              <Terminal size={24} className={copyFeedback ? "text-green-500" : "text-primary"} />
            </div>
            <div className="text-left">
              <p className="font-bold">{copyFeedback ? "Copied to Clipboard!" : "Copy Userscript"}</p>
              <p className="text-xs text-slate-500 mt-0.5">Customized for {results?.nonFollowers.length || 0} targets</p>
            </div>
          </div>
          <Copy size={20} className="text-slate-600 group-hover:text-primary transition-colors" />
        </button>
      </div>
    </div>
  );
}
