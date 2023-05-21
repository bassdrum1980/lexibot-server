import { Router } from 'express';
import { postCard, getCard, updateCard, deleteCard } from '../controllers/card.js';

const cardRouter = Router();

cardRouter.post('/', postCard);
cardRouter.get('/:id', getCard);
cardRouter.post('/:id', updateCard);
cardRouter.delete('/:id', deleteCard);

export default cardRouter;
