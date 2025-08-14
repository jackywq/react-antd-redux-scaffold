import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, Modal, Form, Input, message, Typography, Spin } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { User } from '@/store/slices/authSlice';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { fetchUsers, addUser, updateUser, deleteUser } from '@/store/slices/userSlice';
import type { RootState } from '@/store';

const { Title } = Typography;
const { Search } = Input;

const UserManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, loading, error } = useAppSelector((state: RootState) => state.user);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [searchText, setSearchText] = useState('');
  
  // 获取用户列表
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);
  
  // 处理错误信息
  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);
  
  // 过滤用户列表
  const filteredUsers = users.filter((user: User) => 
    user.username.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email.toLowerCase().includes(searchText.toLowerCase())
  );
  
  // 打开添加用户模态框
  const showAddModal = () => {
    setModalType('add');
    setCurrentUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };
  
  // 打开编辑用户模态框
  const showEditModal = (user: User) => {
    setModalType('edit');
    setCurrentUser(user);
    form.setFieldsValue({
      username: user.username,
      email: user.email,
      roles: user.roles.join(',')
    });
    setIsModalVisible(true);
  };
  
  // 关闭模态框
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  
  // 提交表单（添加或编辑用户）
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (modalType === 'add') {
        // 添加用户
        await dispatch(addUser({
          username: values.username,
          email: values.email,
          roles: values.roles.split(',').map((role: string) => role.trim())
        }));
        message.success('用户添加成功');
      } else if (modalType === 'edit' && currentUser) {
        // 编辑用户
        await dispatch(updateUser({
          id: currentUser.id,
          userData: {
            username: values.username,
            email: values.email,
            roles: values.roles.split(',').map((role: string) => role.trim())
          }
        }));
        message.success('用户更新成功');
      }
      
      setIsModalVisible(false);
    } catch (error) {
      console.error('提交失败:', error);
    }
  };
  
  // 删除用户
  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个用户吗？此操作不可撤销。',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          await dispatch(deleteUser(id));
          message.success('用户删除成功');
        } catch (error) {
          message.error('删除失败');
        }
      }
    });
  };
  
  // 表格列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '10%',
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      width: '20%',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: '25%',
    },
    {
      title: '角色',
      key: 'roles',
      dataIndex: 'roles',
      width: '25%',
      render: (roles: string[]) => (
        <Space size="small">
          {roles.map(role => (
            <Tag key={role} color={role === 'admin' ? 'red' : 'blue'}>
              {role}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: '20%',
      render: (_: any, record: User) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => showEditModal(record)}
          >
            编辑
          </Button>
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];
  
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2}>用户管理</Title>
        <Space>
          <Search
            placeholder="搜索用户名或邮箱"
            allowClear
            enterButton={<SearchOutlined />}
            style={{ width: 300 }}
            onSearch={value => setSearchText(value)}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
            添加用户
          </Button>
        </Space>
      </div>
      
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          bordered
        />
      </Spin>
      
      {/* 添加/编辑用户模态框 */}
      <Modal
        title={modalType === 'add' ? '添加用户' : '编辑用户'}
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={handleSubmit}
        confirmLoading={loading}
      >
        <Form
          form={form}
          layout="vertical"
          name="user_form"
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, message: '用户名长度不能少于3个字符' }
            ]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          
          <Form.Item
            name="roles"
            label="角色"
            rules={[{ required: true, message: '请输入角色，多个角色用逗号分隔' }]}
            help="多个角色用逗号分隔，例如: admin,user"
          >
            <Input placeholder="请输入角色" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
