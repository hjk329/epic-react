import "./App.css";
import { Route, Routes } from "react-router-dom";
import ErrorBoundary from "./common/components/error/ErrorBoundary";
import Posts from "./pages/Posts";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Albums from "./pages/Albums";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <Routes>
          <Route path="/posts" element={<Posts />} />
          <Route path="albums" element={<Albums />} />
        </Routes>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
