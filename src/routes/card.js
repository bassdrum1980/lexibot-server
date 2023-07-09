import { Router } from 'express';
import {
  createCard,
  getCard,
  updateCard,
  deleteCard,
  getCards,
} from '../controllers/card.js';
import { createCardValidator } from '../validators/card.js';
import { runValidation } from '../validators/index.js';

const cardsRouter = Router();

cardsRouter.post('/', createCardValidator, runValidation, createCard);
cardsRouter.get('/:id', getCard);
cardsRouter.patch('/:id', runValidation, updateCard);
cardsRouter.delete('/:id', deleteCard);
cardsRouter.get('/', getCards);

export default cardsRouter;
