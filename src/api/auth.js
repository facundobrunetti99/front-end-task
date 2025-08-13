import axios from "./axios";

export const registerRequest = (user) => axios.post("/register", user);
export const loginRequest = (user) => axios.post("/login", user);
export const verifyTokenRequest = () =>
  axios.get("/verify", {
    withCredentials: true,
  });
export const logoutRequest = () =>
  axios.post("/logout", {}, {
    withCredentials: true,
  });