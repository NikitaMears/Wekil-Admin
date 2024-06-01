import React, { useState, useEffect } from 'react';
import { List, message, Table,Button, Modal, Form, Input, Select } from 'antd';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const { Option } = Select;

const TeamMembers = ({ teamId }) => {
  const [loading, setLoading] = useState(false);
  const [addMemberModalVisible, setAddMemberModalVisible] = useState(false);
  const [memberFormData, setMemberFormData] = useState({});
  const [users, setUsers] = useState([]); // State to store the list of users
  const history = useHistory();

  const [form] = Form.useForm();
  const API_BASE_URL = 'https://kmsbe.frontieri.com/kmsApi'; // Replace with your API base URL
  useEffect(() => {
    // Fetch the list of users when the component mounts
    fetchUsers();
  }, []);
  const handleCancelAddMember = () => {
    setAddMemberModalVisible(false); // Close the modal
    form.resetFields(); // Reset form fields
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://kmsbe.frontieri.com/kmsApi/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUsers(response.data); // Update the users state with the fetched data
    } catch (error) {
      if (error.response && error.response.status === 401 || error.response.status === 403) {
        // Redirect to login page if status code is 401
        history.push('/login');
        message.error("Session expired. Please login again.");

      } else {
        message.error("Unable to load data!");
      }    }
  };


  const handleRemoveMember = async (teamId, userId) => {
    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/teamMembers?teamId=${teamId}&userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      await fetchTeamMembers();
    } catch (error) {
      console.error('Error removing team member:', error);
    } finally {
      setLoading(false);
    }
  };

  const addMember = async (data) => {
    console.log("ddd",data)
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/teamMembers`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };
  

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/teamMembersForTeam/${teamId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching team members:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    fetchTeamMembers().then((data) => setTeamMembers(data));
  }, [teamId]);

  const handleSubmitAddMember = async () => {
    try {
      await addMember({
        ...memberFormData,
        teamId: teamId,
      });
      const newTeamMembers = await fetchTeamMembers();
      setTeamMembers(newTeamMembers);
      setAddMemberModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Error adding team member:', error);
    }
  };
  const columns = [
    {
      title: 'Name',
      key: 'name',
      render: (text, record) => `${record.User.firstName} ${record.User.lastName}`,
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Button type="link" danger onClick={() => handleRemoveMember(record.UserId, record.TeamId)}>Remove</Button>
      ),
    },
  ];

  return (
    <div>
      <h3>Team Members</h3>
      <Button type="primary" onClick={() => setAddMemberModalVisible(true)}>Add Member</Button>

      <Table
        dataSource={teamMembers}
        columns={columns}
        loading={loading}
        rowKey="id"
      />

      <Modal
        title="Add Team Member"
        visible={addMemberModalVisible}
        onCancel={handleCancelAddMember} // Close the modal when canceled
        onOk={handleSubmitAddMember}
        width={800}
      >
        <Form form={form} onFinish={handleSubmitAddMember}>
          <Form.Item name="userId" label="User" rules={[{ required: true, message: 'Please select a user' }]}>
          <Select
  showSearch
  optionFilterProp="children"
  onChange={(value) => setMemberFormData({ ...memberFormData, userId: value })}
  filterOption={(input, option) =>
    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
  }
>
  {users.map((user) => (
    <Option key={user.id} value={user.id}>{`${user.firstName} ${user.lastName}`}</Option>
  ))}
</Select>

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
