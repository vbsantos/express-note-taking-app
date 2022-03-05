import { ErrorRequestHandler, Request } from 'express';

export interface CustomRequest extends Request {
  [x: string]: any;
}
export interface CustomErrorRequestHandler extends ErrorRequestHandler {
  [x: string]: any;
}

export interface INote {
  _id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  userId: string;
  [x: string]: any;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  createdAt: number;
  updatedAt: number;
  [x: string]: any;
}

export interface IDatabase {
  updateNote(userId: string, noteId: string, title: string, content: string): Promise<string>,
  getNotesByText(userId: string, search: string): Promise<INote[]>,
  getNotes(userId: string): Promise<INote[]>,
  getNoteById(userId: string, noteId: string): Promise<INote>,
  storeNote(userId: string, noteId: string, title: string, content: string): Promise<INote>,
  deleteNote(userId: string, noteId: string): Promise<string>,
  storeUser(userId: string, name: string, email: string, password: string): Promise<IUser>,
  getUserByEmail(email: string): Promise<IUser>,
}
