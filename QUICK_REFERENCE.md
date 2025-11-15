# Practice Problems API - Quick Reference

## Setup

```bash
# Install and setup
npm install
cp .env.example .env  # Edit with your database credentials
npm run db:migrate

# Start server
npm start  # Production
npm run dev  # Development with watch mode
```

## Database Management

```bash
# Run all pending migrations
npm run db:migrate

# Rollback last migration
npm run db:migrate:down

# Create new migration
npx db-migrate create migration-name
```

## API Endpoints Overview

All endpoints require JWT authentication via `Authorization: Bearer <token>` header.

### Authentication
```
POST /api/auth/signup      - Create account
POST /api/auth/login       - Get access token
POST /api/auth/refresh     - Refresh token
POST /api/auth/logout      - Logout
GET  /api/auth/profile     - Get user profile
```

### Practice Problems
```
GET  /api/problems                  - List problems (paginated, filtered)
GET  /api/problems/:id              - Get single problem
```

**Query Params for GET /api/problems:**
- `subtopic_id` - Filter by subtopic UUID
- `difficulty` - Filter by easy/medium/hard
- `page` - Page number (default: 1)
- `page_size` - Items per page (default: 10, max: 100)

### Attempts & Feedback
```
POST /api/attempts/problems/:id/submit   - Submit answer (instant feedback)
GET  /api/attempts/history               - Get attempt history (paginated)
```

**POST Body for submit:**
```json
{
  "answer": "B",
  "time_taken": 45  // optional, in seconds
}
```

### Analytics
```
GET  /api/attempts/analytics                      - Overall analytics
GET  /api/attempts/analytics/subtopics/:id        - Subtopic analytics
```

## Subtopic IDs (for testing)

```javascript
// Algebra
LINEAR_EQUATIONS = '550e8400-e29b-41d4-a716-446655440010'
QUADRATIC_FUNCTIONS = '550e8400-e29b-41d4-a716-446655440011'
EXPONENTIAL_LOG = '550e8400-e29b-41d4-a716-446655440012'

// Geometry
TRIANGLES_ANGLES = '550e8400-e29b-41d4-a716-446655440020'
CIRCLES = '550e8400-e29b-41d4-a716-446655440021'
SOLID_GEOMETRY = '550e8400-e29b-41d4-a716-446655440022'
```

## Quick Test Sequence

```bash
export TOKEN="your-access-token"
export BASE="http://localhost:3000/api"

# 1. Get problems
curl "$BASE/problems?page=1&page_size=5" \
  -H "Authorization: Bearer $TOKEN"

# 2. Submit answer to problem
curl -X POST "$BASE/attempts/problems/550e8400-e29b-41d4-a716-446655440200/submit" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"answer": "B", "time_taken": 45}'

# 3. View analytics
curl "$BASE/attempts/analytics" \
  -H "Authorization: Bearer $TOKEN"

# 4. View history
curl "$BASE/attempts/history" \
  -H "Authorization: Bearer $TOKEN"
```

## Response Formats

### Success Response
```json
{
  "success": true,
  "message": "Optional message",
  "data": { /* response data */ }
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [ /* items */ ],
  "pagination": {
    "total": 42,
    "page": 1,
    "pageSize": 10,
    "totalPages": 5
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

### Instant Feedback Response
```json
{
  "success": true,
  "message": "Correct answer!",  // or "Incorrect answer"
  "data": {
    "attempt_id": "uuid",
    "is_correct": true,
    "correct_answer": "B",
    "explanation": "Step-by-step solution...",
    "user_answer": "B",
    "time_taken": 45,
    "problem": {
      "id": "uuid",
      "question_text": "...",
      "options": {...},
      "difficulty_level": "easy",
      "subtopic_name": "Linear Equations",
      "major_topic_name": "Algebra"
    }
  }
}
```

## Status Codes

- `200` - Success
- `201` - Created (new attempt)
- `400` - Bad Request (invalid params)
- `401` - Unauthorized (invalid token)
- `404` - Not Found (problem not found)
- `500` - Internal Server Error

## Common Filters

```bash
# Get all problems
curl "$BASE/problems" -H "Authorization: Bearer $TOKEN"

# Get Linear Equations problems
curl "$BASE/problems?subtopic_id=550e8400-e29b-41d4-a716-446655440010" \
  -H "Authorization: Bearer $TOKEN"

# Get only easy problems
curl "$BASE/problems?difficulty=easy" -H "Authorization: Bearer $TOKEN"

# Get medium Linear Equations problems
curl "$BASE/problems?subtopic_id=550e8400-e29b-41d4-a716-446655440010&difficulty=medium" \
  -H "Authorization: Bearer $TOKEN"

# Get page 2, 20 items per page
curl "$BASE/problems?page=2&page_size=20" -H "Authorization: Bearer $TOKEN"
```

## Problem Count by Subtopic

| Subtopic | Count |
|----------|-------|
| Linear Equations | 7 |
| Quadratic Functions | 7 |
| Exponential & Logarithmic | 6 |
| Triangles & Angles | 6 |
| Circles | 6 |
| Solid Geometry | 6 |
| **TOTAL** | **42** |

## Analytics Data Structure

```json
{
  "total_attempts": 15,
  "correct_attempts": 12,
  "accuracy_rate": 80.00,  // percentage
  "avg_time_taken": "42.50",  // seconds
  "unique_problems_attempted": 7
}
```

## Useful Database Queries

```sql
-- Check problems per subtopic
SELECT s.name, COUNT(pp.id) as count
FROM subtopics s
LEFT JOIN practice_problems pp ON s.id = pp.subtopic_id
GROUP BY s.name;

-- View all attempts for a user
SELECT * FROM user_attempts 
WHERE user_id = 'your-user-id'
ORDER BY created_at DESC;

-- Check user progress
SELECT * FROM user_progress 
WHERE user_id = 'your-user-id';
```

## File Locations

- **Models**: `src/models/problemModel.js`, `attemptModel.js`, `progressModel.js`
- **Controllers**: `src/controllers/problemController.js`, `attemptController.js`
- **Routes**: `src/routes/problems.js`, `attempts.js`
- **Docs**: `api-docs/PRACTICE_API.md`, `TESTING_GUIDE.md`
- **Migration**: `migrations/20251114234011-add-more-practice-problems.js`

## Troubleshooting

**401 Unauthorized**: Check token is valid and format is `Bearer <token>`

**404 Not Found**: Verify problem ID exists, run migrations if needed

**No problems returned**: Run `npm run db:migrate` to load sample data

**Database connection error**: Check `.env` file has correct DB credentials

## Documentation

- `api-docs/PRACTICE_API.md` - Complete API documentation
- `api-docs/TESTING_GUIDE.md` - Comprehensive testing guide
- `PRACTICE_SYSTEM_README.md` - Implementation overview
- `FEATURE_IMPLEMENTATION.md` - Detailed feature summary
- `DATABASE_SCHEMA.md` - Database structure

---

**Port**: 3000 (default)  
**Auth**: JWT required on all endpoints  
**Format**: JSON request/response  
