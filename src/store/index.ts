import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';

// 持久化配置
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // 只持久化auth状态
};

// 创建持久化的auth reducer
const persistedAuthReducer = persistReducer(persistConfig, authReducer);

// 创建根reducer
const rootReducer = combineReducers({
  auth: persistedAuthReducer,
  user: userReducer,
});

// 创建store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// 创建持久化store
export const persistor = persistStore(store);

// 导出类型
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
