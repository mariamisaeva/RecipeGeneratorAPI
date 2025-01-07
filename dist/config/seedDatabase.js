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
const database_1 = require("./database");
const Recipe_1 = require("../entities/Recipe");
const User_1 = require("../entities/User");
const Ingredient_1 = require("../entities/Ingredient");
const Instruction_1 = require("../entities/Instruction");
const RecipeIngredient_1 = require("../entities/RecipeIngredient");
const RecipeInstruction_1 = require("../entities/RecipeInstruction");
const faker_1 = require("@faker-js/faker");
// Initialize the database connection
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dataSource = yield database_1.AppDataSource.initialize();
        console.log(' ✅ Database connected!');
        // 1. Seed Users
        const users = [];
        for (let i = 0; i < 5; i++) {
            const user = new User_1.User();
            user.username = faker_1.faker.internet.username();
            user.email = faker_1.faker.internet.email();
            user.password = faker_1.faker.internet.password({ length: 8 }); // Strong password
            user.createdAt = new Date();
            users.push(user);
        }
        yield dataSource.getRepository(User_1.User).save(users);
        console.log(' 🧑‍💻 Seeded 5 users.');
        // 2. Seed Ingredients
        const ingredients = [];
        for (let i = 0; i < 20; i++) {
            const ingredient = new Ingredient_1.Ingredient();
            ingredient.name = faker_1.faker.commerce.productName();
            ingredients.push(ingredient);
        }
        yield dataSource.getRepository(Ingredient_1.Ingredient).save(ingredients);
        console.log(' 🥗 Seeded 20 ingredients.');
        // 3. Seed Instructions
        const instructions = [];
        for (let i = 0; i < 50; i++) {
            const instruction = new Instruction_1.Instruction();
            instruction.step = faker_1.faker.lorem.sentence();
            instructions.push(instruction);
        }
        yield dataSource.getRepository(Instruction_1.Instruction).save(instructions);
        console.log(' 📝 Seeded 50 instructions.');
        // 4. Seed Recipes
        const recipes = [];
        const recipeIngredients = [];
        const recipeInstructions = [];
        for (let i = 0; i < 30; i++) {
            const recipe = new Recipe_1.Recipe();
            recipe.title = faker_1.faker.lorem.words(3);
            recipe.description = faker_1.faker.lorem.sentences(2);
            recipe.isVegetarian = faker_1.faker.datatype.boolean();
            recipe.servings = faker_1.faker.number.int({ min: 1, max: 6 });
            recipe.time = `${faker_1.faker.number.int({ min: 10, max: 120 })} minutes`;
            recipe.category = faker_1.faker.helpers.arrayElement(Object.values(Recipe_1.CategoryEnum));
            recipe.createdAt = new Date();
            recipe.updatedAt = new Date();
            recipe.author = faker_1.faker.helpers.arrayElement(users); // Random user as author
            // Associate ingredients
            const selectedIngredients = faker_1.faker.helpers.arrayElements(ingredients, faker_1.faker.number.int({ min: 3, max: 8 }));
            selectedIngredients.forEach((ingredient, index) => {
                const recipeIngredient = new RecipeIngredient_1.RecipeIngredient();
                recipeIngredient.recipe = recipe;
                recipeIngredient.ingredient = ingredient;
                recipeIngredient.quantity = faker_1.faker.number.float({ min: 0.1, max: 5 });
                recipeIngredient.unit = faker_1.faker.helpers.arrayElement([
                    'kg',
                    'g',
                    'l',
                    'ml',
                    'tsp',
                    'tbsp',
                    'cup',
                ]);
                recipeIngredient.indexNumber = index + 1;
                recipeIngredients.push(recipeIngredient);
            });
            // Associate instructions
            const selectedInstructions = faker_1.faker.helpers.arrayElements(instructions, faker_1.faker.number.int({ min: 3, max: 5 }));
            selectedInstructions.forEach((instruction, index) => {
                const recipeInstruction = new RecipeInstruction_1.RecipeInstruction();
                recipeInstruction.recipe = recipe;
                recipeInstruction.instruction = instruction;
                recipeInstruction.stepNumber = index + 1;
                recipeInstructions.push(recipeInstruction);
            });
            recipes.push(recipe);
        }
        yield dataSource.getRepository(Recipe_1.Recipe).save(recipes);
        console.log(' 🍳 Seeded 30 recipes.');
        // Save RecipeIngredient and RecipeInstruction
        yield dataSource.getRepository(RecipeIngredient_1.RecipeIngredient).save(recipeIngredients);
        console.log(' 🥘 Linked recipes with ingredients.');
        yield dataSource.getRepository(RecipeInstruction_1.RecipeInstruction).save(recipeInstructions);
        console.log(' 📖 Linked recipes with instructions.');
        console.log('🎉 Database seeding completed!');
    }
    catch (error) {
        console.error(' ❌ Error during seeding:', error);
    }
    finally {
        yield database_1.AppDataSource.destroy();
    }
}))();
// for (let i = 0; i < 10; i++) {
//   const newUser = new User();
//   newUser.username = faker.internet.userName();
//   newUser.email = faker.internet.email();
//   newUser.password = faker.internet.password();
//   user.push(newUser);
// }
