// import { JwtPayload } from 'jsonwebtoken';

declare module 'express-serve-static-core' {
  interface Request {
    user: JwtPayload | { userId: string; email?: string; username?: string };
  }
}
export { JwtPayload };
