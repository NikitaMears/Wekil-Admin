import React from 'react';
import { Checkbox } from 'antd';

const PermissionSelection = ({ permissions, selectedPermissions, onChange }) => {
  if (!permissions) {
    return null; // or you can return a loading indicator or an error message
  }

  // const handleCheckboxChange = (permissionId) => {
  //   const index = selectedPermissions.indexOf(permissionId);
  //   if (index === -1) {
  //     onChange([...selectedPermissions, permissionId]);
  //   } else {
  //     onChange(selectedPermissions.filter((id) => id !== permissionId));
  //   }
  // };

  return (
    <Checkbox.Group
      value={selectedPermissions}
      onChange={(values) => onChange(values)}
      style={{ width: '100%' }}
    >
      {permissions.map((permission) => (
        <Checkbox key={permission.id} value={permission.id}>
          {permission.name}
        </Checkbox>
      ))}
    </Checkbox.Group>
  );
};

export default PermissionSelection;
