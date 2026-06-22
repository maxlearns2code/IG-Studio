import React from "react";
import { Users, UserCheck, Terminal, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Theme } from "@/types";
import { Locale, translations } from "@/lib/translations";

interface DataUploadProps {
  theme: Theme;
  followersFiles: File[];
  setFollowersFiles: (files: File[]) => void;
  followingFiles: File[];
  setFollowingFiles: (files: File[]) => void;
  isCompact?: boolean;
  onOpenScraperGuide: () => void;
  locale: Locale;
}

export default function DataUpload({
  theme,
  followersFiles,
  setFollowersFiles,
  followingFiles,
  setFollowingFiles,
  isCompact = false,
  onOpenScraperGuide,
  locale
}: DataUploadProps) {
  const t = translations[locale];

  if (isCompact) {
    return (
      <section className="flex flex-wrap items-center justify-between gap-4 p-4 mb-4 card-pro glass backdrop-blur-md border border-white/10 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 group cursor-pointer relative">
            <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-all">
              <Users size={16} />
            </div>
            <div>
              <div className="text-[10px] font-bold text-primary uppercase tracking-tighter opacity-70">{t.followers}</div>
              <div className="text-xs font-bold text-foreground">{followersFiles.length} {t.files}</div>
            </div>
            <input 
              type="file" multiple accept=".json" 
              onChange={(e) => setFollowersFiles(Array.from(e.target.files || []))}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>

          <div className="h-8 w-[1px] bg-white/5 mx-2" />

          <div className="flex items-center gap-3 group cursor-pointer relative">
            <div className="p-2 rounded-lg bg-secondary/10 text-secondary group-hover:bg-secondary/20 transition-all">
              <UserCheck size={16} />
            </div>
            <div>
              <div className="text-[10px] font-bold text-secondary uppercase tracking-tighter opacity-70">{t.following}</div>
              <div className="text-xs font-bold text-foreground">{followingFiles.length} {t.files}</div>
            </div>
            <input 
              type="file" multiple accept=".json" 
              onChange={(e) => setFollowingFiles(Array.from(e.target.files || []))}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>
        
        <div className="text-[10px] font-medium text-foreground/30 italic hidden lg:block">
          {t.compactUpdateTip}
        </div>
      </section>
    );
  }

  return (
    <section className="grid md:grid-cols-2 gap-6 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className={cn(
        theme === "instagram" ? "card-social" : "card-pro", 
        "p-8 relative overflow-hidden group transition-all"
      )}>
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Users size={80} />
        </div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-semibold text-primary uppercase tracking-widest">{t.followersData}</label>
        </div>
        <input 
          type="file" 
          multiple 
          accept=".json" 
          onChange={(e) => setFollowersFiles(Array.from(e.target.files || []))}
          className={cn(
            "w-full text-sm text-foreground/60 file:mr-4 file:py-3 file:px-6 file:border-0 file:text-sm file:font-semibold transition-all cursor-pointer",
            theme === "instagram" ? "file:rounded-full file:bg-primary/10 file:text-primary hover:file:bg-primary/20" : "file:rounded-xl file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
          )}
        />
        <p className="mt-2 text-xs text-foreground/40">{followersFiles.length} {t.fileSelected}</p>
      </div>

      <div className={cn(
        theme === "instagram" ? "card-social" : "card-pro", 
        "p-8 relative overflow-hidden group transition-all"
      )}>
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <UserCheck size={80} />
        </div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-semibold text-secondary uppercase tracking-widest">{t.followingData}</label>
        </div>
        <input 
          type="file" 
          multiple 
          accept=".json" 
          onChange={(e) => setFollowingFiles(Array.from(e.target.files || []))}
          className={cn(
            "w-full text-sm text-foreground/60 file:mr-4 file:py-3 file:px-6 file:border-0 file:text-sm file:font-semibold transition-all cursor-pointer",
            theme === "instagram" ? "file:rounded-full file:bg-secondary/10 file:text-secondary hover:file:bg-secondary/20" : "file:rounded-xl file:bg-secondary/10 file:text-secondary hover:file:bg-secondary/20"
          )}
        />
        <p className="mt-2 text-xs text-foreground/40">{followingFiles.length} {t.fileSelected}</p>
      </div>

      <div className={cn(
        theme === "instagram" ? "card-social border-slate-200/60 bg-white/70" : "card-pro border-white/5 bg-white/[0.02]",
        theme === "pixel" && "pixel-border border-white/30 rounded-none bg-[#2d1b33] shadow-inner",
        "col-span-full p-6 flex flex-col md:flex-row items-center justify-between gap-4 text-left relative overflow-hidden"
      )}>
        {theme === "pro" && <div className="absolute top-0 right-0 w-24 h-[1px] bg-gradient-to-l from-primary to-transparent" />}
        <div className="flex items-center gap-4">
          <div className={cn(
            "p-3 rounded-xl hidden sm:flex items-center justify-center shrink-0 shadow-inner",
            theme === "instagram" ? "bg-slate-100 text-primary" : "bg-slate-950/70 border border-white/10 text-primary",
            theme === "pixel" && "border-2 border-white/20 rounded-none bg-slate-950/80"
          )}>
            <Terminal size={24} />
          </div>
          <div>
            <h4 className={cn("font-bold text-sm", theme === "instagram" ? "text-slate-800" : "text-white")}>
              {t.noFilesTitle}
            </h4>
            <p className={cn("text-xs mt-0.5 max-w-xl", theme === "instagram" ? "text-slate-500" : "text-white")}>
              {t.noFilesDesc}
            </p>
          </div>
        </div>
        <button
          onClick={onOpenScraperGuide}
          className={cn(
            "w-full md:w-auto shrink-0 flex items-center justify-center gap-2 py-2.5 px-6 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 cursor-pointer",
            theme === "instagram" ? "bg-primary text-white hover:bg-primary/95" : "bg-primary hover:bg-primary/80 text-black shadow-md",
            theme === "pixel" && "rounded-none border-2 border-white text-white bg-primary hover:bg-primary/90 shadow-[3px_3px_0px_rgba(0,0,0,0.5)]"
          )}
        >
          <span>{t.getScraperScript}</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </section>
  );
}
