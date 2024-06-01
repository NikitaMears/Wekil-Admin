import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Modal } from 'antd';
import useFetchWithToken from '../../services/api';

const TeamForm = ({ formData, setFormData, closeModal, refetchData, type }) => {
  const [loading, setLoading] = useState(false);
  const { postData, putData } = useFetchWithToken('teams');

  useEffect(() => {
    setFormData(formData);
  }, [formData, setFormData]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      if (type === 'edit') {
        await putData(values, formData.id);
      } else {
        await postData(values);
      }
      closeModal();
      refetchData();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
 
      <Form onFinish={handleSubmit} initialValues={formData}>
        <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter the team name' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please enter the team description' }]}>
          <Input.TextArea />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Submit
          </Button>
          <Button onClick={closeModal} style={{ marginLeft: 8 }}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
  );
};

export default TeamForm;
