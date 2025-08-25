// Login.js
import React, { useState } from "react";
import axios from "axios";

//create a Store using ContextAPI so that tokens can be stored in localstorage and can be fetched whenever needed.
// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  // Load token from localStorage when app starts
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext in components
export const useAuth = () => useContext(AuthContext);

// LOGIN
// src/pages/Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:3000/api/auth/login", {
        username,
        password,
      });

      login(res.data.token); // Save token to context
      alert("Logged in!");
      navigate("/dashboard");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div>
      <input
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;

// Logout.js
// src/components/LogoutButton.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); //remove token from localStorage
    navigate("/login");
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;


//for any protected route:
// Example: ProtectedComponent.js
import React, { useEffect, useState } from "react";
import axios from "axios";

function ProtectedComponent() {
  const [data, setData] = useState("");

  useEffect(() => {
    const fetchProtected = async () => {
      const { token } = useAuth(); //fetch token from store

      try {
        //below is a protected route, added:middleware
        const res = await axios.get("http://localhost:3000/api/users/muf", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setData(res.data.message);
      } catch (err) {
        setData("Access denied or token expired.");
      }
    };

    fetchProtected();
  }, []);

  return <div>{data}</div>;
}

// For larger apps, manage token state in:
// Context API + useReducer
// Redux
// Or use libraries like React Query + Axios interceptors
