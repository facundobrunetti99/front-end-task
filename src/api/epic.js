import axios from "./axios";

export const getEpicsRequest = (projectId) =>
  axios.get(`/projects/${projectId}/epics`);

export const createEpicRequest = (projectId, epic) =>
  axios.post(`/projects/${projectId}/epics`, epic);

export const getEpicRequest = (projectId, epicId) =>
  axios.get(`/projects/${projectId}/epics/${epicId}`);

export const updateEpicRequest = (projectId, epicId, epic) =>
  axios.put(`/projects/${projectId}/epics/${epicId}`, epic);

export const deleteEpicRequest = (projectId, epicId) =>
  axios.delete(`/projects/${projectId}/epics/${epicId}`);
