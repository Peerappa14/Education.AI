-- AI Tutor India: Professional Database Schema
-- Run this in pgAdmin (Query Tool) to set up your tables.

-- 1. Users Table (To track who has signed in and their subscription)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    subscription_type VARCHAR(50) DEFAULT 'free', -- 'free' or 'premium'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Educational Resources (PYQs and Syllabi)
-- This is where you store the "brain" data for search
CREATE TABLE IF NOT EXISTS educational_resources (
    id SERIAL PRIMARY KEY,
    stream VARCHAR(50) NOT NULL, -- 'SSLC', 'PUC', 'JEE', 'NEET', 'BE'
    category VARCHAR(100),       -- 'Mathematics', 'Biology', 'CSE', etc.
    resource_type VARCHAR(50),   -- 'PYQ', 'Syllabus', 'NCERT_Notes'
    year INTEGER,                 -- e.g., 2023
    content TEXT NOT NULL,       -- The actual text content to search inside
    language VARCHAR(10) DEFAULT 'en' -- 'en', 'kn', 'hi'
);

-- 3. Chat History (To save student conversations)
CREATE TABLE IF NOT EXISTS chats (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) REFERENCES users(email),
    title VARCHAR(255),
    stream VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    chat_id INTEGER REFERENCES chats(id) ON DELETE CASCADE,
    sender VARCHAR(10), -- 'user' or 'bot'
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexing for fast search
CREATE INDEX idx_resource_stream ON educational_resources(stream);
CREATE INDEX idx_resource_category ON educational_resources(category);
