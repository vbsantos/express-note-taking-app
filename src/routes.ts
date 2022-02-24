import { Router } from 'express';

import { Database } from './database';
import { Controller } from './controller';

const database = new Database();
const controller = new Controller(database);

const routes: Router = Router();

routes.get('/', controller.goToMainPage);

routes.get('/notes', controller.notesView);

routes.get('/notes/add', controller.storeNoteView);

routes.get('/notes/:noteId', controller.noteByIdView);

routes.get('/notes/:noteId/edit', controller.getNoteByIdEditView);

routes.post('/notes/store', controller.storeNote);

routes.post('/notes/update', controller.updateNote);

routes.post('/notes/delete', controller.deleteNote);

export { routes };
