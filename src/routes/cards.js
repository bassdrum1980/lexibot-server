import { Router } from 'express';
import {
  createCard,
  getCard,
  updateCard,
  deleteCard,
  getCards,
} from '../controllers/cards.js';
import { createCardValidator, updateCardValidator } from '../validators/card.js';
import { runValidation } from '../validators/index.js';

const cardsRouter = Router();

cardsRouter.post('/', createCardValidator, runValidation, createCard);
cardsRouter.get('/:id', getCard);
cardsRouter.patch('/:id', updateCardValidator, runValidation, updateCard);
cardsRouter.delete('/:id', deleteCard);
cardsRouter.get('/', getCards);

export default cardsRouter;
