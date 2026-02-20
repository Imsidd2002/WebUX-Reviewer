import axios from 'axios';
import * as cheerio from 'cheerio';

export const scrapeWebsite = async (url: string) => {
    try {
        // Validate URL
        try {
            new URL(url);
        } catch (e) {
            throw new Error('Invalid URL format');
        }

        // Fetch HTML with axios
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            timeout: 10000
        });

        const html = response.data;
        const $ = cheerio.load(html);

        // Extract Title
        const title = $('title').text().trim() || 'No title';

        // Extract Headings
        const headings: string[] = [];
        $('h1, h2, h3').each((_, el) => {
            const text = $(el).text().trim();
            if (text) headings.push(text);
        });

        // Extract Buttons/Links
        const buttons: string[] = [];
        $('button, a, input[type="submit"], input[type="button"]').each((_, el) => {
            const text = $(el).text().trim() || $(el).attr('value')?.trim();
            if (text) buttons.push(text);
        });

        // Extract Inputs
        const inputs: string[] = [];
        $('input:not([type="hidden"]), textarea, select').each((_, el) => {
            const label = $(el).attr('placeholder') || $(el).attr('name') || 'Unnamed Input';
            inputs.push(label);
        });

        // Main Text (Cleaned up)
        $('script, style, nav, footer').remove();
        const mainText = $('body').text()
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 5000); // Limit length for LLM

        return {
            title,
            headings: headings.slice(0, 10),
            buttons: buttons.slice(0, 15),
            inputs: inputs.slice(0, 10),
            mainText
        };

    } catch (error: any) {
        console.error('Scraping Error:', error.message);
        throw new Error('Failed to scrape website. Ensure URL is reachable.');
    }
};
