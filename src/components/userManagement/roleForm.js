import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import PermissionSelection from './permissionSelection';
import useFetchWithToken from '../../services/api';

const RoleForm = ({ formData, setFormData, onClose }) => {
  const [form] = Form.useForm();
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const { data: permissions, loading, error } = useFetchWithToken('permissions');
  const { postData, putData } = useFetchWithToken('roles');

  useEffect(() => {
    form.setFieldsValue(formData);
    setSelectedPermissions(formData.permissions || []);
  }, [formData, form]);

  const handleSaveRole = async (values) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }
      // let method = 'POST';
      // let url = 'roles';
      // if (formData.id) {
      //   url = `roles/${formData.id}`;
      //   method = 'PUT';
      // }
      const responseData = formData.id ? await putData(values, formData.id) : await postData(values);
        message.success('Role saved successfully');
        setFormData({});
        onClose(); // Close the modal
        console.log(responseData)
    
    } catch (error) {
      console.error('Error saving role:', error);
      message.error(error.message || 'Failed to save role');
    }
  };

  return (
    <Form form={form} onFinish={handleSaveRole} layout="vertical">
      <Form.Item name="name" label="Role Name" rules={[{ required: true, message: 'Please enter role name' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="permissions" label="Permissions">
        {loading ? (
          <div>Loading permissions...</div>
        ) : error ? (
          <div>Error loading permissions: {error}</div>
        ) : (
          <PermissionSelection permissions={permissions} selectedPermissions={selectedPermissions} onChange={setSelectedPermissions} />
        )}
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RoleForm;
