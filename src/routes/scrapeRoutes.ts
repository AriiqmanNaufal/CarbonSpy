import { Router } from 'express';
import * as scrapeController from '../controllers/scrapeController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { planGuard } from '../middlewares/planGuard';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Scrape
 *   description: Scraping and job management
 */

/**
 * @swagger
 * /scrape/start:
 *   post:
 *     summary: Start a new scrape job
 *     tags: [Scrape]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - url
 *             properties:
 *               url:
 *                 type: string
 *                 format: url
 *     responses:
 *       '202':
 *         description: Scrape job started
 *       '400':
 *         description: Invalid URL
 *       '401':
 *         description: Unauthorized
 *       '429':
 *         description: Rate limit exceeded
 */
router.post('/start', authMiddleware, planGuard, scrapeController.startScan);

/**
 * @swagger
 * /scrape/status/{jobId}:
 *   get:
 *     summary: Get the status of a scrape job
 *     tags: [Scrape]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Job status
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Job not found
 */
router.get('/status/:jobId', authMiddleware, scrapeController.getScanStatus);

export default router;
