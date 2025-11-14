# Quick Start - Database Setup

## TL;DR

```bash
# 1. Setup environment
cp .env.example .env
# Edit .env with your database credentials

# 2. Create database
createdb sat_math_platform

# 3. Install dependencies
npm install

# 4. Run migrations
npm run db:migrate

# 5. Done! Schema is ready
```

## Verify Installation

```bash
# Check migration status
npm run db:migrate:status

# Connect to database
psql sat_math_platform

# List all tables
\dt

# Quick test query
SELECT name FROM major_topics;
```

Expected output:
```
 name    
---------
 Algebra
 Geometry
(2 rows)
```

## What's Installed

- ✅ **11 database tables** with all relationships
- ✅ **20+ performance indexes**
- ✅ **2 major topics** (Algebra, Geometry)
- ✅ **6 subtopics** (3 per major topic)
- ✅ **9 practice problems** with explanations
- ✅ **6 tutorials** with video URLs
- ✅ **Automatic timestamps** via triggers
- ✅ **Audit trail** support

## Common Commands

```bash
# Rollback last migration
npm run db:migrate:down

# Rollback 2 migrations
npm run db:migrate:down -- --count 2

# Create new migration
npm run db:migrate:create -- add_achievements_table

# Full database reset (development only)
dropdb sat_math_platform
createdb sat_math_platform
npm run db:migrate
```

## Documentation

- **DATABASE_SCHEMA.md** - Full schema documentation
- **SCHEMA_SETUP.md** - Complete setup guide
- **IMPLEMENTATION_SUMMARY.md** - Ticket completion details

## Need Help?

1. Check SCHEMA_SETUP.md for troubleshooting
2. Review DATABASE_SCHEMA.md for table structure
3. Run `npm run db:migrate:status` to check state

---

**Status**: Ready for API development ✅
