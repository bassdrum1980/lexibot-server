import { Router } from 'express';
import { postCard, getCard, updateCard } from '../controllers/card.js';

const cardRouter = Router();

cardRouter.post('/', postCard);
cardRouter.get('/:id', getCard);
cardRouter.post('/:id', updateCard);

export default cardRouter;
