import express from 'express';
import {
  registerUser,
  loginUser,
  getCurretUser,
} from '../controllers/userController';
import { authenticateUser } from '../utils/authMiddleware';

const userRouter = express.Router();
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/profile', authenticateUser, getCurretUser);

export default userRouter;
