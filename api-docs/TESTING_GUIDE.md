# Practice Problems API Testing Guide

This guide provides step-by-step instructions and example requests for testing the Practice Problems API.

## Prerequisites

1. Database setup complete (migrations run)
2. Server running on `http://localhost:3000`
3. User account created and JWT token obtained

## Setup Steps

### 1. Start the Server

```bash
npm install
cp .env.example .env
# Edit .env with database credentials
npm run db:migrate
npm start
```

### 2. Create a Test User

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "Test123!@#",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### 3. Login and Get Token

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "...",
      "email": "test@example.com",
      "username": "testuser"
    }
  }
}
```

Save the `accessToken` for subsequent requests.

---

## Test Scenarios

### Scenario 1: Get All Problems

```bash
export TOKEN="your-access-token-here"

curl -X GET "http://localhost:3000/api/problems?page=1&page_size=10" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Result:**
- Status 200
- List of problems without answers/explanations
- Pagination metadata

---

### Scenario 2: Filter Problems by Subtopic

First, get the subtopic IDs from sample data:
- Linear Equations: `550e8400-e29b-41d4-a716-446655440010`
- Quadratic Functions: `550e8400-e29b-41d4-a716-446655440011`
- Exponential Functions: `550e8400-e29b-41d4-a716-446655440012`
- Triangles: `550e8400-e29b-41d4-a716-446655440020`
- Circles: `550e8400-e29b-41d4-a716-446655440021`
- Solid Geometry: `550e8400-e29b-41d4-a716-446655440022`

```bash
curl -X GET "http://localhost:3000/api/problems?subtopic_id=550e8400-e29b-41d4-a716-446655440010&page=1&page_size=5" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Result:**
- Only problems from "Linear Equations" subtopic
- 7 total problems (after migration)

---

### Scenario 3: Filter by Difficulty

```bash
# Get easy problems
curl -X GET "http://localhost:3000/api/problems?difficulty=easy&page=1&page_size=10" \
  -H "Authorization: Bearer $TOKEN"

# Get medium problems
curl -X GET "http://localhost:3000/api/problems?difficulty=medium&page=1&page_size=10" \
  -H "Authorization: Bearer $TOKEN"

# Get hard problems
curl -X GET "http://localhost:3000/api/problems?difficulty=hard&page=1&page_size=10" \
  -H "Authorization: Bearer $TOKEN"
```

---

### Scenario 4: Get Single Problem

```bash
curl -X GET "http://localhost:3000/api/problems/550e8400-e29b-41d4-a716-446655440200" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Result:**
- Problem details
- No correct_answer or explanation fields

---

### Scenario 5: Submit Correct Answer

```bash
curl -X POST "http://localhost:3000/api/attempts/problems/550e8400-e29b-41d4-a716-446655440200/submit" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "answer": "B",
    "time_taken": 45
  }'
```

**Expected Result:**
- Status 201
- `is_correct: true`
- Correct answer shown: "B"
- Explanation provided
- Attempt ID returned

---

### Scenario 6: Submit Incorrect Answer

```bash
curl -X POST "http://localhost:3000/api/attempts/problems/550e8400-e29b-41d4-a716-446655440200/submit" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "answer": "A",
    "time_taken": 30
  }'
```

**Expected Result:**
- Status 201
- `is_correct: false`
- Correct answer shown: "B"
- Explanation provided

---

### Scenario 7: Get Attempt History

```bash
curl -X GET "http://localhost:3000/api/attempts/history?page=1&page_size=20" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Result:**
- List of all user's attempts
- Includes problem details and answers
- Ordered by most recent first

---

### Scenario 8: Get Overall Analytics

```bash
curl -X GET "http://localhost:3000/api/attempts/analytics" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Result:**
- Analytics for all subtopics
- Progress data
- Summary statistics:
  - Total attempts
  - Total correct
  - Overall accuracy percentage
  - Number of subtopics started

---

### Scenario 9: Get Subtopic Analytics

```bash
curl -X GET "http://localhost:3000/api/attempts/analytics/subtopics/550e8400-e29b-41d4-a716-446655440010" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Result:**
- Analytics specific to Linear Equations subtopic
- Total attempts
- Correct attempts
- Accuracy rate
- Average time taken
- Number of unique problems attempted
- Progress record

---

## Complete Test Flow

### Test Complete Learning Session

```bash
# 1. Get problems for Linear Equations
curl -X GET "http://localhost:3000/api/problems?subtopic_id=550e8400-e29b-41d4-a716-446655440010" \
  -H "Authorization: Bearer $TOKEN"

# 2. Submit answer to first problem (ID: 550e8400-e29b-41d4-a716-446655440200)
curl -X POST "http://localhost:3000/api/attempts/problems/550e8400-e29b-41d4-a716-446655440200/submit" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"answer": "B", "time_taken": 45}'

# 3. Submit answer to second problem (ID: 550e8400-e29b-41d4-a716-446655440201)
curl -X POST "http://localhost:3000/api/attempts/problems/550e8400-e29b-41d4-a716-446655440201/submit" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"answer": "D", "time_taken": 52}'

# 4. Submit answer to third problem (ID: 550e8400-e29b-41d4-a716-446655440202)
curl -X POST "http://localhost:3000/api/attempts/problems/550e8400-e29b-41d4-a716-446655440202/submit" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"answer": "D", "time_taken": 68}'

# 5. Check analytics for this subtopic
curl -X GET "http://localhost:3000/api/attempts/analytics/subtopics/550e8400-e29b-41d4-a716-446655440010" \
  -H "Authorization: Bearer $TOKEN"

# 6. Get overall analytics
curl -X GET "http://localhost:3000/api/attempts/analytics" \
  -H "Authorization: Bearer $TOKEN"

# 7. View attempt history
curl -X GET "http://localhost:3000/api/attempts/history" \
  -H "Authorization: Bearer $TOKEN"
```

---

## Validation Tests

### Test Invalid Token

```bash
curl -X GET "http://localhost:3000/api/problems" \
  -H "Authorization: Bearer invalid-token"
```

**Expected:** 401 Unauthorized

---

### Test Missing Token

```bash
curl -X GET "http://localhost:3000/api/problems"
```

**Expected:** 401 Unauthorized

---

### Test Invalid Problem ID

```bash
curl -X POST "http://localhost:3000/api/attempts/problems/00000000-0000-0000-0000-000000000000/submit" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"answer": "A"}'
```

**Expected:** 404 Not Found

---

### Test Missing Answer

```bash
curl -X POST "http://localhost:3000/api/attempts/problems/550e8400-e29b-41d4-a716-446655440200/submit" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Expected:** 400 Bad Request

---

### Test Invalid Pagination

```bash
curl -X GET "http://localhost:3000/api/problems?page=-1&page_size=1000" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected:** 400 Bad Request

---

## Database Verification Queries

Connect to the database and run these queries to verify data integrity:

```sql
-- Check total problems per subtopic
SELECT 
  s.name,
  COUNT(pp.id) as problem_count
FROM subtopics s
LEFT JOIN practice_problems pp ON s.id = pp.subtopic_id
GROUP BY s.name
ORDER BY s.name;

-- Expected: 6-7 problems per subtopic after migration

-- Check user attempts
SELECT 
  ua.is_correct,
  COUNT(*) as count
FROM user_attempts ua
WHERE ua.user_id = 'your-user-id'
GROUP BY ua.is_correct;

-- Check user progress
SELECT 
  s.name,
  up.problems_completed,
  up.accuracy_rate,
  up.last_accessed
FROM user_progress up
JOIN subtopics s ON up.subtopic_id = s.id
WHERE up.user_id = 'your-user-id';
```

---

## Postman Collection

Import this JSON into Postman for easier testing:

```json
{
  "info": {
    "name": "SAT Math Practice API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Signup",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/api/auth/signup",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"test@example.com\",\n  \"username\": \"testuser\",\n  \"password\": \"Test123!@#\"\n}"
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/api/auth/login",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"test@example.com\",\n  \"password\": \"Test123!@#\"\n}"
            }
          }
        }
      ]
    },
    {
      "name": "Problems",
      "item": [
        {
          "name": "Get All Problems",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/api/problems"
          }
        },
        {
          "name": "Get Problems by Subtopic",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/api/problems?subtopic_id={{subtopicId}}"
          }
        }
      ]
    },
    {
      "name": "Attempts",
      "item": [
        {
          "name": "Submit Answer",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/api/attempts/problems/{{problemId}}/submit",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"answer\": \"B\",\n  \"time_taken\": 45\n}"
            }
          }
        },
        {
          "name": "Get History",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/api/attempts/history"
          }
        },
        {
          "name": "Get Analytics",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/api/attempts/analytics"
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000"
    },
    {
      "key": "token",
      "value": ""
    }
  ]
}
```

---

## Troubleshooting

### Issue: 401 Unauthorized
- Check that token is valid and not expired
- Verify Authorization header format: `Bearer <token>`

### Issue: 404 Not Found
- Verify problem IDs exist in database
- Check if migrations have been run

### Issue: No problems returned
- Run migration: `npm run db:migrate`
- Verify sample data was inserted

### Issue: Analytics showing 0
- Submit some answers first
- Check that user_id matches logged in user

---

## Performance Testing

Test pagination with large datasets:

```bash
# Test page size limits
for i in {1..5}; do
  curl -s -X GET "http://localhost:3000/api/problems?page=$i&page_size=10" \
    -H "Authorization: Bearer $TOKEN" | jq '.pagination'
done
```

---

## Success Criteria

✅ All endpoints return expected status codes  
✅ Authentication required and working  
✅ Pagination working correctly  
✅ Instant feedback provided on submission  
✅ User progress automatically updated  
✅ Analytics calculations accurate  
✅ Attempt history preserved  
✅ Filtering by subtopic/difficulty works  
✅ Time tracking recorded properly  
