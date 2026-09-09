import React, { useEffect, useState } from 'react'
import AssignedLeads from './AssignedLeads'
import { employeeDashboardService } from '@/services/employee/employee.dashboard.service'
import RecentActivity from './RecentActivity';
import DashStats from './DashStats';

const EmployeeDashboard = () => {

  const [dashboard, setDashboard] = useState({});
  const [status, setStatus] = useState("");
  const fetchDasboardDetails = async () => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || !userData._id) {
      // Handle missing user – e.g., redirect to login
      console.error('User not found in localStorage');
      // Optionally: navigate to login page
      return;
    }

     const userId = userData._id; 

     const response = await employeeDashboardService.getDashboard(userId, status);

    setDashboard(response.data);
  };

  useEffect(() => {
    fetchDasboardDetails();
  }, [status]);

  console.log("dasboard:", dashboard)
  return (
    <div className='flex flex-col gap-4 p-2'>

      <div className='font-bold text-3xl '>
        Employee Dasboard
      </div>

      <div>
        {/* <DashStats stats={dashboard.stats}/> */}
      </div>

      <div className='flex flex-col'>
<div className='flex gap-15'>
  
        <div className='font-bold text-[15px]'>
          My Assigned Leads
        </div>
        {/* filter */}
        <div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded-md px-3 py-2"
          >
            <option value="">All</option>
            <option value="NEW">NEW</option>
            <option value="CONTACTED">CONTACTED</option>
             <option value="ASSIGNED">ASSIGNED</option>
            <option value="CALL_BACK">CALL BACK</option>
            <option value="NOT_ANSWERING">NOT ANSWERING</option>
            <option value="SWITCH_OFF">SWITCH OFF</option>
            <option value="INTERESTED">INTERESTED</option>
            <option value="NOT_INTERESTED">NOT INTERESTED</option>
            <option value="DEAL_CONFIRMED">DEAL CONFIRMED</option>
            <option value="DEAL_LOST">DEAL LOST</option>
          </select>
        </div>
</div>
        <AssignedLeads leads={dashboard.assignedLeads} />
      </div>

      <div>
        <div className='font-bold text-[15px]'>
          My Recent Activities
        </div>
        <RecentActivity recentActivity={dashboard.recentActivity} />
      </div>

    </div>
  )
}

export default EmployeeDashboard