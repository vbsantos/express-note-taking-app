import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import JWT from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { IDatabase, IUser } from '../types';
import { BadRequestError } from '../errors/BadRequestError';

export class AuthController {
  private database: IDatabase;

  private jwtExpiresIn = 9000;

  constructor(db: IDatabase) {
    this.database = db;
  }

  private validateEmail = (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return String(email).toLowerCase().match(re);
  };

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
    const { name }: { name: string } = req.body;
    const { email }: { email: string } = req.body;
    const { password }: { password: string } = req.body;
    const { password2 }: { password2: string } = req.body;

    if (name === '' || email === '' || password === '' || password2 === '') {
      return next(new BadRequestError('Required field is missing', {
        user: { name, email },
        at: 'register',
      }));
    }

    if (password !== password2) {
      return next(new BadRequestError('Passwords do not match', {
        user: { name, email },
        at: 'register',
      }));
    }

    const isValidEmail = this.validateEmail(email);
    if (!isValidEmail) {
      return next(new BadRequestError('Email is invalid', {
        user: { name, email },
        at: 'register',
      }));
    }

    const emailAlreadyRegistred = !!await this.database.getUserByEmail(email);
    if (emailAlreadyRegistred) {
      return next(new BadRequestError('Email is already registred', {
        user: { name, email },
        at: 'register',
      }));
    }

    const generatedId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    const user: IUser = await this.database.storeUser(generatedId, name, email, hashedPassword);

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
    const { email }: { email: string } = req.body;
    const { password }: { password: string } = req.body;

    if (email === '' || password === '') {
      return next(new BadRequestError('Required field is missing', {
        user: { email },
        at: 'login',
      }));
    }

    const user = await this.database.getUserByEmail(email);
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

  // remove cookie authToken and redirect to main page
  logout = async (_req: Request, res: Response) => {
    res.clearCookie('authToken').redirect('/');
  };
}
