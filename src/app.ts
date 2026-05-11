import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import projectRoutes from './routes/project.routes.js';
import emailRoutes from './routes/email.routes.js';
import contactRoutes from './routes/contact.routes.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

const allowedOrigins = (process.env.CORS_ORIGINS ?? 'http://localhost:5173')
  .split(',')
  .map(o => o.trim());

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.get('/health', (_req, res) => { res.json({ status: 'ok' }); });

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/emails', emailRoutes);
app.use('/api/contact', contactRoutes);

app.use(errorHandler);

export default app;
