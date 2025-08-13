import axios from "./axios";

export const getTasksRequest = (projectId, epicId, storyId) =>
  axios.get(`/projects/${projectId}/epics/${epicId}/stories/${storyId}/tasks`);

export const getTaskRequest = (projectId, epicId, storyId, id) =>
  axios.get(
    `/projects/${projectId}/epics/${epicId}/stories/${storyId}/task/${id}`
  );

export const createTaskRequest = (projectId, epicId, storyId, task) =>
  axios.post(
    `/projects/${projectId}/epics/${epicId}/stories/${storyId}/task`,
    task
  );

export const updateTaskRequest = (projectId, epicId, storyId, id, task) =>
  axios.put(
    `/projects/${projectId}/epics/${epicId}/stories/${storyId}/task/${id}`,
    task
  );

export const deleteTaskRequest = (projectId, epicId, storyId, id) =>
  axios.delete(
    `/projects/${projectId}/epics/${epicId}/stories/${storyId}/task/${id}`
  );
