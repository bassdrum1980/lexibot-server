import express from 'express';
import authRouter from './routes/auth.js';

const app = express();
const port = process.env.port || 8000;

app.use('/api', authRouter);

app.listen(port, () => {
  console.log(`listening port ${port}...`);
});
