import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import "../styles/components/Auth.css";

const LoginPage = ({ switchToRegister, closeModal }) => {
  const { login } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      closeModal(); // Close on successful login
    } catch (error) {
      alert("Login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-heading">Login</h1>
        <form className="auth-form" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
          <div className="auth-footer">
            Don’t have an account?{" "}
            <span className="auth-switch-link" onClick={switchToRegister}>
              Register
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
