import AppSidebar from '@/components/employee/Appsidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { employeeNavItems } from '@/constant/employee/sidebar/employeeNavitems'
import React from 'react'
import { Outlet, Router } from 'react-router-dom'

const MainlayoutEmployee = () => {
  return (
    <div className='flex'>

           <div>
            <SidebarProvider>
             <AppSidebar navItems={employeeNavItems} collapsible="icon"/>
           </SidebarProvider>
           </div>

        <div className='w-full h-full'>
            <Outlet/>
        </div>
     </div>
  )
}

export default MainlayoutEmployee