import express, { Application } from 'express';

import { Middleware } from './middleware';
import { noteRouter } from './routes';

const middleware = new Middleware();

export const app: Application = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// static files
app.use(express.static('public'));

// routes
app.use(noteRouter);

// custom middleware
app.use(middleware.pageNotFoundView);
app.use(middleware.serverErrorLogger);
app.use(middleware.serverErrorHandler);
