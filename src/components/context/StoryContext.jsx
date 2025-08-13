// context/StoryContext.js
import React, { createContext, useContext, useState } from "react";
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

  const createStory = async (projectId, epicId, story) => {
    const res = await createStoryRequest(projectId, epicId, story);
    setStories([...stories, res.data]);
  };

  const getStories = async (projectId, epicId) => {
    try {
      const res = await getStoriesRequest(projectId, epicId);
      setStories(res.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error(error.response.data.message);
      } else if (error.response && error.response.status === 404) {
        console.error("No se encontraron stories.");
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
      }
    }
  };

  const getStory = async (projectId, epicId, id) => {
    try {
      const res = await getStoryRequest(projectId, epicId, id);
      return res.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.error("Story no encontrada.");
      }
    }
  };

  const updateStory = async (projectId, epicId, id, story) => {
    try {
      const res = await updateStoryRequest(projectId, epicId, id, story);
      setStories(stories.map((s) => (s._id === id ? res.data : s)));
      return res.data;
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 404) {
        console.error("Story no encontrada para actualizar.");
      }
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
