export type User = {
  state: "waiting" | "logged" | "not logged";
  loading: boolean;
  data: {
    id: string;
    username: string;
    description: string;
    mail: string;
    photo: string;
    token: string;
  } | null;
};

export type UserRegister = {
  mail: string;
  username: string;
  password: string;
  "repeat-password": string;
};
