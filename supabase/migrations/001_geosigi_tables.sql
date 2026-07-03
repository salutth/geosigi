-- 거시기(Geosigi) 전용 테이블 — 2026-07-03
-- Supabase SQL Editor에서 실행

-- 1. 사용자 (자발적 동의 기반)
CREATE TABLE IF NOT EXISTS geosigi_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nationality VARCHAR(50),
  languages TEXT[] DEFAULT '{}',
  interest_tags TEXT[] DEFAULT '{}',
  preferred_lang VARCHAR(5) DEFAULT 'en',
  consent_at TIMESTAMPTZ,
  consent_version VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. 시민과학 미션
CREATE TABLE IF NOT EXISTS geosigi_missions (
  id SERIAL PRIMARY KEY,
  title_ko VARCHAR(200) NOT NULL,
  title_en VARCHAR(200),
  description_ko TEXT,
  description_en TEXT,
  mission_type VARCHAR(50) NOT NULL, -- 'water_quality', 'species_observation', 'cleanup'
  river VARCHAR(50),
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'completed', 'upcoming'
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. 미션 참여 기록
CREATE TABLE IF NOT EXISTS geosigi_mission_logs (
  id SERIAL PRIMARY KEY,
  mission_id INT REFERENCES geosigi_missions(id),
  user_id UUID REFERENCES geosigi_users(id),
  data JSONB DEFAULT '{}',
  photo_url TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  completed_at TIMESTAMPTZ DEFAULT now()
);

-- 4. 커뮤니티 게시글
CREATE TABLE IF NOT EXISTS geosigi_posts (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES geosigi_users(id),
  content TEXT NOT NULL,
  lang VARCHAR(5) DEFAULT 'ko',
  post_type VARCHAR(30) DEFAULT 'general', -- 'general', 'question', 'event', 'story'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. 활동 스토리
CREATE TABLE IF NOT EXISTS geosigi_stories (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES geosigi_users(id),
  title VARCHAR(300),
  body TEXT,
  lang VARCHAR(5) DEFAULT 'ko',
  activity_type VARCHAR(50), -- 'water_quality', 'species', 'community', 'settle'
  shared BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. 동의 이력 (법적 증거)
CREATE TABLE IF NOT EXISTS geosigi_consent_logs (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES geosigi_users(id),
  consent_type VARCHAR(50) NOT NULL, -- 'nationality', 'language', 'interest', 'privacy_policy'
  agreed BOOLEAN NOT NULL,
  version VARCHAR(20) NOT NULL,
  ip_hash VARCHAR(64),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. 정착 가이드 카테고리 콘텐츠
CREATE TABLE IF NOT EXISTS geosigi_guides (
  id SERIAL PRIMARY KEY,
  category VARCHAR(50) NOT NULL, -- 'housing', 'essentials', 'transport', 'hospital', 'legal', 'manners'
  title_ko VARCHAR(300),
  title_en VARCHAR(300),
  content_ko TEXT,
  content_en TEXT,
  source_url TEXT,
  source_name VARCHAR(100),
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 8. 신뢰 정보 (공인 기관)
CREATE TABLE IF NOT EXISTS geosigi_trusted_sources (
  id SERIAL PRIMARY KEY,
  name_ko VARCHAR(200) NOT NULL,
  name_en VARCHAR(200),
  category VARCHAR(50), -- 'immigration', 'education', 'health', 'legal', 'emergency'
  url TEXT,
  phone VARCHAR(30),
  description_ko TEXT,
  description_en TEXT,
  is_official BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS 보안 정책 (RiverWatch와 동일 패턴)
ALTER TABLE geosigi_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE geosigi_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE geosigi_mission_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE geosigi_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE geosigi_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE geosigi_consent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE geosigi_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE geosigi_trusted_sources ENABLE ROW LEVEL SECURITY;

-- SELECT: 공개 (읽기 허용)
CREATE POLICY "geosigi_read_all" ON geosigi_missions FOR SELECT USING (true);
CREATE POLICY "geosigi_read_guides" ON geosigi_guides FOR SELECT USING (true);
CREATE POLICY "geosigi_read_trusted" ON geosigi_trusted_sources FOR SELECT USING (true);
CREATE POLICY "geosigi_read_posts" ON geosigi_posts FOR SELECT USING (true);
CREATE POLICY "geosigi_read_stories" ON geosigi_stories FOR SELECT USING (true);

-- INSERT: 허용 (앱에서 데이터 제출)
CREATE POLICY "geosigi_insert_users" ON geosigi_users FOR INSERT WITH CHECK (true);
CREATE POLICY "geosigi_insert_logs" ON geosigi_mission_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "geosigi_insert_posts" ON geosigi_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "geosigi_insert_stories" ON geosigi_stories FOR INSERT WITH CHECK (true);
CREATE POLICY "geosigi_insert_consent" ON geosigi_consent_logs FOR INSERT WITH CHECK (true);

-- 초기 미션 데이터 (RiverWatch 연동)
INSERT INTO geosigi_missions (title_ko, title_en, mission_type, river, status) VALUES
  ('도림천 수질 측정', 'Dorimcheon Water Quality', 'water_quality', '도림천', 'active'),
  ('안양천 생물 관찰', 'Anyangcheon Species Observation', 'species_observation', '안양천', 'active'),
  ('청계천 수질 측정', 'Cheonggyecheon Water Quality', 'water_quality', '청계천', 'active'),
  ('중랑천 생태교란종 모니터링', 'Jungnangcheon Invasive Species', 'species_observation', '중랑천', 'active'),
  ('탄천 수질 측정', 'Tancheon Water Quality', 'water_quality', '탄천', 'active');

-- 초기 신뢰 기관 데이터
INSERT INTO geosigi_trusted_sources (name_ko, name_en, category, url, phone, description_ko, description_en) VALUES
  ('외국인종합안내센터', 'Foreigner Help Center', 'immigration', 'https://www.hikorea.go.kr', '1345', '비자·체류·생활 상담', 'Visa, residence, and daily life consultation'),
  ('Hi Korea 출입국외국인청', 'Hi Korea Immigration', 'immigration', 'https://www.immigration.go.kr', '1345', '출입국 관련 공식 정보', 'Official immigration information'),
  ('국립국제교육원 NIIED', 'NIIED', 'education', 'https://www.niied.go.kr', '02-3668-1300', 'GKS 장학금·교환학생 정보', 'GKS scholarship and exchange programs'),
  ('건강보험심사평가원', 'HIRA', 'health', 'https://www.hira.or.kr', '1644-2000', '외국어 가능 의료기관 검색', 'Search for multilingual medical facilities'),
  ('경찰청 외국인 도움센터', 'Police Foreign Help', 'emergency', 'https://www.police.go.kr', '112', '긴급 신고·범죄 피해', 'Emergency reports and crime victim support');
