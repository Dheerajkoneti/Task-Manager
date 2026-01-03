import { useEffect } from "react";

export default function PublicRoute({
  children,
}: {
  children: JSX.Element;
}) {
  // 🔥 Ensure user is logged out BEFORE rendering public pages
  useEffect(() => {
    localStorage.removeItem("token");
  }, []);

  return children;
}
