import React, { useState } from "react";
import { Row, Col, Card, Upload, message, Descriptions, Button, Tag , Spin} from "antd";
import { useParams } from "react-router-dom";
import { Avatar } from 'antd';
import { UserOutlined, ToTopOutlined } from '@ant-design/icons';
import useFetchWithToken from '../../services/api'; // Import the useFetchWithToken hook
import CvProjects from './cvProjects'; // Import the CvProjects component

function CvDetail() {
  const [fileList, setFileList] = useState([]);
  const { id } = useParams(); 
  const { data: cvData, loading, postFormData } = useFetchWithToken(`cvs/${id}`); // Fetch CV details using useFetchWithToken hook

  const beforeUpload = (file) => {
    setFileList([file]);
    return false; // Returning false prevents default upload behavior
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", fileList[0]);

    try {
      await postFormData(formData, `uploadCV/${id}`); // Upload CV using postFormData function from useFetchWithToken hook
      message.success("File uploaded successfully!");
      setFileList([]);
    } catch (error) {
      message.success("File uploaded successfully!");
      setFileList([]);
 
    }
  };

  return (
    <>
      {loading ? (
  <div style={{ textAlign: 'center', marginTop: '20px' }}>
  <Spin size="large" />
</div>      ) : (
        <>
          {/* Profile Information */}
          <Row gutter={[24, 0]}>
            <Col span={24} md={12} className="mb-24">
              <div style={{ height: "100%" }}>
                <Card
                  bordered={false}
                  title={<h6 className="font-semibold m-0">Profile Information</h6>}
                  className="header-solid h-full card-profile-information"
                  bodyStyle={{ paddingTop: 0, paddingBottom: 16 }}
                >
                  {/* User Icon */}
                  <div style={{ textAlign: 'center', marginBottom: 16 }}>
                    <Avatar size={250} color={'blue'} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }}/>
                  </div>
                  {/* Profile Information */}
                  <Descriptions style={{ marginTop: '60px' }}>
                    <Descriptions.Item label="Full Name" span={3}>
                      {cvData && cvData.expertName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Contact Information" span={3}>
                      {cvData && cvData.contactInformation}
                    </Descriptions.Item>
                    <Descriptions.Item label="Location" span={3}>
                      {cvData && cvData.country}
                    </Descriptions.Item>
                    <Descriptions.Item label="Average Score" span={3}>
                      {cvData && cvData.averagePoints}
                    </Descriptions.Item>
                  </Descriptions>
                  {/* Tags */}
                  <div>
                    <Tag color="#52c41a">Available</Tag>
                    <Tag color="#1890ff">{cvData && cvData.researchInterest}</Tag>
                    <Tag color="#faad14">{cvData && cvData.priceAverage}</Tag>
                  </div>
                </Card>
              </div>
            </Col>
            {/* Upload CV */}
            <Col span={24} md={12} className="mb-24">
              <Card bordered={false} className="header-solid h-full">
                {cvData && cvData.cv && (
                  <>
                    <h4>CV Preview:</h4>
                    {cvData.cv.endsWith('.pdf') ? (
                      // If PDF file, render the iframe for preview
                      <iframe title="No CV" src={`https://kmsbe.frontieri.com/kmsApi/${cvData.cv}`} style={{ width: "100%", height: "400px" }}></iframe>
                    ) : cvData.cv.endsWith('.docx') ? (
                      // If DOCX file, render using Google Docs viewer for preview
                      <div style={{ width: "100%", height: "400px" }}>
                        <iframe title="CV Preview" src={`https://docs.google.com/viewer?url=https://kmsbe.frontieri.com/kmsApi/${cvData.cv}&embedded=true`} style={{ width: "100%", height: "100%" }}></iframe>
                      </div>
                    ) : (
                      // If other file formats, display a message or handle accordingly
                      <p>Unsupported file format</p>
                    )}
                  </>
                )}
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
          {/* Summary */}
          <Row gutter={[24, 0]}>
            <Col span={24} md={24} className="mb-24">
              <Card
                bordered={false}
                title={<h6 className="font-semibold m-0">Summary</h6>}
                className="header-solid h-full"
                bodyStyle={{ paddingTop: 0, paddingBottom: 16 }}
              >
                <p className="text-dark">
                  {cvData && cvData.cvSummary}
                </p>
              </Card>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
        <Col span={24} md={24} className="mb-24">
          <Card
            bordered={false}
            title={<h6 className="font-semibold m-0">Project Evaluation</h6>}
            className="header-solid h-full"
            bodyStyle={{ paddingTop: 0, paddingBottom: 16 }}
          >
            {/* Render the CvProjects component passing the CV id */}
            <CvProjects cvId={id} />
          </Card>
        </Col>
      </Row>
        </>
      )}
    </>
  );
}

export default CvDetail;
