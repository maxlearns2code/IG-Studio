"use client";

import React from "react";
import { Diamond, Camera, Gamepad2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Theme } from "@/types";

interface ThemeSwitcherProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export default function ThemeSwitcher({ currentTheme, onThemeChange }: ThemeSwitcherProps) {
  const themes = [
    { id: "pro", icon: Diamond, label: "Pro" },
    { id: "instagram", icon: Camera, label: "Social" },
    { id: "pixel", icon: Gamepad2, label: "Retro" },
  ] as const;

  return (
    <div className="fixed bottom-8 right-8 z-[10000] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-1 p-1.5 glass bg-background/80 backdrop-blur-xl border-card-border shadow-2xl rounded-full">
        {themes.map((theme) => {
          const Icon = theme.icon;
          const isActive = currentTheme === theme.id;
          
          return (
            <button
              key={theme.id}
              onClick={() => onThemeChange(theme.id)}
              className={cn(
                "group relative flex items-center justify-center p-3 rounded-full transition-all duration-300",
                isActive 
                  ? cn(
                      "bg-primary text-white shadow-lg shadow-primary/25 ring-2",
                      currentTheme === "instagram" ? "ring-primary/40" : "ring-primary/20"
                    )
                  : "text-slate-400 hover:text-white hover:bg-white/5",
                currentTheme === "pixel" && isActive && "ring-0 border-2 border-white shadow-[4px_4px_0px_rgba(0,0,0,0.5)]"
              )}
              title={theme.label}
            >
              <Icon size={20} className={cn("transition-transform duration-300", isActive && "scale-110")} />
              
              {/* Tooltip */}
              <span className="absolute bottom-full mb-3 px-3 py-1.5 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10 whitespace-nowrap">
                {theme.label} Theme
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
