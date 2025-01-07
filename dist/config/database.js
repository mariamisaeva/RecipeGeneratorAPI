"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnection = exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const Recipe_1 = require("../entities/Recipe");
const Instruction_1 = require("../entities/Instruction");
const Ingredient_1 = require("../entities/Ingredient");
const RecipeIngredient_1 = require("../entities/RecipeIngredient");
const RecipeInstruction_1 = require("../entities/RecipeInstruction");
const User_1 = require("../entities/User");
const FavoriteRecipe_1 = require("../entities/FavoriteRecipe");
const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: DB_HOST,
    port: Number(DB_PORT),
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    entities: [
        Recipe_1.Recipe,
        Instruction_1.Instruction,
        Ingredient_1.Ingredient,
        RecipeInstruction_1.RecipeInstruction,
        RecipeIngredient_1.RecipeIngredient,
        User_1.User,
        FavoriteRecipe_1.FavoriteRecipe,
    ], //schemas
    synchronize: true, // this will auto create tables based on the entities
    // set to FALSE in production to avoid data loss
    //   dropSchema: true, // set to TRUE to drop the schema and recreate the tables
    logging: false, // set to TRUE to see the SQL queries in the console
    migrations: [],
    subscribers: [],
});
exports.dbConnection = exports.AppDataSource.initialize()
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
