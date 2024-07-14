import React, { useState, useEffect } from "react";
import { Row, Col, Card, Upload, message, Descriptions, Button, Tabs, Avatar, Modal, Spin } from "antd";
import { useParams } from "react-router-dom";
import { ToTopOutlined, UserOutlined } from '@ant-design/icons';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';
import useFetchWithToken from '../../services/api';

const { TabPane } = Tabs;

const ReservationDetail = () => {
  const [fileList, setFileList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const { id } = useParams();
  const { data: tripData, loading: tripLoading } = useFetchWithToken(`trips/${id}`);
  const [isMounted, setIsMounted] = useState(true);

  const driver = tripData?.driver;
  const passenger = tripData?.passenger;

  const coordinates = tripData
    ? [
        { lat: parseFloat(tripData.fromLat), lng: parseFloat(tripData.fromLon) },
        { lat: parseFloat(tripData.toLat), lng: parseFloat(tripData.toLon) },
      ]
    : [];

  useEffect(() => {
    if (coordinates.length === 2 && window.google && window.google.maps) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: coordinates[0],
          destination: coordinates[1],
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK && isMounted) {
            setDirectionsResponse(result);
          } else {
            console.error(`Error fetching directions: ${status}`, result);
          }
        }
      );
    }
    return () => setIsMounted(false); // Cleanup to avoid memory leaks
  }, [coordinates]);

  const beforeUpload = (file) => {
    setFileList([file]);
    return false;
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", fileList[0]);

    try {
      // await postFormData(formData, `uploadDriverDocument/${id}`);
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
      {tripLoading ? (
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
                  title={<h6 className="font-semibold m-0">Trip Details</h6>}
                  className="header-solid h-full card-profile-information"
                  bodyStyle={{ paddingTop: 0, paddingBottom: 16 }}
                >
                  <Descriptions style={{ marginTop: '60px' }} column={2}>
                    <Descriptions.Item label="Trip ID" span={1}>
                      {tripData?.id}
                    </Descriptions.Item>
                    <Descriptions.Item label="Start Location" span={1}>
                      {tripData?.from}
                    </Descriptions.Item>
                    <Descriptions.Item label="End Location" span={1}>
                      {tripData?.to}
                    </Descriptions.Item>
                    <Descriptions.Item label="Distance" span={1}>
                      {tripData?.distance} km
                    </Descriptions.Item>
                    <Descriptions.Item label="Price" span={1}>
                      ${tripData?.price}
                    </Descriptions.Item>
                    <Descriptions.Item label="Status" span={1}>
                      {tripData?.status}
                    </Descriptions.Item>
                    <Descriptions.Item label="Pick Up Time" span={1}>
                      {new Date(tripData?.pickUpTime).toLocaleString()}
                    </Descriptions.Item>
                    <Descriptions.Item label="Drop Off Time" span={1}>
                      {new Date(tripData?.dropOffTime).toLocaleString()}
                    </Descriptions.Item>
                    <Descriptions.Item label="Payment Finalized" span={1}>
                      {tripData?.paymentFinalized}
                    </Descriptions.Item>
                    <Descriptions.Item label="Driver Rating" span={1}>
                      {tripData?.driverRating}
                    </Descriptions.Item>
                    <Descriptions.Item label="Passenger Rating" span={1}>
                      {tripData?.PassengerRating}
                    </Descriptions.Item>
                    <Descriptions.Item label="Driver Feedback" span={1}>
                      {tripData?.driverFeedback}
                    </Descriptions.Item>
                    <Descriptions.Item label="Passenger Feedback" span={1}>
                      {tripData?.passengerFeedback}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
              <Col span={24}>
                <Card
                  bordered={false}
                  title={<h6 className="font-semibold m-0">Trip Route</h6>}
                  className="header-solid h-full"
                  bodyStyle={{ paddingTop: 0, paddingBottom: 16 }}
                >
                  <LoadScript googleMapsApiKey="AIzaSyBEnjVNXGgw757msw4v4Otk5nV9XYUOQCs">
                    <GoogleMap
                      mapContainerStyle={{ height: "500px", width: "100%" }}
                      center={coordinates.length ? coordinates[0] : { lat: 0, lng: 0 }}
                      zoom={13}
                    >
                      {directionsResponse && (
                        <DirectionsRenderer directions={directionsResponse} />
                      )}
                      {coordinates.map((coord, index) => (
                        <Marker
                          key={index}
                          position={coord}
                        />
                      ))}
                    </GoogleMap>
                  </LoadScript>
                </Card>
              </Col>
            </Row>
          </TabPane>

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
                      {driver?.firstName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Last Name" span={3}>
                      {driver?.lastName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Phone Number" span={3}>
                      {driver?.phoneNumber}
                    </Descriptions.Item>
                    <Descriptions.Item label="Email" span={3}>
                      {driver?.email}
                    </Descriptions.Item>
                    <Descriptions.Item label="Status" span={3}>
                      {driver?.status}
                    </Descriptions.Item>
                    <Descriptions.Item label="Address" span={3}>
                      {driver?.address}
                    </Descriptions.Item>
                    <Descriptions.Item label="Rating" span={3}>
                      {driver?.rating || 'N/A'}
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
                  <div className="mt-4">
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
                  </div>
                </Card>
              </Col>
            </Row>
          </TabPane>

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
                      {passenger?.firstName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Last Name" span={3}>
                      {passenger?.lastName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Phone Number" span={3}>
                      {passenger?.phoneNumber}
                    </Descriptions.Item>
                    <Descriptions.Item label="Email" span={3}>
                      {passenger?.email}
                    </Descriptions.Item>
                    <Descriptions.Item label="Status" span={3}>
                      {passenger?.status}
                    </Descriptions.Item>
                    <Descriptions.Item label="Rating" span={3}>
                      {passenger?.rating || 'N/A'}
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
                    <TabPane tab="Passenger Documents" key="2">
                      {renderImage(passenger?.passengerDocuments, "Passenger Documents")}
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
