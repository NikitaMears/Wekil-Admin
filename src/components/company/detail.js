import React, { useState, useEffect } from "react";
import { Row, Col, Card, Upload, message, Descriptions, Button, Spin, Table, Tabs, Avatar, Modal, Input } from "antd";
import { useParams } from "react-router-dom";
import { ToTopOutlined, UserOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import SubscriberForm from './subscriberForm'; // Import the SubscriberForm component

const { TabPane } = Tabs;
const { Search } = Input;

function CompanyDetails() {
  const [fileList, setFileList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility
  const { id } = useParams();
  const [companyData, setCompanyData] = useState(null);
  const [subscribersData, setSubscribersData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const companyResponse = await axios.get(`http://194.164.72.21:5001/companies/${id}`);
        setCompanyData(companyResponse.data);
        const subscribersResponse = await axios.get(`http://194.164.72.21:5001/companies/subscribers/${id}`);
        setSubscribersData(subscribersResponse.data);
      } catch (error) {
        message.error("Unable to load data!");
      } finally {
        setLoading(false);
      }
    };
    fetchCompanyDetails();
  }, [id]);

  const beforeUpload = (file) => {
    setFileList([file]);
    return false; // Returning false prevents default upload behavior
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", fileList[0]);

    try {
      await axios.post(`http://194.164.72.21:5001/uploadCompanyDocument/${id}`, formData);
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

  const handleAddSubscriber = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const refetchData = async () => {
    try {
      const subscribersResponse = await axios.get(`http://194.164.72.21:5001/companies/subscribers/${id}`);
      setSubscribersData(subscribersResponse.data);
    } catch (error) {
      message.error("Unable to load data!");
    }
  };

  const filteredSubscribers = subscribersData.filter(subscriber => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      subscriber.firstName.toLowerCase().includes(lowerCaseQuery) ||
      subscriber.lastName.toLowerCase().includes(lowerCaseQuery) ||
      subscriber.phoneNumber.toLowerCase().includes(lowerCaseQuery)
    );
  });

  const subscriberColumns = [
    {
      title: 'Subscriber ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Usage Limit',
      dataIndex: 'usageLimit',
      key: 'usageLimit',
    },
  ];

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
          <TabPane tab="Company Details" key="1">
            <Row gutter={[24, 0]}>
              <Col span={24} md={12} className="mb-24">
                <div style={{ height: "100%" }}>
                  <Card
                    bordered={false}
                    title={<h6 className="font-semibold m-0">Company Details</h6>}
                    className="header-solid h-full card-profile-information"
                    bodyStyle={{ paddingTop: 0, paddingBottom: 16 }}
                  >
                    <Descriptions style={{ marginTop: '60px' }}>
                      <Descriptions.Item label="Company Name" span={3}>
                        {companyData && companyData.companyName}
                      </Descriptions.Item>
                      <Descriptions.Item label="Contact Person" span={3}>
                        {companyData && companyData.contactPerson}
                      </Descriptions.Item>
                      <Descriptions.Item label="Phone Number" span={3}>
                        {companyData && companyData.phoneNumber}
                      </Descriptions.Item>
                      <Descriptions.Item label="Balance" span={3}>
                        {companyData && companyData.balance}
                      </Descriptions.Item>
                      <Descriptions.Item label="Credit Limit" span={3}>
                        {companyData && companyData.creditLimit}
                      </Descriptions.Item>
                      <Descriptions.Item label="Status" span={3}>
                        {companyData && companyData.status}
                      </Descriptions.Item>
                      <Descriptions.Item label="Address" span={3}>
                        {companyData && companyData.address}
                      </Descriptions.Item>
                      <Descriptions.Item label="Start Date" span={3}>
                        {companyData && new Date(companyData.startDate).toLocaleDateString()}
                      </Descriptions.Item>
                      <Descriptions.Item label="End Date" span={3}>
                        {companyData && new Date(companyData.endDate).toLocaleDateString()}
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </div>
              </Col>
              <Col span={24} md={12} className="mb-24">
                <Card
                  bordered={false}
                  className="header-solid h-full"
                  title={<h6 className="font-semibold m-0">Company Documents</h6>}
                >
                  <Tabs defaultActiveKey="1">
                    <TabPane tab="Company Image" key="1">
                      {renderImage(companyData?.companyImage, "Company Image")}
                    </TabPane>
                    <TabPane tab="Documents" key="2">
                      {renderImage(companyData?.documents, "Company Documents")}
                    </TabPane>
                    <TabPane tab="Company Licence" key="3">
                      {renderImage(companyData?.companyLicence, "Company Licence")}
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
          <TabPane tab="Subscribers" key="2">
            <Row gutter={[24, 0]}>
              <Col span={24} className="mb-24">
                <Card
                  bordered={false}
                  title={<h6 className="font-semibold m-0">Subscribers</h6>}
                  extra={<Button icon={<PlusOutlined />} onClick={handleAddSubscriber}>Add Subscriber</Button>} // Add subscriber button
                  className="header-solid h-full"
                  bodyStyle={{ paddingTop: 0, paddingBottom: 16 }}
                >
                  <Search
                    placeholder="Search subscribers"
                    allowClear
                    enterButton={<SearchOutlined />}
                    onChange={e => setSearchQuery(e.target.value)}
                    style={{ marginBottom: 16 }}
                  />
                  <Table columns={subscriberColumns} dataSource={filteredSubscribers} rowKey="id" />
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
      <Modal
        visible={isModalVisible}
        title="Add Subscriber"
        onCancel={handleModalClose}
        footer={null}
      >
        <SubscriberForm companyId={id} closeModal={handleModalClose} refetchData={refetchData} />
      </Modal>
    </>
  );
}

export default CompanyDetails;
