import { useAuth } from "../context/AuthContext";
import NotFound from "../pages/NotFound";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <NotFound />;
  }

  return children;
}