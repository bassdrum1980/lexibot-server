import { Router } from 'express';
import { validateJwt } from '../middlewares/auth.js';
import { readUser, updateUser } from '../controllers/user.js';

const userRouter = Router();

userRouter.get(
  '/user',
  validateJwt,
  (err, req, res, next) => {
    console.log('Error: ', err);
    if (err.name === 'UnauthorizedError') {
      res.status(401).json({
        erorr: 'Invalid token',
      });
    } else {
      next(err);
    }
  },
  readUser
);
//userRouter.patch('/user/update', validateJwt, updateUser);

export default userRouter;
