import axios from "axios";

export default async (data: {
  mail: string;
  code: string;
}): Promise<string | null> => {
  const {
    data: { result },
  } = await axios.post("/code-verification", data);

  if (result) return result;

  throw "Invalid code";
};
