import React, { useEffect, useState } from 'react';
import { Form, Input, Button,Select, Row, Col, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

const SearchRadiusesForm = ({ formData, setFormData, closeModal, setSubmitted }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(formData);
  }, [formData, form]);

  const onFinish = async (values) => {
    try {
      // Prepare form data, including the existing ID for update
      const updatedData = { ...formData, ...values };

      // Use axios to make the PUT request with the existing ID
      const response = await axios.put(`http://194.164.72.21:5001/searchRadius/${formData.id}`, updatedData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setFormData({});
      closeModal();
      setSubmitted(true); // Trigger refetch after successful form submission
      message.success('Search Radius updated successfully');
    } catch (error) {
      console.error('Error:', error);
      message.error('Failed to save search radius');
    }
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter type name' }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Distance" name="distance" rules={[{ required: true, message: 'Please enter distance' }]}>
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Status" name="status" rules={[{ required: true, message: 'Please enter Status' }]}>
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
        <Button htmlType="button" onClick={() => form.resetFields()}>
          Reset
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SearchRadiusesForm;
