"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChromeProfile = getChromeProfile;
function getChromeProfile(profileName) {
    const platform = process.platform;
    const username = process.env.USER || process.env.USERNAME || 'unknown';
    if (platform === 'win32') {
        return {
            chromePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            userDataDir: `C:\\Users\\${username}\\AppData\\Local\\Google\\Chrome\\User Data\\${profileName}`
        };
    }
    if (platform === 'darwin') {
        return {
            chromePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
            userDataDir: `/Users/${username}/Library/Application Support/Google/Chrome/${profileName}`
        };
    }
    throw new Error('Unsupported platform');
}
