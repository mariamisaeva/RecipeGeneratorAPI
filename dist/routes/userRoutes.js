"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../utils/authMiddleware");
const userRouter = express_1.default.Router();
userRouter.post('/register', userController_1.registerUser);
userRouter.post('/login', userController_1.loginUser);
userRouter.get('/profile', authMiddleware_1.authenticateUser, userController_1.getCurrentUser);
userRouter.get('/user/:userId', authMiddleware_1.authenticateUser, userController_1.getUserRecipes);
exports.default = userRouter;
