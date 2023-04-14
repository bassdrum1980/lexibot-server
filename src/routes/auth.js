import { Router } from 'express';
import { signIn, signUp, activateAccount } from '../controllers/auth.js';
import {
  userSignupValidator,
  userSignInValidator,
} from '../validators/auth.js';
import { runValidation } from '../validators/index.js';

const authRouter = Router();

authRouter.post('/signup', userSignupValidator, runValidation, signUp);
authRouter.post('/signin', userSignInValidator, runValidation, signIn);
authRouter.post('/activate', activateAccount);

export default authRouter;
