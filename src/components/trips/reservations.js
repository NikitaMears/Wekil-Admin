import React, { useState, useEffect } from 'react';
import { Card, Row, Col, message, Input, Button, Table, Spin } from 'antd';
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

  const tripsColumns = [
    {
      title: 'Trip ID',
      dataIndex: 'id',
      key: 'id',
      width:'10%',

    },
    {
      title: 'Driver Name',
      dataIndex: ['driver', 'firstName'],
      key: 'driverName',
      width:'10%',

      render: (text, record) => record.driver ? `${record.driver.firstName} ${record.driver.lastName}` : 'N/A',
    },
    {
      title: 'Passenger Name',
      dataIndex: 'passengerId',
      key: 'passengerId',
      width:'10%',

      render: (text, record) => record.passenger ? `${record.passenger.firstName} ${record.passenger.lastName}` : 'N/A',
    },
    {
      title: 'Start Location',
      dataIndex: 'from',
      key: 'from',
      width:'10%',

    },
    {
      title: 'End Location',
      dataIndex: 'to',
      key: 'to',
      width:'10%',
    },
    {
      title: 'Date',
      dataIndex: 'pickUpDate',
      key: 'pickUpDate',
      width:'10%',

      render: (text) => text ? new Date(text).toLocaleString() : 'N/A',
    },
    {
      title: 'Distance',
      dataIndex: 'distance',
      key: 'distance',
      width:'10%',

    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width:'10%',

    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width:'10%',

    },
    {
      title: 'Actions',
      key: 'actions',
      width:'10%',

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
          scroll={{ x: 2000, y: 400 }}
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
