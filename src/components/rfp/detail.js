import React, { useState, useEffect } from "react";
import { Row, Col, Card, Upload, message, Descriptions, Button, Tag , Tabs, } from "antd";
import { useParams } from "react-router-dom";
import { ToTopOutlined } from '@ant-design/icons';
import useFetchWithToken from '../../services/api'; // Import the useFetchWithToken hook
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import CvList from "./cvs";
import TpDetail from "../tp/detail";
import RFPFR from "./fr";
import RFPIR from "./ir";

import ExperienceList from "./experience";
const { TabPane } = Tabs;

function RFPDetail() {
  const [fileList, setFileList] = useState([]);
  const { id } = useParams();
  const { data: rfpData, loading, postFormData } = useFetchWithToken(`rfps/${id}`); // Fetch RFP details using useFetchWithToken hook
  const [filePath, setFilePath] = useState("");
  const [docs, setDocs] = useState([]);

  const beforeUpload = (file) => {
    setFileList([file]);
    return false; // Returning false prevents default upload behavior
  };

  useEffect(() => {
    if (rfpData) {
      setDocs([{ uri: `https://kmsbe.frontieri.com/kmsApi/${rfpData.file}` }]);
    }
  }, [rfpData]);
  const docs2 = [
    { uri: "https://docs.google.com/document/d/1tl99rMUJauJCwGzkQvjIiKnLDgp7XSUl/export?format=docx", fileType:"docx", fileName:"demo.docx" },
  //  { uri: require("./example-files/pdf.pdf") }, // Local File
  ];
  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", fileList[0]);

    try {
      await postFormData(formData, `uploadRFP/${id}`); // Upload RFP using postFormData function from useFetchWithToken hook
      message.success("File uploaded successfully!");
      setFileList([]);
    } catch (error) {
      message.error("File upload failed!");
      setFileList([]);
    }
  };

  if (loading || !rfpData || !docs.length) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {/* RFP Information */}
      
      <Tabs defaultActiveKey="1">
        <TabPane tab="General Information" key="1">
      <Row gutter={[24, 0]}>
        <Col span={24} md={12} className="mb-24">
          <Card
            bordered={false}
            title={<h6 className="font-semibold m-0">RFP Information</h6>}
            className="header-solid h-full"
            bodyStyle={{ paddingTop: 0, paddingBottom: 16 }}
          >
            <Descriptions style={{ marginTop: '60px' }}>
              <Descriptions.Item label="Title" span={3}>
                {rfpData.title}
              </Descriptions.Item>
              <Descriptions.Item label="Client" span={3}>
                {rfpData.client}
              </Descriptions.Item>
              <Descriptions.Item label="Country" span={3}>
                {rfpData.country}
              </Descriptions.Item>
              <Descriptions.Item label="Issued On" span={3}>
                {rfpData.issuedOn}
              </Descriptions.Item>
              <Descriptions.Item label="Sector" span={3}>
                {rfpData.sector}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        {/* Upload RFP */}
        <Col span={24} md={12} className="mb-24">
          <Card bordered={false} className="header-solid h-full">
            <h4>RFP Preview:</h4>
            {rfpData.file.endsWith('.pdf') ? (
              // If PDF file, render the iframe for preview
<iframe title="No CV" src={`https://kmsbe.frontieri.com/kmsApi/${rfpData.file}`} style={{ width: "100%", height: "400px" }}></iframe>
            ) : rfpData.file.endsWith('.docx') ? (
              // If DOCX file, render using DocViewer for preview
              <div style={{ width: "100%", height: "400px" }}>
                <DocViewer
                  pluginRenderers={DocViewerRenderers}
                  documents={docs}
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
            ) : (
              // If other file formats, display a message or handle accordingly
              <p>Unsupported file format</p>
            )}
            <div className="mt-4">
              <Upload
                beforeUpload={beforeUpload}
                fileList={fileList}
                maxCount={1}
                accept=".docx,.pdf"
              >
                {/* <Button type="dashed" className="ant-full-box" icon={<ToTopOutlined />} >
                  Upload File
                </Button> */}
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
            title={<h6 className="font-semibold m-0">General Objectives</h6>}
            className="header-solid h-full"
            bodyStyle={{ paddingTop: 0, paddingBottom: 16 }}
          >
            <p className="text-dark">
              {rfpData.objectives}
            </p>
          </Card>
        </Col>
      </Row>
      <Row gutter={[24, 0]}>
        <Col span={24} md={24} className="mb-24">
          <Card
            bordered={false}
            title={<h6 className="font-semibold m-0">Specific Objectives</h6>}
            className="header-solid h-full"
            bodyStyle={{ paddingTop: 0, paddingBottom: 16 }}
          >
            <p className="text-dark">
              {rfpData.specificObjectives}
            </p>
          </Card>
        </Col>
      </Row>
      </TabPane>

        <TabPane tab="Available Experts" key="2">
        <CvList  rfpId={id} />
        </TabPane>
        <TabPane tab="Firm Experiences" key="6">
        <ExperienceList  rfpId={id} />
        </TabPane>
        <TabPane tab="Technical Proposal" key="3">
        <TpDetail  rfpId={id} />
        </TabPane>
        <TabPane tab="Inception Report" key="4">
        <RFPIR  rfpId={id} />
        </TabPane>
        <TabPane tab="Final Report" key="5">
        <RFPFR  rfpId={id} />
        </TabPane>
      </Tabs>
    </>
  );
}

export default RFPDetail;
