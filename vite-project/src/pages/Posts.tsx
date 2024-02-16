import { usePosts } from "../posts/hooks/usePosts";

const Posts = () => {
  const { data: postsResponse } = usePosts();

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
