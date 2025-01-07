"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const recipeController_1 = require("../controllers/recipeController");
const authMiddleware_1 = require("../utils/authMiddleware");
const RecipeRouter = express_1.default.Router();
RecipeRouter.get('/', recipeController_1.getAllRecipes); //  /api/recipes
RecipeRouter.get('/favorites', authMiddleware_1.authenticateUser, recipeController_1.getFavoriteRecipes);
RecipeRouter.post('/create-recipe', authMiddleware_1.authenticateUser, recipeController_1.createRecipe); //  /api/recipes/create-recipe
RecipeRouter.get('/:id', recipeController_1.getRecipeById); //  /api/recipes/:id
RecipeRouter.put('/edit/:id', authMiddleware_1.authenticateUser, recipeController_1.updateRecipe); //  /api/recipes/:id
RecipeRouter.delete('/:id', authMiddleware_1.authenticateUser, recipeController_1.deleteRecipe); //  /api/recipes/:id
RecipeRouter.post('/:id/favorite', authMiddleware_1.authenticateUser, recipeController_1.addFavoriteRecipe); //  /api/recipes/:id/favorite
RecipeRouter.delete('/:id/favorite', authMiddleware_1.authenticateUser, recipeController_1.removeFavoriteRecipe); //  /api/recipes/:id/favorite
exports.default = RecipeRouter;
