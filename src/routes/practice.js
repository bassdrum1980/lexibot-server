import { Router } from 'express';
import {
  getPractice,
  postPractice,
} from '../controllers/practice.js';
import {
  getPracticeValidator,
  postPracticeValidator,
} from '../validators/practice.js';
import { runValidation } from '../validators/index.js';

const practicesRouter = Router();

practicesRouter.get('/:practiceType', getPracticeValidator, runValidation, getPractice);
practicesRouter.post('/:practiceType', postPracticeValidator, runValidation, postPractice);

export default practicesRouter;
