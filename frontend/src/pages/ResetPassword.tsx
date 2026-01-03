import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import "../login.css";

export default function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingToken, setCheckingToken] = useState(true);

  /**
   * ✅ IMPORTANT:
   * Reset password must behave like a LOGGED-OUT page
   * Otherwise dashboard auto-redirect happens
   */
  useEffect(() => {
    localStorage.removeItem("token");
  }, []);

  /**
   * ✅ Guard invalid / missing token
   */
  useEffect(() => {
    if (!token) {
      toast.error("Invalid or expired reset link");
      navigate("/login", { replace: true });
      return;
    }
    setCheckingToken(false);
  }, [token, navigate]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      await api.post(`/auth/reset-password/${token}`, {
        password,
      });

      toast.success("✅ Password reset successful");
      navigate("/login", { replace: true });

    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Reset link expired or invalid"
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * ⛔ Prevent UI render until token is validated
   */
  if (checkingToken) return null;

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Reset Password 🔑</h1>
        <p className="subtitle">Create a new secure password</p>

        <form onSubmit={handleReset}>
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />

          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
