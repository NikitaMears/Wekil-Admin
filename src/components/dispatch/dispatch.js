import React, { useState, useEffect, useRef } from "react";
import { Button, Input, Spin, Select, Card, Descriptions, Row, Col } from "antd";
import io from 'socket.io-client';
import axios from 'axios';
import { LoadScript, Autocomplete } from '@react-google-maps/api';

const { Option } = Select;

const Dispatch = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [accepted, setAccepted] = useState(null);
  const [fromPlace, setFromPlace] = useState("");
  const [toPlace, setToPlace] = useState("");
  const [fromCoords, setFromCoords] = useState({});
  const [toCoords, setToCoords] = useState({});
  const [passengers, setPassengers] = useState([]);
  const [selectedPassenger, setSelectedPassenger] = useState(null);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [selectedVehicleType, setSelectedVehicleType] = useState(null);

  const fromAutocompleteRef = useRef(null);
  const toAutocompleteRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const fetchPassengers = async () => {
      try {
        const res = await axios.get('http://194.164.72.21:5001/passengers');
        setPassengers(res.data);
      } catch (error) {
        console.error('Failed to fetch passengers', error);
      }
    };

    const fetchVehicleTypes = async () => {
      try {
        const res = await axios.get('http://194.164.72.21:5001/vehicleTypes');
        setVehicleTypes(res.data);
      } catch (error) {
        console.error('Failed to fetch vehicle types', error);
      }
    };

    fetchPassengers();
    fetchVehicleTypes();

    socketRef.current = io('http://194.164.72.21:3004');

    socketRef.current.on('requested', (data) => {
      console.log('Requested event received:', data);
      setResponse(data);
      setLoading(false);
    });

    socketRef.current.on('accepted', (data) => {
      console.log('Accepted event received:', data);
      setAccepted(data);
      setLoading(false);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const sendRequest = () => {
    setLoading(true);

    const requestData = {
      fromLat: String(fromCoords.lat),
      fromLon: String(fromCoords.lng),
      toLat: String(toCoords.lat),
      toLon: String(toCoords.lng),
      passengerId: String(selectedPassenger),
      vehicleTypeId: String(selectedVehicleType)
    };
    console.log('Sending request with data:', requestData);

    socketRef.current.emit('webRequest', requestData, (response) => {
      console.log('Server response:', response);
    });
  };

  const handlePlaceSelect = (autocomplete, setCoords, setPlace) => {
    const place = autocomplete.getPlace();
    const location = place.geometry.location;
    setCoords({
      lat: location.lat(),
      lng: location.lng()
    });
    setPlace(place.formatted_address);
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyBEnjVNXGgw757msw4v4Otk5nV9XYUOQCs" libraries={['places']}>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Row gutter={16} justify="center">
          <Col span={12} style={{ marginBottom: '20px' }}>
            <Autocomplete
              onLoad={(autocomplete) => (fromAutocompleteRef.current = autocomplete)}
              onPlaceChanged={() => handlePlaceSelect(fromAutocompleteRef.current, setFromCoords, setFromPlace)}
            >
              <Input placeholder="From Location" value={fromPlace} onChange={(e) => setFromPlace(e.target.value)} />
            </Autocomplete>
            <br />
            <Autocomplete
              onLoad={(autocomplete) => (toAutocompleteRef.current = autocomplete)}
              onPlaceChanged={() => handlePlaceSelect(toAutocompleteRef.current, setToCoords, setToPlace)}
            >
              <Input placeholder="To Location" value={toPlace} onChange={(e) => setToPlace(e.target.value)} />
            </Autocomplete>
            <br />
            <Select
              showSearch
              placeholder="Select Passenger"
              style={{ width: '100%' }}
              onChange={(value) => setSelectedPassenger(value)}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {passengers.map(passenger => (
                <Option key={passenger.id} value={passenger.id}>
                  {`${passenger.firstName} ${passenger.lastName} - ${passenger.phoneNumber}`}
                </Option>
              ))}
            </Select>
            <br /><br />
            <Select
              placeholder="Select Vehicle Type"
              style={{ width: '100%' }}
              onChange={(value) => setSelectedVehicleType(value)}
            >
              {vehicleTypes.map(vehicleType => (
                <Option key={vehicleType.id} value={vehicleType.id}>
                  {vehicleType.typeName}
                </Option>
              ))}
            </Select>
            <br />
          </Col>
        </Row>
        {loading ? (
          <Spin size="large" />
        ) : (
          <div>
            <Button type="primary" onClick={sendRequest}>Send Request</Button>
            {accepted && (
              <Row gutter={16} style={{ marginTop: '20px' }}>
                {console.log(accepted)}
                <Col span={8}>
                  <Card title="Driver Information" bordered>
                    <Descriptions bordered column={1}>
                      <Descriptions.Item label="Name">{`${accepted.driver.firstName} ${accepted.driver.lastName}`}</Descriptions.Item>
                      <Descriptions.Item label="Phone Number">{accepted.driver.phoneNumber}</Descriptions.Item>
                      <Descriptions.Item label="Rating">{accepted.driver.rating}</Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card title="Vehicle Information" bordered>
                    <Descriptions bordered column={1}>
                      <Descriptions.Item label="Plate Number">{accepted.vehicle.plateNumber}</Descriptions.Item>
                      <Descriptions.Item label="Model">{accepted.vehicle.model}</Descriptions.Item>
                      <Descriptions.Item label="Color">{accepted.vehicle.color}</Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card title="Arriving Information" bordered>
                    <Descriptions bordered column={1}>
                      <Descriptions.Item label="ETA">{accepted.arrivingInfo.eta}</Descriptions.Item>
                      <Descriptions.Item label="Distance">{accepted.arrivingInfo.distance}</Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Col>
              </Row>
            )}
          </div>
        )}
      </div>
    </LoadScript>
  );
};

export default Dispatch;
