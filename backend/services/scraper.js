// backend/services/scraperService.js
import axios from "axios";
import * as cheerio from "cheerio";

export async function scrapePage(url) {
  const { data } = await axios.get(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  const $ = cheerio.load(data);

  const title = $("h1").first().text().trim() || $("title").text().trim() || "Unnamed product";

  const selectors = [
    ".description",
    ".product-description",
    "#description",
    ".product-details",
    "meta[name='description']"
  ];

  let description = "";
  for (const sel of selectors) {
    const el = $(sel);
    if (el && el.length) {
      description = el.attr("content") || el.text();
      if (description && description.trim().length > 10) break;
    }
  }

  if (!description || description.trim().length < 10) {
    description = $("body").text().replace(/\s+/g, " ").trim().slice(0, 2000);
  }

  return { title, description };
}
