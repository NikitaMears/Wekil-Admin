import React, { useEffect, useState } from 'react';
import { Form, Input, Button, DatePicker, Row, Col, Select } from 'antd';
import moment from 'moment';
import useFetchWithToken from '../../services/api';
import { message } from 'antd';
import { useHistory } from 'react-router-dom';
const { Option } = Select;

const EditRFPForm = ({ formData, setFormData, closeModal, refetchData }) => {
  const [form] = Form.useForm();
  const history = useHistory();

  const [submitted, setSubmitted] = useState(false);
  const { postData, putData, postFormData } = useFetchWithToken('rfps');
  const [selectedSector, setSelectedSector] = useState('');
  const [statusOptions] = useState(['Bid', 'No Bid', 'Pending']);

  const handleSectorChange = (value) => {
    setSelectedSector(value);
    // You can perform any additional actions based on the selected sector here
    console.log('Selected sector:', value);
  };
console.log("fo", formData)
  // useEffect(() => {
  //   form.setFieldValue({
  //     ...formData,
  //     issuedOn: moment(formData.issuedOn) // Convert to moment object for DatePicker
  //   });
  // }, [formData, form]);

  useEffect(() => {
    form.setFieldsValue({
      ...formData,
      issuedOn: moment(formData.issuedOn)
    });
  }, [formData, form]);

  const onFinish = async (values) => {
    try {
      // Update the existing RFP data
      // You should implement the update functionality according to your API
      const formDataWithFile = { ...values, file: values.file?.file || formData.file };

      await putData(formDataWithFile, formData.id);
      closeModal();

      message.success('RFP updated successfully');
      console.log('Updated RFP data:', values);

      // Redirect to /rfps upon successful update
      history.push('/rfp');

      console.log('Updated RFP data:', values);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (submitted) {
      setSubmitted(false);
      // Trigger refetch data after successful update
      refetchData();
    }
  }, [submitted, refetchData]);

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Please enter a Title' }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="RFP Number" name="rfpNo" rules={[{ required: true, message: 'Please enter an RFP Number' }]}>
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Client" name="client" rules={[{ required: true, message: 'Please enter a Client' }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Country" name="country" rules={[{ required: true, message: 'Please enter a Country' }]}>
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Issued On" name="issuedOn" rules={[{ required: true, message: 'Please enter an Issued On date' }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={12}>
        <Form.Item label="Sector" name="sector" rules={[{ required: true, message: 'Please select a Sector' }]}>
          <Select onChange={handleSectorChange}>
            <Option value="Agriculture">Agriculture</Option>
            <Option value="Healthcare">Healthcare</Option>
            <Option value="Education">Education</Option>
            <Option value="Finance">Finance</Option>
            <Option value="Technology">Technology</Option>
            <Option value="Construction">Construction</Option>
            <Option value="Energy">Energy</Option>
            <Option value="Transportation">Transportation</Option>
            <Option value="Environment">Environment</Option>
            <Option value="Government">Government</Option>
            <Option value="Other">Other</Option>
          </Select>
        </Form.Item>
      </Col>
       
      </Row>
      <Row gutter={16}>

<Col span={12}>
    <Form.Item label="Status" name="status" rules={[{ required: true, message: 'Please select a Status' }]}>
      <Select placeholder="Select status">
        {statusOptions.map((status) => (
          <Option key={status} value={status}>
            {status}
          </Option>
        ))}
      </Select>
    </Form.Item>
  </Col>
  </Row>
      <Row  gutter={16}>
      <Col span={24}>
          <Form.Item label="Objectives" name="objectives" rules={[{ required: true, message: 'Please enter Objectives' }]}>
            <Input.TextArea />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item label="Specific Objectives" name="specificObjectives" rules={[{ required: true, message: 'Please enter Specific Objectives' }]}>
            <Input.TextArea />
          </Form.Item>
        </Col>
       
      </Row>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditRFPForm;
