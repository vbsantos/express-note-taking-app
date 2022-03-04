import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestError, NotFoundError } from '../errors';

import { CustomRequest, IDatabase, INote } from '../types';

export class NoteController {
  private database: IDatabase;

  private previewStringSize = 150;

  constructor(db: IDatabase) {
    this.database = db;
  }

  // redirect to the home page
  redirectToHomePage = (_req: Request, res: Response) => res.redirect('/notes');

  // index view - renders notes page
  notesView = async (req: CustomRequest, res: Response) => {
    const { user } = req;
    const { search } = req.query;
    const userFirstName = user.name.split(' ')[0];
    const notes: INote[] = search
      ? await this.database.getNotesByText(search.toString())
      : await this.database.getNotes();
    return res.render('notes.ejs', {
      userFirstName,
      notes,
      previewStringSize: this.previewStringSize,
      search,
    });
  };

  // show view - renders note page
  noteByIdView = async (req: Request, res: Response, next: NextFunction) => {
    const { noteId } = req.params;
    const note: INote = await this.database.getNoteById(noteId);
    if (!note) {
      return next(new NotFoundError('Page not found'));
    }
    return res.render('note.ejs', { note });
  };

  // store view - renders a page with a form to add a note
  storeNoteView = (_req: Request, res: Response) => res.render('storeNote.ejs');

  // edit view - renders a page with a form for editing a note
  updateNoteView = async (req: Request, res: Response, next: NextFunction) => {
    const { noteId } = req.params;
    const note: INote = await this.database.getNoteById(noteId);
    if (!note) {
      return next(new NotFoundError('Page not found'));
    }
    return res.render('editNote.ejs', { note });
  };

  // store
  storeNote = async (req: Request, res: Response, next: NextFunction) => {
    const { title, content } = req.body;
    if (!title || !content) {
      return next(new BadRequestError('Required field is missing', {
        note: { title, content },
        at: 'storeNote',
      }));
    }
    const noteId = uuidv4();
    await this.database.storeNote(noteId, title, content);
    return res.redirect(`/notes/${noteId}`);
  };

  // update
  updateNote = async (req: Request, res: Response, next: NextFunction) => {
    const { noteId } = req.params;
    const { title, content } = req.body;
    if (!title || !content) {
      return next(new BadRequestError('Required field is missing', {
        note: { _id: noteId, title, content },
        at: 'editNote',
      }));
    }
    await this.database.updateNote(noteId, title, content);
    return res.redirect(`/notes/${noteId}`);
  };

  // delete
  deleteNote = async (req: Request, res: Response) => {
    const { noteId } = req.params;
    await this.database.deleteNote(noteId);
    return res.redirect('/notes');
  };
}
