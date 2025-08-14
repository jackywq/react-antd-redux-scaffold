import React from 'react';
import { Link } from 'react-router-dom';
import { Result, Button, Layout } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';

const { Content } = Layout;

const NotFound: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Result
          icon={<CloseCircleOutlined style={{ fontSize: '48px', color: '#ff4d4f' }} />}
          title="404"
          subTitle="抱歉，您访问的页面不存在"
          extra={
            <Button type="primary" component={Link} to="/">
              返回首页
            </Button>
          }
        />
      </Content>
    </Layout>
  );
};

export default NotFound;
