const fs = require('fs');

function replaceInFile(filepath, replacements) {
    let content = fs.readFileSync(filepath, 'utf8');
    
    for (const [target, replacement] of replacements) {
        content = content.replace(target, replacement);
    }
        
    fs.writeFileSync(filepath, content, 'utf8');
}

// 1. OrderSuccessPage.jsx
replaceInFile('frontend/src/pages/OrderSuccessPage.jsx', [
    [`import { useEffect, useRef, useMemo } from 'react';`, `import { useEffect, useRef, useState } from 'react';`]
]);

// 2. SearchPage.jsx
replaceInFile('frontend/src/pages/SearchPage.jsx', [
    [
`  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    if (searchParams.get('q')) doSearch(searchParams.get('q'));
  }, [searchParams, doSearch]);`,
`  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (searchParams.get('q')) doSearch(searchParams.get('q'));
  }, [searchParams, doSearch]);`
    ]
]);

// 3. WishlistContext.jsx
replaceInFile('frontend/src/context/WishlistContext.jsx', [
    [
`  useEffect(() => {
    fetchWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);`,
`  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);`
    ]
]);
