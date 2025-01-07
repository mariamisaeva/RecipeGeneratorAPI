"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserRecipes = exports.getCurrentUser = exports.loginUser = exports.registerUser = void 0;
const database_1 = require("../config/database");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const class_validator_1 = require("class-validator");
const User_1 = require("../entities/User");
const filterUserInfo_1 = require("../utils/filterUserInfo");
const Recipe_1 = require("../entities/Recipe");
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    try {
        if (!username || !email || !password) {
            res
                .status(400)
                .json({ success: false, message: 'All fields are required.' });
            return;
        }
        //Grab the repository
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const existingUser = yield userRepository.findOne({
            where: [{ username }, { email }],
        });
        if (existingUser) {
            res.status(409).json({ success: false, message: 'User already exists' });
            return;
        }
        //Create a new user, validation, and hash the password
        const newUser = userRepository.create({
            username,
            email,
            password,
        });
        //Validate the user
        const validationErrors = yield (0, class_validator_1.validate)(newUser);
        if (validationErrors.length > 0) {
            const formattedErrors = validationErrors.map((error) => {
                return {
                    field: error.property,
                    message: error.constraints
                        ? Object.values(error.constraints)
                        : 'Validation error',
                };
            });
            res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: formattedErrors,
            });
            return;
        }
        const saltRounds = 10;
        newUser.password = yield bcrypt_1.default.hash(password, saltRounds);
        //Save the user
        yield userRepository.save(newUser);
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
            },
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});
exports.registerUser = registerUser;
//Login user
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            res
                .status(400)
                .json({ success: false, message: 'All fields are required' });
            return;
        }
        //Grab the repository
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        //look for email
        const user = yield userRepository.findOne({ where: { email } });
        if (!user) {
            res
                .status(404)
                .json({ success: false, message: 'Invalid email or password' });
            return;
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res
                .status(401)
                .json({ success: false, message: 'Invalid email or password' });
            return;
        }
        //generate JWT token
        const token = jsonwebtoken_1.default.sign({
            userId: user.id,
            username: user.username,
            email: user.email,
        }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            },
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});
exports.loginUser = loginUser;
//Get current user
const getCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const safeUser = (0, filterUserInfo_1.filterUserInfo)(req.user);
    try {
        res.status(200).json({
            success: true,
            message: 'User profile retrieved successfully',
            data: safeUser,
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});
exports.getCurrentUser = getCurrentUser;
//Get user recipes
const getUserRecipes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //preview the user recipes
    try {
        const { userId } = req.params;
        if (!req.user || req.user.userId !== userId) {
            res.status(403).json({ success: false, message: 'Unauthorized access' });
            return;
        }
        const recipeRepository = database_1.AppDataSource.getRepository(Recipe_1.Recipe);
        const userRecipes = yield recipeRepository.find({
            where: { author: { id: userId } },
            relations: [
                'author',
                'ingredients',
                'ingredients.ingredient',
                'instructions',
                'instructions.instruction',
            ],
            order: { createdAt: 'DESC' },
        });
        if (userRecipes.length === 0) {
            res
                .status(404)
                .json({ success: false, message: 'No recipes found for this user' });
            return;
        }
        // Format response
        const formattedRecipes = userRecipes.map((recipe) => ({
            id: recipe.id,
            title: recipe.title,
            description: recipe.description,
            isVegetarian: recipe.isVegetarian,
            servings: recipe.servings,
            time: recipe.time,
            image: recipe.image,
            category: recipe.category,
            createdAt: recipe.createdAt,
            updatedAt: recipe.updatedAt,
            author: (0, filterUserInfo_1.filterUserInfo)(recipe.author),
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
        }));
        res.status(200).json({
            success: true,
            message: 'User recipes retrieved successfully',
            data: formattedRecipes,
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});
exports.getUserRecipes = getUserRecipes;
