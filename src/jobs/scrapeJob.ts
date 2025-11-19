import { Job, Worker } from 'bullmq';
import redisClient from '../config/redis';
import { scrapeUrl } from '../services/scrapeService';
import { analyzeProduct } from '../services/aiService';
import Scan from '../models/Scan';
import ProductAnalysis from '../models/ProductAnalysis';
import logger from '../utils/logger';
import {_} from 'cheerio';


const queueName = 'scrape-queue';

export const scrapeQueue = new (require('bullmq').Queue)(queueName, {
  connection: redisClient,
});

const worker = new Worker(
  queueName,
  async (job: Job) => {
    const { url, scanId } = job.data;
    logger.info(`Processing job ${job.id} for URL: ${url}`);

    try {
      await Scan.findByIdAndUpdate(scanId, { status: 'processing' });

      const scrapedData = await scrapeUrl(url);
      const scan = await Scan.findById(scanId);
      if(scan){
        scan.rawData = scrapedData.rawHtml;
        const textMap = new Map<string, string>();
        textMap.set('title', scrapedData.title);
        textMap.set('productName', scrapedData.productName ?? '');
        textMap.set('description', scrapedData.description ?? '');
        scan.extractedText = textMap;
        await scan.save();
      }

      const analysisResult = await analyzeProduct({
        name: scrapedData.productName,
        description: scrapedData.description,
        materials: scrapedData.materials,
        packaging: scrapedData.packaging,
        logistics: scrapedData.logistics,
      });

      const productAnalysis = new ProductAnalysis({
        scan: scanId,
        ...analysisResult,
      });
      await productAnalysis.save();

      await Scan.findByIdAndUpdate(scanId, { status: 'completed' });
      logger.info(`Job ${job.id} completed successfully`);
    } catch (error) {
      logger.error(`Job ${job.id} failed:`, error);
      await Scan.findByIdAndUpdate(scanId, { status: 'failed' });
      throw error;
    }
  },
  { connection: redisClient }
);

worker.on('failed', (job, err) => {
    if(job)
  logger.error(`Job ${job.id} failed with error: ${err.message}`);
});
