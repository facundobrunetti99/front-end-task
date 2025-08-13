import axios from "./axios";
export const getProjectsRequest = () => axios.get("/api/projects");
export const getProjectRequest = (id) => axios.get(`/api/project/${id}`);
export const createProjectRequest = (project) => axios.post("/api/project", project);
export const updateProjectRequest = (id, project) => axios.put(`/api/project/${id}`, project);
export const deleteProjectRequest = (id) => axios.delete(`/api/project/${id}`);
