import api from "../api/axios.js";

const initialMockOrders = [
  {
    id: "WMS-1082",
    orderNumber: "ORD-94812",
    createdAt: "2026-09-11T10:30:00Z",
    customer: {
      name: "Rohit Verma",
      email: "rohit.verma@example.com",
      phone: "+91 98765 43210",
      city: "Mumbai",
      address: "B-402, Sea Breeze Apts, Bandra West, Mumbai, MH - 400050",
    },
    items: [
      { name: "Ultimate Snack Box (400g)", quantity: 2, price: 749, total: 1498 },
      { name: "Hello Cube (250g)", quantity: 1, price: 349, total: 349 },
    ],
    totalAmount: 1847,
    paymentMethod: "Prepaid",
    paymentStatus: "Paid",
    orderStatus: "Processing",
    awbNumber: "SR109283741",
    courier: "Delhivery Surface",
  },
  {
    id: "WMS-1081",
    orderNumber: "ORD-94811",
    createdAt: "2026-09-11T08:15:00Z",
    customer: {
      name: "Ananya Sharma",
      email: "ananya.s@example.com",
      phone: "+91 98231 11223",
      city: "Bengaluru",
      address: "12, 4th Cross, Indiranagar, Bengaluru, KA - 560038",
    },
    items: [
      { name: "Multi Seed Cube (500g)", quantity: 1, price: 649, total: 649 },
    ],
    totalAmount: 649,
    paymentMethod: "COD",
    paymentStatus: "Pending",
    orderStatus: "Pending",
    awbNumber: "Pending Assignment",
    courier: "Shiprocket Express",
  },
  {
    id: "WMS-1080",
    orderNumber: "ORD-94810",
    createdAt: "2026-09-10T19:45:00Z",
    customer: {
      name: "Vikram Malhotra",
      email: "vikram.m@example.com",
      phone: "+91 97112 34567",
      city: "New Delhi",
      address: "E-18, Greater Kailash 1, New Delhi, DL - 110048",
    },
    items: [
      { name: "Ultimate Snack Box (1kg)", quantity: 1, price: 849, total: 849 },
      { name: "Multi Seed Cube (250g)", quantity: 2, price: 349, total: 698 },
    ],
    totalAmount: 1547,
    paymentMethod: "Prepaid",
    paymentStatus: "Paid",
    orderStatus: "Shipped",
    awbNumber: "SR109283112",
    courier: "BlueDart Express",
  },
  {
    id: "WMS-1079",
    orderNumber: "ORD-94809",
    createdAt: "2026-09-10T14:20:00Z",
    customer: {
      name: "Pooja Hegde",
      email: "pooja.h@example.com",
      phone: "+91 99887 76655",
      city: "Hyderabad",
      address: "Flat 301, Jubilee Hills, Hyderabad, TS - 500033",
    },
    items: [
      { name: "Hello Cube (500g)", quantity: 1, price: 649, total: 649 },
    ],
    totalAmount: 649,
    paymentMethod: "COD",
    paymentStatus: "Paid on Delivery",
    orderStatus: "Delivered",
    awbNumber: "SR109282900",
    courier: "Delhivery Surface",
  },
  {
    id: "WMS-1078",
    orderNumber: "ORD-94808",
    createdAt: "2026-09-09T16:10:00Z",
    customer: {
      name: "Karan Singh",
      email: "karan.singh@example.com",
      phone: "+91 94567 89012",
      city: "Jaipur",
      address: "74, Malviya Nagar, Jaipur, RJ - 302017",
    },
    items: [
      { name: "Multi Seed Cube (250g)", quantity: 1, price: 349, total: 349 },
    ],
    totalAmount: 349,
    paymentMethod: "COD",
    paymentStatus: "Cancelled",
    orderStatus: "Cancelled",
    cancelReason: "Customer requested cancellation (Ordered by mistake)",
    awbNumber: "N/A",
    courier: "Shiprocket Express",
  },
  {
    id: "WMS-1077",
    orderNumber: "ORD-94807",
    createdAt: "2026-09-09T11:00:00Z",
    customer: {
      name: "Meera Patel",
      email: "meera.patel@example.com",
      phone: "+91 98223 34455",
      city: "Ahmedabad",
      address: "Shivalik Heights, Bodakdev, Ahmedabad, GJ - 380054",
    },
    items: [
      { name: "Ultimate Snack Box (400g)", quantity: 3, price: 749, total: 2247 },
    ],
    totalAmount: 2247,
    paymentMethod: "Prepaid",
    paymentStatus: "Paid",
    orderStatus: "Delivered",
    awbNumber: "SR109281874",
    courier: "BlueDart Air",
  },
  {
    id: "WMS-1076",
    orderNumber: "ORD-94806",
    createdAt: "2026-09-08T13:40:00Z",
    customer: {
      name: "Siddharth Roy",
      email: "siddharth.r@example.com",
      phone: "+91 91234 56789",
      city: "Kolkata",
      address: "Salt Lake Sector V, Kolkata, WB - 700091",
    },
    items: [
      { name: "Hello Cube (250g)", quantity: 2, price: 349, total: 698 },
    ],
    totalAmount: 698,
    paymentMethod: "COD",
    paymentStatus: "Failed / Returned",
    orderStatus: "Cancelled",
    cancelReason: "RTO - Customer refused delivery at doorstep",
    awbNumber: "SR109280455",
    courier: "Delhivery Surface",
  },
  {
    id: "WMS-1075",
    orderNumber: "ORD-94805",
    createdAt: "2026-09-07T18:30:00Z",
    customer: {
      name: "Neha Joshi",
      email: "neha.j@example.com",
      phone: "+91 99112 23344",
      city: "Pune",
      address: "Koregaon Park Road, Pune, MH - 411001",
    },
    items: [
      { name: "Ultimate Snack Box (1kg)", quantity: 2, price: 849, total: 1698 },
    ],
    totalAmount: 1698,
    paymentMethod: "Prepaid",
    paymentStatus: "Paid",
    orderStatus: "Delivered",
    awbNumber: "SR109279120",
    courier: "Delhivery Air",
  },
];

let storedOrders = null;

export const orderService = {
  getAllOrders: async () => {
    try {
      const response = await api.get("/orders/my-orders");
      if (response.data && Array.isArray(response.data.orders) && response.data.orders.length > 0) {
        return response.data.orders;
      }
    } catch {
      // Fallback
    }

    if (!storedOrders) {
      const saved = localStorage.getItem("wms_admin_orders");
      storedOrders = saved ? JSON.parse(saved) : initialMockOrders;
    }
    return storedOrders;
  },

  updateOrderStatus: async (orderId, newStatus) => {
    if (!storedOrders) {
      storedOrders = [...initialMockOrders];
    }
    storedOrders = storedOrders.map((order) =>
      order.id === orderId || order.orderNumber === orderId
        ? {
            ...order,
            orderStatus: newStatus,
            paymentStatus:
              newStatus === "Delivered" && order.paymentMethod === "COD"
                ? "Paid on Delivery"
                : newStatus === "Cancelled"
                ? "Cancelled"
                : order.paymentStatus,
          }
        : order
    );
    localStorage.setItem("wms_admin_orders", JSON.stringify(storedOrders));
    return { success: true, orders: storedOrders };
  },

  getOrderStats: async () => {
    const orders = await orderService.getAllOrders();
    const totalOrders = orders.length;
    const deliveredOrders = orders.filter((o) => o.orderStatus === "Delivered");
    const pendingOrders = orders.filter((o) => o.orderStatus === "Pending" || o.orderStatus === "Processing");
    const cancelledOrders = orders.filter((o) => o.orderStatus === "Cancelled");
    const totalRevenue = deliveredOrders.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
    const codOrders = orders.filter((o) => o.paymentMethod === "COD");
    const prepaidOrders = orders.filter((o) => o.paymentMethod === "Prepaid");

    return {
      totalOrders,
      pendingCount: pendingOrders.length,
      deliveredCount: deliveredOrders.length,
      cancelledCount: cancelledOrders.length,
      totalRevenue,
      averageOrderValue: totalOrders ? Math.round(totalRevenue / (deliveredOrders.length || 1)) : 0,
      codCount: codOrders.length,
      prepaidCount: prepaidOrders.length,
    };
  },
};

export default orderService;
