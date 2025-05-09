import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

// 定义响应数据的基本结构
interface ApiResponse<T> {
  code: number;
  data: T;
  message?: string;
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
});

// 请求拦截器
axiosInstance.interceptors.request.use((config) => {
  return config;
});

const request = async <T>(url: string, config?: AxiosRequestConfig) => {
  const response = await axiosInstance<ApiResponse<T>>(url, config);
  const { data } = response;
  if (data.code === 0) {
    return data.data;
  }
  return Promise.reject(data.message);
};

export default request;
