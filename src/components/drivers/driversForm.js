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
  const { postFormData, putFormData } = useFetchWithToken('drivers');

  useEffect(() => {
    form.setFieldsValue(formData);
  }, [formData, form]);

  const handleFileChange = ({ fileList }) => setFileList(fileList);
  const handleImageFileChange = ({ fileList }) => setImageFileList(fileList);
  const handleLicenceFileChange = ({ fileList }) => setLicenceFileList(fileList);

  const uploadFiles = async (url, driverId) => {
    const formData = new FormData();

    fileList.forEach(({ originFileObj }) => {
      formData.append("documents", originFileObj);
    });

    imageFileList.forEach(({ originFileObj }) => {
      formData.append("driverImage", originFileObj);
    });

    licenceFileList.forEach(({ originFileObj }) => {
      formData.append("driverLicence", originFileObj);
    });

    await axios.put(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data', 'tennant':'web' },
    });
  };

  const onFinish = async (values) => {
    try {
      let response;

      if (formData.id) {
        // Update driver
        response = await putFormData(values, `drivers/${formData.id}`);
      } else {
        // Add new driver
        response = await postFormData(values, 'drivers');
      }

      if (response?.driver?.id) {
      //  await uploadFiles(`http://194.164.72.21:5001/drivers/updateDocuments/${response.driver.id}`, response.driver.id);

      message.success('Driver saved successfully');
    } else {
        message.success('Driver saved successfully');
      }

      setFormData({});
      closeModal();
      refetchData(); // Trigger refetch after successful form submission
    } catch (error) {
      console.error('Error:', error);
      // message.error('Failed to save driver');
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
          <Form.Item label="Status" name="status">
            <Select>
              <Option value="Pending">Pending</Option>
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
     
   
    
      {/* <Row gutter={16}>
        <Col span={8}>
          <Form.Item label="Documents" rules={[{ required: false, message: 'Please enter a first name' }]} name="documents">
            <Upload
              beforeUpload={() => false}
              fileList={fileList}
              onChange={handleFileChange}
              maxCount={3}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Driver Image" rules={[{ required: false, message: 'Please enter a first name' }]} name="driverImage">
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
        <Col span={8}>
          <Form.Item label="Driver Licence" rules={[{ required: false, message: 'Please enter a first name' }]} name="driverLicence">
            <Upload
              beforeUpload={() => false}
              fileList={licenceFileList}
              onChange={handleLicenceFileChange}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
        </Col>
      </Row> */}
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
