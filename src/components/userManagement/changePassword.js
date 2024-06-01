import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';

const { Password } = Input;

const ChangePassword = ({ onClose, onOk }) => {
  const [form] = Form.useForm();
  const userData = JSON.parse(localStorage.getItem('userData'));
  const id = userData.id;

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await axios.get(`https://kmsbe.frontieri.com/kmsApi/users/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setFormData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        message.error('Error fetching user data');
      }
    };

    getUserData();
  }, [id]);

  useEffect(() => {
    if (formData) {
      form.setFieldsValue({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
      });
    }
  }, [formData, form]);

  const onFinish = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('New Password and Confirm Password do not match');
      return;
    }

    try {
      await axios.put(`https://kmsbe.frontieri.com/kmsApi/users/change-password/${id}`, values, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const response = await axios.get(`https://kmsbe.frontieri.com/kmsApi/users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      message.success("Update Successful.");

      setFormData(response.data);
      onOk(); // Close the modal on successful submission

    } catch (error) {
      console.error('Error updating data:', error);
      if (error.response || error.response.data || error.response.data.message) {
        message.error('Invalid current Password');
      } else {
        message.error('Error updating password');
      }
    }
  };

  const handleCancel = () => {
    onClose(); // Close the modal on cancel
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item 
        label="Current Password" 
        name="currentPassword" 
        rules={[{ required: true, message: 'Please enter your current password' }]}>
        <Password />
      </Form.Item>
      <Form.Item 
        label="New Password" 
        name="newPassword" 
        rules={[
          { required: true, message: 'Please enter your new password' },
          { 
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 
            message: 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character'
          }
        ]}>
        <Password />
      </Form.Item>
      <Form.Item 
        label="Confirm Password" 
        name="confirmPassword" 
        dependencies={['newPassword']} 
        rules={[
          { required: true, message: 'Please confirm your new password' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('newPassword') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('The two passwords that you entered do not match'));
            },
          }),
        ]}>
        <Password />
      </Form.Item>
    
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
        <Button onClick={handleCancel} style={{ marginLeft: 8 }}>
          Cancel
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ChangePassword;
