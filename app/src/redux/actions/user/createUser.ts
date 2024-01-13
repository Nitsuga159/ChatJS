import axios from "axios";

export default async (
  data: {
    mail: string;
    username: string;
    password: string;
  },
  mailToken: string
): Promise<boolean> => {
  await axios.post(`/user/register?tokenMail=${mailToken}`, data);

  return true;
};
