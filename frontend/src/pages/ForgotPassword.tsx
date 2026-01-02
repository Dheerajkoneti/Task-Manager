import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import "../login.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); // ✅ added
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true); // ✅ start loading

      await api.post("/auth/forgot-password", { email });
      toast.success("Reset link sent to your email");

    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to send reset email"
      );
    } finally {
      setLoading(false); // ✅ stop loading
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Forgot Password 🔒</h1>
        <p className="subtitle">
          Enter your email to receive a reset link
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="forgot-text">
          <span onClick={() => navigate("/login")}>← Back to Login</span>
        </p>
      </div>
    </div>
  );
}
