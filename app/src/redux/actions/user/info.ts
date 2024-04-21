import { User } from "@/types/user.type";
import utils from "@/utils";
import axios from "axios";

const info = async (token: string): Promise<{ status: number, result: User}> => {
  const { data } = await axios.get(
    "/user/info",
    utils.createHeaderToken(token)
  );

  return data;
};

export default info;
