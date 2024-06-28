import { useState, useEffect, useMemo } from 'react';
import { Card, Col, Row, Typography, Table, Tooltip, Select, DatePicker, Radio, Modal, Checkbox } from 'antd';
import html2canvas from 'html2canvas';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { DashboardOutlined, UserOutlined, ExportOutlined, FileTextOutlined, FileDoneOutlined, DeploymentUnitOutlined } from '@ant-design/icons';
import React from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, ImageRun } from 'docx';
import fileDownload from 'js-file-download';

Chart.register(...registerables);
const { RangePicker } = DatePicker;
const { Option } = Select;

const dummyData = {
  counts: {
    userCount: 100,
    driverCount: 150,
    tripCount: 200,
    passngerCount: 250,
   
  },
  timeSeriesData: {
    Drivers: [
      { date: '2023-01-01', count: 5 },
      { date: '2023-02-01', count: 10 },
    ],
    Passengers: [
      { date: '2023-01-01', count: 15 },
      { date: '2023-02-01', count: 20 },
    ],
    Trips: [
      { date: '2023-01-01', count: 25 },
      { date: '2023-02-01', count: 30 },
    ],
  
  },
  tpByMonth: {
    '2023-01': [
      { date: '2023-01-01', client: 'Client A', count: 5 },
      { date: '2023-01-15', client: 'Client B', count: 10 },
    ],
    '2023-02': [
      { date: '2023-02-01', client: 'Client A', count: 15 },
      { date: '2023-02-15', client: 'Client B', count: 20 },
    ],
  },
  tpByTeam: {
    '2023-01': [
      { date: '2023-01-01', teamName: 'Team A', count: 5 },
      { date: '2023-01-15', teamName: 'Team B', count: 10 },
    ],
    '2023-02': [
      { date: '2023-02-01', teamName: 'Team A', count: 15 },
      { date: '2023-02-15', teamName: 'Team B', count: 20 },
    ],
  },
  rfpByTeamMember: {
    '2023-01': [
      { date: '2023-01-01', firstName: 'John', count: 5 },
      { date: '2023-01-15', firstName: 'Doe', count: 10 },
    ],
    '2023-02': [
      { date: '2023-02-01', firstName: 'John', count: 15 },
      { date: '2023-02-15', firstName: 'Doe', count: 20 },
    ],
  },
  Passengersummary: [
    { No: 1, Client: 'Client A', NoofPassengersubmitted: 5, AverageValue: 100 },
    { No: 2, Client: 'Client B', NoofPassengersubmitted: 10, AverageValue: 200 },
  ],
  averageOfferingValue: 150,
};

const ChartWithDatePicker = ({ title, dataKey, data, memoizedGetChartData }) => {
  const [chartType, setChartType] = useState('Bar');
  const [modalVisible, setModalVisible] = useState(false);
  const [includeTitle, setIncludeTitle] = useState(true);
  const [includeDatePicker, setIncludeDatePicker] = useState(true);
  const [exportOption, setExportOption] = useState("excel");

  const handleChartTypeChange = (value) => {
    setChartType(value);
  };

  const handleExportChart = async (divId, chartTitle) => {
    const div = document.getElementById(divId);
    const exportButton = div.querySelector('.export-icon');
    const titleElement = div.querySelector('h2');
    const datePickers = div.querySelectorAll('.ant-picker');

    if (exportButton) exportButton.style.display = 'none';
    if (titleElement && !includeTitle) titleElement.style.display = 'none';
    if (datePickers && !includeDatePicker) datePickers.forEach(picker => picker.style.display = 'none');

    const canvas = await html2canvas(div);

    if (exportButton) exportButton.style.display = 'block';
    if (titleElement && !includeTitle) titleElement.style.display = 'block';
    if (datePickers && !includeDatePicker) datePickers.forEach(picker => picker.style.display = 'block');

    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = `${chartTitle}.png`;
    link.click();
  };

  const handleExportToExcel = () => {
    const excelData = data.map(item => [item.date, item.count]);
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([['Date', 'Count'], ...excelData]);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'data.xlsx');
  };

  const handleExportToWord = () => {
    let htmlTable = '<table><thead><tr><th>Date</th><th>Count</th></tr></thead><tbody>';
    data.forEach(item => {
      htmlTable += `<tr><td>${item.date}</td><td>${item.count}</td></tr>`;
    });
    htmlTable += '</tbody></table>';
    const blob = new Blob(['<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>' + htmlTable + '</body></html>'], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'data.docx';
    link.click();
  };

  const handleExport = () => {
    setModalVisible(false);
    switch (exportOption) {
      case 'excel':
        handleExportToExcel();
        break;
      case 'word':
        handleExportToWord();
        break;
      case 'image':
        handleExportChart(`div-${dataKey}`, title);
        break;
      default:
        break;
    }
  };

  let ChartComponent;
  switch (chartType) {
    case 'Line':
      ChartComponent = Line;
      break;
    case 'Pie':
      ChartComponent = Pie;
      break;
    case 'Doughnut':
      ChartComponent = Doughnut;
      break;
    case 'Bar':
    default:
      ChartComponent = Bar;
      break;
  }

  return (
    <Col xs={24} sm={24} md={12} lg={12} xl={10} className="mb-24">
      <Card bordered={false} className="criclebox h-full">
        <div id={`div-${dataKey}`}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>{title}</h2>
            <div>
              <RangePicker />
              <Select defaultValue="Bar" style={{ width: 100, marginLeft: 10 }} onChange={handleChartTypeChange}>
                <Option value="Bar">Bar</Option>
                <Option value="Line">Line</Option>
                <Option value="Pie">Pie</Option>
                <Option value="Doughnut">Doughnut</Option>
              </Select>
              <ExportOutlined className="export-icon" style={{ marginLeft: 10 }} onClick={() => setModalVisible(true)} />
            </div>
          </div>
          {data && <ChartComponent data={memoizedGetChartData(data)} options={{ maintainAspectRatio: true }} />}
        </div>
      </Card>
      <Modal
        title="Export Options"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleExport}
      >
        <Checkbox checked={includeTitle} onChange={(e) => setIncludeTitle(e.target.checked)}>Include Title</Checkbox>
        <Checkbox checked={includeDatePicker} onChange={(e) => setIncludeDatePicker(e.target.checked)}>Include Date Picker</Checkbox>
        <Radio.Group value={exportOption} onChange={(e) => setExportOption(e.target.value)}>
          <Radio value="excel">Export to Excel</Radio>
          <Radio value="word">Export to Word</Radio>
          <Radio value="image">Export as Image</Radio>
        </Radio.Group>
      </Modal>
    </Col>
  );
};

function Home() {
  const { Title } = Typography;
  const [counts, setCounts] = useState(dummyData.counts);
  const [allTimeSeriesData, setAllTimeSeriesData] = useState(dummyData.timeSeriesData);
  const [tpByMonth, setTPByMonth] = useState(dummyData.tpByMonth);
  const [tpByTeam, setTPByTeam] = useState(dummyData.tpByTeam);
  const [rfpByTeamMember, setRfpByTeamMember] = useState(dummyData.rfpByTeamMember);
  const [Passengersummary, setPassengersummary] = useState(dummyData.Passengersummary);
  const [averageOfferingValue, setAverageOfferingValue] = useState(dummyData.averageOfferingValue);
  const [chartType, setChartType] = useState('Bar');
  const [modalVisible, setModalVisible] = useState(false);
  const [includeTitle, setIncludeTitle] = useState(true);
  const [includeDatePicker, setIncludeDatePicker] = useState(true);
  const [exportOption, setExportOption] = useState("excel");

  const groupDataByMonth = (data) => {
    const groupedData = {};
    data.forEach((entry) => {
      if (!groupedData[entry.date]) {
        groupedData[entry.date] = [];
      }
      groupedData[entry.date].push({ client: entry.client, count: parseInt(entry.count) });
    });
    return groupedData;
  };

  const groupDataByMonthTeam = (data) => {
    const groupedData = {};
    data.forEach((entry) => {
      const { date, teamName, count } = entry;
      if (!groupedData[date]) {
        groupedData[date] = {};
      }
      if (!groupedData[date][teamName]) {
        groupedData[date][teamName] = parseInt(count);
      } else {
        groupedData[date][teamName] += parseInt(count);
      }
    });
    return groupedData;
  };

  const groupDataByMonthTeamMember = (data) => {
    const groupedData = {};
    data.forEach((entry) => {
      const { date, firstName, count } = entry;
      if (!groupedData[date]) {
        groupedData[date] = {};
      }
      if (!groupedData[date][firstName]) {
        groupedData[date][firstName] = parseInt(count);
      } else {
        groupedData[date][firstName] += parseInt(count);
      }
    });
    return groupedData;
  };

  const getChartData = (data) => {
    return {
      labels: data.map((entry) => entry.date),
      datasets: [
        {
          label: 'Count',
          backgroundColor: '#470c8c',
          borderColor: 'rgba(75,192,192,1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(75,192,192,0.6)',
          hoverBorderColor: 'rgba(75,192,192,1)',
          data: data.map((entry) => entry.count),
        },
      ],
    };
  };

  const getChartDataForTPByClient = (data) => {
    const predefinedColors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#8D6E63', '#66BB6A', '#AB47BC',
      '#EC407A', '#42A5F5', '#26C6DA', '#7E57C2', '#26A69A', '#D4E157',
      '#5C6BC0', '#7CB342', '#F06292', '#9575CD', '#64B5F6', '#81C784',
      '#E57373', '#5C6BC0', '#7CB342', '#F06292', '#9575CD', '#64B5F6'
    ];

    const datasets = [];
    const clients = new Set();
    Object.values(data).forEach((monthData) => {
      monthData.forEach((entry) => {
        clients.add(entry.client);
      });
    });

    clients.forEach((client, index) => {
      const dataPoints = [];
      const color = predefinedColors[index % predefinedColors.length];
      Object.entries(data).forEach(([month, monthData]) => {
        const clientData = monthData.find((entry) => entry.client === client);
        dataPoints.push(clientData ? clientData.count : 0);
      });
      datasets.push({
        label: client,
        backgroundColor: color,
        borderColor: color,
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75,192,192,0.6)',
        hoverBorderColor: color,
        data: dataPoints,
      });
    });

    return {
      labels: Object.keys(data),
      datasets,
    };
  };

  const getChartDataForTPByTeam = (data) => {
    const predefinedColors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#8D6E63', '#66BB6A', '#AB47BC',
      '#EC407A', '#42A5F5', '#26C6DA', '#7E57C2', '#26A69A', '#D4E157',
      '#5C6BC0', '#7CB342', '#F06292', '#9575CD', '#64B5F6', '#81C784',
      '#E57373', '#5C6BC0', '#7CB342', '#F06292', '#9575CD', '#64B5F6'
    ];

    const datasets = [];
    const teams = new Set();
    Object.values(data).forEach((monthData) => {
      Object.keys(monthData).forEach((teamName) => {
        teams.add(teamName);
      });
    });

    teams.forEach((teamName, index) => {
      const dataPoints = [];
      const color = predefinedColors[index % predefinedColors.length];
      Object.entries(data).forEach(([month, monthData]) => {
        dataPoints.push(monthData[teamName] || 0);
      });
      datasets.push({
        label: teamName,
        backgroundColor: color,
        borderColor: color,
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75,192,192,0.6)',
        hoverBorderColor: color,
        data: dataPoints,
      });
    });

    return {
      labels: Object.keys(data),
      datasets,
    };
  };

  const getChartDataForRFPByTeamMember = (data) => {
    const predefinedColors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#8D6E63', '#66BB6A', '#AB47BC',
      '#EC407A', '#42A5F5', '#26C6DA', '#7E57C2', '#26A69A', '#D4E157',
      '#5C6BC0', '#7CB342', '#F06292', '#9575CD', '#64B5F6', '#81C784',
      '#E57373', '#5C6BC0', '#7CB342', '#F06292', '#9575CD', '#64B5F6'
    ];

    const datasets = [];
    const teams = new Set();
    Object.values(data).forEach((monthData) => {
      Object.keys(monthData).forEach((firstName) => {
        teams.add(firstName);
      });
    });

    teams.forEach((firstName, index) => {
      const dataPoints = [];
      const color = predefinedColors[index % predefinedColors.length];
      Object.entries(data).forEach(([month, monthData]) => {
        dataPoints.push(monthData[firstName] || 0);
      });
      datasets.push({
        label: firstName,
        backgroundColor: color,
        borderColor: color,
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75,192,192,0.6)',
        hoverBorderColor: color,
        data: dataPoints,
      });
    });

    return {
      labels: Object.keys(data),
      datasets,
    };
  };

  const memoizedGetChartData = useMemo(() => getChartData, []);
  const memoizedGetChartDataForTPByClient = useMemo(() => getChartDataForTPByClient, []);
  const memoizedGetChartDataForTPByTeam = useMemo(() => getChartDataForTPByTeam, []);
  const memoizedGetChartDataForRFPByTeamMember = useMemo(() => getChartDataForRFPByTeamMember, []);

  const columns = [
    { title: 'No', dataIndex: 'No', key: 'No' },
    { title: 'Client', dataIndex: 'Client', key: 'Client', render: (text) => <Tooltip title={text}>{text.length > 5 ? `${text.substring(0, 5)}...` : text}</Tooltip> },
    { title: 'No Of TP Submitted', dataIndex: 'NoofPassengersubmitted', key: 'NoofPassengersubmitted' },
    { title: 'Average Value', dataIndex: 'AverageValue', key: 'AverageValue' },
  ];

  const renderChart = (type, data) => {
    switch (type) {
      case 'Line':
        return <Line data={data} options={{ maintainAspectRatio: true }} />;
      case 'Doughnut':
        return <Doughnut data={data} options={{ maintainAspectRatio: true }} />;
      case 'Pie':
        return <Pie data={data} options={{ maintainAspectRatio: true }} />;
      case 'Bar':
      default:
        return <Bar data={data} options={{ maintainAspectRatio: true }} />;
    }
  };

  return (
    <div className="layout-content">
      <Row className="rowgap-vbox" gutter={[24, 0]}>
        {counts &&
          Object.keys(counts).map((key) => (
            <Col key={key} xs={24} sm={24} md={12} lg={6} xl={6} className="mb-24">
              <Card bordered={false} className="criclebox">
                <div className="number">
                  <Row align="middle" gutter={[24, 0]}>
                    <Col xs={6}>
                      <DashboardOutlined style={{ fontSize: '34px' }} />
                    </Col>
                    <Col xs={18}>
                      <span>{key}</span>
                      <Title level={3}>{counts[key]}</Title>
                    </Col>
                  </Row>
                </div>
              </Card>
            </Col>
          ))}
      </Row>
      <Row gutter={[24, 0]}>
        {allTimeSeriesData && (
          <>
            <ChartWithDatePicker
              title="Drivers"
              dataKey="Drivers"
              data={allTimeSeriesData.Drivers}
              memoizedGetChartData={memoizedGetChartData}
            />
            <ChartWithDatePicker
              title="Passengers"
              dataKey="Passengers"
              data={allTimeSeriesData.Passengers}
              memoizedGetChartData={memoizedGetChartData}
            />
            <ChartWithDatePicker
              title="Trips"
              dataKey="Trips"
              data={allTimeSeriesData.Trips}
              memoizedGetChartData={memoizedGetChartData}
            />
          
          </>
        )}
        {/* <Col xs={24} sm={24} md={12} lg={12} xl={10} className="mb-24">
          <Card bordered={false} title={'TP Summary'} className="criclebox h-full">
            <div>
              <Table
                columns={columns}
                dataSource={Passengersummary}
                rowKey="No"
                footer={() => (
                  <div>
                    <p><b>Average Offering Value: </b>{averageOfferingValue}</p>
                  </div>
                )}
              />
            </div>
          </Card>
        </Col> */}
      </Row>
   
    </div>
  );
}

export default Home;
