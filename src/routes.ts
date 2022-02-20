import { Router, Request, Response } from 'express';

const routes: Router = Router();

routes.get('/', (_req: Request, res: Response) => {
  res.sendStatus(200);
});

export { routes };
