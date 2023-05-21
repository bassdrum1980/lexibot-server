import { Router } from 'express';
import { postCard } from '../controllers/card.js';

const cardRouter = Router();

cardRouter.post('/', postCard);

export default cardRouter;
