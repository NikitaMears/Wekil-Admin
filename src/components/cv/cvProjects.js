import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Select, Input, message, Row, Col, Tooltip } from 'antd';
import useFetchWithToken from '../../services/api'; // Import the useFetchWithToken hook
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const { Option } = Select;

const CvProjects = ({ cvId }) => {
  const [projects, setProjects] = useState([]);
  const [cvProjects, setCVProjects] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [points, setPoints] = useState('');
  const [position, setPosition] = useState('');
  const history = useHistory();

  const { data: allProjects, loading, error, token } = useFetchWithToken('projects'); // Fetch all projects using useFetchWithToken hook
  const { data: allCVProjects } = useFetchWithToken(`cvProjects/${cvId}`); // Fetch all CV projects using useFetchWithToken hook
  const { postData } = useFetchWithToken('cvProjects2');

  useEffect(() => {
    if (allProjects) {
      setProjects(allProjects);
    }
  }, [allProjects]);

  useEffect(() => {
    if (allCVProjects) {
      setCVProjects(allCVProjects);
    }
  }, [allCVProjects]);

  const handleAddProject = () => {
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleOk = () => {
    setModalVisible(false);
  };

  const handleProjectChange = (value) => {
    setSelectedProject(value);
  };

  const handlePointsChange = (e) => {
    setPoints(e.target.value);
  };
  const handlePositionChange = (e) => {
    setPosition(e.target.value);
  };
  const onFinish = async (values) => {
    try {
      // Calculate the average of the form values
      const knowledgeOfWork = parseInt(values.knowledgeOfWork);
      const qualityOfWork = parseInt(values.qualityOfWork);
      const meetingDeadline = parseInt(values.meetingDeadline);
      const planning = parseInt(values.planning);
      const decisionMaking = parseInt(values.decisionMaking);
  
      // Calculate the average of the form values
      const average = (knowledgeOfWork + qualityOfWork + meetingDeadline + planning + decisionMaking) / 5;
  
      console.log(average)
      // Send data to the /cvProjects endpoint
      const data = { 
        cvId: cvId, 
        projectId: values.project, 
        points: average, 
        position: values.position, 
        qualityOfWork: values.qualityOfWork, 
        decisionMaking: values.decisionMaking, 
        planning: values.planning, 
        knowledgeOfWork: values.knowledgeOfWork, 
        meetingDeadline: values.meetingDeadline 
      };
      
      // Assuming axios is imported as axios
      await axios.post('https://kmsbe.frontieri.com/kmsApi/cvProjects2', data, {  headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },});
  
      // Display success message and close the modal
      message.success('Project associated successfully!');
      setModalVisible(false);
    } catch (error) {
      if (error.response && error.response.status === 401 || error.response.status === 403) {
        // Redirect to login page if status code is 401
        history.push('/login');
        message.error("Session expired. Please login again.");

      } else {
        message.error("Unable to load data!");
      }    
      //  message.error('Failed to associate project. Please try again.');
    }
  };
  
  

  const columns = [


    // { title: 'Project Title', dataIndex: ['associatedProjectInfo', 'title'], key: 'title' },

    {
      title: 'Project Title',
      dataIndex: ['associatedProjectInfo', 'title'],      key: 'title',
      render: (text) => <Tooltip title={text}>{text.length > 15 ? `${text.substring(0, 30)}...` : text}</Tooltip>
    },
    { title: 'Position', dataIndex: ['cvProjectInfo', 'position'], key: 'position' },
    { title: 'Knowledge', dataIndex: ['cvProjectInfo', 'knowledgeOfWork'], key: 'knowledgeOfWork' },

    { title: 'Quality', dataIndex: ['cvProjectInfo', 'qualityOfWork'], key: 'qualityOfWork' },
    { title: 'Deadline', dataIndex: ['cvProjectInfo', 'meetingDeadline'], key: 'meetingDeadline' },
    { title: 'Availablity', dataIndex: ['cvProjectInfo', 'decisionMaking'], key: 'decisionMaking' },

    { title: 'Affordablity', dataIndex: ['cvProjectInfo', 'planning'], key: 'planning' },

    { title: 'Average', dataIndex: ['cvProjectInfo', 'points'], key: 'points' },

  ];

  return (
    <div>
      <Button type="primary" onClick={handleAddProject}>
        Add Project Evaluation
      </Button>
      <Table dataSource={cvProjects} columns={columns} loading={loading} rowKey="ProjectId" />
      <Modal
        title="Add Project Evaluation"
        visible={modalVisible}
        footer = {false}
        onCancel={handleCancel}
        onOk={handleOk}
      >
        <Form onFinish={onFinish}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                label="Project"
                name="project"
                rules={[{ required: true, message: 'Please select a project' }]}
              >
                <Select style={{ width: '100%' }} onChange={handleProjectChange}>
                  {projects.map((project) => (
                    <Option key={project.id} value={project.id}>
                      {project.title}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Position"
                name="position"
                rules={[{ required: true, message: 'Please enter a Position' }]}
              >
                <Input onChange={handlePositionChange} value={position} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                label="Knowledge of Work"
                name="knowledgeOfWork"
                rules={[{ required: true, message: 'Please enter knowledge of work' }]}
              >
                <Input type="number" max={5} min={1} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Quality of Work"
                name="qualityOfWork"
                rules={[{ required: true, message: 'Please enter quality of work' }]}
              >
                <Input type="number" max={5} min={1} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                label="Meeting Deadline"
                name="meetingDeadline"
                rules={[{ required: true, message: 'Please enter meeting deadline' }]}
              >
                <Input type="number" max={5} min={1} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Affordablity"
                name="planning"
                rules={[{ required: true, message: 'Please enter Affordablity' }]}
              >
                <Input type="number" max={5} min={1} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                label="Availablity"
                name="decisionMaking"
                rules={[{ required: true, message: 'Please enter Availablity' }]}
              >
                <Input type="number" max={5} min={1} />
              </Form.Item>
            </Col>
         
          </Row>
          <Form.Item>
            <Button type="primary" htmlType="submit">
Save            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CvProjects;
