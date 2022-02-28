import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { IDatabase, INote } from '../types';

export class NoteController {
  private database: IDatabase;

  constructor(db: IDatabase) {
    this.database = db;
  }

  // redirect to the main page
  goToMainPage = (_req: Request, res: Response) => {
    res.redirect('/notes');
  };

  // index view - renders notes page
  notesView = async (req: Request, res: Response) => {
    const previewStringSize = 175;
    const { search } = req.query;
    const notes: INote[] = !search
      ? await this.database.getNotes()
      : await this.database.getNotesByText(search.toString());
    res.render('notes.ejs', { notes, previewStringSize });
  };

  // show view - renders note page
  noteByIdView = async (req: Request, res: Response, next: NextFunction) => {
    const { noteId } = req.params;
    const note: INote = await this.database.getNoteById(noteId);
    if (!note) {
      next();
      return;
    }
    res.render('note.ejs', { note });
  };

  // store view - renders a page with a form to add a note
  storeNoteView = (_req: Request, res: Response) => {
    res.render('storeNote.ejs');
  };

  // edit view - renders a page with a form for editing a note
  getNoteByIdEditView = async (req: Request, res: Response, next: NextFunction) => {
    const { noteId } = req.params;
    const note: INote = await this.database.getNoteById(noteId);
    if (!note) {
      next();
      return;
    }
    res.render('editNote.ejs', { note });
  };

  // store
  storeNote = async (req: Request, res: Response, next: NextFunction) => {
    const { title, content } = req.body;
    if (!title || !content) next();
    const noteId = uuidv4();
    await this.database.storeNote(noteId, title, content);
    res.redirect('/notes');
  };

  // update
  updateNote = async (req: Request, res: Response, next: NextFunction) => {
    const { title, content } = req.body;
    if (!title || !content) next();
    const { noteId } = req.params;
    await this.database.updateNote(noteId, title, content);
    res.redirect(`/notes/${noteId}`);
  };

  // delete
  deleteNote = async (req: Request, res: Response) => {
    const { noteId } = req.params;
    await this.database.deleteNote(noteId);
    res.redirect('/notes');
  };
}
