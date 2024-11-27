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

export const handleUpdateIngredients = async (
  ingredients: Ingredient_TS[],
  recipe: Recipe,
): Promise<RecipeIngredient[]> => {
  console.log('UPDATE INGREDIENTS IS WORKING ... '); ////
  console.log('Incoming ingredients: ', ingredients); ////

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
    if (RIngID) {
      existingRIng = await recipeIngredientRepository.findOne({
        where: { id: RIngID },
        relations: ['ingredient'],
      });

      console.log('Existing Recipe Ingredient:', existingRIng); ////

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
    console.log('Creating a new RecipeIngredient...', name); ////

    //find the ingredient by name -- not found? -> create and save it
    let newIng = await ingredientsRepository.findOneBy({ name });
    if (!newIng) {
      console.log('Creating a new Ingredient:', name); ////
      newIng = ingredientsRepository.create({ name });
      await ingredientsRepository.save(newIng);
    }

    //create RI object
    const newRI = recipeIngredientRepository.create({
      ingredient: newIng,
      quantity,
      unit,
      recipe,
      indexNumber,
    });

    console.log('New Recipe Ingredient:', newRI); ////

    await recipeIngredientRepository.save(newRI);
    updatedIngredients.push(newRI);
    indexNumber++;
  }

  //delete excluded RecipeIngredients
  if (updatedIngredients.length < recipe.ingredients.length) {
    const deletedIngredients = recipe.ingredients.filter(
      (ri) => !updatedIngredients.some((uRIng) => uRIng.id === ri.id),
    );
    console.log('Deleting RecipeIngredients:', deletedIngredients); ////
    await recipeIngredientRepository.remove(deletedIngredients);
  }

  //PROBLEM: The new ingredients are not reflected in the recipe object.
  //SOLUTION: Reload 'recipe.ingredients' from the DB with the updated ingredients
  recipe.ingredients = await recipeIngredientRepository.find({
    where: { recipe: { id: recipe.id } },
    relations: ['ingredient'],
  });

  console.log('FINAL Updated Ingredients:', updatedIngredients); ////
  return updatedIngredients;
};

//Instruction - RecipeInstruction
//TODO
//pass in instructions //grab repos //create an empty array type RecipeInstruction[] // define a stepNumber starts from 1  //loop through instructions // findOneBy //not exists: create and save it //create new recipe object in the jointRepo with destructured data //save it to jointRepo //push to array + increment num //return
export const handleInstructions = async (
  instructions: Instruction_TS[],
  recipe: Recipe,
  isUpdate = false,
): Promise<RecipeInstruction[]> => {
  const instructionsRepository = AppDataSource.getRepository(Instruction);
  const recipeInstructionRepository =
    AppDataSource.getRepository(RecipeInstruction);

  const newInstructions: RecipeInstruction[] = [];

  let stepNumber = 1;

  for (const { id: RInsId, instruction } of instructions) {
    const { id: insId, step } = instruction || {};

    let existingRecipeInstruction;

    if (isUpdate && RInsId) {
      //if the RIid exists
      // grab it
      existingRecipeInstruction = await recipeInstructionRepository.findOne({
        where: { id: RInsId },
        relations: ['instruction'],
      });

      //if found
      if (existingRecipeInstruction) {
        // Retain current stepNumber unless explicitly updated
        existingRecipeInstruction.stepNumber =
          stepNumber ?? existingRecipeInstruction.stepNumber;

        //check for insID
        if (insId) {
          //look for it
          const existingIns = await instructionsRepository.findOneBy({
            id: insId,
          }); //found/not found

          if (existingIns) {
            //found => update and save the step explicitly
            if (existingIns.step !== step) {
              existingIns.step = step;
              await instructionsRepository.save(existingIns);
            }
            //Then update the instruction in the RecipeInstruction
            existingRecipeInstruction.instruction = existingIns;
          } else {
            //not found => create a new instruction and save it
            const newIns = instructionsRepository.create({ step });
            await instructionsRepository.save(newIns);
            existingRecipeInstruction.instruction = newIns;
          }
        }

        //Save Updated RecipeInstruction
        await recipeInstructionRepository.save(existingRecipeInstruction);
        newInstructions.push(existingRecipeInstruction);
        continue; // go to the next iteration
      }
    }

    //USING TO CREATE A NEW INSTRUCTION (create-recipe)
    let singleInstruction = await instructionsRepository.findOneBy({ step });

    if (!singleInstruction) {
      singleInstruction = instructionsRepository.create({ step });
      await instructionsRepository.save(singleInstruction);
    }

    const RIns = recipeInstructionRepository.create({
      instruction: singleInstruction, //instruction in RecipeInstruction
      recipe,
      //   stepNumber: stepNumber,
      stepNumber,
    });

    await recipeInstructionRepository.save(RIns);
    newInstructions.push(RIns);
    stepNumber++;
  }

  return newInstructions;
};
