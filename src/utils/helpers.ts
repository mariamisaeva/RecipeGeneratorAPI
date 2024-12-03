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

//Create Ingredients
export const handleIngredients = async (
  ingredients: Ingredient_TS[],
  recipe: Recipe,
): Promise<RecipeIngredient[]> => {
  const ingredientsRepository = AppDataSource.getRepository(Ingredient);
  const recipeIngredientRepository =
    AppDataSource.getRepository(RecipeIngredient);

  const newIngredients: RecipeIngredient[] = [];
  let indexNumber = 0;

  for (const ing of ingredients) {
    const { quantity, unit, ingredient } = ing;
    const { name } = ingredient;

    if (!name) {
      throw new Error('Ingredient name is required.');
    }

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

  //   console.log('New Ingredients:', newIngredients); ////
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

  for (const {
    instruction: { step },
  } of instructions) {
    //USING TO CREATE A NEW INSTRUCTION (create-recipe)
    let singleInstruction = await instructionsRepository.findOneBy({ step });

    if (!singleInstruction) {
      singleInstruction = instructionsRepository.create({ step });
      await instructionsRepository.save(singleInstruction);
    }

    // Assign stepNumber: Use provided value or increment maxStepNumber

    const RIns = recipeInstructionRepository.create({
      instruction: singleInstruction, //instruction in RecipeInstruction
      recipe,
      stepNumber,
    });

    await recipeInstructionRepository.save(RIns);
    newInstructions.push(RIns);
    stepNumber++;
  }

  console.log('New Instructions:', newInstructions); ////

  return newInstructions;
};

//UPDATE INGREDIENTS
export const handleUpdateIngredients = async (
  ingredients: Ingredient_TS[],
  recipe: Recipe,
  //   isUpdate = false,
): Promise<RecipeIngredient[]> => {
  //grab repos
  const ingredientsRepository = AppDataSource.getRepository(Ingredient);
  const recipeIngredientRepository =
    AppDataSource.getRepository(RecipeIngredient);

  //create an empty array type RecipeIngredient[]
  const updatedIngredients: RecipeIngredient[] = [];
  let indexNumber = 0;

  //loop through ingredients
  for (const ing of ingredients) {
    //Destructure the incoming data
    const { id: RIngID, quantity, unit, ingredient } = ing;
    const { id, name } = ingredient || {};

    //if no name and id throw an error
    if (!name && !id) {
      throw new Error('Ingredient name or id is required');
    }

    let existingRIng: RecipeIngredient | null = null;

    //if RIngID exists, find the existing RecipeIngredient by id
    if (/*isUpdate &&*/ RIngID) {
      existingRIng = await recipeIngredientRepository.findOne({
        where: { id: RIngID },
        relations: ['ingredient'],
      });

      //if exists, update its props and associated ingredient
      if (existingRIng) {
        existingRIng.quantity = quantity;
        existingRIng.unit = unit;

        //check if the ingredient name has changed
        if (name && existingRIng.ingredient.name !== name) {
          //find the ingredient by name
          let existingIngredient = await ingredientsRepository.findOneBy({
            name,
          });

          //if not found, create and save it
          if (!existingIngredient) {
            existingIngredient = ingredientsRepository.create({ name });
            await ingredientsRepository.save(existingIngredient);
          }

          existingRIng.ingredient = existingIngredient;
        }

        //save the updated RecipeIngredient and push it to the empty array
        await recipeIngredientRepository.save(existingRIng);
        updatedIngredients.push(existingRIng);
        continue; //go to the next iteration
      }
    }

    //if no existing RecipeIngredient create a new one
    //find the ingredient by name -- not found? -> create and save it
    let singleIngredient = await ingredientsRepository.findOneBy({ name });
    if (!singleIngredient) {
      singleIngredient = ingredientsRepository.create({ name });
      await ingredientsRepository.save(singleIngredient);
    }

    //create RI object
    const newRI = recipeIngredientRepository.create({
      ingredient: singleIngredient,
      quantity,
      unit,
      recipe,
      indexNumber,
    });

    await recipeIngredientRepository.save(newRI);
    updatedIngredients.push(newRI);
    indexNumber++;
  }

  //DELETE EXCLUDED RecipeIngredients
  if (updatedIngredients.length < recipe.ingredients.length) {
    const deletedIngredients = recipe.ingredients.filter(
      (ri) => !updatedIngredients.some((uRIng) => uRIng.id === ri.id),
    );
    // console.log('Deleting RecipeIngredients:', deletedIngredients); ////
    await recipeIngredientRepository.remove(deletedIngredients);
  }

  //PROBLEM: The new ingredients are not reflected in the recipe object.
  //SOLUTION: Reload 'recipe.ingredients' from the DB with the updated ingredients
  recipe.ingredients = await recipeIngredientRepository.find({
    where: { recipe: { id: recipe.id } },
    relations: ['ingredient'],
  });

  return updatedIngredients;
};

export const handleUpdateInstructions = async (
  instructions: Instruction_TS[],
  recipe: Recipe,
  //   isUpdate = false,
): Promise<RecipeInstruction[]> => {
  const instructionsRepository = AppDataSource.getRepository(Instruction);
  const recipeInstructionRepository =
    AppDataSource.getRepository(RecipeInstruction);

  const newInstructions: RecipeInstruction[] = [];
  //   let stepNumber = 1;
  let maxStepNumber = 1;

  //   if (isUpdate) {
  const currentInstructions = await recipeInstructionRepository.find({
    where: { recipe: { id: recipe.id } },
  });

  maxStepNumber = currentInstructions.reduce(
    (max, ins) => Math.max(max, ins.stepNumber),
    1,
  );
  //  Math.max(
  //   0,
  //   ...currentInstructions.map((ins) => ins.stepNumber),
  // ); //get max step number
  //   }

  for (const { id: RInsID, instruction, stepNumber } of instructions) {
    const { id, step } = instruction || {};

    if (!step && !id) {
      throw new Error('Instruction step or id is required');
    }

    let existingRecipeInst: RecipeInstruction | null = null;

    if (/*isUpdate && */ RInsID) {
      //if the RIid exists
      // grab it
      existingRecipeInst = await recipeInstructionRepository.findOne({
        where: { id: RInsID },
        relations: ['instruction'],
      });

      //if found
      if (existingRecipeInst) {
        // Retain current stepNumber unless explicitly updated
        existingRecipeInst.stepNumber =
          stepNumber ?? existingRecipeInst.stepNumber;

        if (step && existingRecipeInst.instruction.step !== step) {
          let existingInst = await instructionsRepository.findOneBy({ step });

          if (!existingInst) {
            existingInst = instructionsRepository.create({ step });
            await instructionsRepository.save(existingInst);
          }

          existingRecipeInst.instruction = existingInst;
        }

        //save the updated RecipeInstruction and push it to the empty array
        await recipeInstructionRepository.save(existingRecipeInst);
        newInstructions.push(existingRecipeInst);
        continue;
      }
    }

    //USING TO CREATE A NEW INSTRUCTION (create-recipe)
    let singleInstruction = await instructionsRepository.findOneBy({ step });

    if (!singleInstruction) {
      singleInstruction = instructionsRepository.create({ step });
      await instructionsRepository.save(singleInstruction);
    }

    // Assign stepNumber: Use provided value or increment maxStepNumber
    const newStepNumber = stepNumber ?? ++maxStepNumber;

    const RIns = recipeInstructionRepository.create({
      instruction: singleInstruction, //instruction in RecipeInstruction
      recipe,
      stepNumber: newStepNumber,
    });

    await recipeInstructionRepository.save(RIns);
    newInstructions.push(RIns);
    // stepNumber++;
  }

  //DELETE EXCLUDED INSTRUCTIONS
  if (newInstructions.length < recipe.instructions.length) {
    const deletedInstructions = recipe.instructions.filter(
      (ri) => !newInstructions.some((uRIns) => uRIns.id === ri.id),
    );
    await recipeInstructionRepository.remove(deletedInstructions);
  }

  //Reload recipe.instructions
  recipe.instructions = await recipeInstructionRepository.find({
    where: { recipe: { id: recipe.id } },
    relations: ['instruction'],
  });
  console.log('recipe.instructions: ', recipe.instructions); ////

  console.log('New Instructions:', newInstructions); ////

  return newInstructions;
};
