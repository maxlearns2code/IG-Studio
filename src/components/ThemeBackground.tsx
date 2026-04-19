import React from "react";
import Image from "next/image";
import { Theme } from "./ThemeSwitcher";
import { cn } from "@/lib/utils";

interface ThemeBackgroundProps {
  theme: Theme;
}

export default function ThemeBackground({ theme }: ThemeBackgroundProps) {
  return (
    <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
      {/* Cyberpunk (Pro) */}
      <div 
        className={cn(
          "absolute inset-0 transition-opacity duration-1000 ease-in-out",
          theme === "pro" ? "opacity-100" : "opacity-0"
        )}
      >
        <Image
          src="/backgrounds/cyberpunk.webp"
          alt="Cyberpunk Cityscape"
          fill
          priority={theme === "pro"}
          className="object-cover"
          sizes="100vw"
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
