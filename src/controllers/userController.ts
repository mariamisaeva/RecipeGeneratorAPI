import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import bcrypt from 'bcrypt';
import { validate } from 'class-validator';
import { User } from '../entities/User';

export const createUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { username, email, password } = req.body;

  console.log(username);
  console.log(email);
  console.log(password);

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
    }

    //Create a new user and hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = userRepository.create({
      username,
      email,
      password: hashedPassword,
    });

    //Validate the user
    const validationErrors = await validate(newUser);
    if (validationErrors.length > 0) {
      res.status(400).json({ success: false, message: validationErrors });
      return;
    }

    //Save the user
    await userRepository.save(newUser);

    res
      .status(201)
      .json({
        success: true,
        message: 'User created successfully',
        data: newUser,
      });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
