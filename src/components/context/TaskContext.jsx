import React, { createContext, useContext, useState, useEffect } from "react";
import {
  createTaskRequest,
  getTasksRequest,
  getTaskRequest,
  updateTaskRequest,
  deleteTaskRequest,
} from "../../api/task.js";

const TaskContext = createContext();

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTask debe estar dentro de TaskProvider");
  return context;
};

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);

  // ✅ SOLUCIÓN: Limpiar estado cuando se hace logout
  useEffect(() => {
    const handleLogout = () => {
      setTasks([]);
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  const createTask = async (projectId, epicId, storyId, task) => {
    try {
      const res = await createTaskRequest(projectId, epicId, storyId, task);
      setTasks([...tasks, res.data]);
      return res.data;
    } catch (error) {
      console.error("Error al crear tarea:", error);
      throw error;
    }
  };

  const getTasks = async (projectId, epicId, storyId) => {
    try {
      const res = await getTasksRequest(projectId, epicId, storyId);
      setTasks(res.data);
    } catch (error) {
      if (error.response?.status === 401) {
        console.error("No autorizado:", error.response.data.message);
        // ✅ Si no está autorizado, limpiar tasks
        setTasks([]);
      } else if (error.response?.status === 400) {
        console.error("Solicitud incorrecta:", error.response.data.message);
        setTasks([]);
      } else if (error.response?.status === 404) {
        console.error("No se encontraron tareas.");
        setTasks([]);
      } else {
        console.error("Error al obtener tareas:", error);
        // En caso de error, también limpiar para evitar mostrar datos incorrectos
        setTasks([]);
      }
    }
  };

  const deleteTask = async (projectId, epicId, storyId, id) => {
    try {
      await deleteTaskRequest(projectId, epicId, storyId, id);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      if (error.response?.status === 404) {
        console.error("Tarea no encontrada para eliminar.");
      } else {
        console.error("Error al eliminar tarea:", error);
      }
    }
  };

  const getTask = async (projectId, epicId, storyId, id) => {
    try {
      const res = await getTaskRequest(projectId, epicId, storyId, id);
      return res.data;
    } catch (error) {
      console.error("Error al obtener tarea:", error);
      if (error.response?.status === 404) {
        console.error("Tarea no encontrada.");
        return null;
      }
      throw error;
    }
  };

  const updateTask = async (projectId, epicId, storyId, id, task) => {
    try {
      const res = await updateTaskRequest(projectId, epicId, storyId, id, task);
      setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
      return res.data;
    } catch (error) {
      console.error("Error al actualizar tarea:", error);
      if (error.response?.status === 404) {
        console.error("Tarea no encontrada para actualizar.");
      }
      throw error;
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        createTask,
        getTasks,
        deleteTask,
        getTask,
        updateTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}
