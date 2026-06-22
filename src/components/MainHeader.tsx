import React from "react";
import { cn } from "@/lib/utils";
import { Theme } from "@/types";
import { Locale, translations } from "@/lib/translations";

interface MainHeaderProps {
  theme: Theme;
  locale: Locale;
  onToggleLocale: () => void;
}

export default function MainHeader({ theme, locale, onToggleLocale }: MainHeaderProps) {
  const t = translations[locale];

  return (
    <header className={cn(
      "mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b",
      theme === "instagram" ? "border-slate-200" : "border-white/10"
    )}>
      <div className="text-left">
        <h1 className={cn(
          "text-4xl font-bold tracking-tight mb-2",
          theme === "pixel" && "text-primary text-shadow-pixel"
        )}>
          IG <span className="text-gradient">Studio</span>
        </h1>
        <p className={cn(
          "text-sm font-medium leading-relaxed max-w-2xl",
          theme === "instagram" ? "text-slate-800" : "text-white/90",
          theme === "pixel" && "text-[#4ade80] text-xs font-mono"
        )}>
          {t.headerDescription}
        </p>
      </div>

      <div className="shrink-0 flex items-center self-start sm:self-auto select-none">
        <div className={cn(
          "relative inline-flex items-center overflow-hidden h-8 w-28 backdrop-blur-xl border shadow-2xl p-0",
          theme === "instagram" ? "rounded-full bg-slate-100/80 border-slate-200/50" : "rounded-xl bg-slate-950/60 border-white/5",
          theme === "pixel" && "rounded-none border-2 border-white shadow-[4px_4px_0px_rgba(0,0,0,0.5)] bg-slate-950/90"
        )}>
          {/* Sliding Highlight Layer */}
          <div 
            className={cn(
              "absolute top-0 bottom-0 transition-all duration-300 ease-out w-1/2",
              locale === "en" ? "left-0" : "left-1/2",
              theme === "pro" && "bg-primary shadow-[0_0_12px_rgba(0,242,255,0.25)]",
              theme === "instagram" && "bg-white border border-slate-200/50",
              theme === "pixel" && "bg-primary border-r border-white shadow-[2px_2px_0px_rgba(0,0,0,0.5)]"
            )}
          />

          <button
            onClick={() => locale !== "en" && onToggleLocale()}
            className={cn(
              "relative z-10 w-1/2 h-full flex items-center justify-center text-xs font-bold uppercase transition-colors duration-300 cursor-pointer select-none",
              locale === "en"
                ? (theme === "instagram" ? "text-slate-900 font-extrabold" : theme === "pixel" ? "text-white" : "text-black")
                : (theme === "instagram" ? "text-slate-400 hover:text-slate-600" : "text-slate-500 hover:text-slate-300")
            )}
          >
            EN
          </button>

          <button
            onClick={() => locale !== "fr" && onToggleLocale()}
            className={cn(
              "relative z-10 w-1/2 h-full flex items-center justify-center text-xs font-bold uppercase transition-colors duration-300 cursor-pointer select-none",
              locale === "fr"
                ? (theme === "instagram" ? "text-slate-900 font-extrabold" : theme === "pixel" ? "text-white" : "text-black")
                : (theme === "instagram" ? "text-slate-400 hover:text-slate-600" : "text-slate-500 hover:text-slate-300")
            )}
          >
            FR
          </button>
        </div>
      </div>
    </header>
  );
}
