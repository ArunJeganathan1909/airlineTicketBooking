import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";

const LoginPage = () => {
  const { login } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      alert("Login failed");
    }
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <h1 className="form-heading">Login</h1>
        <form className="form" onSubmit={handleLogin}>
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
          <div className="account-text">
            Don't Have An Account Yet? <br />
            <Link to={"/register"}>Register</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
