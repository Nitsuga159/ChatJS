import axios from "axios";

export default async (mail: string): Promise<boolean> => {
  const {
    data: { success },
  }: { data: { success: boolean } } = await axios.post(
    `/code-verification/${mail}`
  );

  if (success) return true;

  throw "cannot create code verification";
};
