-- Rollback initial schema

DROP TABLE IF EXISTS audit_log;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS users;

DROP EXTENSION IF EXISTS "uuid-ossp";
DROP EXTENSION IF EXISTS "pgcrypto";
