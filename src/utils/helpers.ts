import { AppDataSource } from '../config/database';
import { Ingredient_TS, Instruction_TS } from '../types/types';
import { Ingredient } from '../entities/Ingredient';
import { RecipeIngredient } from '../entities/RecipeIngredient';
import { Instruction } from '../entities/Instruction';
import { RecipeInstruction } from '../entities/RecipeInstruction';
import { Recipe } from '../entities/Recipe';

/* Process ingredients and return RecipeIngredient array.
- grab repos
- create an empty array type RecipeIngredient[]
- loop through ingredients
- grab the ingredient fineOne by name

- create new recipe in the repo with destructured data
- add to array
- return
*/

//Ingredient - RecipeIngredient
export const handleIngredients = async (
  ingredients: Ingredient_TS[],
  recipe: Recipe,
): Promise<RecipeIngredient[]> => {
  const ingredientsRepository = AppDataSource.getRepository(Ingredient);
  const recipeIngredientRepository =
    AppDataSource.getRepository(RecipeIngredient);

  const newIngredients: RecipeIngredient[] = [];

  let indexNumber = 0;

  for (const { name, quantity, unit } of ingredients) {
    let singleIngredient = await ingredientsRepository.findOneBy({ name });

    if (!singleIngredient) {
      singleIngredient = ingredientsRepository.create({ name });
      await ingredientsRepository.save(singleIngredient);
    }

    //create RI object
    const RIng = recipeIngredientRepository.create({
      ingredient: singleIngredient,
      quantity,
      unit,
      recipe, //link to the recipe (to be retrieved correctly)
      indexNumber,
    });

    await recipeIngredientRepository.save(RIng);
    newIngredients.push(RIng);
    indexNumber++;
  }

  return newIngredients;
};

//Instruction - RecipeInstruction
//TODO
//pass in instructions //grab repos //create an empty array type RecipeInstruction[] // define a stepNumber starts from 1  //loop through instructions // findOneBy //not exists: create and save it //create new recipe object in the jointRepo with destructured data //save it to jointRepo //push to array + increment num //return
export const handleInstructions = async (
  instructions: Instruction_TS[],
  recipe: Recipe,
): Promise<RecipeInstruction[]> => {
  const instructionsRepository = AppDataSource.getRepository(Instruction);
  const recipeInstructionRepository =
    AppDataSource.getRepository(RecipeInstruction);

  const newInstructions: RecipeInstruction[] = [];

  let stepNumber = 1;

  for (const { step } of instructions) {
    let singleInstruction = await instructionsRepository.findOneBy({ step });

    if (!singleInstruction) {
      singleInstruction = instructionsRepository.create({ step });
      await instructionsRepository.save(singleInstruction);
    }

    // console.log('Saving RecipeInstruction:', {
    //   recipe: recipe.id,
    //   stepNumber,
    //   step,
    // });

    const RIns = recipeInstructionRepository.create({
      instruction: singleInstruction, //instruction in RecipeInstruction
      recipe,
      stepNumber,
    });

    await recipeInstructionRepository.save(RIns);

    newInstructions.push(RIns);
    stepNumber++;
  }

  //   console.log('newInstructions:', newInstructions);

  return newInstructions;
};