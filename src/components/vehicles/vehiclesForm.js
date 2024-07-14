import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Upload, Select, Row, Col, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

const VehiclesForm = ({ formData, setFormData, closeModal, setSubmitted }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [imageFileList, setImageFileList] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    form.setFieldsValue(formData);
  }, [formData, form]);

  useEffect(() => {
    fetchVehicleTypes();
    fetchDrivers();
  }, []);

  const fetchVehicleTypes = async () => {
    try {
      const response = await axios.get("http://194.164.72.21:5001/vehicleTypes");
      setVehicleTypes(response.data);
    } catch (error) {
      message.error("Unable to load vehicle types");
    }
  };

  const fetchDrivers = async () => {
    try {
      const response = await axios.get("http://194.164.72.21:5001/drivers");
      setDrivers(response.data);
    } catch (error) {
      message.error("Unable to load drivers");
    }
  };

  const handleFileChange = ({ fileList }) => setFileList(fileList);
  const handleImageFileChange = ({ fileList }) => setImageFileList(fileList);

  const onFinish = async (values) => {
    const formData = new FormData();

    Object.keys(values).forEach(key => {
      formData.append(key, values[key]);
    });

    fileList.forEach(file => {
      formData.append('documents', file.originFileObj);
    });

    imageFileList.forEach(file => {
      formData.append('vehicleImage', file.originFileObj);
    });

    try {
      let response;
      if (formData.id) {
        // Update vehicle
        response = await axios.put(`http://194.164.72.21:5001/vehicles/${formData.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        // Add new vehicle
        response = await axios.post('http://194.164.72.21:5001/vehicles', formData, {
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
      message.error('Failed to save vehicle');
    }
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Plate Number" name="plateNumber" rules={[{ required: true, message: 'Please enter a plate number' }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Model" name="model" rules={[{ required: true, message: 'Please enter a model' }]}>
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Color" name="color" rules={[{ required: true, message: 'Please enter a color' }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Manufactured Year" name="manufacturedYear">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Vehicle Type" name="vehicleTypeId" rules={[{ required: true, message: 'Please select a vehicle type' }]}>
            <Select>
              {vehicleTypes.map(type => (
                <Option key={type.id} value={type.id}>{type.typeName}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Driver" name="driverId" rules={[{ required: true, message: 'Please select a driver' }]}>
            <Select>
              {drivers.map(driver => (
                <Option key={driver.id} value={driver.id}>{`${driver.firstName} ${driver.lastName}`}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
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
          <Form.Item label="Vehicle Image" name="vehicleImage">
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
        <Col span={12}>
          <Form.Item label="Documents" name="documents">
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

export default VehiclesForm;
