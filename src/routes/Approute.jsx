import React, { Suspense, lazy } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// Auth Components
import Login from '@/components/common/Login';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import ProtectedRoute from '@/components/ProtectedRoute';

// Layout
import MainlayoutSuperAdmin from '@/layout/super-admin/MainlayoutSuperAdmin';

// Admin Panel Features (Lazy-loaded for optimal performance)
const Dashboard = lazy(() => import('@/pages/super-admin/Dashboard'));
const OrderManagement = lazy(() => import('@/pages/super-admin/OrderManagement'));
const ProductManagement = lazy(() => import('@/pages/super-admin/ProductManagement'));
const SalesReports = lazy(() => import('@/pages/super-admin/SalesReports'));
const CodPrepaidCancelReports = lazy(() => import('@/pages/super-admin/CodPrepaidCancelReports'));
const GoogleAnalyticsIntegration = lazy(() => import('@/pages/super-admin/GoogleAnalyticsIntegration'));
const WhatsAppMarketingIntegration = lazy(() => import('@/pages/super-admin/WhatsAppMarketingIntegration'));
const WhatsAppBotIntegration = lazy(() => import('@/pages/super-admin/WhatsAppBotIntegration'));
const MetaAdsIntegration = lazy(() => import('@/pages/super-admin/MetaAdsIntegration'));

const PageLoader = () => (
  <div className="h-[60vh] flex flex-col items-center justify-center gap-3 text-slate-400">
    <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
    <span className="text-xs font-medium tracking-wide">Loading module...</span>
  </div>
);

const Approute = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Protected Admin Panel Routes */}
      <Route
        element={
          <ProtectedRoute>
            <MainlayoutSuperAdmin />
          </ProtectedRoute>
        }
      >
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />
        <Route
          path="/dashboard"
          element={
            <Suspense fallback={<PageLoader />}>
              <Dashboard />
            </Suspense>
          }
        />
        <Route
          path="/orders"
          element={
            <Suspense fallback={<PageLoader />}>
              <OrderManagement />
            </Suspense>
          }
        />
        <Route
          path="/products"
          element={
            <Suspense fallback={<PageLoader />}>
              <ProductManagement />
            </Suspense>
          }
        />
        <Route
          path="/reports/sales"
          element={
            <Suspense fallback={<PageLoader />}>
              <SalesReports />
            </Suspense>
          }
        />
        <Route
          path="/reports/cod-prepaid-cancel"
          element={
            <Suspense fallback={<PageLoader />}>
              <CodPrepaidCancelReports />
            </Suspense>
          }
        />
        <Route
          path="/integrations/google-analytics"
          element={
            <Suspense fallback={<PageLoader />}>
              <GoogleAnalyticsIntegration />
            </Suspense>
          }
        />
        <Route
          path="/integrations/whatsapp-marketing"
          element={
            <Suspense fallback={<PageLoader />}>
              <WhatsAppMarketingIntegration />
            </Suspense>
          }
        />
        <Route
          path="/integrations/whatsapp-bot"
          element={
            <Suspense fallback={<PageLoader />}>
              <WhatsAppBotIntegration />
            </Suspense>
          }
        />
        <Route
          path="/integrations/meta-ads"
          element={
            <Suspense fallback={<PageLoader />}>
              <MetaAdsIntegration />
            </Suspense>
          }
        />

        {/* Legacy redirects */}
        <Route path="/super-admin/*" element={<Navigate to="/dashboard" replace />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default Approute;