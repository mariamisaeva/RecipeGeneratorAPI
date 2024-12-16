import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('Authenticating user...');
  const authHeader = req.headers.authorization;
  console.log('authHeader:', authHeader);

  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res
      .status(401)
      .json({ success: false, message: 'Access token is missing or invalid.' });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decodedToken) => {
    if (err) {
      res
        .status(403)
        .json({ success: false, message: 'Token is invalid or expired.' }); //forbidden
      return;
    }

    req.user = decodedToken as JwtPayload;
    next();
  });
};
