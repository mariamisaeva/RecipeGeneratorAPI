import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Recipe } from '../entities/Recipe';
import { Recipe_TS } from '../types/types';
import { handleIngredients } from '../utils/helpers';
//GetAllRecipes
const getAllRecipes = async (req: Request, res: Response): Promise<void> => {
  console.log('getAllRecipes Controller is Working...'); ////

  try {
    const recipeRepository = AppDataSource.getRepository(Recipe);
    const fetchAllRecipes = await recipeRepository.find();

    res.status(200).json({
      success: true,
      message: 'Getting all recipes...',
      data: fetchAllRecipes,
    });
  } catch (err: any) {
    // console.error(err); ////
    // if (err instanceof Error) {
    //   res.status(500).json({ success: false, message: err.message });
    // }
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
//================================================================//
//CreateRecipe
const createRecipe = async (req: Request, res: Response): Promise<void> => {
  console.log('createRecipe Controller is Working...'); ////

  try {
    //1. get repos
    //2. destruct the contained data in body request
    //3. create new recipe in the repo with destructured data
    //4. handle ings and insts (if not exists create them)
    //4. save it - await
    //send response
    const {
      title,
      description,
      isVegetarian,
      servings,
      time,
      image,
      category,
      ingredients,
    }: //   instructions,
    Recipe_TS = req.body;

    const recipeRepository = AppDataSource.getRepository(Recipe);

    const ingredientsHelper = await handleIngredients(ingredients);

    const newRecipe = recipeRepository.create({
      title,
      description,
      isVegetarian,
      servings,
      time,
      image,
      category,
      ingredients: ingredientsHelper,
      //   instructions:
    });

    await recipeRepository.save(newRecipe);

    res.status(201).json({
      success: true,
      message: 'Recipe created successfully',
      data: newRecipe,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
//================================================================//
//GetRecipeById
// const getRecipeById = async (req: Request, res: Response) => {};
//================================================================//
//UpdateRecipe //EditRecipe
// const updateRecipe = async (req: Request, res: Response) => {};
//================================================================//
//DeleteRecipe
// const deleteRecipe = async (req: Request, res: Response) => {};

export {
  getAllRecipes,
  createRecipe,
  //   getRecipeById,
  //   updateRecipe,
  //   deleteRecipe,
};
