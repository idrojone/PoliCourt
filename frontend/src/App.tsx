import './App.css'
import { Routes, Route } from 'react-router-dom'
import { MainLayout } from './layout/MainLayout'
import { RegisterPage } from './pages/RegisterPage'
import { LoginPage } from './pages/LoginPage'
import { PublicOnly } from "./guards/PublicOnly";
import { useAuthContext } from "@/features/auth";
import { DashboardPage } from './pages/DashboardPage'
import { AdminOnly } from './guards/AdminOnly'
import { checkAdminRole } from './lib'
import { IndexPage } from './pages/IndexPage'
import { SportDetailPage } from './pages/SportDetailsPage'

function App() {

  	const { isAuthenticated, user } = useAuthContext();

    return (
      <Routes>
        <Route
          path="/register"
          element={
            <PublicOnly isAuthenticated={isAuthenticated}>
              <RegisterPage />
            </PublicOnly>
          }
        />
        <Route
          path="/login"
          element={
            <PublicOnly isAuthenticated={isAuthenticated}>
              <LoginPage />
            </PublicOnly>
          }
        />

        <Route
          path="/dashboard"
          element={
            <AdminOnly isAdmin={checkAdminRole(user)}>
              <DashboardPage />
            </AdminOnly>
          }
        />

        <Route path="/" element={<IndexPage />} />

        <Route path="/deportes/:slug" element={<SportDetailPage />} />
      </Routes>
    );
}

export default App
