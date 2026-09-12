import { useState, useEffect, useCallback } from "react";
import reportService from "../services/report.service";

export const useReports = (initialDays = 7) => {
  const [selectedDays, setSelectedDays] = useState(initialDays);
  const [customRange, setCustomRange] = useState(null);
  const [salesReport, setSalesReport] = useState(null);
  const [paymentReport, setPaymentReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReports = useCallback(() => {
    setIsLoading(true);
    try {
      const sales = reportService.getSalesReport(selectedDays, customRange);
      const payment = reportService.getCodPrepaidCancelReport();
      setSalesReport(sales);
      setPaymentReport(payment);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDays, customRange]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const exportSalesCSV = () => {
    if (!salesReport?.timeline) return;
    reportService.exportToCSV(`sales_report_${selectedDays}_days`, salesReport.timeline);
  };

  const exportCodCancelCSV = () => {
    if (!paymentReport?.paymentStatusBreakdown) return;
    reportService.exportToCSV("cod_prepaid_cancel_report", paymentReport.paymentStatusBreakdown);
  };

  return {
    selectedDays,
    setSelectedDays,
    customRange,
    setCustomRange,
    salesReport,
    paymentReport,
    isLoading,
    exportSalesCSV,
    exportCodCancelCSV,
    refresh: fetchReports,
  };
};

export default useReports;
