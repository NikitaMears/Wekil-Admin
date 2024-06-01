import React, { useState, useEffect } from 'react';
import { Form, Checkbox, Input, Row, Col, Table, Upload, Button } from 'antd';
import { UploadOutlined , SearchOutlined} from '@ant-design/icons';

const TeamMembersSection = ({ cvs, setCvs }) => {
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });

  useEffect(() => {
    setFilteredDataSource(cvs);
  }, [cvs]);

  const rowSelection = {
    selectedRowKeys: selectedTeamMembers.map(member => member.id),
    onChange: (selectedRowKeys) => {
      setSelectedTeamMembers(selectedRowKeys.map(id => ({ id, position: '' })));
    },
  };

  const onSearch = (value) => {
    setSearchText(value);
  };

  const columns = [
    {
      title: 'Expert Name',
      dataIndex: 'expertName',
      key: 'expertName',
    },
    {
      title: 'Research Interest',
      dataIndex: 'researchInterest',
      key: 'researchInterest',
    },
    {
      title: 'Location',
      dataIndex: 'country',
      key: 'country',
    },
    {
      title: 'Position',
      key: 'position',
      render: (text, record) => (
        <Input
          style={{ width: '200px' }}
          value={selectedTeamMembers.find(member => member.id === record.id)?.position}
          onChange={(e) => {
            const updatedTeamMembers = [...selectedTeamMembers];
            const memberIndex = updatedTeamMembers.findIndex(member => member.id === record.id);
            updatedTeamMembers[memberIndex].position = e.target.value;
            setSelectedTeamMembers(updatedTeamMembers);
          }}
        />
      ),
    }
  ];

  return (
    <Row gutter={16}>
      <Col span={12}>
        <Input.Search
          placeholder="Search team members"
          allowClear
          enterButton={<SearchOutlined />}
          onSearch={onSearch}
        />
        <Table
          dataSource={searchText ? filteredDataSource : cvs}
          columns={columns}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: filteredDataSource.length,
            showTotal: false,
            size: 3,
            showLessItems: true,
            showSizeChanger: false,
            showQuickJumper: false,
            pageSizeOptions: false,
            responsive: true,
            onChange: setPagination,
          }}
          rowSelection={rowSelection}
          rowKey="id"
        />
      </Col>
    </Row>
  );
};

export default TeamMembersSection;
