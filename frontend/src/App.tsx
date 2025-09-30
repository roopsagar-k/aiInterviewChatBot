import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import IndexPage  from "./pages/index-page";
import { ThemeProvider } from "./components/ui/theme-provider";
import InterviewerPage from "./pages/interviewer-page";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Routes>
          <Route index element={<IndexPage />} />
          <Route path={"/interviewer"} element={<InterviewerPage />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
