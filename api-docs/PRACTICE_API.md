# Practice Problems API Documentation

## Overview
This document describes the Practice Problems and Attempts API endpoints for the SAT Math Learning Platform. These endpoints support fetching practice problems, submitting answers, getting instant feedback, and viewing analytics.

## Base URL
```
http://localhost:3000/api
```

## Authentication
All endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## Practice Problems Endpoints

### 1. Get Practice Problems

Fetch a list of practice problems with optional filtering and pagination.

**Endpoint:**
```
GET /api/problems
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| subtopic_id | UUID | No | Filter by subtopic ID |
| difficulty | String | No | Filter by difficulty (easy, medium, hard) |
| page | Integer | No | Page number (default: 1) |
| page_size | Integer | No | Items per page (default: 10, max: 100) |

**Example Request:**
```bash
GET /api/problems?subtopic_id=550e8400-e29b-41d4-a716-446655440010&difficulty=medium&page=1&page_size=10
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440200",
      "subtopic_id": "550e8400-e29b-41d4-a716-446655440010",
      "question_text": "Solve for x: 2x + 5 = 13",
      "options": {
        "A": "x = 3",
        "B": "x = 4",
        "C": "x = 5",
        "D": "x = 6"
      },
      "difficulty_level": "easy",
      "created_at": "2024-01-03T10:00:00.000Z",
      "subtopic_name": "Linear Equations",
      "major_topic_name": "Algebra"
    }
  ],
  "pagination": {
    "total": 42,
    "page": 1,
    "pageSize": 10,
    "totalPages": 5
  }
}
```

**Note:** The response does NOT include `correct_answer` or `explanation` to prevent cheating.

---

### 2. Get Single Problem

Fetch details for a specific practice problem.

**Endpoint:**
```
GET /api/problems/:id
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | UUID | Yes | Problem ID |

**Example Request:**
```bash
GET /api/problems/550e8400-e29b-41d4-a716-446655440200
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440200",
    "subtopic_id": "550e8400-e29b-41d4-a716-446655440010",
    "question_text": "Solve for x: 2x + 5 = 13",
    "options": {
      "A": "x = 3",
      "B": "x = 4",
      "C": "x = 5",
      "D": "x = 6"
    },
    "difficulty_level": "easy",
    "created_at": "2024-01-03T10:00:00.000Z",
    "subtopic_name": "Linear Equations",
    "major_topic_name": "Algebra"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Problem not found"
}
```

---

## Answer Submission & Feedback Endpoints

### 3. Submit Answer (Instant Feedback)

Submit an answer to a practice problem and receive instant feedback with explanation.

**Endpoint:**
```
POST /api/attempts/problems/:id/submit
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | UUID | Yes | Problem ID |

**Request Body:**
```json
{
  "answer": "B",
  "time_taken": 45
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| answer | String | Yes | User's answer (A, B, C, or D) |
| time_taken | Integer | No | Time spent in seconds |

**Example Request:**
```bash
POST /api/attempts/problems/550e8400-e29b-41d4-a716-446655440200/submit
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "answer": "B",
  "time_taken": 45
}
```

**Success Response - Correct Answer (201):**
```json
{
  "success": true,
  "message": "Correct answer!",
  "data": {
    "attempt_id": "650e8400-e29b-41d4-a716-446655440999",
    "is_correct": true,
    "correct_answer": "B",
    "explanation": "Subtract 5 from both sides: 2x = 8. Divide both sides by 2: x = 4",
    "user_answer": "B",
    "time_taken": 45,
    "problem": {
      "id": "550e8400-e29b-41d4-a716-446655440200",
      "question_text": "Solve for x: 2x + 5 = 13",
      "options": {
        "A": "x = 3",
        "B": "x = 4",
        "C": "x = 5",
        "D": "x = 6"
      },
      "difficulty_level": "easy",
      "subtopic_name": "Linear Equations",
      "major_topic_name": "Algebra"
    }
  }
}
```

**Success Response - Incorrect Answer (201):**
```json
{
  "success": true,
  "message": "Incorrect answer",
  "data": {
    "attempt_id": "650e8400-e29b-41d4-a716-446655440999",
    "is_correct": false,
    "correct_answer": "B",
    "explanation": "Subtract 5 from both sides: 2x = 8. Divide both sides by 2: x = 4",
    "user_answer": "A",
    "time_taken": 45,
    "problem": {
      "id": "550e8400-e29b-41d4-a716-446655440200",
      "question_text": "Solve for x: 2x + 5 = 13",
      "options": {
        "A": "x = 3",
        "B": "x = 4",
        "C": "x = 5",
        "D": "x = 6"
      },
      "difficulty_level": "easy",
      "subtopic_name": "Linear Equations",
      "major_topic_name": "Algebra"
    }
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Problem not found"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Answer is required"
}
```

---

## Attempt History Endpoints

### 4. Get Attempt History

Retrieve the user's history of problem attempts.

**Endpoint:**
```
GET /api/attempts/history
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | Integer | No | Page number (default: 1) |
| page_size | Integer | No | Items per page (default: 20, max: 100) |

**Example Request:**
```bash
GET /api/attempts/history?page=1&page_size=20
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "650e8400-e29b-41d4-a716-446655440999",
      "user_id": "750e8400-e29b-41d4-a716-446655440888",
      "problem_id": "550e8400-e29b-41d4-a716-446655440200",
      "user_answer": "B",
      "is_correct": true,
      "time_taken": 45,
      "created_at": "2024-01-15T14:30:00.000Z",
      "question_text": "Solve for x: 2x + 5 = 13",
      "options": {
        "A": "x = 3",
        "B": "x = 4",
        "C": "x = 5",
        "D": "x = 6"
      },
      "correct_answer": "B",
      "explanation": "Subtract 5 from both sides: 2x = 8. Divide both sides by 2: x = 4",
      "difficulty_level": "easy",
      "subtopic_name": "Linear Equations",
      "major_topic_name": "Algebra"
    }
  ],
  "pagination": {
    "total": 125,
    "page": 1,
    "pageSize": 20,
    "totalPages": 7
  }
}
```

---

## Analytics Endpoints

### 5. Get Overall Analytics

Get comprehensive analytics across all subtopics for the authenticated user.

**Endpoint:**
```
GET /api/attempts/analytics
```

**Example Request:**
```bash
GET /api/attempts/analytics
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "subtopics": [
      {
        "subtopic_id": "550e8400-e29b-41d4-a716-446655440010",
        "subtopic_name": "Linear Equations",
        "major_topic_name": "Algebra",
        "total_attempts": 15,
        "correct_attempts": 12,
        "accuracy_rate": 80.00,
        "avg_time_taken": "42.50",
        "unique_problems_attempted": 7
      },
      {
        "subtopic_id": "550e8400-e29b-41d4-a716-446655440011",
        "subtopic_name": "Quadratic Functions",
        "major_topic_name": "Algebra",
        "total_attempts": 10,
        "correct_attempts": 7,
        "accuracy_rate": 70.00,
        "avg_time_taken": "58.30",
        "unique_problems_attempted": 5
      }
    ],
    "progress": [
      {
        "id": "850e8400-e29b-41d4-a716-446655440555",
        "user_id": "750e8400-e29b-41d4-a716-446655440888",
        "subtopic_id": "550e8400-e29b-41d4-a716-446655440010",
        "problems_completed": 7,
        "accuracy_rate": "80.00",
        "last_accessed": "2024-01-15T14:30:00.000Z",
        "streak_days": 0,
        "last_streak_updated": null,
        "created_at": "2024-01-10T10:00:00.000Z",
        "updated_at": "2024-01-15T14:30:00.000Z",
        "subtopic_name": "Linear Equations",
        "subtopic_description": "Solving one-variable and two-variable linear equations",
        "major_topic_name": "Algebra",
        "major_topic_id": "550e8400-e29b-41d4-a716-446655440000"
      }
    ],
    "summary": {
      "total_attempts": 25,
      "total_correct": 19,
      "overall_accuracy": 76.00,
      "subtopics_started": 2
    }
  }
}
```

---

### 6. Get Subtopic Analytics

Get detailed analytics for a specific subtopic.

**Endpoint:**
```
GET /api/attempts/analytics/subtopics/:subtopicId
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| subtopicId | UUID | Yes | Subtopic ID |

**Example Request:**
```bash
GET /api/attempts/analytics/subtopics/550e8400-e29b-41d4-a716-446655440010
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "subtopic_id": "550e8400-e29b-41d4-a716-446655440010",
    "subtopic_name": "Linear Equations",
    "major_topic_name": "Algebra",
    "analytics": {
      "total_attempts": 15,
      "correct_attempts": 12,
      "accuracy_rate": 80.00,
      "avg_time_taken": "42.50",
      "unique_problems_attempted": 7
    },
    "progress": {
      "id": "850e8400-e29b-41d4-a716-446655440555",
      "user_id": "750e8400-e29b-41d4-a716-446655440888",
      "subtopic_id": "550e8400-e29b-41d4-a716-446655440010",
      "problems_completed": 7,
      "accuracy_rate": "80.00",
      "last_accessed": "2024-01-15T14:30:00.000Z",
      "streak_days": 0,
      "last_streak_updated": null,
      "created_at": "2024-01-10T10:00:00.000Z",
      "updated_at": "2024-01-15T14:30:00.000Z",
      "subtopic_name": "Linear Equations",
      "subtopic_description": "Solving one-variable and two-variable linear equations",
      "major_topic_name": "Algebra",
      "major_topic_id": "550e8400-e29b-41d4-a716-446655440000"
    }
  }
}
```

---

## Data Models

### Problem Object (Public - No Answer)
```typescript
{
  id: UUID,
  subtopic_id: UUID,
  question_text: string,
  options: {
    A: string,
    B: string,
    C: string,
    D: string
  },
  difficulty_level: "easy" | "medium" | "hard",
  created_at: timestamp,
  subtopic_name: string,
  major_topic_name: string
}
```

### Attempt Object
```typescript
{
  id: UUID,
  user_id: UUID,
  problem_id: UUID,
  user_answer: string,
  is_correct: boolean,
  time_taken: number | null,
  created_at: timestamp
}
```

### Analytics Object
```typescript
{
  total_attempts: number,
  correct_attempts: number,
  accuracy_rate: number,  // percentage (0-100)
  avg_time_taken: string | null,  // in seconds
  unique_problems_attempted: number
}
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created (for new attempts) |
| 400 | Bad Request (invalid parameters) |
| 401 | Unauthorized (missing/invalid token) |
| 404 | Not Found (problem/resource not found) |
| 500 | Internal Server Error |

---

## Notes

### Instant Feedback
- The submit endpoint returns immediate feedback including:
  - Whether the answer is correct
  - The correct answer
  - Detailed explanation
  - User's submitted answer
  - Time taken

### Progress Tracking
- User progress is automatically updated on every submission
- Progress includes:
  - Number of unique problems completed
  - Accuracy rate (percentage of correct attempts)
  - Last accessed timestamp

### Pagination
- Default page size is configurable (10 for problems, 20 for history)
- Maximum page size is 100 to prevent performance issues
- Page numbers start at 1

### Answer Format
- Answers are case-insensitive and whitespace-trimmed
- Valid answers: "A", "B", "C", "D"
- Stored in uppercase in the database

### Timing Data
- `time_taken` is optional and measured in seconds
- Used for analytics and performance tracking
- Helps identify areas where students struggle
