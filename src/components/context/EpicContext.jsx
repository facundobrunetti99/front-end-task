import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getEpicRequest,
  getEpicsRequest,
  deleteEpicRequest,
  updateEpicRequest,
  createEpicRequest,
} from "../../api/epic.js"; // Ajusta la ruta según tu estructura

const EpicContext = createContext();

export const useEpic = () => {
  const context = useContext(EpicContext);
  if (!context) {
    throw new Error("useEpic debe estar dentro de EpicProvider");
  }
  return context;
};

export function EpicProvider({ children }) {
  const [epics, setEpics] = useState([]);

  // ✅ SOLUCIÓN: Limpiar estado cuando se hace logout
  useEffect(() => {
    const handleLogout = () => {
      setEpics([]);
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  const createEpic = async (epic) => {
    try {
      const res = await createEpicRequest(epic);
      setEpics([...epics, res.data]);
      console.log(res.data);
      return res.data;
    } catch (error) {
      console.error("Error al crear épica:", error);
      throw error;
    }
  };

  const getEpics = async (projectId) => {
    try {
      const res = await getEpicsRequest(projectId);
      setEpics(res.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("No autorizado:", error.response.data.message);
        // ✅ Si no está autorizado, limpiar épicas
        setEpics([]);
      } else if (error.response && error.response.status === 404) {
        console.error("No se encontraron Épicas para este proyecto.");
        setEpics([]);
      } else {
        console.error("Error al obtener épicas:", error);
        // En caso de error, también limpiar para evitar mostrar datos incorrectos
        setEpics([]);
      }
    }
  };

  const deleteEpic = async (id) => {
    try {
      await deleteEpicRequest(id);
      setEpics(epics.filter((epic) => epic._id !== id));
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.error("Épica no encontrada para eliminar.");
      } else {
        console.error("Error al eliminar épica:", error);
      }
    }
  };

  const getEpic = async (id) => {
    try {
      const res = await getEpicRequest(id);
      return res.data;
    } catch (error) {
      console.error("Error al obtener épica:", error);
      if (error.response && error.response.status === 404) {
        console.error("Épica no encontrada.");
        return null;
      }
      throw error;
    }
  };

  const updateEpic = async (id, epic) => {
    try {
      const res = await updateEpicRequest(id, epic);
      setEpics(epics.map((e) => (e._id === id ? res.data : e)));
      return res.data;
    } catch (error) {
      console.error("Error al actualizar épica:", error);
      if (error.response && error.response.status === 404) {
        console.error("Épica no encontrada para actualizar.");
      }
      throw error;
    }
  };

  return (
    <EpicContext.Provider
      value={{
        epics,
        createEpic,
        getEpic,
        getEpics,
        deleteEpic,
        updateEpic,
      }}
    >
      {children}
    </EpicContext.Provider>
  );
}
