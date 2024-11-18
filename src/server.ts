import express from 'express';
import { dbConnection } from './config/database';
import dotenv from 'dotenv';
// import cors from 'cors';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

dbConnection
  .then(() => {
    app.listen(PORT, () => {
      console.log(` 🚀 Server is running on port ${PORT}`);
    });
  })

  .catch((err: any) => {
    console.error(' ❌ Failed to start the server: ', err);
  });
