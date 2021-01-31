import axios, { AxiosInstance } from "axios";

export function defaultAxios(): AxiosInstance {
  return axios.create({
    withCredentials: true,
    baseURL: process.env.REACT_APP_BASE_URL,
  });
}
export const apiClient: AxiosInstance = defaultAxios();
