import { Router } from 'express';
import { getUser, updateUser } from '../controllers/user.js';

const profileRouter = Router();

profileRouter.get('/', getUser);
//userRouter.patch('/user/update', updateUser);

export default profileRouter;
