import { Router } from 'express';
import {
  getPractice,
} from '../controllers/practice.js';
import { getPracticeValidator } from '../validators/practice.js';
import { runValidation } from '../validators/index.js';

const practicesRouter = Router();

practicesRouter.get('/:practiceType', getPracticeValidator, runValidation, getPractice);

export default practicesRouter;
