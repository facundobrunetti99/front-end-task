import React, { createContext, useContext, useState } from "react";
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
  const [loading, setLoading] = useState(false);

  const createEpic = async (projectId, epic) => {
    try {
      setLoading(true);
      const res = await createEpicRequest(projectId, epic);
      setEpics([...epics, res.data]);
      return res.data;
    } catch (error) {
      console.error("Error creando épica:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getEpics = async (projectId) => {
    try {
      setLoading(true);
      const res = await getEpicsRequest(projectId);
      setEpics(res.data);
    } catch (error) {
      console.error("Error obteniendo épicas:", error);
      if (error.response && error.response.status === 404) {
        console.error("No se encontraron Épicas para este proyecto.");
        setEpics([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteEpic = async (projectId, epicId) => {
    try {
      await deleteEpicRequest(projectId, epicId);
      setEpics(epics.filter((epic) => epic._id !== epicId));
    } catch (error) {
      console.error("Error eliminando épica:", error);
      if (error.response && error.response.status === 404) {
        console.error("Épica no encontrada para eliminar.");
      }
      throw error;
    }
  };

  const getEpic = async (projectId, epicId) => {
    try {
      const res = await getEpicRequest(projectId, epicId);
      return res.data;
    } catch (error) {
      console.error("Error obteniendo épica:", error);
      if (error.response && error.response.status === 404) {
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
      console.error("Error actualizando épica:", error);
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
        loading,
        createEpic,
        getEpic,
        deleteEpic,
        getEpics,
        updateEpic,
      }}
    >
      {children}
    </EpicContext.Provider>
  );
}
