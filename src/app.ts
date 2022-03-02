import express, { Application } from 'express';

import { middleware } from './middleware';

export const app: Application = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// static files
app.use(express.static('public'));

// note routes
app.use(noteRouter);

// custom middleware
app.use(middleware.pageNotFoundView);
app.use(middleware.serverErrorLogger);
app.use(middleware.serverErrorHandler);
