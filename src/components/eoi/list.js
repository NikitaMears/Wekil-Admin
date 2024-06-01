import React, { useState, useEffect } from "react";
import { Table, Card, Upload, message, Input, Row, Col,Dropdown, Modal, Button, Checkbox , Tag, Tabs, Spin} from "antd";
import { NavLink } from "react-router-dom";
import { ToTopOutlined, SearchOutlined ,DownOutlined, EditOutlined, InfoCircleOutlined, CloseCircleTwoTone, CloseCircleFilled, ClockCircleOutlined, CloseCircleOutlined} from "@ant-design/icons";
import useFetchWithToken from "../../services/api";
import EOIForm from "./create";
import EditRFPForm from "./edit";
import moment from 'moment';
import axios from 'axios';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { useHistory } from 'react-router-dom';

import { Tooltip } from 'antd';

const { TabPane } = Tabs;


const { Search } = Input;
function highlightMatchedText(text, query) {
  if (!text || !query || query.trim() === '') return text;

  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return text;

  const maxLength = 20; // Adjust the number of characters to display before and after the highlighted text
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

function EOIList() {
  const [RFPModalVisible, setRFPModalVisible] = useState(false);
  const [RFPEModalVisible, setRFPEModalVisible] = useState(false);
  // const [rfpData, setRFPData] = useState(false);
  const [selectedRowDetails, setSelectedRowDetails] = useState(null); // State to hold selected row details
  const [selectedRow, setSelectedRow] = useState(null);
  const history = useHistory();

  const [fileList, setFileList] = useState([]);

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const {  postFormData, refetchData, loading, error, token } = useFetchWithToken("eois");
  const [rfpData, setRFPData] = useState([]);
  const { data: fetchedData } = useFetchWithToken("rfps");
  
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [detailsVisible, setDetailsVisible] = useState(false);
  const docs2 = [
    { uri: "https://docs.google.com/document/d/1tl99rMUJauJCwGzkQvjIiKnLDgp7XSUl/export?format=docx", fileType:"docx", fileName:"demo.docx" },
  //  { uri: require("./example-files/pdf.pdf") }, // Local File
  ];
  
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
        <Button onClick={() => confirm()} size="small" style={{ width: 90 }}>Search</Button>
        <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>Reset</Button>
      </div>
    ),
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />,
    onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
  });
  const handleRowClick = (record) => {
    setSelectedRow(record);
    setDetailsVisible(true);
  };

  const selectedRowColumns = [
    // Define columns to be displayed when a row is selected
    // For example:
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      ...getColumnSearchProps("title"),
      render: (text) => (
        <Tooltip title={text}>
          {text}
        </Tooltip>
      ),
    },

  ];
  const renderDetailsCard = () => {
    if (!selectedRow) {
      return null;
    }

    return (
      <Card className="details-card">
        <h2>Details of Selected Row</h2>
        <p>Title: {selectedRow.title}</p>
        <p>RFP No: {selectedRow.rfpNo}</p>
        {/* Add more details as needed */}
      </Card>
    );
  };

  useEffect(() => {
    fetchData(); // Fetch data when component mounts
  }, []);

  const ColumnSelector = ({ columns, selectedColumns, onChange }) => {
    const handleChange = (checkedValues) => {
      onChange(checkedValues);
    };
  
    return (
      <Checkbox.Group options={columns} defaultValue={selectedColumns} onChange={handleChange} />
    );
  };
  
  const handleCloseDetails = () => {
    setSelectedRow(null);
  };
  const DynamicTable = ({ columns: initialColumns, data }) => {
    const defaultDisplayedColumns = initialColumns.map(column => column.key).slice(0, 7); // Select first two columns by default
    const [displayedColumns, setDisplayedColumns] = useState(defaultDisplayedColumns);
  
    const handleColumnChange = (selectedColumns) => {
      setDisplayedColumns(selectedColumns);
    };
  
    const filteredColumns = initialColumns.filter(column => displayedColumns.includes(column.key));
  
    return (
      <>
        <Dropdown
          overlay={
            <ColumnSelector
              columns={initialColumns.map((column) => ({
                label: column.title,
                value: column.key,
              }))}
              selectedColumns={defaultDisplayedColumns}
              onChange={handleColumnChange}
            />
          }
          trigger={["click"]}
        >
          <Button>
            Select Columns <DownOutlined />
          </Button>
        </Dropdown>
        <Table columns={filteredColumns} dataSource={data} />
      </>
    );
  };
  

  const fetchData = async () => {
    try {
      const response = await axios.get("https://kmsbe.frontieri.com/kmsApi/eois", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }});
      setRFPData(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401 || error.response.status === 403) {
        // Redirect to login page if status code is 401
        history.push('/login');
        message.error("Session expired. Please login again.");

      } else {
        message.error("Unable to load data!");
      }    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.post(`https://kmsbe.frontieri.com/kmsApi/eois/search`, {
        query: searchQuery
      },{
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('Search Results:', response.data);
setRFPData(response.data)      // Handle search results here
    } catch (error) {
      if (error.response && error.response.status === 401 || error.response.status === 403) {
        // Redirect to login page if status code is 401
        history.push('/login');
        message.error("Session expired. Please login again.");

      } else {
        message.error("Unable to load data!");
      }    }
  };
  const handleAddRFP = () => {
    setFormData({});
    setRFPModalVisible(true);
  };
  

  const handleEditRFP = (record) => {
    setFormData(record);
    setRFPModalVisible(true);
  };

  const handleEdit = (record) => {
    console.log("Edit button clicked", record);
    setEditMode(true);
    const formattedIssuedOn = moment(record.issuedOn).format('YYYY-MM-DD');
    console.log("fgf", formattedIssuedOn)
    setFormData({ ...record, issuedOn: formattedIssuedOn});
    setRFPEModalVisible(true);
  };
  
console.log(RFPEModalVisible)

console.log(editMode)
  const closeModal = () => {
    setEditMode(false);
    setFormData(null);
    setRFPModalVisible(false);
    setRFPEModalVisible(false);
    setSelectedRow(null)

  };

  const handleUpload = async ({ file }) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      await postFormData(formData, 'uploadEOI');
      message.success(`${file.name} uploaded successfully`);
    } catch (error) {
      console.log(error);
      message.error(`Failed to upload ${file.name}`);
    } finally {
      setUploading(false);
    }
  };

  
  // const columns = [
  //   {
  //     title: "Title",
  //     dataIndex: "title",
  //     key: "title",
  //     width: "20%",
  //   },
  //   {
  //     title: "RFP No",
  //     dataIndex: "rfpNo",
  //     key: "rfpNo",
  //   },
  //   // Display client column only when data is not from search
  //   ...(searchQuery ? [] : [
  //     {
  //       title: "Client",
  //       dataIndex: "client",
  //       key: "client",
  //     },
  //   ]),
  //   // Display country column only when data is not from search
  //   ...(searchQuery ? [] : [
  //     {
  //       title: "Country",
  //       dataIndex: "country",
  //       key: "country",
  //     },
  //   ]),
  //   ...(searchQuery ? [
  //     {
  //       title: 'Content',
  //       dataIndex: 'content',
  //       key: 'content',
  //       render: (text) => highlightMatchedText(text, searchQuery),
  //     },
  //   ] : []),
  //   {
  //     title: "Action",
  //     key: "action",
  //     render: (text, record) => (
  //       <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>Edit</Button>
  //     )
  //   },
  //   {
  //     title: 'More',
  //     key: 'more',
  //     dataIndex: 'id',
  //     render: (text, record) => (
  //       <NavLink to={`/rfpDetails/${record.id}`} style={{ color: 'green' }}>
  //         <InfoCircleOutlined /> &nbsp;Details
  //       </NavLink>
  //     ),
  //   }
  // ];


  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: 600,
      ...getColumnSearchProps("title"),
      render: (text) => <Tooltip title={text}>{text.length > 200 ? `${text.substring(0, 200)}...` : text}</Tooltip>

    },
    // {
    //   title: "EOI No",
    //   dataIndex: "rfpNo",
    //   key: "rfpNo",
    //   ...getColumnSearchProps("rfpNo"),
    //   render: (text) => (
    //     <Tooltip title={text}>
    //       {text}
    //     </Tooltip>
    //   ),
    // },

    // Display client column only when data is not from search
    ...(searchQuery ? [] : [
      {
        title: "Client",
        dataIndex: "client",
        key: "client",
        width: 200,
        ...getColumnSearchProps("client"),
        render: (text) => <Tooltip title={text}>{text.length > 200 ? `${text.substring(0, 200)}...` : text}</Tooltip>

      },
    ]),
    ...(searchQuery ? [] : [
      {
        title: "Country",
        dataIndex: "country",
        width: 300,
        key: "country",
        ...getColumnSearchProps("country"),
      },
    ]),
    {
      title: "Sector",
      dataIndex: "sector",
      key: "sector",
      width: 200,
      ...getColumnSearchProps("sector"),
      render: (text) => (
        <Tooltip title={text}>
          {text}
        </Tooltip>
      ),
    },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   key: "status",
    //   render: (status) => {
    //     let color = '';
    //     switch (status) {
    //       case 'Bid':
    //         color = 'green';
    //         break;
    //       case 'No Bid':
    //         color = 'red';
    //         break;
    //       case 'Pending':
    //         color = 'gray';
    //         break;
    //       default:
    //         color = '';
    //     }
    //     return (
    //       <Tag color={color}>{status}</Tag>
    //     );
    //   }
    // },
    // Display country column only when data is not from search
 
    ...(searchQuery ? [
      {
        title: 'Content',
        dataIndex: 'content',
        key: 'content',
        with: 300,
        render: (text) => highlightMatchedText(text, searchQuery),
      },
    ] : []),
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>Edit</Button>
          <NavLink to={`/eoiDetails/${record.id}`} style={{ color: 'green' }}>
            <InfoCircleOutlined /> &nbsp;Details
          </NavLink>
        </>
      )
    }
  ];
  // const columns = selectedRow ? selectedRowColumns : defaultColumns;

  
  // const columns = [
  //   {
  //     title: "Title",
  //     dataIndex: "title",
  //     key: "title",
  //     width: "20%",
  //     ...getColumnSearchProps("title")
  //   },
  //   {
  //     title: "RFP No",
  //     dataIndex: "rfpNo",
  //     key: "rfpNo",
  //     ...getColumnSearchProps("rfpNo")
  //   },
  //   {
  //     title: "Client",
  //     dataIndex: "client",
  //     key: "client",
  //     ...getColumnSearchProps("client")
  //   },
  //   {
  //     title: "Country",
  //     dataIndex: "country",
  //     key: "country",
  //     ...getColumnSearchProps("country")
  //   },
  //   // {
  //   //   title: "Issued On",
  //   //   dataIndex: "issuedOn",
  //   //   key: "issuedOn",
  //   //   ...getColumnSearchProps("issuedOn")
  //   // },
  //   {
  //     title: "Action",
  //     key: "action",
  //     render: (text, record) => (
  //       <Button type="link"             icon={<EditOutlined />}
  //       onClick={() => handleEdit(record)}>Edit</Button>
  //     )
  //   },
  //   {
  //     title: 'More',
  //     key: 'more',
  //     dataIndex: 'id',
  //     render: (text, record) => (
  //       <NavLink to={`/rfpDetails/${record.id}`} style={{ color: 'green' }}>
  //         <InfoCircleOutlined /> &nbsp;Details
  //       </NavLink>
  //     ),
  //   }
  // ];

  return (
    <div className="tabled">
      <Row gutter={[24, 0]}>
        <Col span={12}>
          {/* <NavLink to="#" onClick={handleAddRFP} className="ant-btn ant-btn-primary" role="button">
            Add RFP
          </NavLink> */}
        </Col>
        <Col span={12}>
          <Search
            placeholder="Search"
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Col>
      </Row>
      <br />

      {loading ? (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Spin size="large" />
          </div>
            ) : (
      <Row gutter={[24, 0]}>
      <Col xs={24} xl={selectedRow ? 12 : 24}>
          <Card>
          <div style={{ overflowX: 'auto' }}>
              <Table
                columns={columns}
                dataSource={rfpData}
                pagination={{ pageSize: 5 }}
                scroll={{ x: 2500, y: 400 }} // Adjust the scroll properties as needed

                className="ant-border-space"
                onRow={(record) => ({
                  onClick: () => handleRowClick(record),
                })}
              />
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
    title={`Details of ${selectedRow.title}`}
    style={{ height: "450px", overflow: "auto" }}
    headStyle={{ position: 'sticky', top: '0', zIndex: '1', background: '#fff' }}

    extra={
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Button type="link" onClick={handleCloseDetails} style={{ color: 'red' }}>   Close
</Button>
        </div>
        <div style={{ textAlign: 'center', alignSelf: 'center' }}>
  <Button type="link" onClick={() => history.push(`/eoiDetails/${selectedRow.id}`)} style={{ color: 'green' }}>
Details  </Button>
</div>
      </div>
    }
  >
    <p>RFP No: {selectedRow.rfpNo}</p>
    <div>
      {selectedRow.content.split("\n\n").map((paragraph, index) => (
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
    <div style={{ textAlign: 'center', marginTop: '10px' }}>
    <span>Go to details</span>
  </div>

  </Card>
</TabPane>
<TabPane tab="File Preview" key="2">
<Card bordered={false} className="header-solid h-full">
            <h4>RFP Preview:</h4>
              <div style={{ width: "100%", height: "400px" }}>
                <DocViewer
                  pluginRenderers={DocViewerRenderers}
                  documents={`https://kmsbe.frontieri.com/kmsApi/${selectedRow.file}`}
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
         
       
          </Card>
</TabPane>
</Tabs>
</div>

          )}
        </Col>
      </Row>
        )}
      <Card bordered={false}>
        <div className="uploadfile pb-15 shadow-none">
          <Upload
            name="file"
            customRequest={handleUpload}
            beforeUpload={(file) => {
              const isExcel =
                file.type === "application/docx" ||
                file.type ===
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
              if (1 > 2) {
                message.error("You can only upload Excel files!");
              }
              return true;
            }}
          >
            <Button
              type="dashed"
              className="ant-full-box"
              icon={<ToTopOutlined />}
              loading={uploading}
            >
              Click to Upload
            </Button>
          </Upload>
        </div>
      </Card>
      <Modal
        title={"Add RFP"}
        visible={RFPModalVisible}
        onCancel={closeModal}
        footer={null}
      >
        <EOIForm
          formData={formData}
          setFormData={setFormData}
          closeModal={closeModal}
          refetchData={refetchData}
        />
      </Modal>
      <Modal
        title={"Edit RFP"}
        visible={RFPEModalVisible}
        onCancel={closeModal}
        footer={null}
      >
        {editMode && (
          <EditRFPForm
            formData={formData}
            setFormData={setFormData}
            visible={RFPEModalVisible}
            closeModal={closeModal}
            refetchData={() => {
              console.log("Refetching RFP data...");
            }}
          />
        )}
      </Modal>
    </div>
  );
  
}

export default EOIList;
