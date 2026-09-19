import React, { Suspense, lazy } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// Auth Components
import Login from '@/pages/Login';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import ProtectedRoute from '@/components/ProtectedRoute';

// Layout
import AdminLayout from '@/layout/AdminLayout';

// Admin Panel Features (Lazy-loaded for optimal performance)
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const OrderManagement = lazy(() => import('@/pages/OrderManagement'));
const ProductManagement = lazy(() => import('@/pages/ProductManagement'));
const SalesReports = lazy(() => import('@/pages/SalesReports'));
const CodPrepaidCancelReports = lazy(() => import('@/pages/CodPrepaidCancelReports'));
const GoogleAnalyticsIntegration = lazy(() => import('@/pages/GoogleAnalyticsIntegration'));
const WhatsAppMarketingIntegration = lazy(() => import('@/pages/WhatsAppMarketingIntegration'));
const WhatsAppBotIntegration = lazy(() => import('@/pages/WhatsAppBotIntegration'));
const MetaAdsIntegration = lazy(() => import('@/pages/MetaAdsIntegration'));
const SubAdminManagement = lazy(() => import('@/pages/SubAdminManagement'));
const HeroBannerManagement = lazy(() => import('@/pages/HeroBannerManagement'));

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
            <AdminLayout />
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
          path="/hero-banners"
          element={
            <Suspense fallback={<PageLoader />}>
              <HeroBannerManagement />
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
        <Route
          path="/sub-admins"
          element={
            <Suspense fallback={<PageLoader />}>
              <SubAdminManagement />
            </Suspense>
          }
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default Approute;