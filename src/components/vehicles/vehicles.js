import React, { useState, useEffect } from 'react';
import { Card, Row, Col, message, Input, Tabs, Button, Table, Modal, Dropdown, Checkbox, Spin } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, InfoCircleOutlined, DownOutlined } from '@ant-design/icons';
import VehiclesForm from './vehiclesForm'; // Import the VehiclesForm component
import axios from 'axios';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { useHistory, NavLink } from 'react-router-dom';

const { TabPane } = Tabs;
const { Search } = Input;

const Vehicles = () => {
  const [irModalVisible, setProjectModalVisible] = useState(false);
  const [formData, setFormData] = useState({});
  const [uploading, setUploading] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([]); // Add state for selected columns
  const defaultSelectedColumns = ['plateNumber', 'model', 'color', 'driver','vehicleType', 'actions']; // Default selected columns
  const [vehiclesData, setVehiclesData] = useState([]);
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
    fetchData(); // Fetch data when component mounts
  }, [submitted]);

  const handleAddVehicle = () => {
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
      setLoading(true);
      const response = await axios.get("http://194.164.72.21:5001/vehicles");
      setVehiclesData(response.data);
      setFilteredData(response.data);
      setLoading(false);
    } catch (error) {
      message.error("Unable to load data!");
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    const filteredData = vehiclesData.filter(vehicle =>
      Object.keys(vehicle).some(key =>
        String(vehicle[key]).toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilteredData(filteredData);
  };

  const vehiclesColumns = [
    { title: 'Plate Number', dataIndex: 'plateNumber', key: 'plateNumber',      width:'20%',
  },
    { title: 'Model', dataIndex: 'model', key: 'model',       width:'20%',
  },
    { title: 'Color', dataIndex: 'color', key: 'color',       width:'20%',
  },
    { title: 'Driver', dataIndex: ['driver', 'firstName'],       width:'20%',
    key: 'driver', render: (text, record) => record.driver ? `${record.driver.firstName} ${record.driver.lastName}` : 'N/A' },

    { title: 'Status', dataIndex: 'status', key: 'status',      width:'10%',
  },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEditVehicle(record)} style={{ marginRight: 8 }}>Edit</Button>
          <Button type="link"><NavLink to={`/vehicleDetails/${record.id}`} style={{ color: 'green' }}><InfoCircleOutlined /> &nbsp;Details</NavLink></Button>
        </>
      ),
    },
  ];

  const handleEditVehicle = (record) => {
    setFormData(record);
    setProjectModalVisible(true);
  };

  const ColumnSelector = () => (
    <Checkbox.Group
      options={vehiclesColumns.map(column => ({ label: column.title, value: column.key }))}
      value={selectedColumns}
      onChange={(selected) => setSelectedColumns(selected)}
    />
  );

  const DynamicTable = ({ columns: initialColumns, data, onRow }) => {
    const filteredColumns = initialColumns.filter(column => selectedColumns.includes(column.key));

    return (
      <>
        <Dropdown
          overlay={
            <ColumnSelector
              columns={initialColumns.map((column) => ({
                label: column.title,
                value: column.key,
              }))}
              selectedColumns={selectedColumns}
              onChange={setSelectedColumns}
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
            // scroll={{ x: 1500, y: 400 }} // Adjust the scroll properties as needed
            onRow={onRow} // Pass the onRow prop to the Table component
            rowKey="id"
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
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddVehicle}>
              Add Vehicle
            </Button>
          </Col>
          <Col span={12}>
            <Search
              placeholder="Search Vehicles"
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
                onClick: () => handleRowClick(record),
              })} columns={vehiclesColumns} data={filteredData} />
            )}
          </Col>
          <Col xs={24} xl={12}>
            {selectedRow && (
              <div className="tabled">
                <Tabs defaultActiveKey="1">
                  <TabPane tab="Details" key="1">
                    <Card
                      title={`Details of ${selectedRow.plateNumber}`}
                      style={{ height: "500px", overflow: "auto" }}
                      headStyle={{ position: 'sticky', top: '0', zIndex: '1', background: '#fff' }}
                      extra={
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Button type="link" onClick={handleCloseDetails} style={{ color: 'red' }}>Close</Button>
                          <Button type="link" onClick={() => history.push(`/vehicleDetails/${selectedRow.id}`)} style={{ color: 'green' }}>Details</Button>
                        </div>
                      }
                    >
                      <p>Plate Number: {selectedRow.plateNumber}</p>
                      <p>Model: {selectedRow.model}</p>
                      <p>Color: {selectedRow.color}</p>
                      <p>Driver ID: {selectedRow.driverId}</p>
                      <p>Status: {selectedRow.status}</p>
                      {selectedRow.vehicleType && (
                        <>
                          <p>Vehicle Type: {selectedRow.vehicleType.typeName}</p>
                          <p>Price Per KM: {selectedRow.vehicleType.pricePerKM}</p>
                          <p>Surge Price Per KM: {selectedRow.vehicleType.surgePricePerKM}</p>
                        </>
                      )}
                      {selectedRow.driver && (
                        <>
                          <p>Driver Name: {selectedRow.driver.firstName} {selectedRow.driver.lastName}</p>
                          <p>Phone Number: {selectedRow.driver.phoneNumber}</p>
                          <p>Email: {selectedRow.driver.email}</p>
                          <p>Address: {selectedRow.driver.address}</p>
                          <p>Status: {selectedRow.driver.status}</p>
                        </>
                      )}
                    </Card>
                  </TabPane>
                  <TabPane tab="File Preview" key="2">
                    <Card bordered={false} className="header-solid h-full">
                      <h4>Vehicle Preview:</h4>
                      <div style={{ width: "100%", height: "400px" }}>
                        <DocViewer
                          pluginRenderers={DocViewerRenderers}
                          documents={selectedRow.documents ? [`http://194.164.72.21:5001${selectedRow.documents}`] : []}
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
        title={formData.id ? 'Edit Vehicle' : 'Add Vehicle'}
        visible={irModalVisible}
        onCancel={() => setProjectModalVisible(false)}
        footer={null}
        width={800} // Adjust the width here as needed
      >
        <VehiclesForm formData={formData} setFormData={setFormData} closeModal={() => setProjectModalVisible(false)} setSubmitted={setSubmitted} />
      </Modal>
    </div>
  );
};

export default Vehicles;
