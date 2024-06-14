import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Upload, Select, Row, Col, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

const VehicleTypesForm = ({ formData, setFormData, closeModal, setSubmitted }) => {
  const [form] = Form.useForm();
  const [vehicleTypes, setVehicleTypes] = useState([]);

  useEffect(() => {
    form.setFieldsValue(formData);
  }, [formData, form]);

  useEffect(() => {
    fetchVehicleTypes();
  }, []);

  const fetchVehicleTypes = async () => {
    try {
      const response = await axios.get("http://195.35.37.39:5001/vehicleTypes");
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
        response = await axios.put(`http://195.35.37.39:5001/vehicleTypes/${formData.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        // Add new vehicle
        response = await axios.post('http://195.35.37.39:5001/vehicleTypes', formData, {
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
      message.error('Failed to save vehicleTypes');
    }
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Type Name" name="typeName" rules={[{ required: true, message: 'Please enter type name' }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Price Per KM" name="pricePerKM" rules={[{ required: true, message: 'Please enter pricePerKM' }]}>
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Surge Price Per KM" name="surgePricePerKM" rules={[{ required: true, message: 'Please enter SurgePricePerKM' }]}>
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

export default VehicleTypesForm;
