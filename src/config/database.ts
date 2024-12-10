import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
dotenv.config();
import { Recipe } from '../entities/Recipe';
import { Instruction } from '../entities/Instruction';
import { Ingredient } from '../entities/Ingredient';
import { RecipeIngredient } from '../entities/RecipeIngredient';
import { RecipeInstruction } from '../entities/RecipeInstruction';
// import { User } from '../entities/User';
// import { FavoriteRecipe } from '../entities/FavoriteRecipe';

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: DB_HOST,
  port: Number(DB_PORT),
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  entities: [
    Recipe,
    Instruction,
    Ingredient,
    RecipeInstruction,
    RecipeIngredient,
    // User,
    // FavoriteRecipe,
  ], //schemas
  synchronize: true, // this will auto create tables based on the entities
  // set to FALSE in production to avoid data loss
  logging: false, // set to TRUE to see the SQL queries in the console
  migrations: [],
  subscribers: [],
});

export const dbConnection = AppDataSource.initialize()
  .then(() => {
    console.log(' ✅ Database connected successfully');
  })
  .catch((err) => {
    console.log(' ❌ Error connecting to the database:', err);
  });

//ASYNC..AWAIT
// async function initializeDatabase() {
//   try {
//     await AppDataSource.initialize();
//     console.log('Database connected successfully');
//   } catch (err) {
//     console.log('Error connecting to the database:', err);
//   }
// }

// initializeDatabase();
