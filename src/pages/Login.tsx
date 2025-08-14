import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Checkbox, Form, Input, Typography, Divider, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { loginUser } from '@/store/slices/authSlice';

const { Title, Link } = Typography;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading: authLoading, error } = useAppSelector((state) => state.auth);
  
  // 从URL中获取重定向路径
  const getRedirectPath = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('redirect') || '/dashboard';
  };
  
  // 如果已登录，自动跳转到首页
  useEffect(() => {
    if (isAuthenticated) {
      navigate(getRedirectPath());
    }
  }, [isAuthenticated, navigate]);
  
  const onFinish = async (values: { username: string; password: string; remember: boolean }) => {
    setLoading(true);
    
    try {
      const resultAction = await dispatch(loginUser({
        username: values.username,
        password: values.password
      }));
      
      if (loginUser.fulfilled.match(resultAction)) {
        message.success('登录成功');
        navigate(getRedirectPath());
      } else {
        message.error('用户名或密码错误');
      }
    } catch (error) {
      message.error('登录失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };
  
  // 显示错误信息
  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);
  
  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Title level={2}>系统登录</Title>
      </div>
      
      <Form
        name="login_form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          name="username"
          label="用户名"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="请输入用户名" />
        </Form.Item>
        
        <Form.Item
          name="password"
          label="密码"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="请输入密码"
          />
        </Form.Item>
        
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>记住我</Checkbox>
          </Form.Item>
          
          <Link href="/forgot-password" style={{ float: 'right' }}>
            忘记密码?
          </Link>
        </Form.Item>
        
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading || authLoading} block>
            登录
          </Button>
          
          <Divider>或</Divider>
          
          <div style={{ textAlign: 'center' }}>
            还没有账号? <Link href="/register">立即注册</Link>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
