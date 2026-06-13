import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL, setAuthSession } from "../config/api";

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!email || !password || !confirmPassword) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message || "Unable to create account.");
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
          <h1>Join the Movement</h1>
          <p>Create your account and start your mindful living journey today.</p>
        </div>

        <form onSubmit={handleSubmit}>
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
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {message && <p className="form-message">{message}</p>}

          <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>Sign Up</button>
        </form>

        <p className="auth-switch">
          Already have an account? <span onClick={() => navigate("/login")}>Sign in</span>
        </p>
      </div>
    </div>
  );
}

export default Signup;
