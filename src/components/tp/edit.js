import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, Row, Col, Upload, Steps, message , Table} from 'antd';
import { UploadOutlined, SearchOutlined } from '@ant-design/icons';
import useFetchWithToken from '../../services/api';
import { NavLink } from "react-router-dom";

const { Option } = Select;
const { Step } = Steps;

const EditTp = ({ formData, setFormData, closeModal, refetchData  }) => {
    console.log("9090",formData)
  const [form] = Form.useForm();
  const { data: rfps, loading: rfpsLoading, error: rfpsError, token } = useFetchWithToken('rfps');
  const {  putFormData } = useFetchWithToken('UploadTP');
  const { postData } = useFetchWithToken('tpMembers');
  // const id = formData.id;

  const [cvs, setCvs] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
  const [tpId, setTpId] = useState(null);

  useEffect(() => {
    const fetchCVs = async () => {
      try {
        const response = await fetch('https://kmsbe.frontieri.com/kmsApi/cvs', {   headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },});
        const data = await response.json();
       // setCvs(data);
   //     setFilteredDataSource(data);
      } catch (error) {
        console.error('Error fetching CVs:', error);
      }
    };

    fetchCVs();
  }, []);

  useEffect(() => {
    const filteredData = cvs.filter((cv) =>
      Object.values(cv).some((val) => typeof val === 'string' && val.toLowerCase().includes(searchText.toLowerCase()))
    );
    setFilteredDataSource(filteredData);
  }, [cvs, searchText]);
  useEffect(() => {
    form.setFieldsValue({
      ...formData,
    //  issuedOn: moment(formData.issuedOn)
    });
  }, [formData, form]);
  const onFinishTpDetails = async (values) => {
    try {
      await form.validateFields(); // Validate form fields
      const formDataWithFile = { ...values, file: values.file?.file };
      const response =     await putFormData(formDataWithFile, `UploadTP/${formData.id}`);
      console.log(response)
      setTpId(response.id)
      setCurrentStep(1); // Move to the next step
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const onFinishTeamMembers = async () => {
    try {
      const dataWithTeamMembers = {
        tpId: tpId, // Sample projectId
        teamMembers: selectedTeamMembers
      };
      await postData(dataWithTeamMembers);
      closeModal();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleRfpChange = async (value) => {
    try {
      const response = await fetch(`https://kmsbe.frontieri.com/kmsApi/rfpsCvs/${value}`,{   headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },});
      const data = await response.json();
      setCvs(data);
      form.setFieldsValue({
        client: rfps.find(rfp => rfp.id === value)?.client || '',
        client: rfps.find(rfp => rfp.id === value)?.client || '',

        client: rfps.find(rfp => rfp.id === value)?.client || '',

        year: rfps.find(rfp => rfp.id === value)?.issuedOn ? new Date(rfps.find(rfp => rfp.id === value)?.issuedOn).getFullYear() : '',
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const rowSelection = {
    selectedRowKeys: selectedTeamMembers.map(member => member.id),
    onChange: (selectedRowKeys) => {
      setSelectedTeamMembers(selectedRowKeys.map(id => ({ id, position: '' })));
    },
  };

  const onSearch = (value) => {
    setSearchText(value);
  };

  const columns = [
    {
      title: 'Expert Name',
      dataIndex: 'expertName',
      key: 'expertName',
      render: (text, record) => (
        <NavLink to={`/cvDetails/${record.id}`}>{record.expertName}</NavLink>
      ),
    },
    {
      title: 'Research Interest',
      dataIndex: 'researchInterest',
      key: 'researchInterest',
    },
    {
      title: 'Location',
      dataIndex: 'country',
      key: 'country',
    },
    {
      title: 'Position',
      key: 'position',
      render: (text, record) => (
        <Input
          style={{ width: '200px' }}
          value={selectedTeamMembers.find(member => member.id === record.id)?.position}
          onChange={(e) => {
            const updatedTeamMembers = [...selectedTeamMembers];
            const memberIndex = updatedTeamMembers.findIndex(member => member.id === record.id);
            updatedTeamMembers[memberIndex].position = e.target.value;
            setSelectedTeamMembers(updatedTeamMembers);
          }}
        />
      ),
    }
  ];

  return (
    <>
      <Steps current={currentStep} style={{ marginBottom: 16 }}>
        <Step title="TP Details" />
        <Step title="Team Members" />
      </Steps>
      <div className="steps-content">
        {currentStep === 0 ? (
          <Form form={form} onFinish={onFinishTpDetails} layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="RFP" name="rfpId" rules={[{ required: true, message: 'Please select an RFP' }]}>
                  <Select placeholder="Select RFP" loading={rfpsLoading} disabled={rfpsError} onChange={handleRfpChange}>
                    {rfps &&
                      rfps.map(rfp => (
                        <Option key={rfp.id} value={rfp.id}>
                          {rfp.title}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Please enter a Title' }]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Client" name="client" rules={[{ required: true, message: 'Please enter a Client' }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Year" name="year" rules={[{ required: true, message: 'Please enter a Year' }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Sector" name="sector" rules={[{ required: true, message: 'Please enter Sector' }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Objective" name="objectives" rules={[{ required: true, message: 'Please enter Objective' }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Specific Objective" name="specificObjectives" rules={[{ required: true, message: 'Please enter Specific Objective' }]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
            
              <Col span={12}>
                <Form.Item label="File" name="file" rules={[{ required: false, message: 'Please upload a file' }]}>
                  <Upload beforeUpload={() => false} name="file">
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item>
              <Button type="primary" htmlType="submit">Next</Button>
            </Form.Item>
          </Form>
        ) : (
          <div>
            <Input.Search
              placeholder="Search team members"
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={onSearch}
            />
            <Table
              dataSource={searchText ? filteredDataSource : cvs}
              columns={columns}
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: filteredDataSource.length,
                showTotal: false,
                size: 3,
                showLessItems: true,
                showSizeChanger: false,
                showQuickJumper: false,
                pageSizeOptions: false,
                responsive: true,
                onChange: setPagination,
              }}
              rowSelection={rowSelection}
              rowKey="id"
            />
            <Form.Item>
              <Button type="primary" htmlType="submit" onClick={onFinishTeamMembers}>Submit</Button>
            </Form.Item>
          </div>
        )}
      </div>
    </>
  );
};

export default EditTp;
