import React, { useState , useEffect} from 'react';
import { Card, Row, Col, message,Input, Button, Table, Modal,Upload , Checkbox, Dropdown, Tooltip, Spin} from 'antd';
import { PlusOutlined,SearchOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined , ToTopOutlined, DownOutlined} from '@ant-design/icons';
import ProjectForm from './projectForm'; // Import the ProjectForm component
import useFetchWithToken from '../../services/api';
import { NavLink } from "react-router-dom";
const { Search } = Input;

const FirmExperience = () => {
  const [projectModalVisible, setProjectModalVisible] = useState(false);
  const [formData, setFormData] = useState({});
  const { data: projectData, loading, error, refetchData } = useFetchWithToken('projects');
  const { data: cvData,postFormData } = useFetchWithToken("cvs");
  const [uploading, setUploading] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([]); // Add state for selected columns
  const defaultSelectedColumns = [ 'title', 'client',  'worth',  'projectType', 'actions']; // Default selected columns

  useEffect(() => {
    setSelectedColumns(defaultSelectedColumns);
  }, []);
  const handleAddProject = () => {
    setFormData({});
    setProjectModalVisible(true);
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
      await postFormData(formData, 'uploadFirmExperience');

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
  
  const handleEditProject = (record) => {
    setFormData(record);
    setProjectModalVisible(true);
  };

  const handleDeleteProject = (projectId) => {
    // Implement deletion logic
  };

  const closeModal = () => {
    setProjectModalVisible(false);
  };

  const projectColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: 500,
      ...getColumnSearchProps('title'),
      render: (text) => <Tooltip title={text}>{text.length > 200 ? `${text.substring(0, 200)}...` : text}</Tooltip>
    },
    {
      title: 'Client',
      dataIndex: 'client',
      key: 'client',
      width: 300,
      ...getColumnSearchProps('client'),
      render: (text) => <Tooltip title={text}>{text.length > 500 ? `${text.substring(0, 300)}...` : text}</Tooltip>
    },
    { title: 'Sector', dataIndex: 'sector', key: 'sector', width: 500,      ...getColumnSearchProps('sector'),
  },
    { title: 'Worth', dataIndex: 'worth', key: 'worth',width: 500,   ...getColumnSearchProps('worth') },
    { title: 'Duration', dataIndex: 'duration', key: 'duration' ,width: 300, ...getColumnSearchProps('duration') },
    { title: 'Project Type', dataIndex: 'projectType', key: 'projectType', width: 300,  ...getColumnSearchProps('projectType') },
    {
      title: 'Summary',
      dataIndex: 'summary',
      key: 'summary',
      ...getColumnSearchProps('summary'),
      render: (text) => <Tooltip title={text}>{text.length > 50 ? `${text.substring(0, 10)}...` : text}</Tooltip>
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEditProject(record)} style={{ marginRight: 8 }}>Edit</Button>
          {/* <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDeleteProject(record.id)} style={{ marginRight: 8 }}>Delete</Button> */}
          <Button type="link"><NavLink to={`/firmExperienceDetails/${record.id}`} style={{ color: 'green' }}><InfoCircleOutlined /> &nbsp;Details</NavLink></Button>
        </>
      ),
    },
  ];
  const ColumnSelector = () => (
    <Checkbox.Group
      options={projectColumns.map(column => ({ label: column.title, value: column.key }))}
      value={selectedColumns}
      onChange={(selected) => setSelectedColumns(selected)}
    />
  );
  const DynamicTable = ({ data }) => {
    const filteredColumns = projectColumns.filter(column => selectedColumns.includes(column.key));
    return (
      <>
        <Dropdown overlay={<ColumnSelector />} trigger={["click"]}>
          <Button>Select Columns <DownOutlined /></Button>
        </Dropdown>
        <Table columns={filteredColumns} dataSource={data} pagination={{ pageSize: 5 }} />
      </>
    );
  };

  return (
    <div>
      <Card>
        <Row gutter={[16, 16]}>
          {/* <Col span={12}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddProject}>
              Add Firm Experience
            </Button>
          </Col> */}
          
          <Col span={24}>
            {error && <div>Error: {error}</div>}
            {loading ? (
  <div style={{ textAlign: 'center', marginTop: '20px' }}>
  <Spin size="large" />
</div>              ) : (
            <div style={{ overflowX: 'auto' }}>

              <DynamicTable data={projectData} pagination={{ pageSize: 5 }}                 scroll={{ x: 2500, y: 400 }} // Adjust the scroll properties as needed
 />

            </div>)}
          </Col>
        </Row>
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

      <Modal
        title={formData.id ? 'Edit Firm Experience' : 'Add Firm Experience'}
        visible={projectModalVisible}
        onCancel={() => setProjectModalVisible(false)}
        footer={null}
        width={800} // Adjust the width here as needed

      >
        {/* Make sure refetchData is passed as a prop */}
        <ProjectForm formData={formData} setFormData={setFormData} closeModal={closeModal} refetchData={refetchData} />
      </Modal>
    </div>
  );
};

export default FirmExperience;
