import "./App.css";
import { Route, Routes } from "react-router-dom";
import ErrorBoundary from "./common/components/error/ErrorBoundary";
import Posts from "./pages/Posts";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <Routes>
          <Route path="/posts" element={<Posts />} />
        </Routes>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
