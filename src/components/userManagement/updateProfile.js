import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';

const { Password } = Input;

const UpdateProfile = ({ onClose, onOk }) => {
  const [form] = Form.useForm();
  const userData = JSON.parse(localStorage.getItem('userData'));
  const id = userData.id;

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await axios.get(`http://194.164.72.21:5001/users/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setFormData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
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
    try {
      await axios.put(`http://194.164.72.21:5001/users/updateProfile/${id}`, values, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const response = await axios.get(`http://194.164.72.21:5001/users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      message.success("Update Successful.");

      setFormData(response.data);
      onOk(); // Close the modal on successful submission

    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleCancel = () => {
    onClose(); // Close the modal on cancel
  };
  const handleOk = () => {
    onOk(); // Close the modal on cancel
  };

  if (loading) {
    return <div>Loading...</div>;
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

export default UpdateProfile;
