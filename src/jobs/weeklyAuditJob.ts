import { Job, Worker, Queue } from 'bullmq';
import redisClient from '../config/redis';
import User from '../models/User';
import Scan from '../models/Scan';
import logger from '../utils/logger';
import { scrapeQueue } from './scrapeJob';

const queueName = 'weekly-audit-queue';

export const weeklyAuditQueue = new Queue(queueName, {
  connection: redisClient,
});

// Repeatable job to run every week
export const scheduleWeeklyAudits = async () => {
  await weeklyAuditQueue.add(
    'weekly-audit',
    {},
    {
      repeat: {
        // Every Sunday at midnight
        cron: '0 0 * * 0',
      },
      jobId: 'weekly-audit-job', // Static job ID to prevent duplicates
    }
  );
  logger.info('Weekly audit job scheduled.');
};


const worker = new Worker(
  queueName,
  async (job: Job) => {
    logger.info('Starting weekly audit job...');

    // Reset credits for free users
    try {
      await User.updateMany({ plan: 'free' }, { $set: { weeklyCredits: 1 } });
      logger.info('Reset weekly credits for all free users.');
    } catch (error) {
      logger.error('Error resetting weekly credits:', error);
    }

    // Find all pro users
    const proUsers = await User.find({ plan: 'pro' });
    logger.info(`Found ${proUsers.length} pro users to audit.`);

    for (const user of proUsers) {
      try {
        // Find the most recent scan for the user
        const lastScan = await Scan.findOne({ user: user.id }).sort({ createdAt: -1 });

        if (lastScan) {
          logger.info(`Queueing re-scan for user ${user.email} and URL ${lastScan.url}`);

          // Create a new scan record
          const newScan = new Scan({
            user: user.id,
            url: lastScan.url,
            status: 'pending',
            jobId: '', // Will be set after job is added
          });

          // Add a new job to the main scrape queue
          const newJob = await scrapeQueue.add('scrape', { url: lastScan.url, scanId: newScan.id });
          newScan.jobId = newJob.id as string;
          await newScan.save();

        } else {
          logger.warn(`User ${user.email} is a pro user but has no previous scans to audit.`);
        }
      } catch (error) {
        logger.error(`Failed to queue audit for user ${user.email}:`, error);
      }
    }
    logger.info('Weekly audit job finished.');
  },
  { connection: redisClient }
);

worker.on('failed', (job, err) => {
    if (job)
  logger.error(`Weekly audit job ${job.id} failed with error: ${err.message}`);
});
