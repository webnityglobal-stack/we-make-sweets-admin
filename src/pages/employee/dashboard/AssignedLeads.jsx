import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Phone } from 'lucide-react';
import CreateCall from './CreateCall';

const AssignedLeads = ({ leads }) => {
  console.log("th si si", leads);
  const [openCreateCall, setOpenCreateCall] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [lead, setLead] = useState({});
  const [editLeadOpen, setEditLeadOpen] = useState(false);

  // Count of columns (adjust if you add/remove columns)
  const columnCount = 7;

  return (
    <div className="w-[calc(100vw-260px)] overflow-x-auto">
      <Table className="!min-w-[1800px]">
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold">Client Name</TableHead>
            <TableHead className="font-bold">Company</TableHead>
            <TableHead className="font-bold">Lead Source</TableHead>
            <TableHead className="font-bold">LastCall Status</TableHead>
            <TableHead className="font-bold">Next Follow-Up Status</TableHead>
            <TableHead className="font-bold">Customer Preferred Time</TableHead>
            <TableHead className="font-bold">Update Lead Status</TableHead>
            {/* <TableHead className='font-bold'>Action</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads && leads.length > 0 ? (
            leads.map((lead) => (
              <TableRow key={lead._id}>
                <TableCell className="font-medium">{lead.name}</TableCell>
                <TableCell>{lead.company}</TableCell>
                <TableCell>{lead.source}</TableCell>
                <TableCell className="text-right">{lead.lastCallStatus}</TableCell>
                <TableCell>{lead?.nextFollowUpDate?.split("T")[0]}</TableCell>
                <TableCell>{lead.customerPrefferedTime}</TableCell>
                <TableCell>
                  <Phone
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedLead(lead);
                      setOpenCreateCall(true);
                    }}
                  />
                </TableCell>
                {/* <TableCell><Pencil onClick={() => { setLead(lead); setEditLeadOpen(true); }} /></TableCell> */}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columnCount}
                className="text-center py-6 text-muted-foreground"
              >
                No leads assigned
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <CreateCall
        open={openCreateCall}
        setOpen={setOpenCreateCall}
        lead={selectedLead}
      />
    </div>
  );
};

export default AssignedLeads;