import Taro from '@tarojs/taro';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

import { cacheManager, CacheRule } from './cache';

// 定义响应数据的基本结构
interface ApiResponse<T> {
  code: number;
  data: T;
  message?: string;
}

// 默认缓存规则
const defaultCacheRules: CacheRule[] = [
  {
    urlPattern: '/archetypes',
    expireTime: 10 * 60 * 1000, // 10分钟
  },
  {
    urlPattern: '/hs-rank',
    expireTime: 10 * 60 * 1000, // 10分钟
  },
  {
    urlPattern: '/config/last-update',
    expireTime: 10 * 60 * 1000, // 10分钟
  },
  {
    urlPattern: '/config/special-dates',
    expireTime: 10 * 60 * 1000, // 10分钟
  },
];

// 设置缓存规则
cacheManager.setRules(defaultCacheRules);

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
    console.log('request error', error);
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
  // 检查是否有缓存
  const fullUrl = axiosInstance.defaults.baseURL ? axiosInstance.defaults.baseURL + url : url;
  const requestConfig = config || {};

  // 尝试从缓存获取数据
  const cachedResponse = cacheManager.get<AxiosResponse<ApiResponse<T>>>(fullUrl, requestConfig);

  if (cachedResponse) {
    // 如果有缓存，直接返回缓存数据
    return cachedResponse.data.data;
  }

  // 如果没有缓存，发起真实请求
  const response = await axiosInstance<ApiResponse<T>>(url, config);
  const { data } = response;

  // 如果响应成功，手动缓存结果
  if (data.code === 0) {
    cacheManager.set(fullUrl, requestConfig, response);
    return data.data;
  }

  return Promise.reject(data.message);
};

// 导出缓存管理器，方便在其他地方使用
export { cacheManager };
export default request;
