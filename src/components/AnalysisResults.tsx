import React from "react";
import { Users, UserCheck, UserMinus, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { Theme } from "./ThemeSwitcher";
import { AnalysisResults as ResultsType } from "@/lib/analyzer";

interface AnalysisResultsProps {
  theme: Theme;
  results: ResultsType;
  activeTab: string;
  setActiveTab: (tab: "non-followers" | "fans" | "mutuals" | "automation") => void;
  children?: React.ReactNode; // For the AutomationPanel which we'll pass in
}

export default function AnalysisResults({
  theme,
  results,
  activeTab,
  setActiveTab,
  children
}: AnalysisResultsProps) {
  return (
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

          {activeTab === "automation" && children}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, highlight = false, theme }: { label: string, value: number, icon: React.ReactNode, highlight?: boolean, theme?: Theme }) {
  return (
    <div className={cn(
      theme === "instagram" ? "card-social border-none p-4" : "card-pro p-5",
      "group flex items-center gap-4 border-l-4 border-l-transparent hover:border-l-primary/50 transition-all"
    )}>
      <div className={cn(
        "p-3 transition-transform group-hover:scale-110",
        theme === "instagram" ? "bg-slate-100 rounded-full" : "bg-foreground/5 rounded-xl"
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
          ? (theme === "instagram" ? "bg-gradient-to-r from-accent to-primary text-white shadow-lg rounded-full" : "bg-primary text-white shadow-xl rounded-xl") 
          : cn("text-foreground/40 hover:bg-foreground/5", theme === "instagram" ? "rounded-full" : "rounded-xl")
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
