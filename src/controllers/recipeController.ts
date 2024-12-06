import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Recipe } from '../entities/Recipe';
import {
  Recipe_TS,
  RecipeQueryParams,
  PaginationMetadata,
  GetAllRecipesResponse,
} from '../types/types';
import {
  handleIngredients,
  handleInstructions,
  handleUpdateIngredients,
  handleUpdateInstructions,
} from '../utils/helpers';
import { CategoryEnum } from '../entities/Recipe';
import { ILike } from 'typeorm';

//GetAllRecipes
const getAllRecipes = async (req: Request, res: Response): Promise<void> => {
  try {
    const recipeRepository = AppDataSource.getRepository(Recipe);
    //get query params
    const {
      keyword = '',
      page = 1,
      limit = 10,
      category,
      isVegetarian,
      time,
    } = req.query as unknown as RecipeQueryParams;
    const pageNumber = parseInt(page as string, 10);
    const pageSize = parseInt(limit as string, 10);
    const offset = (pageNumber - 1) * pageSize;

    //query filters
    const filters: any = {
      ...(category && {
        category: (category as string).toLowerCase() as CategoryEnum,
      }),
      ...(isVegetarian && { isVegetarian: isVegetarian === 'true' }),
      ...(time && { time: parseInt(time, 10) }),
    };

    const [fetchAllRecipes, total] = await recipeRepository.findAndCount({
      where: [
        { title: ILike(`%${keyword}%`), ...filters },
        { description: ILike(`%${keyword}%`), ...filters },
        {
          ingredients: { ingredient: { name: ILike(`%${keyword}%`) } },
          ...filters,
        },
        {
          instructions: { instruction: { step: ILike(`%${keyword}%`) } },
          ...filters,
        },
      ],
      relations: [
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
      skip: offset,
      take: pageSize,
    });

    if (fetchAllRecipes.length === 0) {
      res.status(404).json({ success: false, message: 'No recipes found' });
      return;
    }

    const pagination: PaginationMetadata = {
      total,
      currentPage: pageNumber,
      totalPages: Math.ceil(total / pageSize),
      pageSize,
    };

    const response: GetAllRecipesResponse = {
      success: true,
      message: 'Getting all recipes...',
      data: fetchAllRecipes,
      pagination,
    };

    res.status(200).json(response);
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//================================================================//
//CreateRecipe
const createRecipe = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title,
      description,
      isVegetarian,
      servings,
      time,
      image,
      category,
      ingredients,
      instructions,
    }: Recipe_TS = req.body;

    if (!Object.values(CategoryEnum).includes(category as CategoryEnum)) {
      res.status(400).json({
        success: false,
        message: `Invalid category! Allowed categories: ${Object.values(
          CategoryEnum,
        ).join(', ')}`,
      });
    }
    const recipeRepository = AppDataSource.getRepository(Recipe);

    const newRecipe = recipeRepository.create({
      title,
      description,
      isVegetarian,
      servings,
      time,
      image,
      category: category as CategoryEnum,
    });

    await recipeRepository.save(newRecipe);
    console.log('Ingredients before Handle: ', ingredients); ////

    await handleIngredients(ingredients, newRecipe);
    await handleInstructions(instructions, newRecipe);

    console.log('Ingredients: ', ingredients); ////
    // console.log('Instructions: ', insts); ////
    console.log('NEW RECIPE: ', newRecipe); ////

    const fullNewRecipe = await recipeRepository.findOne({
      where: { id: newRecipe.id },
      relations: [
        'ingredients',
        'ingredients.ingredient',
        'instructions',
        'instructions.instruction',
      ],
    });

    // console.log(fullNewRecipe);

    res.status(201).json({
      success: true,
      message: 'Recipe created successfully',
      data: fullNewRecipe,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//================================================================//
//GetRecipeById
const getRecipeById = async (req: Request, res: Response) => {
  console.log('getRecipeById Controller is Working...'); ////

  try {
    const { id } = req.params;
    // console.log(id); ////

    const recipeRepository = AppDataSource.getRepository(Recipe);

    const recipe = await recipeRepository.findOne({
      where: { id: Number(id) },
      relations: [
        'ingredients',
        'ingredients.ingredient',
        'instructions',
        'instructions.instruction',
      ],
    });

    // console.log(recipe); ////

    if (!recipe) {
      res.status(404).json({ success: false, message: 'Recipe not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Getting recipe by id...',
      data: recipe,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//================================================================//
//UpdateRecipe //EditRecipe
const updateRecipe = async (req: Request, res: Response): Promise<void> => {
  console.log('updateRecipe Controller is Working...'); ////

  try {
    const recipeRepository = AppDataSource.getRepository(Recipe);
    const { id } = req.params;

    // console.log('req.body: ', req.body);
    const {
      title,
      description,
      isVegetarian,
      servings,
      time,
      image,
      category,
      ingredients,
      instructions,
    }: Partial<Recipe_TS> = req.body; // Partial<Recipe_TS> - all fields are optional

    // console.log('req.body: ', req.body);

    const existingRecipe = await recipeRepository.findOne({
      where: { id: Number(id) },
      relations: [
        'ingredients',
        'ingredients.ingredient',
        'instructions',
        'instructions.instruction',
      ],
    });
    // console.log(existingRecipe); ////

    if (!existingRecipe) {
      res.status(404).json({ success: false, message: 'Recipe not found' });
      return;
    }

    // if (title) existingRecipe.title = title;
    // if (description) existingRecipe.description = description;
    // if (isVegetarian) existingRecipe.isVegetarian = isVegetarian;
    // if (servings) existingRecipe.servings = servings;
    // if (time) existingRecipe.time = time;
    // if (image) existingRecipe.image = image;
    // if (category) existingRecipe.category = category as CategoryEnum;

    Object.assign(existingRecipe, {
      ...(title && { title }),
      ...(description && { description }),
      ...(servings && { servings }),
      ...(time && { time }),
      ...(image && { image }),
      isVegetarian:
        isVegetarian !== undefined ? isVegetarian : existingRecipe.isVegetarian,
    });
    //handle category
    if (category) {
      if (!Object.values(CategoryEnum).includes(category as CategoryEnum)) {
        res.status(400).json({
          success: false,
          message: `Invalid category! Allowed categories: ${Object.values(
            CategoryEnum,
          ).join(', ')}`,
        });
        return;
      }
      existingRecipe.category = category as CategoryEnum;
    }

    if (ingredients) {
      console.log('Raw Ingredients:, ', ingredients); ////
      await handleUpdateIngredients(ingredients, existingRecipe);

      //   console.log('Formatted Ingredients:', formattedIngredients); ////
      //   await handleIngredients(ingredients, existingRecipe);
      console.log('Ingredients updated successfully.');
    }

    if (instructions) {
      await handleUpdateInstructions(instructions, existingRecipe);
    }

    await recipeRepository.save(existingRecipe);
    //fetch the updated recipe
    const updatedRecipe = await recipeRepository.findOne({
      where: { id: Number(id) },
      relations: [
        'ingredients',
        'ingredients.ingredient',
        'instructions',
        'instructions.instruction',
      ],
    });
    console.log(updatedRecipe); ////

    res.status(200).json({
      success: true,
      message: 'Recipe updated successfully',
      data: updatedRecipe,
    });
  } catch (err: any) {
    console.error('Error in updateRecipe:', err); // Debug log
    res.status(500).json({ success: false, message: err.message });
  }
};
//================================================================//
//DeleteRecipe
const deleteRecipe = async (req: Request, res: Response): Promise<void> => {
  console.log('deleteRecipe Controller is Working...'); ////

  try {
    const { id } = req.params;
    console.log('id:', id); ////

    //Grab the repo
    const recipeRepository = AppDataSource.getRepository(Recipe);

    //find the recipe where id = id
    const recipe = await recipeRepository.findOne({
      where: { id: Number(id) },
    });
    //handle if not found
    if (!recipe) {
      res.status(404).json({ success: false, message: 'Recipe not found' });
      return;
    }

    const recipeTitle = recipe.title;
    console.log('Recipe to delete:', recipeTitle); ////

    //delete it
    await recipeRepository.remove(recipe);

    res.status(200).json({
      success: true,
      message: `Recipe ${recipeTitle} deleted successfully`,
    });
  } catch (err: any) {
    console.error('Error in deleteRecipe:', err); // Debug log
    res.status(500).json({ success: false, message: err.message });
  }
};

export {
  getAllRecipes,
  createRecipe,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
};
