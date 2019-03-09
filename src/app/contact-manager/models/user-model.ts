import { NoteModel } from './note-model';

export class UserModel {
  id: number = -1;
  birthDate: Date = new Date();
  name: string = '';
  avatar: string = '';
  bio: string = '';

  notes: NoteModel[] = [];
}
