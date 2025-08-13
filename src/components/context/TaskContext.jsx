import React, { createContext, useContext, useState } from "react";
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

  const createTask = async (projectId, epicId, storyId, task) => {
    const res = await createTaskRequest(projectId, epicId, storyId, task);
    setTasks([...tasks, res.data]);
  };

  const getTasks = async (projectId, epicId, storyId) => {
    try {
      const res = await getTasksRequest(projectId, epicId, storyId);
      setTasks(res.data);
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 400) {
        console.error(error.response.data.message);
      } else if (error.response?.status === 404) {
        console.error("No se encontraron tareas.");
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
      }
    }
  };

  const getTask = async (projectId, epicId, storyId, id) => {
    try {
      const res = await getTaskRequest(projectId, epicId, storyId, id);
      return res.data;
    } catch (error) {
      if (error.response?.status === 404) {
        console.error("Tarea no encontrada.");
      }
    }
  };

  const updateTask = async (projectId, epicId, storyId, id, task) => {
    try {
      const res = await updateTaskRequest(projectId, epicId, storyId, id, task);
      setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
      return res.data;
    } catch (error) {
      console.error(error);
      if (error.response?.status === 404) {
        console.error("Tarea no encontrada para actualizar.");
      }
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
