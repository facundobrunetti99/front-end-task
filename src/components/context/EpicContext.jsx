import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getEpicRequest,
  getEpicsRequest,
  deleteEpicRequest,
  updateEpicRequest,
  createEpicRequest,
} from "../../api/epic.js"; 

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

  useEffect(() => {
    const handleLogout = () => {
      setEpics([]);
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  // AÑADIR projectId a createEpic
  const createEpic = async (projectId, epic) => {
    try {
      const res = await createEpicRequest(projectId, epic);
      setEpics([...epics, res.data]);
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
      console.error("Error al obtener épicas:", error);
      if (error.response?.status === 401) {
        console.error("No autorizado:", error.response.data.message);
        setEpics([]);
      } else if (error.response?.status === 400) {
        console.error("Solicitud incorrecta:", error.response.data.message);
        setEpics([]);
      } else if (error.response?.status === 404) {
        console.error("No se encontraron épicas.");
        setEpics([]);
      } else {
        setEpics([]);
      }
    }
  };

  // AÑADIR projectId a deleteEpic
  const deleteEpic = async (projectId, epicId) => {
    try {
      await deleteEpicRequest(projectId, epicId);
      setEpics(epics.filter((epic) => epic._id !== epicId));
    } catch (error) {
      console.error("Error al eliminar épica:", error);
      if (error.response?.status === 404) {
        console.error("Épica no encontrada para eliminar.");
      }
    }
  };

  //AÑADIR projectId a getEpic  
  const getEpic = async (projectId, epicId) => {
    try {
      const res = await getEpicRequest(projectId, epicId);
      return res.data;
    } catch (error) {
      console.error("Error al obtener épica:", error);
      if (error.response?.status === 404) {
        console.error("Épica no encontrada.");
        return null;
      }
      throw error;
    }
  };

  const updateEpic = async (projectId, epicId, epic) => {
    try {
      const res = await updateEpicRequest(projectId, epicId, epic);
      setEpics(epics.map((e) => (e._id === epicId ? res.data : e)));
      return res.data;
    } catch (error) {
      console.error("Error al actualizar épica:", error);
      if (error.response?.status === 404) {
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