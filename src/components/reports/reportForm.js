import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Modal, Select } from 'antd';
import useFetchWithToken from '../../services/api';

const { Option } = Select;

const ReportForm = ({ formData, setFormData, closeModal, refetchData, type }) => {
  const [loading, setLoading] = useState(false);
  const { postData, putData, getData } = useFetchWithToken('reports');

  const { data: allTps } = useFetchWithToken('tps');
  const { data: allTeams } = useFetchWithToken('teams');
  const { data: allUsers } = useFetchWithToken('users');

  useEffect(() => {
    setFormData(formData);
  }, [formData, setFormData]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
        await putData(values, formData.id);
  
      closeModal();
      refetchData();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onFinish={handleSubmit} initialValues={formData}>
      <Form.Item name="serialNo" label="Serial No" rules={[{ required: true, message: 'Please enter Serial No' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="tp" label="TP" rules={[{ required: true, message: 'Please select TP' }]}>
      <Select>
  {allTps && allTps.map(tp => (
    <Option key={tp.id} value={tp.id}>{tp.title}</Option>
  ))}
</Select>

      </Form.Item>
      <Form.Item name="client" label="Client" rules={[{ required: true, message: 'Please enter Client' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="submissionDate" label="Submission Date" rules={[{ required: true, message: 'Please enter Submission Date' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="countryOffice" label="Country Office" rules={[{ required: true, message: 'Please enter Country Office' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="value" label="Value" rules={[{ required: false, message: 'Please enter Valye' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="team" label="Team" rules={[{ required: true, message: 'Please select Team' }]}>
      <Select>
  {allTeams && allTeams.map(team => (
    <Option key={team.id} value={team.id}>{team.name}</Option>
  ))}
</Select>

      </Form.Item>
      <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Please select Status' }]}>
  <Select defaultValue={formData.status}>
    <Option value="Shortlisted">Shortlisted</Option>
    <Option value="Awarded">Awarded</Option>
    <Option value="Failed">Failed</Option>
    <Option value="Submitted">Submitted</Option>

  </Select>
</Form.Item>

      <Form.Item name="remark" label="Remark" rules={[{ required: true, message: 'Please enter Remark' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="bduLeadingTPDrafting" label="bduLeadingTPDrafting" rules={[{ required: true, message: 'Please select Team Member' }]}>
  <Select defaultValue={formData.bduLeadingTPDrafting}>
    {allUsers && allUsers.map(user => (
      <Option key={user.id} value={user.id}>
        {`${user.firstName} ${user.lastName}`}
      </Option>
    ))}
  </Select>
</Form.Item>


      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Submit
        </Button>
        <Button onClick={closeModal} style={{ marginLeft: 8 }}>
          Cancel
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ReportForm;
