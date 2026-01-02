import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import "../register.css";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      toast.error("All fields are required");
      return;
    }

    try {
      await api.post("/auth/register", { name, email, password });
      toast.success("Account created successfully");
      navigate("/login");
    } catch {
      toast.error("User already exists");
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h1>Create Account 🚀</h1>
        <p className="subtitle">Start managing your tasks</p>

        <input
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleRegister}>Register</button>

        <div className="links">
          <span onClick={() => navigate("/login")}>
            Already have an account? Login
          </span>
          <span onClick={() => navigate("/forgot-password")} className="forgot">
  Forgot password?
</span>

        </div>
      </div>
    </div>
  );
}
