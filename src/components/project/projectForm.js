import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Row, Col, Upload, Checkbox, Table, Steps } from 'antd';
import { UploadOutlined, SearchOutlined } from '@ant-design/icons';
import useFetchWithToken from '../../services/api';
import { NavLink } from "react-router-dom";

const { Step } = Steps;

const ProjectForm = ({ formData, setFormData, closeModal }) => {
  const [form] = Form.useForm();
  const { postFormData } = useFetchWithToken('projects');
  const { postData, token } = useFetchWithToken('cvProjects');

  const [cvs, setCvs] = useState([]);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [projectId, setProjectId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    form.setFieldsValue(formData);
  }, [formData, form]);

  useEffect(() => {
    const fetchCVs = async () => {
      try {
        const response = await fetch('https://kmsbe.frontieri.com/kmsApi/cvs',{  headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },});
        const data = await response.json();
        setCvs(data);
        setFilteredDataSource(data);
        setLoading(false);
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

  const rowSelection = {
    selectedRowKeys: selectedTeamMembers.map(member => member.id),
    onChange: (selectedRowKeys) => {
      setSelectedTeamMembers(selectedRowKeys.map(id => ({ id, position: '' })));
    },
  };

  const onSearch = (value) => {
    setSearchText(value);
  };

  const onFinishProjectDetails = async (values) => {
    try {
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        if (key === 'file') {
          if (value && value[0]) {
            formData.append(key, value[0].originFileObj);
          }
        } else {
          formData.append(key, value);
        }
      });
      const formDataWithFile = { ...values, file: values.file?.file || formData.file };

      const response = await postFormData(formDataWithFile, 'uploadFirmExperience');
      setProjectId(response.id);
      setCurrentStep(1);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const addTeamMembers = async () => {
    try {
      const dataWithTeamMembers = {
        projectId: projectId,
        teamMembers: selectedTeamMembers
      };

      await postData(dataWithTeamMembers,'cvProjects');
      closeModal();
      setSubmitted(true);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (submitted) {
      setSubmitted(false);
      // Refetch data here
    }
  }, [submitted]);

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
  
  const teamMembersStep = (
    <Form
      form={form}
      layout="vertical"
      onFinish={addTeamMembers}
    >
      <Row gutter={16}>
        <Col span={12}>
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
        </Col>
      </Row>
      <Form.Item label="Selected Team Members" style={{ display: 'none' }}>
        <Checkbox.Group
          value={selectedTeamMembers.map(member => member.id)}
          onChange={(selectedRowKeys) => setSelectedTeamMembers(selectedRowKeys.map(id => ({ id, position: '' })))}
        >
          {cvs.map((member) => (
            <Checkbox key={member.id} value={member.id}>
              {member.expertName}
            </Checkbox>
          ))}
        </Checkbox.Group>
      </Form.Item>
      <Form.Item>
        {/* <Button type="primary" htmlType="submit">Save and Finish</Button> */}
      </Form.Item>
    </Form>
  );
  
  const saveAndFinish = () => {
    form.submit();
  };

  const prev = () => {
    addTeamMembers();
  };

  return (
    <>
      <Steps current={currentStep} style={{ marginBottom: 16 }}>
        <Step title="Project Details" />
        <Step title="Team Members" />
      </Steps>
      <div className="steps-content">
        {currentStep === 0 ? (
          <Form
            form={form}
            onFinish={onFinishProjectDetails}
            layout="vertical"
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Please enter a Title' }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Client" name="client" rules={[{ required: true, message: 'Please enter a Client' }]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Worth"  name="worth" rules={[{ required: true, message: 'Please enter Worth' }]}>
                  <Input type='number' min={0}/>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Project Type" name="projectType">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Duration" name="duration">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Summary" name="summary">
                  <Input.TextArea />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="File" name="file" rules={[{ required: true, message: 'Please upload a file' }]}>
                  <Upload beforeUpload={() => false} name="file">
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
            <Button type="primary" onClick={saveAndFinish}>Save and Continue</Button>
          </Form>
        ) : (
          loading ? <p>Loading...</p> : teamMembersStep
        )}
      </div>
      <div className="steps-action" style={{ textAlign: 'right' }}>
        {currentStep > 0 && (
          <Button style={{ marginRight: 8 }} onClick={prev}>
            Save and Finish
          </Button>
        )}
      </div>
    </>
  );
};

export default ProjectForm;
