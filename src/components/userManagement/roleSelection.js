import React, { useState, useEffect } from 'react';
import { Select } from 'antd';

const { Option } = Select;

const RoleSelection = ({ roles, onChange }) => {
  const [fetchedRoles, setFetchedRoles] = useState([]);
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Token not found');
  }
  useEffect(() => {
    // Fetch roles from kms.dololoet.com:3003/roles
    fetch('https://kmsbe.frontieri.com/kmsApi/roles',{
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setFetchedRoles(data);
      })
      .catch((error) => {
        console.error('Error fetching roles:', error);
      });
  }, []);

  return (
    <Select
      mode="multiple"
      style={{ width: '100%' }}
      placeholder="Select roles"
      onChange={onChange}
      defaultValue={roles}
    >
      {fetchedRoles.map((role) => (
        <Option key={role.id} value={role.id}>
          {role.name}
        </Option>
      ))}
    </Select>
  );
};

export default RoleSelection;
