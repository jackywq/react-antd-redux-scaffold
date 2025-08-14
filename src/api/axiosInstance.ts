import axios from 'axios';
import { message } from 'antd';
import { store } from '@/store';

// 创建 axios 实例
const axiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    // 从redux store中获取 token
    const { token } = store.getState().auth;

    // 如果有 token，添加到请求头
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // 处理请求错误
    message.error('请求出错，请稍后再试');
    return Promise.reject(error);
  }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response) => {
    // 处理成功响应
    return response.data;
  },
  (error) => {
    // 处理响应错误
    const { response } = error;

    // 未授权，需要重新登录
    if (response && response.status === 401) {
      message.error('登录已过期，请重新登录');
      store.dispatch({ type: 'auth/logout' });

      // 跳转到登录页，记录当前路径以便登录后返回
      if (window.location.pathname !== '/login') {
        window.location.href = `/login?redirect=${window.location.pathname}`;
      }
    } else {
      // 其他错误
      const errorMessage = response?.data?.message || '服务器错误，请稍后再试';
      message.error(errorMessage);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
