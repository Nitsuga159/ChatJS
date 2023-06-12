import { User } from "@/types/user.type";
import utils from "@/utils";
import axios from "axios";

const loginToken = async (token: string): Promise<User> => {
  await new Promise<void>((resolve) =>
    setTimeout(() => {
      resolve();
    }, 2000)
  );

  const { data } = await axios.get(
    "/user/login-token",
    utils.createHeaderToken(token)
  );

  return data;
};

export default loginToken;
