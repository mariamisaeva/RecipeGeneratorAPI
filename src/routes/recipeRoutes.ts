import express from 'express';
import {
  getAllRecipes,
  createRecipe,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  addFavoriteRecipe,
  deleteFavoriteRecipe,
  getFavoriteRecipes,
} from '../controllers/recipeController';
import { authenticateUser } from '../utils/authMiddleware';

const RecipeRouter = express.Router();

RecipeRouter.get('/', getAllRecipes); //  /api/recipes
RecipeRouter.post('/create-recipe', authenticateUser, createRecipe); //  /api/recipes/create-recipe

RecipeRouter.get('/:id', getRecipeById); //  /api/recipes/:id
RecipeRouter.put('/edit/:id', authenticateUser, updateRecipe); //  /api/recipes/:id
RecipeRouter.delete('/:id', authenticateUser, deleteRecipe); //  /api/recipes/:id

RecipeRouter.post('/:id/favorite', authenticateUser, addFavoriteRecipe); //  /api/recipes/:id/favorite
RecipeRouter.delete('/:id/favorite', authenticateUser, deleteFavoriteRecipe); //  /api/recipes/:id/favorite
RecipeRouter.get('/favorites', authenticateUser, getFavoriteRecipes); //  /api/recipes/favorites

export default RecipeRouter;
