import React from 'react';

const DashboardStats=({totalLead, activeUser, inActiveUser, totalRoles, followUpsPending, websiteLeads, manualLeads})=> {
  // You can change these values directly here
  const data = {
    totalLeads: totalLead,
    manualLeads: manualLeads,
    websiteLeads: websiteLeads,
    activeUsers: activeUser,
    inactiveUsers: inActiveUser,
    definedRoles: totalRoles,
    followupsPending: followUpsPending,
  };
  return (
    <div className="px-6 py-4 bg-gray-50 w-full ">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Leads Card */}
        <div className="bg-white rounded-xl shadow-md p-5">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Total Leads</h3>
          <p className="text-3xl font-bold text-gray-900 mt-1">{data?.totalLeads}</p>
          <p className="text-sm text-gray-500 mt-2">
            (Manual: {data.manualLeads}, Website: {data.websiteLeads})
          </p>
        </div>

        {/* User Status Card */}
        <div className="bg-white rounded-xl shadow-md p-5">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">User Status</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">{data.activeUsers} Active</p>
          <p className="text-gray-600 text-sm">{data.inactiveUsers} Inactive</p>
        </div>

        {/* Defined Roles Card */}
        <div className="bg-white rounded-xl shadow-md p-5">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Defined Roles</h3>
          <p className="text-3xl font-bold text-gray-900 mt-1">{data.definedRoles}</p>
          <p className="text-sm text-gray-500">Roles</p>
        </div>

        {/* Follow-ups Required Card */}
        <div className="bg-white rounded-xl shadow-md p-5">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Follow-ups Required</h3>
          <p className="text-3xl font-bold text-gray-900 mt-1">{data.followupsPending}</p>
          <p className="text-sm text-gray-500">Pending</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;