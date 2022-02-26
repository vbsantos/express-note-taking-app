export interface INote {
  _id: string;
  createdAt: number;
  updatedAt: number;
  title: string;
  content: string;
  [x: string]: any;
}

export interface IDatabase {
  updateNote(noteId: string, title: string, content: string): Promise<string>,
  getNotesByText(search: string): Promise<INote[]>,
  getNotes(): Promise<INote[]>,
  getNoteById(noteId: string): Promise<INote>,
  storeNote(noteId: string, title: string, content: string): Promise<INote>,
  deleteNote(noteId: string): Promise<string>,
}
