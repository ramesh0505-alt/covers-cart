import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import { ServerStatusBanner } from './hooks/useServerStatus';

// Pages
import LoginPage  from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage   from './pages/HomePage';
import AccountPage from './pages/AccountPage';
import OrdersPage from './pages/OrdersPage';
import WishlistPage from './pages/WishlistPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import MysteryPouchPage from './pages/MysteryPouchPage';
import MysteryDropPage from './pages/MysteryDropPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import RewardsPage from './pages/RewardsPage';
import RevealPage from './pages/RevealPage';
import SpinWheelPage from './pages/SpinWheelPage';

// Lazy loaded heavy components
const CustomizePage = lazy(() => import('./pages/CustomizePage'));
const CommunityPage = lazy(() => import('./pages/CommunityPage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));


import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ContactPage from './pages/ContactPage';

import LimitedEditionPage from './pages/LimitedEditionPage';
import LimitedCasesPage from './pages/LimitedCasesPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import SearchPage from './pages/SearchPage';

export default function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              {/* Backend offline banner — shown globally */}
              <ServerStatusBanner />

            {/* Global toast notifications */}
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
                error:   { iconTheme: { primary: '#ba1a1a', secondary: '#fff' } },
              }}
            />

            <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#fbf8fc] text-sm font-bold animate-pulse text-[#4c4546]">Loading CoverScart...</div>}>
              <Routes>
                {/* ── Public routes ─────────────────────────────────── */}
              <Route path="/login"  element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />

              {/* ── Protected Storefront routes (Any logged-in user) ── */}
              <Route path="/" element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              } />
              <Route path="/shop" element={
                <ProtectedRoute>
                  <ShopPage />
                </ProtectedRoute>
              } />
              <Route path="/product/:id" element={
                <ProtectedRoute>
                  <ProductDetailsPage />
                </ProtectedRoute>
              } />
              <Route path="/mystery" element={
                <ProtectedRoute>
                  <MysteryPouchPage />
                </ProtectedRoute>
              } />
              <Route path="/mystery-drop" element={
                <ProtectedRoute>
                  <MysteryDropPage />
                </ProtectedRoute>
              } />
              <Route path="/cart" element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              } />
              <Route path="/checkout" element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              } />
              <Route path="/account" element={
                <ProtectedRoute>
                  <AccountPage />
                </ProtectedRoute>
              } />
              <Route path="/contact" element={
                <ProtectedRoute>
                  <ContactPage />
                </ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              } />
              <Route path="/wishlist" element={
                <ProtectedRoute>
                  <WishlistPage />
                </ProtectedRoute>
              } />
              <Route path="/community" element={
                <ProtectedRoute>
                  <CommunityPage />
                </ProtectedRoute>
              } />
              <Route path="/rewards" element={
                <ProtectedRoute>
                  <RewardsPage />
                </ProtectedRoute>
              } />
              <Route path="/reveal" element={
                <ProtectedRoute>
                  <RevealPage />
                </ProtectedRoute>
              } />
              <Route path="/spin" element={
                <ProtectedRoute>
                  <SpinWheelPage />
                </ProtectedRoute>
              } />
              <Route path="/customize" element={
                <ProtectedRoute>
                  <CustomizePage />
                </ProtectedRoute>
              } />
              <Route path="/limited" element={
                <ProtectedRoute>
                  <LimitedEditionPage />
                </ProtectedRoute>
              } />
              <Route path="/limited/browse" element={
                <ProtectedRoute>
                  <LimitedCasesPage />
                </ProtectedRoute>
              } />
              <Route path="/order-success" element={
                <ProtectedRoute>
                  <OrderSuccessPage />
                </ProtectedRoute>
              } />
              <Route path="/search" element={
                <ProtectedRoute>
                  <SearchPage />
                </ProtectedRoute>
              } />



                {/* Catch-all → home (ProtectedRoute will redirect if needed) */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
  </BrowserRouter>
  );
}
