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
  isUpdate = false, //update or create
): Promise<RecipeIngredient[]> => {
  console.log('handleIngredients is working...'); ////
  console.log(ingredients); ////
  const ingredientsRepository = AppDataSource.getRepository(Ingredient);
  const recipeIngredientRepository =
    AppDataSource.getRepository(RecipeIngredient);

  const newIngredients: RecipeIngredient[] = [];
  let indexNumber = 0;

  recipe.ingredients = recipe.ingredients || [];

  for (const ing of ingredients) {
    const { id: RIngID, quantity, unit, ingredient } = ing;
    const { name } = ingredient;

    if (!name) {
      throw new Error('Ingredient name is required.');
    }

    // console.log('Processing Ingredient:', name);

    let existingRecipeIngredient: RecipeIngredient | null = null;

    if (isUpdate && RIngID) {
      //   if (RIngID) {
      //look for the existing RecipeIngredient by id
      existingRecipeIngredient = await recipeIngredientRepository.findOne({
        where: { id: RIngID },
        relations: ['ingredient'],
      });

      console.log('Existing Recipe Ingredient:', existingRecipeIngredient); ////

      if (existingRecipeIngredient) {
        existingRecipeIngredient.quantity = quantity;
        existingRecipeIngredient.unit = unit;

        //associated ingredient (ing.ingredient.name)
        if (existingRecipeIngredient.ingredient.name !== name) {
          //find it by name -- not found? -> create and save it
          let existingIng = await ingredientsRepository.findOneBy({ name });
          if (!existingIng) {
            existingIng = ingredientsRepository.create({ name });
            await ingredientsRepository.save(existingIng);
          }
          //then update the existing RecipeIngredient with the new ingredient(existingIng)
          existingRecipeIngredient.ingredient = existingIng;
        }

        //save the updated RecipeIngredient and push it to the empty array
        await recipeIngredientRepository.save(existingRecipeIngredient);
        newIngredients.push(existingRecipeIngredient);
        continue;
      }
      //   }
      //   if (!RIngID) {
      //     //create a new RecipeIngredient
      //     console.log('Creating a new RecipeIngredient...'); ////
      //   }
    }

    if (!RIngID) {
      //if no existing RecipeIngredient create a new one ()
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

      console.log('New Recipe Ingredient(RIng):', RIng); ////

      await recipeIngredientRepository.save(RIng);
      recipe.ingredients.push(RIng);
      newIngredients.push(RIng);
      indexNumber++;
    }
  }
  console.log('New Ingredients:', newIngredients); ////
  return newIngredients;
};

//Instruction - RecipeInstruction
//TODOp
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
