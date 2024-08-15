import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, Row, Col, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

const VehiclesForm = ({ formData, setFormData, closeModal, setSubmitted }) => {
  const [form] = Form.useForm();
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    fetchVehicleTypes();
    fetchDrivers();
  }, []);

  useEffect(() => {
    if (formData) {
      form.setFieldsValue({
        ...formData,
        driverId: formData.driverId, // Set the driver ID correctly
      });
    }
  }, [formData, form]);

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

      // Map driverId to the correct driver name when editing a vehicle
      if (formData && formData.driverId) {
        const selectedDriver = response.data.find(driver => driver.id === formData.driverId);
        if (selectedDriver) {
          form.setFieldsValue({
            ...formData,
            driverId: selectedDriver.id, // This will match the ID in the dropdown
          });
        }
      }
    } catch (error) {
      message.error("Unable to load drivers");
    }
  };

  const onFinish = async (values) => {
    const submitData = new FormData();

    Object.keys(values).forEach(key => {
      submitData.append(key, values[key]);
    });

    try {
      let response;
      if (formData.id) {
        // Update vehicle
        response = await axios.put(`http://194.164.72.21:5001/vehicles/${formData.id}`, submitData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        // Add new vehicle
        response = await axios.post('http://194.164.72.21:5001/vehicles', submitData, {
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
          <Form.Item label="Manufactured Year" rules={[{ required: true, message: 'Please enter a year' }]} name="manufacturedYear">
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
