import express, { Application } from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import { authMiddleware, errorMiddleware } from './middlewares';
import { authRouter, noteRouter } from './routes';

export const app: Application = express();

app.use(helmet());
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// static files
app.use(express.static('public'));

// auth routes
app.use(authRouter);

// middleware catch unauthorized access
app.use(authMiddleware.authenticateToken);

// note routes
app.use(noteRouter);

// middleware catch invalid routes
app.use(errorMiddleware.pageNotFoundView);

// middleware catch errors
app.use(errorMiddleware.serverErrorHandler);
