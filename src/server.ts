import express from 'express';
import { dbConnection } from './config/database';
import dotenv from 'dotenv';
dotenv.config();
import recipeRoutes from './routes/recipeRoutes';
import userRoutes from './routes/userRoutes';
// import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

// app.use((req, res, next) => {
//   console.log(`[Global Middleware] Method: ${req.method}, URL: ${req.url}`);
//   console.log('Headers:', req.headers);
//   console.log('Params:', req.params);
//   console.log('Query:', req.query);
//   next();
// });
//api routes
app.use('/api/recipes', recipeRoutes);
app.use('/api/users', userRoutes);

dbConnection
  .then(() => {
    app.listen(PORT, () => {
      console.log(` 🚀 Server is running on port ${PORT}`);
    });
  })

  .catch((err: any) => {
    console.error(' ❌ Failed to start the server: ', err);
  });
