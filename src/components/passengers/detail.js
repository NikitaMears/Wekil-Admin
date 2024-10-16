import React, { useState, useEffect } from "react";
import { Row, Col,Tag,Tooltip, Card, Upload, message, Rate,Descriptions, Button, Collapse, Spin, Table, Tabs, Avatar, Modal, Input } from "antd";
import { useParams } from "react-router-dom";
import { ToTopOutlined,InfoCircleOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons';
import useFetchWithToken from '../../services/api'; // Import the useFetchWithToken hook
import { NavLink } from "react-router-dom";

const { Panel } = Collapse;
const { TabPane } = Tabs;
const { Search } = Input;

function PassengersDetail() {
  const [collapsed, setCollapsed] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { id } = useParams();
  const { data: passengerData, loading: passengerLoading, postFormData } = useFetchWithToken(`passengers/${id}`); // Fetch passenger details using useFetchWithToken hook
  const { data: tripData, loading: tripsLoading } = useFetchWithToken(`trips/passenger/${id}`); // Fetch passenger trips using useFetchWithToken hook
  const trips = tripData?.trips.map(item => ({ ...item.trip, passenger: item.passenger, driver: item.driver })) || [];

  const passenger = passengerData?.passenger;

  const handleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const beforeUpload = (file) => {
    setFileList([file]);
    return false; // Returning false prevents default upload behavior
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
  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", fileList[0]);

    try {
      await postFormData(formData, `uploadDriverDocument/${id}`); // Upload passenger document using postFormData function from useFetchWithToken hook
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

  const filteredTrips = trips?.filter(trip => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      trip.from.toLowerCase().includes(lowerCaseQuery) ||
      trip.to.toLowerCase().includes(lowerCaseQuery) ||
      trip.status.toLowerCase().includes(lowerCaseQuery) ||
      trip.passenger.firstName.toLowerCase().includes(lowerCaseQuery) ||
      trip.passenger.lastName.toLowerCase().includes(lowerCaseQuery)
    );
  });

  const tripsColumns = [
    {
      title: 'Trip ID',
      dataIndex: 'id',
      key: 'id',
      width: '5%',
      render: text => renderWithTooltip(text, 10), // Limit to 10 characters
    },
  
    {
      title: 'Passenger Name',
      dataIndex: 'passengerId',
      key: 'passengerId',
      width: '10%',
      render: (text, record) => renderWithTooltip(record.passenger ? `${record.passenger.firstName} ${record.passenger.lastName}` : 'N/A', 15), // Limit to 15 characters
    },
    {
      title: 'Start Location',
      dataIndex: 'from',
      key: 'from',
      width: '10%',
      render: text => renderWithTooltip(text, 15), // Limit to 20 characters
    },
    {
      title: 'End Location',
      dataIndex: 'to',
      key: 'to',
      width: '10%',
      render: text => renderWithTooltip(text, 15), // Limit to 20 characters
    },
    {
      title: 'Date',
      dataIndex: 'pickUpTime',
      key: 'pickUpTime',
      width: '10%',
      render: text => renderWithTooltip(text ? text : 'N/A', 10), // Limit to 19 characters
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
      width: '20%',
      render: (status) => {
        let color = '';
        switch (status) {
          case 'Completed':
            color = 'darkgreen';
            break;
          case 'Active':
            color = 'darkorange';
            break;
          case 'Inactive':
            color = 'darkred';
            break;
          default:
            color = 'gray'; // Fallback color if status doesn't match any case
        }
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '10%',
      render: (_, record) => (
        <Button type="link">
          <NavLink to={`/tripDetails/${record.id}`} style={{ color: 'green' }}>
            <InfoCircleOutlined /> &nbsp;Details
          </NavLink>
        </Button>
      ),
    },
  ];

  const renderImage = (src, alt) => (
    src ? <img src={`http://194.164.72.21:5001${src}`} alt={alt} style={{ width: "100%", height: "400px", objectFit: "cover", marginBottom: "10px", cursor: 'pointer' }} onClick={() => handlePreview(`http://194.164.72.21:5001${src}`)} />
      : <Avatar shape="square" icon={<UserOutlined />} style={{ width: "100%", height: "400px", marginBottom: "10px" }} />
  );

  return (
    <>
      {passengerLoading || tripsLoading ? (
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
                        {passenger && passenger.firstName}
                      </Descriptions.Item>
                      <Descriptions.Item label="Last Name" span={3}>
                        {passenger && passenger.lastName}
                      </Descriptions.Item>
                      <Descriptions.Item label="Phone Number" span={3}>
                        {passenger && passenger.phoneNumber}
                      </Descriptions.Item>
                      {/* <Descriptions.Item label="Email" span={3}>
                        {passenger && passenger.email}
                      </Descriptions.Item> */}
                     <Descriptions.Item label="Status" span={3}>
    {passenger && (
      <Tag color={
        passenger.status === 'Active' ? 'darkgreen' :
        passenger.status === 'Pending' ? 'darkorange' :
        passenger.status === 'Inactive' ? 'darkred' : 'gray'
      }>
        {passenger.status.toUpperCase()}
      </Tag>
    )}
  </Descriptions.Item>
                      {/* <Descriptions.Item label="Address" span={3}>
                        {passenger && passenger.address}
                      </Descriptions.Item> */}
                     <Descriptions.Item label="Rating" span={3}>
    {passenger && <Rate disabled value={5} />}
  </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </div>
              </Col>
              <Col span={24} md={12} className="mb-24">
                <Card
                  bordered={false}
                  className="header-solid h-full"
                  title={<h6 className="font-semibold m-0">Passenger Documents</h6>}
                >
                  <Tabs defaultActiveKey="1">
                    <TabPane tab="Passenger Image" key="1">
                      {renderImage(passenger?.passengerImage, "Driver Image")}
                    </TabPane>
                   
                  </Tabs>
                  <div className="mt-4">
                    <Upload
                      beforeUpload={beforeUpload}
                      fileList={fileList}
                      maxCount={1}
                      accept=".jpg, .jpeg, .png"
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
                  <Table columns={tripsColumns} dataSource={filteredTrips} rowKey="id" />
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

export default PassengersDetail;
