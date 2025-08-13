import axios from "./axios";
export const getProjectsRequest = () => axios.get("/projects");
export const getProjectRequest = (id) => axios.get(`/project/${id}`);
export const createProjectRequest = (project) =>
  axios.post("/project", project);
export const updateProjectRequest = (id, project) =>
  axios.put(`/project/${id}`, project);
export const deleteProjectRequest = (id) => axios.delete(`/project/${id}`);
