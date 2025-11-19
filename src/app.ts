import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import authRoutes from './routes/authRoutes';
import scrapeRoutes from './routes/scrapeRoutes';
import analysisRoutes from './routes/analysisRoutes';
import billingRoutes from './routes/billingRoutes';

dotenv.config();

import limiter from './utils/rateLimit';

const app: Application = express();

app.use(express.json());

app.use(limiter);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req: Request, res: Response) => {
  res.send('Server is running!');
});

app.use('/auth', authRoutes);
app.use('/scrape', scrapeRoutes);
app.use('/analysis', analysisRoutes);
app.use('/billing', billingRoutes);

export default app;
