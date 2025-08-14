import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User } from './authSlice';

// 用户管理状态接口
interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

// 模拟用户数据
const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    roles: ['admin'],
  },
  {
    id: '2',
    username: 'user1',
    email: 'user1@example.com',
    roles: ['user'],
  },
  {
    id: '3',
    username: 'user2',
    email: 'user2@example.com',
    roles: ['user'],
  },
];

// 初始状态
const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

// 异步thunk actions
export const fetchUsers = createAsyncThunk('user/fetchUsers', async () => {
  // 模拟API请求
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // 实际项目中应该替换为真实的API调用
  return mockUsers;
});

export const addUser = createAsyncThunk('user/addUser', async (userData: Omit<User, 'id'>) => {
  // 模拟API请求
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // 实际项目中应该替换为真实的API调用
  const newUser = {
    ...userData,
    id: Date.now().toString(),
  };

  return newUser;
});

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async ({ id, userData }: { id: string; userData: Partial<User> }) => {
    // 模拟API请求
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 实际项目中应该替换为真实的API调用
    return { id, userData };
  }
);

export const deleteUser = createAsyncThunk('user/deleteUser', async (id: string) => {
  // 模拟API请求
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // 实际项目中应该替换为真实的API调用
  return id;
});

// 创建slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 获取用户列表
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })
      // 添加用户
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
        state.error = null;
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add user';
      })
      // 更新用户
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const { id, userData } = action.payload;
        state.users = state.users.map((user) => (user.id === id ? { ...user, ...userData } : user));
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update user';
      })
      // 删除用户
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((user) => user.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete user';
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
