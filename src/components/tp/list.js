import React, { useState, useEffect } from "react";
import { Table,Popconfirm, Card, Upload, message, Input, Row, Col, Button, Modal, Checkbox, Dropdown, Tabs, Spin } from "antd";
import { NavLink } from "react-router-dom";
import { ToTopOutlined, SearchOutlined, EditOutlined,ExclamationCircleOutlined, DeleteOutlined, DownOutlined, InfoCircleOutlined } from "@ant-design/icons";
import useFetchWithToken from "../../services/api";
import moment from "moment";
import CreateTp from "./create"; // Import the CreateTp form
import EditTp from "./edit";
import axios from 'axios';
import { Tooltip } from 'antd';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { useHistory } from 'react-router-dom';
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
function TpList() {
  const [uploading, setUploading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [tpsData, setTPData] = useState([]);
  const { data: fetchedData } = useFetchWithToken("tps");
  const { postFormData, refetchData, token } = useFetchWithToken("tps");
  const [editMode, setEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRowDetails, setSelectedRowDetails] = useState(null); // State to hold selected row details
  const [selectedRow, setSelectedRow] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  const docs2 = [
    { uri: "https://docs.google.com/document/d/1eia8mVXcNdIGiYC6yTnJuqyRI3F45LmjF1qvUt0VLkc/export?format=docx", fileType:"docx", fileName:"demo.docx" },
  //  { uri: require("./example-files/pdf.pdf") }, // Local File
  ];
  useEffect(() => {
    fetchData(); // Fetch data when component mounts
  }, []);
  const handleUpload = async ({ file }) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      await postFormData(formData, "uploadTPFull");
      message.success(`${file.name} uploaded successfully`);
      refetchData();

    } catch (error) {
      console.error("Error uploading file:", error);
      message.error(`Failed to upload ${file.name}`);
    } finally {
      setUploading(false);
    }
  };
  const handleRowClick = (record) => {
    setSelectedRow(record);
    setDetailsVisible(true);
  };
  const handleCloseDetails = () => {
    setSelectedRow(null);
  };
  const ColumnSelector = ({ columns, selectedColumns, onChange }) => {
    const handleChange = (checkedValues) => {
      onChange(checkedValues);
    };

    return (
      <Checkbox.Group options={columns} defaultValue={selectedColumns} onChange={handleChange} />
    );
  };

  // const DynamicTable = ({ columns: initialColumns, data }) => {
  //   const defaultDisplayedColumns = initialColumns.map(column => column.key).slice(0, 7); // Select first two columns by default
  //   const [displayedColumns, setDisplayedColumns] = useState(defaultDisplayedColumns);

  //   const handleColumnChange = (selectedColumns) => {
  //     setDisplayedColumns(selectedColumns);
  //   };

  //   const filteredColumns = initialColumns.filter(column => displayedColumns.includes(column.key));

  //   return (
  //     <>
  //       <Dropdown
  //         overlay={
  //           <ColumnSelector
  //             columns={initialColumns.map((column) => ({
  //               label: column.title,
  //               value: column.key,
  //             }))}
  //             selectedColumns={defaultDisplayedColumns}
  //             onChange={handleColumnChange}
  //           />
  //         }
  //         trigger={["click"]}
  //       >
  //         <Button>
  //           Select Columns <DownOutlined />
  //         </Button>
  //       </Dropdown>
  //       <Table columns={filteredColumns} dataSource={data} />
  //     </>
  //   );
  // };
  const DynamicTable = ({ columns: initialColumns, data, onRow }) => {
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
        <Table
          columns={filteredColumns}
          dataSource={data}
          pagination={{ pageSize: 5 }}
          className="ant-border-space"
          onRow={onRow} // Pass the onRow prop to the Table component
        />
      </>
    );
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
        <Button onClick={() => confirm()} size="small" style={{ width: 90 }}>Search</Button>
        <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>Reset</Button>
      </div>
    ),
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />,
    onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
  });
  const fetchData = async () => {
    const token = await localStorage.getItem('token');

    try {
      setLoading(true)
      const response = await axios.get("https://kmsbe.frontieri.com/kmsApi/tps", {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
      setTPData(response.data);
      setLoading(false)
    } catch (error) {
      if (error.response && error.response.status === 401 || error.response.status === 403) {
        // Redirect to login page if status code is 401
        history.push('/login');
        message.error("Session expired. Please login again.");

      } else {
        message.error("Unable to load data!");
      }     }
  };
  const handleSearch = async () => {
    console.log("se", searchQuery)
    const token = await localStorage.getItem('token');

    try {
      const response = await axios.post(`https://kmsbe.frontieri.com/kmsApi/tps/search`, {
        query: searchQuery,
       
      },{   headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },});
      console.log('Search Results:', response.data);
      setTPData(response.data)      // Handle search results here
    } catch (error) {
      if (error.response && error.response.status === 401 || error.response.status === 403) {
        // Redirect to login page if status code is 401
        history.push('/login');
        message.error("Session expired. Please login again.");

      } else {
        message.error("Unable to load data!");
      }   }
  };

  const handleEdit = (record) => {
    console.log("e", record)

    setEditData(record);
    setEditMode(true)
    setShowCreateModal(true);
  };

  const handleDelete = async (record) => {
    try {
      await axios.delete(`https://kmsbe.frontieri.com/kmsApi/tps/${record.id}`, {   headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },});
      message.success('TP deleted successfully.');
      // Refresh the page
      window.location.reload();
    } catch (error) {
      if (error.response && error.response.status === 401 || error.response.status === 403) {
        // Redirect to login page if status code is 401
        history.push('/login');
        message.error("Session expired. Please login again.");

      } else {
        message.error("Unable to load data!");
      }  
      // Handle error, show error message, etc.
    }
  };
  
  
  const handleDeleteButtonClick = (e, record) => {
    e.stopPropagation(); // Stop event propagation
    showDeleteConfirm(record);
  };

  const showDeleteConfirm = (record) => {
/* eslint-disable no-restricted-globals */
<Popconfirm
  title="Are you sure you want to delete this record?"
  icon={<ExclamationCircleOutlined />}
  okText="Yes"
  okType="danger"
  cancelText="No"
  onConfirm={(e) => {
    e.stopPropagation(); // Prevent default behavior
    handleDelete(record);
  }}
  onCancel={(e) => {
    e.stopPropagation(); // Prevent default behavior
    console.log('Cancel');
  }}
>
  
</Popconfirm>
/* eslint-enable no-restricted-globals */

  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      ...getColumnSearchProps("title"),

      width: 200,
    
    },
    ...(searchQuery ? [] : [
      {
        title: "Sector",
        dataIndex: "sector",
        key: "sector",
        width: 100,

        ...getColumnSearchProps("sector"),

      },
    ]),
    {
      title: "Client",
      dataIndex: "client",
      key: "client",
      ...getColumnSearchProps("client"),
      width: 100,

     
    },
    {
      title: "Objectives",
      dataIndex: "objectives",
      key: "objectives",
      width: 500,

    
    },

    // Display country column only when data is not from search
    ...(searchQuery ? [
      {
        title: 'Content',
        dataIndex: 'content',
        key: 'content',
        width: 500,

        render: (text) => highlightMatchedText(text, searchQuery),
      },
    ] : []),
    

    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Edit
          </Button>
      
          <NavLink to={`/tpDetails/${record.id}`} style={{ color: 'green' }}>             <InfoCircleOutlined /> &nbsp;Details
            </NavLink>
            <Popconfirm
        title="Are you sure you want to delete this record?"
        icon={<ExclamationCircleOutlined />}
        okText="Yes"
        okType="danger"
        cancelText="No"
        onConfirm={() => handleDelete(record)}
      >
        <Button type="link" danger icon={<DeleteOutlined />} onClick={(e) => handleDeleteButtonClick(e, record)}>
          Delete
        </Button>
      </Popconfirm>

        </>
      ),
    },
  ];


  return (
    <div className="tabled">
      <Row gutter={[24, 0]}>
        <Col span={12}>
          <Button type="primary" onClick={() => setShowCreateModal(true)}>Add New TP</Button>

        </Col>
        <Col span={12}>
          <Search
            placeholder="Search"
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </Col>
      </Row>
      <Row gutter={[24, 0]}>

      <Col xs={24} xl={selectedRow ? 12 : 24}>
          {/* <Button type="primary" onClick={() => setShowCreateModal(true)}>Add New TP</Button> */}
          <Card>
          {loading ? (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <Spin size="large" />
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>

            <DynamicTable
              columns={columns}
              onRow={(record) => ({
                onClick: () => handleRowClick(record),
              })}
              data={tpsData}
              pagination={{ pageSize: 5 }}
              scroll={{ x: 2500, y: 400 }} // Adjust the scroll properties as needed
            />
            </div>
          )}
        </Card>
          <Card bordered={false}>
            <div className="uploadfile pb-15 shadow-none">
              <Upload
                name="file"
                customRequest={handleUpload}
                beforeUpload={(file) => {
                  // Validation logic for file type if needed
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
            <Modal
              title={editMode ? "Edit TP" : "Create New TP"}
              visible={showCreateModal}
              width={800} // Adjust the width here as needed

              onCancel={() => {
                setShowCreateModal(false);
                setEditData(null);
              }}
              footer={null}
            >

              {editMode ? (
                <EditTp
                  formData={editData}
                  setFormData={editData}
                  closeModal={() => setShowCreateModal(false)}
                  refetchData={refetchData}
                  width={800} // Adjust the width here as needed

                />
              ) : <CreateTp
                formData={editData}
                setFormData={setEditData}
                closeModal={() => setShowCreateModal(false)}
                refetchData={refetchData}
              />}


            </Modal>
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
    style={{ height: "500px", overflow: "auto" }}
    headStyle={{ position: 'sticky', top: '0', zIndex: '1', background: '#fff' }}

    extra={
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Button type="link" onClick={handleCloseDetails} style={{ color: 'red' }}>   Close
</Button>
        </div>
        <div style={{ textAlign: 'center', alignSelf: 'center' }}>
  <Button type="link" onClick={() => history.push(`/tpDetails/${selectedRow.id}`)} style={{ color: 'green' }}>
Details  </Button>
</div>
      </div>
    }
  >
    <p>RFP No: {selectedRow.rfpNo}</p>
    <div>
      {selectedRow.content && selectedRow.content.split("\n\n").map((paragraph, index) => (
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
   

  </Card>
</TabPane>
<TabPane tab="File Preview" key="2">
<Card bordered={false} className="header-solid h-full">
            <h4>TP Preview:</h4>
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
    </div>
  );
}

export default TpList;
