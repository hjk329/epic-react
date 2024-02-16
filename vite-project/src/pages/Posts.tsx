import ky from "ky";
import { useEffect, useState } from "react";
import { z } from "zod";

const PostScheme = z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
  body: z.string(),
});

const PostResponseScheme = z.array(PostScheme);

type PostResponse = z.infer<typeof PostResponseScheme>;

const Posts = () => {
  const [postsResponse, setPostsResponse] = useState<PostResponse>();

  const getPosts = async () => {
    try {
      const response = await ky
        .get("https://jsonplaceholder.typicode.com/posts")
        .json<PostResponse>();

      if (!response) throw new Error("No response");

      const typeValidatedResponse = PostResponseScheme.safeParse(response);

      if (!typeValidatedResponse.success)
        throw new Error(typeValidatedResponse.error.errors[0].message);

      setPostsResponse(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div>
      <h1>Posts</h1>
      {postsResponse?.map((post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.body}</p>
        </div>
      ))}
    </div>
  );
};

export default Posts;
