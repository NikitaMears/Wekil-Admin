import React, { useState } from "react";
import { Row, Col, Rate, Tag, Card, Upload, message, Descriptions, Button, Tabs, Avatar, Modal, Spin, Select } from "antd";
import { useParams } from "react-router-dom";
import { ToTopOutlined, UserOutlined } from '@ant-design/icons';
import useFetchWithToken from '../../services/api';
import axios from "axios";

const { TabPane } = Tabs;
const { Option } = Select;

const ReservationDetail = () => {
  const [fileList, setFileList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [selectedDriver, setSelectedDriver] = useState(null); // State to hold selected driver
  const { id } = useParams();

  // Fetch reservation data
  const { data, loading: reservationLoading } = useFetchWithToken(`reservations/${id}`);
  const { data: driversData, loading: driversLoading, postFormData } = useFetchWithToken(`drivers`);

  // Combine the loading states
  const isLoading = reservationLoading || driversLoading;

  const tripData = data?.reservation; // Extracting the reservation data
  const drivers = driversData || []; // Ensure drivers data is properly handled

  const driver = tripData?.driver;
  const passenger = tripData?.passenger;

  const handleDriverSelect = (value) => {
    setSelectedDriver(value);
  };
  const forwardToDriver = async () => {
    if (!selectedDriver) {
      message.warning("Please select a driver to forward the reservation.");
      return;
    }

    try {
      const response = await axios.post(`http://194.164.72.21:5001/reservations/forward/${id}`, { driverId: selectedDriver }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      window.location.reload();

      message.success("Reservation successfully forwarded to the selected driver.");
    } catch (error) {
      message.error("Failed to forward reservation.");
      console.error('Error forwarding reservation:', error);
    }
  };
  

  const beforeUpload = (file) => {
    setFileList([file]);
    return false;
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", fileList[0]);

    try {
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

  const renderImage = (src, alt) => (
    src ? <img src={`http://194.164.72.21:5001${src}`} alt={alt} style={{ width: "100%", height: "400px", objectFit: "cover", marginBottom: "10px", cursor: 'pointer' }} onClick={() => handlePreview(`http://194.164.72.21:5001${src}`)} />
      : <Avatar shape="square" icon={<UserOutlined />} style={{ width: "100%", height: "400px", marginBottom: "10px" }} />
  );

  return (
    <>
      {isLoading ? (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Tabs defaultActiveKey="3">
          <TabPane tab="Trip Details" key="3">
            <Row gutter={[24, 0]}>
              <Col span={24} className="mb-24">
                <Card
                  bordered={false}
                  title={<h6 className="font-semibold m-0">Reservation Details - {tripData?.id}</h6>}
                  className="header-solid h-full card-profile-information"
                  bodyStyle={{ paddingTop: 0, paddingBottom: 16 }}
                >
                  <Descriptions style={{ marginTop: '60px' }} column={2}>
                    <Descriptions.Item label="Start Location" span={1}>
                      {tripData?.from || 'N/A'}
                    </Descriptions.Item>
                    <Descriptions.Item label="End Location" span={1}>
                      {tripData?.to || 'N/A'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Distance" span={1}>
                      {tripData?.distance || 'N/A'} km
                    </Descriptions.Item>
                    <Descriptions.Item label="Price" span={1}>
                      ${tripData?.price || 'N/A'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Status" span={3}>
                      {tripData && (
                        <Tag color={
                          tripData.status === 'Started' ? 'darkorange' :
                          tripData.status === 'Accepted' ? 'darkorange' :
                          // tripData.status === 'Pending' ? 'darkred' :
                          tripData.status === 'Pending' ? 'darkred' : 'gray'
                        }>
                          {tripData.status.toUpperCase()}
                        </Tag>
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Pick Up Time" span={1}>
                      {tripData?.pickUpDate ? new Date(tripData.pickUpDate).toLocaleString() : 'N/A'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Drop Off Time" span={1}>
                      {tripData?.updatedAt ? new Date(tripData.updatedAt).toLocaleString() : 'N/A'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Driver Rating" span={1}>
                      {tripData && <Rate disabled value={tripData.driverRating} />}
                    </Descriptions.Item>
                    <Descriptions.Item label="Passenger Rating" span={1}>
                      {tripData && <Rate disabled value={tripData.passengerRating} />}
                    </Descriptions.Item>
                    <Descriptions.Item label="Driver Feedback" span={1}>
                      {tripData?.driverFeedback || 'N/A'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Passenger Feedback" span={1}>
                      {tripData?.passengerFeedback || 'N/A'}
                    </Descriptions.Item>
                    {tripData?.status !== "Started" && drivers && (
  <Descriptions.Item label="Assign or change Driver" span={1}>
    <Select
      style={{ width: '50%', marginBottom: '10px' }}
      placeholder="Select Driver"
      onChange={handleDriverSelect}
    >
      {drivers.map(driver => (
        <Option key={driver.id} value={driver.id}>
          {driver.firstName} {driver.lastName} - {driver.phoneNumber}
        </Option>
      ))}
    </Select>
    <Button type="primary" onClick={forwardToDriver}>
      Forward to Driver
    </Button>
  </Descriptions.Item>
)}


                  </Descriptions>

              
                </Card>
              </Col>
            </Row>
          </TabPane>

          {driver && (  // Conditionally render the Driver Details tab if driver data is available
            <TabPane tab="Driver Details" key="1">
              <Row gutter={[24, 0]}>
                <Col span={24} md={12} className="mb-24">
                  <Card
                    bordered={false}
                    title={<h6 className="font-semibold m-0">Driver Details</h6>}
                    className="header-solid h-full card-profile-information"
                    bodyStyle={{ paddingTop: 0, paddingBottom: 16 }}
                  >
                    <Descriptions style={{ marginTop: '60px' }}>
                      <Descriptions.Item label="First Name" span={3}>
                        {driver?.firstName || 'N/A'}
                      </Descriptions.Item>
                      <Descriptions.Item label="Last Name" span={3}>
                        {driver?.lastName || 'N/A'}
                      </Descriptions.Item>
                      <Descriptions.Item label="Phone Number" span={3}>
                        {driver?.phoneNumber || 'N/A'}
                      </Descriptions.Item>
                      <Descriptions.Item label="Status" span={3}>
                        {driver && (
                          <Tag color={
                            driver.status === 'Active' ? 'darkgreen' :
                            driver.status === 'Inactive' ? 'darkred' : 'gray'
                          }>
                            {driver.status.toUpperCase()}
                          </Tag>
                        )}
                      </Descriptions.Item>
                      <Descriptions.Item label="Rating" span={3}>
                        {driver && <Rate disabled value={driver.rating} />}
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
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
                      <TabPane tab="Driver Documents" key="2">
                        {renderImage(driver?.documents, "Driver Documents")}
                      </TabPane>
                      <TabPane tab="Driver Licence" key="3">
                        {renderImage(driver?.driverLicence, "Driver Licence")}
                      </TabPane>
                    </Tabs>
                  </Card>
                </Col>
              </Row>
            </TabPane>
          )}

          <TabPane tab="Passenger Details" key="2">
            <Row gutter={[24, 0]}>
              <Col span={24} md={12} className="mb-24">
                <Card
                  bordered={false}
                  title={<h6 className="font-semibold m-0">Passenger Details</h6>}
                  className="header-solid h-full card-profile-information"
                  bodyStyle={{ paddingTop: 0, paddingBottom: 16 }}
                >
                  <Descriptions style={{ marginTop: '60px' }}>
                    <Descriptions.Item label="First Name" span={3}>
                      {passenger?.firstName || 'N/A'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Last Name" span={3}>
                      {passenger?.lastName || 'N/A'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Phone Number" span={3}>
                      {passenger?.phoneNumber || 'N/A'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Status" span={3}>
                      {passenger && (
                        <Tag color={
                          passenger.status === 'Active' ? 'darkgreen' :
                          passenger.status === 'Inactive' ? 'darkred' : 'gray'
                        }>
                          {passenger.status.toUpperCase()}
                        </Tag>
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Rating" span={3}>
                      {passenger && <Rate disabled value={5} />}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
              <Col span={24} md={12} className="mb-24">
                <Card
                  bordered={false}
                  className="header-solid h-full"
                  title={<h6 className="font-semibold m-0">Passenger Documents</h6>}
                >
                  <Tabs defaultActiveKey="1">
                    <TabPane tab="Passenger Image" key="1">
                      {renderImage(passenger?.passengerImage, "Passenger Image")}
                    </TabPane>
                  </Tabs>
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
};

export default ReservationDetail;
