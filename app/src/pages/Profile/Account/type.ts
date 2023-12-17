export interface IChangesAccount {
  username: string;
  color: string;
  description: string;
  photo: { file: File | null; url: string | null };
}
