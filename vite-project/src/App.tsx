import "./App.css";
import { Route, Routes } from "react-router-dom";
import ErrorBoundary from "./common/components/error/ErrorBoundary";
import Posts from "./pages/Posts";

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/posts" element={<Posts />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
