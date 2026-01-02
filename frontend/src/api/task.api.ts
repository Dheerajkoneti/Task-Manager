import axios from "./axios";

export const getTasks = () => axios.get("/tasks");
export const createTask = (title: string) =>
  axios.post("/tasks", { title });

export const updateTaskStatus = (id: string, status: string) =>
  axios.put(`/tasks/${id}`, { status });
