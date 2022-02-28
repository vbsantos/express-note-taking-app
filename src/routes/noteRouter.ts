import { Router } from 'express';
import { database } from '../database';
import { NoteController } from '../controllers';

const noteRouter: Router = Router();
const noteController = new NoteController(database);

noteRouter.get('/', noteController.goToMainPage);

noteRouter.get('/notes', noteController.notesView);

noteRouter.get('/notes/:noteId', noteController.noteByIdView);

noteRouter.get('/notes/add', noteController.storeNoteView);

noteRouter.get('/notes/:noteId/edit', noteController.getNoteByIdEditView);

noteRouter.post('/notes/store', noteController.storeNote);

noteRouter.post('/notes/:noteId/update', noteController.updateNote);

noteRouter.post('/notes/:noteId/delete', noteController.deleteNote);

export { noteRouter };
