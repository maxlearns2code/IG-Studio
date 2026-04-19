import React from "react";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { Theme } from "./ThemeSwitcher";

interface MainHeaderProps {
  theme: Theme;
}

export default function MainHeader({ theme }: MainHeaderProps) {
  return (
    <header className="mb-12 text-center">
      <div className={cn(
        "inline-flex items-center justify-center p-3 mb-4 glass border-primary/20 transition-all",
        theme === "instagram" ? "rounded-full bg-gradient-to-tr from-accent/20 to-primary/20" : "rounded-2xl"
      )}>
        <Activity className="w-8 h-8 text-primary animate-pulse" />
      </div>
      <h1 className={cn(
        "text-5xl font-bold tracking-tight mb-3",
        theme === "pixel" && "text-primary"
      )}>
        IG <span className="text-gradient">Studio</span>
      </h1>
      <p className={cn(
        "text-lg font-medium",
        theme === "instagram" ? "text-slate-600" : "text-slate-400"
      )}>Premium social hygiene and account balance terminal.</p>
    </header>
  );
}
