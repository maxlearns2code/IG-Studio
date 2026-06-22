(async () => {
    console.log("%c[Instagram Scraper] Initializing Mega-Robust Mode...", "color: #e1306c; font-weight: bold;");

    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    async function smoothScroll(element, distance) {
        if (!element) return;
        const steps = randomInt(15, 30);
        const stepSize = distance / steps;
        for (let i = 0; i < steps; i++) {
            element.scrollTop += stepSize + (Math.random() * 10 - 5);
            await sleep(randomInt(100, 350)); 
        }
    }

    function findScrollable() {
        const dialog = document.querySelector('div[role="dialog"]');
        if (!dialog) return null;
        return Array.from(dialog.querySelectorAll('div')).find(div => {
            const style = window.getComputedStyle(div);
            return (style.overflowY === 'auto' || style.overflowY === 'scroll') && div.scrollHeight > div.clientHeight;
        }) || dialog.querySelector('div._aano');
    }

    function detectMode() {
        const path = window.location.pathname.toLowerCase();
        if (path.includes('/followers')) return 'followers';
        if (path.includes('/following')) return 'following';

        const dialog = document.querySelector('div[role="dialog"]');
        if (!dialog) return 'following';
        const titleElement = dialog.querySelector('h1, h2, div[role="presentation"]');
        const text = (titleElement?.innerText || dialog.innerText).toLowerCase();
        
        // Multi-language fallback for followers
        const followerWords = ['followers', 'abonnés', 'seguidores', 'follower', 'abbonati', 'takipçi', 'подписчики', 'متابعون', 'フォロワー', '팔로워', '粉丝'];
        if (followerWords.some(word => text.includes(word))) return 'followers';
        
        return 'following';
    }

    const SCRAPE_MODE = detectMode();
    console.log(`%c[Scraper] Detected Mode: ${SCRAPE_MODE.toUpperCase()}`, "color: #405de6; font-weight: bold;");

    let shouldStop = false;
    function injectControls() {
        const containerId = 'insta-scraper-controls';
        if (document.getElementById(containerId)) return;
        
        const container = document.createElement('div');
        container.id = containerId;
        container.style.cssText = "position: fixed; top: 10px; left: 10px; z-index: 10000; display: flex; gap: 10px; flex-direction: column;";
        
        const stopBtn = document.createElement('button');
        stopBtn.innerHTML = `STOP & SAVE ${SCRAPE_MODE.toUpperCase()}`;
        stopBtn.style.cssText = "padding: 12px 20px; background: #e1306c; color: white; border: none; border-radius: 5px; font-weight: bold; cursor: pointer; box-shadow: 0 2px 10px rgba(0,0,0,0.5);";
        stopBtn.onclick = () => {
            shouldStop = true;
            stopBtn.innerHTML = "Stopping...";
            stopBtn.style.background = "#555";
        };
        
        const clearBtn = document.createElement('button');
        clearBtn.innerHTML = `CLEAR CACHE & RESTART`;
        clearBtn.style.cssText = "padding: 8px 15px; background: #555; color: white; border: none; border-radius: 5px; font-size: 11px; cursor: pointer; opacity: 0.8;";
        clearBtn.onclick = () => {
            if (confirm("This will clear the browser's temporary storage for this scrape and restart the script. Continue?")) {
                localStorage.removeItem(STORAGE_KEY);
                location.reload();
            }
        };
        
        container.appendChild(stopBtn);
        container.appendChild(clearBtn);
        document.body.appendChild(container);
    }

    function parseCount(str) {
        if (!str) return null;
        let cleanStr = str.toLowerCase().trim();
        
        // Find if there is a suffix
        const suffixMatch = cleanStr.match(/(k|m)$/);
        const suffix = suffixMatch ? suffixMatch[1] : null;
        
        if (suffix) {
            cleanStr = cleanStr.replace(/(k|m)$/, '').trim();
            cleanStr = cleanStr.replace(',', '.');
            let num = parseFloat(cleanStr);
            if (isNaN(num)) return null;
            if (suffix === 'k') num *= 1000;
            if (suffix === 'm') num *= 1000000;
            return Math.floor(num);
        } else {
            cleanStr = cleanStr.replace(/[\.,\s]/g, '');
            let num = parseInt(cleanStr, 10);
            return isNaN(num) ? null : num;
        }
    }

    function getTargetFromPage() {
        const mode = SCRAPE_MODE.toLowerCase();
        let maxCount = null;

        // 1. Try to find the target count in the main profile page stats links (highly reliable, clean of list junk)
        const statsLinks = Array.from(document.querySelectorAll(`a[href*="/${mode}"]`));
        for (const link of statsLinks) {
            const text = link.innerText.toLowerCase();
            
            // Filter out mutual/related follower links (e.g. "82 mutual", "82 others")
            const mutualWords = [
                'mutual', 'commun', 'others', 'autres', 'más', 'mais', 'know', 
                'connaissez', 'conoces', 'conhecidos', 'shared', 'partagé', 'ortak', 
                'común', 'comune', 'follow you', 'suivi par', 'suivie par', 'suivis par'
            ];
            if (mutualWords.some(word => text.includes(word))) {
                console.log(`%c[Scraper] Ignoring mutual/related link text: "${link.innerText}"`, "color: #888;");
                continue;
            }
            
            const match = text.match(/([\d,.]+[km]?)/);
            if (match) {
                const count = parseCount(match[1]);
                if (count) {
                    if (maxCount === null || count > maxCount) {
                        maxCount = count;
                    }
                }
            }
        }

        if (maxCount !== null) {
            console.log(`%c[Scraper] Found target count from profile link: ${maxCount}`, "color: #2ecc71; font-weight: bold;");
            return maxCount;
        }

        // 2. Try looking in the dialog header specifically (not the whole dialog text!)
        const dialog = document.querySelector('div[role="dialog"]');
        if (dialog) {
            const header = dialog.querySelector('h1, h2, div[role="presentation"]');
            if (header) {
                const headerText = header.innerText.toLowerCase();
                
                // Only use dialog header count if it doesn't contain mutual/related words
                const mutualWords = [
                    'mutual', 'commun', 'others', 'autres', 'más', 'mais', 'know', 
                    'connaissez', 'conoces', 'conhecidos', 'shared', 'partagé', 'ortak', 
                    'común', 'comune'
                ];
                if (!mutualWords.some(word => headerText.includes(word))) {
                    const match = headerText.match(/([\d,.]+[km]?)/);
                    if (match) {
                        const count = parseCount(match[1]);
                        if (count) {
                            console.log(`%c[Scraper] Found target count from dialog header: ${count}`, "color: #2ecc71; font-weight: bold;");
                            return count;
                        }
                    }
                } else {
                    console.log(`%c[Scraper] Ignoring dialog header because it contains mutual words: "${header.innerText}"`, "color: #888;");
                }
            }
        }

        // 3. Fallback to default
        console.log(`%c[Scraper] Target count not found on page. Using default: 10000`, "color: #e67e22; font-weight: bold;");
        return 10000;
    }

    const STORAGE_KEY = `insta_scraper_${SCRAPE_MODE}`;
    const TARGET_COUNT = getTargetFromPage();
    const userData = new Map();
    injectControls();

    function saveToStorage() {
        const data = Array.from(userData.values());
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        console.log(`%c[Persistence] Saved ${userData.size} users to localStorage.`, "color: #9b59b6;");
    }

    function loadFromStorage() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const data = JSON.parse(stored);
                data.forEach(user => userData.set(user.username, user));
                console.log(`%c[Persistence] Loaded ${userData.size} users from previous session.`, "color: #9b59b6; font-weight: bold;");
                console.log("%c[Persistence] NOTE: If you cleaned your local files and want a fresh start, click 'CLEAR CACHE' or run: localStorage.clear()", "color: #e67e22;");
            } catch (e) {
                console.error("[Persistence] Error loading data:", e);
            }
        } else {
            console.log("%c[Persistence] No previous data found in storage. Starting fresh.", "color: #9b59b6;");
        }
    }

    loadFromStorage();
    let newUsersSinceLastSlowScroll = 0;

    function extractUsername(href) {
        if (!href) return null;
        try {
            const url = new URL(href, window.location.origin);
            const path = url.pathname;
            const parts = path.split('/').filter(Boolean);
            if (parts.length === 1) {
                const username = parts[0];
                const systemPaths = ['explore', 'reels', 'direct', 'stories', 'p', 'tv', 'developer', 'about', 'blog', 'jobs', 'help', 'api', 'privacy', 'terms', 'directory', 'accounts'];
                if (!systemPaths.includes(username)) {
                    return username;
                }
            }
        } catch (e) {
            const cleanPath = href.split('?')[0].split('#')[0];
            const parts = cleanPath.split('/').filter(Boolean);
            if (parts.length === 1) {
                const username = parts[0];
                const systemPaths = ['explore', 'reels', 'direct', 'stories', 'p', 'tv', 'developer', 'about', 'blog', 'jobs', 'help', 'api', 'privacy', 'terms', 'directory', 'accounts'];
                if (!systemPaths.includes(username)) {
                    return username;
                }
            }
        }
        return null;
    }

    function extractVisibleUsers() {
        const scrollable = findScrollable();
        const container = scrollable || document.querySelector('div[role="dialog"]');
        if (!container) return 0;
        
        // Find the boundary of "Suggested" suggestions section to avoid scraping recommended users
        let suggestionsElement = null;
        const allDivs = container.querySelectorAll('div, span, h3');
        for (const el of allDivs) {
            const text = el.innerText;
            if (text && (text === 'Suggested for you' || text === 'Suggested' || text === 'Suggestions')) {
                suggestionsElement = el;
                break;
            }
        }

        const selectors = [
            'a[role="link"]',
            'span > a[href^="/"]',
            'div > a[href^="/"]',
            'div[role="button"] a'
        ];
        
        let addedCount = 0;
        selectors.forEach(selector => {
            const entries = Array.from(container.querySelectorAll(selector));
            entries.forEach(link => {
                // If there's a suggestions section and this link is within/after it, skip it
                if (suggestionsElement && (suggestionsElement.compareDocumentPosition(link) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0) {
                    return;
                }

                const href = link.getAttribute('href');
                if (href) {
                    const username = extractUsername(href);
                    if (username && !userData.has(username)) {
                        userData.set(username, { username, url: `https://www.instagram.com/${username}/` });
                        addedCount++;
                        newUsersSinceLastSlowScroll++;
                    }
                }
            });
        });
        
        if (addedCount > 0) {
            saveToStorage();
        }
        return addedCount;
    }

    let lastCount = 0;
    let noChangeCount = 0;
    let scrollIterations = 0;
    let usersFoundInBatch = 0;
    const MAX_NO_CHANGE = 50;

    async function checkAndClickRetry() {
        const buttons = Array.from(document.querySelectorAll('button[role="button"]'));
        const retryButton = buttons.find(b => {
             const t = b.innerText.toLowerCase();
             return t.includes("retry") || t.includes("reload") || t.includes("try again");
        });
        if (retryButton) {
            console.log("%c[Detection] Retry button found! Clicking and waiting 5s...", "color: #e67e22; font-weight: bold;");
            retryButton.click();
            await sleep(5000);
            return true;
        }
        return false;
    }

    async function deepRecovery(scrollable) {
        console.log("%c[Recovery] Triggering DEEP RECOVERY: Scrolling to top to force refresh...", "color: #e74c3c; font-weight: bold;");
        scrollable.scrollTop = 0;
        await sleep(5000);
        await checkAndClickRetry();
        scrollable.scrollTop = scrollable.scrollHeight;
        await sleep(3000);
        console.log("[Recovery] Deep recovery complete. Resuming scroll...");
    }

    console.log("%c[Scraper] Starting slow, resilient extraction. Patiently waiting for data...", "color: #405de6;");
    extractVisibleUsers();

    try {
        while (noChangeCount < MAX_NO_CHANGE && userData.size < TARGET_COUNT && !shouldStop) {
            scrollIterations++;
            
            const scrollable = findScrollable();
            if (!scrollable) {
                console.warn("[Warning] Dialog or scrollable area lost. Trying to recover in 15s...");
                await sleep(15000);
                continue;
            }

            const dialogText = document.querySelector('div[role="dialog"]')?.innerText || "";
            if (dialogText.includes("Try again later") || dialogText.includes("Couldn't load")) {
                console.error("%c[Block Detected] Throttling active. Taking a 3-minute safety break (reduced from 6m as requested)...", "color: red; font-weight: bold;");
                for (let m = 3; m > 0; m--) {
                    console.log(`[Security] Cooldown: ${m} minutes remaining...`);
                    await sleep(60000);
                }
                await smoothScroll(scrollable, -randomInt(500, 1000));
            }

            if (newUsersSinceLastSlowScroll >= 10) {
                console.log("%c[Human] Found 10+ new users. Performing extra slow scroll and pause to avoid block...", "color: #3498db; font-weight: bold;");
                await smoothScroll(scrollable, randomInt(300, 700));
                await sleep(randomInt(8000, 15000));
                newUsersSinceLastSlowScroll = 0; 
            }

            if (scrollIterations > 1 && scrollIterations % 7 === 0) {
                console.log("%c[Human] Random secondary pause for stealth...", "color: #888;");
                await smoothScroll(scrollable, -randomInt(400, 900));
                await sleep(randomInt(6000, 12000));
            }

            console.log(`[Scraper] Progress: ${userData.size}/${TARGET_COUNT} users. Iteration: ${scrollIterations}.`);
            
            await smoothScroll(scrollable, randomInt(800, 1400));
            
            await sleep(randomInt(10000, 18000));

            await checkAndClickRetry();
            extractVisibleUsers();
            
            const isAtBottom = scrollable.scrollTop + scrollable.clientHeight >= scrollable.scrollHeight - 50;
            
            if (userData.size === lastCount) {
                if (isAtBottom) {
                    noChangeCount++;
                    console.log(`%c[Scraper] No new users found at bottom (${noChangeCount}/${MAX_NO_CHANGE}).`, "color: #666;");
                    
                    // Stop faster if we've been at the bottom for a while and have many users
                    if (noChangeCount > 15 && userData.size > 20) {
                        console.log("%c[Finished] No new users for 15+ iterations at bottom. Finishing...", "color: #fcaf45; font-weight: bold;");
                        shouldStop = true;
                    }

                    if (noChangeCount === 5 || noChangeCount === 12 || noChangeCount === 25 || noChangeCount === 40) {
                        await deepRecovery(scrollable);
                    }
                } else {
                    console.log(`%c[Scraper] No new users in this view, but not at bottom yet. Continuing scroll...`, "color: #888;");
                    noChangeCount = 0; 
                }
                
                // Aggressive kick-start scroll
                if (noChangeCount % 5 === 0) {
                    console.log("%c[Recovery] Performing large kick-start scroll...", "color: #e74c3c;");
                    scrollable.scrollTop -= 1500;
                    await sleep(3000);
                    scrollable.scrollTop += 2000;
                } else {
                    scrollable.scrollTop -= 600;
                    await sleep(1500);
                    scrollable.scrollTop += 1000;
                }
                await sleep(3500);
            } else {
                noChangeCount = 0;
                usersFoundInBatch += (userData.size - lastCount);
                lastCount = userData.size;
                console.log(`%c[Scraper] Added new users. Total: ${userData.size}.`, "color: #28a745;");
            }

            if (scrollIterations % 11 === 0) {
                if (usersFoundInBatch > 0) {
                    const breakSecs = randomInt(60, 180);
                    console.log(`%c[Rest] Taking a mandatory pause for ${Math.floor(breakSecs/60)}m...`, "color: #f39c12; font-weight: bold;");
                    for (let i = breakSecs; i > 0; i -= 20) {
                        if (i <= 0) break;
                        console.log(`[Rest] ${i}s remaining...`);
                        await sleep(20000);
                    }
                    usersFoundInBatch = 0; 
                } else {
                    console.log("%c[Stealth] Skipping mandatory rest as no new users were found in this batch.", "color: #7f8c8d;");
                }
                scrollable.scrollTop -= 100;
                await sleep(1000);
                scrollable.scrollTop += 200;
            }
        }
    } catch (err) {
        console.error("%c[Fatal] Error during loop:", "color: red;", err);
    }

    console.log(`%c[Scraper] Task reached target (${userData.size}/${TARGET_COUNT}) or finished!`, "color: #fcaf45; font-weight: bold;");
    const jsonContent = JSON.stringify(Array.from(userData.values()), null, 2);
    
    // Clear storage on successful completion to start fresh next time if needed
    if (userData.size >= TARGET_COUNT) {
        localStorage.removeItem(STORAGE_KEY);
    }

    try {
        const blob = new Blob([jsonContent], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        a.download = `instagram_${SCRAPE_MODE}_${timestamp}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        console.log(`%c[Scraper] Final ${SCRAPE_MODE} JSON saved successfully.`, "color: green; font-weight: bold;");
    } catch (e) {
        console.log("%c[Scraper] Please copy the JSON from console below.", "color: #e1306c;");
        console.log(jsonContent);
    }
    const controls = document.getElementById('insta-scraper-controls');
    if (controls) controls.remove();
})();



