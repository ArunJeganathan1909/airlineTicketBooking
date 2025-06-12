import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const login = async (email, password) => {
    const res = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      throw new Error("Login failed");
    }

    const userData = await res.json();
    setUser(userData);

    if (userData.token) {
      localStorage.setItem("token", userData.token);
    }

    console.log(`${userData.username} logged in`);
    alert(`${userData.username} logged in`);

    if (userData.role === "ADMIN") navigate("/admin");
    else if (userData.role === "OPERATOR") navigate("/operator");
    else navigate("/");
  };

  // ADD logout function
  const logout = () => {
    setUser(null); // clear user state
    // Optionally clear localStorage/sessionStorage if used
    // localStorage.removeItem("token"); // example

    navigate("/"); // redirect to login page
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
