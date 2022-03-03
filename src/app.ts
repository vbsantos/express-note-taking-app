import express, { Application } from 'express';
import cookieParser from 'cookie-parser';

import { middleware } from './middleware';
import { authRouter, noteRouter } from './routes';

export const app: Application = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// static files
app.use(express.static('public'));

// auth routes
app.use(authRouter);

// auth middleware
app.use(middleware.authenticateToken);

// note routes
app.use(noteRouter);

// custom middleware
app.use(middleware.pageNotFoundView);
app.use(middleware.serverErrorLogger);
app.use(middleware.serverErrorHandler);
