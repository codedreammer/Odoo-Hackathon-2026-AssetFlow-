-- ==========================================
-- AssetFlow Hackathon RLS Policies
-- ==========================================

-- Departments
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view departments" ON departments;
DROP POLICY IF EXISTS "Authenticated users can create departments" ON departments;
DROP POLICY IF EXISTS "Authenticated users can update departments" ON departments;

CREATE POLICY "Authenticated users can view departments"
ON departments
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can create departments"
ON departments
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update departments"
ON departments
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

------------------------------------------------------------

-- Asset Categories
ALTER TABLE asset_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view asset categories" ON asset_categories;
DROP POLICY IF EXISTS "Authenticated users can create asset categories" ON asset_categories;
DROP POLICY IF EXISTS "Authenticated users can update asset categories" ON asset_categories;

CREATE POLICY "Authenticated users can view asset categories"
ON asset_categories
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can create asset categories"
ON asset_categories
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update asset categories"
ON asset_categories
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

------------------------------------------------------------

-- Assets
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view assets" ON assets;
DROP POLICY IF EXISTS "Authenticated users can create assets" ON assets;
DROP POLICY IF EXISTS "Authenticated users can update assets" ON assets;

CREATE POLICY "Authenticated users can view assets"
ON assets
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can create assets"
ON assets
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update assets"
ON assets
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

------------------------------------------------------------

-- Asset Allocations
ALTER TABLE asset_allocations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view allocations" ON asset_allocations;
DROP POLICY IF EXISTS "Authenticated users can create allocations" ON asset_allocations;
DROP POLICY IF EXISTS "Authenticated users can update allocations" ON asset_allocations;

CREATE POLICY "Authenticated users can view allocations"
ON asset_allocations
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can create allocations"
ON asset_allocations
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update allocations"
ON asset_allocations
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

------------------------------------------------------------

-- Resource Bookings
ALTER TABLE resource_bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view bookings" ON resource_bookings;
DROP POLICY IF EXISTS "Authenticated users can create bookings" ON resource_bookings;
DROP POLICY IF EXISTS "Authenticated users can update bookings" ON resource_bookings;

CREATE POLICY "Authenticated users can view bookings"
ON resource_bookings
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can create bookings"
ON resource_bookings
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update bookings"
ON resource_bookings
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

------------------------------------------------------------

-- Maintenance Requests
ALTER TABLE maintenance_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view maintenance" ON maintenance_requests;
DROP POLICY IF EXISTS "Authenticated users can create maintenance" ON maintenance_requests;
DROP POLICY IF EXISTS "Authenticated users can update maintenance" ON maintenance_requests;

CREATE POLICY "Authenticated users can view maintenance"
ON maintenance_requests
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can create maintenance"
ON maintenance_requests
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update maintenance"
ON maintenance_requests
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

------------------------------------------------------------

-- Notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view notifications" ON notifications;

CREATE POLICY "Authenticated users can view notifications"
ON notifications
FOR SELECT
TO authenticated
USING (true);

------------------------------------------------------------

-- Activity Logs
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view activity logs" ON activity_logs;

CREATE POLICY "Authenticated users can view activity logs"
ON activity_logs
FOR SELECT
TO authenticated
USING (true);