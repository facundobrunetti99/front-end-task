import axios from "./axios";

export const getEpicsRequest = (projectId) =>
  axios.get(`api/projects/${projectId}/epics`);

export const createEpicRequest = (projectId, epic) =>
  axios.post(`api/projects/${projectId}/epics`, epic);

export const getEpicRequest = (projectId, epicId) =>
  axios.get(`api/projects/${projectId}/epics/${epicId}`);

export const updateEpicRequest = (projectId, epicId, epic) =>
  axios.put(`api/projects/${projectId}/epics/${epicId}`, epic);

export const deleteEpicRequest = (projectId, epicId) =>
  axios.delete(`api/projects/${projectId}/epics/${epicId}`);
