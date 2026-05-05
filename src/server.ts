import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import './config/db.ts';

import authRoutes from './routes/auth.routes.ts';
import errorHandler from './middlewares/errorHandler.ts';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/auth', authRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
