import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import authRouter from './routes/auth.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// app middlewares
app.use(morgan('dev'));
if ((process.env.NODE_ENV = 'development')) {
  app.use(cors({ origin: 'http://localhost:3000' }));
}
app.use(bodyParser.json());

// route middlewares
app.use('/api', authRouter);

app.listen(port, () => {
  console.log(`listening port ${port} - ${process.env.NODE_ENV}`);
});
