import axios from "axios";

export default async (mail: string): Promise<{ status: number, results: { success: true } }> => {
  const { data } = await axios.post(
    '/code-verification',
    { mail }
  );

  return data
};
