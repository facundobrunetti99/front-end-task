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
  const [loading, setLoading] = useState(true); 

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

  const singup = async (user) => {
    try {
      console.log("Intentando registrar:", user); 
      const res = await registerRequest(user);
      console.log("Respuesta del servidor:", res); 
      setIsAuthenticated(true);
      setUser(res.data);
    } catch (error) {
      console.error("Error completo:", error); 
      console.error("Error response:", error.response); 
      
      if (error.response?.data) {
        if (Array.isArray(error.response.data)) {
          setErrors(error.response.data);
        } else {
          setErrors([error.response.data.message || error.response.data]);
        }
      } else {
        setErrors([error.message || "Error de conexión"]);
      }
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
        setLoading(true); // ← Inicia loading
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
      } finally {
        setLoading(false); 
      }
    }
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{ 
        singup, 
        singin, 
        logout, 
        user, 
        isAuthenticated, 
        errors, 
        loading 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
