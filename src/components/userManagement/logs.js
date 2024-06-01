// User.js
import React, { useState } from 'react';
import { Card, Row, Col, Button, Table, Modal , Spin, Tooltip} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import UserForm from './userForm';
import useFetchWithToken from '../../services/api';
import moment from 'moment';

const Logs = () => {

  const { data: userData, loading, error, refetchData } = useFetchWithToken('logs');



  const userColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width:100 },
    {
        title: 'User',
        dataIndex: ['user', 'firstName'], // Ensure this path is correct according to your data structure
        key: 'user',
        ellipsis: true,
        width: 400,
        render: (text, record) => (
          <Tooltip title={`${record?.user?.firstName} ${record?.user?.lastName}`}>
            {`${record?.user?.firstName} ${record?.user?.lastName}`}
          </Tooltip>
        )
      }
,         
{
    title: 'Last Activity',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (text) => {
      const formattedDate = moment(text).format('MMMM Do YYYY, h:mm A'); // Format as desired
      return (
        <Tooltip title={formattedDate}>
          {formattedDate}
        </Tooltip>
      );
    }
  }, 
  
  ];

  return (
    <div>
      <Card>
        <Row gutter={[16, 16]}>
        
          <Col span={24}>
            {error && <div>Error: {error}</div>}
            {loading ? (
             <div style={{ textAlign: 'center', marginTop: '20px' }}>
             <Spin size="large" />
           </div>  
            ) : (
              <Table dataSource={userData} columns={userColumns} pagination={{ pageSize: 5 }} />
            )}
          </Col>
        </Row>
      </Card>

     
    </div>
  );
};

export default Logs;
