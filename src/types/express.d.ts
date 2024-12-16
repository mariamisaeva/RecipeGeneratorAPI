// import { JwtPayload } from 'jsonwebtoken';

declare module 'express-serve-static-core' {
  interface Request {
    user: { userId: string; email: string; username: string };
  }
}
export { JwtPayload };
