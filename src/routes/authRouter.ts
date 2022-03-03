import { Router } from 'express';
import { database } from '../database';
import { AuthController } from '../controllers';

const authRouter: Router = Router();
const authController = new AuthController(database);

authRouter.get('/register', authController.registerView);

authRouter.get('/login', authController.loginView);

authRouter.post('/register', authController.register);

authRouter.post('/login', authController.login);

authRouter.get('/logout', authController.logout);

export { authRouter };
