import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { roleService } from '@/services/role.service';

const CreateRoleModal = ({ open, setOpen }) => {


  const [allPermissions, setAllPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions]= useState([]);
  const [roleName, setRoleName]= useState("");

  const fetchPermissions = async()=>{
    const response = await roleService.fetchAllPermissions();
    setAllPermissions(response);
  }

 

const handleCreateRole= async()=>{
 const response = await roleService.createRole(roleName, selectedPermissions);
  window.location.reload()

}

const handleSelectAll = () => {
  if (selectedPermissions.length === allPermissions.length) {
    setSelectedPermissions([]);
  } else {
    setSelectedPermissions(allPermissions);
  }
};

const handlePermissionChange = (permission) => {
  if (selectedPermissions.includes(permission)) {
    setSelectedPermissions(
      selectedPermissions.filter((p) => p !== permission)
    );
  } else {
    setSelectedPermissions([
      ...selectedPermissions,
      permission,
    ]);
  }
};

const handleRoleName=(e)=>{
  e.preventDefault();
  setRoleName(e.target.value);
}

  useEffect(()=>{
    fetchPermissions();
  },[]);

  return (

    <Dialog open={open} onOpenChange={setOpen} className='h-screen'>

      <DialogContent className="!w-[800px] !max-w-none">
        <DialogHeader className="">
          <DialogTitle>Create Your Role</DialogTitle>
        </DialogHeader>
    
{/* step-1 */}
        <div className="w-full h-full border border-gray-300 rounded-md overflow-hidden bg-white">
          {/* Header */}
          <div className="bg-blue-100 border-b border-gray-300 px-4 py-2">
            <h2 className="font-semibold text-gray-800">
              Step 1: Role Identification
            </h2>
          </div>

          {/* Body */}
          <div className="p-6">
            <div className="max-w-md mx-auto">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role Name (Required)
              </label>

              <input
                type="text"
                placeholder="e.g., Senior Telecaller"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e)=>{handleRoleName(e)}}
                value={roleName}
              />
            </div>

          </div>
        </div>

        {/* second step  */}
        <div className="w-full h-full border border-gray-300 rounded-md overflow-hidden bg-white">
          {/* Header */}
          <div className="bg-blue-100 border-b border-gray-300 px-4 py-2">
            <h2 className="font-semibold text-gray-800">
              Step 2: Assign Permissions
            </h2>
          </div>

          {/* checkbox input  */}
          <div className='h-[300px] overflow-auto '>

  <div className="sticky top-0 z-50 bg-white ">
       <label className='flex items-center gap-1 px-2 py-1 ' >       
 <input
  className="h-4 w-4"
    type="checkbox"
    checked={
      allPermissions.length > 0 &&
      selectedPermissions.length === allPermissions.length
    }
    onChange={handleSelectAll}
  />
    

   <span className='text-[20px] flex items-center'>Select All</span>
   </label>
  </div>
             {
              allPermissions.map( (permission, index)=>{
              return  (
                   <label className='flex items-center gap-1 px-2 py-1 ' key={index}>
                   <input
                type="checkbox"
                className="h-4 w-4"
                checked={selectedPermissions.includes(permission)}
        onChange={() => handlePermissionChange(permission)}
              />
              <span className='text-[20px] flex items-center'>{permission}</span>
              </label>
                )
              }
            )
             }
            

          </div>

        </div>
<div className='text-center'>
  <Button onClick={()=>handleCreateRole()}>Create Role</Button>
</div>
        {/* </div> */}
        <DialogFooter>
          <DialogClose >
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>

  )
}

export default CreateRoleModal