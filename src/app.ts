import express, { Application } from 'express';

import { Middleware } from './middleware';
import { routes } from './routes';

const middleware = new Middleware();

export const app: Application = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(routes);

// custom middleware
app.use(middleware.pageNotFoundView);
app.use(middleware.serverErrorHandler);
