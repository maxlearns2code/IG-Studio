import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Theme } from "@/types";
import { cn } from "@/lib/utils";

interface ThemeBackgroundProps {
  theme: Theme;
}

export default function ThemeBackground({ theme }: ThemeBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (theme === "pro") {
      video.playbackRate = 0.6; // Slow down the playback speed to 60%
      video.play().catch((err) => {
        // Autoplay can be blocked if there is no user interaction yet,
        // although being muted helps significantly.
        console.log("Autoplay prevented or video play failed:", err);
      });
    } else {
      video.pause();
    }
  }, [theme]);

  return (
    <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
      {/* Cyberpunk (Pro) */}
      <div 
        className={cn(
          "absolute inset-0 transition-opacity duration-1000 ease-in-out",
          theme === "pro" ? "opacity-100" : "opacity-0"
        )}
      >
        <video
          ref={videoRef}
          src="/backgrounds/background.mp4"
          poster="/backgrounds/cyberpunk.webp"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Social (Instagram) */}
      <div 
        className={cn(
          "absolute inset-0 transition-opacity duration-1000 ease-in-out",
          theme === "instagram" ? "opacity-100" : "opacity-0"
        )}
      >
        <Image
          src="/backgrounds/instagram.webp"
          alt="Iridescent Silk"
          fill
          priority={theme === "instagram"}
          className="object-cover"
          sizes="100vw"
        />
      </div>

      {/* Retro (Pixel) */}
      <div 
        className={cn(
          "absolute inset-0 transition-opacity duration-1000 ease-in-out",
          theme === "pixel" ? "opacity-100" : "opacity-0"
        )}
      >
        <Image
          src="/backgrounds/pixelart.webp"
          alt="Pixel Fantasy Horizon"
          fill
          priority={theme === "pixel"}
          className="object-cover"
          sizes="100vw"
        />
      </div>
    </div>
  );
}
