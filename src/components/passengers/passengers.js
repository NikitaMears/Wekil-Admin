import React, { useState, useEffect } from 'react';
import { Card, Row, Col, message, Input, Tabs, Button, Table, Modal, Upload, Checkbox, Dropdown, Tooltip, Spin } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined, ToTopOutlined, DownOutlined } from '@ant-design/icons';
import PassengersForm from './passengersForm'; // Import the PassengersForm component
import useFetchWithToken from '../../services/api';
import { NavLink } from "react-router-dom";
import axios from 'axios';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { useHistory } from 'react-router-dom';

const { TabPane } = Tabs;
const { Search } = Input;

const Passengers = () => {
  const [irModalVisible, setProjectModalVisible] = useState(false);
  const [formData, setFormData] = useState({});
  const [uploading, setUploading] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([]); // Add state for selected columns
  const defaultSelectedColumns = ['firstName', 'lastName', 'phoneNumber', 'email', 'status', 'actions']; // Default selected columns
  const [passengersData, setPassengersData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRowDetails, setSelectedRowDetails] = useState(null); // State to hold selected row details
  const [selectedRow, setSelectedRow] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const history = useHistory();

  useEffect(() => {
    setSelectedColumns(defaultSelectedColumns);
  }, []);

  useEffect(() => {
    fetchData(); // Fetch data when component mounts
  }, [submitted]);

  const handleAddPassenger = () => {
    setFormData({});
    setProjectModalVisible(true);
  };

  const handleRowClick = (record) => {
    setSelectedRow(record);
    setDetailsVisible(true);
  };

  const handleCloseDetails = () => {
    setSelectedRow(null);
  };

  const handleUpload = async ({ file }) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      // Handle successful upload
      message.success(`${file.name} uploaded successfully`);
      setUploading(false)
    } catch (error) {
      // Handle upload error
      console.log(error)
      message.error(`${file.name} upload failed.`);
      setUploading(false)
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await axios.get("http://194.164.72.21:5001/passengers");
      setPassengersData(response.data);
      setFilteredData(response.data);
      setLoading(false)
    } catch (error) {
      message.error("Unable to load data!");
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    const filteredData = passengersData.filter(passenger =>
      Object.keys(passenger).some(key =>
        String(passenger[key]).toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilteredData(filteredData);
  };

  const passengersColumns = [
    { title: 'First Name', dataIndex: 'firstName', key: 'firstName' },
    { title: 'Last Name', dataIndex: 'lastName', key: 'lastName' },
    { title: 'Phone Number', dataIndex: 'phoneNumber', key: 'phoneNumber' },
    { title: 'Rating', dataIndex: 'rating', key: 'rating' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEditPassenger(record)} style={{ marginRight: 8 }}>Edit</Button>
          <Button type="link"><NavLink to={`/passengerDetails/${record.id}`} style={{ color: 'green' }}><InfoCircleOutlined /> &nbsp;Details</NavLink></Button>
        </>
      ),
    },
  ];

  const handleEditPassenger = (record) => {
    setFormData(record);
    setProjectModalVisible(true);
  };

  const ColumnSelector = () => (
    <Checkbox.Group
      options={passengersColumns.map(column => ({ label: column.title, value: column.key }))}
      value={selectedColumns}
      onChange={(selected) => setSelectedColumns(selected)}
    />
  );

  const DynamicTable = ({ columns: initialColumns, data, onRow }) => {
    const defaultDisplayedColumns = initialColumns.map(column => column.key).slice(0, 7); // Select first two columns by default
    const [displayedColumns, setDisplayedColumns] = useState(defaultDisplayedColumns);

    const handleColumnChange = (selectedColumns) => {
      setDisplayedColumns(selectedColumns);
    };

    const filteredColumns = initialColumns.filter(column => displayedColumns.includes(column.key));

    return (
      <>
        <Dropdown
          overlay={
            <ColumnSelector
              columns={initialColumns.map((column) => ({
                label: column.title,
                value: column.key,
              }))}
              selectedColumns={defaultDisplayedColumns}
              onChange={handleColumnChange}
            />
          }
          trigger={["click"]}
        >
          <Button>
            Select Columns <DownOutlined />
          </Button>
        </Dropdown>
        <div style={{ overflowX: 'auto' }}>
          <Table
            columns={filteredColumns}
            dataSource={data}
            pagination={{ pageSize: 5 }}
            className="ant-border-space"
            scroll={{ x: 1500, y: 400 }} // Adjust the scroll properties as needed
            onRow={onRow} // Pass the onRow prop to the Table component
          />
        </div>
      </>
    );
  };

  return (
    <div>
      <Card>
        <Row gutter={[24, 0]}>
        <Col span={12} style={{ textAlign: 'left' }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddPassenger}>
              Add Passenger
            </Button>
          </Col>
          <Col span={12}>
            <Search
              placeholder="Search Passengers"
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
              <DynamicTable onRow={(record) => ({
                // onClick: () => handleRowClick(record),
              })} columns={passengersColumns} data={filteredData} pagination={{ pageSize: 5 }} />
            )}
          </Col>
          <Col xs={24} xl={12}>
            {selectedRow && (
              <div className="tabled">
                <Tabs defaultActiveKey="1">
                  <TabPane tab="Details" key="1">
                    <Card
                      title={`Details of ${selectedRow.firstName} ${selectedRow.lastName}`}
                      style={{ height: "500px", overflow: "auto" }}
                      headStyle={{ position: 'sticky', top: '0', zIndex: '1', background: '#fff' }}
                      extra={
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Button type="link" onClick={handleCloseDetails} style={{ color: 'red' }}>Close</Button>
                          <Button type="link" onClick={() => history.push(`/passengerDetails/${selectedRow.id}`)} style={{ color: 'green' }}>Details</Button>
                        </div>
                      }
                    >
                      <p>Phone Number: {selectedRow.phoneNumber}</p>
                      <p>Email: {selectedRow.email}</p>
                      <p>Status: {selectedRow.status}</p>
                      <p>Address: {selectedRow.address}</p>
                      <p>Rating: {selectedRow.rating}</p>
                    </Card>
                  </TabPane>
                  <TabPane tab="File Preview" key="2">
                    <Card bordered={false} className="header-solid h-full">
                      <h4>Passenger Preview:</h4>
                      <div style={{ width: "100%", height: "400px" }}>
                        <DocViewer
                          pluginRenderers={DocViewerRenderers}
                          documents={selectedRow.documents ? `http://194.164.72.21:5001${selectedRow.documents}` : []}
                          config={{
                            header: {
                              disableHeader: false,
                              disableFileName: true,
                              retainURLParams: false
                            }
                          }}
                          style={{ height: 400 }}
                        />
                      </div>
                    </Card>
                  </TabPane>
                </Tabs>
              </div>
            )}
          </Col>
        </Row>
      </Card>
  
      <Modal
        title={formData.id ? 'Edit Passenger' : 'Add Passenger'}
        visible={irModalVisible}
        onCancel={() => setProjectModalVisible(false)}
        footer={null}
        width={800} // Adjust the width here as needed
      >
        <PassengersForm formData={formData} setFormData={setFormData} closeModal={() => setProjectModalVisible(false)} setSubmitted={setSubmitted} />
      </Modal>
    </div>
  );
};

export default Passengers;
