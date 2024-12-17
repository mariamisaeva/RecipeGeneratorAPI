import express from 'express';
import {
  registerUser,
  loginUser,
  getCurrentUser,
} from '../controllers/userController';
import { authenticateUser } from '../utils/authMiddleware';

const userRouter = express.Router();
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/profile', authenticateUser, getCurrentUser);

export default userRouter;
