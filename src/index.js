import 'dotenv/config.js';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import authRouter from './routes/auth.js';
import freeDictionaryRouter from './routes/freedictionary.js';

const app = express();
const port = process.env.PORT || 8000;

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

// route middlewares
// TODO: protect api routes
// TODO: expose signin and signup routes
app.use('/api', authRouter);
app.use('/freedictionary', freeDictionaryRouter);

app.listen(port, () => {
  console.log(`listening port ${port} - ${process.env.NODE_ENV}`);
});
