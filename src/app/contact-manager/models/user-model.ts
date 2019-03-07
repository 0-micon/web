import { NoteModel } from './note-model';

export class UserModel {
  id: number;
  birthDate: Date;
  name: string;
  avatar: string;
  bio: string;

  notes: NoteModel[];
}
