import DataTable from '@/components/common/DataTable';
import { superAdminRole } from '@/services/super-admin/super.admin.dashboard.service';
import React, { useEffect, useState } from 'react'
import RoleModal from './RoleModal';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CreateRoleModal from '@/components/super-admin/roles/CreateRoleModal';
import { Trash } from 'lucide-react';
import { roleService } from '@/services/role.service';


const Role = () => {

const navigate = useNavigate();

const [roles, setRoles] = useState([]);
const [openCreateRole, setOpenCreateRole]= useState(false);

const handleDeleteRole = async(id)=>{
  const response = await roleService.deleteRole(id);
  console.log("thi sis in component", response);
    if (response.success) {
      await fetchRoleSummary();
    }

}
const roleColumns = [
  {
    key: "roleName",
    label: "Role Name",
  },
  {
    key: "permissionsCount",
    label: "Permissions Count",
  },
  {
    key: "permissions",
    label: "Permissions Detail",
    render: (row) => (
      <RoleModal
        text="View All"
        data={row.permissions}
        title="Permissions" 

      />
    ),
  },
  {
    key: "assignedUsersCount",
    label: "Assigned Users Count",
  },
  {
    key: "assignedUsers",
    label: "Assigned Users Detail",
    render: (row) => (
      <RoleModal
        text="View All"
        data={row.assignedUsers}
        title="Assigned Users" 
      />
    ),
  },
   {
    key: "actions",
    label: "Actions",
    render: (row) => (
      <div>
        <button
        onClick={() => navigate(`/super-admin/roles/edit/${row._id}`)}
        className="px-2 py-1 rounded border"
      >
        ✏️ Edit
      </button>
       <button
        onClick={() => handleDeleteRole(row._id)}
        className="p-2 rounded border text-red-500 hover:bg-red-50"
      >
        <Trash size={16} />
      </button>
      </div>
      
    ),
  },
];

const roleData = 
roles?.map((role) => ({
    _id: role._id,

    roleName: role.roleName,

    permissionsCount: role.permissionsCount,

    permissionsDetail: <RoleModal/>,

    assignedUsersCount: `${role.assignedUsersCount} Users`,

    assignedUsersDetail: "View All",

    actions: "Edit",

    permissions: role.permissions,

    assignedUsers: role.assignedUsers,
  })) || [];

const fetchRoleSummary = async()=>{
  const response = await superAdminRole.getRoleSummary();
  setRoles(response);
}

useEffect(()=>{
  fetchRoleSummary();
}, []);
  return (
    <div className='p-4 flex flex-col gap-4'>
     <div className='flex justify-between pr-4'>
       <div className='text-2xl font-bold'>
        Roles & Permissions Management
      </div>
     {/* <a href='roles/create-role'> */}
        <Button onClick={()=>setOpenCreateRole(true)}>Create Role</Button>
     {/* </a> */}
     </div>
      <div>
        <DataTable
  title="Role & User Summary"
  columns={roleColumns}
  data={roleData}
/>

      </div>
      <CreateRoleModal open={openCreateRole} setOpen = {setOpenCreateRole} />
    </div>
  )
}

export default Role