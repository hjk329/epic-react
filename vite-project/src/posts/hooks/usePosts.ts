import { useQuery, type UseQueryOptions, type UseQueryResult } from "@tanstack/react-query"
import { getPosts } from "../api/getPosts";

type Return = Awaited<ReturnType<typeof getPosts>>;

export const GET_POSTS_KEY = "posts";

export const usePosts = (options?: UseQueryOptions<Return>): UseQueryResult<Return> => {
  return useQuery({
    queryKey: [GET_POSTS_KEY],
    queryFn: () => getPosts(),
    ...options,
  });
}
