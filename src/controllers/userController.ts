import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validate } from 'class-validator';
import { User } from '../entities/User';
import { filterUserInfo } from '../utils/filterUserInfo';
import { Recipe } from '../entities/Recipe';

const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      res
        .status(400)
        .json({ success: false, message: 'All fields are required.' });
      return;
    }

    //Grab the repository
    const userRepository = AppDataSource.getRepository(User);
    const existingUser = await userRepository.findOne({
      where: [{ username }, { email }],
    });
    if (existingUser) {
      res.status(409).json({ success: false, message: 'User already exists' });
      return;
    }

    //Create a new user, validation, and hash the password
    const newUser = userRepository.create({
      username,
      email,
      password,
    });

    //Validate the user
    const validationErrors = await validate(newUser);
    if (validationErrors.length > 0) {
      const formattedErrors = validationErrors.map((error) => {
        return {
          field: error.property,
          message: error.constraints
            ? Object.values(error.constraints)
            : 'Validation error',
        };
      });

      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: formattedErrors,
      });
      return;
    }

    const saltRounds = 10;
    newUser.password = await bcrypt.hash(password, saltRounds);

    //Save the user
    await userRepository.save(newUser);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//Login user
const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      res
        .status(400)
        .json({ success: false, message: 'All fields are required' });
      return;
    }

    //Grab the repository
    const userRepository = AppDataSource.getRepository(User);
    //look for email
    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      res
        .status(404)
        .json({ success: false, message: 'Invalid email or password' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user!.password);
    if (!isPasswordValid) {
      res
        .status(401)
        .json({ success: false, message: 'Invalid email or password' });
      return;
    }

    //generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' },
    );

    res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//Get current user
const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  const safeUser = filterUserInfo(req.user);

  try {
    res.status(200).json({
      success: true,
      message: 'User profile retrieved successfully',
      data: safeUser,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//Get user recipes
const getUserRecipes = async (req: Request, res: Response): Promise<void> => {
  //preview the user recipes
  try {
    const { userId } = req.params;

    console.log('userId:', userId);
    console.log('req.user:', req.user);
    console.log('req.user.id:', req.user.id);

    if (!req.user || req.user.userId !== userId) {
      res.status(403).json({ success: false, message: 'Unauthorized access' });
      return;
    }

    const recipeRepository = AppDataSource.getRepository(Recipe);

    const userRecipes = await recipeRepository.find({
      where: { author: { id: userId } },
      relations: [
        'author',
        'ingredients',
        'ingredients.ingredient',
        'instructions',
        'instructions.instruction',
      ],
      order: { createdAt: 'DESC' },
    });

    console.log('userRecipes:', userRecipes);

    if (userRecipes.length === 0) {
      res
        .status(404)
        .json({ success: false, message: 'No recipes found for this user' });
    }

    // Format response
    const formattedRecipes = userRecipes.map((recipe) => ({
      id: recipe.id,
      title: recipe.title,
      description: recipe.description,
      isVegetarian: recipe.isVegetarian,
      servings: recipe.servings,
      time: recipe.time,
      image: recipe.image,
      category: recipe.category,
      createdAt: recipe.createdAt,
      updatedAt: recipe.updatedAt,
      author: filterUserInfo(recipe.author),
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
    }));

    res.status(200).json({
      success: true,
      message: 'User recipes retrieved successfully',
      data: formattedRecipes,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export { registerUser, loginUser, getCurrentUser, getUserRecipes };
