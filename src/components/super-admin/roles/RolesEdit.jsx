import { roleService } from '@/services/role.service';
import { Plus, Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

const RolesEdit = () => {
  const { id } = useParams();
const [role, setRole]= useState({});

const fetchRole = async()=>{
    const response = await roleService.getRoleById(id);
    setRole(response);
}
  


const handleDelete = async({permission})=>{
    const deletedPermissionRole = await roleService.deleteRolePermission(role._id, permission);
    setRole(deletedPermissionRole);
}

  useEffect(()=>{
    fetchRole();
  }, [])
  return (
     <div className="p-6 bg-white rounded-lg shadow">
      {/* Role Details */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold">{role.name}</h2>
        <p className="text-sm text-gray-500">
          Role ID: {role._id}
        </p>
      </div>

      {/* Permissions */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">
          Permissions ({role.permission?.length})
        </h3>

        <div className="flex flex-wrap gap-2">
          {role.permission?.map((permission, index) => (
            <span
              key={index}
              className=" flex  gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm"
            >
              {permission} <div
              className=' text-red-600 hover:text-red-700'>
                <Trash className='' onClick={(e)=>{handleDelete({ permission })}} />
              </div>
            </span>
          ))}
        </div>
      </div>

{/* add permission */}
  <div className="mb-6" onClick={()=>{
    
  }}>
  <div className='flex'>
    <h3 className="text-lg mb-2 text-blue-500">
    Add More Permissions 
</h3>
 <Plus className='text-blue-500'/>
  </div>
</div>

      {/* Assigned Users */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">
          Assigned Users ({role.user?.length})
        </h3>

        <div className="space-y-3">
          {role.user?.map((user) => (
            <div
              key={user._id}
              className="border rounded-lg p-4"
            >
              <p>
                <strong>Name:</strong> {user.fullName}
              </p>

              <p>
                <strong>Email:</strong> {user.email}
              </p>

              <p>
                <strong>State:</strong> {user.state}
              </p>

              <p>
                <strong>District:</strong> {user.district}
              </p>

              <p>
                <strong>Status:</strong> {user.status}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Dates */}
      <div className="text-sm text-gray-500">
        <p>
          Created At:{" "}
          {new Date(role.createdAt).toLocaleString()}
        </p>

        <p>
          Updated At:{" "}
          {new Date(role.updatedAt).toLocaleString()}
        </p>
      </div>
    </div>

  );
};
export default RolesEdit
