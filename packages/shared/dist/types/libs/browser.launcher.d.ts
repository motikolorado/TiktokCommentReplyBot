import { Browser } from "puppeteer";
import { ChromeProfile } from "./chromeProfile";
export * from 'puppeteer';
export declare function BrowserLauncher(profile: ChromeProfile, headless: boolean, options?: {}): Promise<Browser>;
