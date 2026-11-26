
-- =========================================
-- PDF VOICE READER DATABASE
-- =========================================

-- TABLE 1: ADMIN USERS
-- Stores the details of authorized administrators.

CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- TABLE 2: ANALYTICS EVENTS
-- Records important activities across the application.

CREATE TABLE IF NOT EXISTS analytics_events (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    visitor_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- INDEXES
-- Help the database find records more efficiently.

CREATE INDEX IF NOT EXISTS
idx_analytics_event_type
ON analytics_events(event_type);

CREATE INDEX IF NOT EXISTS
idx_analytics_created_at
ON analytics_events(created_at);

CREATE INDEX IF NOT EXISTS
idx_analytics_visitor_id
ON analytics_events(visitor_id);
