import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
// import type { JwtPayload } from '../types/express';
import type { JwtPayload } from '../types/express';

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  //   console.log('Authenticating user...');
  const authHeader = req.headers.authorization;
  //   console.log('authHeader:', authHeader);

  const token = authHeader && authHeader.split(' ')[1];
  //   console.log('token:', token);
  if (!token) {
    res
      .status(401)
      .json({ success: false, message: 'Access token is missing or invalid.' });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decodedToken) => {
    if (err) {
      //   console.log('JWT verification error:', err);
      res
        .status(403)
        .json({ success: false, message: 'Token is invalid or expired.' }); //forbidden
      return;
    }
    // console.log('Decoded token:', decodedToken);
    req.user = decodedToken as JwtPayload;
    // console.log('req.user:', req.user);
    next();
  });
};
