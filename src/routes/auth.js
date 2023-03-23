import { Router } from 'express';
import { signUp } from '../controllers/auth.js';

const authRouter = Router();

authRouter.get('/signup', signUp);

export default authRouter;
