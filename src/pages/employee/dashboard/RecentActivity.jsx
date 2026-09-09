import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Pencil, Trash2 } from 'lucide-react';



const RecentActivity = ({recentActivity}) => {
  console.log("inside recent component",recentActivity);
  const [acitivities, setActivities] = useState([]);
  console.log()
  const [editLeadOpen, setEditLeadOpen] = useState(false);
  console.log(editLeadOpen, "---", "lead----------", acitivities);

    useEffect(() => {
    if (recentActivity) {
      setActivities(recentActivity);
    }
  }, [recentActivity]);


  return (
    <div className="w-[calc(100vw-260px)] h-[600px] overflow-x-auto">
      <Table className="!min-w-[1800px]">
        <TableHeader className=''>
          <TableRow className=''>
            <TableHead className='font-bold'>Call Time</TableHead>
            <TableHead className='font-bold'>Company Name</TableHead>
            <TableHead className='font-bold'>Client Name</TableHead>
            <TableHead className='font-bold'>Call Status</TableHead>
            <TableHead className='font-bold'>Call Type</TableHead>
            <TableHead className='font-bold'>Client Preferred Time</TableHead>
            <TableHead className="font-bold">Deal Amount</TableHead>
            <TableHead className="font-bold">Comments</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {acitivities?.map((activity) => (
            <TableRow key={activity?.callTime}>
              <TableCell className="font-medium">{activity?.duration}{ " "}seconds</TableCell>
              <TableCell>{activity?.lead?.companyName}</TableCell>
              <TableCell>{activity?.lead?.name}</TableCell>
              <TableCell>{activity?.callStatus}</TableCell>
               <TableCell>{activity?.callType}</TableCell>
               <TableCell>{activity?.customerPreferredTime}</TableCell>
              <TableCell className="text-right">{activity?.dealAmount}</TableCell>
              <TableCell>{activity?.comments}</TableCell>
                {/* <TableCell><Pencil onClick={
                  () => {
                    setActivities(lead),
                      setEditLeadOpen(true)

                  }
                } /></TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default RecentActivity