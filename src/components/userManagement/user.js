// User.js
import React, { useState } from 'react';
import { Card, Row, Col, Button, Table, Modal , Spin} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import UserForm from './userForm';
import useFetchWithToken from '../../services/api2';

const User = () => {
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [formData, setFormData] = useState({});
  const { data: userData, loading, error, refetchData } = useFetchWithToken('users');

  const handleAddUser = () => {
    setFormData({});
    setUserModalVisible(true);
  };

  const handleEditUser = (record) => {
    setFormData(record);
    setUserModalVisible(true);
  };

  const handleDeleteUser = (userId) => {
    // Implement deletion logic
  };

  const closeModal = () => {
    setUserModalVisible(false);
  };

  const userColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'First Name', dataIndex: 'firstName', key: 'firstName' },
    { title: 'Last Name', dataIndex: 'lastName', key: 'lastName' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Phone', dataIndex: 'phoneNumber', key: 'phoneNumber' },
    { 
      title: 'Role', 
      dataIndex: ['Role', 'name'],
      key: 'role' 
    },    
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEditUser(record)}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Button
            type="danger"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteUser(record.id)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddUser}>
              Add User
            </Button>
          </Col>
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

      <Modal
  title={formData.id ? 'Edit User' : 'Add User'}
  visible={userModalVisible}
  onCancel={() => setUserModalVisible(false)}
  footer={null}
>
  {/* Make sure refetchData is passed as a prop */}
  <UserForm formData={formData} setFormData={setFormData} closeModal={closeModal} refetchData={refetchData} />
</Modal>


    </div>
  );
};

export default User;
