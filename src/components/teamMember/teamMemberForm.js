// TeamMembers.js

import React, { useState, useEffect } from 'react';
import { List, Button, Modal, Form, Input } from 'antd';
import useFetchWithToken from '../../services/api';

const TeamMembers = ({ teamId }) => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addMemberModalVisible, setAddMemberModalVisible] = useState(false);
  const [memberFormData, setMemberFormData] = useState({});
  const [form] = Form.useForm();
  const { data: membersData, loading: membersLoading, error: membersError, refetchData: refetchMembers } = useFetchWithToken(`teamMembersForTeam/${teamId}`);

  useEffect(() => {
    setTeamMembers(membersData);
  }, [membersData]);

  const handleAddMember = () => {
    setAddMemberModalVisible(true);
  };

  const handleCancelAddMember = () => {
    setAddMemberModalVisible(false);
  };

  const handleSubmitAddMember = async () => {
    try {
      // Implement your post request to add a new team member here
    } catch (error) {
      console.error('Error adding team member:', error);
    }
  };

  return (
    <div>
      <h3>Team Members</h3>
      <Button type="primary" onClick={handleAddMember}>Add Member</Button>

      <List
        dataSource={teamMembers}
        loading={loading || membersLoading}
        renderItem={(member) => (
          <List.Item>
            <List.Item.Meta
              title={member.User.name} 
              description={member.position}
            />
            {/* Add edit and delete functionality */}
          </List.Item>
        )}
      />

      <Modal
        title="Add Team Member"
        visible={addMemberModalVisible}
        onCancel={handleCancelAddMember}
        onOk={handleSubmitAddMember}
        width={800}
      >
        <Form form={form} onFinish={handleSubmitAddMember}>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter member name' }]}>
            <Input onChange={(e) => setMemberFormData({ ...memberFormData, name: e.target.value })} />
          </Form.Item>
          <Form.Item name="position" label="Position" rules={[{ required: true, message: 'Please enter member position' }]}>
            <Input onChange={(e) => setMemberFormData({ ...memberFormData, position: e.target.value })} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TeamMembers;
