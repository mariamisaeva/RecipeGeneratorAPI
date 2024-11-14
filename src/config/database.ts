import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();
const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
console.log(process.env.DB_HOST);
console.log(process.env.DB_PORT);
console.log(process.env.DB_USERNAME);
console.log(process.env.DB_PASSWORD);
console.log(process.env.DB_NAME);

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [],
  synchronize: true, // this will auto create tables based on the entities
  // set to FALSE in production to avoid data loss
  logging: false, // set to TRUE to see the SQL queries in the console
});

//

async function initializeDatabase() {
  try {
  } catch (err) {
    console.log('Error connecting to the database:', err);
  }
}
