# 📱 IG Studio | Premium Social Analysis

**IG Studio** is a high-performance, aesthetically-driven social hygiene and account balance terminal built for Instagram power users. It provides deep insights into your social reciprocation and automated tools for maintaining a healthy following-to-follower ratio.

![IG Studio Banner](public/backgrounds/cyberpunk.webp)

## ✨ Core Features

- **Multi-Theme Experience**: Switch between **Pro (Cyberpunk)**, **Social (Instagram)**, and **Retro (16-bit)** themes with unique interactive mouse lighting and widescreen panoramic backgrounds.
- **Deep Analysis**: Compare your Followers vs. Following lists to identify non-reciprocal accounts, fans, and mutual connections.
- **Safe Automation**: Generate personalized userscripts for Tampermonkey with built-in randomized delays (30-300s) to keep your account safe while unfollowing.
- **Privacy First**: All processing is done locally in your browser. Your data never leaves your machine.

## 🚀 Getting Started

### 1. Installation
```bash
npm install
# or
yarn install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) for the premium experience.

### 3. Usage
1. Export your **Followers** and **Following** data as JSON files (from Instagram or a scraper).
2. Upload them to the Data Terminal.
3. Pulse **"RUN INITIAL ANALYSIS"**.
4. Use the **Automation Assistant** to generate your safe unfollow script.

## 🎨 Design Philosophy
IG Studio is designed to feel like a high-end terminal.
- **Performance**: Optimized with `next/image` and GPU-accelerated CSS animations.
- **Interactivity**: Theme-aware mouse lighting (Scanner / Prism / Square).
- **Aesthetics**: Glassmorphism, ultra-wide panoramas, and cinematic typography.

## 🛠️ Technology Stack
- **Framework**: Next.js 16.2 (App Router)
- **Styling**: Tailwind CSS 4.0
- **Icons**: Lucide React
- **Animation**: CSS Variables + Next.js Transactions
- **Type Safety**: TypeScript 5.x

---
*Built for the next generation of social management.*
