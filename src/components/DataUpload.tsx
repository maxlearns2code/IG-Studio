import React from "react";
import { Users, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Theme } from "@/types";

interface DataUploadProps {
  theme: Theme;
  followersFiles: File[];
  setFollowersFiles: (files: File[]) => void;
  followingFiles: File[];
  setFollowingFiles: (files: File[]) => void;
  isCompact?: boolean;
}

export default function DataUpload({
  theme,
  followersFiles,
  setFollowersFiles,
  followingFiles,
  setFollowingFiles,
  isCompact = false
}: DataUploadProps) {
  return (
  if (isCompact) {
    return (
      <section className="flex flex-wrap items-center justify-between gap-4 p-4 mb-4 card-pro glass backdrop-blur-md border border-white/10 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 group cursor-pointer relative">
            <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-all">
              <Users size={16} />
            </div>
            <div>
              <div className="text-[10px] font-bold text-primary uppercase tracking-tighter opacity-70">Followers</div>
              <div className="text-xs font-bold text-foreground">{followersFiles.length} Files</div>
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
              <div className="text-[10px] font-bold text-secondary uppercase tracking-tighter opacity-70">Following</div>
              <div className="text-xs font-bold text-foreground">{followingFiles.length} Files</div>
            </div>
            <input 
              type="file" multiple accept=".json" 
              onChange={(e) => setFollowingFiles(Array.from(e.target.files || []))}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>
        
        <div className="text-[10px] font-medium text-foreground/30 italic hidden lg:block">
          Click any icon to update source data
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
          <label className="block text-sm font-semibold text-primary uppercase tracking-widest">Followers Data</label>
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
        <p className="mt-2 text-xs text-foreground/40">{followersFiles.length} file(s) selected</p>
      </div>

      <div className={cn(
        theme === "instagram" ? "card-social" : "card-pro", 
        "p-8 relative overflow-hidden group transition-all"
      )}>
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <UserCheck size={80} />
        </div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-semibold text-secondary uppercase tracking-widest">Following Data</label>
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
        <p className="mt-2 text-xs text-foreground/40">{followingFiles.length} file(s) selected</p>
      </div>
    </section>
  );
}
