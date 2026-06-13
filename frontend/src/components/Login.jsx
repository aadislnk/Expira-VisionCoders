import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL, setAuthSession } from "../config/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!email || !password) {
      setMessage("Please enter both email and password.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to login.");
        return;
      }

      setAuthSession(data.token, data.user.email);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setMessage("Server error. Please try again later.");
    }
  };

  return (
    <div className="auth-container">
      <button className="back-button" onClick={() => navigate("/")}>
        ← Back
      </button>
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <span className="logo-icon">🌿</span>
            <span>Expira</span>
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to continue managing your mindful lifestyle.</p>
        </div>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {message && <p className="form-message">{message}</p>}

          <button type="submit">Login</button>
        </form>

        <p className="auth-switch">
          Don't have an account? <span onClick={() => navigate("/signup")}>Create one</span>
        </p>
      </div>
    </div>
  );
}

export default Login;
