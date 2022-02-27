import { Router } from 'express';

import { Database } from './database';
import { Controller } from './controller';

const database = new Database(process.env.MONGO_URL);

const controller = new Controller(database);

const routes: Router = Router();

routes.get('/', controller.goToMainPage);

routes.get('/notes', controller.notesView);

routes.get('/notes/:noteId', controller.noteByIdView);

routes.get('/notes/add', controller.storeNoteView);

routes.post('/notes/store', controller.storeNote);

routes.get('/notes/:noteId/edit', controller.getNoteByIdEditView);

routes.post('/notes/:noteId/update', controller.updateNote);

routes.post('/notes/:noteId/delete', controller.deleteNote);

export { routes };
