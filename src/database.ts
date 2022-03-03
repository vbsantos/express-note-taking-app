import mongoose from 'mongoose';
import { IDatabase, INote, IUser } from './types';
import { Note, User } from './models';
import { DatabaseError } from './errors';

class Database implements IDatabase {
  private mongoDbConnectionString;

  private db;

  constructor(mongoDbConnectionString: string) {
    this.mongoDbConnectionString = mongoDbConnectionString;
    this.connect();
  }

  connect = async (): Promise<void> => {
    try {
      this.db = mongoose.connection;
      this.db.on('error', console.error.bind(console, '[\x1b[31mDATABASE ERROR\x1b[0m]')); // REVIEW LOGGER
      await mongoose.connect(this.mongoDbConnectionString);
    } catch (error) {
      throw new DatabaseError('Database failed to connect');
    }
  };

  getNotes = async (): Promise<INote[]> => {
    try {
      const notes: INote[] = await Note.find().exec();
      return notes;
    } catch (error) {
      throw new DatabaseError('Database failed to fetch notes');
    }
  };

  getNoteById = async (noteId: string): Promise<INote> => {
    try {
      const note: INote = await Note.findById(noteId).exec();
      return note;
    } catch (error) {
      throw new DatabaseError('Database failed to fetch note');
    }
  };

  updateNote = async (noteId: string, title: string, content: string): Promise<string> => {
    try {
      const note: INote = await Note.findByIdAndUpdate(noteId, { title, content }).exec();
      return note._id;
    } catch (error) {
      throw new DatabaseError('Database failed to update note');
    }
  };

  getNotesByText = async (search: string): Promise<INote[]> => {
    try {
      const notes: INote[] = await Note.find({ $text: { $search: search } }).exec();
      return notes;
    } catch (error) {
      throw new DatabaseError('Database failed to search notes');
    }
  };

  storeNote = async (noteId: string, title: string, content: string): Promise<INote> => {
    try {
      const newNote: INote = new Note({ _id: noteId, title, content });
      const note = await newNote.save();
      return note;
    } catch (error) {
      throw new DatabaseError('Database failed to store note');
    }
  };

  deleteNote = async (noteId: string): Promise<string> => {
    try {
      const note: INote = await Note.findOneAndDelete({ _id: noteId }).exec();
      return note._id;
    } catch (error) {
      throw new DatabaseError('Database failed to delete note');
    }
  };

  storeUser = async (
    userId: string,
    name: string,
    email: string,
    hashedPassword: string,
  ): Promise<IUser> => {
    try {
      const newUser: IUser = new User({
        _id: userId, name, email, password: hashedPassword,
      });
      const user = await newUser.save();
      return user;
    } catch (error) {
      throw new DatabaseError('Database failed to store user');
    }
  };

  getUserByEmail = async (email: string): Promise<IUser> => {
    try {
      const user: IUser = await User.findOne({ email }).exec();
      return user;
    } catch (error) {
      throw new DatabaseError('Database failed to fetch user');
    }
  };
}

export const database = new Database(process.env.MONGO_URL);
