import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import './config/db.js';

import authRoutes from './routes/auth.routes.js';
import projectRoutes from './routes/project.routes.js';
import errorHandler from './middlewares/errorHandler.js';
import emailRoutes from './routes/email.routes.js';
import contactRoutes from './routes/contact.routes.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

app.use('/emails', emailRoutes);
app.use('/api/contact', contactRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
