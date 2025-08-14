import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Spin, Layout } from 'antd';
import { useAppSelector } from '@/store/hooks';
import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';

// 懒加载页面组件
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const UserProfile = lazy(() => import('@/pages/UserProfile'));
const UserManagement = lazy(() => import('@/pages/UserManagement'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const { Content } = Layout;

// 私有路由组件
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  console.log('App rendered');
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ flex: 1 }}>
        <Suspense
          fallback={<Spin size="large" style={{ display: 'block', margin: '20px auto' }} />}
        >
          <Routes>
            {/* 不需要登录的路由 */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* 需要登录的路由 */}
            <Route
              element={
                <PrivateRoute>
                  <MainLayout />
                </PrivateRoute>
              }
            >
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/user-management" element={<UserManagement />} />
            </Route>

            {/* 404 页面 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Content>
    </Layout>
  );
};

export default App;
