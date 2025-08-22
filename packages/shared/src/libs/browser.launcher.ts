import { Browser } from "puppeteer";
import { ChromeProfile } from "./chromeProfile";
import { puppeteer } from "./puppeteerStealth";

export * from 'puppeteer'

export async function BrowserLauncher(
    profile: ChromeProfile,
    headless: boolean,
    options = {}
): Promise<Browser> 
{
    const browser = await puppeteer.launch({
        headless: headless,
        executablePath: profile.chromePath,
        userDataDir: profile.userDataDir,
        defaultViewport: null,
        ...options,
    });

  return browser;
}