export type User = {
  state: "waiting" | "logged" | "not logged";
  data: {
    id: string;
    username: string;
    description: string;
    mail: string;
    photo: string;
    token: string;
  } | null;
};
