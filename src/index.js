import 'dotenv/config.js';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRouter from './routes/auth.js';
import profileRouter from './routes/profile.js';
import freeDictionaryRouter from './routes/freedictionary.js';
import cardsRouter from './routes/card.js';
import practicesRouter from './routes/practice.js';
import { protect } from './middlewares/auth.js';
import { getLogger } from './utils/logger.js';

const app = express();
const port = process.env.PORT || 8000;
const logger = getLogger();

// app middlewares
app.use(morgan('dev'));
if ((process.env.NODE_ENV = 'development')) {
  app.use(cors({ origin: 'http://localhost:7001' }));
}
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Public routes
app.use('/auth', authRouter);

// Protected routes
app.use('/profile', protect, profileRouter);
app.use('/freedictionary', protect, freeDictionaryRouter);
app.use('/cards', protect, cardsRouter);
app.use('/practices', protect, practicesRouter);

const server = app.listen(port, () => {
  logger.info(
    `[index] app start, listening port ${port} - ${process.env.NODE_ENV}`
  );
});

export { app, server };
