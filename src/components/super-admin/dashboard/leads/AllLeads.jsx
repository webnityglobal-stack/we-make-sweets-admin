import React, { useState, useEffect } from 'react';   // ✅ useEffect add
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
import { Pencil, Trash2 } from 'lucide-react';
import { leadService } from '@/services/leads.service';
import { userService } from '@/services/user.service';  // ✅ userService import
import CreateLead from './CreateLead';
import LeadEditModal from './LeadEditModal';

// ✅ onRefresh prop add kiya
const AllLeads = ({ leads, onRefresh }) => {
  console.log("th si si", leads);

  // ---------- Existing states ----------
  const [lead, setLead] = useState({});
  const [editLeadOpen, setEditLeadOpen] = useState(false);

  // ---------- Bulk Assign States ----------
  const [selectedLeadIds, setSelectedLeadIds] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // ---------- Handlers ----------
  const handleDelete = async (id) => {
    console.log("delete:", id);
    const response = await leadService.deleteLead(id);
    console.log(response);
    window.location.reload(); // ya onRefresh() agar parent se mile toh
  };

  // Lead select toggle
  const handleLeadSelect = (leadId) => {
    setSelectedLeadIds(prev =>
      prev.includes(leadId)
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  // Select All
  const handleSelectAll = () => {
    if (selectedLeadIds.length === leads.length) {
      setSelectedLeadIds([]);
    } else {
      setSelectedLeadIds(leads.map(lead => lead._id));
    }
  };

  // Assign submit
  const handleAssign = async () => {
    if (!selectedUserId) {
      alert("Kripya ek user select karein");
      return;
    }
    if (selectedLeadIds.length === 0) {
      alert("Kripya kam se kam ek lead select karein");
      return;
    }

    setLoading(true);
    try {
      const response = await leadService.assignMultipleLeads(
        selectedUserId,
        selectedLeadIds
      );
      console.log("Assign success:", response);
      alert(`${response.data.assignedLeads} leads successfully assigned!`);

      // ✅ Refresh leads (parent se onRefresh call karein)
      if (onRefresh) onRefresh();
      // ya window.location.reload();

      // Clear selection
      setSelectedLeadIds([]);
      setSelectedUserId('');
    } catch (error) {
      console.error("Assign error:", error);
      alert(error.response?.data?.message || "Assign karne me error aayi");
    } finally {
      setLoading(false);
    }
  };

  // ---------- Fetch Users ----------
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await userService.getAllUsers();
        setUsers(res.data);
      } catch (err) {
        console.error("Users fetch error", err);
      }
    };
    fetchUsers();
  }, []);

  console.log(editLeadOpen, "---", "lead----------", lead);

  // ---------- RENDER ----------
  return (
    <div className="w-[calc(100vw-260px)] h-[600px] overflow-x-auto">
      {/* ============================================= */}
      {/* ✅ TOOLBAR - Bulk Assign (Yahan add karein) */}
      {/* ============================================= */}
      <div className="flex items-center gap-4 mb-4 p-3 bg-gray-100 rounded-lg">
        <span className="font-semibold text-sm">Bulk Assign:</span>

        <select
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          className="border p-2 rounded-md"
        >
          <option value="">-- Select User --</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.fullName} ({user.email})
            </option>
          ))}
        </select>

        <button
          onClick={handleAssign}
          disabled={loading || selectedLeadIds.length === 0}
          className={`px-4 py-2 rounded-md text-white ${
            loading || selectedLeadIds.length === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Assigning...' : `Assign (${selectedLeadIds.length})`}
        </button>

        {selectedLeadIds.length > 0 && (
          <span className="text-sm text-gray-600">
            {selectedLeadIds.length} leads selected
          </span>
        )}
      </div>

      {/* ============================================= */}
      {/* ✅ TABLE - Checkbox column add kiya */}
      {/* ============================================= */}
      <Table className="min-w-[1800px]">
        <TableHeader>
          <TableRow>
            {/* ✅ Select All Checkbox (pehla column) */}
            <TableHead className="w-[50px]">
              <input
                type="checkbox"
                checked={leads.length > 0 && selectedLeadIds.length === leads.length}
                onChange={handleSelectAll}
              />
            </TableHead>
            <TableHead className="w-[100px] font-bold">Lead Id</TableHead>
            <TableHead className="font-bold">Lead Name</TableHead>
            <TableHead className="font-bold">Email</TableHead>
            <TableHead className="font-bold">Source</TableHead>
            <TableHead className="font-bold">Company</TableHead>
            <TableHead className="font-bold text-center">
              Assigned To
              <div className="flex gap-4 justify-center text-xs font-normal">
                <span>Name</span>
                <span>Email</span>
              </div>
            </TableHead>
            <TableHead className="font-bold">Status</TableHead>
            <TableHead className="font-bold">Next Follow Up</TableHead>
            <TableHead className="font-bold">Product</TableHead>
            <TableHead className="font-bold">Remarks</TableHead>
            <TableHead className="font-bold">Service</TableHead>
            <TableHead className="font-bold">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead._id}>
              {/* ✅ Row checkbox */}
              <TableCell>
                <input
                  type="checkbox"
                  checked={selectedLeadIds.includes(lead._id)}
                  onChange={() => handleLeadSelect(lead._id)}
                />
              </TableCell>
              <TableCell className="font-medium">{lead._id}</TableCell>
              <TableCell className="font-medium">{lead.name}</TableCell>
              <TableCell>{lead.email}</TableCell>
              <TableCell>{lead.source}</TableCell>
              <TableCell>{lead.companyName}</TableCell>
              {/* ✅ AssignedTo column fixed */}
              <TableCell>
                <div className="flex flex-col">
                  <span>{lead?.assignedTo?.fullName || 'Unassigned'}</span>
                  <span className="text-xs text-gray-500">{lead?.assignedTo?.email || ''}</span>
                </div>
              </TableCell>
              <TableCell>{lead.status}</TableCell>
              <TableCell>{lead?.nextFollowUpDate?.split("T")[0]}</TableCell>
              <TableCell>{lead.product}</TableCell>
              <TableCell>{lead.remarks}</TableCell>
              <TableCell>{lead.service}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Pencil
                    className="cursor-pointer"
                    onClick={() => {
                      setLead(lead);
                      setEditLeadOpen(true);
                    }}
                  />
                  <Trash2
                    className="cursor-pointer"
                    onClick={() => handleDelete(lead._id)}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <LeadEditModal
        open={editLeadOpen}
        setOpen={setEditLeadOpen}
        oldLeadValue={lead}
      />
    </div>
  );
};

export default AllLeads;