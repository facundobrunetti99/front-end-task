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

  const createEpic = async (epic) => {
    try {
      const res = await createEpicRequest(epic);
      setEpics([...epics, res.data]);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const getEpics = async (projectId) => {
    try {
      const res = await getEpicsRequest(projectId);
      setEpics(res.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Si no está autorizado, limpiar épicas
        setEpics([]);
      } else if (error.response && error.response.status === 404) {
        setEpics([]);
      } else {
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
        
      } 
    }
  };

  const getEpic = async (id) => {
    try {
      const res = await getEpicRequest(id);
      return res.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
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
