import mongoose from 'mongoose';
import { IDatabase, INote, IUser } from './types';
import { Note, User } from './models';
import { DatabaseError } from './errors';

class Database implements IDatabase {
  private mongoDbConnectionString;

  constructor(mongoDbConnectionString: string) {
    this.mongoDbConnectionString = mongoDbConnectionString;
    this.connect();
  }

  connect = async (): Promise<void> => {
    try {
      await mongoose.connect(this.mongoDbConnectionString);
    } catch (error) {
      throw new DatabaseError('Database failed to connect');
    }
  };

  getNotes = async (userId: string): Promise<INote[]> => {
    try {
      const notes: INote[] = await Note.find().where('userId', userId).exec();
      return notes;
    } catch (error) {
      throw new DatabaseError('Database failed to fetch notes');
    }
  };

  getNotesByText = async (userId: string, search: string): Promise<INote[]> => {
    try {
      const notes: INote[] = await Note.find({ $text: { $search: search } }).where('userId', userId).exec();
      return notes;
    } catch (error) {
      throw new DatabaseError('Database failed to search notes');
    }
  };

  getNoteById = async (userId: string, noteId: string): Promise<INote> => {
    try {
      const note: INote = await Note.findById(noteId).where('userId', userId).exec();
      return note;
    } catch (error) {
      throw new DatabaseError('Database failed to fetch note');
    }
  };

  updateNote = async (
    userId: string,
    noteId: string,
    title: string,
    content: string,
  ): Promise<string> => {
    try {
      const note: INote = await Note.findOneAndUpdate({
        _id: noteId,
        userId,
      }, {
        title,
        content,
      }).exec();
      return note._id;
    } catch (error) {
      throw new DatabaseError('Database failed to update note');
    }
  };

  storeNote = async (
    userId: string,
    noteId: string,
    title: string,
    content: string,
  ): Promise<INote> => {
    try {
      const newNote: INote = new Note({
        _id: noteId,
        title,
        content,
        userId,
      });
      const note = await newNote.save();
      return note;
    } catch (error) {
      throw new DatabaseError('Database failed to store note');
    }
  };

  deleteNote = async (userId: string, noteId: string): Promise<string> => {
    try {
      const note: INote = await Note.findOneAndDelete({
        _id: noteId,
        userId,
      }).exec();
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
        _id: userId,
        name,
        email,
        password: hashedPassword,
      });
      const user = await newUser.save();
      return user;
    } catch (error) {
      throw new DatabaseError('Database failed to store user');
    }
  };

  getUserByEmail = async (email: string): Promise<IUser> => {
    try {
      const user: IUser = await User.findOne({
        email,
      }).exec();
      return user;
    } catch (error) {
      throw new DatabaseError('Database failed to fetch user');
    }
  };
}

export const database = new Database(process.env.MONGO_URL);
