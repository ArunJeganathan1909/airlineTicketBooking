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

    // Show username in console
    console.log(`${userData.username} logged in`);

    // Show alert
    alert(`${userData.username} logged in`);

    // Role-based redirection
    if (userData.role === "ADMIN") navigate("/admin");
    else if (userData.role === "OPERATOR") navigate("/operator");
    else navigate(-1);
  };

  return (
    <UserContext.Provider value={{ user, login }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
