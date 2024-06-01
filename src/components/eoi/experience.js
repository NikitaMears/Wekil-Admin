import React, { useState, useEffect } from 'react';
import { Table,message, Typography, Tooltip, Button,  } from 'antd';
import { NavLink } from "react-router-dom";
import { PlusOutlined,SearchOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined , ToTopOutlined, DownOutlined} from '@ant-design/icons';
import useFetchWithToken from "../../services/api";
import { useHistory } from 'react-router-dom';

const { Text } = Typography;

const ExperienceList = ({rfpId}) => {
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const {  token } = useFetchWithToken("eois");
  const history = useHistory();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from the API
        const response = await fetch(`https://kmsbe.frontieri.com/kmsApi/eoisFirmExperiences/${rfpId}`,{
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setCvs(data);
        setLoading(false);
        setPagination(prevState => ({ ...prevState, total: data.length }));
      } catch (error) {
        if (error.response && error.response.status === 401 || error.response.status === 403) {
          // Redirect to login page if status code is 401
          history.push('/login');
          message.error("Session expired. Please login again.");
  
        } else {
          message.error("Unable to load data!");
        }        setLoading(false);
      }
    };

    fetchData();
  }, [rfpId]);

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text) => <Tooltip title={text}>{text.length > 20 ? `${text.substring(0, 10)}...` : text}</Tooltip>
    },
    {
      title: 'Client',
      dataIndex: 'client',
      key: 'client',
      render: (text) => <Tooltip title={text}>{text.length > 50 ? `${text.substring(0, 10)}...` : text}</Tooltip>
    },
    { title: 'Sector', dataIndex: 'sector', key: 'sector',     
  },
    { title: 'Worth', dataIndex: 'worth', key: 'worth',    },
    { title: 'Duration', dataIndex: 'duration', key: 'duration'  },
    { title: 'Project Type', dataIndex: 'projectType', key: 'projectType' },
    {
      title: 'Summary',
      dataIndex: 'summary',
      key: 'summary',
      render: (text) => <Tooltip title={text}>{text.length > 50 ? `${text.substring(0, 10)}...` : text}</Tooltip>
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          {/* <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDeleteProject(record.id)} style={{ marginRight: 8 }}>Delete</Button> */}
          <Button type="link"><NavLink to={`/firmExperienceDetails/${record.id}`} style={{ color: 'green' }}><InfoCircleOutlined /> &nbsp;Details</NavLink></Button>
        </>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={cvs}
      rowKey="id"
      pagination={pagination}
      loading={loading}
      onChange={handleTableChange}
    />
  );
};

export default ExperienceList;
