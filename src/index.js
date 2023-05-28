import 'dotenv/config.js';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import authRouter from './routes/auth.js';
import profileRouter from './routes/profile.js';
import freeDictionaryRouter from './routes/freedictionary.js';
import cardRouter from './routes/card.js';
import { protect } from './middlewares/auth.js';
import getLogger from './utils/logger.js';

const app = express();
const port = process.env.PORT || 8000;
const logger = getLogger();

// db connection
mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log('DB connected'))
  .catch((err) => console.log('DB CONNECTION ERROR: ' + err));

// app middlewares
app.use(morgan('dev'));
if ((process.env.NODE_ENV = 'development')) {
  app.use(cors({ origin: 'http://localhost:3000' }));
}
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Public routes
app.use('/auth', authRouter);

// Protected routes
app.use('/profile', protect, profileRouter);
app.use('/freedictionary', protect, freeDictionaryRouter);
app.use('/cards', protect, cardRouter);

app.listen(port, () => {
  logger.info(`[index] app start, listening port ${port} - ${process.env.NODE_ENV}`);
});
