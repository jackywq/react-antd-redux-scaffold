import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// 用户信息类型定义
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  roles: string[];
}

// 认证状态接口
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// 初始状态
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// 异步thunk actions
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ username, password }: { username: string; password: string }) => {
    // 模拟API请求
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 实际项目中应该替换为真实的API调用
    if (username === 'admin' && password === 'admin') {
      const userData = {
        id: '1',
        username: 'admin',
        email: 'admin@example.com',
        roles: ['admin'],
      };
      const token = 'mock-jwt-token';

      return { user: userData, token };
    }

    throw new Error('Invalid credentials');
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ username, email, password }: { username: string; email: string; password: string }) => {
    // 模拟API请求
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 实际项目中应该替换为真实的API调用
    const userData = {
      id: '2',
      username,
      email,
      roles: ['user'],
    };
    const token = 'mock-jwt-token';

    return { user: userData, token };
  }
);

// 创建slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 登录
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })
      // 注册
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Registration failed';
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
