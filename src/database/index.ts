import mongoose from 'mongoose';
import { IDatabase, INote } from '../types';
import Note from '../models/note';

export class Database implements IDatabase {
  private mongoDbConnectionString;

  private db;

  constructor(mongoDbConnectionString: string) {
    this.mongoDbConnectionString = mongoDbConnectionString;
    this.connect();
    this.db = mongoose.connection;
    this.db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  }

  connect = async (): Promise<void> => {
    await mongoose.connect(this.mongoDbConnectionString);
  };

  getNotes = async (): Promise<INote[]> => {
    const notes: INote[] = await Note.find();
    return notes;
  };

  getNoteById = async (noteId: string): Promise<INote> => {
    const note: INote = await Note.findById(noteId);
    return note;
  };

  updateNote = async (noteId: string, title: string, content: string): Promise<string> => {
    const note: INote = await Note.findByIdAndUpdate(noteId, { title, content });
    return note._id;
  };

  getNotesByText = async (search: string): Promise<INote[]> => {
    const notes: INote[] = await Note.find({ $text: { $search: search } });
    return notes;
  };

  storeNote = async (noteId: string, title: string, content: string): Promise<INote> => {
    const note: INote = await Note.create({ _id: noteId, title, content });
    return note;
  };

  deleteNote = async (noteId: string): Promise<string> => {
    const note: INote = await Note.findOneAndDelete({ _id: noteId });
    return note._id;
  };
}
