-- ==============================================================================
-- DATABASE AUDIT AND RLS HARDENING SCRIPT
-- For Supabase / PostgreSQL instances.
-- Execute this directly in your Supabase SQL Editor.
-- ==============================================================================

-- 1. ADD MISSING INDEXES FOR PERFORMANCE
-- These indexes speed up lookups on frequently filtered columns.
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON "Order"("userId");
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON "OrderItem"("orderId");
CREATE INDEX IF NOT EXISTS idx_products_category_id ON "Product"("categoryId");
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON "Address"("userId");

-- 2. ENABLE ROW LEVEL SECURITY (RLS) ON ALL TABLES
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Address" ENABLE ROW LEVEL SECURITY;
-- Keep Product, Category, and Banner public (reads) but restrict writes.
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;

-- 3. CREATE RLS POLICIES FOR 'Order' TABLE
-- Users can only SELECT and INSERT their own orders.
CREATE POLICY "Users can view their own orders"
  ON "Order"
  FOR SELECT
  USING (auth.uid() = "userId");

CREATE POLICY "Users can insert their own orders"
  ON "Order"
  FOR INSERT
  WITH CHECK (auth.uid() = "userId" OR "userId" IS NULL);

-- 4. CREATE RLS POLICIES FOR 'Address' TABLE
-- Users can only manage their own addresses.
CREATE POLICY "Users can view their own addresses"
  ON "Address"
  FOR SELECT
  USING (auth.uid() = "userId");

CREATE POLICY "Users can manage their own addresses"
  ON "Address"
  FOR ALL
  USING (auth.uid() = "userId");

-- 5. CREATE RLS POLICIES FOR 'Product' TABLE
-- Anyone can view products. Only Admins (handled by backend API with secret key) can insert/update.
CREATE POLICY "Anyone can view products"
  ON "Product"
  FOR SELECT
  USING (true);

-- Backend API operations bypass RLS using the service_role key, so we don't need
-- complex Postgres roles for Admin inserts unless doing direct client-side Admin edits.

-- ==============================================================================
-- AUDIT CHECK COMPLETE
-- ==============================================================================
