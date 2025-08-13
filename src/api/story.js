import axios from "./axios";

export const getStoriesRequest = (projectId, epicId) =>
  axios.get(`/projects/${projectId}/epics/${epicId}/stories`);

export const createStoryRequest = (projectId, epicId, story) =>
  axios.post(`/projects/${projectId}/epics/${epicId}/story`, story);

export const getStoryRequest = (projectId, epicId, storyId) =>
  axios.get(`/projects/${projectId}/epics/${epicId}/story/${storyId}`);

export const updateStoryRequest = (projectId, epicId, storyId, story) =>
  axios.put(`/projects/${projectId}/epics/${epicId}/story/${storyId}`, story);

export const deleteStoryRequest = (projectId, epicId, storyId) =>
  axios.delete(`/projects/${projectId}/epics/${epicId}/story/${storyId}`);
