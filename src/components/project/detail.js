import React, { useState, useEffect } from "react";
import { Row, Col, Card, Upload, message, Descriptions, Button, Tag, Table, Collapse , Spin} from "antd";
import { useParams } from "react-router-dom";
import { useHistory } from 'react-router-dom';

import { Avatar } from 'antd';
import { UserOutlined, ToTopOutlined, InfoCircleOutlined } from '@ant-design/icons';
import useFetchWithToken from '../../services/api'; // Import the useFetchWithToken hook
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { NavLink } from "react-router-dom";
const { Panel } = Collapse;

function FirmExperienceDetail() {
  const [fileList, setFileList] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const { id } = useParams(); 
  const { data: firmData, loading, postFormData, token } = useFetchWithToken(`projects/${id}`); // Fetch firm details using useFetchWithToken hook
  const history = useHistory();

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await fetch(`https://kmsbe.frontieri.com/kmsApi/projectCvs/${id}`, {  headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },});
        if(response.status == 200 ){
            const data = await response.json();
            console.log(data)
            setTeamMembers(data);
        }
     
      } catch (error) {
        if (error.response && error.response.status === 401 || error.response.status === 403) {
          // Redirect to login page if status code is 401
          history.push('/login');
          message.error("Session expired. Please login again.");
  
        } else {
          setTeamMembers([]);
        }
      }
    };

    fetchTeamMembers();
  }, [id]);
  const docs2 = [
    { uri: "https://docs.google.com/document/d/1tl99rMUJauJCwGzkQvjIiKnLDgp7XSUl/export?format=docx", fileType:"docx", fileName:"demo.docx" },
  //  { uri: require("./example-files/pdf.pdf") }, // Local File
  ];
  const dataSource = teamMembers.map((member) => ({
    position: member.cvProjectInfo.position,
    expertName: member.associatedCv.expertName,
    country: member.associatedCv.country,
    contactInformation: member.associatedCv.contactInformation,
    id: member.associatedCv.id
    // Add more fields as needed
  }));
  
  const columns2 = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Internal/External',
      dataIndex: 'internalOrExternal',
      key: 'internalOrExternal',
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
    },
  ];
  const columns = [
  
    {
      title: 'Expert Name',
      dataIndex: 'expertName',
      key: 'expertName',
    },
    {
      title: 'Location',
      dataIndex: 'country',
      key: 'country',
    },
    {
      title: 'Contact Information',
      dataIndex: 'contactInformation',
      key: 'contactInformation',
    },
    {
        title: 'Position',
        dataIndex: 'position',
        key: 'position',
      },
      {
        title: 'More',
        key: 'more',
        dataIndex: 'id',
        render: (text, record) => (
          <NavLink to={`/cvDetails/${record.id}`} style={{ color: 'green' }}>
            <InfoCircleOutlined /> &nbsp;Details
          </NavLink>
        ),
      }
    // Add more columns as needed
  ];


  let dataSource2 = [];
  
  if (firmData && firmData.teamMembers) {
        dataSource2 = firmData.teamMembers.split(',').map((teamMember, index) => {
      const [name, internalOrExternal, position] = teamMember.split('-').map(item => item.trim());

      return {
        key: index,
        name,
        internalOrExternal,
        position,
      };
    });
  }
  dataSource2 = dataSource2.filter((entry) => {
    return !dataSource.some((dataSource) => dataSource.expertName === entry.name);
  });
  
console.log("dataSource2", dataSource2)


  const beforeUpload = (file) => {
    setFileList([file]);
    return false; // Returning false prevents default upload behavior
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", fileList[0]);

    try {
      await postFormData(formData, `uploadFirmExperience/${id}`); // Upload firm experience using postFormData function from useFetchWithToken hook
      message.success("File uploaded successfully!");
      setFileList([]);
    } catch (error) {
      message.error("Failed to upload file");
      setFileList([]);
    }
  };

  return (
    <>
      {loading ? (
  <div style={{ textAlign: 'center', marginTop: '20px' }}>
  <Spin size="large" />
</div>        ) : (
        <>
          {/* Firm Information */}
          <Row gutter={[24, 0]}>
            <Col span={24} md={12} className="mb-24">
              <div style={{ height: "100%" }}>
                <Card
                  bordered={false}
                  title={<h6 className="font-semibold m-0">Firm Information</h6>}
                  className="header-solid h-full card-profile-information"
                  bodyStyle={{ paddingTop: 0, paddingBottom: 16 }}
                >
                  {/* Firm Icon */}
                 
                  {/* Firm Information */}
                  <Descriptions style={{ marginTop: '60px' }}>
                    <Descriptions.Item label="Title" span={3}>
                      {firmData && firmData.title}
                    </Descriptions.Item>
                    <Descriptions.Item label="Client" span={3}>
                      {firmData && firmData.client}
                    </Descriptions.Item>

                    <Descriptions.Item label="Worth" span={3}>
                      {firmData && firmData.worth}
                    </Descriptions.Item>
                    <Descriptions.Item label="Duration" span={3}>
                      {firmData && firmData.duration} Months
                    </Descriptions.Item>
                    <Descriptions.Item label="Project Type" span={3}>
                      {firmData && firmData.projectType}
                    </Descriptions.Item>
                    {/* Add more firm details here */}
                  </Descriptions>
                </Card>
              </div>
            </Col>
            {/* Upload Firm Experience */}
            <Col span={24} md={12} className="mb-24">
              <Card bordered={false} className="header-solid h-full">
                {firmData && firmData.file && (
                  <>
                    <h4>Firm Experience Preview:</h4>
                    {firmData.file.endsWith('.pdf') ? (
                      // If PDF file, render the iframe for preview
                      <iframe title="Firm Experience" src={`https://kmsbe.frontieri.com/kmsApi/${firmData.file}`} style={{ width: "100%", height: "400px" }}></iframe>
                    ) : firmData.file.endsWith('.docx') || firmData.file ? (
                      // If DOCX file, render using Google Docs viewer for preview
                      <DocViewer
              pluginRenderers={DocViewerRenderers}
              documents={docs2}
              config={{
                header: {
                  disableHeader: false,
                  disableFileName: true,
                  retainURLParams: false
                }
              }}
              style={{ height: 500 }}
            />
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
                  {firmData && firmData.summary}
                </p>
              </Card>
            </Col>
          </Row>
          {/* Associated Projects */}
          {/* <Row gutter={[24, 0]}>
            <Col span={24} md={24} className="mb-24">
              <Card
                bordered={false}
                title={<h6 className="font-semibold m-0">Associated Team Members</h6>}
                className="header-solid h-full"
                bodyStyle={{ paddingTop: 0, paddingBottom: 16 }}
              >
                <Table dataSource={dataSource} columns={columns} rowKey={(record) => record.id} />
              </Card>
            </Col>
          </Row>

          <Row gutter={[24, 0]}>
      <Col span={24} md={24} className="mb-24">
        <Card
          bordered={false}
          title={<h6 className="font-semibold m-0">All Team Members</h6>}
          className="header-solid h-full"
          bodyStyle={{ paddingTop: 0, paddingBottom: 16 }}
        >
          <Table dataSource={dataSource2} columns={columns2} rowKey={(record) => record.key} />
        </Card>
      </Col>
    </Row> */}
     <Row gutter={[24, 24]}>
      <Col span={24}>
        <Collapse accordion>
          <Panel header={<h6 className="font-semibold m-0">Associated Team Members</h6>} key="1">
            <Card bordered={false} className="header-solid h-full">
              <Table dataSource={dataSource} columns={columns} rowKey={(record) => record.id} />
            </Card>
          </Panel>
          <Panel header={<h6 className="font-semibold m-0">Other Members</h6>} key="2">
            <Card bordered={false} className="header-solid h-full">
              <Table dataSource={dataSource2} columns={columns2} rowKey={(record) => record.key} />
            </Card>
          </Panel>
        </Collapse>
      </Col>
    </Row>
        </>
      )}
    </>
  );
}

export default FirmExperienceDetail;
