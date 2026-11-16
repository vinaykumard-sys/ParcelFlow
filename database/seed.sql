-- ============================================================================
-- PARCELFLOW SEED DATA (database/seed.sql)
-- Comprehensive seed data matching user reference:
-- Societies: Lakeview Residency, Greenview Heights, Skyline Apartments, Maple Residency
-- Towers: Tower A, Tower B, Tower C
-- Staff: Ramesh K, Suresh P, Manoj T (12 total staff members)
-- Residents: Arjun Kumar, Priya Sharma, Rahul Verma, Sneha Iyer
-- Parcels: PF-8921-IN, PF-8922-IN, PF-8923-IN (+ lifecycle test parcels)
-- Storage Racks: Rack A, Rack B
-- Pickup Slots: 6:00-6:30, 6:30-7:00, 7:00-7:30, 8:00-8:30, 9:00-9:30
-- App Versions: 0.1.0 for Android, iOS, Web
-- ============================================================================

-- Triggers and foreign keys are preserved in valid dependency order

-- ----------------------------------------------------------------------------
-- 1. SOCIETIES
-- ----------------------------------------------------------------------------
INSERT INTO public.societies (id, name, code, address, city, state, postal_code, total_towers, total_flats, hub_phone, hub_operating_hours, settings, is_active)
VALUES
    (
        'a1111111-1111-1111-1111-111111111111',
        'Lakeview Residency',
        'LVR-BLR',
        'Outer Ring Road, Bellandur',
        'Bengaluru',
        'Karnataka',
        '560103',
        3,
        450,
        '+91 80 4120 7801',
        '06:30 AM - 11:30 PM',
        '{"allow_courier_direct_gate": true, "auto_notify_whatsapp": true, "require_otp_handover": true, "sms_fallback": true}'::jsonb,
        true
    ),
    (
        'a2222222-2222-2222-2222-222222222222',
        'Greenview Heights',
        'GVH-BLR',
        '24th Main, Sector 1, HSR Layout',
        'Bengaluru',
        'Karnataka',
        '560102',
        3,
        380,
        '+91 80 4120 7802',
        '07:00 AM - 11:00 PM',
        '{"allow_courier_direct_gate": true, "auto_notify_whatsapp": true, "require_otp_handover": true, "sms_fallback": true}'::jsonb,
        true
    ),
    (
        'a3333333-3333-3333-3333-333333333333',
        'Skyline Apartments',
        'SKA-BLR',
        'Sarjapur Main Road',
        'Bengaluru',
        'Karnataka',
        '560035',
        4,
        520,
        '+91 80 4120 7803',
        '07:00 AM - 10:30 PM',
        '{"allow_courier_direct_gate": false, "auto_notify_whatsapp": true, "require_otp_handover": true, "sms_fallback": false}'::jsonb,
        true
    ),
    (
        'a4444444-4444-4444-4444-444444444444',
        'Maple Residency',
        'MPR-BLR',
        'Whitefield Main Road',
        'Bengaluru',
        'Karnataka',
        '560066',
        2,
        240,
        '+91 80 4120 7804',
        '07:30 AM - 10:00 PM',
        '{"allow_courier_direct_gate": true, "auto_notify_whatsapp": true, "require_otp_handover": true, "sms_fallback": true}'::jsonb,
        true
    )
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    address = EXCLUDED.address,
    hub_phone = EXCLUDED.hub_phone;

-- ----------------------------------------------------------------------------
-- 2. APARTMENTS (Towers A, B, C for Lakeview & Greenview)
-- ----------------------------------------------------------------------------
INSERT INTO public.apartments (id, society_id, tower, floor, unit_number, intercom_number, is_active)
VALUES
    -- Lakeview Residency (Towers A, B, C)
    ('f1010001-0000-0000-0000-000000000001', 'a1111111-1111-1111-1111-111111111111', 'Tower A', 4, 'A-402', '1402', true),
    ('f1010001-0000-0000-0000-000000000002', 'a1111111-1111-1111-1111-111111111111', 'Tower A', 2, 'A-203', '1203', true),
    ('f1010001-0000-0000-0000-000000000003', 'a1111111-1111-1111-1111-111111111111', 'Tower A', 10, 'A-1004', '1004', true),
    ('f1010001-0000-0000-0000-000000000004', 'a1111111-1111-1111-1111-111111111111', 'Tower B', 1, 'B-104', '2104', true),
    ('f1010001-0000-0000-0000-000000000005', 'a1111111-1111-1111-1111-111111111111', 'Tower B', 5, 'B-502', '2502', true),
    ('f1010001-0000-0000-0000-000000000006', 'a1111111-1111-1111-1111-111111111111', 'Tower C', 8, 'C-801', '3801', true),
    ('f1010001-0000-0000-0000-000000000007', 'a1111111-1111-1111-1111-111111111111', 'Tower C', 3, 'C-305', '3305', true),

    -- Greenview Heights
    ('f2020001-0000-0000-0000-000000000001', 'a2222222-2222-2222-2222-222222222222', 'Tower A', 4, 'A-402', '4402', true),
    ('f2020001-0000-0000-0000-000000000002', 'a2222222-2222-2222-2222-222222222222', 'Tower B', 1, 'B-104', '4104', true),
    ('f2020001-0000-0000-0000-000000000003', 'a2222222-2222-2222-2222-222222222222', 'Tower C', 8, 'C-801', '4801', true)
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 3. USERS (Admin, Staff, Residents)
-- ----------------------------------------------------------------------------
INSERT INTO public.users (id, email, phone, full_name, role, avatar_url, is_active)
VALUES
    -- Admin
    ('b0000000-0000-0000-0000-000000000000', 'admin@parcelflow.in', '+91 98450 00001', 'Vikram Malhotra', 'ADMIN', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', true),

    -- 12 Staff Members (Ramesh K, Suresh P, Manoj T, etc.)
    ('b1111111-1111-1111-1111-111111111111', 'ramesh.k@parcelflow.in', '+91 98451 11001', 'Ramesh K', 'STAFF', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', true),
    ('b2222222-2222-2222-2222-222222222222', 'suresh.p@parcelflow.in', '+91 98451 11002', 'Suresh P', 'STAFF', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', true),
    ('b3333333-3333-3333-3333-333333333333', 'manoj.t@parcelflow.in', '+91 98451 11003', 'Manoj T', 'STAFF', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150', true),
    ('b4444444-4444-4444-4444-444444444444', 'anil.d@parcelflow.in', '+91 98451 11004', 'Anil Deshmukh', 'STAFF', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', true),
    ('b5555555-5555-5555-5555-555555555555', 'kavita.n@parcelflow.in', '+91 98451 11005', 'Kavita Nair', 'STAFF', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', true),
    ('b6666666-6666-6666-6666-666666666666', 'rajesh.y@parcelflow.in', '+91 98451 11006', 'Rajesh Yadav', 'STAFF', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', true),
    ('b7777777-7777-7777-7777-777777777777', 'deepak.c@parcelflow.in', '+91 98451 11007', 'Deepak Chauhan', 'STAFF', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150', true),
    ('b8888888-8888-8888-8888-888888888888', 'santosh.r@parcelflow.in', '+91 98451 11008', 'Santosh Rao', 'STAFF', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', true),
    ('b9999999-9999-9999-9999-999999999999', 'pooja.s@parcelflow.in', '+91 98451 11009', 'Pooja Singh', 'STAFF', 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=150', true),
    ('baaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'vijay.m@parcelflow.in', '+91 98451 11010', 'Vijay Murthy', 'STAFF', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150', true),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'arun.b@parcelflow.in', '+91 98451 11011', 'Arun Barua', 'STAFF', 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150', true),
    ('bcccccccc-cccc-cccc-cccc-cccccccccccc', 'sunil.g@parcelflow.in', '+91 98451 11012', 'Sunil Gowda', 'STAFF', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150', true),

    -- Residents (Arjun Kumar, Priya Sharma, Rahul Verma, Sneha Iyer)
    ('d1111111-1111-1111-1111-111111111111', 'arjun.kumar@gmail.com', '+91 98860 12345', 'Arjun Kumar', 'RESIDENT', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150', true),
    ('d2222222-2222-2222-2222-222222222222', 'priya.sharma@gmail.com', '+91 98860 23456', 'Priya Sharma', 'RESIDENT', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', true),
    ('d3333333-3333-3333-3333-333333333333', 'rahul.verma@outlook.com', '+91 98860 34567', 'Rahul Verma', 'RESIDENT', 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150', true),
    ('d4444444-4444-4444-4444-444444444444', 'sneha.iyer@gmail.com', '+91 98860 45678', 'Sneha Iyer', 'RESIDENT', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', true)
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 4. STAFF ROSTER (12 Members across Security, Hub, Maintenance)
-- ----------------------------------------------------------------------------
INSERT INTO public.staff (id, user_id, society_id, badge_number, designation, shift, is_active)
VALUES
    ('c1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'STAFF-HUB-01', 'Hub Supervisor', 'Morning (07:00 - 15:00)', true),
    ('c2222222-2222-2222-2222-222222222222', 'b2222222-2222-2222-2222-222222222222', 'a1111111-1111-1111-1111-111111111111', 'STAFF-SEC-02', 'Security & Gate Dispatch', 'Evening (15:00 - 23:00)', true),
    ('c3333333-3333-3333-3333-333333333333', 'b3333333-3333-3333-3333-333333333333', 'a1111111-1111-1111-1111-111111111111', 'STAFF-HUB-03', 'Parcel Specialist', 'Evening (15:00 - 23:00)', true),
    ('c4444444-4444-4444-4444-444444444444', 'b4444444-4444-4444-4444-444444444444', 'a1111111-1111-1111-1111-111111111111', 'STAFF-SEC-04', 'Gate Lead Officer', 'Morning (07:00 - 15:00)', true),
    ('c5555555-5555-5555-5555-555555555555', 'b5555555-5555-5555-5555-555555555555', 'a1111111-1111-1111-1111-111111111111', 'STAFF-HUB-05', 'Inventory Controller', 'Morning (07:00 - 15:00)', true),
    ('c6666666-6666-6666-6666-666666666666', 'b6666666-6666-6666-6666-666666666666', 'a1111111-1111-1111-1111-111111111111', 'STAFF-MNT-06', 'Hardware & Locker Tech', 'Flexible', true),
    ('c7777777-7777-7777-7777-777777777777', 'b7777777-7777-7777-7777-777777777777', 'a1111111-1111-1111-1111-111111111111', 'STAFF-SEC-07', 'Night Security Guard', 'Night (23:00 - 07:00)', true),
    ('c8888888-8888-8888-8888-888888888888', 'b8888888-8888-8888-8888-888888888888', 'a1111111-1111-1111-1111-111111111111', 'STAFF-HUB-08', 'Handover Specialist', 'Evening (15:00 - 23:00)', true),
    ('c9999999-9999-9999-9999-999999999999', 'b9999999-9999-9999-9999-999999999999', 'a1111111-1111-1111-1111-111111111111', 'STAFF-MNT-09', 'Facility Coordinator', 'Morning (07:00 - 15:00)', true),
    ('caaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'baaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a1111111-1111-1111-1111-111111111111', 'STAFF-SEC-10', 'Entry Barrier Monitor', 'Morning (07:00 - 15:00)', true),
    ('cbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'a1111111-1111-1111-1111-111111111111', 'STAFF-HUB-11', 'Dispatch Associate', 'Evening (15:00 - 23:00)', true),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'bcccccccc-cccc-cccc-cccc-cccccccccccc', 'a1111111-1111-1111-1111-111111111111', 'STAFF-SEC-12', 'Relief Guard', 'Flexible', true)
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 5. RESIDENTS
-- ----------------------------------------------------------------------------
INSERT INTO public.residents (id, user_id, society_id, apartment_id, is_primary, emergency_contact, delivery_preferences)
VALUES
    (
        'e1111111-1111-1111-1111-111111111111',
        'd1111111-1111-1111-1111-111111111111',
        'a1111111-1111-1111-1111-111111111111',
        'f1010001-0000-0000-0000-000000000001', -- A-402
        true,
        '+91 98860 99991',
        '{"allow_locker": true, "allow_security_drop": true, "sms_alerts": true, "whatsapp_alerts": true, "preferred_pickup_window": "20:00-20:30"}'::jsonb
    ),
    (
        'e2222222-2222-2222-2222-222222222222',
        'd2222222-2222-2222-2222-222222222222',
        'a1111111-1111-1111-1111-111111111111',
        'f1010001-0000-0000-0000-000000000004', -- B-104
        true,
        '+91 98860 99992',
        '{"allow_locker": true, "allow_security_drop": false, "sms_alerts": true, "whatsapp_alerts": true, "preferred_pickup_window": "18:30-19:00"}'::jsonb
    ),
    (
        'e3333333-3333-3333-3333-333333333333',
        'd3333333-3333-3333-3333-333333333333',
        'a1111111-1111-1111-1111-111111111111',
        'f1010001-0000-0000-0000-000000000006', -- C-801
        true,
        '+91 98860 99993',
        '{"allow_locker": true, "allow_security_drop": true, "sms_alerts": false, "whatsapp_alerts": true, "preferred_pickup_window": "19:00-19:30"}'::jsonb
    ),
    (
        'e4444444-4444-4444-4444-444444444444',
        'd4444444-4444-4444-4444-444444444444',
        'a1111111-1111-1111-1111-111111111111',
        'f1010001-0000-0000-0000-000000000002', -- A-203
        true,
        '+91 98860 99994',
        '{"allow_locker": true, "allow_security_drop": true, "sms_alerts": true, "whatsapp_alerts": true, "preferred_pickup_window": "21:00-21:30"}'::jsonb
    )
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 6. STORAGE LOCATIONS (Racks A & B)
-- ----------------------------------------------------------------------------
INSERT INTO public.storage_locations (id, society_id, zone, rack, shelf, compartment_type, is_occupied)
VALUES
    -- Rack A (Shelves A-01 through A-10)
    ('s0000001-0000-0000-0000-000000000001', 'a1111111-1111-1111-1111-111111111111', 'Hub Alpha', 'Rack A', 'Shelf A-01', 'SMALL', false),
    ('s0000001-0000-0000-0000-000000000002', 'a1111111-1111-1111-1111-111111111111', 'Hub Alpha', 'Rack A', 'Shelf A-02', 'MEDIUM', false),
    ('s0000001-0000-0000-0000-000000000003', 'a1111111-1111-1111-1111-111111111111', 'Hub Alpha', 'Rack A', 'Shelf A-03', 'MEDIUM', true), -- Occupied by PF-8922-IN
    ('s0000001-0000-0000-0000-000000000004', 'a1111111-1111-1111-1111-111111111111', 'Hub Alpha', 'Rack A', 'Shelf A-04', 'LARGE', false),
    ('s0000001-0000-0000-0000-000000000005', 'a1111111-1111-1111-1111-111111111111', 'Hub Alpha', 'Rack A', 'Shelf A-05', 'SMALL', false),
    ('s0000001-0000-0000-0000-000000000006', 'a1111111-1111-1111-1111-111111111111', 'Hub Alpha', 'Rack A', 'Shelf A-06', 'MEDIUM', false),
    ('s0000001-0000-0000-0000-000000000007', 'a1111111-1111-1111-1111-111111111111', 'Hub Alpha', 'Rack A', 'Shelf A-07', 'SECURE_LOCKER', false),
    ('s0000001-0000-0000-0000-000000000008', 'a1111111-1111-1111-1111-111111111111', 'Hub Alpha', 'Rack A', 'Shelf A-08', 'COLD_STORAGE', false),

    -- Rack B (Shelves B-01 through B-12)
    ('s0000002-0000-0000-0000-000000000001', 'a1111111-1111-1111-1111-111111111111', 'Hub Alpha', 'Rack B', 'Shelf B-01', 'SMALL', false),
    ('s0000002-0000-0000-0000-000000000002', 'a1111111-1111-1111-1111-111111111111', 'Hub Alpha', 'Rack B', 'Shelf B-02', 'MEDIUM', false),
    ('s0000002-0000-0000-0000-000000000003', 'a1111111-1111-1111-1111-111111111111', 'Hub Alpha', 'Rack B', 'Shelf B-03', 'LARGE', false),
    ('s0000002-0000-0000-0000-000000000004', 'a1111111-1111-1111-1111-111111111111', 'Hub Alpha', 'Rack B', 'Shelf B-04', 'MEDIUM', false),
    ('s0000002-0000-0000-0000-000000000008', 'a1111111-1111-1111-1111-111111111111', 'Hub Alpha', 'Rack B', 'Shelf B-08', 'MEDIUM', true), -- Occupied by PF-8921-IN
    ('s0000002-0000-0000-0000-000000000012', 'a1111111-1111-1111-1111-111111111111', 'Hub Alpha', 'Rack B', 'Shelf B-12', 'LARGE', true)   -- Occupied by PF-8923-IN
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 7. PICKUP SLOTS (Today and Daily Recurring)
-- ----------------------------------------------------------------------------
INSERT INTO public.pickup_slots (id, society_id, slot_date, start_time, end_time, max_capacity, current_bookings_count, status)
VALUES
    ('sl000001-0000-0000-0000-000000000001', 'a1111111-1111-1111-1111-111111111111', CURRENT_DATE, '18:00:00', '18:30:00', 25, 4, 'AVAILABLE'),
    ('sl000001-0000-0000-0000-000000000002', 'a1111111-1111-1111-1111-111111111111', CURRENT_DATE, '18:30:00', '19:00:00', 25, 8, 'AVAILABLE'),
    ('sl000001-0000-0000-0000-000000000003', 'a1111111-1111-1111-1111-111111111111', CURRENT_DATE, '19:00:00', '19:30:00', 30, 12, 'AVAILABLE'),
    ('sl000001-0000-0000-0000-000000000004', 'a1111111-1111-1111-1111-111111111111', CURRENT_DATE, '20:00:00', '20:30:00', 30, 18, 'AVAILABLE'),
    ('sl000001-0000-0000-0000-000000000005', 'a1111111-1111-1111-1111-111111111111', CURRENT_DATE, '21:00:00', '21:30:00', 20, 6, 'AVAILABLE')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 8. PARCELS (PF-8921-IN, PF-8922-IN, PF-8923-IN and lifecycle tests)
-- ----------------------------------------------------------------------------
INSERT INTO public.parcels (
    id, tracking_number, carrier_name, courier_tracking_id, courier_phone, courier_rider_name,
    society_id, apartment_id, resident_id, storage_location_id, status, description,
    category, weight_kg, dimensions, is_fragile, is_perishable, received_at, received_by_staff_id
)
VALUES
    -- Parcel 1: PF-8921-IN (Arjun Kumar, Scheduled 8:00 - 8:30 PM, Shelf B-08)
    (
        'p1111111-1111-1111-1111-111111111111',
        'PF-8921-IN',
        'Amazon',
        'AMZN-IN-88912903',
        '+91 91234 56789',
        'Mohan Lal',
        'a1111111-1111-1111-1111-111111111111',
        'f1010001-0000-0000-0000-000000000001',
        'e1111111-1111-1111-1111-111111111111',
        's0000002-0000-0000-0000-000000000008', -- Shelf B-08
        'SCHEDULED',
        'Wireless Bluetooth Noise-Cancelling Headphones',
        'ELECTRONICS',
        0.90,
        '{"length": 22, "width": 16, "height": 9}'::jsonb,
        true,
        false,
        NOW() - INTERVAL '3 hours',
        'c1111111-1111-1111-1111-111111111111'
    ),
    -- Parcel 2: PF-8922-IN (Priya Sharma, Ready for Pickup, Shelf A-03)
    (
        'p2222222-2222-2222-2222-222222222222',
        'PF-8922-IN',
        'Myntra',
        'MYN-BLR-401923',
        '+91 91234 56790',
        'Kishore Kumar',
        'a1111111-1111-1111-1111-111111111111',
        'f1010001-0000-0000-0000-000000000004',
        'e2222222-2222-2222-2222-222222222222',
        's0000001-0000-0000-0000-000000000003', -- Shelf A-03
        'READY_FOR_PICKUP',
        'Athletic Running Shoes & Apparel',
        'CLOTHING',
        1.40,
        '{"length": 32, "width": 20, "height": 12}'::jsonb,
        false,
        false,
        NOW() - INTERVAL '2 hours',
        'c2222222-2222-2222-2222-222222222222'
    ),
    -- Parcel 3: PF-8923-IN (Rahul Verma, Stored, Shelf B-12)
    (
        'p3333333-3333-3333-3333-333333333333',
        'PF-8923-IN',
        'Blue Dart',
        'BD-EXP-772109',
        '+91 91234 56791',
        'Girish N',
        'a1111111-1111-1111-1111-111111111111',
        'f1010001-0000-0000-0000-000000000006',
        'e3333333-3333-3333-3333-333333333333',
        's0000002-0000-0000-0000-000000000012', -- Shelf B-12
        'STORED',
        'Financial Documents & Bank Cheque Books',
        'DOCUMENT',
        2.20,
        '{"length": 35, "width": 25, "height": 8}'::jsonb,
        false,
        false,
        NOW() - INTERVAL '1 hour',
        'c3333333-3333-3333-3333-333333333333'
    ),
    -- Parcel 4: PF-8924-IN (Sneha Iyer, Completed Handover)
    (
        'p4444444-4444-4444-4444-444444444444',
        'PF-8924-IN',
        'Flipkart',
        'FK-IN-10928374',
        '+91 91234 56792',
        'Tanveer S',
        'a1111111-1111-1111-1111-111111111111',
        'f1010001-0000-0000-0000-000000000002',
        'e4444444-4444-4444-4444-444444444444',
        NULL,
        'COMPLETED',
        'Kitchen Cookware Set',
        'GENERAL',
        3.10,
        '{"length": 40, "width": 30, "height": 20}'::jsonb,
        false,
        false,
        NOW() - INTERVAL '8 hours',
        'c1111111-1111-1111-1111-111111111111'
    )
ON CONFLICT (id) DO NOTHING;

-- Link occupied storage locations to their active parcels
UPDATE public.storage_locations SET current_parcel_id = 'p1111111-1111-1111-1111-111111111111' WHERE id = 's0000002-0000-0000-0000-000000000008';
UPDATE public.storage_locations SET current_parcel_id = 'p2222222-2222-2222-2222-222222222222' WHERE id = 's0000001-0000-0000-0000-000000000003';
UPDATE public.storage_locations SET current_parcel_id = 'p3333333-3333-3333-3333-333333333333' WHERE id = 's0000002-0000-0000-0000-000000000012';

-- ----------------------------------------------------------------------------
-- 9. PICKUP BOOKINGS
-- ----------------------------------------------------------------------------
INSERT INTO public.pickup_bookings (id, parcel_id, pickup_slot_id, resident_id, booking_status, scheduled_time_window, notes)
VALUES
    (
        'b0000001-0000-0000-0000-000000000001',
        'p1111111-1111-1111-1111-111111111111',
        'sl000001-0000-0000-0000-000000000004', -- 20:00 - 20:30
        'e1111111-1111-1111-1111-111111111111',
        'CONFIRMED',
        '8:00 PM – 8:30 PM',
        'Will collect right after evening gym session.'
    )
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 10. HANDOVER TOKENS (OTP & QR)
-- ----------------------------------------------------------------------------
INSERT INTO public.handover_tokens (id, parcel_id, resident_id, token_code, otp_code, qr_code_data, status, expires_at)
VALUES
    (
        't1111111-1111-1111-1111-111111111111',
        'p1111111-1111-1111-1111-111111111111',
        'e1111111-1111-1111-1111-111111111111',
        'PF-TOKEN-7492',
        '7492',
        'PF://VERIFY?pkg=PF-8921-IN&otp=7492&apt=A-402&ts=' || EXTRACT(EPOCH FROM NOW())::TEXT,
        'ACTIVE',
        NOW() + INTERVAL '24 hours'
    ),
    (
        't2222222-2222-2222-2222-222222222222',
        'p2222222-2222-2222-2222-222222222222',
        'e2222222-2222-2222-2222-222222222222',
        'PF-TOKEN-3194',
        '3194',
        'PF://VERIFY?pkg=PF-8922-IN&otp=3194&apt=B-104&ts=' || EXTRACT(EPOCH FROM NOW())::TEXT,
        'ACTIVE',
        NOW() + INTERVAL '24 hours'
    )
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 11. PARCEL AUDIT & STATUS EVENTS
-- ----------------------------------------------------------------------------
INSERT INTO public.parcel_events (id, parcel_id, from_status, to_status, description, actor_name, actor_role, metadata, event_time)
VALUES
    (
        'ev000001-0000-0000-0000-000000000001',
        'p1111111-1111-1111-1111-111111111111',
        NULL,
        'RECEIVED',
        'Courier Mohan Lal checked in package at Society Hub Gate',
        'Suresh P',
        'STAFF',
        '{"courier": "Amazon", "gate": "Main Entry 1"}'::jsonb,
        NOW() - INTERVAL '3 hours'
    ),
    (
        'ev000001-0000-0000-0000-000000000002',
        'p1111111-1111-1111-1111-111111111111',
        'RECEIVED',
        'STORED',
        'Placed in Storage Rack B, Shelf B-08 by supervisor',
        'Ramesh K',
        'STAFF',
        '{"rack": "Rack B", "shelf": "Shelf B-08"}'::jsonb,
        NOW() - INTERVAL '2 hours 45 minutes'
    ),
    (
        'ev000001-0000-0000-0000-000000000003',
        'p1111111-1111-1111-1111-111111111111',
        'STORED',
        'NOTIFIED',
        'Notification sent to resident Arjun Kumar via WhatsApp & In-App',
        'ParcelFlow Bot',
        'SYSTEM',
        '{"channels": ["WHATSAPP", "IN_APP"]}'::jsonb,
        NOW() - INTERVAL '2 hours 44 minutes'
    ),
    (
        'ev000001-0000-0000-0000-000000000004',
        'p1111111-1111-1111-1111-111111111111',
        'NOTIFIED',
        'SCHEDULED',
        'Resident scheduled pickup window for 8:00 PM – 8:30 PM',
        'Arjun Kumar',
        'RESIDENT',
        '{"slot": "20:00-20:30", "token": "PF-TOKEN-7492"}'::jsonb,
        NOW() - INTERVAL '1 hour 30 minutes'
    )
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 12. NOTIFICATIONS
-- ----------------------------------------------------------------------------
INSERT INTO public.notifications (id, user_id, society_id, parcel_id, type, title, body, channel, status)
VALUES
    (
        'n1111111-1111-1111-1111-111111111111',
        'd1111111-1111-1111-1111-111111111111', -- Arjun
        'a1111111-1111-1111-1111-111111111111',
        'p1111111-1111-1111-1111-111111111111',
        'SLOT_SCHEDULED',
        'Pickup Scheduled for 8:00 PM',
        'Your Amazon parcel is scheduled for pickup at Shelf B-08. Show OTP 7492 at the counter.',
        'IN_APP',
        'SENT'
    ),
    (
        'n2222222-2222-2222-2222-222222222222',
        'd2222222-2222-2222-2222-222222222222', -- Priya
        'a1111111-1111-1111-1111-111111111111',
        'p2222222-2222-2222-2222-222222222222',
        'READY_FOR_PICKUP',
        'Your Myntra package has arrived!',
        'Checked into Shelf A-03. Please select a convenient pickup time in the app.',
        'WHATSAPP',
        'DELIVERED'
    )
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 13. AUTHORIZED COLLECTORS
-- ----------------------------------------------------------------------------
INSERT INTO public.authorized_collectors (id, resident_id, name, phone, relation, government_id_type, government_id_last4)
VALUES
    (
        'ac000001-0000-0000-0000-000000000001',
        'e1111111-1111-1111-1111-111111111111', -- Arjun
        'Rohan Kumar',
        '+91 98860 11223',
        'Family Member',
        'Aadhaar',
        '4829'
    )
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 14. AUDIT LOGS
-- ----------------------------------------------------------------------------
INSERT INTO public.audit_logs (id, society_id, user_id, action, entity_type, entity_id, payload)
VALUES
    (
        'al000001-0000-0000-0000-000000000001',
        'a1111111-1111-1111-1111-111111111111',
        'b2222222-2222-2222-2222-222222222222',
        'PARCEL_SCAN_IN',
        'parcels',
        'p1111111-1111-1111-1111-111111111111',
        '{"carrier": "Amazon", "tracking_number": "PF-8921-IN", "gate": 1}'::jsonb
    ),
    (
        'al000001-0000-0000-0000-000000000002',
        'a1111111-1111-1111-1111-111111111111',
        'b1111111-1111-1111-1111-111111111111',
        'STORAGE_ASSIGNED',
        'storage_locations',
        's0000002-0000-0000-0000-000000000008',
        '{"rack": "Rack B", "shelf": "Shelf B-08"}'::jsonb
    )
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 15. ISSUES
-- ----------------------------------------------------------------------------
INSERT INTO public.issues (id, parcel_id, society_id, reported_by_user_id, title, description, category, priority, status)
VALUES
    (
        'is000001-0000-0000-0000-000000000001',
        'p3333333-3333-3333-3333-333333333333',
        'a1111111-1111-1111-1111-111111111111',
        'd3333333-3333-3333-3333-333333333333',
        'Outer cardboard seal slightly torn upon arrival',
        'Courier Blue Dart noted seal tear during gate handoff. Hub specialist inspected contents: intact.',
        'DAMAGED_PACKAGE',
        'LOW',
        'RESOLVED'
    )
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 16. APP VERSIONS (Version 0.1.0)
-- ----------------------------------------------------------------------------
INSERT INTO public.app_versions (id, platform, version_number, build_number, release_notes, min_supported_version, is_mandatory_update, download_url, released_at)
VALUES
    (
        'v0000001-0000-0000-0000-000000000001',
        'ANDROID',
        '0.1.0',
        1001,
        'Initial MVP release: Unified Resident, Staff & Admin portals, QR/OTP verification, slot scheduling, and real-time alerts.',
        '0.1.0',
        false,
        '/downloads/android/ParcelFlow.apk',
        NOW()
    ),
    (
        'v0000001-0000-0000-0000-000000000002',
        'IOS',
        '0.1.0',
        1001,
        'Initial TestFlight beta release: Slot booking and secure handover verification.',
        '0.1.0',
        false,
        'https://testflight.apple.com/join/parcelflow',
        NOW()
    ),
    (
        'v0000001-0000-0000-0000-000000000003',
        'WEB',
        '0.1.0',
        1001,
        'Web portal & Admin dashboard release.',
        '0.1.0',
        false,
        'https://parcelflow.in',
        NOW()
    )
ON CONFLICT (id) DO NOTHING;

-- End of seed data
