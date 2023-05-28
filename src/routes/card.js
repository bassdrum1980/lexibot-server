import { Router } from 'express';
import { createCard, getCard, updateCard, deleteCard } from '../controllers/card.js';

const cardRouter = Router();

cardRouter.post('/', createCard);
cardRouter.get('/:id', getCard);
cardRouter.put('/:id', updateCard);
cardRouter.delete('/:id', deleteCard);

export default cardRouter;
