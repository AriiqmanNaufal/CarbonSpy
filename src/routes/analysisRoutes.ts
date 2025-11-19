import { Router } from 'express';
import * as analysisController from '../controllers/analysisController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Analysis
 *   description: AI analysis results
 */

/**
 * @swagger
 * /analysis/results/{scanId}:
 *   get:
 *     summary: Get the results of an analysis
 *     tags: [Analysis]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: scanId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       '200':
 *         description: Analysis results
 *       '400':
 *         description: Invalid scan ID
 *       '401':
 *         description: Unauthorized
 */
router.get('/results/:scanId', authMiddleware, analysisController.getAnalysisResults);

export default router;
