/*
# Aravind Sports & Cultural Academy - Database Schema

1. New Tables
- `site_content` — stores editable site-wide content (hero, about, contact info) as key-value pairs
- `programs` — training programs (Yoga, Karate, etc.) with title, description, icon, image
- `gallery` — gallery images with title, image URL, category
- `testimonials` — student/parent testimonials with name, rating, text, image
- `contact_messages` — messages submitted via the contact form

2. Security
- Enable RLS on all tables.
- Public read access (anon + authenticated) for site_content, programs, gallery, testimonials.
- Contact messages: anyone can insert, only authenticated (admin) can read.
- Admin writes: authenticated users can insert/update/delete on content tables.
*/

-- ===================== SITE CONTENT =====================
CREATE TABLE IF NOT EXISTS site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_site_content" ON site_content;
CREATE POLICY "public_read_site_content" ON site_content FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_site_content" ON site_content;
CREATE POLICY "auth_insert_site_content" ON site_content FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_site_content" ON site_content;
CREATE POLICY "auth_update_site_content" ON site_content FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_site_content" ON site_content;
CREATE POLICY "auth_delete_site_content" ON site_content FOR DELETE
  TO authenticated USING (true);

-- ===================== PROGRAMS =====================
CREATE TABLE IF NOT EXISTS programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT 'Activity',
  image_url text,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_programs" ON programs;
CREATE POLICY "public_read_programs" ON programs FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_programs" ON programs;
CREATE POLICY "auth_insert_programs" ON programs FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_programs" ON programs;
CREATE POLICY "auth_update_programs" ON programs FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_programs" ON programs;
CREATE POLICY "auth_delete_programs" ON programs FOR DELETE
  TO authenticated USING (true);

-- ===================== GALLERY =====================
CREATE TABLE IF NOT EXISTS gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  image_url text NOT NULL,
  category text NOT NULL DEFAULT 'Training',
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_gallery" ON gallery;
CREATE POLICY "public_read_gallery" ON gallery FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_gallery" ON gallery;
CREATE POLICY "auth_insert_gallery" ON gallery FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_gallery" ON gallery;
CREATE POLICY "auth_update_gallery" ON gallery FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_gallery" ON gallery;
CREATE POLICY "auth_delete_gallery" ON gallery FOR DELETE
  TO authenticated USING (true);

-- ===================== TESTIMONIALS =====================
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  rating int NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  text text NOT NULL DEFAULT '',
  image_url text,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_testimonials" ON testimonials;
CREATE POLICY "public_read_testimonials" ON testimonials FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_testimonials" ON testimonials;
CREATE POLICY "auth_insert_testimonials" ON testimonials FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_testimonials" ON testimonials;
CREATE POLICY "auth_update_testimonials" ON testimonials FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_testimonials" ON testimonials;
CREATE POLICY "auth_delete_testimonials" ON testimonials FOR DELETE
  TO authenticated USING (true);

-- ===================== CONTACT MESSAGES =====================
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  message text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_contact_messages" ON contact_messages;
CREATE POLICY "public_insert_contact_messages" ON contact_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_read_contact_messages" ON contact_messages;
CREATE POLICY "auth_read_contact_messages" ON contact_messages FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_delete_contact_messages" ON contact_messages;
CREATE POLICY "auth_delete_contact_messages" ON contact_messages FOR DELETE
  TO authenticated USING (true);

-- ===================== SEED DATA =====================
INSERT INTO site_content (key, value) VALUES
  ('hero', '{"heading":"Train Like a Champion","subtext":"Yoga, Martial Arts & Sports Training in Hosur","primary_button":"Join Now","secondary_button":"Call Now"}'),
  ('about', '{"heading":"About Our Academy","text":"Aravind Sports Academy provides expert training in Yoga, Karate, Kung Fu, Taekwondo, Gymnastics, Archery and more. Our certified coaches are dedicated to nurturing champions both on and off the field.","stats":[{"label":"Students Trained","value":"500+"},{"label":"Expert Coaches","value":"15+"},{"label":"Disciplines","value":"8+"},{"label":"Years of Excellence","value":"10+"}]}'),
  ('contact', '{"phone":"+91 98948 28541","address":"Hosur, Tamil Nadu, India","email":"info@Aravindsportsacademy.in"}')
ON CONFLICT (key) DO NOTHING;

INSERT INTO programs (title, description, icon, display_order) VALUES
  ('Yoga', 'Find balance, flexibility, and inner peace through guided yoga sessions.', 'Flower2', 1),
  ('Kung Fu', 'Master the ancient Chinese martial art of discipline and power.', 'Swords', 2),
  ('Karate', 'Build strength, focus, and self-defense skills with traditional karate.', 'Zap', 3),
  ('Taekwondo', 'Aravind kicking techniques and Olympic-style sparring training.', 'Target', 4),
  ('Gymnastics', 'Develop agility, strength, and coordination through gymnastics.', 'PersonStanding', 5),
  ('Archery', 'Precision, patience, and focus with professional archery coaching.', 'Target', 6),
  ('Dance', 'Express yourself through energetic and cultural dance forms.', 'Music', 7),
  ('Air Gun Training', 'Sharpen your aim with professional air gun shooting training.', 'Crosshair', 8)
ON CONFLICT DO NOTHING;

INSERT INTO testimonials (name, rating, text, display_order) VALUES
  ('Rajesh Kumar', 5, 'My son has been training here for 2 years. The coaches are excellent and the discipline he has learned is remarkable.', 1),
  ('Priya Sharma', 5, 'The yoga classes have transformed my life. I feel more flexible and peaceful than ever before.', 2),
  ('Arun Mohan', 5, 'Best martial arts academy in Hosur. My daughter earned her black belt here. Highly recommended!', 3)
ON CONFLICT DO NOTHING;