import "./App.css";
import { Routes, Route } from "react-router-dom";
import { DashboardPage } from "./pages/private/DashboardPage";
import { IndexPage } from "./pages/public/IndexPage";
import { CourtPage } from "./pages/public/CourtPage";
import { ClubPage } from "./pages/public/ClubPage";


function App() {
    return (
        <Routes>
            {/*Dashboard*/}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/:page" element={<DashboardPage />} />

            {/* Public */}
            <Route path="/" element={<IndexPage />} />
            <Route path="/pistas" element={<CourtPage />} />
            <Route path="/clubes" element={<ClubPage />} />
        </Routes>
    );
}

export default App;
