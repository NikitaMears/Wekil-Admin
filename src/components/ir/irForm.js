import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Upload, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import useFetchWithToken from '../../services/api';

const { Option } = Select;

const IRForm = ({ formData, setFormData, closeModal, setSubmitted }) => {
  const [form] = Form.useForm();
  const [rfps, setRfps] = useState([]);
  const { data: fetchedData } = useFetchWithToken("rfps");
  const { postFormData, putFormData } = useFetchWithToken('rfps');


  useEffect(() => {
    if (fetchedData) {
      setRfps(fetchedData);
    }
  }, [fetchedData]);

  useEffect(() => {
    form.setFieldsValue(formData);
  }, [formData, form]);

  const handleRfpChange = value => {
    const selectedRfp = rfps.find(rfp => rfp.id === value);
    if (selectedRfp) {
      // Update form data with selected RFP details
      setFormData({ ...formData, rfpId: selectedRfp.id, rfpNo: selectedRfp.rfpNo });
    }
  };

  const onFinish = async (values) => {
    try {
      // Append the file to the form values
      const formDataWithFile = { ...values, file: values.file?.file || formData.file };

      if (!formData.id) {
        await postFormData(formDataWithFile, `UploadIR`);      
        setFormData({});
        closeModal();
        setSubmitted(true);
      } else {
        // Use the postFormData function to upload the form data including the file
        await putFormData(formDataWithFile, `UploadIR/${formData.id}`);      }
      setFormData({});
      closeModal();
      setSubmitted(true); // Trigger refetch after successful form submission
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Please enter a Title' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="RFP" name="rfpId" rules={[{ required: true, message: 'Please select an RFP' }]}>
        <Select onChange={handleRfpChange}>
          {rfps.map(rfp => (
            <Option key={rfp.id} value={rfp.id}>{rfp.rfpNo}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="RFP No." name="rfpNo">
        <Input disabled />
      </Form.Item>
      <Form.Item label="Content" name="content" rules={[{ required: true, message: 'Please enter content' }]}>
        <Input.TextArea rows={6} />
      </Form.Item>
      <Form.Item label="File" name="file">
        <Upload beforeUpload={() => false} name="file" multiple={false}>
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
      </Form.Item>
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

export default IRForm;
