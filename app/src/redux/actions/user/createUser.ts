import axios from "axios";

export default async (
  data: {
    mail: string;
    username: string;
    password: string;
  },
  mailToken: string
): Promise<boolean> => {
  await axios.post("/user", data, {
    headers: { Authorization: `Bearer ${mailToken}` },
  });

  return true;
};
