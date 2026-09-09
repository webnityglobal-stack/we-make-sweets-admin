import DataTable from '@/components/common/DataTable'
import DashboardStats from '@/components/super-admin/dashboard/DashboardStats'
import { leadService } from '@/services/leads.service';
import { superAdminDashboard } from '@/services/super-admin/super.admin.dashboard.service';
import React, { useEffect, useState } from 'react'

const Dashboard = () => {

  const [leads, setLeads] = useState({})

  const callColumns = [
    {
      key: "leadName",
      label: "Lead Name",
    },
    {
      key: "mobile",
      label: "Mobile Number",
    },
    {
      key: "calledBy",
      label: "Called By",
    },
    {
      key: "callType",
      label: "Call Type",
    },
    {
      key: "callStatus",
      label: "Call Status",
    },
    {
      key: "duration",
      label: "Duration",
    },
  ];

  const roleColumns = [
    {
      key: "roleName",
      label: "Role Name",
    },
    {
      key: "permissionCount",
      label: "Permission Count",
    },
    {
      key: "assignedUsers",
      label: "Assigned Users",
    },
  ];

  const roleData = leads?.roleSummary || [];

  const leadColumns = [
    {
      key: "leadName",
      label: "Lead Name",
    },
    {
      key: "mobile",
      label: "Mobile",
    },
    {
      key: "source",
      label: "Source",
    },
    {
      key: "status",
      label: "Status",
    },
    {
      key: "assignedTo",
      label: "Assigned To",
    },
  ];

  const leadData =
    leads?.topLeadSources?.map((lead) => ({
      leadName: lead.name,
      mobile: lead.mobileNumber,
      source: lead.source,
      status: lead.status,
      assignedTo: lead.assignedTo?.fullName || "Unassigned",
    })) || [];

  

  const fetchLeads = async () => {

    const response = await superAdminDashboard.getDashboard();
    setLeads(response);
  }

  useEffect(() => {
    fetchLeads();
  }, [])


  return (
    <div className='h-screen'>
      <div className=''>
        <DashboardStats manualLeads={leads?.stats?.manualLeads} 
        websiteLeads={leads?.stats?.websiteLeads} 
        followUpsPending={leads?.stats?.followUpsPending} 
        totalRoles={leads?.stats?.totalRoles} totalLead={leads?.stats?.totalLeads} 
        activeUser={leads?.stats?.activeUsers} inActiveUser={leads?.stats?.activeUsers} />
      </div>

      {/* table main contaner */}

      <div className='flex py-2 gap-1'>
        {/* call table */}
        <div className=''>
          <DataTable className='h-[460px]'
            title="Recent Calls"
            columns={callColumns}
            data={leads?.recentCalls?.map((item) => ({
              leadName: item.lead?.name,
              mobile: item.lead?.mobileNumber,
              calledBy: item.calledBy?.fullName,
              callType: item.callType,
              callStatus: item.callStatus,
              duration: `${item.duration} sec`,
            }))}
          />
        </div>

        <div>

          {/* lead table  */}
          <div >
            <DataTable title="Lead Summary"
              columns={leadColumns}
              data={leadData}
              className='h-[300px] '
            />
          </div>


          {/* role table  */}
          <div>
            <DataTable title="Role and User Summary Panel"
              columns={roleColumns}
              data={leads?.roleSummary || []}
            />
          </div>

        </div>

      </div>
    </div>
  )
}

export default Dashboard