import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, Typography, Divider, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { registerUser } from '@/store/slices/authSlice';

const { Title, Link } = Typography;

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading: authLoading, error } = useAppSelector((state) => state.auth);
  
  // 如果已登录，自动跳转到首页
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  const onFinish = async (values: { username: string; email: string; password: string; confirmPassword: string }) => {
    // 验证密码是否一致
    if (values.password !== values.confirmPassword) {
      message.error('两次输入的密码不一致');
      return;
    }
    
    setLoading(true);
    
    try {
      const resultAction = await dispatch(registerUser({
        username: values.username,
        email: values.email,
        password: values.password
      }));
      
      if (registerUser.fulfilled.match(resultAction)) {
        message.success('注册成功，即将跳转到首页');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        message.error('注册失败，请稍后再试');
      }
    } catch (error) {
      message.error('注册失败，请稍后再试');
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
        <Title level={2}>用户注册</Title>
      </div>
      
      <Form
        name="register_form"
        initialValues={{}}
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          name="username"
          label="用户名"
          rules={[
            { required: true, message: '请输入用户名' },
            { min: 3, message: '用户名长度不能少于3个字符' },
            { max: 20, message: '用户名长度不能超过20个字符' }
          ]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="请输入用户名" />
        </Form.Item>
        
        <Form.Item
          name="email"
          label="邮箱"
          rules={[
            { required: true, message: '请输入邮箱' },
            { type: 'email', message: '请输入有效的邮箱地址' }
          ]}
        >
          <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="请输入邮箱" />
        </Form.Item>
        
        <Form.Item
          name="password"
          label="密码"
          rules={[
            { required: true, message: '请输入密码' },
            { min: 6, message: '密码长度不能少于6个字符' }
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="请输入密码"
          />
        </Form.Item>
        
        <Form.Item
          name="confirmPassword"
          label="确认密码"
          rules={[
            { required: true, message: '请确认密码' },
            { min: 6, message: '密码长度不能少于6个字符' }
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="请再次输入密码"
          />
        </Form.Item>
        
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading || authLoading} block>
            注册
          </Button>
          
          <Divider>或</Divider>
          
          <div style={{ textAlign: 'center' }}>
            已有账号? <Link href="/login">立即登录</Link>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
