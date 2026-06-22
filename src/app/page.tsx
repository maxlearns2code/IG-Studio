"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight, Globe } from "lucide-react";
import { parseInstagramJson, compareProfiles } from "@/lib/analyzer";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { Theme, AnalysisResults as ResultsType } from "@/types";
import { cn } from "@/lib/utils";
import MainHeader from "@/components/MainHeader";
import DataUpload from "@/components/DataUpload";
import AnalysisResults from "@/components/AnalysisResults";
import AutomationModule from "@/components/AutomationModule";
import ThemeBackground from "@/components/ThemeBackground";
import ScraperGuideModal from "@/components/ScraperGuideModal";
import { Locale, translations } from "@/lib/translations";

export default function IGStudio() {
  const [followersFiles, setFollowersFiles] = useState<File[]>([]);
  const [followingFiles, setFollowingFiles] = useState<File[]>([]);
  const [results, setResults] = useState<ResultsType | null>(null);
  const [activeTab, setActiveTab] = useState<"non-followers" | "fans" | "mutuals" | "automation">("non-followers");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [theme, setTheme] = useState<Theme>("pro");
  const [isScraperModalOpen, setIsScraperModalOpen] = useState(false);
  const [locale, setLocale] = useState<Locale>("en");

  // Theme Sync
  useEffect(() => {
    const savedTheme = localStorage.getItem("ig_studio_theme") as Theme;
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("ig_studio_theme", theme);
  }, [theme]);

  // Locale Sync
  useEffect(() => {
    const savedLocale = localStorage.getItem("ig_studio_locale") as Locale;
    if (savedLocale === "en" || savedLocale === "fr") setLocale(savedLocale);
  }, []);

  useEffect(() => {
    localStorage.setItem("ig_studio_locale", locale);
  }, [locale]);

  const t = translations[locale];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      
      // Standard coordinates
      document.documentElement.style.setProperty("--mouse-x", `${x}%`);
      document.documentElement.style.setProperty("--mouse-y", `${y}%`);

      // Snapped coordinates (for 8-bit theme) - 40x40 grid
      const snappedX = Math.round(x / 2.5) * 2.5;
      const snappedY = Math.round(y / 2.5) * 2.5;
      document.documentElement.style.setProperty("--mouse-x-snap", `${snappedX}%`);
      document.documentElement.style.setProperty("--mouse-y-snap", `${snappedY}%`);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleAnalyze = async () => {
    if (followersFiles.length === 0 || followingFiles.length === 0) {
      alert(t.alertMissingFiles);
      return;
    }

    setIsAnalyzing(true);
    try {
      const allFollowers: string[] = [];
      for (const file of followersFiles) {
        allFollowers.push(...(await parseInstagramJson(file)));
      }

      const allFollowing: string[] = [];
      for (const file of followingFiles) {
        allFollowing.push(...(await parseInstagramJson(file)));
      }

      const comparison = compareProfiles([...new Set(allFollowers)], [...new Set(allFollowing)]);
      setResults(comparison);
      
      const historyItem = {
        date: new Date().toISOString(),
        followers: comparison.followers.length,
        following: comparison.following.length,
        nonFollowers: comparison.nonFollowers.length
      };
      const history = JSON.parse(localStorage.getItem("ig_studio_history") || "[]");
      localStorage.setItem("ig_studio_history", JSON.stringify([historyItem, ...history].slice(0, 50)));

    } catch (error) {
      console.error(error);
      alert(t.alertParseError);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="max-w-6xl mx-auto p-6 lg:p-12">
      <ThemeBackground theme={theme} />
      
      <MainHeader 
        theme={theme} 
        locale={locale} 
        onToggleLocale={() => setLocale(locale === "en" ? "fr" : "en")} 
      />
      
      <div className={cn("transition-all duration-700", results ? "opacity-90 scale-95" : "opacity-100 scale-100")}>
        <DataUpload 
          theme={theme}
          followersFiles={followersFiles}
          setFollowersFiles={setFollowersFiles}
          followingFiles={followingFiles}
          setFollowingFiles={setFollowingFiles}
          isCompact={!!results}
          onOpenScraperGuide={() => setIsScraperModalOpen(true)}
          locale={locale}
        />

        <div className={cn("flex justify-center transition-all duration-500", results ? "mb-6" : "mb-16")}>
          <button 
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className={cn(
              "text-white font-bold transition-all flex items-center gap-3 cursor-pointer",
              results 
                ? "px-8 py-3 text-sm opacity-60 hover:opacity-100" 
                : "px-12 py-5 text-lg",
              theme === "instagram" ? "bg-gradient-to-r from-accent to-primary shadow-xl rounded-full" : "bg-gradient-to-r from-primary to-secondary shadow-2xl hover:scale-105 rounded-2xl",
              theme === "pixel" && "pixel-border border-white/50 text-shadow-pixel"
            )}
          >
            {isAnalyzing ? t.btnProcessing : (results ? t.btnReRun : t.btnRun)}
            <ChevronRight size={results ? 16 : 20} />
          </button>
        </div>
      </div>

      {results && (
        <AnalysisResults 
          theme={theme} 
          results={results} 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          locale={locale}
        >
          <AutomationModule theme={theme} results={results} locale={locale} />
        </AnalysisResults>
      )}

      <ThemeSwitcher currentTheme={theme} onThemeChange={setTheme} />



      <ScraperGuideModal 
        isOpen={isScraperModalOpen} 
        onClose={() => setIsScraperModalOpen(false)} 
        theme={theme} 
        locale={locale}
      />
    </main>
  );
}
