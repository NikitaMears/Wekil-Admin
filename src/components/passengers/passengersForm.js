import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Upload, Select, Row, Col, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import useFetchWithToken from '../../services/api';
import axios from 'axios';

const { Option } = Select;

const DriversForm = ({ formData, setFormData, closeModal, refetchData }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [imageFileList, setImageFileList] = useState([]);
  const [licenceFileList, setLicenceFileList] = useState([]);
  const { postFormData, putFormData } = useFetchWithToken('passengers');

  useEffect(() => {
    form.setFieldsValue(formData);
  }, [formData, form]);

  const handleFileChange = ({ fileList }) => setFileList(fileList);
  const handleImageFileChange = ({ fileList }) => setImageFileList(fileList);
  const handleLicenceFileChange = ({ fileList }) => setLicenceFileList(fileList);

  const uploadFiles = async (url, passengerId) => {
    const formData = new FormData();

    
    imageFileList.forEach(({ originFileObj }) => {
      formData.append("passengerImage", originFileObj);
    });

 
    await axios.put(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data', 'tennant':'web' },
    });
  };

  const onFinish = async (values) => {
    try {
      let response;

      if (formData.id) {
        // Update passenger
        response = await putFormData(values, `passengers/${formData.id}`);
      } else {
        // Add new passenger
        response = await postFormData(values, 'passengers');
      }

      if (response?.passenger?.id) {
        await uploadFiles(`http://194.164.72.21:5001/passengers/updateDocuments/${response.passenger.id}`, response.passenger.id);

        message.success('Passenger and documents uploaded successfully');
      } else {
        message.success('Passenger saved successfully');
      }

      setFormData({});
      closeModal();
      refetchData(); // Trigger refetch after successful form submission
    } catch (error) {
      console.error('Error:', error);
      message.error('Failed to save passenger');
    }
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="First Name" name="firstName" rules={[{ required: true, message: 'Please enter a first name' }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Last Name" name="lastName" rules={[{ required: true, message: 'Please enter a last name' }]}>
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Phone Number" name="phoneNumber" rules={[{ required: true, message: 'Please enter a phone number' }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please enter an email' }]}>
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please enter a password' }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Confirm Password" name="confPassword" rules={[{ required: true, message: 'Please confirm your password' }]}>
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Address" name="address">
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Status" name="status">
            <Select>
              <Option value="Pending">Pending</Option>
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Rating" name="rating">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
   
        <Col span={8}>
          <Form.Item label="Passenger Image" name="passengerImage">
            <Upload
              beforeUpload={() => false}
              fileList={imageFileList}
              onChange={handleImageFileChange}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
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

export default DriversForm;
