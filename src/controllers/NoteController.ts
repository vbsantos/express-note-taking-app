import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestError, NotFoundError } from '../errors';

import { IDatabase, INote } from '../types';

export class NoteController {
  private database: IDatabase;

  private previewStringSize = 175;

  constructor(db: IDatabase) {
    this.database = db;
  }

  // redirect to the main page
  goToMainPage = (_req: Request, res: Response) => res.redirect('/notes');

  // index view - renders notes page
  notesView = async (req: Request, res: Response) => {
    const { search } = req.query;
    const hasFilter = !!search;
    const notes: INote[] = hasFilter
      ? await this.database.getNotesByText(search.toString())
      : await this.database.getNotes();
    return res.render('notes.ejs', { notes, previewStringSize: this.previewStringSize, hasFilter });
  };

  // show view - renders note page
  noteByIdView = async (req: Request, res: Response, next: NextFunction) => {
    const { noteId } = req.params;
    const note: INote = await this.database.getNoteById(noteId);
    if (!note) {
      return next(new NotFoundError('Note not found'));
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
      return next(new NotFoundError('Note not found'));
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
    return res.redirect('/notes');
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
