import { Router } from 'express';
import { createCard, getCard, updateCard, deleteCard } from '../controllers/card.js';
import { createCardValidator, updateCardValidator } from '../validators/card.js';
import { runValidation } from '../validators/index.js';

const cardRouter = Router();

cardRouter.post('/', createCardValidator, runValidation, createCard);
cardRouter.get('/:id', getCard);
cardRouter.patch('/:id', updateCardValidator, runValidation, updateCard);
cardRouter.delete('/:id', deleteCard);

export default cardRouter;
