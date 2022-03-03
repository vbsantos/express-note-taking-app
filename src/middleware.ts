import {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from 'express';
import JWT from 'jsonwebtoken';

import {
  BadRequestError, DatabaseError, NotFoundError, UnauthorizedError,
} from './errors';

class Middleware {
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

  serverErrorLogger = (
    err: ErrorRequestHandler,
    _req: Request,
    _res: Response,
    next: NextFunction,
  ) => {
    console.error('[\x1b[31mSERVER ERROR\x1b[0m]', err); // REVIEW LOGGER
    next(err);
  };

  pageNotFoundView = (_req: Request, res: Response, next: NextFunction) => {
    next();

    this.sendErrorPage(res, new NotFoundError('This page does not exist'));
  };

  serverErrorHandler = (
    err: ErrorRequestHandler,
    _req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    next();

    if (err instanceof UnauthorizedError) {
      res.redirect('/login');
    }

    if (err instanceof BadRequestError) {
      if (err.at === 'login') {
        res.render('login.ejs', { user: err.user, error: err.message });
      }
      if (err.at === 'register') {
        res.render('register.ejs', { user: err.user, error: err.message });
      }
      if (err.at === 'storeNote') {
        res.render('storeNote.ejs', { note: err.note, error: err.message });
      }
      if (err.at === 'editNote') {
        res.render('editNote.ejs', { note: err.note, error: err.message });
      }
    }

    if (err instanceof NotFoundError || err instanceof DatabaseError) {
      this.sendErrorPage(res, err);
    }

    res.status(500).render('error.ejs', {
      error: {
        code: 500,
        title: 'Error 500: Sorry, try again later 📝',
        description: err.toString(),
      },
    });
  };

  // FIXME descobrir como adicionar User no tipo Request
  authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    const { authToken } = req.cookies;
    if (authToken) {
      try {
        const { user } = await JWT.verify(authToken, process.env.ACCESS_TOKEN_SECRET);
        req.user = { _id: user._id, name: user.name, email: user.email };
        return next();
      } catch (error) {
        console.log('[\x1b[31mAUTH ERROR\x1b[0m]', error); // REVIEW LOGGER
      }
    }

    return next(new UnauthorizedError('You do not have permission'));
    // return res.redirect('/login');
  };
}

export const middleware = new Middleware();
