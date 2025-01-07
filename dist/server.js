"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = require("./config/database");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const recipeRoutes_1 = __importDefault(require("./routes/recipeRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
// import cors from 'cors';
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
app.use(express_1.default.json());
// app.use((req, res, next) => {
//   console.log(`[Global Middleware] Method: ${req.method}, URL: ${req.url}`);
//   console.log('Headers:', req.headers);
//   console.log('Params:', req.params);
//   console.log('Query:', req.query);
//   next();
// });
//api routes
app.use('/api/recipes', recipeRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
database_1.dbConnection
    .then(() => {
    app.listen(PORT, () => {
        console.log(` 🚀 Server is running on port ${PORT}`);
    });
})
    .catch((err) => {
    console.error(' ❌ Failed to start the server: ', err);
});
