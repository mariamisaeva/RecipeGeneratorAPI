import { AppDataSource } from './database';
import { Recipe, CategoryEnum } from '../entities/Recipe';
import { User } from '../entities/User';
import { Ingredient } from '../entities/Ingredient';
import { Instruction } from '../entities/Instruction';
import { RecipeIngredient } from '../entities/RecipeIngredient';
import { RecipeInstruction } from '../entities/RecipeInstruction';
import { FavoriteRecipe } from '../entities/FavoriteRecipe';
import { faker } from '@faker-js/faker';
import { Ingredient_TS, Instruction_TS, Recipe_TS } from '../types/types';
// Initialize the database connection
(async () => {
  try {
    const dataSource = await AppDataSource.initialize();
    console.log(' ✅ Database connected!');

    // 1. Seed Users
    const users = [];
    for (let i = 0; i < 5; i++) {
      const user = new User();
      user.username = faker.internet.username();
      user.email = faker.internet.email();
      user.password = faker.internet.password({ length: 8 }); // Strong password
      user.createdAt = new Date();
      users.push(user);
    }
    await dataSource.getRepository(User).save(users);
    console.log(' 🧑‍💻 Seeded 5 users.');

    // 2. Seed Ingredients
    const ingredients = [];
    for (let i = 0; i < 20; i++) {
      const ingredient = new Ingredient();
      ingredient.name = faker.commerce.productName();
      ingredients.push(ingredient);
    }
    await dataSource.getRepository(Ingredient).save(ingredients);
    console.log(' 🥗 Seeded 20 ingredients.');

    // 3. Seed Instructions
    const instructions = [];
    for (let i = 0; i < 50; i++) {
      const instruction = new Instruction();
      instruction.step = faker.lorem.sentence();
      instructions.push(instruction);
    }
    await dataSource.getRepository(Instruction).save(instructions);
    console.log(' 📝 Seeded 50 instructions.');

    // 4. Seed Recipes
    const recipes = [];
    const recipeIngredients: RecipeIngredient[] = [];
    const recipeInstructions: RecipeInstruction[] = [];
    for (let i = 0; i < 30; i++) {
      const recipe = new Recipe();
      recipe.title = faker.lorem.words(3);
      recipe.description = faker.lorem.sentences(2);
      recipe.isVegetarian = faker.datatype.boolean();
      recipe.servings = faker.number.int({ min: 1, max: 6 });
      recipe.time = `${faker.number.int({ min: 10, max: 120 })} minutes`;
      recipe.category = faker.helpers.arrayElement(Object.values(CategoryEnum));
      recipe.createdAt = new Date();
      recipe.updatedAt = new Date();
      recipe.author = faker.helpers.arrayElement(users); // Random user as author

      // Associate ingredients
      const selectedIngredients = faker.helpers.arrayElements(
        ingredients,
        faker.number.int({ min: 3, max: 8 }),
      );
      selectedIngredients.forEach((ingredient, index) => {
        const recipeIngredient = new RecipeIngredient();
        recipeIngredient.recipe = recipe;
        recipeIngredient.ingredient = ingredient;
        recipeIngredient.quantity = faker.number.float({ min: 0.1, max: 5 });
        recipeIngredient.unit = faker.helpers.arrayElement([
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
      const selectedInstructions = faker.helpers.arrayElements(
        instructions,
        faker.number.int({ min: 3, max: 5 }),
      );
      selectedInstructions.forEach((instruction, index) => {
        const recipeInstruction = new RecipeInstruction();
        recipeInstruction.recipe = recipe;
        recipeInstruction.instruction = instruction;
        recipeInstruction.stepNumber = index + 1;
        recipeInstructions.push(recipeInstruction);
      });

      recipes.push(recipe);
    }
    await dataSource.getRepository(Recipe).save(recipes);
    console.log(' 🍳 Seeded 30 recipes.');

    // Save RecipeIngredient and RecipeInstruction
    await dataSource.getRepository(RecipeIngredient).save(recipeIngredients);
    console.log(' 🥘 Linked recipes with ingredients.');
    await dataSource.getRepository(RecipeInstruction).save(recipeInstructions);
    console.log(' 📖 Linked recipes with instructions.');

    console.log('🎉 Database seeding completed!');
  } catch (error) {
    console.error(' ❌ Error during seeding:', error);
  } finally {
    await AppDataSource.destroy();
  }
})();

// for (let i = 0; i < 10; i++) {
//   const newUser = new User();
//   newUser.username = faker.internet.userName();
//   newUser.email = faker.internet.email();
//   newUser.password = faker.internet.password();
//   user.push(newUser);
// }
