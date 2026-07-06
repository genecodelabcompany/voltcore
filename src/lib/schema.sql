-- VoltCore Database Schema
-- Run via: npx tsx scripts/migrate.ts

CREATE TABLE IF NOT EXISTS categories (
  id       TEXT PRIMARY KEY,
  name     TEXT NOT NULL,
  slug     TEXT NOT NULL UNIQUE,
  color    TEXT NOT NULL DEFAULT 'var(--c-blue)',
  icon     TEXT NOT NULL DEFAULT '📦',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS products (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  cat_id      TEXT NOT NULL REFERENCES categories(id),
  price       REAL NOT NULL,
  was         REAL,
  sku         TEXT NOT NULL UNIQUE,
  brand       TEXT NOT NULL DEFAULT 'VoltCore',
  badge       TEXT,
  description TEXT NOT NULL DEFAULT '',
  glyph       TEXT NOT NULL DEFAULT 'chip',
  image_url   TEXT,
  stock       INTEGER NOT NULL DEFAULT 0,
  sold        INTEGER NOT NULL DEFAULT 0,
  rating      REAL NOT NULL DEFAULT 4.5,
  reviews     INTEGER NOT NULL DEFAULT 0,
  status      TEXT NOT NULL DEFAULT 'published' CHECK(status IN ('published','draft','hidden')),
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS orders (
  id              TEXT PRIMARY KEY,
  customer_name   TEXT NOT NULL,
  customer_email  TEXT NOT NULL,
  customer_phone  TEXT NOT NULL DEFAULT '',
  address         TEXT NOT NULL DEFAULT '',
  city            TEXT NOT NULL DEFAULT '',
  amount          REAL NOT NULL,
  status          TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','processing','shipped','delivered','cancelled')),
  payment_ref     TEXT,
  payment_method  TEXT NOT NULL DEFAULT 'paystack',
  shipping_method TEXT NOT NULL DEFAULT 'standard',
  notes           TEXT,
  created_at      TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS order_items (
  id          TEXT PRIMARY KEY,
  order_id    TEXT NOT NULL REFERENCES orders(id),
  product_id  TEXT NOT NULL,
  name        TEXT NOT NULL,
  price       REAL NOT NULL,
  qty         INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS courses (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  level       TEXT NOT NULL DEFAULT 'Beginner' CHECK(level IN ('Beginner','Intermediate','Advanced')),
  lessons     INTEGER NOT NULL DEFAULT 0,
  hours       REAL NOT NULL DEFAULT 0,
  price       REAL NOT NULL DEFAULT 0,
  enrolled    INTEGER NOT NULL DEFAULT 0,
  rating      REAL NOT NULL DEFAULT 4.5,
  instructor  TEXT NOT NULL DEFAULT '',
  glyph       TEXT NOT NULL DEFAULT 'board',
  image_url   TEXT,
  cert        INTEGER NOT NULL DEFAULT 1,
  description TEXT NOT NULL DEFAULT '',
  status      TEXT NOT NULL DEFAULT 'published' CHECK(status IN ('published','draft')),
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS enrollments (
  id            TEXT PRIMARY KEY,
  course_id     TEXT NOT NULL REFERENCES courses(id),
  student_name  TEXT NOT NULL,
  student_email TEXT NOT NULL,
  amount        REAL NOT NULL DEFAULT 0,
  payment_ref   TEXT,
  progress      INTEGER NOT NULL DEFAULT 0,
  enrolled_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS services (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  title       TEXT NOT NULL,
  from_price  REAL NOT NULL DEFAULT 0,
  eta         TEXT NOT NULL DEFAULT 'TBD',
  glyph       TEXT NOT NULL DEFAULT 'tool',
  icon        TEXT NOT NULL DEFAULT '🔧',
  description TEXT NOT NULL DEFAULT '',
  status      TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','inactive')),
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS service_inquiries (
  id           TEXT PRIMARY KEY,
  client       TEXT NOT NULL,
  client_email TEXT NOT NULL DEFAULT '',
  client_phone TEXT NOT NULL DEFAULT '',
  service_id   TEXT REFERENCES services(id),
  service_name TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','processing','quoted','active','completed','cancelled')),
  budget       TEXT NOT NULL DEFAULT '',
  description  TEXT NOT NULL DEFAULT '',
  notes        TEXT,
  date         TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'customer' CHECK(role IN ('admin','customer','staff')),
  avatar_url    TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  last_login    TEXT
);

CREATE TABLE IF NOT EXISTS banners (
  id         TEXT PRIMARY KEY,
  title      TEXT NOT NULL,
  subtitle   TEXT,
  image_url  TEXT NOT NULL DEFAULT '',
  link       TEXT NOT NULL DEFAULT '/',
  cta_text   TEXT NOT NULL DEFAULT 'Shop Now',
  active     INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS coupons (
  id           TEXT PRIMARY KEY,
  code         TEXT NOT NULL UNIQUE,
  discount_pct INTEGER NOT NULL DEFAULT 10,
  max_uses     INTEGER NOT NULL DEFAULT 100,
  uses         INTEGER NOT NULL DEFAULT 0,
  expires_at   TEXT,
  active       INTEGER NOT NULL DEFAULT 1,
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS settings (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
