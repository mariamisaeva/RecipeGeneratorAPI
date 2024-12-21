import express from 'express';
import {
  registerUser,
  loginUser,
  getCurrentUser,
  getUserRecipes,
} from '../controllers/userController';
import { authenticateUser } from '../utils/authMiddleware';

const userRouter = express.Router();
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/profile', authenticateUser, getCurrentUser);
userRouter.get('/user/:userId', authenticateUser, getUserRecipes);

export default userRouter;
