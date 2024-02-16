import ky from "ky";
import { z } from "zod";

export const getPosts = async () => {
    try {
      const response = await ky
        .get("https://jsonplaceholder.typicode.com/posts")
        .json<PostResponse>();
  
      if (!response) throw new Error("No response");
  
      const typeValidatedResponse = PostResponseScheme.safeParse(response);
  
      if (!typeValidatedResponse.success)
        throw new Error(typeValidatedResponse.error.errors[0].message);
  
      return response;
    } catch (error) {
      console.error(error);
    }
  };

  const PostScheme = z.object({
    userId: z.number(),
    id: z.number(),
    title: z.string(),
    body: z.string(),
  });
  
  const PostResponseScheme = z.array(PostScheme);
  
  type PostResponse = z.infer<typeof PostResponseScheme>;