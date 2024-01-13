import axios from "axios";

export default async (body: {
  mail: string;
  code: number;
}): Promise<{ status: number, results: { accessToken: string } }> => {
  body.code = +body.code

  const { data } = await axios.post("/code-verification/verify", body);

  return data
};
