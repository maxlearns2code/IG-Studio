import React, { useState } from "react";
import { Users, UserCheck, UserMinus, Layers, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Theme, AnalysisResults as ResultsType } from "@/types";

interface AnalysisResultsProps {
  theme: Theme;
  results: ResultsType;
  activeTab: string;
  setActiveTab: (tab: "non-followers" | "fans" | "mutuals" | "automation") => void;
  children?: React.ReactNode;
}

export default function AnalysisResults({
  theme,
  results,
  activeTab,
  setActiveTab,
  children
}: AnalysisResultsProps) {
  const [visitedUsers, setVisitedUsers] = useState<Set<string>>(new Set());

  const toggleVisited = (username: string) => {
    setVisitedUsers(prev => {
      const next = new Set(prev);
      if (next.has(username)) next.delete(username);
      else next.add(username);
      return next;
    });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <StatCard theme={theme} label="Followers" value={results.followers.length} icon={<Users size={16} className="text-blue-400" />} />
        <StatCard theme={theme} label="Following" value={results.following.length} icon={<UserCheck size={16} className="text-green-400" />} />
        <StatCard theme={theme} label="Mutuals" value={results.mutuals.length} icon={<Layers size={16} className="text-purple-400" />} />
        <StatCard theme={theme} label="Imbalance" value={results.nonFollowers.length} icon={<UserMinus size={16} className="text-red-400" />} highlight />
      </div>

      {/* Result Tabs */}
      <div className={cn(theme === "instagram" ? "card-social" : "card-pro", "overflow-hidden")}>
        <div className={cn("flex p-2 gap-2 border-b", theme === "instagram" ? "border-slate-200 bg-slate-50" : "border-card-border")}>
          <TabButton theme={theme} active={activeTab === "non-followers"} onClick={() => setActiveTab("non-followers")}>Non-Followers</TabButton>
          <TabButton theme={theme} active={activeTab === "fans"} onClick={() => setActiveTab("fans")}>Your Fans</TabButton>
          <TabButton theme={theme} active={activeTab === "automation"} onClick={() => setActiveTab("automation")}>Automation Assistant</TabButton>
        </div>

        <div className="p-6">
          {(activeTab === "non-followers" || activeTab === "fans") && (
            <div className={cn(
              "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 pr-4 custom-scrollbar overflow-y-auto transition-all",
              "h-[300px] content-start"
            )}>
              {(activeTab === "non-followers" ? results.nonFollowers : results.fans).map(user => (
                <UserRow 
                  theme={theme} 
                  key={user} 
                  username={user} 
                  isVisited={visitedUsers.has(user)}
                  onVisit={() => toggleVisited(user)}
                />
              ))}
              {(activeTab === "non-followers" ? results.nonFollowers : results.fans).length === 0 && (
                <EmptyState text={activeTab === "non-followers" ? "Everyone you follow follows you back!" : "No pending follow requests or fans."} />
              )}
            </div>
          )}

          {activeTab === "automation" && children}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, highlight = false, theme }: { label: string, value: number, icon: React.ReactNode, highlight?: boolean, theme?: Theme }) {
  return (
    <div className={cn(
      theme === "instagram" ? "card-social border-none p-2 px-4" : "card-pro p-3 px-5",
      "group flex items-center gap-3 border-l-4 border-l-transparent hover:border-l-primary/50 transition-all"
    )}>
      <div className={cn(
        "p-2 transition-transform group-hover:scale-110",
        theme === "instagram" ? "bg-slate-100 rounded-full" : "bg-foreground/5 rounded-lg"
      )}>{icon}</div>
      <div>
        <div className={cn("text-lg font-bold", highlight && "text-accent")}>{value.toLocaleString()}</div>
        <div className="text-[9px] uppercase font-bold text-foreground/40 tracking-wider leading-tight">{label}</div>
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
          ? (theme === "instagram" ? "bg-gradient-to-r from-accent to-primary text-white shadow-lg rounded-full" : "bg-primary text-white shadow-xl rounded-xl") 
          : cn("text-foreground/40 hover:bg-foreground/5", theme === "instagram" ? "rounded-full" : "rounded-xl")
      )}
    >
      {children}
    </button>
  );
}

function UserRow({ username, theme, isVisited, onVisit }: { username: string, theme?: Theme, isVisited: boolean, onVisit: () => void }) {
  return (
    <a 
      href={`https://instagram.com/${username}`} 
      target="_blank" 
      onClick={onVisit}
      className={cn(
        theme === "instagram" ? "card-social border-slate-100 p-2" : "card-pro p-2 bg-foreground/5",
        "flex items-center justify-between group transition-all duration-300 hover:scale-[1.02] border-transparent hover:border-primary/30",
        isVisited && "opacity-25 grayscale saturate-0"
      )}
    >
      <span className={cn(
        "text-[11px] font-medium truncate pr-1 transition-colors",
        isVisited ? "text-foreground/40" : "text-foreground group-hover:text-primary"
      )}>@{username}</span>
      <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 text-primary transition-opacity" />
    </a>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div className="col-span-full py-12 text-center text-slate-500 font-medium italic text-sm">{text}</div>;
}
