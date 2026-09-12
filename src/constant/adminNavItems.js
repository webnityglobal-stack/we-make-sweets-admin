export const adminNavItems = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: "LayoutDashboard",
      },
    ],
  },
  {
    title: "Store Management",
    items: [
      {
        title: "Order Management",
        url: "/orders",
        icon: "ShoppingCart",
      },
      {
        title: "Product Management",
        url: "/products",
        icon: "Package",
      },
    ],
  },
  {
    title: "Analytics & Reports",
    items: [
      {
        title: "Sales Reports",
        subtitle: "7/15/30 Days & Custom",
        url: "/reports/sales",
        icon: "TrendingUp",
      },
      {
        title: "COD / Prepaid / Cancel Reports",
        subtitle: "RTO & Payment Insights",
        url: "/reports/cod-prepaid-cancel",
        icon: "CreditCard",
      },
    ],
  },
  // {
  //   title: "Integrations & APIs",
  //   items: [
  //     {
  //       title: "Google Analytics",
  //       url: "/integrations/google-analytics",
  //       icon: "BarChart3",
  //     },
  //     {
  //       title: "WhatsApp Marketing API",
  //       subtitle: "Client Credentials",
  //       url: "/integrations/whatsapp-marketing",
  //       icon: "MessageSquare",
  //     },
  //     {
  //       title: "WhatsApp Bot",
  //       subtitle: "Client Credentials",
  //       url: "/integrations/whatsapp-bot",
  //       icon: "Bot",
  //     },
  //     {
  //       title: "Meta Ads Integration",
  //       subtitle: "Client Credentials",
  //       url: "/integrations/meta-ads",
  //       icon: "Megaphone",
  //     },
  //   ],
  // },
  {
    title: "Team & Administration",
    items: [
      {
        title: "Sub-Admins",
        subtitle: "Shared Dashboard Access",
        url: "/sub-admins",
        icon: "UserCheck",
      },
    ],
  },
];