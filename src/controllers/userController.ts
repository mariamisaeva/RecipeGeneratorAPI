import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validate } from 'class-validator';
import { User } from '../entities/User';

export const registerUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
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
export const loginUser = async (req: Request, res: Response): Promise<void> => {
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
      { userId: user.id },
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
