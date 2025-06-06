import React, { useState } from "react";
import "../styles/components/Auth.css";

const RegisterPage = ({ switchToLogin, closeModal }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CUSTOMER");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, role }),
      });

      if (res.ok) {
        alert("Registration successful! Please log in.");
        switchToLogin(); // Switch to login on success
      } else {
        const err = await res.text();
        alert("Registration failed: " + err);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-heading">Register</h1>
        <form className="auth-form" onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Enter your name e.g. Arun"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="e.g. +94 07xxxxxxxx"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="CUSTOMER">Customer</option>
            <option value="OPERATOR">Operator</option>
            <option value="ADMIN">Admin</option>
          </select>
          <button type="submit">Register</button>
          <div className="auth-footer">
            Already a member?{" "}
            <span className="auth-switch-link" onClick={switchToLogin}>
              Login
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
