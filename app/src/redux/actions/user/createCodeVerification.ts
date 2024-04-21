import axios from "axios";

export default async (mail: string): Promise<{ status: number, result: { success: true } }> => {
  const { data } = await axios.post(
    '/code-verification',
    { mail }
  );

  return data
};
