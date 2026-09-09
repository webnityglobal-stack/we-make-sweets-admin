import React from 'react'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar'

const AppSidebar = ({ navItems,
  ...props}) => {
  return (
       <Sidebar {...props} className="inline-block">
       
      <SidebarContent className="bg-[#061166] text-white  ">
 {/* compnaydetails */}
      <div className='pl-4 pt-2 flex gap-4 '>
        <div className='w-[50px] h-[50px] pt-2 '>
          <img src="/webnity-white.png" alt="" className='h-full w-full rounded-[2px]'/>
        </div>
   <div>
     <span className='text-[#0A66FF]'>Webnity</span> <span className='text-[#FF7A00]'>Global</span>
    <div className=''>Innovating The Digital Future</div>
   </div>
</div>
        {navItems.map((item) => (

          <SidebarGroup key={item.title} >
            <SidebarGroupLabel className="text-[#FF7A00]" >
                {item.title} 
            </SidebarGroupLabel>

            <SidebarGroupContent>

              <SidebarMenu>

                {item.items.map((subItem) => (

                  <SidebarMenuItem
                    key={subItem.title}
                  >

                    <SidebarMenuButton
                      asChild
                    >

                      <a href={subItem.url}>
                        {subItem.title}
                      </a>

                    </SidebarMenuButton>

                  </SidebarMenuItem>

                ))}

              </SidebarMenu>

            </SidebarGroupContent>

          </SidebarGroup>

        ))}

      </SidebarContent>
    </Sidebar>
  )
}

export default AppSidebar