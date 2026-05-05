# 📸 Instagram Insight Studio | Master Guide

This toolset allows you to extract, compare, and manage your Instagram follower data with high safety and robustness.

---

## 🚀 Phase 1: Data Extraction
Use this when you want to get a fresh snapshot of your data from Instagram.

1. **Open Instagram.com** on Desktop (Chrome or Firefox).
2. Go to your **Profile** and click on your **Followers** or **Following** count.
3. Press `F12` (or Right Click -> Inspect) and go to the **Console** tab.
4. Copy the code from [instagram_scraper.js](file:///c:/Users/max/.gemini/antigravity/scratch/instagram-scraper/instagram_scraper.js).
5. Paste it into the console and press **Enter**.
6. **Wait**: The script will scroll automatically and save the data as a JSON file when finished.
7. **Persistence**: The scraper saves its progress in your browser's `localStorage`. If you want to start a **completely fresh scrape** (e.g., after you've cleaned your local JSON files), click the **CLEAR CACHE & RESTART** button that appears at the top left.

> [!TIP]
> **Anti-Detection Logic**: The scraper is "Mega-Robust"—it will automatically refresh the feed, click "Retry" buttons, and take random "Rest" breaks to keep your account safe.

---

## 📊 Phase 2: Data Comparison
Use this to find out who doesn't follow you back.

### Option A: IG Studio Web App (Recommended)
1. Open your custom dashboard: **[ig-studio-six.vercel.app](https://ig-studio-six.vercel.app/)**
2. Upload your `instagram_followers.json` and `instagram_following.json` files.
3. Click **RUN INITIAL ANALYSIS** to see your stats and the list of non-followers.

### Option B: Interactive Dashboard (Local)
1. Open [compare_dashboard.html](file:///c:/Users/max/.gemini/antigravity/scratch/instagram-scraper/compare_dashboard.html) in any browser.
2. Select your JSON files and click **RUN ANALYSIS**.

### Option C: Python CLI (Quick Text Report)
1. Open your terminal in this folder.
2. Run: `python compare_users.py`
3. Check [comparison_results.txt](file:///c:/Users/max/.gemini/antigravity/scratch/instagram-scraper/comparison_results.txt) for the list.

---

## 🤖 Phase 3: Automated Cleanup
If you have a long list of people to unfollow, use the **Automation Assistant** to handle the heavy lifting safely.

### 1. Set up Tampermonkey
- **Install Extension**: If you haven't yet, install the **[Tampermonkey](https://www.tampermonkey.net/)** extension for your browser (Chrome, Firefox, or Edge).
- **CRITICAL**: If you are using a Chromium-based browser (like Chrome, Edge, or Comet), you **must** enable **"Developer mode"** in your browser's extension settings (`chrome://extensions/`) for the script to work.
- **Create Script**: Click the Tampermonkey icon in your browser toolbar and select **"Create a new script..."**.
- **Paste & Save**: 
    1. Delete **all** existing code in the editor.
    2. Click **Copy Personalized Userscript** on your IG Studio dashboard.
    3. Paste it into the Tampermonkey editor.
    4. Go to **File > Save** (or press `Ctrl + S`).

### 2. Run the Module
- **Open Instagram**: Visit [Instagram.com](https://www.instagram.com).
- **Find the Control Panel**: A floating **"IG-STUDIO"** or **"IG UNFOLLOW HELPER"** panel will appear in the **bottom-right corner**.
- **Start**: Click **START MODULE**. 
    - The script will now navigate to each profile automatically.
    - It will wait **30–300 seconds** between each action to keep your account safe.
- **Stop/Reset**: You can pause the module or reset the progress (to start from the top of the list) using the buttons on the floating panel.

---

## 🧹 Phase 4: Manual Sync & Maintenance
Use this when you've unfollowed users and want your local JSON files to stay accurate without re-scraping everything.

### 1. Get your Deleted List
- While running the **Automation Assistant** on Instagram, click the **Download Deleted List** button on the floating panel.
- This will save a `deleted_users.json` file to your computer.

### 2. Sync with local data
1. Open [following_deleted.json](file:///c:/Users/max/.gemini/antigravity/scratch/instagram-scraper/following_deleted.json).
2. Paste the contents of your downloaded `deleted_users.json` into this file.
3. Run the sync command in your terminal:
   ```powershell
   python sync_deleted.py
   ```
4. Your `instagram_following.json` will be updated, and the deleted list will be cleared.

---

## ⚠️ Safety & Limits

> [!IMPORTANT]
> **Action Limits**: Avoid unfollowing more than 50-100 accounts per day to avoid triggering Instagram's spam filters.
> 
> **Wait Periods**: If you see "No new users found" for a long time, Instagram might be throttling your connection. Close the browser and wait 24 hours.
