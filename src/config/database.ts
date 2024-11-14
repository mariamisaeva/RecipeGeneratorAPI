import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
dotenv.config();

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
console.log(DB_HOST);
console.log(DB_PORT);
console.log(DB_NAME);
console.log(DB_PASSWORD);
console.log(DB_USER);

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: DB_HOST,
  port: Number(DB_PORT),
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  entities: [],
  synchronize: true, // this will auto create tables based on the entities
  // set to FALSE in production to avoid data loss
  logging: false, // set to TRUE to see the SQL queries in the console
});

//THEN..CATCH
AppDataSource.initialize()
  .then()
  .catch((err) => {
    console.log('Error connecting to the database:', err);
  });

//ASYNC..AWAIT
//TRY..CATCH
// async function initializeDatabase() {
//   try {
//     await AppDataSource.initialize();
//     console.log('Database connected successfully');
//   } catch (err) {
//     console.log('Error connecting to the database:', err);
//   }
// }

// initializeDatabase();
