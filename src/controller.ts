import { Request, Response } from 'express';

import { INote, IDatabase } from './database';

export class Controller {
  private database: IDatabase;

  constructor(database: IDatabase) {
    this.database = database;
  }

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

  // index view - renders notes page
  notesView = (req: Request, res: Response) => {
    const previewStringSize = 175;
    const { search } = req.query;
    const notes = !search
      ? this.database.getNotes()
      : this.database.getNotesByText(search.toString());
    res.render('notes.ejs', { notes, previewStringSize });
  };

  // show view - renders note page
  noteByIdView = (req: Request, res: Response) => {
    const { noteId } = req.params;
    const note: INote = this.database.getNoteById(noteId);
    if (!note) throw new Error('PAGE_NOT_FOUND');
    res.render('note.ejs', { note });
  };

  // store view - renders a page with a form to add a note
  storeNoteView = (_req: Request, res: Response) => {
    res.render('storeNote.ejs');
  };

  // edit view - renders a page with a form for editing a note
  getNoteByIdEditView = (req: Request, res: Response) => {
    const { noteId } = req.params;
    const note: INote = this.database.getNoteById(noteId);
    if (!note) throw new Error('PAGE_NOT_FOUND');
    res.render('editNote.ejs', { note });
  };
}
