import express from 'express';
import {
  getAllRecipes,
  createRecipe,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
} from '../controllers/recipeController';
import { authenticateUser } from '../utils/authMiddleware';

const RecipeRouter = express.Router();

RecipeRouter.get('/', getAllRecipes); //  /api/recipes
RecipeRouter.post('/create-recipe', authenticateUser, createRecipe); //  /api/recipes/create-recipe

RecipeRouter.get('/:id', getRecipeById); //  /api/recipes/:id
RecipeRouter.put('/edit/:id', authenticateUser, updateRecipe); //  /api/recipes/:id
RecipeRouter.delete('/:id', deleteRecipe); //  /api/recipes/:id

export default RecipeRouter;
