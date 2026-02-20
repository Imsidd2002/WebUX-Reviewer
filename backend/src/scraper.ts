import { chromium } from 'playwright';

export const scrapeWebsite = async (url: string) => {
    let browser;
    try {
        browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();

        // Validate URL primarily
        try {
            new URL(url);
        } catch (e) {
            throw new Error('Invalid URL format');
        }

        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

        const title = await page.title();

        // Extract Headings
        const headings = await page.$$eval('h1, h2, h3', (elements: any[]) =>
            elements.map((el: any) => el.textContent?.trim()).filter((t: any) => t && t.length > 0).slice(0, 10)
        );

        // Extract Buttons/Links
        const buttons = await page.$$eval('button, a, input[type="submit"], input[type="button"]', (elements: any[]) =>
            elements.map((el: any) => el.textContent?.trim() || (el as HTMLInputElement).value).filter((t: any) => t && t.length > 0).slice(0, 15)
        );

        // Extract Inputs
        const inputs = await page.$$eval('input:not([type="hidden"]), textarea, select', (elements: any[]) =>
            elements.map((el: any) => (el as HTMLInputElement).placeholder || (el as HTMLInputElement).name || 'Unnamed Input').slice(0, 10)
        );

        // Main Text
        const mainText = await page.$$eval('body', (el: any[]) => el[0].innerText.replace(/\s+/g, ' ').trim());

        return {
            title,
            headings,
            buttons,
            inputs,
            mainText
        };

    } catch (error) {
        console.error('Scraping Error:', error);
        throw new Error('Failed to scrape website. Ensure URL is reachable.');
    } finally {
        if (browser) await browser.close();
    }
};
