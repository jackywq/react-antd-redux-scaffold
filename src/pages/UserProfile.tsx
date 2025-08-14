import React, { useState } from 'react';
import { Card, Form, Input, Button, Avatar, message, Typography, Upload, Spin, Row, Col, Space } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, UploadOutlined } from '@ant-design/icons';
import { useAppSelector } from '@/store/hooks';

const { Title, Text } = Typography;
const { Meta } = Card;

const UserProfile: React.FC = () => {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [editing, setEditing] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  
  // 初始化表单数据
  React.useEffect(() => {
    if (user) {
      form.setFieldsValue({
        username: user.username,
        email: user.email,
      });
    }
  }, [user, form]);
  
  // 处理基本信息提交
  const handleProfileSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success('个人信息更新成功');
      setEditing(false);
    } catch (error) {
      console.error('提交失败:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // 处理密码更新
  const handlePasswordSubmit = async () => {
    try {
      setLoading(true);
      const values = await passwordForm.validateFields();
      
      // 验证新密码和确认密码是否一致
      if (values.newPassword !== values.confirmPassword) {
        message.error('新密码和确认密码不一致');
        return;
      }
      
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success('密码更新成功');
      passwordForm.resetFields();
      setEditingPassword(false);
    } catch (error) {
      console.error('提交失败:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // 处理头像上传
  const handleAvatarChange = (info: any) => {
    if (info.file.status === 'done') {
      message.success('头像上传成功');
    } else if (info.file.status === 'error') {
      message.error('头像上传失败');
    }
  };
  
  if (!user) {
    return <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />;
  }
  
  return (
    <div>
      <Title level={2}>个人资料</Title>
      
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <Upload
                name="avatar"
                listType="picture-card"
                showUploadList={false}
                action="/api/upload"
                onChange={handleAvatarChange}
              >
                <Avatar
                  icon={<UserOutlined />}
                  size={128}
                  style={{ margin: '0 auto 16px' }}
                />
                <div>更换头像</div>
              </Upload>
              
              <Meta
                title={user.username}
                description={user.email}
              />
              
              <div style={{ marginTop: 16 }}>
                <Text type="secondary">角色: {user.roles.join(', ')}</Text>
              </div>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} md={16}>
          <Card title="基本信息">
            <Form
              form={form}
              layout="vertical"
            >
              <Form.Item
                name="username"
                label="用户名"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input placeholder="请输入用户名" disabled={!editing} />
              </Form.Item>
              
              <Form.Item
                name="email"
                label="邮箱"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '请输入有效的邮箱地址' }
                ]}
              >
                <Input placeholder="请输入邮箱" disabled={!editing} />
              </Form.Item>
              
              <Form.Item>
                <Space>
                  {editing ? (
                    <>
                      <Button 
                        type="primary" 
                        onClick={handleProfileSubmit}
                        loading={loading}
                      >
                        保存
                      </Button>
                      <Button onClick={() => setEditing(false)}>
                        取消
                      </Button>
                    </>
                  ) : (
                    <Button type="primary" onClick={() => setEditing(true)}>
                      编辑
                    </Button>
                  )}
                </Space>
              </Form.Item>
            </Form>
          </Card>
          
          <Card title="修改密码" style={{ marginTop: 24 }}>
            <Form
              form={passwordForm}
              layout="vertical"
            >
              {editingPassword && (
                <Form.Item
                  name="currentPassword"
                  label="当前密码"
                  rules={[{ required: true, message: '请输入当前密码' }]}
                >
                  <Input.Password placeholder="请输入当前密码" />
                </Form.Item>
              )}
              
              <Form.Item
                name="newPassword"
                label="新密码"
                rules={[
                  { required: true, message: '请输入新密码' },
                  { min: 6, message: '密码长度不能少于6个字符' }
                ]}
              >
                <Input.Password placeholder="请输入新密码" disabled={!editingPassword} />
              </Form.Item>
              
              <Form.Item
                name="confirmPassword"
                label="确认密码"
                rules={[{ required: true, message: '请确认新密码' }]}
              >
                <Input.Password placeholder="请再次输入新密码" disabled={!editingPassword} />
              </Form.Item>
              
              <Form.Item>
                <Space>
                  {editingPassword ? (
                    <>
                      <Button 
                        type="primary" 
                        onClick={handlePasswordSubmit}
                        loading={loading}
                      >
                        保存密码
                      </Button>
                      <Button onClick={() => {
                        passwordForm.resetFields();
                        setEditingPassword(false);
                      }}>
                        取消
                      </Button>
                    </>
                  ) : (
                    <Button type="primary" onClick={() => setEditingPassword(true)}>
                      修改密码
                    </Button>
                  )}
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UserProfile;
