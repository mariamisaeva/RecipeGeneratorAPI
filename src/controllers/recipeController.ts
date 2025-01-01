import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Recipe } from '../entities/Recipe';
import { User } from '../entities/User';
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
import { filterUserInfo } from '../utils/filterUserInfo';
import { FavoriteRecipe } from '../entities/FavoriteRecipe';

//GetAllRecipes
const getAllRecipes = async (req: Request, res: Response): Promise<void> => {
  try {
    const recipeRepository = AppDataSource.getRepository(Recipe);
    //get query params
    const {
      keyword = '',
      page = 1,
      limit = 6,
      category,
      isVegetarian,
      time,
    } = req.query as RecipeQueryParams;
    const pageNumber = Number(page); //parseInt(page as string, 10);
    const pageSize = Number(limit); //parseInt(limit as string, 10);

    //query filters
    const filters: any = {
      ...(category && {
        category: (category as string).toLowerCase() as CategoryEnum,
      }),
      ...(isVegetarian && { isVegetarian: isVegetarian === 'true' }),
      ...(time && { time: parseInt(time, 10) }),
    };

    const fetchAllRecipes = await recipeRepository.find({
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

    const PaginatedRecipes = fetchAllRecipes.slice(
      (pageNumber - 1) * pageSize,
      pageNumber * pageSize,
    );

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

    const pagination: PaginationMetadata = {
      total,
      currentPage: pageNumber,
      totalPages: Math.ceil(total / pageSize),
      pageSize,
    };

    const response: GetAllRecipesResponse = {
      success: true,
      message: 'All recipes fetched',
      data: formattedRecipes,
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
    if (!req.user || !req.user.userId) {
      res.status(401).json({ success: false, message: 'Unauthorized access' });
      return;
    }

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
    const userRepository = AppDataSource.getRepository(User);

    //fetch the user req.user.id
    const loggedInUser = await userRepository.findOne({
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
      category: category as CategoryEnum,
      author: loggedInUser,
    });

    await recipeRepository.save(newRecipe);

    await handleIngredients(ingredients, newRecipe);
    await handleInstructions(instructions, newRecipe);

    const fullNewRecipe = await recipeRepository.findOne({
      where: { id: newRecipe.id },
      relations: [
        'ingredients',
        'ingredients.ingredient',
        'instructions',
        'instructions.instruction',
        'author',
      ],
    });

    const filteredRecipe = {
      ...fullNewRecipe,
      author: filterUserInfo(fullNewRecipe!.author),
    };

    res.status(201).json({
      success: true,
      message: 'Recipe created successfully',
      data: filteredRecipe,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//================================================================//
//GetRecipeById
const getRecipeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

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
  try {
    const { id } = req.params;

    //check if user is logged in
    if (!req.user || !req.user.userId) {
      res.status(401).json({ success: false, message: 'Unauthorized access' });
      return;
    }

    const recipeRepository = AppDataSource.getRepository(Recipe);
    const userId = req.user.userId;

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

    const existingRecipe = await recipeRepository.findOne({
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

    //handle ingredients and instructions
    if (ingredients) {
      await handleUpdateIngredients(ingredients, existingRecipe);
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
        'author',
      ],
    });

    const response = {
      ...updatedRecipe,
      author: filterUserInfo(updatedRecipe!.author),
    };

    res.status(200).json({
      success: true,
      message: 'Recipe updated successfully',
      data: response,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
//================================================================//
//DeleteRecipe
const deleteRecipe = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!req.user || !req.user.userId) {
      res.status(401).json({ success: false, message: 'Unauthorized access' });
      return;
    }

    //Grab the repo
    const recipeRepository = AppDataSource.getRepository(Recipe);
    const userId = req.user.userId;

    //find the recipe where id = id
    const recipe = await recipeRepository.findOne({
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
    await recipeRepository.remove(recipe);

    res.status(200).json({
      success: true,
      message: `Recipe ${recipeTitle} deleted successfully`,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//Favorite controllers
const getFavoriteRecipes = async (
  req: Request,
  res: Response,
): Promise<void> => {
  console.log('Get Favorite Recipes is working...');
  console.log('Request Params:', req.params); // Log params
  console.log('Request Query:', req.query); // Log query parameters
  console.log('Request Body:', req.body); // Log body (if any)
  try {
    if (!req.user || !req.user.userId) {
      res.status(401).json({ success: false, message: 'Unauthorized access' });
      return;
    }

    const favoriteRepository = AppDataSource.getRepository(FavoriteRecipe);

    const favorites = await favoriteRepository.find({
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
  } catch (err: any) {
    console.error('Error fetching favorite recipes:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const addFavoriteRecipe = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    console.log('Add Favorite Recipe is working ...');

    const { id: recipeId } = req.params;

    if (!req.user || !req.user.userId) {
      res.status(401).json({ success: false, message: 'Unauthorized access' });
      return;
    }

    const recipeRepository = AppDataSource.getRepository(Recipe);
    const favoriteRepository = AppDataSource.getRepository(FavoriteRecipe);

    //check if recipe exists
    const recipe = await recipeRepository.findOne({
      where: { id: Number(recipeId) },
    });

    if (!recipe) {
      res.status(404).json({ success: false, message: 'Recipe not found' });
      return;
    }

    //check if recipe is already favorited
    const existingFavorite = await favoriteRepository.findOne({
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

    await favoriteRepository.save(favorite);

    //increment the favCounter
    recipe.favCounter++;
    await recipeRepository.save(recipe);

    res.status(201).json({
      success: true,
      message: `Recipe ${recipe.title}  added to favorites`,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const removeFavoriteRecipe = async (req: Request, res: Response) => {
  console.log('Delete Favorite Recipe is working ...');
  try {
    const { id: recipeId } = req.params;

    if (!req.user || !req.user.userId) {
      res.status(401).json({ success: false, message: 'Unauthorized access' });
      return;
    }

    const recipeRepository = AppDataSource.getRepository(Recipe);
    const favoriteRepository = AppDataSource.getRepository(FavoriteRecipe);

    //check if recipe exists
    const favorite = await favoriteRepository.findOne({
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

    await favoriteRepository.remove(favorite);

    //decrement the favCounter
    const recipe = await recipeRepository.findOne({
      where: { id: Number(recipeId) },
    });

    if (recipe) {
      recipe.favCounter = Math.max(0, recipe.favCounter - 1);
      await recipeRepository.save(recipe);
    }

    res.status(200).json({
      success: true,
      message: `Recipe ${recipe?.title} removed from favorites`,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export {
  getAllRecipes,
  createRecipe,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  addFavoriteRecipe,
  removeFavoriteRecipe,
  getFavoriteRecipes,
};
