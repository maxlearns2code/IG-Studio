"use client";

import React, { useState, useEffect } from "react";
import { X, Copy, Download, Terminal, ChevronDown, ChevronUp, BookOpen, Shield, HelpCircle, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Theme } from "@/types";
import { Locale, translations } from "@/lib/translations";

interface ScraperGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
  locale: Locale;
}

export default function ScraperGuideModal({ isOpen, onClose, theme, locale }: ScraperGuideModalProps) {
  const [scraperCode, setScraperCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copyFeedback, setCopyFeedback] = useState<boolean>(false);
  const [showCodePreview, setShowCodePreview] = useState<boolean>(false);
  const t = translations[locale];

  useEffect(() => {
    if (!isOpen) return;

    setIsLoading(true);
    fetch("/instagram_scraper.js")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load script");
        return res.text();
      })
      .then((data) => {
        setScraperCode(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error loading scraper script:", err);
        setScraperCode("// Error loading scraper script from server. Please try downloading it directly.");
        setIsLoading(false);
      });
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleCopy = () => {
    if (!scraperCode) return;
    navigator.clipboard.writeText(scraperCode);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[50000] flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div 
        className={cn(
          "relative w-full max-w-3xl glass backdrop-blur-2xl shadow-2xl overflow-hidden transition-all duration-300 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]",
          theme === "instagram" ? "card-social bg-white/95 border-slate-200" : "card-pro bg-background/95 border-card-border",
          theme === "pixel" && "pixel-border bg-[#2d1b33] border-white/50"
        )}
      >
        {/* Decorative Corner lines for Pro Theme */}
        {theme === "pro" && (
          <>
            <div className="absolute top-0 left-0 w-8 h-[2px] bg-primary" />
            <div className="absolute top-0 left-0 w-[2px] h-8 bg-primary" />
            <div className="absolute bottom-0 right-0 w-8 h-[2px] bg-secondary" />
            <div className="absolute bottom-0 right-0 w-[2px] h-8 bg-secondary" />
          </>
        )}

        {/* Modal Header */}
        <header className={cn(
          "flex items-center justify-between p-6 border-b shrink-0",
          theme === "instagram" ? "border-slate-100 bg-slate-50 text-slate-800" : "border-card-border text-foreground",
          theme === "pixel" && "border-2 border-white/20 bg-slate-950"
        )}>
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-xl flex items-center justify-center",
              theme === "instagram" ? "bg-primary/10 text-primary" : "bg-primary/25 text-primary",
              theme === "pixel" && "border-2 border-white/20 rounded-none bg-primary/20"
            )}>
              <Terminal size={20} className={cn(theme === "pro" && "animate-pulse")} />
            </div>
            <div>
              <h2 className={cn(
                "font-bold leading-tight text-left",
                theme === "instagram" ? "text-slate-800 text-lg" : "text-foreground text-xl",
                theme === "pixel" && "text-shadow-pixel text-green-400"
              )}>
                {theme === "pixel" ? (locale === "fr" ? "MOTEUR D'EXTRACTION" : "SCRAPER ENGINE") : t.modalTitle}
              </h2>
              <p className={cn(
                "text-xs mt-0.5 text-left",
                theme === "instagram" ? "text-slate-500" : "text-slate-400"
              )}>{t.modalDesc}</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className={cn(
              "p-2 rounded-lg transition-colors cursor-pointer",
              theme === "instagram" ? "text-slate-400 hover:text-slate-600 hover:bg-slate-100" : "text-slate-500 hover:text-white hover:bg-white/5",
              theme === "pixel" && "border border-white/20 rounded-none text-white hover:bg-white/10"
            )}
          >
            <X size={18} />
          </button>
        </header>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {/* Quick Notice Banner */}
          <div className={cn(
            "p-4 rounded-xl flex gap-4 border text-left",
            theme === "instagram" 
              ? "bg-slate-50 border-slate-200 text-slate-700" 
              : "bg-slate-900/50 border-white/5 text-slate-300",
            theme === "pixel" && "border-2 border-white/20 rounded-none bg-slate-950/40"
          )}>
            <Shield className="text-secondary shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className={cn("font-bold text-sm", theme === "instagram" ? "text-slate-800" : "text-slate-200")}>
                {t.privacyTitle}
              </h4>
              <p className="text-xs mt-1 leading-relaxed opacity-80">
                {t.privacyDesc}
              </p>
            </div>
          </div>

          {/* Core Action Panel */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Copy Script Container */}
            <div className={cn(
              "p-5 rounded-xl border flex flex-col justify-between text-left transition-all",
              theme === "instagram" ? "bg-slate-50 border-slate-200" : "bg-white/[0.02] border-white/5",
              theme === "pixel" && "rounded-none border-2 border-white/20"
            )}>
              <div>
                <h3 className={cn("font-bold text-sm", theme === "instagram" ? "text-slate-800" : "text-white")}>
                  {t.opt1Title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {t.opt1Desc}
                </p>
              </div>
              <button
                onClick={handleCopy}
                disabled={isLoading}
                className={cn(
                  "mt-4 w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 cursor-pointer",
                  copyFeedback 
                    ? "bg-green-600 text-white shadow-lg" 
                    : (theme === "instagram" ? "bg-primary text-white hover:bg-primary/90" : "bg-primary hover:bg-primary/80 text-black shadow-md"),
                  theme === "pixel" && "rounded-none border-2 border-white text-white bg-primary hover:bg-primary/90 shadow-[3px_3px_0px_rgba(0,0,0,0.5)]"
                )}
              >
                <Copy size={14} />
                <span>{isLoading ? t.opt1BtnLoading : (copyFeedback ? t.opt1BtnCopied : t.opt1Btn)}</span>
              </button>
            </div>

            {/* Download Script Container */}
            <div className={cn(
              "p-5 rounded-xl border flex flex-col justify-between text-left transition-all",
              theme === "instagram" ? "bg-slate-50 border-slate-200" : "bg-white/[0.02] border-white/5",
              theme === "pixel" && "rounded-none border-2 border-white/20"
            )}>
              <div>
                <h3 className={cn("font-bold text-sm", theme === "instagram" ? "text-slate-800" : "text-white")}>
                  {t.opt2Title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {t.opt2Desc}
                </p>
              </div>
              <a
                href="/instagram_scraper.js"
                download="instagram_scraper.js"
                className={cn(
                  "mt-4 w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 border text-center cursor-pointer",
                  theme === "instagram" 
                    ? "bg-white border-slate-300 text-slate-700 hover:bg-slate-50" 
                    : "bg-white/5 border-white/10 text-white hover:bg-white/10",
                  theme === "pixel" && "rounded-none border-2 border-white bg-secondary hover:bg-secondary/90 text-white shadow-[3px_3px_0px_rgba(0,0,0,0.5)]"
                )}
              >
                <Download size={14} />
                <span>{t.opt2Btn}</span>
              </a>
            </div>
          </div>

          {/* Interactive Steps */}
          <div className="space-y-4 text-left">
            <h3 className={cn(
              "font-bold text-sm uppercase tracking-wider",
              theme === "instagram" ? "text-slate-800" : "text-primary"
            )}>
              {t.stepTitle}
            </h3>

            <div className="grid gap-3 relative">
              <StepItem
                num={1}
                title={t.step1Title}
                desc={t.step1Desc}
                theme={theme}
              />
              <StepItem
                num={2}
                title={t.step2Title}
                desc={t.step2Desc}
                theme={theme}
              />
              <StepItem
                num={3}
                title={t.step3Title}
                desc={t.step3Desc}
                theme={theme}
              />
              <StepItem
                num={4}
                title={t.step4Title}
                desc={t.step4Desc}
                theme={theme}
              />
              <StepItem
                num={5}
                title={t.step5Title}
                desc={
                  <span>
                    {t.step5Desc1}
                    <span className="block mt-1.5 text-amber-500 font-semibold text-[11px] leading-normal">
                      {t.step5Warning}
                    </span>
                  </span>
                }
                theme={theme}
              />
              <StepItem
                num={6}
                title={t.step6Title}
                desc={t.step6Desc}
                theme={theme}
                isLast
              />
            </div>
          </div>

          {/* Code Preview Accordion */}
          <div className={cn(
            "border rounded-xl overflow-hidden",
            theme === "instagram" ? "border-slate-200" : "border-white/5",
            theme === "pixel" && "rounded-none border-2 border-white/20"
          )}>
            <button
              onClick={() => setShowCodePreview(!showCodePreview)}
              className={cn(
                "w-full flex items-center justify-between p-4 text-xs font-semibold uppercase tracking-wider text-left transition-colors cursor-pointer",
                theme === "instagram" 
                  ? "bg-slate-50 text-slate-700 hover:bg-slate-100" 
                  : "bg-white/[0.02] text-slate-400 hover:bg-white/[0.05]",
                theme === "pixel" && "bg-slate-950/20 text-white"
              )}
            >
              <div className="flex items-center gap-2">
                <BookOpen size={14} className="text-secondary" />
                <span>{t.viewCodeBtn}</span>
              </div>
              {showCodePreview ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {showCodePreview && (
              <div className={cn(
                "p-4 border-t relative",
                theme === "instagram" ? "border-slate-200 bg-slate-50" : "border-white/5 bg-slate-950"
              )}>
                {isLoading ? (
                  <p className="text-xs text-slate-500 text-center py-4 font-mono animate-pulse">{t.loadingEngineCode}</p>
                ) : (
                  <pre className="text-[10px] p-3 overflow-auto max-h-48 rounded bg-slate-950 border border-white/5 font-mono text-left select-all text-slate-400 leading-normal custom-scrollbar whitespace-pre-wrap">
                    {scraperCode}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <footer className={cn(
          "p-4 border-t text-center text-[10px] shrink-0",
          theme === "instagram" ? "border-slate-100 bg-slate-50 text-slate-400" : "border-card-border text-slate-500",
          theme === "pixel" && "bg-slate-950/40 text-slate-400"
        )}>
          {t.modalFooter}
        </footer>
      </div>
    </div>
  );
}

interface StepItemProps {
  num: number;
  title: string;
  desc: React.ReactNode;
  theme: Theme;
  isLast?: boolean;
}

function StepItem({ num, title, desc, theme, isLast = false }: StepItemProps) {
  return (
    <div className="flex gap-4 items-start relative group">
      {/* Connector Line */}
      {!isLast && (
        <div className={cn(
          "absolute left-[18px] top-9 bottom-0 w-[2px] bg-white/10",
          theme === "instagram" ? "bg-slate-200" : "bg-white/5"
        )} />
      )}
      
      {/* Step Badge */}
      <div className={cn(
        "w-9 h-9 flex items-center justify-center font-bold text-sm rounded-full shrink-0 select-none shadow-sm transition-all",
        theme === "instagram" 
          ? "bg-slate-100 border border-slate-200 text-slate-600" 
          : "bg-slate-900 border border-white/10 text-slate-300",
        theme === "pixel" && "rounded-none border-2 border-white/40 bg-slate-950 text-green-400"
      )}>
        {num}
      </div>

      {/* Step Texts */}
      <div className="pt-1.5 pb-2 text-left">
        <h4 className={cn(
          "font-bold text-xs uppercase tracking-wide",
          theme === "instagram" ? "text-slate-800" : "text-slate-200"
        )}>
          {title}
        </h4>
        <p className={cn(
          "text-xs mt-1 leading-relaxed",
          theme === "instagram" ? "text-slate-500" : "text-slate-400"
        )}>
          {desc}
        </p>
      </div>
    </div>
  );
}
