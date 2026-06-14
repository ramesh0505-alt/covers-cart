import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './context/AuthContext';
import { AdminDataProvider } from './context/AdminDataContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminShell from './layouts/AdminShell';

import AdminLogin from './pages/AdminLogin';

const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const ProductsAdmin = lazy(() => import('./pages/admin/ProductsAdmin'));
const ProductEditor = lazy(() => import('./pages/admin/ProductEditor'));
const MediaLibrary = lazy(() => import('./pages/admin/MediaLibrary'));
const HomepageBuilder = lazy(() => import('./pages/admin/HomepageBuilder'));
const EventsManager = lazy(() => import('./pages/admin/EventsManager'));
const CategoriesAdmin = lazy(() => import('./pages/admin/CategoriesAdmin'));
const CollectionsAdmin = lazy(() => import('./pages/admin/CollectionsAdmin'));
const LimitedDropsAdmin = lazy(() => import('./pages/admin/LimitedDropsAdmin'));
const MysteryAdmin = lazy(() => import('./pages/admin/MysteryAdmin'));
const CouponsAdmin = lazy(() => import('./pages/admin/CouponsAdmin'));

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AdminDataProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                borderRadius: '0.75rem',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
              },
              success: { iconTheme: { primary: '#4648d4', secondary: '#fff' } },
              error: { iconTheme: { primary: '#ba1a1a', secondary: '#fff' } },
            }}
          />

          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#fbf8fc] text-sm font-bold animate-pulse text-[#4c4546]">
              Loading Admin Portal…
            </div>
          }>
            <Routes>
              {/* Public — admin-only login (separate from customer login) */}
              <Route path="/login" element={<AdminLogin />} />

              {/* Protected admin console */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <AdminShell />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboardPage embedded />} />
                <Route path="products" element={<ProductsAdmin />} />
                <Route path="products/new" element={<ProductEditor />} />
                <Route path="products/:id" element={<ProductEditor />} />
                <Route path="media" element={<MediaLibrary />} />
                <Route path="homepage" element={<HomepageBuilder />} />
                <Route path="events" element={<EventsManager />} />
                <Route path="categories" element={<CategoriesAdmin />} />
                <Route path="collections" element={<CollectionsAdmin />} />
                <Route path="drops" element={<LimitedDropsAdmin />} />
                <Route path="mystery" element={<MysteryAdmin />} />
                <Route path="coupons" element={<CouponsAdmin />} />
                <Route path="orders" element={<AdminDashboardPage embedded initialSection="orders" />} />
                <Route path="customers" element={<AdminDashboardPage embedded initialSection="customers" />} />
                <Route path="analytics" element={<AdminDashboardPage embedded initialSection="analytics-center" />} />
                <Route path="settings" element={<AdminDashboardPage embedded initialSection="settings" />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </AdminDataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
