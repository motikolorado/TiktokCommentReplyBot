import { ElementHandle, Page } from "puppeteer";
/**
 * Waits for new items to appear in an infinite scroll feed
 * @param {import('puppeteer').Page} page - Puppeteer page object
 * @param {string} selector - CSS selector for each feed item
 * @param {number} timeout - Max time to wait (ms)
 * @returns {Promise<ElementHandle[]>} - Array of new element handles
 */
export declare function waitForNewItems(page: Page, selector: string, timeout?: number): Promise<ElementHandle[]>;
