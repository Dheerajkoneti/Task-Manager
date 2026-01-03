import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const token = localStorage.getItem("token");
  const location = useLocation();

  // ✅ Allow reset-password even if token exists
  if (location.pathname.startsWith("/reset-password")) {
    return children;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
