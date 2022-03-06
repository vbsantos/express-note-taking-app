import { NextFunction, Response } from 'express';
import JWT from 'jsonwebtoken';

import { CustomRequest } from '../types';

class AuthMiddleware {
  authenticateToken = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) => {
    const { authToken } = req.cookies;
    if (!authToken) {
      return res.redirect('/login');
    }
    try {
      const { user } = await JWT.verify(
        authToken,
        process.env.ACCESS_TOKEN_SECRET,
      );
      req.user = { _id: user._id, name: user.name, email: user.email };
      return next();
    } catch (error) {
      return res.redirect('/login');
    }
  };
}

export const authMiddleware = new AuthMiddleware();
