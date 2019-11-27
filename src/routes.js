import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import SecretSantaController from './app/controllers/SecretSantaController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.post('/secret-santa', SecretSantaController.store);
routes.get('/secret-santa', SecretSantaController.index);
routes.get('/secret-santa/:id', SecretSantaController.index);
routes.get('/secret-santa/:id/cancel', SecretSantaController.cancel);
routes.put('/secret-santa/:id', SecretSantaController.update);

export default routes;
