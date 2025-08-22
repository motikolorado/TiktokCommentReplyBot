"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserLauncher = BrowserLauncher;
const puppeteerStealth_1 = require("./puppeteerStealth");
__exportStar(require("puppeteer"), exports);
async function BrowserLauncher(profile, headless, options = {}) {
    const browser = await puppeteerStealth_1.puppeteer.launch({
        headless: headless,
        executablePath: profile.chromePath,
        userDataDir: profile.userDataDir,
        defaultViewport: null,
        ...options,
    });
    return browser;
}
