import {
  ErrorRequestHandler, NextFunction, Request, Response,
} from 'express';

export class Middleware {
  private sendPageNotFound = (res) => {
    res.status(404).render('error.ejs', {
      error: {
        code: 404,
        body: 'Error 404: Sorry, page not found 📖',
      },
    });
  };

  pageNotFoundView = (_req: Request, res: Response) => {
    this.sendPageNotFound(res);
  };

  serverErrorHandler = (
    err: ErrorRequestHandler,
    _req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    next();

    console.error(err); // REVIEW LOGGER

    if (err.toString() === 'Error: PAGE_NOT_FOUND') {
      this.sendPageNotFound(res);
    }

    res.status(500).render('error.ejs', {
      error: {
        code: 500,
        body: 'Error 500: Sorry, try again later 📖',
        details: JSON.stringify(err.toString(), undefined, 2),
      },
    });
  };
}
