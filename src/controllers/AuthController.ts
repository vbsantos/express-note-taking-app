import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import JWT from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { IDatabase, IUser } from '../types';
import { BadRequestError, DatabaseError } from '../errors';
import { registrationSchema, loginSchema } from '../validation';

export class AuthController {
  private database: IDatabase;

  private jwtExpiresIn = 9000;

  constructor(db: IDatabase) {
    this.database = db;
  }

  // register view - renders user registration page
  registerView = async (_req: Request, res: Response) => {
    res.render('register.ejs', { editMode: false });
  };

  // login view - renders user login page
  loginView = async (_req: Request, res: Response) => {
    res.render('login.ejs', { editMode: false });
  };

  // store
  register = async (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = registrationSchema.validate(req.body);
    const { name, email, password } = value;

    if (error) {
      return next(new BadRequestError(error.details[0]?.message, {
        user: { name, email },
        at: 'register',
      }));
    }

    let emailAlreadyRegistred: boolean;
    try {
      emailAlreadyRegistred = !!await this.database.getUserByEmail(email);
    } catch (_error) {
      next(new DatabaseError('Database failed to fetch user'));
    }

    if (emailAlreadyRegistred) {
      return next(new BadRequestError('Email is already registred', {
        user: { name, email },
        at: 'register',
      }));
    }

    const generatedId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);

    let user: IUser;
    try {
      user = await this.database.storeUser(generatedId, name, email, hashedPassword);
    } catch (_error) {
      next(new DatabaseError('Database failed to store user'));
    }

    // generate jwt
    const token = JWT.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: this.jwtExpiresIn,
    });

    // send jwt to client
    const cookieOptions = { httpOnly: true, sameSite: true, maxAge: 259200000 };
    res.cookie('authToken', token, cookieOptions);

    return res.redirect('/');
  };

  // show
  login = async (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = loginSchema.validate(req.body);
    const { email, password } = value;

    if (error) {
      return next(new BadRequestError(error.details[0]?.message, {
        user: { email },
        at: 'login',
      }));
    }

    let user: IUser;
    try {
      user = await this.database.getUserByEmail(email);
    } catch (_error) {
      next(new DatabaseError('Database failed to fetch user'));
    }

    if (!user) {
      return next(new BadRequestError('Email is not registred', {
        user: { email },
        at: 'login',
      }));
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return next(new BadRequestError('Password incorrect', {
        user: { email },
        at: 'login',
      }));
    }

    // generate jwt
    const token = JWT.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: this.jwtExpiresIn,
    });

    // send jwt to client
    const cookieOptions = { httpOnly: true, sameSite: true, maxAge: 259200000 };
    res.cookie('authToken', token, cookieOptions);

    return res.redirect('/');
  };

  // remove cookie authToken and redirect to root
  logout = async (_req: Request, res: Response) => {
    res.clearCookie('authToken').redirect('/');
  };
}
