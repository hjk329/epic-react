import ky from "ky";
import { z } from "zod";

export const getAlbums = async () => {
  const response = await ky
    .get("https://jsonplaceholder.typicode.com/albums")
    .json<AlbumsResponse>();

  const typeValidation = AlbumsSchema.safeParse(response);
  if (!typeValidation.success) {
    throw new Error(typeValidation.error.errors.join(", "));
  }

  return response;
};

const AlbumSchema = z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
});

const AlbumsSchema = z.array(AlbumSchema);

type AlbumsResponse = z.infer<typeof AlbumsSchema>;
