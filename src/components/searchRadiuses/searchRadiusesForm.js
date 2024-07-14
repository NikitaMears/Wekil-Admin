import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Upload, Select, Row, Col, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

const SearchRadiusesForm = ({ formData, setFormData, closeModal, setSubmitted }) => {
  const [form] = Form.useForm();
  const [initialPrices, setVehicleTypes] = useState([]);

  useEffect(() => {
    form.setFieldsValue(formData);
  }, [formData, form]);

  useEffect(() => {
    fetchVehicleTypes();
  }, []);

  const fetchVehicleTypes = async () => {
    try {
      const response = await axios.get("http://194.164.72.21:5001/initialPrices");
      setVehicleTypes(response.data);
    } catch (error) {
      message.error("Unable to load vehicle types");
    }
  };



  const onFinish = async (values) => {
    const formData = new FormData();

    Object.keys(values).forEach(key => {
      formData.append(key, values[key]);
    });

 

  

    try {
      let response;
      if (formData.id) {
        // Update vehicle
        response = await axios.put(`http://194.164.72.21:5001/initialPrices/${formData.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        // Add new vehicle
        response = await axios.post('http://194.164.72.21:5001/initialPrices', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      if (response.data.id) {
        message.success('Vehicle and documents uploaded successfully');
      } else {
        message.success('Vehicle saved successfully');
      }

      setFormData({});
      closeModal();
      setSubmitted(true); // Trigger refetch after successful form submission
    } catch (error) {
      console.error('Error:', error);
      message.error('Failed to save initialPrices');
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
          <Form.Item label="Amount" name="amount" rules={[{ required: true, message: 'Please enter amount' }]}>
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
