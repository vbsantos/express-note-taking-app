import { Router } from 'express';
import { database } from '../database';
import { NoteController } from '../controllers';

const noteRouter: Router = Router();
const noteController = new NoteController(database);

noteRouter.get('/', noteController.goToMainPage);

noteRouter.get('/notes', noteController.notesView);

noteRouter.get('/notes/create', noteController.storeNoteView);

noteRouter.post('/notes/create', noteController.storeNote);

noteRouter.get('/notes/:noteId/edit', noteController.updateNoteView);

noteRouter.get('/notes/:noteId', noteController.noteByIdView);

noteRouter.post('/notes/:noteId/update', noteController.updateNote);

noteRouter.post('/notes/:noteId/delete', noteController.deleteNote);

export { noteRouter };
