import express from 'express';
import { dbConnection } from './config/database';
import dotenv from 'dotenv';
dotenv.config();
import recipeRoutes from './routes/recipeRoutes';
// import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

//api routes
app.use('/api/recipes', recipeRoutes);

dbConnection
  .then(() => {
    app.listen(PORT, () => {
      console.log(` 🚀 Server is running on port ${PORT}`);
    });
  })

  .catch((err: any) => {
    console.error(' ❌ Failed to start the server: ', err);
  });
