import axios from "./axios";

export const getStoriesRequest = (projectId, epicId) =>
  axios.get(`api/projects/${projectId}/epics/${epicId}/stories`);

export const createStoryRequest = (projectId, epicId, story) =>
  axios.post(`api/projects/${projectId}/epics/${epicId}/story`, story);

export const getStoryRequest = (projectId, epicId, storyId) =>
  axios.get(`api/projects/${projectId}/epics/${epicId}/story/${storyId}`);

export const updateStoryRequest = (projectId, epicId, storyId, story) =>
  axios.put(
    `api/projects/${projectId}/epics/${epicId}/story/${storyId}`,
    story
  );

export const deleteStoryRequest = (projectId, epicId, storyId) =>
  axios.delete(`api/projects/${projectId}/epics/${epicId}/story/${storyId}`);
