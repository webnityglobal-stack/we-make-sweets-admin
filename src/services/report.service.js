export const reportService = {
  getSalesReport: (days = 7, customRange = null) => {
    const periodDays = customRange ? customRange.daysCount || 7 : days;
    const today = new Date();
    const timeline = [];

    let totalGrossSales = 0;
    let totalOrders = 0;
    let totalDiscounts = 0;

    for (let i = periodDays - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });

      // Realistic sweet store sales distribution
      const baseSales = 8500 + Math.floor(Math.sin(i * 1.5) * 3200) + (i % 3 === 0 ? 4500 : 0);
      const ordersCount = Math.max(4, Math.floor(baseSales / 650));
      const discounts = Math.floor(baseSales * 0.08);
      const netSales = baseSales - discounts;

      totalGrossSales += baseSales;
      totalOrders += ordersCount;
      totalDiscounts += discounts;

      timeline.push({
        date: dateStr,
        grossSales: baseSales,
        netSales: netSales,
        orders: ordersCount,
        discounts: discounts,
      });
    }

    const netRevenue = totalGrossSales - totalDiscounts;
    const aov = totalOrders > 0 ? Math.round(netRevenue / totalOrders) : 0;

    const topProducts = [
      { name: "Ultimate Snack Box (400g)", unitsSold: Math.floor(totalOrders * 0.42), revenue: Math.floor(netRevenue * 0.45) },
      { name: "Hello Cube (250g)", unitsSold: Math.floor(totalOrders * 0.35), revenue: Math.floor(netRevenue * 0.32) },
      { name: "Multi Seed Cube (500g)", unitsSold: Math.floor(totalOrders * 0.23), revenue: Math.floor(netRevenue * 0.23) },
    ];

    return {
      period: customRange ? "Custom Range" : `Last ${days} Days`,
      totalGrossSales,
      netRevenue,
      totalOrders,
      totalDiscounts,
      averageOrderValue: aov,
      timeline,
      topProducts,
    };
  },

  getCodPrepaidCancelReport: () => {
    return {
      summary: {
        totalOrders: 320,
        codOrders: 180,
        prepaidOrders: 140,
        cancelledOrders: 28,
        rtoCount: 14,
        codRevenue: 134200,
        prepaidRevenue: 121800,
        cancelledLoss: 21500,
        codSharePercent: 56.2,
        prepaidSharePercent: 43.8,
        rtoRatePercent: 7.7,
        cancellationRatePercent: 8.75,
      },
      paymentStatusBreakdown: [
        { mode: "Prepaid - UPI / Cards", count: 140, amount: 121800, successRate: "98.5%", rtoRate: "1.2%" },
        { mode: "COD (Cash On Delivery)", count: 180, amount: 134200, successRate: "89.2%", rtoRate: "7.7%" },
      ],
      cancellationReasons: [
        { reason: "Customer refused delivery at doorstep (COD)", count: 14, percentage: 50 },
        { reason: "Customer ordered by mistake / cancelled before dispatch", count: 7, percentage: 25 },
        { reason: "Customer unreachable by delivery courier", count: 4, percentage: 14.3 },
        { reason: "Delivery delayed beyond promise date", count: 3, percentage: 10.7 },
      ],
      monthlyTrends: [
        { month: "May", cod: 140, prepaid: 90, cancel: 18 },
        { month: "Jun", cod: 160, prepaid: 110, cancel: 20 },
        { month: "Jul", cod: 155, prepaid: 125, cancel: 22 },
        { month: "Aug", cod: 175, prepaid: 135, cancel: 25 },
        { month: "Sep (Current)", cod: 180, prepaid: 140, cancel: 28 },
      ],
    };
  },

  exportToCSV: (filename, rows) => {
    if (!rows || !rows.length) return;
    const keys = Object.keys(rows[0]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        keys.join(","),
        ...rows.map((row) =>
          keys
            .map((k) => `"${String(row[k] ?? "").replace(/"/g, '""')}"`)
            .join(",")
        ),
      ].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};

export default reportService;
