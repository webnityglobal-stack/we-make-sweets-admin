import Login from '@/components/common/Login'
import ProtectedRoute from '@/components/ProtectedRoute'
import CreateLead from '@/components/super-admin/dashboard/leads/CreateLead'
import Lead from '@/components/super-admin/dashboard/leads/Lead'
import CreateRole from '@/components/super-admin/roles/CreateRoleModal'
import RolesEdit from '@/components/super-admin/roles/RolesEdit'
import MainlayoutEmployee from '@/layout/employee/MainlayoutEmployee'
import MainlayoutSuperAdmin from '@/layout/super-admin/MainlayoutSuperAdmin'
import EmployeeDashboard from '@/pages/employee/dashboard/EmployeeDasboard'
import ForgotPassword from '@/pages/ForgotPassword'
import ResetPassword from '@/pages/ResetPassword'
import Dashboard from '@/pages/super-admin/Dashboard'
import Role from '@/pages/super-admin/dashboard/Role'
import Register from '@/pages/super-admin/Register'
import Users from '@/pages/super-admin/Users'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Navigate } from "react-router-dom";

const Approute = () => {
  return (
    <Routes>
      {/* public routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path='/login' element={<Login />} />
      <Route
  path="/forgot-password"
  element={<ForgotPassword />}
/>
<Route
    path="/reset-password/:token"
    element={<ResetPassword />}
/>
      {/* protected Routes */}
      {/* for superadmin with sidebar route */}

      <Route path='/super-admin'
        element={
          <ProtectedRoute allowedRoles={["super-admin"]}>
            <MainlayoutSuperAdmin />
          </ProtectedRoute>
        }
      >

        {/* <ProtectedRoute> <Route path='dashboard' element={<Dashboard />} /></ProtectedRoute>
       <ProtectedRoute> </ProtectedRoute> <Route path='users' element={<Users/>}/>
       <ProtectedRoute> <Route path='roles' element = {<Role/>}/></ProtectedRoute>
       <ProtectedRoute> <Route path='roles/edit/:id' element = {<RolesEdit/>}/></ProtectedRoute>
       <ProtectedRoute> <Route path='roles/create-role' element = {<CreateRole/>}/></ProtectedRoute>
       <ProtectedRoute> <Route path='leads' element ={ <Lead/> }/></ProtectedRoute>
      <ProtectedRoute> <Route path='leads/create-lead' element={<CreateLead/>}/></ProtectedRoute> */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="roles" element={<Role />} />
        <Route path="roles/edit/:id" element={<RolesEdit />} />
        <Route path="roles/create-role" element={<CreateRole />} />
        <Route path="leads" element={<Lead />} />
        <Route path="leads/create-lead" element={<CreateLead />} />

      </Route>

      {/* for superadmin without sidebar route  */}

      <Route path='/super-admin/register' element={
        <ProtectedRoute allowedRoles={["super-admin"]}>
          <Register />
        </ProtectedRoute>
      }
      />

      {/* route for employee  */}

      {/* <Route path='/employee' element={<MainlayoutEmployee />}> */}
      <Route
        path="/employee"
        element={
          <ProtectedRoute allowedRoles={["employee"]}>
            <MainlayoutEmployee />
          </ProtectedRoute>
        }
      >

        {/* Route with sidebar  */}
        <Route path='dashboard' element={<EmployeeDashboard />} />
        <Route path='leads' element={<Lead />} />
      </Route>

      {/* route without sidebar for employe */}




<Route>
  <Route
  path="/unauthorized"
  element={<h1>Unauthorized Access</h1>}
/>
</Route>
    </Routes>
  )
}

export default Approute