import { API_BASE_URL } from "@/constants";
import Axios, { InternalAxiosRequestConfig } from "axios";
import { f7 } from "framework7-react";

export const miniappClient = Axios.create({
  baseURL: API_BASE_URL,
});

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  if (config.data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data";
  } else {
    config.headers["Content-Type"] = "application/json";
  }

  // Skip token if the custom header `Skip-Auth` is present
  if (config.headers["Skip-Auth"]) {
    delete config.headers["Skip-Auth"]; // Clean up the custom header
    return config;
  }

  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    f7.dialog.alert("Token does not exist!");
    f7.views.main.router.navigate("/");
    return Promise.reject(new Error("No token available"));
  }

  return config;
}

miniappClient.interceptors.request.use(authRequestInterceptor);

miniappClient.interceptors.response.use((response) => {
  return response.data;
});
