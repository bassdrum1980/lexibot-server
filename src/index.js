import 'dotenv/config.js';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRouter from './routes/auth.js';
import profileRouter from './routes/profile.js';
import freeDictionaryRouter from './routes/freedictionary.js';
import cardRouter from './routes/card.js';
import { protect } from './middlewares/auth.js';

const app = express();
const port = process.env.PORT || 8000;

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
  console.log(`listening port ${port} - ${process.env.NODE_ENV}`);
});
