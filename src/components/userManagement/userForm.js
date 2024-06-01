import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select } from 'antd';
import Password from 'antd/lib/input/Password';
import useFetchWithToken from '../../services/api';

const { Option } = Select;

const UserForm = ({ formData, setFormData, closeModal }) => {
  const [form] = Form.useForm();
  const { data: roles, loading: rolesLoading, error: rolesError } = useFetchWithToken('roles');
  const { postData, putData } = useFetchWithToken('users');
  const [submitted, setSubmitted] = useState(false); // State to trigger refetch

  useEffect(() => {
    form.setFieldsValue(formData);
  }, [formData, form]);

  const onFinish = async (values) => {
    try {
      if (formData.id) {
        await putData(values, formData.id);
      } else {
        await postData(values);
      }
      setFormData({});
      closeModal();
      setSubmitted(true); // Trigger refetch after successful form submission
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (submitted) {
      setSubmitted(false); // Reset submitted state
      // Refetch data here
      // You may fetch data again using the same method you use in the User component
    }
  }, [submitted]);

  if (rolesError) {
    return <div>Error: {rolesError}</div>;
  }

  if (rolesLoading) {
    return <div>Loading roles...</div>;
  }

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item label="First Name" name="firstName" rules={[{ required: true, message: 'Please enter a First Name' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Last Name" name="lastName" rules={[{ required: true, message: 'Please enter a Last Name' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please enter an Email' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Phone Number" name="phoneNumber" rules={[{ required: true, message: 'Please enter a Phone Number' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please enter a Password' }]}>
        <Password />
      </Form.Item>
  <Form.Item label="Role" name="RoleId" rules={[{ required: true, message: 'Please select a Role' }]}>
  <Select>
    {roles && roles.map(role => (
      <Option key={role.id} value={role.id}>{role.name}</Option>
    ))}
  </Select>
  </Form.Item>
  
      <Form.Item label="Status" name="status" rules={[{ required: true, message: 'Please select a Status' }]}>
        <Select>
          <Option value="Active">Active</Option>
          <Option value="Inactive">Inactive</Option>
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UserForm;

