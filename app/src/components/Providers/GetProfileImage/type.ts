export type TGetProfileImageContext = (
  image: File,
  onCompleted: (image: File) => void
) => void;

export interface IGetProfileImageProps {
  show: boolean;
  image?: File;
  onCompleted?: (image: File) => void;
}
