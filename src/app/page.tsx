"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { parseInstagramJson, compareProfiles, AnalysisResults as ResultsType } from "@/lib/analyzer";
import ThemeSwitcher, { Theme } from "@/components/ThemeSwitcher";
import { cn } from "@/lib/utils";
import MainHeader from "@/components/MainHeader";
import DataUpload from "@/components/DataUpload";
import AnalysisResults from "@/components/AnalysisResults";
import AutomationModule from "@/components/AutomationModule";

export default function IGStudio() {
  const [followersFiles, setFollowersFiles] = useState<File[]>([]);
  const [followingFiles, setFollowingFiles] = useState<File[]>([]);
  const [results, setResults] = useState<ResultsType | null>(null);
  const [activeTab, setActiveTab] = useState<"non-followers" | "fans" | "mutuals" | "automation">("non-followers");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [theme, setTheme] = useState<Theme>("pro");

  // Theme Sync
  useEffect(() => {
    const savedTheme = localStorage.getItem("ig_studio_theme") as Theme;
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("ig_studio_theme", theme);
  }, [theme]);

  // Mouse Tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      document.documentElement.style.setProperty("--mouse-x", `${x}%`);
      document.documentElement.style.setProperty("--mouse-y", `${y}%`);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleAnalyze = async () => {
    if (followersFiles.length === 0 || followingFiles.length === 0) {
      alert("Please upload both followers and following JSON files.");
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
      alert("Error parsing files. Ensure they are valid JSON.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="max-w-6xl mx-auto p-6 lg:p-12">
      <MainHeader theme={theme} />
      
      <DataUpload 
        theme={theme}
        followersFiles={followersFiles}
        setFollowersFiles={setFollowersFiles}
        followingFiles={followingFiles}
        setFollowingFiles={setFollowingFiles}
      />

      <div className="flex justify-center mb-16">
        <button 
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className={cn(
            "text-white px-12 py-5 font-bold text-lg transition-all flex items-center gap-3",
            theme === "instagram" ? "bg-gradient-to-r from-accent to-primary shadow-xl shadow-primary/25 rounded-full" : "bg-gradient-to-r from-primary to-secondary shadow-2xl shadow-primary/20 hover:scale-105 rounded-2xl",
            theme === "pixel" && "pixel-border border-white/50 text-shadow-pixel"
          )}
        >
          {isAnalyzing ? "Processing Matrix..." : "RUN INITIAL ANALYSIS"}
          <ChevronRight size={20} />
        </button>
      </div>

      {results && (
        <AnalysisResults 
          theme={theme} 
          results={results} 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        >
          <AutomationModule theme={theme} results={results} />
        </AnalysisResults>
      )}

      <ThemeSwitcher currentTheme={theme} onThemeChange={setTheme} />
    </main>
  );
}
