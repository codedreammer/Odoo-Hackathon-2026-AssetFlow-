-- ============================================================
-- Seed sample notifications
-- Dynamically picks the first user from your profiles table
-- so no UUID needs to be hardcoded.
-- Run in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

DO $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Grab the first available user id from profiles
  SELECT id INTO v_user_id FROM profiles LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'No rows found in profiles table. Make sure you have signed up at least once before seeding.';
  END IF;

  INSERT INTO notifications (user_id, type, title, message, is_read, created_at)
  VALUES
    (
      v_user_id,
      'maintenance_approval',
      'Maintenance approval overdue',
      'MNT-002 (HP LaserJet M507) has been waiting for approval for 3 days. Last reminder sent Jan 10.',
      false,
      now() - interval '2 hours'
    ),
    (
      v_user_id,
      'audit_missing',
      'Asset missing from audit',
      'AST-009 (MacBook Air M2) was not scanned during the January audit. Last known location: HQ Floor 3.',
      false,
      now() - interval '4 hours'
    ),
    (
      v_user_id,
      'transfer_approved',
      'Transfer approved',
      'MacBook Pro 16" transfer from Engineering to Design was approved by Admin. Effective Jan 10.',
      false,
      now() - interval '6 hours'
    ),
    (
      v_user_id,
      'warranty_expiring',
      'Warranty expiring in 30 days',
      'Dell PowerEdge R750 (AST-005) warranty expires Feb 12, 2025. Consider renewal before the deadline.',
      true,
      now() - interval '1 day'
    ),
    (
      v_user_id,
      'booking_conflict',
      'Booking conflict detected',
      'Conference Room A has overlapping bookings on Jan 15 at 13:00–14:30. James Park and Maya Obi are both booked.',
      true,
      now() - interval '1 day'
    ),
    (
      v_user_id,
      'audit_completed',
      'Q4 audit completed',
      'Q4 2024 asset audit completed with a 98.2% compliance score. 3 discrepancies resolved, 0 outstanding.',
      true,
      now() - interval '2 days'
    );

  RAISE NOTICE 'Seeded 6 notifications for user_id: %', v_user_id;
END $$;

