import axios from "axios";

export default async ({ images, accessToken }: { images: File[], accessToken: string }): Promise<string[]> => {
  const formData = new FormData();

  images.filter(img => img.type.includes("image"));

  images.forEach(img => formData.append('image', img));

  const { data }: { data: string[] } = await axios.post(
    '/cloudinary/upload',
    formData,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  return data;
};