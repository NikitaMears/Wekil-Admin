import React, { useState, useEffect } from "react";
import { Row, Col, Card, Upload, message, Descriptions, Button, Collapse, Spin, Table, Tabs, Avatar, Modal, Input } from "antd";
import { useParams } from "react-router-dom";
import { ToTopOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons';
import useFetchWithToken from '../../services/api'; // Import the useFetchWithToken hook

const { Panel } = Collapse;
const { TabPane } = Tabs;
const { Search } = Input;

function DriversDetail() {
  const [collapsed, setCollapsed] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { id } = useParams();
  const { data: driverData, loading: driverLoading, postFormData } = useFetchWithToken(`drivers/${id}`); // Fetch driver details using useFetchWithToken hook
  const { data: tripData, loading: tripsLoading } = useFetchWithToken(`trips/driver/${id}`); // Fetch driver trips using useFetchWithToken hook
  const trips = tripData?.trips.map(item => ({ ...item.trip, passenger: item.passenger, driver: item.driver })) || [];
  const driver = driverData?.driver;

  const handleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const beforeUpload = (file) => {
    setFileList([file]);
    return false; // Returning false prevents default upload behavior
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", fileList[0]);

    try {
      await postFormData(formData, `uploadDriverDocument/${id}`); // Upload driver document using postFormData function from useFetchWithToken hook
      message.success("File uploaded successfully!");
      setFileList([]);
    } catch (error) {
      message.error("Failed to upload file");
      setFileList([]);
    }
  };

  const handlePreview = (src) => {
    setPreviewImage(src);
    setPreviewVisible(true);
  };

  const filteredTrips = trips.filter(trip => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      trip.from.toLowerCase().includes(lowerCaseQuery) ||
      trip.to.toLowerCase().includes(lowerCaseQuery) ||
      trip.status.toLowerCase().includes(lowerCaseQuery) ||
      trip.passenger.firstName.toLowerCase().includes(lowerCaseQuery) ||
      trip.passenger.lastName.toLowerCase().includes(lowerCaseQuery)
    );
  });

  const tripColumns = [
    {
      title: 'Trip ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Start Location',
      dataIndex: 'from',
      key: 'from',
    },
    {
      title: 'End Location',
      dataIndex: 'to',
      key: 'to',
    },
    {
      title: 'Date',
      dataIndex: 'pickUpTime',
      key: 'pickUpTime',
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: 'Distance',
      dataIndex: 'distance',
      key: 'distance',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Passenger Name',
      dataIndex: ['passenger', 'firstName'],
      key: 'passengerName',
      render: (text, record) => `${record.passenger.firstName} ${record.passenger.lastName}`,
    },
    {
      title: 'Passenger Phone',
      dataIndex: ['passenger', 'phoneNumber'],
      key: 'passengerPhone',
    },
    // Add other trip details as needed
  ];

  const renderImage = (src, alt) => (
    src ? <img src={`http://194.164.72.21:5001${src}`} alt={alt} style={{ width: "100%", height: "400px", objectFit: "cover", marginBottom: "10px", cursor: 'pointer' }} onClick={() => handlePreview(`http://194.164.72.21:5001${src}`)} />
      : <Avatar shape="square" icon={<UserOutlined />} style={{ width: "100%", height: "400px", marginBottom: "10px" }} />
  );

  return (
    <>
      {driverLoading || tripsLoading ? (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Tabs defaultActiveKey="1">
          <TabPane tab="Driver Details" key="1">
            <Row gutter={[24, 0]}>
              <Col span={24} md={12} className="mb-24">
                <div style={{ height: "100%" }}>
                  <Card
                    bordered={false}
                    title={<h6 className="font-semibold m-0">Driver Details</h6>}
                    className="header-solid h-full card-profile-information"
                    bodyStyle={{ paddingTop: 0, paddingBottom: 16 }}
                  >
                    <Descriptions style={{ marginTop: '60px' }}>
                      <Descriptions.Item label="First Name" span={3}>
                        {driver && driver.firstName}
                      </Descriptions.Item>
                      <Descriptions.Item label="Last Name" span={3}>
                        {driver && driver.lastName}
                      </Descriptions.Item>
                      <Descriptions.Item label="Phone Number" span={3}>
                        {driver && driver.phoneNumber}
                      </Descriptions.Item>
                      <Descriptions.Item label="Email" span={3}>
                        {driver && driver.email}
                      </Descriptions.Item>
                      <Descriptions.Item label="Status" span={3}>
                        {driver && driver.status}
                      </Descriptions.Item>
                      <Descriptions.Item label="Address" span={3}>
                        {driver && driver.address}
                      </Descriptions.Item>
                      <Descriptions.Item label="Rating" span={3}>
                        {driver && driver.rating}
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </div>
              </Col>
              <Col span={24} md={12} className="mb-24">
                <Card
                  bordered={false}
                  className="header-solid h-full"
                  title={<h6 className="font-semibold m-0">Driver Documents</h6>}
                >
                  <Tabs defaultActiveKey="1">
                    <TabPane tab="Driver Image" key="1">
                      {renderImage(driver?.driverImage, "Driver Image")}
                    </TabPane>
                    <TabPane tab="Documents" key="2">
                      {renderImage(driver?.documents, "Driver Documents")}
                    </TabPane>
                    <TabPane tab="Driver Licence" key="3">
                      {renderImage(driver?.driverLicence, "Driver Licence")}
                    </TabPane>
                  </Tabs>
                  <div className="mt-4">
                    <Upload
                      beforeUpload={beforeUpload}
                      fileList={fileList}
                      maxCount={1}
                      accept=".docx,.pdf, .png, .jpg, .jpeg"
                    >
                      <Button type="dashed" className="ant-full-box" icon={<ToTopOutlined />} >
                        Upload File
                      </Button>
                    </Upload>
                    <Button onClick={handleUpload} hidden={!fileList.length}>Submit</Button>
                  </div>
                </Card>
              </Col>
            </Row>
            {/* Content */}
          </TabPane>
          <TabPane tab="Trips" key="2">
            <Row gutter={[24, 0]}>
              <Col span={24} className="mb-24">
                <Card
                  bordered={false}
                  title={<h6 className="font-semibold m-0">Trips</h6>}
                  className="header-solid h-full"
                  bodyStyle={{ paddingTop: 0, paddingBottom: 16 }}
                >
                  <Search
                    placeholder="Search trips"
                    allowClear
                    enterButton={<SearchOutlined />}
                    onChange={e => setSearchQuery(e.target.value)}
                    style={{ marginBottom: 16 }}
                  />
                  <Table columns={tripColumns} dataSource={filteredTrips} rowKey="id" />
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      )}
      <Modal
        visible={previewVisible}
        title="Image Preview"
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="Preview" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
}

export default DriversDetail;
