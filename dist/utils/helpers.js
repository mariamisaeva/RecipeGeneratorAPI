"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUpdateInstructions = exports.handleUpdateIngredients = exports.handleInstructions = exports.handleIngredients = void 0;
const database_1 = require("../config/database");
const Ingredient_1 = require("../entities/Ingredient");
const RecipeIngredient_1 = require("../entities/RecipeIngredient");
const Instruction_1 = require("../entities/Instruction");
const RecipeInstruction_1 = require("../entities/RecipeInstruction");
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
const handleIngredients = (ingredients, recipe) => __awaiter(void 0, void 0, void 0, function* () {
    const ingredientsRepository = database_1.AppDataSource.getRepository(Ingredient_1.Ingredient);
    const recipeIngredientRepository = database_1.AppDataSource.getRepository(RecipeIngredient_1.RecipeIngredient);
    const newIngredients = [];
    let indexNumber = 0;
    for (const ing of ingredients) {
        const { quantity, unit, ingredient } = ing;
        const { name } = ingredient;
        if (!name) {
            throw new Error('Ingredient name is required.');
        }
        let singleIngredient = yield ingredientsRepository.findOneBy({ name });
        if (!singleIngredient) {
            singleIngredient = ingredientsRepository.create({ name });
            yield ingredientsRepository.save(singleIngredient);
        }
        //create RI object
        const RIng = recipeIngredientRepository.create({
            ingredient: singleIngredient,
            quantity,
            unit,
            recipe, //link to the recipe (to be retrieved correctly)
            indexNumber,
        });
        yield recipeIngredientRepository.save(RIng);
        newIngredients.push(RIng);
        indexNumber++;
    }
    return newIngredients;
});
exports.handleIngredients = handleIngredients;
//Instruction - RecipeInstruction
//pass in instructions //grab repos //create an empty array type RecipeInstruction[] // define a stepNumber starts from 1  //loop through instructions // findOneBy //not exists: create and save it //create new recipe object in the jointRepo with destructured data //save it to jointRepo //push to array + increment num //return
const handleInstructions = (instructions, recipe) => __awaiter(void 0, void 0, void 0, function* () {
    const instructionsRepository = database_1.AppDataSource.getRepository(Instruction_1.Instruction);
    const recipeInstructionRepository = database_1.AppDataSource.getRepository(RecipeInstruction_1.RecipeInstruction);
    const newInstructions = [];
    let stepNumber = 1;
    for (const { instruction: { step }, } of instructions) {
        // Validation for missing or empty step
        if (!step || step.trim() === '') {
            throw new Error('Instruction step is required.');
        }
        //USING TO CREATE A NEW INSTRUCTION (create-recipe)
        let singleInstruction = yield instructionsRepository.findOneBy({ step });
        if (!singleInstruction) {
            singleInstruction = instructionsRepository.create({ step });
            yield instructionsRepository.save(singleInstruction);
        }
        // Assign stepNumber: Use provided value or increment maxStepNumber
        const RIns = recipeInstructionRepository.create({
            instruction: singleInstruction, //instruction in RecipeInstruction
            recipe,
            stepNumber,
        });
        yield recipeInstructionRepository.save(RIns);
        newInstructions.push(RIns);
        stepNumber++;
    }
    return newInstructions;
});
exports.handleInstructions = handleInstructions;
//UPDATE INGREDIENTS
const handleUpdateIngredients = (ingredients, recipe) => __awaiter(void 0, void 0, void 0, function* () {
    //grab repos
    const ingredientsRepository = database_1.AppDataSource.getRepository(Ingredient_1.Ingredient);
    const recipeIngredientRepository = database_1.AppDataSource.getRepository(RecipeIngredient_1.RecipeIngredient);
    //create an empty array type RecipeIngredient[]
    const updatedIngredients = [];
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
        let existingRIng = null;
        //if RIngID exists, find the existing RecipeIngredient by id
        if ( /*isUpdate &&*/RIngID) {
            existingRIng = yield recipeIngredientRepository.findOne({
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
                    let existingIngredient = yield ingredientsRepository.findOneBy({
                        name,
                    });
                    //if not found, create and save it
                    if (!existingIngredient) {
                        existingIngredient = ingredientsRepository.create({ name });
                        yield ingredientsRepository.save(existingIngredient);
                    }
                    existingRIng.ingredient = existingIngredient;
                }
                //save the updated RecipeIngredient and push it to the empty array
                yield recipeIngredientRepository.save(existingRIng);
                updatedIngredients.push(existingRIng);
                continue; //go to the next iteration
            }
        }
        //if no existing RecipeIngredient create a new one
        //find the ingredient by name -- not found? -> create and save it
        let singleIngredient = yield ingredientsRepository.findOneBy({ name });
        if (!singleIngredient) {
            singleIngredient = ingredientsRepository.create({ name });
            yield ingredientsRepository.save(singleIngredient);
        }
        //create RI object
        const newRI = recipeIngredientRepository.create({
            ingredient: singleIngredient,
            quantity,
            unit,
            recipe,
            indexNumber,
        });
        yield recipeIngredientRepository.save(newRI);
        updatedIngredients.push(newRI);
        indexNumber++;
    }
    //DELETE EXCLUDED RecipeIngredients
    if (updatedIngredients.length < recipe.ingredients.length) {
        const deletedIngredients = recipe.ingredients.filter((ri) => !updatedIngredients.some((uRIng) => uRIng.id === ri.id));
        yield recipeIngredientRepository.remove(deletedIngredients);
    }
    //PROBLEM: The new ingredients are not reflected in the recipe object.
    //SOLUTION: Reload 'recipe.ingredients' from the DB with the updated ingredients
    recipe.ingredients = yield recipeIngredientRepository.find({
        where: { recipe: { id: recipe.id } },
        relations: ['ingredient'],
    });
    return updatedIngredients;
});
exports.handleUpdateIngredients = handleUpdateIngredients;
const handleUpdateInstructions = (instructions, recipe) => __awaiter(void 0, void 0, void 0, function* () {
    const instructionsRepository = database_1.AppDataSource.getRepository(Instruction_1.Instruction);
    const recipeInstructionRepository = database_1.AppDataSource.getRepository(RecipeInstruction_1.RecipeInstruction);
    const newInstructions = [];
    //   let stepNumber = 1;
    let maxStepNumber = 1;
    //   if (isUpdate) {
    const currentInstructions = yield recipeInstructionRepository.find({
        where: { recipe: { id: recipe.id } },
    });
    maxStepNumber = currentInstructions.reduce((max, ins) => Math.max(max, ins.stepNumber), 1);
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
        let existingRecipeInst = null;
        if ( /*isUpdate && */RInsID) {
            //if the RIid exists
            // grab it
            existingRecipeInst = yield recipeInstructionRepository.findOne({
                where: { id: RInsID },
                relations: ['instruction'],
            });
            //if found
            if (existingRecipeInst) {
                // Retain current stepNumber unless explicitly updated
                existingRecipeInst.stepNumber =
                    stepNumber !== null && stepNumber !== void 0 ? stepNumber : existingRecipeInst.stepNumber;
                if (step && existingRecipeInst.instruction.step !== step) {
                    let existingInst = yield instructionsRepository.findOneBy({ step });
                    if (!existingInst) {
                        existingInst = instructionsRepository.create({ step });
                        yield instructionsRepository.save(existingInst);
                    }
                    existingRecipeInst.instruction = existingInst;
                }
                //save the updated RecipeInstruction and push it to the empty array
                yield recipeInstructionRepository.save(existingRecipeInst);
                newInstructions.push(existingRecipeInst);
                continue;
            }
        }
        //USING TO CREATE A NEW INSTRUCTION (create-recipe)
        let singleInstruction = yield instructionsRepository.findOneBy({ step });
        if (!singleInstruction) {
            singleInstruction = instructionsRepository.create({ step });
            yield instructionsRepository.save(singleInstruction);
        }
        // Assign stepNumber: Use provided value or increment maxStepNumber
        const newStepNumber = stepNumber !== null && stepNumber !== void 0 ? stepNumber : ++maxStepNumber;
        const RIns = recipeInstructionRepository.create({
            instruction: singleInstruction, //instruction in RecipeInstruction
            recipe,
            stepNumber: newStepNumber,
        });
        yield recipeInstructionRepository.save(RIns);
        newInstructions.push(RIns);
        // stepNumber++;
    }
    //DELETE EXCLUDED INSTRUCTIONS
    if (newInstructions.length < recipe.instructions.length) {
        const deletedInstructions = recipe.instructions.filter((ri) => !newInstructions.some((uRIns) => uRIns.id === ri.id));
        yield recipeInstructionRepository.remove(deletedInstructions);
    }
    //Reload recipe.instructions
    recipe.instructions = yield recipeInstructionRepository.find({
        where: { recipe: { id: recipe.id } },
        relations: ['instruction'],
    });
    return newInstructions;
});
exports.handleUpdateInstructions = handleUpdateInstructions;
