import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Table, Modal,  message , Spin} from 'antd';
import { PlusOutlined,  } from '@ant-design/icons';
import PermissionForm from './permissionForm';

const Permission = () => {
  const [permissionData, setPermissionData] = useState([]);
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const permissionColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          {/* <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEditPermission(record)}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Button
            type="danger"
            icon={<DeleteOutlined />}
            onClick={() => handleDeletePermission(record.id)}
          >
            Delete
          </Button> */}
        </>
      ),
    },
  ];

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }
      setLoading(true);
      const response = await fetch('https://kmsbe.frontieri.com/kmsApi/permissions', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        setPermissionData(data);
        setLoading(false)
      } else {
        throw new Error(data.message || 'Failed to fetch permissions');
      }
    } catch (error) {
      console.error('Error fetching permissions:', error);
      message.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPermission = () => {
    setFormData({});
    setPermissionModalVisible(true);
  };

 



  return (
    <div>
      <Card>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Button type='primary' icon={<PlusOutlined />} onClick={handleAddPermission}>
              Add Permission
            </Button>
          </Col>
          <Col span={24}>
          {loading ? (
  <div style={{ textAlign: 'center', marginTop: '20px' }}>
  <Spin size="large" />
</div>      ) : (
            <Table
              dataSource={permissionData}
              columns={permissionColumns}
              loading={loading}
              rowKey="id"
              pagination={{ pageSize: 5 }}

            />
            )}
          </Col>
        </Row>
      </Card>

      <Modal
        title={formData.id ? 'Edit Permission' : 'Add Permission'}
        visible={permissionModalVisible}
        onCancel={() => setPermissionModalVisible(false)}
        footer={null}
      >
        <PermissionForm formData={formData} setFormData={setFormData} />
      </Modal>
    </div>
  );
};

export default Permission;
