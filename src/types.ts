export interface INote {
  _id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
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
  updateNote(noteId: string, title: string, content: string): Promise<string>,
  getNotesByText(search: string): Promise<INote[]>,
  getNotes(): Promise<INote[]>,
  getNoteById(noteId: string): Promise<INote>,
  storeNote(noteId: string, title: string, content: string): Promise<INote>,
  deleteNote(noteId: string): Promise<string>,
  storeUser(userId: string, name: string, email: string, password: string): Promise<IUser>,
  getUserByEmail(email: string): Promise<IUser>,
}
