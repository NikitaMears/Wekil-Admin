import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, Row, Col, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

const SubscriberForm = ({ companyId, closeModal, refetchData }) => {
  const [form] = Form.useForm();
  const [passengers, setPassengers] = useState([]);

  useEffect(() => {
    const fetchPassengers = async () => {
      try {
        const response = await axios.get('http://194.164.72.21:5001/passengers'); // Update with the correct endpoint to fetch passengers
        setPassengers(response.data);
      } catch (error) {
        message.error('Failed to load passengers');
      }
    };

    fetchPassengers();
  }, []);

  const onFinish = async (values) => {
    try {
      const response = await axios.post('http://194.164.72.21:5001/companies/subscribers', {
        ...values,
        companyId,
      });

      message.success('Subscriber added successfully');
      form.resetFields();
      closeModal();
      refetchData(); // Trigger refetch after successful form submission
    } catch (error) {
      console.error('Error:', error);
      message.error('Failed to add subscriber');
    }
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item label="Passenger" name="passengerId" rules={[{ required: true, message: 'Please select a passenger' }]}>
            <Select placeholder="Select a passenger">
              {passengers.map((passenger) => (
                <Option key={passenger.id} value={passenger.id}>
                  {`${passenger.firstName} ${passenger.lastName}`}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Usage Limit" name="usageLimit" rules={[{ required: true, message: 'Please enter a usage limit' }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Status" name="status" rules={[{ required: true, message: 'Please select a status' }]}>
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
          <Form.Item label="Start Date" name="startDate" rules={[{ required: true, message: 'Please enter a start date' }]}>
            <Input type="date" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="End Date" name="endDate" rules={[{ required: true, message: 'Please enter an end date' }]}>
            <Input type="date" />
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

export default SubscriberForm;
