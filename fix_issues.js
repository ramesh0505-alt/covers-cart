const fs = require('fs');

function replaceInFile(filepath, replacements) {
    let content = fs.readFileSync(filepath, 'utf8');
    
    for (const [target, replacement] of replacements) {
        content = content.replace(target, replacement);
    }
        
    fs.writeFileSync(filepath, content, 'utf8');
}

// 1. AdminDashboardPage.jsx
replaceInFile('frontend/src/pages/AdminDashboardPage.jsx', [
    [
`  const [activeSection, setActiveSection] = useState(initialSection);
  const [prevInitialSection, setPrevInitialSection] = useState(initialSection);

  // Sync active section if URL navigation triggers changes without useEffect cascading render
  if (initialSection !== prevInitialSection) {
    setPrevInitialSection(initialSection);
    setActiveSection(initialSection);
  }`,
`  const [activeSection, setActiveSection] = useState(initialSection);`
    ],
    [
`    auditLogs,
    mysteryTiers,
    storeSettings,`,
`    auditLogs,
    mysteryTiers,
    spinWheel,
    storeSettings,`
    ]
]);

// 2. OrderSuccessPage.jsx
replaceInFile('frontend/src/pages/OrderSuccessPage.jsx', [
    [
`import { useEffect, useRef, useState } from 'react';`,
`import { useEffect, useRef, useState, useMemo } from 'react';`
    ],
    [
`  const [orderId] = useState(() => location.state?.orderId || \`CS-\${Date.now().toString().slice(-8)}\`);`,
`  const orderId = useMemo(() => location.state?.orderId || \`CS-\${Date.now().toString().slice(-8)}\`, [location.state?.orderId]);`
    ]
]);

// 3. SearchPage.jsx
replaceInFile('frontend/src/pages/SearchPage.jsx', [
    [
`import { useState, useEffect } from 'react';`,
`import { useState, useEffect, useCallback } from 'react';`
    ],
    [
`  const doSearch = async (q) => {
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
  }, []);`,
`  const doSearch = useCallback(async (q) => {
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
  }, [searchParams, doSearch]);`
    ]
]);

// ESLint fixes
// App.jsx
replaceInFile('frontend/src/App.jsx', [
    [
`import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminCategoriesPage from './pages/AdminCategoriesPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminSettingsPage from './pages/AdminSettingsPage';`,
``
    ]
]);

// AdminDeviceDatabase.jsx
replaceInFile('frontend/src/components/admin/AdminDeviceDatabase.jsx', [
    [
`  const [artworks, setArtworks] = useState([`,`  const [artworks] = useState([`
    ]
]);

// AdminGiftsReferrals.jsx
replaceInFile('frontend/src/components/admin/AdminGiftsReferrals.jsx', [
    [
`  const [referrals, setReferrals] = useState([`,`  const [referrals] = useState([`
    ]
]);

// AdminInventory.jsx
replaceInFile('frontend/src/components/admin/AdminInventory.jsx', [
    [
`  const { products } = useAdminData();\n`,
``
    ],
    [
`  const [ledger, setLedger] = useState([`,`  const [ledger] = useState([`
    ]
]);

// AdminLoyalty.jsx
replaceInFile('frontend/src/components/admin/AdminLoyalty.jsx', [
    [
`  const [tiers, setTiers] = useState([`,`  const [tiers] = useState([`
    ]
]);

// AdminMerchandising.jsx
replaceInFile('frontend/src/components/admin/AdminMerchandising.jsx', [
    [
`  const [zeroSearches, setZeroSearches] = useState([`,`  const [zeroSearches] = useState([`
    ],
    [
`  const [popularSearches, setPopularSearches] = useState([`,`  const [popularSearches] = useState([`
    ]
]);

// AdminRoles.jsx
replaceInFile('frontend/src/components/admin/AdminRoles.jsx', [
    [
`  const [team, setTeam] = useState([`,`  const [team] = useState([`
    ]
]);

// AdminSales.jsx
replaceInFile('frontend/src/components/admin/AdminSales.jsx', [
    [
`  const [refunds, setRefunds] = useState([`,`  const [refunds] = useState([`
    ]
]);

// AdminWarehouseSupplier.jsx
replaceInFile('frontend/src/components/admin/AdminWarehouseSupplier.jsx', [
    [
`  const [suppliers, setSuppliers] = useState([`,`  const [suppliers] = useState([`
    ]
]);

// AdminWhatsAppOrders.jsx
replaceInFile('frontend/src/components/admin/AdminWhatsAppOrders.jsx', [
    [
`  const handleSync = async (e) => {`,
`  const handleSync = async () => {`
    ]
]);

// AdminLayout.jsx
replaceInFile('frontend/src/components/layout/AdminLayout.jsx', [
    [
`import { useState, useRef } from 'react';`,
`import { useState } from 'react';`
    ],
    [
`      let response;
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
        response = \`Command not recognized: \${cmd}\`;
        setTerminalLogs(prev => [...prev, { type: 'error', text: response }]);
      }`,
`      if (cmd.includes('clear')) {
        setTerminalLogs([]);
      } else if (cmd.includes('ping')) {
        setTerminalLogs(prev => [...prev, { type: 'system', text: 'PONG 20ms' }]);
      } else if (cmd.includes('db status')) {
        setTerminalLogs(prev => [...prev, { type: 'system', text: 'Database connected. Latency: 14ms.' }]);
      } else {
        setTerminalLogs(prev => [...prev, { type: 'error', text: \`Command not recognized: \${cmd}\` }]);
      }`
    ]
]);

// NavDrawer.jsx
replaceInFile('frontend/src/components/layout/NavDrawer.jsx', [
    [
`import { Link, useLocation } from 'react-router-dom';`,
`import { Link } from 'react-router-dom';`
    ],
    [
`import { useCart } from '../../context/CartContext';\n`,
``
    ]
]);

// AdminDataContext.jsx
replaceInFile('frontend/src/context/AdminDataContext.jsx', [
    [
`// Coupons State
  const [coupons, setCoupons] = useState(() => {`,
`// Coupons State
  const [coupons] = useState(() => {`
    ],
    [
`// Warehouses State
  const [warehouses, setWarehouses] = useState(() => {`,
`// Warehouses State
  const [warehouses] = useState(() => {`
    ],
    [
`// RMAs State
  const [rmas, setRmas] = useState(() => {`,
`// RMAs State
  const [rmas] = useState(() => {`
    ],
    [
`// Subscriptions State
  const [subscriptions, setSubscriptions] = useState(() => {`,
`// Subscriptions State
  const [subscriptions] = useState(() => {`
    ],
    [
`/* eslint-disable react-refresh/only-export-components */\n`,
``
    ]
]);

// Prepend the eslint-disable rule for react-refresh to contexts
for (const file of ['AdminDataContext.jsx', 'AuthContext.jsx', 'CartContext.jsx']) {
    const filepath = 'frontend/src/context/' + file;
    let content = fs.readFileSync(filepath, 'utf8');
    if (!content.startsWith('/* eslint-disable react-refresh/only-export-components */')) {
        content = '/* eslint-disable react-refresh/only-export-components */\\n' + content;
        fs.writeFileSync(filepath, content, 'utf8');
    }
}

// CartContext.jsx empty block
replaceInFile('frontend/src/context/CartContext.jsx', [
    [
`  } catch (error) {
  }`,
`  } catch (error) {
    console.error(error);
  }`
    ]
]);

// WishlistContext.jsx set-state-in-effect
replaceInFile('frontend/src/context/WishlistContext.jsx', [
    [
`  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);`,
`  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);`
    ]
]);

console.log("Replacements done.");
