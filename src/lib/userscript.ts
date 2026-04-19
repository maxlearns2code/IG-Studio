import { AnalysisResults } from "./analyzer";

export const generateUserscript = (results: AnalysisResults | null) => {
  if (!results) return "";
  const targets = JSON.stringify(results.nonFollowers);
  return `// ==UserScript==
// @name         IG-Studio Safe Unfollower
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automates unfollowing non-reciprocal accounts with safe random delays (60-360s).
// @author       IG-Studio
// @match        https://*.instagram.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const TARGETS = ${targets};
    const MIN_DELAY = 60;
    const MAX_DELAY = 360;
    const STORAGE_INDEX_KEY = 'ig_studio_unfollow_index';
    const STORAGE_ACTIVE_KEY = 'ig_studio_is_active';

    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    async function findButtonByText(text) {
        const buttons = Array.from(document.querySelectorAll('button, div[role="button"]'));
        return buttons.find(b => b.innerText.toLowerCase().trim() === text.toLowerCase());
    }

    async function processCurrentPage() {
        const isActive = localStorage.getItem(STORAGE_ACTIVE_KEY) === 'true';
        if (!isActive) return;

        let index = parseInt(localStorage.getItem(STORAGE_INDEX_KEY) || '0');
        if (index >= TARGETS.length) {
            localStorage.setItem(STORAGE_ACTIVE_KEY, 'false');
            alert("IG-Studio: Unfollow task complete!");
            return;
        }

        const currentTarget = TARGETS[index];
        const currentPath = window.location.pathname.replace(/\//g, '');

        if (currentPath === currentTarget) {
            console.log("[IG-Studio] Target: @" + currentTarget);
            await sleep(randomInt(3000, 6000));
            const followingBtn = await findButtonByText('Following');
            if (followingBtn) {
                followingBtn.click();
                await sleep(randomInt(1500, 3000));
                const confirmBtn = await findButtonByText('Unfollow');
                if (confirmBtn) {
                    confirmBtn.click();
                    await sleep(randomInt(2000, 4000));
                }
            }
            index++;
            localStorage.setItem(STORAGE_INDEX_KEY, index.toString());
            const delay = randomInt(MIN_DELAY, MAX_DELAY);
            console.log("[IG-Studio] Success. Sleep " + delay + "s before next.");
            await sleep(delay * 1000);
            if (index < TARGETS.length) window.location.href = 'https://www.instagram.com/' + TARGETS[index] + '/';
        } else {
            console.log("[IG-Studio] Navigating to: @" + currentTarget);
            window.location.href = 'https://www.instagram.com/' + currentTarget + '/';
        }
    }

    function injectUI() {
        if (document.getElementById('studio-panel')) return;
        const panel = document.createElement('div');
        panel.id = 'studio-panel';
        panel.style.cssText = "position: fixed; bottom: 20px; right: 20px; z-index: 10000; background: #0f172a; color: #fff; padding: 15px; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.8); font-family: sans-serif; border: 1px solid rgba(255,255,255,0.1); width: 200px;";
        const active = localStorage.getItem(STORAGE_ACTIVE_KEY) === 'true';
        const idx = localStorage.getItem(STORAGE_INDEX_KEY) || '0';
        panel.innerHTML = '<div style="font-weight:bold;margin-bottom:8px;color:#e1306c">IG-STUDIO</div>' +
                          '<div style="font-size:11px;color:#cbd5e1;margin-bottom:12px">Targeting '+TARGETS.length+' users</div>' +
                          '<div style="font-size:13px;margin-bottom:10px">Progress: <b>'+idx+'</b> / '+TARGETS.length+'</div>' +
                          '<div style="display:flex;flex-direction:column;gap:5px">' +
                          '<button id="startStop" style="background:'+(active?'#ef4444':'#10b981')+';color:white;border:none;padding:8px;border-radius:6px;cursor:pointer;font-weight:600">'+(active?'STOP':'START MODULE')+'</button>' +
                          '<button id="resetBtn" style="background:rgba(255,255,255,0.1);color:white;border:none;padding:8px;border-radius:6px;cursor:pointer;font-size:11px">Reset progress</button>' +
                          '</div>';
        document.body.appendChild(panel);
        document.getElementById('startStop').onclick = () => { localStorage.setItem(STORAGE_ACTIVE_KEY, !active); window.location.reload(); };
        document.getElementById('resetBtn').onclick = () => { if(confirm("Reset to #0?")) { localStorage.setItem(STORAGE_INDEX_KEY, '0'); window.location.reload(); } };
    }

    setTimeout(() => { injectUI(); processCurrentPage(); }, 4000);
})();`;
};
