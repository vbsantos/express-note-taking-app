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
    await mongoose.connect(this.mongoDbConnectionString);
  };

  getNotes = async (userId: string): Promise<INote[]> => {
    const notes: INote[] = await Note.find().where('userId', userId).exec();
    return notes;
  };

  getNotesByText = async (userId: string, search: string): Promise<INote[]> => {
    const notes: INote[] = await Note.find({ $text: { $search: search } })
      .where('userId', userId)
      .exec();
    return notes;
  };

  getNoteById = async (userId: string, noteId: string): Promise<INote> => {
    const note: INote = await Note.findById(noteId)
      .where('userId', userId)
      .exec();
    return note;
  };

  updateNote = async (
    userId: string,
    noteId: string,
    title: string,
    content: string,
  ): Promise<string> => {
    const note: INote = await Note.findOneAndUpdate(
      {
        _id: noteId,
        userId,
      },
      {
        title,
        content,
      },
    ).exec();
    return note._id;
  };

  storeNote = async (
    userId: string,
    noteId: string,
    title: string,
    content: string,
  ): Promise<INote> => {
    const newNote: INote = new Note({
      _id: noteId,
      title,
      content,
      userId,
    });
    const note = await newNote.save();
    return note;
  };

  deleteNote = async (userId: string, noteId: string): Promise<string> => {
    const note: INote = await Note.findOneAndDelete({
      _id: noteId,
      userId,
    }).exec();
    return note._id;
  };

  storeUser = async (
    userId: string,
    name: string,
    email: string,
    hashedPassword: string,
  ): Promise<IUser> => {
    const newUser: IUser = new User({
      _id: userId,
      name,
      email,
      password: hashedPassword,
    });
    const user = await newUser.save();
    return user;
  };

  getUserByEmail = async (email: string): Promise<IUser> => {
    const user: IUser = await User.findOne({
      email,
    }).exec();
    return user;
  };
}

export const database = new Database(process.env.MONGO_URL);
