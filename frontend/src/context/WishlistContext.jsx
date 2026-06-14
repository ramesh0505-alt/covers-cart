/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!user?.id) {
      setWishlistItems([]);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('wishlist_items')
        .select('*, product:products(*)')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching wishlist:', error);
      } else {
        // filter out any records that failed to resolve a product
        setWishlistItems(data ? data.filter(item => item.product) : []);
      }
    } catch (err) {
      console.error('Unexpected error fetching wishlist:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isInWishlist = useCallback((productId) => {
    return wishlistItems.some(item => item.product_id === productId);
  }, [wishlistItems]);

  const toggleWishlist = useCallback(async (product) => {
    if (!user?.id) {
      toast.error('Please log in to add items to your wishlist.');
      return;
    }

    const existingItem = wishlistItems.find(item => item.product_id === product.id);

    if (existingItem) {
      // Remove
      try {
        const { error } = await supabase
          .from('wishlist_items')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', product.id);

        if (error) throw error;

        setWishlistItems(prev => prev.filter(item => item.product_id !== product.id));
        toast.success(`Removed ${product.title} from wishlist.`);
      } catch (err) {
        console.error('Error removing from wishlist:', err);
        toast.error('Could not update wishlist.');
      }
    } else {
      // Add
      try {
        const { data, error } = await supabase
          .from('wishlist_items')
          .insert({
            user_id: user.id,
            product_id: product.id
          })
          .select('*, product:products(*)')
          .single();

        if (error) throw error;

        setWishlistItems(prev => [...prev, data]);
        toast.success(`Saved ${product.title} to wishlist!`, { icon: '💖' });
      } catch (err) {
        console.error('Error adding to wishlist:', err);
        toast.error('Could not update wishlist.');
      }
    }
  }, [user, wishlistItems]);

  const clearWishlist = useCallback(async () => {
    if (!user?.id) return;
    try {
      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setWishlistItems([]);
      toast.success('Wishlist cleared.');
    } catch (err) {
      console.error('Error clearing wishlist:', err);
      toast.error('Could not clear wishlist.');
    }
  }, [user]);

  return (
    <WishlistContext.Provider value={{ wishlistItems, loading, isInWishlist, toggleWishlist, clearWishlist, refreshWishlist: fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
}
