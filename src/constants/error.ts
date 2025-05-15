import { AxiosError } from 'axios';

// Axios错误码
export const AxiosErrorNameMap = {
  [AxiosError.ERR_NETWORK]: '网络错误',
  [AxiosError.ETIMEDOUT]: '请求超时',
  [AxiosError.ERR_BAD_REQUEST]: '请求错误',
  [AxiosError.ERR_BAD_RESPONSE]: '响应错误',
  [AxiosError.ERR_CANCELED]: '请求取消',
  [AxiosError.ERR_NOT_SUPPORT]: '不支持的请求方法',
  [AxiosError.ERR_INVALID_URL]: '无效的URL',
  [AxiosError.ERR_FR_TOO_MANY_REDIRECTS]: '重定向次数过多',
  [AxiosError.ERR_BAD_OPTION_VALUE]: '错误的选项值',
  [AxiosError.ERR_BAD_OPTION]: '错误的选项',
  [AxiosError.ERR_DEPRECATED]: '已弃用',
};
