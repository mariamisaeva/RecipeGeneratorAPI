import express from 'express';
import { getAllRecipes, createRecipe } from '../controllers/recipeController';

const RecipeRouter = express.Router();

RecipeRouter.get('/', getAllRecipes); //  /api/recipes
RecipeRouter.post('/create-recipe', createRecipe); //  /api/recipes/create-recipe

export default RecipeRouter;
