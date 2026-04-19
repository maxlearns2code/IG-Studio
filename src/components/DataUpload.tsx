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
}

export default function DataUpload({
  theme,
  followersFiles,
  setFollowersFiles,
  followingFiles,
  setFollowingFiles,
}: DataUploadProps) {
  return (
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
          className={cn(
            "w-full text-sm text-foreground/60 file:mr-4 file:py-3 file:px-6 file:border-0 file:text-sm file:font-semibold transition-all cursor-pointer",
            theme === "instagram" ? "file:rounded-full file:bg-primary/10 file:text-primary hover:file:bg-primary/20" : "file:rounded-xl file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
          )}
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
