import React, { useState } from 'react';
import { Card, Row, Col, Button, Table, Modal, Spin } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import TeamForm from './teamForm';
import TeamMembers from '../teamMember/teamMemberList'; // Import the TeamMembers component
import useFetchWithToken from '../../services/api';

const Team = () => {
  const [modalVisible, setModalVisible] = useState(false); // State for controlling both modals
  const [formData, setFormData] = useState({});
  const [selectedTeamId, setSelectedTeamId] = useState(null); // Add state to store selected team id
  const [modalType, setModalType] = useState(''); // State to differentiate between add and edit modals
  const { data: teamData, loading, error, refetchData } = useFetchWithToken('teams');

  const handleAddTeam = () => {
    setFormData({});
    setModalType('add'); // Set modal type to add
    setModalVisible(true);
  };

  const handleEditTeam = (record) => {
    setFormData(record);
    setSelectedTeamId(record.id); // Set selected team id when editing
    setModalType('edit'); // Set modal type to edit
    setModalVisible(true);
  };

  const handleDeleteTeam = (teamId) => {
    // Implement deletion logic
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedTeamId(null); // Reset selected team id when closing modal
  };

  const openTeamMembersModal = (teamId) => {
    setSelectedTeamId(teamId); // Set selected team id
    setModalType('members'); // Set modal type to team members
    setModalVisible(true);
  };

  const teamColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEditTeam(record)}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Button
            type="danger"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteTeam(record.id)}
          >
            Delete
          </Button>
          <Button type="default" onClick={() => openTeamMembersModal(record.id)}>View Members</Button> {/* Open team members modal */}
        </>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddTeam}>
              Add Team
            </Button>
          </Col>
          <Col span={24}>
            {error && <div>Error: {error}</div>}
            {loading ? (
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Spin size="large" />
              </div>
            ) : (
              <Table dataSource={teamData} columns={teamColumns} pagination={{ pageSize: 5 }} />
            )}
          </Col>
        </Row>
      </Card>

      <Modal
        title={modalType === 'edit' ? 'Edit Team' : 'Add Team'}
        visible={modalVisible}
        onCancel={closeModal}
        footer={null}
      >
        {/* Include TeamForm and TeamMembers inside the modal */}
        {modalType === 'members' ? (
          <TeamMembers teamId={selectedTeamId} closeModal={closeModal} refetchData={refetchData} />
        ) : (
          <TeamForm
            formData={formData}
            setFormData={setFormData}
            closeModal={closeModal}
            refetchData={refetchData}
            type={modalType} // Pass modal type to TeamForm
          />
        )}
      </Modal>
    </div>
  );
};

export default Team;
