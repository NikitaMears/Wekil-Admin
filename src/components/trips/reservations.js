import React, { useState, useEffect } from 'react';
import { Card, Row, Col, message, Input, Button, Table, Spin,Tag, Tooltip } from 'antd';
import { SearchOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { NavLink } from "react-router-dom";
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const { Search } = Input;

const Reservations = () => {
  const [formData, setFormData] = useState({});
  const [uploading, setUploading] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([]); // State for selected columns
  const defaultSelectedColumns = ['id', 'from', 'to', 'pickUpTime', 'distance', 'price', 'status', 'driverName', 'driverPhone', 'actions']; // Default selected columns
  const [tripsData, setTripsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const history = useHistory();

  useEffect(() => {
    setSelectedColumns(defaultSelectedColumns);
  }, []);

  useEffect(() => {
    fetchData();
  }, [submitted]);

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
      formData.append("file", file);

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
      const response = await axios.get("http://194.164.72.21:5001/reservations");
      setTripsData(response.data);
      setFilteredData(response.data);
      setLoading(false);
    } catch (error) {
      message.error("Unable to load data!");
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    const filteredData = tripsData.filter(trip =>
      Object.keys(trip).some(key =>
        String(trip[key]).toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilteredData(filteredData);
  };

  const renderWithTooltip = (text, maxLength = 20) => {
    const truncatedText = text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    return (
      <Tooltip title={text}>
        <span style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: 'inline-block',
          maxWidth: '100%',
        }}>
          {truncatedText}
        </span>
      </Tooltip>
    );
  };
  

  const tripsColumns = [
    {
      title: 'Trip ID',
      dataIndex: 'id',
      key: 'id',
      width: '5%',
      render: text => renderWithTooltip(text, 10), // Limit to 10 characters
    },
    {
      title: 'Driver Name',
      dataIndex: ['driver', 'firstName'],
      key: 'driverName',
      width: '10%',
      render: (text, record) => renderWithTooltip(record.driver ? `${record.driver.firstName} ${record.driver.lastName}` : 'N/A', 10), // Limit to 15 characters
    },
    {
      title: 'Passenger Name',
      dataIndex: 'passengerId',
      key: 'passengerId',
      width: '10%',
      render: (text, record) => renderWithTooltip(record.passenger ? `${record.passenger.firstName} ${record.passenger.lastName}` : 'N/A', 10), // Limit to 15 characters
    },
    {
      title: 'Start Location',
      dataIndex: 'from',
      key: 'from',
      width: '10%',
      render: text => renderWithTooltip(text, 10), // Limit to 20 characters
    },
    {
      title: 'End Location',
      dataIndex: 'to',
      key: 'to',
      width: '10%',
      render: text => renderWithTooltip(text, 10), // Limit to 20 characters
    },
    {
      title: 'Date',
      dataIndex: 'pickUpDate',
      key: 'pickUpDate',
      width: '10%',
      render: text => renderWithTooltip(text ? new Date(text).toLocaleString() : 'N/A', 15), // Limit to 19 characters
    },
    {
      title: 'Distance',
      dataIndex: 'distance',
      key: 'distance',
      width: '10%',
      render: text => renderWithTooltip(text, 10), // Limit to 10 characters
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: '10%',
      render: text => renderWithTooltip(text, 10), // Limit to 10 characters
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '10%',
      render: status => {
        let color = '';
        switch (status) {
          case 'Ended':
            color = 'darkgreen';
            break;
          case 'Accepted':
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
            <Tag color={color}>{renderWithTooltip(status.toUpperCase(), 10)}</Tag>
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
          <NavLink to={`/reservationDetails/${record.id}`} style={{ color: 'green' }}>
            <InfoCircleOutlined /> &nbsp;Details
          </NavLink>
        </Button>
      ),
    },
  ];
  

  const DynamicTable = ({ columns: initialColumns, data }) => {
    const defaultDisplayedColumns = initialColumns.map(column => column.key);
    const [displayedColumns, setDisplayedColumns] = useState(defaultDisplayedColumns);

    useEffect(() => {
      setDisplayedColumns(defaultDisplayedColumns);
    }, [defaultDisplayedColumns]);

    const filteredColumns = initialColumns.filter(column => displayedColumns.includes(column.key));

    return (
      <div style={{ overflowX: 'auto' }}>
        <Table
          columns={filteredColumns}
          dataSource={data}
          pagination={{ pageSize: 5 }}
          className="ant-border-space"
          // scroll={{ x: 2000, y: 400 }}
        />
      </div>
    );
  };

  return (
    <div>
      <Card>
        <Row gutter={[24, 0]}>
          <Col span={12}>
          </Col>
          <Col span={12}>
            <Search
              placeholder="Search Trips"
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={handleSearch}
              onChange={e => handleSearch(e.target.value)}
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

export default Reservations;
