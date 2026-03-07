import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

import DashboardLayout from "./layout/DashboardLayout";

import Dashboard from "./pages/Dashboard";
import Vacancies from "./pages/Vacancies";
import Candidates from "./pages/Candidates";
import Kanban from "./pages/Kanban";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import MainPage from "./pages/MainPage";
import DashboardGuest from "./pages/DashboardGuest";
export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <DashboardLayout>
                  <MainPage />
                </DashboardLayout>
              }
            />

            <Route
              path="/dashboard"
              element={
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              }
            />

            <Route
              path="/dashboard-guest"
              element={
                <DashboardLayout>
                  <DashboardGuest />
                </DashboardLayout>
              }
            />
            <Route
              path="/login"
              element={
                <DashboardLayout>
                  <Login />
                </DashboardLayout>
              }
            />
            <Route
              path="/register"
              element={
                <DashboardLayout>
                  <Register />
                </DashboardLayout>
              }
            />
            <Route
              path="/vacancies"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Vacancies />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
              <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Settings />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/candidates"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Candidates />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/kanban"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Kanban />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Analytics />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />

          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}