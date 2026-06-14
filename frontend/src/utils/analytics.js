// utility for firing GA4 / Clarity events safely

export const trackEvent = (eventName, params = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
  
  if (typeof window !== 'undefined' && window.clarity) {
    window.clarity("set", eventName, JSON.stringify(params));
  }
};

export const trackProductView = (product) => {
  trackEvent('view_item', {
    currency: 'INR',
    value: product.salePrice || product.price,
    items: [
      {
        item_id: product.id,
        item_name: product.title,
        price: product.salePrice || product.price,
        item_category: product.categoryId || 'Case'
      }
    ]
  });
};

export const trackAddToCart = (product, quantity = 1) => {
  trackEvent('add_to_cart', {
    currency: 'INR',
    value: (product.salePrice || product.price) * quantity,
    items: [
      {
        item_id: product.id,
        item_name: product.title,
        price: product.salePrice || product.price,
        quantity: quantity
      }
    ]
  });
};

export const trackCheckoutStarted = (cartTotal, items) => {
  trackEvent('begin_checkout', {
    currency: 'INR',
    value: cartTotal,
    items: items.map(i => ({
      item_id: i.product.id,
      item_name: i.product.title,
      price: i.product.salePrice || i.product.price,
      quantity: i.quantity
    }))
  });
};

export const trackWhatsAppCheckout = (cartTotal) => {
  trackEvent('whatsapp_checkout_clicked', {
    currency: 'INR',
    value: cartTotal
  });
};

export const trackOrderCreated = (orderId, total, items) => {
  trackEvent('purchase', {
    transaction_id: orderId,
    currency: 'INR',
    value: total,
    items: items.map(i => ({
      item_id: i.product?.id || i.productId,
      item_name: i.product?.title || 'Unknown Product',
      price: i.price,
      quantity: i.quantity
    }))
  });
};

export const trackMysteryOrder = (tier, value) => {
  trackEvent('mystery_order_placed', {
    tier_name: tier,
    value: value
  });
};

export const trackLimitedEditionOrder = (editionName) => {
  trackEvent('limited_edition_order', {
    edition_name: editionName
  });
};
