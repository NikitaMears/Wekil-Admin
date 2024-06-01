import React, { useState, useEffect } from 'react';
import { Table, Typography, message } from 'antd';
import { NavLink } from "react-router-dom";
import useFetchWithToken from '../../services/api';
import { useHistory } from 'react-router-dom';

const { Text } = Typography;

const CvList = ({rfpId}) => {
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useFetchWithToken("rfps");
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
        const response = await fetch(`https://kmsbe.frontieri.com/kmsApi/rfpsCvs/${rfpId}`, {  headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },});
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
        }
        setLoading(false);
      }
    };

    fetchData();
  }, [rfpId]);

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const columns = [
    {
      title: 'Expert Name',
      dataIndex: 'expertName',
      key: 'expertName',
    },
   
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
    },
    {
      title: 'Research Interest',
      dataIndex: 'researchInterest',
      key: 'researchInterest',
    },
 

    {
      title: 'Price Average',
      dataIndex: 'priceAverage',
      key: 'priceAverage',
    },
    {
      title: 'Average Score',
      dataIndex: 'averagePoints',
      key: 'averagePoints',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <NavLink to={`/cvDetails/${record.id}`}>Details</NavLink>
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

export default CvList;
