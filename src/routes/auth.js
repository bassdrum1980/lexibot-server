import { Router } from 'express';
import { signUp } from '../controllers/auth.js';
import { userSignupValidator } from '../validators/auth.js';
import { runValidation } from '../validators/index.js';

const authRouter = Router();

authRouter.post('/signup', userSignupValidator, runValidation, signUp);

export default authRouter;
