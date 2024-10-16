import React, { useState, useEffect } from "react";
import { Row, Col,Tag, Rate, Card, Upload, message, Descriptions, Button, Collapse, Spin, Tabs, Avatar, Modal, Input } from "antd";
import { useParams } from "react-router-dom";
import { ToTopOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Panel } = Collapse;
const { TabPane } = Tabs;
const { Search } = Input;

function VehiclesDetail() {
  const [collapsed, setCollapsed] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [imageFileList, setImageFileList] = useState([]);
  const [docFileList, setDocFileList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { id } = useParams();
  const [vehicleData, setVehicleData] = useState(null);
  const [driverData, setDriverData] = useState(null);
  const [vehicleTypeData, setVehicleTypeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicleData();
  }, [id]);

  const fetchVehicleData = async () => {
    try {
      const vehicleResponse = await axios.get(`http://194.164.72.21:5001/vehicles/${id}`);
      setVehicleData(vehicleResponse.data.vehicle);
      setDriverData(vehicleResponse.data.driver);
      setVehicleTypeData(vehicleResponse.data.vehicleType);
      setLoading(false);
    } catch (error) {
      message.error("Unable to load vehicle details");
      setLoading(false);
    }
  };

  const handleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const beforeUpload = (file, type) => {
    if (type === "image") {
      setImageFileList([file]);
    } else if (type === "document") {
      setDocFileList([file]);
    }
    return false;
  };

  const handleUpload = async (type) => {
    const formData = new FormData();
    if (type === "image") {
      formData.append("vehicleImage", imageFileList[0]);
    } else if (type === "document") {
      formData.append("documents", docFileList[0]);
    }

    try {
      await axios.post(`http://194.164.72.21:5001/vehicles/${id}`, formData);
      message.success(`${type === "image" ? "Vehicle Image" : "Documents"} uploaded successfully!`);
      if (type === "image") {
        setImageFileList([]);
      } else if (type === "document") {
        setDocFileList([]);
      }
    } catch (error) {
      message.error(`Failed to upload ${type === "image" ? "Vehicle Image" : "Documents"}`);
      if (type === "image") {
        setImageFileList([]);
      } else if (type === "document") {
        setDocFileList([]);
      }
    }
  };

  const handlePreview = (src) => {
    setPreviewImage(src);
    setPreviewVisible(true);
  };

  const filteredTrips = vehicleData?.trips?.filter(trip => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      trip.from.toLowerCase().includes(lowerCaseQuery) ||
      trip.to.toLowerCase().includes(lowerCaseQuery) ||
      trip.status.toLowerCase().includes(lowerCaseQuery) ||
      trip.passenger.firstName.toLowerCase().includes(lowerCaseQuery) ||
      trip.passenger.lastName.toLowerCase().includes(lowerCaseQuery)
    );
  });

  const renderImage = (src, alt) => (
    src ? <img src={`http://194.164.72.21:5001${src}`} alt={alt} style={{ width: "100%", height: "400px", objectFit: "cover", marginBottom: "10px", cursor: 'pointer' }} onClick={() => handlePreview(`http://194.164.72.21:5001${src}`)} />
      : <Avatar shape="square" icon={<UserOutlined />} style={{ width: "100%", height: "400px", marginBottom: "10px" }} />
  );

  return (
    <>
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Tabs defaultActiveKey="1">
          <TabPane tab="Vehicle Details" key="1">
            <Row gutter={[24, 0]}>
              <Col span={24} md={12} className="mb-24">
                <div style={{ height: "100%" }}>
                  <Card
                    bordered={false}
                    title={<h6 className="font-semibold m-0">Vehicle Details</h6>}
                    className="header-solid h-full card-profile-information"
                    bodyStyle={{ paddingTop: 0, paddingBottom: 16 }}
                  >
                    <Descriptions style={{ marginTop: '60px' }}>
                      <Descriptions.Item label="Plate Number" span={3}>
                        {vehicleData && vehicleData.plateNumber}
                      </Descriptions.Item>
                      <Descriptions.Item label="Model" span={3}>
                        {vehicleData && vehicleData.model}
                      </Descriptions.Item>
                      <Descriptions.Item label="Color" span={3}>
                        {vehicleData && vehicleData.color}
                      </Descriptions.Item>
                      <Descriptions.Item label="Manufactured Year" span={3}>
                        {vehicleData && vehicleData.manufacturedYear}
                      </Descriptions.Item>
                      <Descriptions.Item label="Vehicle Type" span={3}>
                        {vehicleTypeData && vehicleTypeData.typeName}
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </div>
              </Col>
              <Col span={24} md={12} className="mb-24">
                <Card
                  bordered={false}
                  className="header-solid h-full"
                  title={<h6 className="font-semibold m-0">Vehicle Documents</h6>}
                >
                  <Tabs defaultActiveKey="1">
                    <TabPane tab="Vehicle Image" key="1">
                      {renderImage(vehicleData?.vehicleImage, "Vehicle Image")}
                      <div className="mt-4">
                        <Upload
                          beforeUpload={(file) => beforeUpload(file, "image")}
                          fileList={imageFileList}
                          maxCount={1}
                          accept=".png, .jpg, .jpeg"
                        >
                          <Button type="dashed" className="ant-full-box" icon={<ToTopOutlined />} >
                            Upload Vehicle Image
                          </Button>
                        </Upload>
                        <Button onClick={() => handleUpload("image")} hidden={!imageFileList.length}>Submit</Button>
                      </div>
                    </TabPane>
                    <TabPane tab="Documents" key="2">
                      {renderImage(vehicleData?.documents, "Vehicle Documents")}
                      <div className="mt-4">
                        <Upload
                          beforeUpload={(file) => beforeUpload(file, "document")}
                          fileList={docFileList}
                          maxCount={1}
                          accept=".png, .jpg, .jpeg, .docx,.pdf"
                        >
                          <Button type="dashed" className="ant-full-box" icon={<ToTopOutlined />} >
                            Upload Documents
                          </Button>
                        </Upload>
                        <Button onClick={() => handleUpload("document")} hidden={!docFileList.length}>Submit</Button>
                      </div>
                    </TabPane>
                  </Tabs>
                </Card>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="Driver Details" key="2">
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
                        {driverData && driverData.firstName}
                      </Descriptions.Item>
                      <Descriptions.Item label="Last Name" span={3}>
                        {driverData && driverData.lastName}
                      </Descriptions.Item>
                      <Descriptions.Item label="Phone Number" span={3}>
                        {driverData && driverData.phoneNumber}
                      </Descriptions.Item>
                    
                      <Descriptions.Item label="Status" span={3}>
    {driverData && (
      <Tag color={
        driverData.status === 'Active' ? 'darkgreen' :
        driverData.status === 'Pending' ? 'darkorange' :
        driverData.status === 'Inactive' ? 'darkred' : 'gray'
      }>
        {driverData.status.toUpperCase()}
      </Tag>
    )}
  </Descriptions.Item>

  <Descriptions.Item label="Rating" span={3}>
    {driverData && <Rate disabled value={driverData.rating} />}
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
                      {renderImage(driverData?.driverImage, "Driver Image")}
                    </TabPane>
                    <TabPane tab="Documents" key="2">
                      {renderImage(driverData?.documents, "Driver Documents")}
                    </TabPane>
                    <TabPane tab="Driver Licence" key="3">
                      {renderImage(driverData?.driverLicence, "Driver Licence")}
                    </TabPane>
                  </Tabs>
                  {/* <div className="mt-4">
                    <Upload
                      beforeUpload={beforeUpload}
                      fileList={fileList}
                      maxCount={1}
                      accept=".docx,.pdf"
                    >
                      <Button type="dashed" className="ant-full-box" icon={<ToTopOutlined />} >
                        Upload File
                      </Button>
                    </Upload>
                    <Button onClick={handleUpload} hidden={!fileList.length}>Submit</Button>
                  </div> */}
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

export default VehiclesDetail;
