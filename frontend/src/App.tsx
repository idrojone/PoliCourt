import "./App.css";
import { Routes, Route } from "react-router-dom";
import { DashboardPage } from "./pages/private/DashboardPage";
import { IndexPage } from "./pages/public/IndexPage";
import { CourtPage } from "./pages/public/CourtPage";
import { ClubPage } from "./pages/public/ClubPage";
import { Login } from "./pages/public/Login";
import { Register } from "./pages/public/Register";
import { Profile } from "./pages/public/Profile";
import { PublicOnly } from "./guards/PublicOnly";
import { AdminOnly } from "./guards/AdminOnly";


function App() {
    return (
        <Routes>
            {/*Dashboard*/}
            <Route element={<AdminOnly redirectPath="/login" />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/dashboard/:page" element={<DashboardPage />} />
            </Route>

            {/* Public */}
            <Route path="/" element={<IndexPage />} />
            <Route path="/pistas" element={<CourtPage />} />
            <Route path="/clubes" element={<ClubPage />} />
            <Route path="/profile/:username" element={<Profile />} />

            {/* Auth */}
            <Route element={<PublicOnly />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Route>
        </Routes>
    );
}

export default App;
