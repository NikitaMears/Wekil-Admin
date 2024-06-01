import React, { useState,useEffect } from "react";
import { Table, Card, Upload, message,Tabs, Button, Input, Row, Col, Tag, Spin } from "antd";
import { NavLink } from "react-router-dom";
import { ToTopOutlined, SearchOutlined } from "@ant-design/icons";
import useFetchWithToken from "../../services/api";
// import postFormData from "../../services/api"
import { useHistory } from 'react-router-dom';

import axios from 'axios';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
const { TabPane } = Tabs;

const { Search } = Input;
function highlightMatchedText(text, query) {
  if (!text || !query || query.trim() === '') return text;

  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return text;

  const maxLength = 50; // Adjust the number of characters to display before and after the highlighted text
  const startIndex = Math.max(0, index - maxLength);
  const endIndex = Math.min(text.length, index + query.length + maxLength);

  const prefix = startIndex > 0 ? '...' : '';
  const suffix = endIndex < text.length ? '...' : '';

  const highlightedText = text.substring(startIndex, endIndex)
    .replace(new RegExp(query, 'gi'), (match) => `<span style="background-color: yellow">${match}</span>`);

  return (
    <span dangerouslySetInnerHTML={{ __html: prefix + highlightedText + suffix }} />
  );
}
function highlightMatchedText2(text, query) {
  if (!text || !query || query.trim() === '') return text;

  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return text;

  const maxLength = 2000000; // Adjust the number of characters to display before and after the highlighted text
  const startIndex = Math.max(0, index - maxLength);
  const endIndex = Math.min(text.length, index + query.length + maxLength);

  const prefix = startIndex > 0 ? '...' : '';
  const suffix = endIndex < text.length ? '...' : '';

  const highlightedText = text.substring(startIndex, endIndex)
    .replace(new RegExp(query, 'gi'), (match) => `<span style="background-color: yellow">${match}</span>`);

  return (
    <span dangerouslySetInnerHTML={{ __html: prefix + highlightedText + suffix }} />
  );
}
function CvList() {
  const { postFormData , token} = useFetchWithToken("cvs");
  const [uploading, setUploading] = useState(false);
  const [cvData, setCvData, refetchData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRowDetails, setSelectedRowDetails] = useState(null); // State to hold selected row details
  const [selectedRow, setSelectedRow] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);


  const history = useHistory();
  useEffect(() => {
    fetchData(); // Fetch data when component mounts
  }, []);
  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await axios.get("https://kmsbe.frontieri.com/kmsApi/cvs", {  headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },});
      setCvData(response.data);
      setLoading(false)

    } catch (error) {
      if (error.response && error.response.status === 401 || error.response.status === 403) {
        // Redirect to login page if status code is 401
        history.push('/login');
        message.error("Session expired. Please login again.");

      } else {
        message.error("Unable to load data!");
      }
    }
  };
  const handleRowClick = (record) => {
    setSelectedRow(record);
    setDetailsVisible(true);
  };
  const handleCloseDetails = () => {
    setSelectedRow(null);
  };
  const handleUpload = async ({ file }) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      // Use the postFormData function to upload the file
      await postFormData(formData, 'upload');

      // Handle successful upload
      message.success(`${file.name} uploaded successfully`);
      setUploading(false)
    } catch (error) {
      // Handle upload error
      console.log(error)
      message.success(`${file.name} uploaded successfully`);
      setUploading(false)

    } finally {
      setUploading(false);
    }
  };
  const handleSearch = async () => {
    try {
      const response = await axios.post(`https://kmsbe.frontieri.com/kmsApi/cvs/search`, {
        query: searchQuery
      },{  headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },});
      console.log('Search Results:', response.data);
      setCvData(response.data); // Handle search results here
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Search
          placeholder={`Search ${dataIndex}`}
          allowClear
          size="small"
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onSearch={() => confirm()}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />

        <Button onClick={() => confirm()} size="small" style={{ width: 90 }}>
          Search
        </Button>
        <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />,
    onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
  });

  const columns = [
    {
      title: "CV Holder Name",
      dataIndex: "expertName",
      key: "expertName",
      width: "20%",
      ...getColumnSearchProps("expertName"),
      render: (text) => {
        const truncatedText = text.length > 80 ? `${text.substring(0, 40)}...` : text;
        return highlightMatchedText(truncatedText, searchQuery);
      },
    },
    {
      title: "Location",
      dataIndex: "country",
      key: "country",
      ...getColumnSearchProps("country"),
      render: (text) => {
        const truncatedText = text.length > 80 ? `${text.substring(0, 40)}...` : text;
        return highlightMatchedText(truncatedText, searchQuery);
      },
    },
    {
      title: "Research Interest",
      dataIndex: "researchInterest",
      key: "researchInterest",
      ...getColumnSearchProps("researchInterest"),
      render: (text) => {
        const truncatedText = text.length > 80 ? `${text.substring(0, 40)}...` : text;
        return highlightMatchedText(truncatedText, searchQuery);
      },
    },
    {
      title: "Average Daily Rate",
      dataIndex: "priceAverage",
      key: "priceAverage",
      ...getColumnSearchProps("priceAverage"),
      render: (text) => {
        const truncatedText = text.length > 80 ? `${text.substring(0, 40)}...` : text;
        return highlightMatchedText(truncatedText, searchQuery);
      },
    },
    {
      title: 'Summary',
      dataIndex: 'cvSummary',
      key: 'cvSummary',
      ...getColumnSearchProps('cvSummary'),
      render: (text) => {
        const truncatedText = text.length > 80 ? `${text.substring(0, 40)}...` : text;
        return highlightMatchedText(truncatedText, searchQuery);
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: () => (
        <Tag color="#4caf50" key="Available">
          Available
        </Tag>
      )
    },
    {
      title: "More",
      key: "more",
      dataIndex: "id",
      render: (text, record) => <NavLink to={`/cvDetails/${record.id}`}>Details</NavLink>
    }
  ];

  return (
    <div className="tabled">
        <Row gutter={[24, 0]}>
        <Col span={12}>
          {/* <Button type="primary" onClick={() => setProjectModalVisible(true)}>Add FR</Button> */}
        </Col>
        <Col span={12}>
          <Search
            placeholder="Search CV"
            allowClear
            enterButton={<SearchOutlined />}
            onSearch={handleSearch}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </Col>
      </Row>
      {loading ? (
  <div style={{ textAlign: 'center', marginTop: '20px' }}>
  <Spin size="large" />
</div>      ) : (
      <Row gutter={[24, 0]}>
      <Col xs={24} xl={selectedRow ? 12 : 24}>
          <Card>
            <div className="table-responsive">
              <Table columns={columns}  onRow={(record) => ({
                onClick: () => handleRowClick(record),
              })} dataSource={cvData} pagination={{ pageSize: 5 }} className="ant-border-space" />
            </div>
          </Card>
          <Card bordered={false}>
            <div className="uploadfile pb-15 shadow-none">
              <Upload
                name="file"
                customRequest={handleUpload}
                beforeUpload={(file) => {
                  const isExcel = file.type === "application/vnd.ms-excel" || file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                  if (!isExcel) {
                    message.error("You can only upload Excel files!");
                  }
                  return isExcel;
                }}
              >
                <Button type="dashed" className="ant-full-box" icon={<ToTopOutlined />} loading={uploading}>
                  Click to Upload
                </Button>
              </Upload>
            </div>
          </Card>
        </Col>
        <Col xs={24} xl={12}>
          {selectedRow && (
//    <Card
//    title={`Details of ${selectedRow.title}`}
//    style={{ height: "500px", overflow: "auto" }}
//    extra={<Button onClick={handleCloseDetails}>X</Button>}
//  >
//    <p>RFP No: {selectedRow.rfpNo}</p>
//    <div>
//      {selectedRow.content.split("\n\n").map((paragraph, index) => (
//        <p
//          key={index}
//          ref={(el) => {
//            if (el && el.innerHTML.includes('<span style="background-color: yellow">')) {
//              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
//            }
//          }}
//        >
//          {highlightMatchedText(paragraph, searchQuery)}
//        </p>
//      ))}
//    </div>
//    {/* <Button onClick={handleCloseDetails}>Close</Button> */}
//  </Card>
<div className="tabled">

<Tabs defaultActiveKey="1">
<TabPane tab="Details" key="1">
  <Card
    title={`Details of ${selectedRow.expertName}`}
    style={{ height: "500px", overflow: "auto" }}
    headStyle={{ position: 'sticky', top: '0', zIndex: '1', background: '#fff' }}

    extra={
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Button type="link" onClick={handleCloseDetails} style={{ color: 'red' }}>   Close
</Button>
        </div>
        <div style={{ textAlign: 'center', alignSelf: 'center' }}>
  <Button type="link" onClick={() => history.push(`/cvDetails/${selectedRow.id}`)} style={{ color: 'green' }}>
Details  </Button>
</div>
      </div>
    }
  >
    <p>Contact Info: {selectedRow.contactInformation}</p>
    <p>Research Interest: {selectedRow.researchInterest}</p>

    <div>
    <div>
  {selectedRow.cvSummary.split("\n\n").map((paragraph, index) => (
    <p
      key={index}
      ref={(el) => {
        if (el && el.innerHTML.includes('<span style="background-color: yellow">')) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }}
    >
      {highlightMatchedText2(paragraph, searchQuery)}
    </p>
  ))}
</div>

    </div>
   

  </Card>
</TabPane>
<TabPane tab="File Preview" key="2">
<Card bordered={false} className="header-solid h-full">
                {selectedRow && selectedRow.cv && (
                  <>
                    <h4>CV Preview:</h4>
                    {selectedRow.cv.endsWith('.pdf') ? (
                      // If PDF file, render the iframe for preview
                      <iframe title="No CV" src={`https://kmsbe.frontieri.com/kmsApi/${selectedRow.cv}`} style={{ width: "100%", height: "400px" }}></iframe>
                    ) : selectedRow.cv.endsWith('.docx') ? (
                      // If DOCX file, render using Google Docs viewer for preview
                      <div style={{ width: "100%", height: "400px" }}>
                        <iframe title="CV Preview" src={`https://docs.google.com/viewer?url=https://kmsbe.frontieri.com/kmsApi/${selectedRow.cv}&embedded=true`} style={{ width: "100%", height: "100%" }}></iframe>
                      </div>
                    ) : (
                      // If other file formats, display a message or handle accordingly
                      <p>Unsupported file format</p>
                    )}
                  </>
                )}
               
              </Card>
</TabPane>
</Tabs>
</div>

          )}
        </Col>
      </Row>
           )}
    </div>
  );
}

export default CvList;
