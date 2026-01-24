import "./App.css";
import { Routes, Route } from "react-router-dom";
import { IndexPage } from "./pages/public/IndexPage";
import { DashboardPage } from "./pages/private/DashboardPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />

      {/*Dashboard*/}
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/dashboard/:page" element={<DashboardPage />} />
    </Routes>
  );
}

export default App;
