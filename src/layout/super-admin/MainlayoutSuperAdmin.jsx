
import AppSidebar from '@/components/super-admin/AppSidebar'
import { SidebarProvider } from '@/components/ui/sidebar';
import { adminNavItems } from '@/constant/super-admin/sidebar/adminNavItems';
import React from 'react'
import { Outlet} from 'react-router-dom'

const MainlayoutSuperAdmin = () => {
  return (
     <div className='flex'>

           <div>
            <SidebarProvider>
             <AppSidebar navItems={adminNavItems} collapsible="icon"/>
           </SidebarProvider>
           </div>

        <div className='w-full h-full'>
            <Outlet/>
        </div>
     </div>
  )
}

export default MainlayoutSuperAdmin