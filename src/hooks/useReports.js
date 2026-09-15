import { useState, useEffect, useCallback } from "react";
import reportService from "../services/report.service";

export const useReports = (initialRange = "7d") => {
  const [selectedRange, setSelectedRange] = useState(
    typeof initialRange === "number" ? `${initialRange}d` : initialRange
  );
  const [customRange, setCustomRange] = useState(null);
  const [salesReport, setSalesReport] = useState(null);
  const [paymentReport, setPaymentReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [sales, payment] = await Promise.all([
        reportService.getSalesReport(selectedRange, customRange),
        reportService.getCodPrepaidCancelReport(selectedRange, customRange),
      ]);
      setSalesReport(sales);
      setPaymentReport(payment);
    } catch (err) {
      console.error("Failed to load reports in hook:", err);
      setError(err.message || "Failed to load reports");
    } finally {
      setIsLoading(false);
    }
  }, [selectedRange, customRange]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const exportSalesCSV = () => {
    if (salesReport?.revenueTrajectory && salesReport.revenueTrajectory.length > 0) {
      const rows = salesReport.revenueTrajectory.map((item) => ({
        Date: item.date,
        Orders_Count: item.orders,
        Gross_Revenue: item.gross,
        Net_Revenue: item.net,
        Average_Order_Value: item.orders > 0 ? Math.round(item.net / item.orders) : 0,
      }));
      reportService.exportToCSV(`sales_report_${selectedRange}`, rows);
    } else if (salesReport?.timeline) {
      reportService.exportToCSV(`sales_report_${selectedRange}`, salesReport.timeline);
    }
  };

  const exportCodCancelCSV = () => {
    if (paymentReport?.monthlyTrends && paymentReport.monthlyTrends.length > 0) {
      const rows = paymentReport.monthlyTrends.map((m) => ({
        Month: m.month,
        Prepaid_Orders: m.prepaidOrders,
        Prepaid_Amount: `₹${m.prepaidAmount}`,
        COD_Orders: m.codOrders,
        COD_Amount: `₹${m.codAmount}`,
        Cancelled_Orders: m.cancelledOrders,
        Cancelled_Amount: `₹${m.cancelledAmount}`,
        RTO_Orders: m.rtoOrders,
      }));
      reportService.exportToCSV(`cod_prepaid_cancel_report_${selectedRange}`, rows);
    } else if (paymentReport?.paymentStatusBreakdown) {
      reportService.exportToCSV("cod_prepaid_cancel_report", paymentReport.paymentStatusBreakdown);
    }
  };

  return {
    selectedRange,
    setSelectedRange,
    selectedDays: selectedRange,
    setSelectedDays: (days) => setSelectedRange(typeof days === "number" ? `${days}d` : days),
    customRange,
    setCustomRange,
    salesReport,
    paymentReport,
    isLoading,
    error,
    exportSalesCSV,
    exportCodCancelCSV,
    refresh: fetchReports,
  };
};

export default useReports;

