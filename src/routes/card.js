import { Router } from 'express';
import {
  createCard,
  getCard,
  updateCard,
  deleteCard,
} from '../controllers/card.js';
import { createCardValidator } from '../validators/card.js';
import { runValidation } from '../validators/index.js';

const cardsRouter = Router();

cardsRouter.post('/', createCardValidator, runValidation, createCard);
cardsRouter.get('/:id', getCard);
cardsRouter.patch('/:id', runValidation, updateCard);
cardsRouter.delete('/:id', deleteCard);

export default cardsRouter;
