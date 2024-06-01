import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Modal, Select } from 'antd';
import useFetchWithToken from '../../services/api';

const { Option } = Select;

const RFPReportForm = ({ formData, setFormData, closeModal, refetchData, type }) => {
  const [loading, setLoading] = useState(false);
  const { postData, putData, getData } = useFetchWithToken('rfpreports');

  const { data: allTps } = useFetchWithToken('rfps');
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
      <div style={{ columnCount: 2, columnGap: '30px' }}>
        <Form.Item name="serialNo" label="Serial No" rules={[{ required: true, message: 'Please enter Serial No' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="bdOfficer" label="BD Officer" rules={[{ required: true, message: 'Please select BD Officer' }]}>
          <Select defaultValue={formData.bduLeadingTPDrafting}>
            {allUsers && allUsers.map(user => (
              <Option key={user.id} value={user.id}>
                {`${user.firstName} ${user.lastName}`}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="rfp" label="RFP" rules={[{ required: true, message: 'Please select RFP' }]}>
          <Select>
            {allTps && allTps.map(tp => (
              <Option key={tp.id} value={tp.id}>{tp.title}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="dateOpportunityPosted" label="Date Opportunity Posted" rules={[{ required: true, message: 'Please enter Posted Date' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="dateReviewed" label="Date Reviewed" rules={[{ required: true, message: 'Please enter Date Reviewed' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="dateShared" label="Date Shared" rules={[{ required: true, message: 'Please enter Date Shared' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="teamId" label="Team" rules={[{ required: true, message: 'Please select Team' }]}>
          <Select>
            {allTeams && allTeams.map(team => (
              <Option key={team.id} value={team.id}>{team.name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="market" label="Market" rules={[{ required: true, message: 'Please enter Posted Date' }]}>
          <Input />
        </Form.Item>
        <Form.Item
  name="platform"
  label="Platform"
  rules={[{ required: true, message: 'Please select a platform' }]}
>
  <Select placeholder="Select a platform">
    <Option value="DeveX">DeveX</Option>
    <Option value="Development Aid">Development Aid</Option>
    <Option value="Ethiojobs">Ethiojobs</Option>
    <Option value="2merkato">2merkato</Option>
    <Option value="Relief">Relief</Option>
    <Option value="UNDB">UNDB</Option>
    <Option value="AGP">AGP</Option>
    <Option value="GADbids">GADbids</Option>
    <Option value="DeveX">Other</Option>

  </Select>
</Form.Item>
        <Form.Item name="ratingByBdOfficer" label="Rating By BD Officer" rules={[{ required: true, message: 'Please enter Posted Date' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="bidOrNoBid" label="Bid or No Bid" rules={[{ required: true, message: 'Please select Bid or no bead' }]}>
          <Select defaultValue={formData.status}>
            <Option value="Bid">Bid</Option>
            <Option value="No Bid">No Bid</Option>
            <Option value="Pending">Pending</Option>
          </Select>
        </Form.Item>
        <Form.Item name="reasonIfNoBid" label="Reason if No Bid" rules={[{ required: true, message: 'Please enter reason if no bid' }]}>
          <Input />
        </Form.Item>
      </div>
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

export default RFPReportForm;
