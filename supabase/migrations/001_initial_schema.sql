-- Locations table
CREATE TABLE locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  lat float8 NOT NULL,
  lng float8 NOT NULL,
  place_type text NOT NULL DEFAULT 'other',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Submissions table
CREATE TABLE submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id uuid NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  submitted_by text NOT NULL,
  has_bidet boolean NOT NULL,
  bidet_type text,
  cleanliness int CHECK (cleanliness >= 1 AND cleanliness <= 5),
  is_paid boolean,
  notes text,
  upvotes int NOT NULL DEFAULT 0,
  downvotes int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Submission photos table
CREATE TABLE submission_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  photo_url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Votes table
CREATE TABLE votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  vote int NOT NULL CHECK (vote IN (1, -1)),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_submissions_location_id ON submissions(location_id);
CREATE INDEX idx_submission_photos_submission_id ON submission_photos(submission_id);
CREATE INDEX idx_votes_submission_id ON votes(submission_id);
CREATE INDEX idx_locations_lat_lng ON locations(lat, lng);

-- Enable RLS
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies: public read on all tables
CREATE POLICY "Public read locations" ON locations FOR SELECT USING (true);
CREATE POLICY "Public read submissions" ON submissions FOR SELECT USING (true);
CREATE POLICY "Public read submission_photos" ON submission_photos FOR SELECT USING (true);
CREATE POLICY "Public read votes" ON votes FOR SELECT USING (true);

-- RLS Policies: public insert (no auth required for this MVP)
CREATE POLICY "Public insert locations" ON locations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert submissions" ON submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert submission_photos" ON submission_photos FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert votes" ON votes FOR INSERT WITH CHECK (true);
