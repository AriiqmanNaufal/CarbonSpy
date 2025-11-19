import playwright from 'playwright';
import cheerio from 'cheerio';
import logger from '../utils/logger';

interface ScrapedData {
  title: string;
  productName: string;
  description: string;
  price?: string;
  materials: string[];
  packaging: string[];
  logistics: string[];
  images: { src: string | undefined; alt: string | undefined }[];
  rawHtml: string;
}

export const scrapeUrl = async (url: string): Promise<ScrapedData> => {
  let browser;
  try {
    browser = await playwright.chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    });
    const page = await context.newPage();

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

    await page.evaluate(async () => {
      await new Promise<void>((resolve) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });

    const html = await page.content();
    const $ = cheerio.load(html);

    const title = $('title').text();

    // Enhanced product name extraction
    const productName =
      $('meta[property="og:title"]').attr('content') ||
      $('h1').first().text().trim() ||
      $('.product-title').first().text().trim() ||
      $('#product-name').first().text().trim();

    // Enhanced description extraction
    const description =
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      $('.product-description').first().text().trim() ||
      $('#description').first().text().trim();

    const images = $('img').map((i, el) => ({
      src: $(el).attr('src'),
      alt: $(el).attr('alt'),
    })).get();

    const bodyText = $('body').text();
    const materials = (bodyText.match(/materials?:\s*([^\n\r.]+)/gi) || []).map(m => m.split(':')[1].trim());
    const packaging = (bodyText.match(/packaging:\s*([^\n\r.]+)/gi) || []).map(p => p.split(':')[1].trim());
    const logistics = (bodyText.match(/(shipping|delivery|ships from):\s*([^\n\r.]+)/gi) || []).map(l => l.split(':')[1].trim());

    logger.info(`Scraping successful for URL: ${url}`);

    return {
      title,
      productName,
      description,
      images,
      materials,
      packaging,
      logistics,
      rawHtml: html,
    };
  } catch (error) {
    logger.error(`Error scraping URL ${url}:`, error);
    throw new Error(`Failed to scrape URL: ${url}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
