import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Upload, Select, Row, Col, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

const CompanyForm = ({ formData, setFormData, closeModal, refetchData }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [imageFileList, setImageFileList] = useState([]);
  const [licenceFileList, setLicenceFileList] = useState([]);

  useEffect(() => {
    form.setFieldsValue(formData);
  }, [formData, form]);

  const handleFileChange = ({ fileList }) => setFileList(fileList);
  const handleImageFileChange = ({ fileList }) => setImageFileList(fileList);
  const handleLicenceFileChange = ({ fileList }) => setLicenceFileList(fileList);

  const uploadFiles = async (url, companyId) => {
    const formData = new FormData();

    fileList.forEach(({ originFileObj }) => {
      formData.append("documents", originFileObj);
    });

    imageFileList.forEach(({ originFileObj }) => {
      formData.append("companyImage", originFileObj);
    });

    licenceFileList.forEach(({ originFileObj }) => {
      formData.append("companyLicence", originFileObj);
    });

    await axios.put(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  };

  const onFinish = async (values) => {
    try {
      let response;

      if (formData.id) {
        // Update company
        response = await axios.put(`http://194.164.72.21:5001/companies/${formData.id}`, values);
      } else {
        // Add new company
        response = await axios.post('http://194.164.72.21:5001/companies', values);
      }

      if (response?.data?.id) {
        await uploadFiles(`http://194.164.72.21:5001/companies/updateDocuments/${response.data.id}`, response.data.id);

        message.success('Company and documents uploaded successfully');
      } else {
        message.success('Company saved successfully');
      }

      setFormData({});
      closeModal();
      refetchData(); // Trigger refetch after successful form submission
    } catch (error) {
      console.error('Error:', error);
      message.error('Failed to save company');
    }
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Company Name" name="companyName" rules={[{ required: true, message: 'Please enter a company name' }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Contact Person" name="contactPerson" rules={[{ required: true, message: 'Please enter a contact person' }]}>
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
          <Form.Item label="Address" name="address" rules={[{ required: true, message: 'Please enter an address' }]}>
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Balance" name="balance" rules={[{ required: true, message: 'Please enter a balance' }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Credit Limit" name="creditLimit" rules={[{ required: true, message: 'Please enter a credit limit' }]}>
            <Input />
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
        <Col span={8}>
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
        <Col span={8}>
          <Form.Item label="Company Image" name="companyImage">
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
          <Form.Item label="Company Licence" name="companyLicence">
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

export default CompanyForm;
