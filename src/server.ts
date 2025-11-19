import app from './app';
import http from 'http';
import connectDB from './config/db';
import { scheduleWeeklyAudits } from './jobs/weeklyAuditJob';

connectDB();
scheduleWeeklyAudits();

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err: Error) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});
