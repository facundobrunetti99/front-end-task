import React, { createContext, useState, useContext, useEffect } from "react";
import {
  registerRequest,
  loginRequest,
  verifyTokenRequest,
  logoutRequest, 
} from "../../api/auth";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe estar dentro de AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);

  const singup = async (user) => {
    try {
      const res = await registerRequest(user);
      setIsAuthenticated(true);
      setUser(res.data);
    } catch (error) {
      setErrors(error.response?.data || ["Error al registrar"]);
    }
  };

  const singin = async (user) => {
    try {
      const res = await loginRequest(user);
      setIsAuthenticated(true);
      setUser(res.data);
    } catch (error) {
      if (Array.isArray(error.response?.data)) {
        return setErrors(error.response.data);
      }
      setErrors([error.response?.data?.message || "Error al iniciar sesión"]);
    }
  };
  const logout = async () => {
    try {
      await logoutRequest();
    } catch (error) {
      console.error("Error al hacer logout:", error);
    } finally {
      Cookies.remove("token");
      setIsAuthenticated(false);
      setUser(null);
      setErrors([]);
    }
  };

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => setErrors([]), 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  useEffect(() => {
    async function checkLogin() {
      try {
        const res = await verifyTokenRequest();
        if (res.data?.message) {
          setIsAuthenticated(false);
          setUser(null);
          return;
        }
        setIsAuthenticated(true);
        setUser(res.data);
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
      }
    }

    checkLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{ singup, singin, logout, user, isAuthenticated, errors }}
    >
      {children}
    </AuthContext.Provider>
  );
};
