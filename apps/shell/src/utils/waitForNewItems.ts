import { ElementHandle, Page } from "puppeteer";

/**
 * Waits for new items to appear in an infinite scroll feed
 * @param {import('puppeteer').Page} page - Puppeteer page object
 * @param {string} selector - CSS selector for each feed item
 * @param {number} timeout - Max time to wait (ms)
 * @returns {Promise<ElementHandle[]>} - Array of new element handles
 */
export async function waitForNewItems(page: Page, selector: string, timeout = 10000): Promise<ElementHandle[]> {
    const previousCount = await page.$$eval(selector, els => els.length);

    return new Promise(async (resolve, reject) => {
        try {
            const newItems = await page.waitForFunction(
                (selector, previousCount) => {
                    const items = document.querySelectorAll(selector);
                    return items.length > previousCount ? Array.from(items) : false;
                },
                { timeout },
                selector,
                previousCount
            );

            // Return handles to new elements
            const allItems = await page.$$(selector);
            const newHandles = allItems.slice(previousCount);
            resolve(newHandles);
        } catch (err) {
            reject(new Error(`No new items appeared within ${timeout}ms`));
        }
    });
}
