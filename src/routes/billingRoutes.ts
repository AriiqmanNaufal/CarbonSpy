import { Router } from 'express';
import * as billingController from '../controllers/billingController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Billing
 *   description: Billing and plan management
 */

/**
 * @swagger
 * /billing/usage:
 *   get:
 *     summary: Get the current user's usage
 *     tags: [Billing]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: User usage
 *       '401':
 *         description: Unauthorized
 */
router.get('/usage', authMiddleware, billingController.getUsage);

/**
 * @swagger
 * /billing/update-plan:
 *   post:
 *     summary: Update the current user's plan
 *     tags: [Billing]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - plan
 *             properties:
 *               plan:
 *                 type: string
 *                 enum: [free, pro]
 *     responses:
 *       '200':
 *         description: Plan updated successfully
 *       '400':
 *         description: Invalid plan
 *       '401':
 *         description: Unauthorized
 */
router.post('/update-plan', authMiddleware, billingController.updatePlan);

export default router;
