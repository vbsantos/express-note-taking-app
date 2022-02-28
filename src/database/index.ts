import mongoose from 'mongoose';
import { IDatabase, INote } from '../types';
import { Note } from '../models';

class Database implements IDatabase {
  private mongoDbConnectionString;

  private db;

  constructor(mongoDbConnectionString: string) {
    this.mongoDbConnectionString = mongoDbConnectionString;
    this.connect();
  }

  connect = async (): Promise<void> => {
    this.db = mongoose.connection;
    this.db.on('error', console.error.bind(console, '[\x1b[31mDATABASE ERROR\x1b[0m]')); // REVIEW LOGGER
    await mongoose.connect(this.mongoDbConnectionString);
  };

  getNotes = async (): Promise<INote[]> => {
    const notes: INote[] = await Note.find().exec();
    return notes;
  };

  getNoteById = async (noteId: string): Promise<INote> => {
    const note: INote = await Note.findById(noteId).exec();
    return note;
  };

  updateNote = async (noteId: string, title: string, content: string): Promise<string> => {
    const note: INote = await Note.findByIdAndUpdate(noteId, { title, content }).exec();
    return note._id;
  };

  getNotesByText = async (search: string): Promise<INote[]> => {
    const notes: INote[] = await Note.find({ $text: { $search: search } }).exec();
    return notes;
  };

  storeNote = async (noteId: string, title: string, content: string): Promise<INote> => {
    const newNote: INote = new Note({ _id: noteId, title, content });
    const note = await newNote.save();
    return note;
  };

  deleteNote = async (noteId: string): Promise<string> => {
    const note: INote = await Note.findOneAndDelete({ _id: noteId }).exec();
    return note._id;
  };
}

export const database = new Database(process.env.MONGO_URL);
