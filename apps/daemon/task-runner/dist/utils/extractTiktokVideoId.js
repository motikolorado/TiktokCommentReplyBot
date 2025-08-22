"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTikTokVideoId = extractTikTokVideoId;
function extractTikTokVideoId(url) {
    try {
        const u = new URL(url);
        // Case 1: Normal TikTok link: /@user/video/1234567890
        let match = u.pathname.match(/\/video\/(\d+)/);
        if (match)
            return match[1];
        // Case 2: Mobile style link: /v/1234567890.html
        match = u.pathname.match(/\/v\/(\d+)\.html/);
        if (match)
            return match[1];
        // Case 3: Short link (vm.tiktok.com / vt.tiktok.com) → use short code
        if (u.hostname.startsWith("vm.tiktok.com") || u.hostname.startsWith("vt.tiktok.com")) {
            // Trim slashes
            const shortCode = u.pathname.replace(/\//g, "");
            return shortCode || null;
        }
        return null;
    }
    catch {
        return null;
    }
}
//# sourceMappingURL=extractTiktokVideoId.js.map