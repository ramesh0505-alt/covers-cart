import os
import re

def replace_in_file(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for target, replacement in replacements:
        content = content.replace(target, replacement)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

# 1. AdminDashboardPage.jsx
replace_in_file('frontend/src/pages/AdminDashboardPage.jsx', [
    (
'''  const [activeSection, setActiveSection] = useState(initialSection);
  const [prevInitialSection, setPrevInitialSection] = useState(initialSection);

  // Sync active section if URL navigation triggers changes without useEffect cascading render
  if (initialSection !== prevInitialSection) {
    setPrevInitialSection(initialSection);
    setActiveSection(initialSection);
  }''',
'''  const [activeSection, setActiveSection] = useState(initialSection);'''
    ),
    (
'''    auditLogs,
    mysteryTiers,
    storeSettings,''',
'''    auditLogs,
    mysteryTiers,
    spinWheel,
    storeSettings,'''
    )
])

# 2. OrderSuccessPage.jsx
replace_in_file('frontend/src/pages/OrderSuccessPage.jsx', [
    (
'''import { useEffect, useRef, useState } from 'react';''',
'''import { useEffect, useRef, useState, useMemo } from 'react';'''
    ),
    (
'''  const [orderId] = useState(() => location.state?.orderId || `CS-${Date.now().toString().slice(-8)}`);''',
'''  const orderId = useMemo(() => location.state?.orderId || `CS-${Date.now().toString().slice(-8)}`, [location.state?.orderId]);'''
    )
])

# 3. SearchPage.jsx
replace_in_file('frontend/src/pages/SearchPage.jsx', [
    (
'''import { useState, useEffect } from 'react';''',
'''import { useState, useEffect, useCallback } from 'react';'''
    ),
    (
'''  const doSearch = async (q) => {
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const { data } = await API.get('/products');
      const filtered = data.filter(
        (p) =>
          p.title?.toLowerCase().includes(q.toLowerCase()) ||
          p.description?.toLowerCase().includes(q.toLowerCase()) ||
          p.deviceModels?.some((m) => m.toLowerCase().includes(q.toLowerCase()))
      );
      setProducts(filtered);
    } catch {
      toast.error('Search failed. Please try again.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-search when landing with ?q=
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    if (searchParams.get('q')) doSearch(searchParams.get('q'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);''',
'''  const doSearch = useCallback(async (q) => {
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const { data } = await API.get('/products');
      const filtered = data.filter(
        (p) =>
          p.title?.toLowerCase().includes(q.toLowerCase()) ||
          p.description?.toLowerCase().includes(q.toLowerCase()) ||
          p.deviceModels?.some((m) => m.toLowerCase().includes(q.toLowerCase()))
      );
      setProducts(filtered);
    } catch {
      toast.error('Search failed. Please try again.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-search when landing with ?q=
  useEffect(() => {
    if (searchParams.get('q')) doSearch(searchParams.get('q'));
  }, [searchParams, doSearch]);'''
    )
])

# ESLint fixes
# App.jsx
replace_in_file('frontend/src/App.jsx', [
    (
'''import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminCategoriesPage from './pages/AdminCategoriesPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminSettingsPage from './pages/AdminSettingsPage';''',
''''''
    )
])

# AdminDeviceDatabase.jsx
replace_in_file('frontend/src/components/admin/AdminDeviceDatabase.jsx', [
    (
'''  const [artworks, setArtworks] = useState([''','''  const [artworks] = useState(['''
    )
])

# AdminGiftsReferrals.jsx
replace_in_file('frontend/src/components/admin/AdminGiftsReferrals.jsx', [
    (
'''  const [referrals, setReferrals] = useState([''','''  const [referrals] = useState(['''
    )
])

# AdminInventory.jsx
replace_in_file('frontend/src/components/admin/AdminInventory.jsx', [
    (
'''  const { products } = useAdminData();''',
''''''
    ),
    (
'''  const [ledger, setLedger] = useState([''','''  const [ledger] = useState(['''
    )
])

# AdminLoyalty.jsx
replace_in_file('frontend/src/components/admin/AdminLoyalty.jsx', [
    (
'''  const [tiers, setTiers] = useState([''','''  const [tiers] = useState(['''
    )
])

# AdminMerchandising.jsx
replace_in_file('frontend/src/components/admin/AdminMerchandising.jsx', [
    (
'''  const [zeroSearches, setZeroSearches] = useState([''','''  const [zeroSearches] = useState(['''
    ),
    (
'''  const [popularSearches, setPopularSearches] = useState([''','''  const [popularSearches] = useState(['''
    )
])

# AdminRoles.jsx
replace_in_file('frontend/src/components/admin/AdminRoles.jsx', [
    (
'''  const [team, setTeam] = useState([''','''  const [team] = useState(['''
    )
])

# AdminSales.jsx
replace_in_file('frontend/src/components/admin/AdminSales.jsx', [
    (
'''  const [refunds, setRefunds] = useState([''','''  const [refunds] = useState(['''
    )
])

# AdminWarehouseSupplier.jsx
replace_in_file('frontend/src/components/admin/AdminWarehouseSupplier.jsx', [
    (
'''  const [suppliers, setSuppliers] = useState([''','''  const [suppliers] = useState(['''
    )
])

# AdminWhatsAppOrders.jsx
replace_in_file('frontend/src/components/admin/AdminWhatsAppOrders.jsx', [
    (
'''  const handleSync = async (e) => {''',
'''  const handleSync = async () => {'''
    )
])

# AdminLayout.jsx
replace_in_file('frontend/src/components/layout/AdminLayout.jsx', [
    (
'''import { useState, useRef } from 'react';''',
'''import { useState } from 'react';'''
    ),
    (
'''      let response;
      if (cmd.includes('clear')) {
        setTerminalLogs([]);
        response = 'Terminal cleared.';
      } else if (cmd.includes('ping')) {
        response = 'PONG 20ms';
        setTerminalLogs(prev => [...prev, { type: 'system', text: response }]);
      } else if (cmd.includes('db status')) {
        response = 'Database connected. Latency: 14ms.';
        setTerminalLogs(prev => [...prev, { type: 'system', text: response }]);
      } else {
        response = `Command not recognized: ${cmd}`;
        setTerminalLogs(prev => [...prev, { type: 'error', text: response }]);
      }''',
'''      if (cmd.includes('clear')) {
        setTerminalLogs([]);
      } else if (cmd.includes('ping')) {
        setTerminalLogs(prev => [...prev, { type: 'system', text: 'PONG 20ms' }]);
      } else if (cmd.includes('db status')) {
        setTerminalLogs(prev => [...prev, { type: 'system', text: 'Database connected. Latency: 14ms.' }]);
      } else {
        setTerminalLogs(prev => [...prev, { type: 'error', text: `Command not recognized: ${cmd}` }]);
      }'''
    )
])

# NavDrawer.jsx
replace_in_file('frontend/src/components/layout/NavDrawer.jsx', [
    (
'''import { Link, useLocation } from 'react-router-dom';''',
'''import { Link } from 'react-router-dom';'''
    ),
    (
'''import { useCart } from '../../context/CartContext';''',
''''''
    )
])

# AdminDataContext.jsx
replace_in_file('frontend/src/context/AdminDataContext.jsx', [
    (
'''// Coupons State
  const [coupons, setCoupons] = useState(() => {''',
'''// Coupons State
  const [coupons] = useState(() => {'''
    ),
    (
'''// Warehouses State
  const [warehouses, setWarehouses] = useState(() => {''',
'''// Warehouses State
  const [warehouses] = useState(() => {'''
    ),
    (
'''// RMAs State
  const [rmas, setRmas] = useState(() => {''',
'''// RMAs State
  const [rmas] = useState(() => {'''
    ),
    (
'''// Subscriptions State
  const [subscriptions, setSubscriptions] = useState(() => {''',
'''// Subscriptions State
  const [subscriptions] = useState(() => {'''
    ),
    (
'''/* eslint-disable react-refresh/only-export-components */\n''',
''''''
    )
])

# Prepend the eslint-disable rule for react-refresh to contexts
for file in ['AdminDataContext.jsx', 'AuthContext.jsx', 'CartContext.jsx']:
    filepath = f'frontend/src/context/{file}'
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    if not content.startswith('/* eslint-disable react-refresh/only-export-components */'):
        content = '/* eslint-disable react-refresh/only-export-components */\n' + content
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

# CartContext.jsx empty block
replace_in_file('frontend/src/context/CartContext.jsx', [
    (
'''  } catch (error) {
  }''',
'''  } catch (error) {
    console.error(error);
  }'''
    )
])

print("Replacements done.")
