import React, { useState } from 'react';
import { Card, message,Row, Col, Button, Table, Modal, Spin, Tag, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import ReportForm from './reportForm';
import useFetchWithToken from '../../services/api';
import axios from 'axios';
import { saveAs } from 'file-saver';
import RFPReportForm from './rfpReporrForm';
import { useHistory } from 'react-router-dom';

const RFPReportList = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({});
  const { data: reportData, loading, error, refetchData } = useFetchWithToken('rfpreports');
  const history = useHistory();

  const handleAddReport = () => {
    setFormData({});
    setModalVisible(true);
  };

  const handleEditReport = (record) => {
    setFormData(record);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleGenerateExcel = async () => {
    const token = await localStorage.getItem('token');
  
    try {
      const response = await axios.get("https://kmsbe.frontieri.com/kmsApi/rfpexportReports", {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        responseType: 'blob',
      });
  
      const contentType = response.headers['content-type'];
      if (contentType && contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
        const blob = response.data;
        saveAs(blob, 'report.xlsx');
      } else {
        console.log('Received response:', response.data);
      }
    } catch (error) {
      if (error.response && error.response.status === 401 || error.response.status === 403) {
        // Redirect to login page if status code is 401
        history.push('/login');
        message.error("Session expired. Please login again.");

      } else {
        message.error("Unable to load data!");
      }    }
  };

  const reportColumns = [
    // { title: 'Serial No', dataIndex: 'serialNo', key: 'serialNo', ellipsis: true, width: 200 },

    { 
      title: 'Title', 
      dataIndex: ['RFP', 'title'], 
      key: 'tp', 
      ellipsis: true,
      width: 850,
      render: (text) => (
        <Tooltip title={text}>
          {text}
        </Tooltip>
      )
    },
    { 
      title: 'BD Officer', 
      dataIndex: ['BDO', 'firstName'], 
      key: 'user', 
      ellipsis: true,
      width: 150,
      render: (text, record) => (
        <Tooltip title={`${record?.User?.firstName} ${record?.User?.lastName}`}>
          {text}
        </Tooltip>
      )
    },
    { title: 'Client', dataIndex: ['RFP', 'client'], key: 'client', ellipsis: true, width: 300 },
    { title: 'Date Opportunity Posted', dataIndex: 'dateOpportunityPosted', key: 'dateOpportunityPosted', ellipsis: true, width: 200 },
    { title: 'Date Reviewed', dataIndex: 'dateReviewed', key: 'dateReviewed', ellipsis: true, width: 150 },
    { title: 'Date Shared', dataIndex: 'dateShared', key: 'dateShared', ellipsis: true, width: 150 },
    { title: 'Market', dataIndex: 'market', key: 'market', ellipsis: true, width: 150 },
    { title: 'Team', dataIndex: ['Team', 'name'], key: 'team', ellipsis: true, width: 150 },
    { title: 'Platform', dataIndex: 'platform', key: 'platform', ellipsis: true, width: 150 },
    { title: 'Rating By BDO', dataIndex: 'ratingByBdOfficer', key: 'ratingByBdOfficer', ellipsis: true, width: 150 },
    {
      title: 'Bid Or No Bid',
      dataIndex: 'bidOrNoBid',
      key: 'bidOrNoBid',
      width: 150,
      render: (status) => {
        let color = '';
        switch (status) {
          case 'Bid':
            color = 'green';
            break;
          case 'No Bid':
            color = 'red';
            break;
          case 'Pending':
            color = 'gray';
            break;
          default:
            color = '';
        }
        return <Tag color={color}>{status}</Tag>;
      }
    },
    { title: 'Reason If No Bid', dataIndex: 'reasonIfNoBid', key: 'remark', ellipsis: true, width: 200 },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEditReport(record)}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleGenerateExcel}>
              Generate Excel
            </Button>
          </Col>
          <Col span={24}>
            {error && <div>Error: {error}</div>}
            {loading ? (
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Spin size="large" />
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <Table 
                  dataSource={reportData} 
                  columns={reportColumns} 
                  pagination={{ pageSize: 5 }} 
                  scroll={{ x: 2500, y: 400 }} // Adjust the scroll properties as needed
                />
              </div>
            )}
          </Col>
        </Row>
      </Card>

      <Modal
        title={formData.id ? 'Edit Report' : 'Add Report'}
        visible={modalVisible}
        onCancel={closeModal}
        footer={null}
        width={800}
      >
        <RFPReportForm
          formData={formData}
          setFormData={setFormData}
          closeModal={closeModal}
          refetchData={refetchData}
        />
      </Modal>
    </div>
  );
};

export default RFPReportList;
