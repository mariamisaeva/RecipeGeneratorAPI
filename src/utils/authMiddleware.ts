import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from '../types/express';

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res
      .status(401)
      .json({ success: false, message: 'Access token is missing or invalid.' });
    return;
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET as string,
    (err, decodedToken: JwtPayload) => {
      if (err) {
        res
          .status(403)
          .json({ success: false, message: 'Token is invalid or expired.' }); //forbidden
        return;
      }

      const { iat, exp, ...userRestDetails } = decodedToken;

      req.user = userRestDetails;

      next();
    },
  );
};
