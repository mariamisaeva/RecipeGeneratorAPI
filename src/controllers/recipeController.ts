import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Recipe } from '../entities/Recipe';
import { Recipe_TS } from '../types/types';
import { handleIngredients, handleInstructions } from '../utils/helpers';
import { CategoryEnum } from '../entities/Recipe';

//GetAllRecipes
const getAllRecipes = async (req: Request, res: Response): Promise<void> => {
  console.log('getAllRecipes Controller is Working...'); ////

  try {
    const recipeRepository = AppDataSource.getRepository(Recipe);
    const fetchAllRecipes = await recipeRepository.find({
      relations: [
        'ingredients',
        'ingredients.ingredient',
        'instructions',
        'instructions.instruction',
      ],
      order: {
        id: 'ASC', //sort by id in recipes ascending
        ingredients: {
          indexNumber: 'ASC', //sort by orderIndex in ingredients
        },
        instructions: {
          stepNumber: 'ASC', //sort by stepNumber in instructions ascending}
        },
      },
    });

    console.log(fetchAllRecipes); ////

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

    await handleIngredients(ingredients, newRecipe);
    await handleInstructions(instructions, newRecipe);

    // console.log('Ingredients: ', ings); ////
    // console.log('Instructions: ', insts); ////
    // console.log('NEW RECIPE: ', newRecipe); ////

    const fullNewRecipe = await recipeRepository.findOne({
      where: { id: newRecipe.id },
      relations: [
        'ingredients',
        'ingredients.ingredient',
        'instructions',
        'instructions.instruction',
      ],
    });

    console.log(fullNewRecipe);

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
    console.log(id); ////

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

    console.log(recipe); ////

    if (!recipe) {
      res.status(404).json({ success: false, message: 'Recipe not found' });
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
      ...(isVegetarian && { isVegetarian }),
      ...(servings && { servings }),
      ...(time && { time }),
      ...(image && { image }),
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

      const formattedIngredients = ingredients.map((ing: any) => ({
        id: ing.id, //RecipeIngredient ID
        quantity: ing.quantity,
        unit: ing.unit,

        ingredient: {
          id: ing.ingredient?.id,
          name: ing.ingredient?.name,
        },
      }));

      console.log('Formatted Ingredients:', formattedIngredients); ////

      await handleIngredients(formattedIngredients, existingRecipe, true);
      console.log('Ingredients updated successfully.');
    }

    // if (instructions) await handleInstructions(instructions, existingRecipe);

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
    // console.log(updatedRecipe); ////

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
// const deleteRecipe = async (req: Request, res: Response) => {};

export {
  getAllRecipes,
  createRecipe,
  getRecipeById,
  updateRecipe,
  //   deleteRecipe,
};
