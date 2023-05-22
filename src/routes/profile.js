import { Router } from 'express';
import { getUser } from '../controllers/user.js';

const profileRouter = Router();

profileRouter.get('/', getUser);

export default profileRouter;
