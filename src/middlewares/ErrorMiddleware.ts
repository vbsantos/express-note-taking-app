import { NextFunction, Request, Response } from 'express';

import { BadRequestError, DatabaseError, NotFoundError } from '../errors';
import { CustomErrorRequestHandler } from '../types';

class ErrorMiddleware {
  private sendErrorPage = (response: Response, error) => {
    response.status(error.statusCode).render(error.view, {
      error: {
        code: error.statusCode,
        title: `📝 ${error.message}`,
        description: `Error ${error.statusCode}: ${error.name}`,
        stack: error.stack,
      },
    });
  };

  pageNotFoundView = (_req: Request, res: Response, next: NextFunction) => {
    next();

    this.sendErrorPage(res, new NotFoundError('This page does not exist'));
  };

  serverErrorHandler = (
    err: CustomErrorRequestHandler,
    _req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    next();

    if (err instanceof BadRequestError) {
      const local = err.at;
      const { statusCode } = err;

      if (local === 'login') {
        return res.status(statusCode).render('login.ejs', {
          user: err.user,
          error: err.message,
        });
      }
      if (local === 'register') {
        return res.status(statusCode).render('register.ejs', {
          user: err.user,
          error: err.message,
        });
      }
      if (local === 'storeNote') {
        return res.status(statusCode).render('storeNote.ejs', {
          note: err.note,
          error: err.message,
        });
      }
      if (local === 'editNote') {
        return res.status(statusCode).render('editNote.ejs', {
          note: err.note,
          error: err.message,
        });
      }
    }

    if (err instanceof NotFoundError || err instanceof DatabaseError) {
      return this.sendErrorPage(res, err);
    }

    return res.status(500).render('error.ejs', {
      error: {
        code: 500,
        title: 'Error 500: Sorry, try again later 📝',
        description: err.toString(),
      },
    });
  };
}

export const errorMiddleware = new ErrorMiddleware();
