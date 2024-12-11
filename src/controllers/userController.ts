import { Request, Response } from 'express';

export const createUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  //   const { username, email, password } = req.body;

  //   console.log(username);
  //   console.log(email);
  //   console.log(password);

  try {
    res.send('User created successfully');
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
