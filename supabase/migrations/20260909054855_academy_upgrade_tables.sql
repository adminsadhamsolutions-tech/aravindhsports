/*
# Academy Upgrade: Enquiries, Schedules, Trainers, Pricing

1. New Tables
- `enquiries` — lead generation enquiries with name, phone, program, message, date
- `schedules` — weekly class schedule: program, time, days, trainer_name
- `trainers` — trainer profiles: name, specialization, image_url, bio
- `pricing` — pricing plans: program, price, period, features, is_popular

2. Modified Tables
- `contact_messages` — add `program` column (nullable) so existing form still works

3. Security
- Enable RLS on all new tables.
- Public read for schedules, trainers, pricing (anon + authenticated).
- Public insert for enquiries (anyone can submit a lead).
- Authenticated-only read/delete for enquiries (admin only).
*/

-- ===================== ADD PROGRAM COLUMN TO contact_messages =====================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contact_messages' AND column_name = 'program') THEN
    ALTER TABLE contact_messages ADD COLUMN program text;
  END IF;
END $$;

-- ===================== ENQUIRIES =====================
CREATE TABLE IF NOT EXISTS enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  program text NOT NULL DEFAULT 'General',
  message text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_enquiries" ON enquiries;
CREATE POLICY "public_insert_enquiries" ON enquiries FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_read_enquiries" ON enquiries;
CREATE POLICY "auth_read_enquiries" ON enquiries FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_delete_enquiries" ON enquiries;
CREATE POLICY "auth_delete_enquiries" ON enquiries FOR DELETE
  TO authenticated USING (true);

-- ===================== SCHEDULES =====================
CREATE TABLE IF NOT EXISTS schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program text NOT NULL,
  time_slot text NOT NULL,
  days text NOT NULL,
  trainer_name text NOT NULL DEFAULT '',
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_schedules" ON schedules;
CREATE POLICY "public_read_schedules" ON schedules FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_schedules" ON schedules;
CREATE POLICY "auth_insert_schedules" ON schedules FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_schedules" ON schedules;
CREATE POLICY "auth_update_schedules" ON schedules FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_schedules" ON schedules;
CREATE POLICY "auth_delete_schedules" ON schedules FOR DELETE
  TO authenticated USING (true);

-- ===================== TRAINERS =====================
CREATE TABLE IF NOT EXISTS trainers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  specialization text NOT NULL DEFAULT '',
  image_url text,
  bio text NOT NULL DEFAULT '',
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE trainers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_trainers" ON trainers;
CREATE POLICY "public_read_trainers" ON trainers FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_trainers" ON trainers;
CREATE POLICY "auth_insert_trainers" ON trainers FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_trainers" ON trainers;
CREATE POLICY "auth_update_trainers" ON trainers FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_trainers" ON trainers;
CREATE POLICY "auth_delete_trainers" ON trainers FOR DELETE
  TO authenticated USING (true);

-- ===================== PRICING =====================
CREATE TABLE IF NOT EXISTS pricing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program text NOT NULL,
  price text NOT NULL DEFAULT '0',
  period text NOT NULL DEFAULT 'month',
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_popular boolean NOT NULL DEFAULT false,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE pricing ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_pricing" ON pricing;
CREATE POLICY "public_read_pricing" ON pricing FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_pricing" ON pricing;
CREATE POLICY "auth_insert_pricing" ON pricing FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_pricing" ON pricing;
CREATE POLICY "auth_update_pricing" ON pricing FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_pricing" ON pricing;
CREATE POLICY "auth_delete_pricing" ON pricing FOR DELETE
  TO authenticated USING (true);

-- ===================== SEED DATA =====================
INSERT INTO schedules (program, time_slot, days, trainer_name, display_order) VALUES
  ('Yoga', '6:00 AM - 7:30 AM', 'Mon, Wed, Fri', 'Master Suresh', 1),
  ('Karate', '5:00 PM - 6:30 PM', 'Mon, Tue, Thu', 'Sensei Ravi', 2),
  ('Kung Fu', '6:30 PM - 8:00 PM', 'Tue, Thu, Sat', 'Master Li', 3),
  ('Taekwondo', '5:00 PM - 6:30 PM', 'Wed, Fri, Sun', 'Master Anand', 4),
  ('Gymnastics', '4:00 PM - 5:30 PM', 'Mon, Wed, Fri', 'Coach Priya', 5),
  ('Archery', '7:00 AM - 8:30 AM', 'Sat, Sun', 'Coach Mohan', 6),
  ('Dance', '4:30 PM - 6:00 PM', 'Tue, Thu, Sat', 'Coach Divya', 7),
  ('Air Gun Training', '8:30 AM - 10:00 AM', 'Sat, Sun', 'Coach Karthik', 8)
ON CONFLICT DO NOTHING;

INSERT INTO trainers (name, specialization, bio, display_order) VALUES
  ('Master Suresh', 'Yoga & Meditation', '20+ years of experience in traditional yoga and meditation practices.', 1),
  ('Sensei Ravi', 'Karate & Self-Defense', '5th Dan Black Belt with international competition experience.', 2),
  ('Master Li', 'Kung Fu', 'Expert in Shaolin Kung Fu with 15+ years of teaching experience.', 3),
  ('Coach Priya', 'Gymnastics', 'National-level gymnast turned coach with a passion for youth development.', 4)
ON CONFLICT DO NOTHING;

INSERT INTO pricing (program, price, period, features, is_popular, display_order) VALUES
  ('Yoga', '800', 'month', '["3 sessions per week", "Morning & evening batches", "Personal guidance", "Flexible timing"]', false, 1),
  ('Karate', '1000', 'month', '["4 sessions per week", "Belt grading system", "Self-defense training", "Competition prep"]', true, 2),
  ('Kung Fu', '1200', 'month', '["4 sessions per week", "Weapons training", "Forms & sparring", "Certification program"]', false, 3),
  ('Gymnastics', '1500', 'month', '["3 sessions per week", "Equipment training", "Flexibility coaching", "Competition prep"]', false, 4)
ON CONFLICT DO NOTHING;