import { NextFunction, Request, Response } from 'express';

import { IDatabase, INote } from './types';

export class Controller {
  private database: IDatabase;

  constructor(database: IDatabase) {
    this.database = database;
  }

  // index view - renders notes page
  notesView = (req: Request, res: Response) => {
    const previewStringSize = 175;
    const { search } = req.query;
    const notes: INote[] = !search
      ? this.database.getNotes()
      : this.database.getNotesByText(search.toString());
    res.render('notes.ejs', { notes, previewStringSize });
  };

  // show view - renders note page
  noteByIdView = (req: Request, res: Response, next: NextFunction) => {
    const { noteId } = req.params;
    const note: INote = this.database.getNoteById(noteId);
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
  getNoteByIdEditView = (req: Request, res: Response, next: NextFunction) => {
    const { noteId } = req.params;
    const note: INote = this.database.getNoteById(noteId);
    if (!note) {
      next();
      return;
    }
    res.render('editNote.ejs', { note });
  };

  // store
  storeNote = (req: Request, res: Response) => {
    const { title, content } = req.body;
    this.database.storeNote(title, content);
    res.redirect('/notes');
  };

  // update
  updateNote = (req: Request, res: Response) => {
    const { noteId, title, content } = req.body;
    this.database.updateNote(noteId, title, content);
    res.redirect(`/notes/${noteId}`);
  };

  // delete
  deleteNote = (req: Request, res: Response) => {
    const { noteId } = req.body;
    this.database.deleteNote(noteId);
    res.redirect('/notes');
  };

  // redirect to the main page
  goToMainPage = (_req: Request, res: Response) => {
    res.redirect('/notes');
  };
}
