"use client";

import React, { useState, useEffect } from "react";
import { Upload, Users, UserMinus, UserCheck, Shield, ChevronRight, Copy, Terminal, Activity, Layers } from "lucide-react";
import { parseInstagramJson, compareProfiles, AnalysisResults } from "@/lib/analyzer";
import ThemeSwitcher, { Theme } from "@/components/ThemeSwitcher";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function IGStudio() {
  const [followersFiles, setFollowersFiles] = useState<File[]>([]);
  const [followingFiles, setFollowingFiles] = useState<File[]>([]);
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [activeTab, setActiveTab] = useState<"non-followers" | "fans" | "mutuals" | "automation">("non-followers");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [theme, setTheme] = useState<Theme>("pro");

  useEffect(() => {
    const savedTheme = localStorage.getItem("ig_studio_theme") as Theme;
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("ig_studio_theme", theme);
  }, [theme]);

  const handleAnalyze = async () => {
    if (followersFiles.length === 0 || followingFiles.length === 0) {
      alert("Please upload both followers and following JSON files.");
      return;
    }

    setIsAnalyzing(true);
    try {
      // Merge multi-file followers if needed (usually one is enough but we support multiples)
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
      
      // Save to history (Future feature #3 preparation)
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

  const generateUserscript = () => {
    if (!results) return "";
    const targets = JSON.stringify(results.nonFollowers);
    return `// ==UserScript==
// @name         IG-Studio Safe Unfollower
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automates unfollowing non-reciprocal accounts with safe random delays (60-360s).
// @author       IG-Studio
// @match        https://*.instagram.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const TARGETS = ${targets};
    const MIN_DELAY = 60;
    const MAX_DELAY = 360;
    const STORAGE_INDEX_KEY = 'ig_studio_unfollow_index';
    const STORAGE_ACTIVE_KEY = 'ig_studio_is_active';

    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    async function findButtonByText(text) {
        const buttons = Array.from(document.querySelectorAll('button, div[role="button"]'));
        return buttons.find(b => b.innerText.toLowerCase().trim() === text.toLowerCase());
    }

    async function processCurrentPage() {
        const isActive = localStorage.getItem(STORAGE_ACTIVE_KEY) === 'true';
        if (!isActive) return;

        let index = parseInt(localStorage.getItem(STORAGE_INDEX_KEY) || '0');
        if (index >= TARGETS.length) {
            localStorage.setItem(STORAGE_ACTIVE_KEY, 'false');
            alert("IG-Studio: Unfollow task complete!");
            return;
        }

        const currentTarget = TARGETS[index];
        const currentPath = window.location.pathname.replace(/\\//g, '');

        if (currentPath === currentTarget) {
            console.log("[IG-Studio] Target: @" + currentTarget);
            await sleep(randomInt(3000, 6000));
            const followingBtn = await findButtonByText('Following');
            if (followingBtn) {
                followingBtn.click();
                await sleep(randomInt(1500, 3000));
                const confirmBtn = await findButtonByText('Unfollow');
                if (confirmBtn) {
                    confirmBtn.click();
                    await sleep(randomInt(2000, 4000));
                }
            }
            index++;
            localStorage.setItem(STORAGE_INDEX_KEY, index.toString());
            const delay = randomInt(MIN_DELAY, MAX_DELAY);
            console.log("[IG-Studio] Success. Sleep " + delay + "s before next.");
            await sleep(delay * 1000);
            if (index < TARGETS.length) window.location.href = 'https://www.instagram.com/' + TARGETS[index] + '/';
        } else {
            console.log("[IG-Studio] Navigating to: @" + currentTarget);
            window.location.href = 'https://www.instagram.com/' + currentTarget + '/';
        }
    }

    function injectUI() {
        if (document.getElementById('studio-panel')) return;
        const panel = document.createElement('div');
        panel.id = 'studio-panel';
        panel.style.cssText = "position: fixed; bottom: 20px; right: 20px; z-index: 10000; background: #0f172a; color: #fff; padding: 15px; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.8); font-family: sans-serif; border: 1px solid rgba(255,255,255,0.1); width: 200px;";
        const active = localStorage.getItem(STORAGE_ACTIVE_KEY) === 'true';
        const idx = localStorage.getItem(STORAGE_INDEX_KEY) || '0';
        panel.innerHTML = '<div style="font-weight:bold;margin-bottom:8px;color:#e1306c">IG-STUDIO</div>' +
                          '<div style="font-size:11px;color:#cbd5e1;margin-bottom:12px">Targeting '+TARGETS.length+' users</div>' +
                          '<div style="font-size:13px;margin-bottom:10px">Progress: <b>'+idx+'</b> / '+TARGETS.length+'</div>' +
                          '<div style="display:flex;flex-direction:column;gap:5px">' +
                          '<button id="startStop" style="background:'+(active?'#ef4444':'#10b981')+';color:white;border:none;padding:8px;border-radius:6px;cursor:pointer;font-weight:600">'+(active?'STOP':'START MODULE')+'</button>' +
                          '<button id="resetBtn" style="background:rgba(255,255,255,0.1);color:white;border:none;padding:8px;border-radius:6px;cursor:pointer;font-size:11px">Reset progress</button>' +
                          '</div>';
        document.body.appendChild(panel);
        document.getElementById('startStop').onclick = () => { localStorage.setItem(STORAGE_ACTIVE_KEY, !active); window.location.reload(); };
        document.getElementById('resetBtn').onclick = () => { if(confirm("Reset to #0?")) { localStorage.setItem(STORAGE_INDEX_KEY, '0'); window.location.reload(); } };
    }

    setTimeout(() => { injectUI(); processCurrentPage(); }, 4000);
})();`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateUserscript());
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  return (
    <main className="max-w-6xl mx-auto p-6 lg:p-12">
      {/* Header */}
      <header className="mb-12 text-center">
        <div className="inline-flex items-center justify-center p-3 mb-4 rounded-2xl glass border-primary/20">
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

      {/* Upload Section */}
      <section className="grid md:grid-cols-2 gap-6 mb-12">
        <div className={cn(theme === "instagram" ? "card-social p-6" : "card-pro p-8", "relative overflow-hidden group transition-all")}>
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Users size={80} />
          </div>
          <label className="block text-sm font-semibold text-primary uppercase tracking-widest mb-4">Followers Data</label>
          <input 
            type="file" 
            multiple 
            accept=".json" 
            onChange={(e) => setFollowersFiles(Array.from(e.target.files || []))}
            className="w-full text-sm text-foreground/60 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer"
          />
          <p className="mt-2 text-xs text-foreground/40">{followersFiles.length} file(s) selected</p>
        </div>

        <div className={cn(theme === "instagram" ? "card-social p-6" : "card-pro p-8", "relative overflow-hidden group transition-all")}>
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <UserCheck size={80} />
          </div>
          <label className="block text-sm font-semibold text-secondary uppercase tracking-widest mb-4">Following Data</label>
          <input 
            type="file" 
            multiple 
            accept=".json" 
            onChange={(e) => setFollowingFiles(Array.from(e.target.files || []))}
            className="w-full text-sm text-foreground/60 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-secondary/10 file:text-secondary hover:file:bg-secondary/20 transition-all cursor-pointer"
          />
          <p className="mt-2 text-xs text-foreground/40">{followingFiles.length} file(s) selected</p>
        </div>
      </section>

      <div className="flex justify-center mb-16">
        <button 
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className={cn(
            "text-white px-12 py-5 rounded-2xl font-bold text-lg transition-all flex items-center gap-3",
            theme === "instagram" ? "bg-primary shadow-lg shadow-primary/20" : "bg-gradient-to-r from-primary to-secondary shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
          )}
        >
          {isAnalyzing ? "Processing Matrix..." : "RUN INITIAL ANALYSIS"}
          <ChevronRight size={20} />
        </button>
      </div>

      {results && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard theme={theme} label="Followers" value={results.followers.length} icon={<Users className="text-blue-400" />} />
            <StatCard theme={theme} label="Following" value={results.following.length} icon={<UserCheck className="text-green-400" />} />
            <StatCard theme={theme} label="Mutuals" value={results.mutuals.length} icon={<Layers className="text-purple-400" />} />
            <StatCard theme={theme} label="Imbalance" value={results.nonFollowers.length} icon={<UserMinus className="text-red-400" />} highlight />
          </div>

          {/* Result Tabs */}
          <div className={cn(theme === "instagram" ? "card-social" : "card-pro", "overflow-hidden")}>
            <div className={cn("flex p-2 gap-2 border-b", theme === "instagram" ? "border-slate-200 bg-slate-50" : "border-card-border")}>
              <TabButton theme={theme} active={activeTab === "non-followers"} onClick={() => setActiveTab("non-followers")}>Non-Followers</TabButton>
              <TabButton theme={theme} active={activeTab === "fans"} onClick={() => setActiveTab("fans")}>Your Fans</TabButton>
              <TabButton theme={theme} active={activeTab === "automation"} onClick={() => setActiveTab("automation")}>Automation Assistant</TabButton>
            </div>

            <div className="p-8">
              {activeTab === "non-followers" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                  {results.nonFollowers.map(user => <UserRow theme={theme} key={user} username={user} />)}
                  {results.nonFollowers.length === 0 && <EmptyState text="Everyone you follow follows you back!" />}
                </div>
              )}

              {activeTab === "fans" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                  {results.fans.map(user => <UserRow theme={theme} key={user} username={user} />)}
                  {results.fans.length === 0 && <EmptyState text="No pending follow requests or fans." />}
                </div>
              )}

              {activeTab === "automation" && (
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
                          <p className="text-xs text-slate-500 mt-0.5">Customized for {results.nonFollowers.length} targets</p>
                        </div>
                      </div>
                      <Copy size={20} className="text-slate-600 group-hover:text-primary transition-colors" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Theme Switcher */}
      <ThemeSwitcher currentTheme={theme} onThemeChange={setTheme} />
    </main>
  );
}

function StatCard({ label, value, icon, highlight = false, theme }: { label: string, value: number, icon: React.ReactNode, highlight?: boolean, theme?: Theme }) {
  return (
    <div className={cn(
      theme === "instagram" ? "card-social border-none p-4" : "card-pro p-5",
      "group flex items-center gap-4 border-l-4 border-l-transparent hover:border-l-primary/50 transition-all"
    )}>
      <div className={cn(
        "p-3 rounded-xl transition-transform group-hover:scale-110",
        theme === "instagram" ? "bg-slate-100" : "bg-foreground/5"
      )}>{icon}</div>
      <div>
        <div className={cn("text-2xl font-bold", highlight && "text-accent")}>{value.toLocaleString()}</div>
        <div className="text-[10px] uppercase font-bold text-foreground/40 tracking-wider">{label}</div>
      </div>
    </div>
  );
}

function TabButton({ children, active, onClick, theme }: { children: React.ReactNode, active: boolean, onClick: () => void, theme?: Theme }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "px-6 py-3 text-sm font-semibold rounded-xl transition-all",
        active 
          ? (theme === "instagram" ? "bg-primary text-white shadow-md" : "bg-primary text-white shadow-xl") 
          : "text-foreground/40 hover:bg-foreground/5"
      )}
    >
      {children}
    </button>
  );
}

function UserRow({ username, theme }: { username: string, theme?: Theme }) {
  return (
    <div className={cn(
      theme === "instagram" ? "card-social border-slate-100 p-2 px-4" : "card-pro p-3 px-5",
      "flex items-center justify-between group glass-hover"
    )}>
      <span className="font-medium text-foreground truncate pr-2">@{username}</span>
      <a 
        href={`https://instagram.com/${username}`} 
        target="_blank" 
        className="text-[10px] font-bold text-primary uppercase opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
      >
        View Profile
      </a>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div className="col-span-full py-12 text-center text-slate-500 font-medium italic">{text}</div>;
}
