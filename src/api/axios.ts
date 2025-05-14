import Taro from "@tarojs/taro";
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";

// 定义响应数据的基本结构
interface ApiResponse<T> {
  code: number;
  data: T;
  message?: string;
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: "https://udagyciuulrg.sealosgzg.site/api",
});

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.log("error1", error);
  }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    const errorCode = error.code || 'UNKNOWN_ERROR';
    const errorMessage = error.message || '未知错误';
    const errorStatus = error.response?.status;
    
    Taro.navigateTo({
      url: `/pages/error/index?code=${errorCode}&message=${encodeURIComponent(errorMessage)}&status=${errorStatus || ''}`,
    });
  }
);

const request = async <T>(url: string, config?: AxiosRequestConfig) => {
  const response = await axiosInstance<ApiResponse<T>>(url, config);
  const { data } = response;
  if (data.code === 0) {
    return data.data;
  }
  return Promise.reject(data.message);
};

export default request;
