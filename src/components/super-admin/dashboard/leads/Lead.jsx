// import { leadService } from '@/services/leads.service'
// import React, { useEffect, useState } from 'react'
// import AllLeads from './AllLeads';
// import { Button } from '@/components/ui/button';
// import { useNavigate } from 'react-router-dom';


// const Lead = () => {
// const navigate = useNavigate();
//     const [allLeads, setAllLeads] = useState([]);

//     const fetchLeads = async()=>{
//         const response = await leadService.getAllLeads();
//         setAllLeads(response.leads);
        
//     }

//     useEffect(()=>{
//         fetchLeads();
//     },[])
//     console.log("-----", allLeads)
//   return (
//     <div className=''>

//         <div className='flex justify-between p-4'>
//             <div className='text-3xl font-bold'>Leads Management</div>
//             <div> 
//                 <Button className='' onClick={()=>{navigate('create-lead')}} >Add New Lead</Button>
//             </div>
//         </div>

//       <div className="w-full overflow-hidden">
//             <AllLeads leads={allLeads} />
//         </div>
//     </div>
//   )
// }

// export default Lead

import React, { useEffect, useState } from "react";
import { leadService } from "@/services/leads.service";
import AllLeads from "./AllLeads";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { userService } from "@/services/user.service";

const Lead = () => {
  const navigate = useNavigate();


  const [allLeads, setAllLeads] = useState([]);
  const [status, setStatus] = useState("ALL");

const fetchLeads = async (selectedStatus = "ALL") => {
    try {
      const response = await leadService.getAllLeads(selectedStatus);
      setAllLeads(response.leads);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    
    fetchLeads(status);
  }, [status]);




  return (
    <div>

      <div className="flex justify-between items-center p-4">

        <div className="text-3xl font-bold">
          Leads Management
        </div>

        <div className="flex gap-4 items-center">

          {/* Status Dropdown */}

          <Select
            value={status}
            onValueChange={(value) => setStatus(value)}
          >
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>

            <SelectContent>

              <SelectItem value="ALL">All</SelectItem>

              <SelectItem value="NEW">NEW</SelectItem>

<SelectItem value="ASSIGNED">
                ASSIGNED
              </SelectItem>

              <SelectItem value="CONTACTED">
                CONTACTED
              </SelectItem>

              <SelectItem value="CALL_BACK">
                CALL BACK
              </SelectItem>

              <SelectItem value="NOT_ANSWERING">
                NOT ANSWERING
              </SelectItem>

              <SelectItem value="SWITCH_OFF">
                SWITCH OFF
              </SelectItem>

              <SelectItem value="INTERESTED">
                INTERESTED
              </SelectItem>

              <SelectItem value="NOT_INTERESTED">
                NOT INTERESTED
              </SelectItem>

              <SelectItem value="DEAL_CONFIRMED">
                DEAL CONFIRMED
              </SelectItem>

              <SelectItem value="DEAL_LOST">
                DEAL LOST
              </SelectItem>

            </SelectContent>
          </Select>

          <Button onClick={() => navigate("create-lead")}>
            Add New Lead
          </Button>

        </div>
      </div>

      <div className="w-full overflow-hidden">
        <AllLeads leads={allLeads}  onRefresh={fetchLeads} />
      </div>

    </div>
  );
};

export default Lead;