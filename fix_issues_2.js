const fs = require('fs');

function replaceInFile(filepath, replacements) {
    let content = fs.readFileSync(filepath, 'utf8');
    
    for (const [target, replacement] of replacements) {
        content = content.replace(target, replacement);
    }
        
    fs.writeFileSync(filepath, content, 'utf8');
}

// Fix contexts with literal \n
for (const file of ['AdminDataContext.jsx', 'AuthContext.jsx', 'CartContext.jsx']) {
    const filepath = 'frontend/src/context/' + file;
    let content = fs.readFileSync(filepath, 'utf8');
    content = content.replace('/* eslint-disable react-refresh/only-export-components */\\n', '/* eslint-disable react-refresh/only-export-components */\n');
    fs.writeFileSync(filepath, content, 'utf8');
}

// 1. AdminInventory.jsx
replaceInFile('frontend/src/components/admin/AdminInventory.jsx', [
    [`import { useState } from 'react';\n`, `import { useState } from 'react';\n`]
]);
let inv = fs.readFileSync('frontend/src/components/admin/AdminInventory.jsx', 'utf8');
inv = inv.replace('  const { products } = useAdminData();\n', '');
fs.writeFileSync('frontend/src/components/admin/AdminInventory.jsx', inv, 'utf8');

// 2. AdminWhatsAppOrders.jsx
replaceInFile('frontend/src/components/admin/AdminWhatsAppOrders.jsx', [
    [`  const handleSync = async (e) => {`, `  const handleSync = async () => {`]
]);

// 3. AdminLayout.jsx
replaceInFile('frontend/src/components/layout/AdminLayout.jsx', [
    [`import { useState, useRef } from 'react';`, `import { useState } from 'react';`],
    [`let response;\n`, ``],
    [`response = 'Terminal cleared.';\n`, ``]
]);

// 4. NavDrawer.jsx
replaceInFile('frontend/src/components/layout/NavDrawer.jsx', [
    [`import { Link, useLocation } from 'react-router-dom';`, `import { Link } from 'react-router-dom';`]
]);

// 5. OrderSuccessPage.jsx
replaceInFile('frontend/src/pages/OrderSuccessPage.jsx', [
    [`import { useEffect, useRef, useState, useMemo } from 'react';`, `import { useEffect, useRef, useMemo } from 'react';`],
    [`  const orderId = useMemo(() => location.state?.orderId || \`CS-\${Date.now().toString().slice(-8)}\`, [location.state?.orderId]);`, `  const [orderIdRef] = useState(() => location.state?.orderId || \`CS-\${Date.now().toString().slice(-8)}\`);\n  const orderId = location.state?.orderId || orderIdRef;`]
]);

// 6. SearchPage.jsx
replaceInFile('frontend/src/pages/SearchPage.jsx', [
    [
`  useEffect(() => {
    if (searchParams.get('q')) doSearch(searchParams.get('q'));
  }, [searchParams, doSearch]);`,
`  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    if (searchParams.get('q')) doSearch(searchParams.get('q'));
  }, [searchParams, doSearch]);`
    ]
]);

// 7. WishlistContext.jsx
replaceInFile('frontend/src/context/WishlistContext.jsx', [
    [
`  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);`,
`  useEffect(() => {
    fetchWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);`
    ]
]);
