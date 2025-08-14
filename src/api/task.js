import axios from "./axios";

export const getTasksRequest = (projectId, epicId, storyId) =>
  axios.get(
    `api/projects/${projectId}/epics/${epicId}/stories/${storyId}/tasks`
  );

export const getTaskRequest = (projectId, epicId, storyId, id) =>
  axios.get(
    `api/projects/${projectId}/epics/${epicId}/stories/${storyId}/task/${id}`
  );

export const createTaskRequest = (projectId, epicId, storyId, task) =>
  axios.post(
    `api/projects/${projectId}/epics/${epicId}/stories/${storyId}/task`,
    task
  );

export const updateTaskRequest = (projectId, epicId, storyId, id, task) =>
  axios.put(
    `api/projects/${projectId}/epics/${epicId}/stories/${storyId}/task/${id}`,
    task
  );

export const deleteTaskRequest = (projectId, epicId, storyId, id) =>
  axios.delete(
    `api/projects/${projectId}/epics/${epicId}/stories/${storyId}/task/${id}`
  );
