import { Router } from 'express';
import { getFreeDictionary } from '../controllers/freedictionary.js';

const freeDictionaryRouter = Router();

freeDictionaryRouter.get('/:word', getFreeDictionary);

export default freeDictionaryRouter;
