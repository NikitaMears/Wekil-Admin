import React, { useState } from 'react';
import { Card, Row, Col, Button, Table, Modal, Spin } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import RoleForm from './roleForm';
import useFetchWithToken from '../../services/api';

const Role = () => {
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [formData, setFormData] = useState({});
  const { data: roleData, loading, error, refetchData } = useFetchWithToken('roles');

  const handleAddRole = () => {
    setFormData({});
    setRoleModalVisible(true);
  };

  const handleEditRole = (record) => {
    setFormData(record);
    setRoleModalVisible(true);
  };

  const handleDeleteRole = (roleId) => {
    // Implement deletion logic
  };

  const closeModal = () => {
    setRoleModalVisible(false);
  };

  const roleColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Permissions',
      dataIndex: 'Permissions',
      key: 'permissions',
      render: (permissions) => (
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
          {permissions && permissions.map(permission => (
            <div key={permission.id} style={{ marginRight: 8, marginBottom: 8, backgroundColor: 'lightblue', padding: '4px 8px', borderRadius: 4 }}>{permission.name}</div>
          ))}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEditRole(record)}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Button
            type="danger"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteRole(record.id)}
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
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddRole}>
              Add Role
            </Button>
          </Col>
          <Col span={24}>
            {error && <div>Error: {error}</div>}
            {loading ? (
             <div style={{ textAlign: 'center', marginTop: '20px' }}>
             <Spin size="large" />
           </div>  
            ) : (
              <Table dataSource={roleData} columns={roleColumns} pagination={{ pageSize: 5 }} />
            )}
          </Col>
        </Row>
      </Card>

      <Modal
        title={formData.id ? 'Edit Role' : 'Add Role'}
        visible={roleModalVisible}
        onCancel={() => setRoleModalVisible(false)}
        footer={null}
      >
        {/* Make sure refetchData is passed as a prop */}
        <RoleForm formData={formData} setFormData={setFormData} closeModal={closeModal} refetchData={refetchData} onClose={()=> setRoleModalVisible(false)} />
      </Modal>
    </div>
  );
};

export default Role;
