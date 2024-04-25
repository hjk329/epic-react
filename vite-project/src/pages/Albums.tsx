import { Suspense, useDeferredValue, useState } from "react";
import { useAlbums } from "../albums/hooks/useAlbums";

const Albums = () => {
  const [query, setQuery] = useState("");

  const deferredQuery = useDeferredValue(query);

  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={(e) => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h3>{deferredQuery} 를 찾는중입니다</h3>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </>
  );
};

export default Albums;

const SearchResults = ({ query }: { query: string }) => {
  const { data } = useAlbums(query);

  return (
    <ul>
      {data?.map((album) => (
        <li key={album.id}>{album.title}</li>
      ))}
    </ul>
  );
};
