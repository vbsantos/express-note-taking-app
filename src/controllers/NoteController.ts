import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { BadRequestError, DatabaseError, NotFoundError } from '../errors';
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
  notesView = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { search } = req.query;
    const userId = req.user._id;

    let notes: INote[];
    if (search) {
      try {
        notes = await this.database.getNotesByText(userId, search.toString());
      } catch (error) {
        return next(new DatabaseError('Database failed to fetch notes'));
      }
    } else {
      try {
        notes = await this.database.getNotes(userId);
      } catch (error) {
        return next(new DatabaseError('Database failed to search notes'));
      }
    }

    return res.render('notes.ejs', {
      userFirstName: req.user.name.split(' ')[0],
      notes,
      previewStringSize: this.previewStringSize,
      search,
    });
  };

  // show view - renders note page
  noteByIdView = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { noteId } = req.params;
    let note: INote;
    try {
      note = await this.database.getNoteById(req.user._id, noteId);
    } catch (error) {
      return next(new DatabaseError('Database failed to fetch note'));
    }
    if (!note) {
      return next(new NotFoundError('Page not found'));
    }
    return res.render('note.ejs', { note });
  };

  // store view - renders a page with a form to add a note
  storeNoteView = (_req: Request, res: Response) => res.render('storeNote.ejs');

  // edit view - renders a page with a form for editing a note
  updateNoteView = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { noteId } = req.params;

    let note: INote;
    try {
      note = await this.database.getNoteById(req.user._id, noteId);
    } catch (error) {
      return next(new DatabaseError('Database failed to fetch note'));
    }

    if (!note) {
      return next(new NotFoundError('Page not found'));
    }

    return res.render('editNote.ejs', { note });
  };

  // store
  storeNote = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { title, content } = req.body;

    if (!title || !content) {
      return next(new BadRequestError('Required field is missing', {
        note: { title, content },
        at: 'storeNote',
      }));
    }

    const noteId = uuidv4();

    try {
      await this.database.storeNote(req.user._id, noteId, title, content);
    } catch (error) {
      return next(new DatabaseError('Database failed to store note'));
    }

    return res.redirect(`/notes/${noteId}`);
  };

  // update
  updateNote = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { noteId } = req.params;
    const { title, content } = req.body;

    if (!title || !content) {
      return next(new BadRequestError('Required field is missing', {
        note: { _id: noteId, title, content },
        at: 'editNote',
      }));
    }

    try {
      await this.database.updateNote(req.user._id, noteId, title, content);
    } catch (error) {
      return next(new DatabaseError('Database failed to update note'));
    }

    return res.redirect(`/notes/${noteId}`);
  };

  // delete
  deleteNote = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { noteId } = req.params;

    try {
      await this.database.deleteNote(req.user._id, noteId);
    } catch (error) {
      return next(new DatabaseError('Database failed to delete note'));
    }

    return res.redirect('/notes');
  };
}
