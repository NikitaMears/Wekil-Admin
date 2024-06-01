import React, { useState, useEffect } from "react";
import { Row, Col, Card, Upload, message, Descriptions, Button, Tag , Table, Divider, Spin} from "antd";
import { useParams } from "react-router-dom";
import { ToTopOutlined, InfoCircleOutlined } from '@ant-design/icons';
import useFetchWithToken from '../../services/api';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { NavLink } from "react-router-dom";

function TpDetail() {
  const [fileList, setFileList] = useState([]);
  const { id } = useParams();
  const [docs, setDocs] = useState([]);

  console.log("khkjh", id)
  const docs2 = [
    { uri: "https://docs.google.com/document/d/1eia8mVXcNdIGiYC6yTnJuqyRI3F45LmjF1qvUt0VLkc/export?format=docx", fileType:"docx", fileName:"demo.docx" },
  //  { uri: require("./example-files/pdf.pdf") }, // Local File
  ];
  const { data: tpData, loading, error, postFormData } = useFetchWithToken(`tps/${id}`);
  const [previewUrl, setPreviewUrl] = useState('');
  useEffect(() => {
    if (tpData) {
      setDocs([{ uri: `https://kmsbe.frontieri.com/kmsApi/${tpData.file}` }]);
    }
  }, [tpData]);
  const beforeUpload = (file) => {
    setFileList([file]);
    setPreviewUrl(URL.createObjectURL(file));
    return false;
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", fileList[0]);

    try {
      await postFormData(formData, `uploadTP/${id}`);
      message.success("File uploaded successfully!");
      setFileList([]);
    } catch (error) {
      message.error("File upload failed!");
      setFileList([]);
    }
  };
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Expert Name',
      dataIndex: 'expertName',
      key: 'expertName',
    },
    {
      title: 'Position',
      dataIndex: 'cv',
      key: 'cv',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <a href={`/cvDetails/${record.id}`}>Details</a>
      ),
    },
  ];

  useEffect(() => {
    if (tpData && tpData.title) {
      // Ensure tpData is not null or undefined before accessing its properties
      if (tpData.file) {
        setPreviewUrl(`https://kmsbe.frontieri.com/kmsApi/${tpData.file}`);
      }
    }
  }, [tpData]);

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      {/* Profile Information */}
      {loading ? (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Spin size="large" />
          </div>
            ) : (
      <Row gutter={[24, 0]}>
        <Col span={24} md={12} className="mb-24">
          <Card
            bordered={false}
            title={<h6 className="font-semibold m-0">TP Information</h6>}
            className="header-solid h-full"
            bodyStyle={{ paddingTop: 0, paddingBottom: 16 }}
          >
  <Descriptions style={{ marginTop: '60px' }}>
  <Descriptions.Item label="Title" span={3}>
    {tpData && tpData.title}
  </Descriptions.Item>
  <Descriptions.Item label="RFP" span={6}>
  {tpData && tpData.RFP && (
    <React.Fragment>
      <NavLink to={`/rfpDetails/${tpData.RFP.id}`}>
        {tpData.RFP.title}
      </NavLink>
     
    </React.Fragment>
  )}
</Descriptions.Item>


  <Descriptions.Item label="Client" span={3}>
    {tpData && tpData.client}
  </Descriptions.Item>
  <Descriptions.Item label="Year" span={3}>
    {tpData && tpData.year}
  </Descriptions.Item>
  <Descriptions.Item label="Team Members" span={3}>
  </Descriptions.Item>

  <Card type="inner" title="Inner Card title" extra={<a href="#">More</a>}>
  <Table dataSource={tpData && tpData.members} columns={columns} rowKey={(record) => record.id} />
    </Card>



</Descriptions>

          </Card>
        </Col>
        <Col span={24} md={12} className="mb-24">
          <Card bordered={false} className="header-solid h-full">
            <h4>TP Preview:</h4>
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
              style={{ height: 500 }}
            />
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
         )}
    </>
  );
}

export default TpDetail;
