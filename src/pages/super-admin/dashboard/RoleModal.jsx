import { Button } from "@/components/ui/button";
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
import { roleService } from "@/services/role.service";



import React, { useState } from 'react'

const RoleModal = ({text, data, title}) => {

const [modalData, setModalData] = useState();

const handleOpen = async (open) => {

  if (!open) return;

  const response = await roleService.getRoleDetails(roleId);

  setData(response.data);
};

const handleClick = (e)=>{
  e.preventDefault();
}
    
  return (
  <>
    {/* <Dialog onOpenChange={handleOpen} > */}
    <Dialog>
      {/* <DialogTrigger render={<Button variant="outline">{text}</Button>} /> */}
      <DialogTrigger asChild>
    <Button variant="outline">  {text}</Button>
  </DialogTrigger>

      <DialogContent>
        <DialogHeader> 
       <DialogTitle>{title}</DialogTitle>
     <DialogDescription>
  All {title.toLowerCase()} list
</DialogDescription>
        </DialogHeader>
    {/* <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
  {data?.length > 0 ? (
    <ul className="space-y-2">
      {data.map((item, index) => (
        <li
          key={index}
          className="border rounded px-3 py-2 text-sm"
        >
          {typeof item === "string"
            ? item
            : item.name || item.email || JSON.stringify(item)}
        </li>
      ))}
    </ul>
  ) : (
    <p>No Data Found</p>
  )}
</div> */}
<div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
  {data?.length > 0 ? (
    <ul className="space-y-2">
      {data.map((item, index) => (
        <li
          key={item._id || index}
          className="border rounded px-3 py-2 text-sm"
        >
          {title === "Permissions"
            ? item
            : item.fullName}
        </li>
      ))}
    </ul>
  ) : (
    <p>No Data Found</p>
  )}
</div>
        <DialogFooter>
          {/* <DialogClose render={<Button variant="outline">Close</Button>} /> */}
          <DialogClose asChild>
   <Button variant="outline">Close</Button>
</DialogClose> 
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  )
}

export default RoleModal