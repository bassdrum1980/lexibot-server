import { Router } from 'express';
import { postCard, getCard } from '../controllers/card.js';

const cardRouter = Router();

cardRouter.post('/', postCard);
cardRouter.get('/:id', getCard);

export default cardRouter;
