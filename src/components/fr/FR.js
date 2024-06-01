import React, { useState , useEffect} from 'react';
import { Card, Row, Col, message,Input,Tabs, Button, Table, Modal,Upload , Checkbox, Dropdown, Tooltip, Spin} from 'antd';
import { PlusOutlined,SearchOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined , ToTopOutlined, DownOutlined} from '@ant-design/icons';
import FRForm from './frForm'; // Import the ProjectForm component
import useFetchWithToken from '../../services/api';
import { NavLink } from "react-router-dom";
import axios from 'axios';
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
const FR = () => {
  const [irModalVisible, setProjectModalVisible] = useState(false);
  const [formData, setFormData] = useState({});
  const { data: cvData,postFormData, token } = useFetchWithToken("frs");
  const [uploading, setUploading] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([]); // Add state for selected columns
  const defaultSelectedColumns = [ 'title', 'rfpNo',  'content', 'actions']; // Default selected columns
  const [frData, setFrData, error, refetchData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRowDetails, setSelectedRowDetails] = useState(null); // State to hold selected row details
  const [selectedRow, setSelectedRow] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const history = useHistory();
  const docs2 = [
    { uri: "https://docs.google.com/document/d/1t2StJhOXyeoS5KdycPLgdyUoHRilRNxB/export?format=docx", fileType:"docx", fileName:"demo.docx" },
  //  { uri: require("./example-files/pdf.pdf") }, // Local File
  ];

  useEffect(() => {
    setSelectedColumns(defaultSelectedColumns);
  }, []);
  useEffect(() => {
    fetchData(); // Fetch data when component mounts
  }, []);
  const handleAddProject = () => {
    setFormData({});
    setProjectModalVisible(true);
  };
  const handleRowClick = (record) => {
    setSelectedRow(record);
    setDetailsVisible(true);
  };
  const handleCloseDetails = () => {
    setSelectedRow(null);
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => confirm()}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          icon={<SearchOutlined />}
          size="small"
          onClick={() => confirm()}
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button size="small" onClick={() => clearFilters()} style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) => {
      const recordValue = record[dataIndex];
      return recordValue ? recordValue.toString().toLowerCase().includes(value.toLowerCase()) : false;
    }
  });
  
  const handleUpload = async ({ file }) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      // Use the postFormData function to upload the file
      await postFormData(formData, 'uploadFr');

      // Handle successful upload
      message.success(`${file.name} uploaded successfully`);
      refetchData()
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
  
  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await axios.get("https://kmsbe.frontieri.com/kmsApi/frs", { headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },});
      setFrData(response.data);
      setLoading(false)

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
      const response = await axios.post(
        'https://kmsbe.frontieri.com/kmsApi/frs/search', 
        { query: searchQuery }, // this is the request body
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Search Results:', response.data);
      setFrData(response.data); // Handle search results here
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  const irColumns = [
    // { title: 'ID', dataIndex: 'id', key: 'id' },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      ...getColumnSearchProps('title'),
      width: 200,
      render: (text) => <Tooltip title={text}>{text.length > 150 ? `${text.substring(0, 150)}...` : text}</Tooltip>
    },
    // {
    //   title: 'RFP No.',
    //   dataIndex: 'rfpNo',
    //   key: 'rfpNo',
    //   ...getColumnSearchProps('rfpNo'),
    //   render: (text) => <Tooltip title={text}>{text.length > 15 ? `${text.substring(0, 30)}...` : text}</Tooltip>
    // },
    {
      title: 'Content',
      dataIndex: 'content',
      key: 'content',
      width: 150,
      ...getColumnSearchProps('content'),
      render: (text) => {
        const truncatedText = text.length > 100 ? `${text.substring(0, 100)}...` : text;
        return highlightMatchedText(truncatedText, searchQuery);
      },
    },
    
    {
      title: 'Actions',
      key: 'actions',
      width: 100,

      render: (_, record) => (
        <>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEditProject(record)} style={{ marginRight: 8 }}>Edit</Button>
          <Button type="link"><NavLink to={`/frDetails/${record.id}`} style={{ color: 'green' }}><InfoCircleOutlined /> &nbsp;Details</NavLink></Button>
          {/* <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDeleteProject(record.id)} style={{ marginRight */}
          {/* Return any additional actions/buttons */}
        </>
      ),
    },
  ];
  const handleEditProject = (record) => {
    setFormData(record);
    setProjectModalVisible(true);
  };

  const handleDeleteProject = (irId) => {
    // Implement deletion logic
  };

  const closeModal = () => {
    setProjectModalVisible(false);
  };

  // const irColumns = [
  //   { title: 'ID', dataIndex: 'id', key: 'id' },
  //   {
  //     title: 'Title',
  //     dataIndex: 'title',
  //     key: 'title',
  //     ...getColumnSearchProps('title'),
  //     render: (text) => <Tooltip title={text}>{text.length > 50 ? `${text.substring(0, 50)}...` : text}</Tooltip>
  //   },
  //   {
  //     title: 'RFP No.',
  //     dataIndex: 'rfpNo',
  //     key: 'rfpNo',
  //     ...getColumnSearchProps('rfpNo'),
  //     render: (text) => <Tooltip title={text}>{text.length > 50 ? `${text.substring(0, 20)}...` : text}</Tooltip>
  //   },
  //     {
  //     title: 'Content',
  //     dataIndex: 'content',
  //     key: 'content',
  //     ...getColumnSearchProps('content'),
  //     render: (text) => <Tooltip title={text}>{text.length > 50 ? `${text.substring(0, 50)}...` : text}</Tooltip>
  //   },
  //   {
  //     title: 'Actions',
  //     key: 'actions',
  //     render: (_, record) => (
  //       <>
  //         <Button type="link" icon={<EditOutlined />} onClick={() => handleEditProject(record)} style={{ marginRight: 8 }}>Edit</Button>
  //         {/* <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDeleteProject(record.id)} style={{ marginRight: 8 }}>Delete</Button> */}
  //         <Button type="link"><NavLink to={`/irDetails/${record.id}`} style={{ color: 'green' }}><InfoCircleOutlined /> &nbsp;Details</NavLink></Button>
  //       </>
  //     ),
  //   },
  // ];
  const ColumnSelector = () => (
    <Checkbox.Group
      options={irColumns.map(column => ({ label: column.title, value: column.key }))}
      value={selectedColumns}
      onChange={(selected) => setSelectedColumns(selected)}
    />
  );
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
        <div style={{ overflowX: 'auto' }}>

        <Table
          columns={filteredColumns}
          dataSource={data}
          pagination={{ pageSize: 5 }}
          className="ant-border-space"
          scroll={{ x: 2500, y: 400 }} // Adjust the scroll properties as needed

          onRow={onRow} // Pass the onRow prop to the Table component
        />
        </div>
      </>
    );
  };
  return (
    <div>
      <Card>
      <Row gutter={[24, 0]}>
        {/* <Col span={12}>
          <Button type="primary" onClick={() => setProjectModalVisible(true)}>Add FR</Button>
        </Col> */}
        <Col span={12}>
          <Search
            placeholder="Search FR"
            allowClear
            enterButton={<SearchOutlined />}
            onSearch={handleSearch}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </Col>
      </Row>
        <Row gutter={[16, 16]}>
        
          
        <Col xs={24} xl={selectedRow ? 12 : 24}>
            {error && <div>Error: {error}</div>}
            {loading ? (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Spin size="large" />
          </div>
            ) : (
              <DynamicTable onRow={(record) => ({
                onClick: () => handleRowClick(record),
              })} columns={irColumns} data={frData} pagination={{ pageSize: 5 }}  />

              // <Table dataSource={frData} columns={irColumns} pagination={{ pageSize: 5 }} />
            )}
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
  <Button type="link" onClick={() => history.push(`/irDetails/${selectedRow.id}`)} style={{ color: 'green' }}>
Details  </Button>
</div>
      </div>
    }
  >
    <p>RFP No: {selectedRow.rfpNo}</p>
    <div>
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

    </div>
   

  </Card>
</TabPane>
<TabPane tab="File Preview" key="2">
<Card bordered={false} className="header-solid h-full">
            <h4>FR Preview:</h4>
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
      </Card>
      <Card bordered={false}>
            <div className="uploadfile pb-15 shadow-none">
            <Upload
  name="file"
  customRequest={handleUpload}
  beforeUpload={(file) => {
    const isDocOrDocx =
      file.type === "application/msword" || // for .doc
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"; // for .docx
    if (!isDocOrDocx) {
      message.error("You can only upload Word files!");
    }
    return isDocOrDocx;
  }}
>

                <Button type="dashed" className="ant-full-box" icon={<ToTopOutlined />} loading={uploading}>
                  Click to Upload
                </Button>
              </Upload>
            </div>
          </Card>

      <Modal
        title={formData.id ? 'Edit FR' : 'Add FR'}
        visible={irModalVisible}
        onCancel={() => setProjectModalVisible(false)}
        footer={null}
        width={800} // Adjust the width here as needed

      >
        {/* Make sure refetchData is passed as a prop */}
        <FRForm formData={formData} setFormData={setFormData} closeModal={closeModal} refetchData={refetchData} />
      </Modal>
    </div>
  );
};

export default FR;
