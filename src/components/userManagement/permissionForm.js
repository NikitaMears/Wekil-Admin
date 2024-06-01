import React, {  useEffect } from 'react';
import {  Button, Form, Input } from 'antd';

const PermissionForm = ({ formData, setFormData }) => {
    const [form] = Form.useForm();
  
    useEffect(() => {
      form.setFieldsValue(formData);
    }, [formData, form]);
  
    const handleSavePermission = () => {
    
    };
  
    return (
      <Form form={form} onFinish={handleSavePermission} layout="vertical">
        <Form.Item name="name" label="Permission Name" rules={[{ required: true, message: 'Please enter permission name' }]}>
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
    );
  };

  export default PermissionForm;