import React, { useState, useEffect } from 'react';
import { Card, Row, Col, message, Input, Button, Table, Spin, Tag, Tooltip } from 'antd';
import { SearchOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const { Search } = Input;

const TripRequests = () => {
  const [irModalVisible, setProjectModalVisible] = useState(false);
  const [formData, setFormData] = useState({});
  const [uploading, setUploading] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [tripsData, setTripsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const history = useHistory();

  const defaultSelectedColumns = ['id', 'from', 'to', 'pickUpTime', 'distance', 'price', 'status', 'driverName', 'driverPhone', 'actions'];

  useEffect(() => {
    setSelectedColumns(defaultSelectedColumns);
    fetchData();
  }, [submitted]);

  const handleAddTrip = () => {
    setFormData({});
    setProjectModalVisible(true);
  };

  const handleRowClick = (record) => {
    setSelectedRow(record);
    setDetailsVisible(true);
  };

  const handleCloseDetails = () => {
    setSelectedRow(null);
    setDetailsVisible(false);
  };

  const handleUpload = async ({ file }) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      // Simulate a successful upload
      message.success(`${file.name} uploaded successfully`);
      setUploading(false);
    } catch (error) {
      console.log(error);
      message.error(`${file.name} upload failed.`);
      setUploading(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://194.164.72.21:5001/tripRequests');
      setTripsData(response.data);
      setFilteredData(response.data);
      setLoading(false);
    } catch (error) {
      message.error('Unable to load data!');
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    const filteredData = tripsData.filter((trip) =>
      Object.keys(trip).some((key) =>
        String(trip[key]).toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilteredData(filteredData);
  };

  const renderWithTooltip = (text, maxLength = 10) => {
    const truncatedText = text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    return (
      <Tooltip title={text}>
        <span>{truncatedText}</span>
      </Tooltip>
    );
  };

  const tripsColumns = [
    {
      title: 'Trip ID',
      dataIndex: 'id',
      key: 'id',
      width: '10%',
    },
    // {
    //   title: 'Driver Name',
    //   dataIndex: ['driver', 'firstName'],
    //   key: 'driverName',
    //   width: '10%',
    //   render: (text, record) => renderWithTooltip(`${record.driver.firstName} ${record.driver.lastName}`, 15),
    // },
    {
      title: 'Passenger Name',
      dataIndex: ['passenger', 'firstName'],
      key: 'passengerName',
      width: '10%',
      render: (text, record) => renderWithTooltip(`${record.passenger.firstName} ${record.passenger.lastName}`, 15),
    },
    {
      title: 'Start Location',
      dataIndex: 'from',
      key: 'from',
      width: '10%',
      render: (text) => renderWithTooltip(text, 20),
    },
    {
      title: 'End Location',
      dataIndex: 'to',
      key: 'to',
      width: '10%',
      render: (text) => renderWithTooltip(text, 20),
    },
    {
      title: 'Price',
      dataIndex: 'estimatedPrice',
      key: 'estimatedPrice',
      width: '10%',
      render: (text) => {
        if (!text) {
          return ''; // or any placeholder you want to display when text is empty
        }
        return renderWithTooltip(text, 20);
      },
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '10%',
      render: (text) => {
        if (!text) {
          return ''; // or any placeholder you want to display when text is empty
        }
        return renderWithTooltip(text, 20);
      },
    },
    
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '10%',
      render: (status) => {
        let color = '';
        switch (status) {
          case 'Ended':
            color = 'darkgreen';
            break;
          case 'Active':
            color = 'darkorange';
            break;
          case 'Pending':
            color = 'darkred';
            break;
          default:
            color = 'gray';
        }
        return (
          <Tooltip title={status.toUpperCase()}>
            <Tag color={color}>{renderWithTooltip(status.toUpperCase(), 7)}</Tag>
          </Tooltip>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '10%',
      render: (_, record) => (
        <Button type="link">
          <NavLink to={`/tripRequestDetails/${record.id}`} style={{ color: 'green' }}>
            <InfoCircleOutlined /> &nbsp;Details
          </NavLink>
        </Button>
      ),
    },
  ];

  const DynamicTable = ({ columns: initialColumns, data }) => {
    const defaultDisplayedColumns = initialColumns.map((column) => column.key);
    const [displayedColumns, setDisplayedColumns] = useState(defaultDisplayedColumns);

    useEffect(() => {
      setDisplayedColumns(defaultDisplayedColumns);
    }, [defaultDisplayedColumns]);

    const filteredColumns = initialColumns.filter((column) => displayedColumns.includes(column.key));

    return (
      <div style={{ overflowX: 'auto' }}>
        <Table
          columns={filteredColumns}
          dataSource={data}
          pagination={{ pageSize: 5 }}
          className="ant-border-space"
        />
      </div>
    );
  };

  return (
    <div>
      <Card>
        <Row gutter={[24, 0]}>
          <Col span={12} />
          <Col span={12}>
            <Search
              placeholder="Search Trips"
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col xs={24} xl={selectedRow ? 12 : 24}>
            {loading ? (
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Spin size="large" />
              </div>
            ) : (
              <DynamicTable columns={tripsColumns} data={filteredData} />
            )}
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default TripRequests;
