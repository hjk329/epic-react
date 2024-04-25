import {
  UseSuspenseQueryOptions,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { getAlbums } from "../api/getAlbums";

type Return = Awaited<ReturnType<typeof getAlbums>>;

export const useAlbums = (
  query: string,
  options?: UseSuspenseQueryOptions<Return>
) => {
  return useSuspenseQuery({
    queryKey: ["albums", query],
    queryFn: async () => {
      const response = await getAlbums();
      return response.filter(({ title }: { title: string }) =>
        title.includes(query)
      );
    },
    ...options,
  });
};
