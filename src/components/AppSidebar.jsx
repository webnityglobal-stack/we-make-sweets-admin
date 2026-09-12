import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from './ui/sidebar';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  TrendingUp,
  CreditCard,
  BarChart3,
  MessageSquare,
  Bot,
  Megaphone,
  UserCheck,
  Store,
  Sparkles,
} from 'lucide-react';

const iconMap = {
  LayoutDashboard: LayoutDashboard,
  ShoppingCart: ShoppingCart,
  Package: Package,
  TrendingUp: TrendingUp,
  CreditCard: CreditCard,
  BarChart3: BarChart3,
  MessageSquare: MessageSquare,
  Bot: Bot,
  Megaphone: Megaphone,
  UserCheck: UserCheck,
};

const AppSidebar = ({ navItems, ...props }) => {
  const location = useLocation();

  return (
    <Sidebar {...props} className="border-r border-slate-800 bg-[#070e28] text-white">
      <SidebarContent className="bg-[#070e28] text-slate-200 px-2 py-3 flex flex-col justify-between">
        <div>
          {/* Brand Header */}
          <div className="px-3 py-3 mb-4 rounded-xl bg-gradient-to-r from-pink-900/40 via-purple-900/30 to-amber-900/30 border border-pink-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-amber-500 flex items-center justify-center shadow-lg shadow-pink-500/20 text-white font-bold text-lg">
                🍬
              </div>
              <div className="overflow-hidden">
                <div className="font-bold text-white text-base tracking-tight leading-tight flex items-center gap-1.5">
                  We Make Sweets
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="text-[11px] text-pink-300 font-medium">
                  Admin Panel
                </div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
              <span>Solution by Webnity</span>
              <span className="bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded text-[9px] font-semibold">
                Live Store
              </span>
            </div>
          </div>

          {/* Navigation Groups */}
          {navItems.map((group) => (
            <SidebarGroup key={group.title} className="py-1">
              <SidebarGroupLabel className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 px-3 mb-1">
                {group.title}
              </SidebarGroupLabel>

              <SidebarGroupContent>
                <SidebarMenu className="gap-1">
                  {group.items.map((subItem) => {
                    const IconComponent = iconMap[subItem.icon] || Store;
                    const isActive = location.pathname === subItem.url;

                    return (
                      <SidebarMenuItem key={subItem.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          className={`w-full rounded-lg px-3 py-2.5 transition-all text-sm flex items-center gap-3 ${
                            isActive
                              ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white font-medium shadow-md shadow-pink-600/20'
                              : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                          }`}
                        >
                          <Link to={subItem.url} className="flex items-center gap-3 w-full">
                            <IconComponent
                              className={`w-4 h-4 flex-shrink-0 ${
                                isActive ? 'text-white' : 'text-slate-400'
                              }`}
                            />
                            <div className="flex flex-col text-left overflow-hidden">
                              <span className="truncate leading-tight font-medium">
                                {subItem.title}
                              </span>
                              {subItem.subtitle && (
                                <span className={`text-[10px] truncate ${isActive ? 'text-pink-100' : 'text-slate-400'}`}>
                                  {subItem.subtitle}
                                </span>
                              )}
                            </div>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </div>

        {/* Footer info */}
        <div className="p-3 text-[11px] text-slate-400 border-t border-slate-800/80 flex items-center justify-between">
          <span>v2.4.0</span>
          <span className="text-slate-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Connected
          </span>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;