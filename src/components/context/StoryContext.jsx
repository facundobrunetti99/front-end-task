import React, { createContext, useContext, useState, useEffect } from "react";
import {
  createStoryRequest,
  getStoriesRequest,
  getStoryRequest,
  deleteStoryRequest,
  updateStoryRequest,
} from "../../api/story.js";

const StoryContext = createContext();

export const useStory = () => {
  const context = useContext(StoryContext);
  if (!context) throw new Error("useStory debe estar dentro de StoryProvider");
  return context;
};

export function StoryProvider({ children }) {
  const [stories, setStories] = useState([]);

  // ✅ SOLUCIÓN: Limpiar estado cuando se hace logout
  useEffect(() => {
    const handleLogout = () => {
      setStories([]);
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  const createStory = async (projectId, epicId, story) => {
    try {
      const res = await createStoryRequest(projectId, epicId, story);
      setStories([...stories, res.data]);
      return res.data;
    } catch (error) {
      console.error("Error al crear story:", error);
      throw error;
    }
  };

  const getStories = async (projectId, epicId) => {
    try {
      const res = await getStoriesRequest(projectId, epicId);
      setStories(res.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("No autorizado:", error.response.data.message);
        // ✅ Si no está autorizado, limpiar stories
        setStories([]);
      } else if (error.response && error.response.status === 404) {
        console.error("No se encontraron stories.");
        setStories([]);
      } else {
        console.error("Error al obtener stories:", error);
        // En caso de error, también limpiar para evitar mostrar datos incorrectos
        setStories([]);
      }
    }
  };

  const deleteStory = async (projectId, epicId, id) => {
    try {
      await deleteStoryRequest(projectId, epicId, id);
      setStories(stories.filter((story) => story._id !== id));
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.error("Story no encontrada para eliminar.");
      } else {
        console.error("Error al eliminar story:", error);
      }
    }
  };

  const getStory = async (projectId, epicId, id) => {
    try {
      const res = await getStoryRequest(projectId, epicId, id);
      return res.data;
    } catch (error) {
      console.error("Error al obtener story:", error);
      if (error.response && error.response.status === 404) {
        console.error("Story no encontrada.");
        return null;
      }
      throw error;
    }
  };

  const updateStory = async (projectId, epicId, id, story) => {
    try {
      const res = await updateStoryRequest(projectId, epicId, id, story);
      setStories(stories.map((s) => (s._id === id ? res.data : s)));
      return res.data;
    } catch (error) {
      console.error("Error al actualizar story:", error);
      if (error.response && error.response.status === 404) {
        console.error("Story no encontrada para actualizar.");
      }
      throw error;
    }
  };

  return (
    <StoryContext.Provider
      value={{
        stories,
        createStory,
        getStories,
        getStory,
        updateStory,
        deleteStory,
      }}
    >
      {children}
    </StoryContext.Provider>
  );
}
