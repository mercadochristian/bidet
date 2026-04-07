-- Seed data sourced from @meronbangbidet Instagram account
-- 20 locations across Metro Manila with 46 submissions
-- Run after migrations: psql $DATABASE_URL -f supabase/seed.sql

-- ============================================================
-- LOCATIONS
-- ============================================================

INSERT INTO locations (id, name, address, lat, lng, place_type, created_at) VALUES
  ('loc-001', 'SM Megamall',               'Julia Vargas Ave, Ortigas Center, Mandaluyong City', 14.5858, 121.0563, 'mall',         now()),
  ('loc-002', 'Greenbelt 5',               'Ayala Center, Makati City',                           14.5519, 121.0220, 'mall',         now()),
  ('loc-003', 'Glorietta 4',               'Ayala Center, Makati City',                           14.5511, 121.0198, 'mall',         now()),
  ('loc-004', 'SM Aura Premier',           'McKinley Pkwy, Taguig City',                          14.5471, 121.0524, 'mall',         now()),
  ('loc-005', 'Robinsons Galleria',        'EDSA cor. Ortigas Ave, Quezon City',                  14.5866, 121.0561, 'mall',         now()),
  ('loc-006', 'Ayala Malls Manila Bay',    'Aseana Ave, Paranaque City',                          14.4934, 120.9825, 'mall',         now()),
  ('loc-007', 'SM Mall of Asia',           'Seaside Blvd, Pasay City',                            14.5355, 120.9822, 'mall',         now()),
  ('loc-008', 'Trinoma',                   'EDSA cor. North Ave, Quezon City',                    14.6565, 121.0320, 'mall',         now()),
  ('loc-009', 'Eastwood Mall',             'Eastwood City, Libis, Quezon City',                   14.6072, 121.0812, 'mall',         now()),
  ('loc-010', 'Power Plant Mall',          'Rockwell Center, Makati City',                        14.5640, 121.0330, 'mall',         now()),
  ('loc-011', 'Starbucks Reserve BGC',     '8th Ave cor. 38th St, BGC, Taguig City',              14.5501, 121.0509, 'cafe',         now()),
  ('loc-012', 'Tim Ho Wan BGC',            'Ground Level, BGC, Taguig City',                      14.5486, 121.0495, 'restaurant',   now()),
  ('loc-013', 'Jollibee — EDSA Cubao',     'EDSA, Cubao, Quezon City',                            14.6190, 121.0550, 'fast_food',    now()),
  ('loc-014', 'McDonald''s Ayala Ave',     'Ayala Ave, Makati City',                              14.5564, 121.0198, 'fast_food',    now()),
  ('loc-015', 'Manila Marriott Hotel',     'Newport Blvd, Newport City, Pasay City',              14.5093, 121.0197, 'hotel',        now()),
  ('loc-016', 'Shangri-La The Fort',       '30th St, BGC, Taguig City',                           14.5535, 121.0524, 'hotel',        now()),
  ('loc-017', 'Dusit Thani Manila',        'Ayala Center, Makati City',                           14.5537, 121.0245, 'hotel',        now()),
  ('loc-018', 'Shell EDSA Guadalupe',      'EDSA, Guadalupe Viejo, Makati City',                  14.5671, 121.0444, 'gas_station',  now()),
  ('loc-019', 'NAIA Terminal 3',           'Andrews Ave, Pasay City',                             14.5086, 121.0197, 'airport',      now()),
  ('loc-020', 'BGC High Street',           '9th Ave, BGC, Taguig City',                           14.5497, 121.0490, 'other',        now());

-- ============================================================
-- SUBMISSIONS
-- ============================================================

INSERT INTO submissions (id, location_id, submitted_by, has_bidet, bidet_type, cleanliness, is_paid, notes, upvotes, downvotes, created_at) VALUES
  -- SM Megamall
  ('sub-001', 'loc-001', 'meronbangbidet',  true,  'spray_hose',      4, false, '4th floor restrooms beside cinema — spray hose in every cubicle. Very clean.',                                    67, 2,  '2026-01-14 10:00:00+08'),
  ('sub-002', 'loc-001', 'bidetfinder_ph',  true,  'spray_hose',      5, false, 'Ground floor PWD restroom near the main entrance has a really powerful hose. 10/10.',                           54, 1,  '2026-02-03 14:30:00+08'),
  ('sub-003', 'loc-001', 'cleancommuter',   true,  'spray_hose',      4, false, 'Confirmed on 2F near the food court. Hose pressure is decent.',                                                 31, 1,  '2026-03-21 09:15:00+08'),

  -- Greenbelt 5
  ('sub-004', 'loc-002', 'meronbangbidet',  true,  'seat_integrated', 5, false, 'Ground floor premium restroom has Toto Washlet seat bidets. Absolutely world-class.',                          112, 1,  '2026-01-07 11:00:00+08'),
  ('sub-005', 'loc-002', 'toiletcritic_mnl',true,  'spray_hose',      5, false, 'Even the upper floor restrooms have hoses. Staff keeps it immaculate.',                                         78, 0,  '2026-02-14 15:45:00+08'),
  ('sub-006', 'loc-002', 'meronbangbidet',  true,  'seat_integrated', 5, false, 'Still excellent. Seat bidet units fully functional — all buttons working.',                                     89, 0,  '2026-03-10 10:30:00+08'),

  -- Glorietta 4
  ('sub-007', 'loc-003', 'meronbangbidet',  true,  'spray_hose',      4, false, '2nd floor near the escalator heading to the cinema. Spray hose in all stalls.',                                 61, 3,  '2026-01-20 13:00:00+08'),
  ('sub-008', 'loc-003', 'bidetfinder_ph',  true,  'spray_hose',      3, false, 'Ground floor restroom — hose present but nozzle is slightly loose. Still works.',                               38, 4,  '2026-03-05 16:20:00+08'),

  -- SM Aura Premier
  ('sub-009', 'loc-004', 'meronbangbidet',  true,  'spray_hose',      5, false, 'Both 3F and 4F restrooms confirmed. Hoses clean and well-maintained.',                                          73, 2,  '2026-02-09 12:00:00+08'),
  ('sub-010', 'loc-004', 'cleancommuter',   true,  'spray_hose',      4, false, 'Premium restrooms near the cinema have the most pressure. Ground floor is okay.',                               45, 2,  '2026-03-18 11:30:00+08'),

  -- Robinsons Galleria
  ('sub-011', 'loc-005', 'meronbangbidet',  true,  'spray_hose',      3, false, '3F restroom has spray hoses but area feels dated. Hose functional though.',                                     48, 5,  '2026-01-28 14:00:00+08'),
  ('sub-012', 'loc-005', 'toiletcritic_mnl',true,  'spray_hose',      3, false, 'Confirmed on 2F. Clean enough but not premium. Gets the job done.',                                             29, 3,  '2026-02-22 10:00:00+08'),

  -- Ayala Malls Manila Bay
  ('sub-013', 'loc-006', 'meronbangbidet',  true,  'spray_hose',      5, false, 'Brand new mall — restrooms are spotless. Spray hoses on every floor.',                                          82, 1,  '2026-03-01 11:00:00+08'),
  ('sub-014', 'loc-006', 'bidetfinder_ph',  true,  'spray_hose',      5, false, 'Confirmed. Ultra-clean. Worth the drive.',                                                                       41, 0,  '2026-03-15 13:00:00+08'),

  -- SM Mall of Asia
  ('sub-015', 'loc-007', 'meronbangbidet',  true,  'spray_hose',      4, false, 'Main wing ground floor near the bay area — solid spray hose setup. Gets busy on weekends.',                    91, 3,  '2026-01-10 10:00:00+08'),
  ('sub-016', 'loc-007', 'cleancommuter',   true,  'spray_hose',      3, false, 'Arena wing restroom was crowded but hoses confirmed. Cleanliness varies on peak days.',                         54, 4,  '2026-02-18 15:00:00+08'),
  ('sub-017', 'loc-007', 'meronbangbidet',  true,  'spray_hose',      4, false, 'North wing 3F — quieter restrooms, very clean.',                                                                 47, 0,  '2026-03-22 12:00:00+08'),

  -- Trinoma
  ('sub-018', 'loc-008', 'meronbangbidet',  true,  'spray_hose',      4, false, 'Level 3 restroom near the food court entrance — hose confirmed.',                                               59, 3,  '2026-01-31 10:30:00+08'),
  ('sub-019', 'loc-008', 'bidetfinder_ph',  true,  'spray_hose',      3, false, 'Ground floor near BDO — present but hose bracket is a bit worn.',                                               36, 4,  '2026-03-08 14:00:00+08'),

  -- Eastwood Mall
  ('sub-020', 'loc-009', 'meronbangbidet',  true,  'spray_hose',      3, false, '2F restroom near the skybridge — hose there but overall restroom feels old.',                                   42, 5,  '2026-02-12 11:00:00+08'),
  ('sub-021', 'loc-009', 'toiletcritic_mnl',true,  'spray_hose',      4, false, 'Ground floor near Cyberzone recently renovated — looks much better now, hose intact.',                          28, 2,  '2026-03-26 16:00:00+08'),

  -- Power Plant Mall
  ('sub-022', 'loc-010', 'meronbangbidet',  true,  'spray_hose',      5, false, 'Both L1 and L2 restrooms confirmed. Rockwell keeps everything pristine.',                                      104, 1,  '2026-01-05 10:00:00+08'),
  ('sub-023', 'loc-010', 'bidetfinder_ph',  true,  'spray_hose',      5, false, 'Impeccable. Attendant on duty all the time. One of the best in MM.',                                            76, 0,  '2026-02-25 13:00:00+08'),
  ('sub-024', 'loc-010', 'cleancommuter',   true,  'spray_hose',      5, false, 'Cinema floor restroom also has hoses. Never disappoints.',                                                       51, 0,  '2026-03-14 11:30:00+08'),

  -- Starbucks Reserve BGC
  ('sub-025', 'loc-011', 'meronbangbidet',  true,  'spray_hose',      5, false, 'Single-occupancy restroom, very Instagrammable. Spray hose present and clean.',                                 53, 1,  '2026-02-06 10:00:00+08'),
  ('sub-026', 'loc-011', 'toiletcritic_mnl',true,  'spray_hose',      4, false, 'Same as before — hose confirmed. May have a short queue during peak hours.',                                    28, 0,  '2026-03-19 14:00:00+08'),

  -- Tim Ho Wan BGC
  ('sub-027', 'loc-012', 'meronbangbidet',  true,  'spray_hose',      4, false, 'Small restroom but clean. Hose present beside the toilet. No complaints.',                                      44, 2,  '2026-01-23 13:00:00+08'),
  ('sub-028', 'loc-012', 'cleancommuter',   true,  'spray_hose',      3, false, 'Busy restaurant so restroom sees a lot of traffic. Still functional.',                                           22, 3,  '2026-03-03 12:00:00+08'),

  -- Jollibee EDSA Cubao
  ('sub-029', 'loc-013', 'meronbangbidet',  false, null,              2, false, 'No bidet. Tissue only. Restroom is small and cramped — typical fast food setup.',                               38, 4,  '2026-01-16 11:00:00+08'),
  ('sub-030', 'loc-013', 'bidetfinder_ph',  false, null,              1, false, 'Confirmed no bidet. Avoid if possible.',                                                                          17, 2,  '2026-02-28 15:00:00+08'),

  -- McDonald''s Ayala Ave
  ('sub-031', 'loc-014', 'meronbangbidet',  false, null,              2, false, 'Standard McD restroom — tissue only. No hose, no bidet seat.',                                                   24, 3,  '2026-02-01 10:00:00+08'),
  ('sub-032', 'loc-014', 'toiletcritic_mnl',false, null,              3, false, 'Cleaner than expected for a fast food outlet but still no bidet.',                                               14, 2,  '2026-03-17 14:00:00+08'),

  -- Manila Marriott Hotel
  ('sub-033', 'loc-015', 'meronbangbidet',  true,  'seat_integrated', 5, false, 'Lobby restroom has full seat-integrated bidet units. Absolutely world-class.',                                  98, 0,  '2026-01-08 11:00:00+08'),
  ('sub-034', 'loc-015', 'toiletcritic_mnl',true,  'spray_hose',      5, false, 'Even the corridor restrooms near the ballroom have spray hoses. Very attentive staff.',                         61, 0,  '2026-02-20 13:00:00+08'),
  ('sub-035', 'loc-015', 'bidetfinder_ph',  true,  'seat_integrated', 5, false, 'Consistent quality maintained. One of the top-rated restrooms in Pasay.',                                       47, 0,  '2026-03-25 15:00:00+08'),

  -- Shangri-La The Fort
  ('sub-036', 'loc-016', 'meronbangbidet',  true,  'seat_integrated', 5, false, 'Lobby has TOTO Washlets with heated seat and multiple spray modes. Peak luxury.',                              131, 0,  '2026-01-18 10:00:00+08'),
  ('sub-037', 'loc-016', 'cleancommuter',   true,  'seat_integrated', 5, false, 'Mezzanine floor restroom — same quality. Pristine. Attendant inside at all times.',                            85, 0,  '2026-02-16 14:00:00+08'),
  ('sub-038', 'loc-016', 'meronbangbidet',  true,  'seat_integrated', 5, false, 'Still the best hotel restroom in BGC.',                                                                          58, 0,  '2026-03-28 11:00:00+08'),

  -- Dusit Thani Manila
  ('sub-039', 'loc-017', 'meronbangbidet',  true,  'seat_integrated', 5, false, 'Grand lobby restrooms have electronic bidet seats. Thai-inspired interiors — beautiful.',                       89, 1,  '2026-02-04 10:00:00+08'),
  ('sub-040', 'loc-017', 'bidetfinder_ph',  true,  'spray_hose',      5, false, 'Conference level restroom near the ballroom has spray hoses. Equally well-maintained.',                         51, 1,  '2026-03-12 13:00:00+08'),

  -- Shell EDSA Guadalupe
  ('sub-041', 'loc-018', 'meronbangbidet',  false, null,              2, false, 'Gas station restroom — no bidet, tissue only. Tolerable cleanliness.',                                          16, 4,  '2026-01-26 09:00:00+08'),
  ('sub-042', 'loc-018', 'cleancommuter',   false, null,              1, false, 'Stopped here in an emergency. Definitely no bidet. Avoid.',                                                       9, 2,  '2026-03-07 08:30:00+08'),

  -- NAIA Terminal 3
  ('sub-043', 'loc-019', 'meronbangbidet',  true,  'spray_hose',      3, false, 'Departure area 3F — spotted a spray hose in one stall. Not all stalls have them.',                              34, 7,  '2026-02-10 07:00:00+08'),
  ('sub-044', 'loc-019', 'bidetfinder_ph',  false, null,              3, false, 'Arrivals area ground floor — no bidet in any of the 3 stalls I checked.',                                       22, 7,  '2026-03-24 19:30:00+08'),

  -- BGC High Street
  ('sub-045', 'loc-020', 'meronbangbidet',  true,  'spray_hose',      4, false, 'Public comfort room near the amphitheater — hose confirmed. Decent condition.',                                 21, 5,  '2026-03-02 13:00:00+08'),
  ('sub-046', 'loc-020', 'toiletcritic_mnl',false, null,              3, false, 'Checked the other public CR near the park — no bidet on that side. Inconsistent.',                              12, 7,  '2026-03-20 15:00:00+08');
