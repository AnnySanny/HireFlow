import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import DashboardLayout from "./layout/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import Statistics from "./pages/Statistics";
import Journal from "./pages/Journal";
import SupportChat from "./pages/SupportChat";
import Settings from "./pages/Settings";
import AuthPage from "./pages/AuthPage";
import CheckIn from "./pages/CheckIn";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";


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
                  <DashboardHome />
                </DashboardLayout>
              }
            />

            <Route
              path="/dashboard"
              element={
                <DashboardLayout>
                  <DashboardHome />
                </DashboardLayout>
              }
            />

            <Route
              path="/auth"
              element={
                <DashboardLayout>
                  <AuthPage />
                </DashboardLayout>
              }
            />
            <Route
              path="/journal"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Journal />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/statistics"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Statistics />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/support"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <SupportChat />
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
              path="/check-in"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <CheckIn />
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