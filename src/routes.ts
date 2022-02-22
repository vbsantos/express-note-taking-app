import {
  Router,
  Request,
  Response,
  ErrorRequestHandler,
  NextFunction,
} from 'express';

import {
  INote,
  getNoteById,
  getNotes,
  addNote,
  deleteNote,
  getNotesByText,
  updateNote,
} from './database';

const routes: Router = Router();

routes.get('/', (_req: Request, res: Response) => {
  res.redirect('/notes');
});

routes.get('/notes', (req: Request, res: Response) => {
  const previewSize: number = 175;
  const { search } = req.query;
  const notes = !search ? getNotes() : getNotesByText(search.toString());
  res.render('notes.ejs', { notes, previewSize });
});

routes.get('/notes/add', (_req: Request, res: Response) => {
  res.render('addNote.ejs');
});

routes.get('/notes/:noteId', (req: Request, res: Response) => {
  const { noteId } = req.params;
  const note: INote = getNoteById(noteId);
  if (!note) {
    const error = {
      code: 404,
      body: 'Error 404: Sorry, note not found 📖',
    };
    res.status(error.code).render('error.ejs', { error });
    return;
  }
  res.render('note.ejs', { note });
});

routes.get('/notes/:noteId/edit', (req: Request, res: Response) => {
  const { noteId } = req.params;
  const note: INote = getNoteById(noteId);
  if (!note) {
    const error = {
      code: 404,
      body: 'Error 404: Sorry, note not found 📖',
    };
    res.status(error.code).render('error.ejs', { error });
    return;
  }
  res.render('editNote.ejs', { note });
});

routes.post('/notes/store', (req: Request, res: Response) => {
  const { title, content } = req.body;
  addNote({ title, content });
  res.redirect('/notes');
});

routes.post('/notes/delete', (req: Request, res: Response) => {
  const { noteId } = req.body;
  deleteNote(noteId);
  res.redirect('/notes');
});

routes.post('/notes/update', (req: Request, res: Response) => {
  const { noteId, title, content } = req.body;
  updateNote(noteId, title, content);
  res.redirect(`/notes/${noteId}`);
});

routes.use((_req: Request, res: Response, next: NextFunction) => {
  next();
  const error = { code: 404, body: 'Error 404: Sorry, page not found 📖' };
  res.status(error.code).render('error.ejs', { error });
});

routes.use((err: ErrorRequestHandler, _req: Request, res: Response, next: NextFunction) => {
  next();
  const error = { code: 500, body: 'Error 500: Sorry, try again later 📖', details: JSON.stringify(err.toString(), undefined, 2) };
  res.status(error.code).render('error.ejs', { error });
});

export { routes };
