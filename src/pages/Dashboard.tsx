import React, { useEffect, useState } from 'react';
import { Card, Statistic, Row, Col, Table, Progress, Typography } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, UserOutlined, ShoppingOutlined, DollarOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelectorTyped } from '@/store/hooks';
import { fetchUsers } from '@/store/slices/userSlice';

const { Title, Text } = Typography;

// 模拟数据
const salesData = [
  { name: '1月', value: 1200 },
  { name: '2月', value: 1900 },
  { name: '3月', value: 1500 },
  { name: '4月', value: 2400 },
  { name: '5月', value: 2100 },
  { name: '6月', value: 3200 },
];

const recentOrdersData = [
  {
    key: '1',
    orderNumber: 'ORD-2023-001',
    customer: '张三',
    date: '2023-11-01',
    amount: 1250,
    status: '已完成',
  },
  {
    key: '2',
    orderNumber: 'ORD-2023-002',
    customer: '李四',
    date: '2023-11-02',
    amount: 890,
    status: '处理中',
  },
  {
    key: '3',
    orderNumber: 'ORD-2023-003',
    customer: '王五',
    date: '2023-11-03',
    amount: 2100,
    status: '已完成',
  },
  {
    key: '4',
    orderNumber: 'ORD-2023-004',
    customer: '赵六',
    date: '2023-11-04',
    amount: 1560,
    status: '已取消',
  },
];

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users } = useAppSelectorTyped((state) => state.user);
  const [progress, setProgress] = useState(0);
  
  // 模拟进度条加载
  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);
  
  // 获取用户数据
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);
  
  const orderColumns = [
    {
      title: '订单编号',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
    },
    {
      title: '客户',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `¥ ${amount.toFixed(2)}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color: 'secondary' | 'success' | 'warning' = 'secondary';
        if (status === '已完成') color = 'success';
        if (status === '处理中') color = 'secondary';
        if (status === '已取消') color = 'warning';
        
        return <Text type={color}>{status}</Text>;
      },
    },
  ];
  
  return (
    <div>
      <Title level={2}>仪表盘</Title>
      
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总用户数"
              value={users.length}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
              prefix={<UserOutlined />}
              suffix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="今日订单"
              value={28}
              precision={0}
              valueStyle={{ color: '#1890ff' }}
              prefix={<ShoppingOutlined />}
              suffix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="今日销售额"
              value={12500}
              precision={2}
              valueStyle={{ color: '#722ed1' }}
              prefix={<DollarOutlined />}
              suffix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="转化率"
              value={38.5}
              precision={2}
              valueStyle={{ color: '#cf1322' }}
              suffix="%"
              prefix={<ArrowDownOutlined />}
            />
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="销售趋势">
            <Table
              dataSource={salesData}
              columns={[
                { title: '月份', dataIndex: 'name', key: 'name' },
                { title: '销售额', dataIndex: 'value', key: 'value', render: (val: number) => `¥ ${val}` }
              ]}
              pagination={false}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="最近订单">
            <Table
              dataSource={recentOrdersData}
              columns={orderColumns}
              pagination={{ pageSize: 4 }}
            />
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card title="任务进度">
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text>季度目标完成度</Text>
                <Text strong>66%</Text>
              </div>
              <Progress percent={progress} status="active" />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
