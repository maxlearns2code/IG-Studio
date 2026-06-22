import React from "react";
import { Globe } from "lucide-react";
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

      <div className="shrink-0 flex items-center self-start sm:self-auto">
        <button
          onClick={onToggleLocale}
          className={cn(
            "group relative inline-flex items-center justify-center gap-1.5 p-2 px-3.5 transition-all duration-300 glass bg-background/80 backdrop-blur-xl border-card-border shadow-2xl hover:scale-105 cursor-pointer text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white hover:border-primary/30",
            theme === "instagram" ? "rounded-full" : "rounded-xl",
            theme === "pixel" && "rounded-none border-2 border-white shadow-[4px_4px_0px_rgba(0,0,0,0.5)]"
          )}
          title={locale === "en" ? "Switch to French" : "Passer en Anglais"}
        >
          <Globe size={13} className="text-primary group-hover:animate-pulse" />
          <span className="text-primary leading-none">{locale === "en" ? "FR" : "EN"}</span>
        </button>
      </div>
    </header>
  );
}
