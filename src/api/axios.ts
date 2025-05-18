import Taro from '@tarojs/taro';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

// 定义响应数据的基本结构
interface ApiResponse<T> {
  code: number;
  data: T;
  message?: string;
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'https://udagyciuulrg.sealosgzg.site/api',
  // baseURL: 'http://localhost:3000/api',
});

// 请求拦截器
axiosInstance.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  response => {
    const url = new URL(response.config?.url || '', response.config?.baseURL || '');
    Taro.reportEvent('wxdata_perf_monitor', {
      wxdata_perf_monitor_id: url.pathname,
      wxdata_perf_monitor_level: 0,
      wxdata_perf_error_code: response.data.code,
      wxdata_perf_error_msg: response.data.message,
      wxdata_perf_extra_info1: url.searchParams.get('mode') ?? '',
      wxdata_perf_extra_info2: url.searchParams.get('rank') ?? '',
      wxdata_perf_extra_info3: url.searchParams.get('page') ?? '',
    });
    return response;
  },
  (error: AxiosError) => {
    const errorCode = error.code || 'UNKNOWN_ERROR';
    const errorMessage = error.message || '未知错误';
    const errorStatus = error.response?.status;
    const url = new URL(error.config?.url || '', error.config?.baseURL || '');
    Taro.reportEvent('wxdata_perf_monitor', {
      wxdata_perf_monitor_id: url.pathname,
      wxdata_perf_monitor_level: 0,
      wxdata_perf_error_code: error.status || 500,
      wxdata_perf_error_msg: error.message,
      wxdata_perf_extra_info1: url.searchParams.get('mode') ?? '',
      wxdata_perf_extra_info2: url.searchParams.get('rank') ?? '',
      wxdata_perf_extra_info3: url.searchParams.get('page') ?? '',
    });

    Taro.navigateTo({
      url: `/pages/error/index?code=${errorCode}&message=${encodeURIComponent(
        errorMessage
      )}&status=${errorStatus || ''}`,
    });

    return Promise.reject(error);
  }
);

const request = async <T>(url: string, config?: AxiosRequestConfig) => {
  // 如果没有缓存，发起真实请求
  const response = await axiosInstance<ApiResponse<T>>(url, config);
  const { data } = response;

  // 如果响应成功，手动缓存结果
  if (data.code === 0) {
    return data.data;
  }

  return Promise.reject(data.message);
};

export default request;
