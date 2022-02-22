import express, { Application } from 'express';
import { routes } from './routes';

const app: Application = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(routes);

export { app };
