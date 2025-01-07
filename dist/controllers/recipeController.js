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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFavoriteRecipes = exports.removeFavoriteRecipe = exports.addFavoriteRecipe = exports.deleteRecipe = exports.updateRecipe = exports.getRecipeById = exports.createRecipe = exports.getAllRecipes = void 0;
const database_1 = require("../config/database");
const Recipe_1 = require("../entities/Recipe");
const User_1 = require("../entities/User");
const helpers_1 = require("../utils/helpers");
const Recipe_2 = require("../entities/Recipe");
const typeorm_1 = require("typeorm");
const filterUserInfo_1 = require("../utils/filterUserInfo");
const FavoriteRecipe_1 = require("../entities/FavoriteRecipe");
//GetAllRecipes
const getAllRecipes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recipeRepository = database_1.AppDataSource.getRepository(Recipe_1.Recipe);
        //get query params
        const { keyword = '', page = 1, limit = 6, category, isVegetarian, time, } = req.query;
        const pageNumber = Number(page); //parseInt(page as string, 10);
        const pageSize = Number(limit); //parseInt(limit as string, 10);
        //query filters
        const filters = Object.assign(Object.assign(Object.assign({}, (category && {
            category: category.toLowerCase(),
        })), (isVegetarian && { isVegetarian: isVegetarian === 'true' })), (time && { time: parseInt(time, 10) }));
        const fetchAllRecipes = yield recipeRepository.find({
            where: [
                Object.assign({ title: (0, typeorm_1.ILike)(`%${keyword}%`) }, filters),
                Object.assign({ description: (0, typeorm_1.ILike)(`%${keyword}%`) }, filters),
                Object.assign({ ingredients: { ingredient: { name: (0, typeorm_1.ILike)(`%${keyword}%`) } } }, filters),
                Object.assign({ instructions: { instruction: { step: (0, typeorm_1.ILike)(`%${keyword}%`) } } }, filters),
            ],
            relations: [
                'author',
                'ingredients',
                'ingredients.ingredient',
                'instructions',
                'instructions.instruction',
            ],
            order: {
                id: 'DESC', //sort by id in recipes ascending
                ingredients: { indexNumber: 'ASC' },
                instructions: { stepNumber: 'ASC' },
            },
        });
        const total = fetchAllRecipes.length;
        const PaginatedRecipes = fetchAllRecipes.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
        if (PaginatedRecipes.length === 0) {
            res.status(404).json({ success: false, message: 'No recipes found' });
            return;
        }
        console.log(PaginatedRecipes);
        //formatted response
        const formattedRecipes = PaginatedRecipes.map((rec) => ({
            id: rec.id,
            title: rec.title,
            description: rec.description,
            isVegetarian: rec.isVegetarian,
            servings: rec.servings,
            time: rec.time,
            image: rec.image,
            category: rec.category,
            ingredients: rec.ingredients,
            instructions: rec.instructions,
            author: {
                userId: rec.author.id,
                username: rec.author.username,
            },
            createdAt: rec.createdAt,
            updatedAt: rec.updatedAt,
        }));
        const pagination = {
            total,
            currentPage: pageNumber,
            totalPages: Math.ceil(total / pageSize),
            pageSize,
        };
        const response = {
            success: true,
            message: 'All recipes fetched',
            data: formattedRecipes,
            pagination,
        };
        res.status(200).json(response);
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});
exports.getAllRecipes = getAllRecipes;
//================================================================//
//CreateRecipe
const createRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user || !req.user.userId) {
            res.status(401).json({ success: false, message: 'Unauthorized access' });
            return;
        }
        const { title, description, isVegetarian, servings, time, image, category, ingredients, instructions, } = req.body;
        if (!Object.values(Recipe_2.CategoryEnum).includes(category)) {
            res.status(400).json({
                success: false,
                message: `Invalid category! Allowed categories: ${Object.values(Recipe_2.CategoryEnum).join(', ')}`,
            });
        }
        const recipeRepository = database_1.AppDataSource.getRepository(Recipe_1.Recipe);
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        //fetch the user req.user.id
        const loggedInUser = yield userRepository.findOne({
            where: { id: req.user.userId },
        });
        if (!loggedInUser) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        const newRecipe = recipeRepository.create({
            title,
            description,
            isVegetarian,
            servings,
            time,
            image,
            category: category,
            author: loggedInUser,
        });
        yield recipeRepository.save(newRecipe);
        yield (0, helpers_1.handleIngredients)(ingredients, newRecipe);
        yield (0, helpers_1.handleInstructions)(instructions, newRecipe);
        const fullNewRecipe = yield recipeRepository.findOne({
            where: { id: newRecipe.id },
            relations: [
                'ingredients',
                'ingredients.ingredient',
                'instructions',
                'instructions.instruction',
                'author',
            ],
        });
        const filteredRecipe = Object.assign(Object.assign({}, fullNewRecipe), { author: (0, filterUserInfo_1.filterUserInfo)(fullNewRecipe.author) });
        res.status(201).json({
            success: true,
            message: 'Recipe created successfully',
            data: filteredRecipe,
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});
exports.createRecipe = createRecipe;
//================================================================//
//GetRecipeById
const getRecipeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const recipeRepository = database_1.AppDataSource.getRepository(Recipe_1.Recipe);
        const recipe = yield recipeRepository.findOne({
            where: { id: Number(id) },
            relations: [
                'ingredients',
                'ingredients.ingredient',
                'instructions',
                'instructions.instruction',
            ],
        });
        if (!recipe) {
            res.status(404).json({ success: false, message: 'Recipe not found' });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Getting recipe by id...',
            data: recipe,
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});
exports.getRecipeById = getRecipeById;
//================================================================//
//UpdateRecipe //EditRecipe
const updateRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        //check if user is logged in
        if (!req.user || !req.user.userId) {
            res.status(401).json({ success: false, message: 'Unauthorized access' });
            return;
        }
        const recipeRepository = database_1.AppDataSource.getRepository(Recipe_1.Recipe);
        const userId = req.user.userId;
        const { title, description, isVegetarian, servings, time, image, category, ingredients, instructions, } = req.body; // Partial<Recipe_TS> - all fields are optional
        const existingRecipe = yield recipeRepository.findOne({
            where: { id: Number(id) },
            relations: [
                'author',
                'ingredients',
                'ingredients.ingredient',
                'instructions',
                'instructions.instruction',
            ],
        });
        if (!existingRecipe) {
            res.status(404).json({ success: false, message: 'Recipe not found' });
            return;
        }
        if (existingRecipe.author.id !== userId) {
            res.status(403).json({
                success: false,
                message: 'You are not authorized to update this recipe',
            });
            return;
        }
        // if (title) existingRecipe.title = title;
        // if (description) existingRecipe.description = description;
        // if (isVegetarian) existingRecipe.isVegetarian = isVegetarian;
        // if (servings) existingRecipe.servings = servings;
        // if (time) existingRecipe.time = time;
        // if (image) existingRecipe.image = image;
        // if (category) existingRecipe.category = category as CategoryEnum;
        Object.assign(existingRecipe, Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (title && { title })), (description && { description })), (servings && { servings })), (time && { time })), (image && { image })), { isVegetarian: isVegetarian !== undefined ? isVegetarian : existingRecipe.isVegetarian }));
        //handle category
        if (category) {
            if (!Object.values(Recipe_2.CategoryEnum).includes(category)) {
                res.status(400).json({
                    success: false,
                    message: `Invalid category! Allowed categories: ${Object.values(Recipe_2.CategoryEnum).join(', ')}`,
                });
                return;
            }
            existingRecipe.category = category;
        }
        //handle ingredients and instructions
        if (ingredients) {
            yield (0, helpers_1.handleUpdateIngredients)(ingredients, existingRecipe);
        }
        if (instructions) {
            yield (0, helpers_1.handleUpdateInstructions)(instructions, existingRecipe);
        }
        yield recipeRepository.save(existingRecipe);
        //fetch the updated recipe
        const updatedRecipe = yield recipeRepository.findOne({
            where: { id: Number(id) },
            relations: [
                'ingredients',
                'ingredients.ingredient',
                'instructions',
                'instructions.instruction',
                'author',
            ],
        });
        const response = Object.assign(Object.assign({}, updatedRecipe), { author: (0, filterUserInfo_1.filterUserInfo)(updatedRecipe.author) });
        res.status(200).json({
            success: true,
            message: 'Recipe updated successfully',
            data: response,
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});
exports.updateRecipe = updateRecipe;
//================================================================//
//DeleteRecipe
const deleteRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!req.user || !req.user.userId) {
            res.status(401).json({ success: false, message: 'Unauthorized access' });
            return;
        }
        //Grab the repo
        const recipeRepository = database_1.AppDataSource.getRepository(Recipe_1.Recipe);
        const userId = req.user.userId;
        //find the recipe where id = id
        const recipe = yield recipeRepository.findOne({
            where: { id: Number(id) },
            relations: ['author'], //to check for ownership
        });
        //handle if not found
        if (!recipe) {
            res.status(404).json({ success: false, message: 'Recipe not found' });
            return;
        }
        if (recipe.author.id !== userId) {
            res.status(403).json({
                success: false,
                message: 'You are not authorized to delete this recipe',
            });
            return;
        }
        const recipeTitle = recipe.title;
        //delete it
        yield recipeRepository.remove(recipe);
        res.status(200).json({
            success: true,
            message: `Recipe ${recipeTitle} deleted successfully`,
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});
exports.deleteRecipe = deleteRecipe;
//Favorite controllers
const getFavoriteRecipes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Get Favorite Recipes is working...');
    console.log('Request Params:', req.params); // Log params
    console.log('Request Query:', req.query); // Log query parameters
    console.log('Request Body:', req.body); // Log body (if any)
    try {
        if (!req.user || !req.user.userId) {
            res.status(401).json({ success: false, message: 'Unauthorized access' });
            return;
        }
        const favoriteRepository = database_1.AppDataSource.getRepository(FavoriteRecipe_1.FavoriteRecipe);
        const favorites = yield favoriteRepository.find({
            where: { user: { id: req.user.userId } },
            relations: [
                'recipe',
                'recipe.author',
                'recipe.ingredients',
                'recipe.instructions',
            ],
        });
        if (favorites.length === 0) {
            res
                .status(200)
                .json({ success: true, message: 'No favorite recipes found' });
            return;
        }
        const formattedFavorites = favorites.map((fav) => ({
            id: fav.recipe.id,
            title: fav.recipe.title,
            description: fav.recipe.description,
            isVegetarian: fav.recipe.isVegetarian,
            servings: fav.recipe.servings,
            time: fav.recipe.time,
            image: fav.recipe.image,
            category: fav.recipe.category,
            favCounter: fav.recipe.favCounter,
            ingredients: fav.recipe.ingredients,
            instructions: fav.recipe.instructions,
            author: {
                userId: fav.recipe.author.id,
                username: fav.recipe.author.username,
            },
            createdAt: fav.recipe.createdAt,
        }));
        res.status(200).json({
            success: true,
            message: 'Favorite recipes fetched',
            data: formattedFavorites,
        });
    }
    catch (err) {
        console.error('Error fetching favorite recipes:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});
exports.getFavoriteRecipes = getFavoriteRecipes;
const addFavoriteRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Add Favorite Recipe is working ...');
        const { id: recipeId } = req.params;
        if (!req.user || !req.user.userId) {
            res.status(401).json({ success: false, message: 'Unauthorized access' });
            return;
        }
        const recipeRepository = database_1.AppDataSource.getRepository(Recipe_1.Recipe);
        const favoriteRepository = database_1.AppDataSource.getRepository(FavoriteRecipe_1.FavoriteRecipe);
        //check if recipe exists
        const recipe = yield recipeRepository.findOne({
            where: { id: Number(recipeId) },
        });
        if (!recipe) {
            res.status(404).json({ success: false, message: 'Recipe not found' });
            return;
        }
        //check if recipe is already favorited
        const existingFavorite = yield favoriteRepository.findOne({
            where: {
                user: { id: req.user.userId },
                recipe: { id: Number(recipeId) },
            },
        });
        if (existingFavorite) {
            res.status(400).json({
                success: false,
                message: `Recipe ${recipe.title} is already favorited`,
            });
            return;
        }
        //add recipe to favorites
        const favorite = favoriteRepository.create({
            user: { id: req.user.userId },
            recipe,
        });
        yield favoriteRepository.save(favorite);
        //increment the favCounter
        recipe.favCounter++;
        yield recipeRepository.save(recipe);
        res.status(201).json({
            success: true,
            message: `Recipe ${recipe.title}  added to favorites`,
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});
exports.addFavoriteRecipe = addFavoriteRecipe;
const removeFavoriteRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Delete Favorite Recipe is working ...');
    try {
        const { id: recipeId } = req.params;
        if (!req.user || !req.user.userId) {
            res.status(401).json({ success: false, message: 'Unauthorized access' });
            return;
        }
        const recipeRepository = database_1.AppDataSource.getRepository(Recipe_1.Recipe);
        const favoriteRepository = database_1.AppDataSource.getRepository(FavoriteRecipe_1.FavoriteRecipe);
        //check if recipe exists
        const favorite = yield favoriteRepository.findOne({
            where: {
                user: { id: req.user.userId },
                recipe: { id: Number(recipeId) },
            },
        });
        if (!favorite) {
            res
                .status(404)
                .json({ success: false, message: 'Recipe not found in favorites' });
            return;
        }
        yield favoriteRepository.remove(favorite);
        //decrement the favCounter
        const recipe = yield recipeRepository.findOne({
            where: { id: Number(recipeId) },
        });
        if (recipe) {
            recipe.favCounter = Math.max(0, recipe.favCounter - 1);
            yield recipeRepository.save(recipe);
        }
        res.status(200).json({
            success: true,
            message: `Recipe ${recipe === null || recipe === void 0 ? void 0 : recipe.title} removed from favorites`,
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});
exports.removeFavoriteRecipe = removeFavoriteRecipe;
