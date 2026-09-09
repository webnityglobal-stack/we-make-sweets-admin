import DataTable from '@/components/common/DataTable';
import { superAdminUser } from '@/services/super-admin/super.admin.dashboard.service';
import React, { useEffect, useState, useCallback } from 'react';

const AllUser = ({ searchTerm = '' }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 Fetch function – searchTerm ke saath API call
  const fetchUserDetails = useCallback(async (search) => {
    setLoading(true);
    try {
      // ✅ Backend ko { search } bhejo (not {searchTerm})
      const response = await superAdminUser.getUserData({ search });
      setData(response);
    } catch (error) {
      console.error('Error fetching users:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔥 Initial load – jab component mount ho
  useEffect(() => {
    fetchUserDetails('');
  }, []); // ✅ Empty array = sirf ek baar

  // 🔥 Debounce – jab searchTerm change ho, 300ms wait karo
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUserDetails(searchTerm);
    }, 300);

    // Cleanup function – agar user fast type kar raha hai toh purani call cancel ho
    return () => clearTimeout(timer);
  }, [searchTerm, fetchUserDetails]);

  // Data mapping for DataTable
  const userData =
    data?.map((item) => ({
      _id: item._id,
      fullName: item.fullName,
      email: item.email,
      role: item.role,
      districtState: item.districtState,
      status: item.status,
      assignedLeads: item.metrics?.assignedLeads || 0,
      confirmedDeals: item.metrics?.confirmedDeals || 0,
      callsMade: item.metrics?.callsMade || 0,
    })) || [];

  const userColumns = [
    { key: 'fullName', label: 'Full Name' },
    { key: 'email', label: 'Email Address' },
    { key: 'role', label: 'Role' },
    { key: 'districtState', label: 'District/State' },
    { key: 'status', label: 'Status' },
    { key: 'assignedLeads', label: 'Assigned Leads' },
    { key: 'confirmedDeals', label: 'Confirmed Deals' },
    { key: 'callsMade', label: 'Calls Today' },
  ];

  return (
    <div>
      {loading ? (
        <div className="text-center py-4 text-gray-500">Loading...</div>
      ) : (
        <DataTable
          title="Employee Performance Summary"
          columns={userColumns}
          data={userData}
        />
      )}
    </div>
  );
};

export default AllUser;