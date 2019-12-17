import { User } from '../auth/user';

export interface Chat extends User {
  id: string;
  text: string;
}
