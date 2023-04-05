export interface User {
  _id: string;
  mail: string;
  username: string;
  password: string;
  photo: string | null;
  connected: boolean;
  habilited: boolean;
}
