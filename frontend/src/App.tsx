import "./App.css";
import { Routes, Route } from "react-router-dom";
import { IndexPage } from "./pages/public/IndexPage";
import { DashboardPage } from "./pages/private/DashboardPage";
import { CourtPage } from "./pages/public/CourtPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />
      <Route path="/pistas" element={<CourtPage />} />

      {/*Dashboard*/}
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/dashboard/:page" element={<DashboardPage />} />
    </Routes>
  );
}

export default App;
