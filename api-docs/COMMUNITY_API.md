# Community Discussion Board API Documentation

## Overview

The Community Discussion Board API provides peer-to-peer learning support through discussion posts and threaded conversations. Students can ask questions, share insights, and help each other learn SAT Math concepts.

## Base URL
```
http://localhost:3000/api/community
```

## Authentication

All endpoints require authentication via Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## Topic Tags

Valid topic tags for posts:
- `general` - General discussion (default)
- `algebra` - Algebra-related questions
- `geometry` - Geometry-related questions
- `trigonometry` - Trigonometry-related questions
- `statistics` - Statistics and probability
- `calculus` - Calculus concepts

## Endpoints

### 1. Create Discussion Post

Create a new discussion post.

**Endpoint:** `POST /posts`

**Request Body:**
```json
{
  "title": "How to solve quadratic equations?",
  "content": "I'm having trouble understanding the quadratic formula. Can someone explain when to use it versus factoring?",
  "topic": "algebra"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "title": "How to solve quadratic equations?",
    "content": "I'm having trouble understanding the quadratic formula...",
    "topic": "algebra",
    "author": {
      "username": "mathstudent123",
      "firstName": "John",
      "lastName": "Doe"
    },
    "replyCount": 0,
    "createdAt": "2024-11-15T19:30:00.000Z",
    "updatedAt": "2024-11-15T19:30:00.000Z"
  }
}
```

**Validation:**
- `title` is required (max 500 characters)
- `content` is required
- `topic` must be one of the valid topics (defaults to 'general' if not provided)

---

### 2. Get All Posts

Retrieve discussion posts with filtering, searching, sorting, and pagination.

**Endpoint:** `GET /posts`

**Query Parameters:**
- `topic` (optional) - Filter by topic tag
- `search` (optional) - Search in title and content
- `sort` (optional) - Sort order: `newest`, `most-replied`, `trending` (default: `newest`)
- `page` (optional) - Page number (default: 1)
- `limit` or `pageSize` (optional) - Results per page (default: 20, max: 100)

**Example Requests:**
```
GET /posts
GET /posts?topic=algebra
GET /posts?search=quadratic
GET /posts?sort=most-replied&page=2&limit=10
GET /posts?topic=geometry&search=triangle&sort=trending
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "userId": "123e4567-e89b-12d3-a456-426614174000",
      "title": "How to solve quadratic equations?",
      "content": "I'm having trouble understanding...",
      "topic": "algebra",
      "author": {
        "username": "mathstudent123",
        "firstName": "John",
        "lastName": "Doe"
      },
      "replyCount": 5,
      "createdAt": "2024-11-15T19:30:00.000Z",
      "updatedAt": "2024-11-15T19:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "pageSize": 20,
    "totalPages": 3
  }
}
```

**Sort Options:**
- `newest` - Most recently created posts first
- `most-replied` - Posts with most replies first
- `trending` - Hot posts based on recent activity

---

### 3. Get Post by ID

Retrieve a specific post with all its replies in a nested tree structure.

**Endpoint:** `GET /posts/:id`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Post retrieved successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "title": "How to solve quadratic equations?",
    "content": "I'm having trouble understanding the quadratic formula...",
    "topic": "algebra",
    "author": {
      "username": "mathstudent123",
      "firstName": "John",
      "lastName": "Doe"
    },
    "replyCount": 3,
    "createdAt": "2024-11-15T19:30:00.000Z",
    "updatedAt": "2024-11-15T19:30:00.000Z",
    "replies": [
      {
        "id": "660e8400-e29b-41d4-a716-446655440001",
        "postId": "550e8400-e29b-41d4-a716-446655440000",
        "userId": "223e4567-e89b-12d3-a456-426614174001",
        "content": "The quadratic formula is useful when factoring is difficult...",
        "parentId": null,
        "author": {
          "username": "mathhelper",
          "firstName": "Jane",
          "lastName": "Smith"
        },
        "createdAt": "2024-11-15T19:35:00.000Z",
        "updatedAt": "2024-11-15T19:35:00.000Z",
        "replies": [
          {
            "id": "770e8400-e29b-41d4-a716-446655440002",
            "postId": "550e8400-e29b-41d4-a716-446655440000",
            "userId": "123e4567-e89b-12d3-a456-426614174000",
            "content": "Thanks! That makes sense.",
            "parentId": "660e8400-e29b-41d4-a716-446655440001",
            "author": {
              "username": "mathstudent123",
              "firstName": "John",
              "lastName": "Doe"
            },
            "createdAt": "2024-11-15T19:40:00.000Z",
            "updatedAt": "2024-11-15T19:40:00.000Z",
            "replies": []
          }
        ]
      }
    ]
  }
}
```

**Error Response:** `404 Not Found`
```json
{
  "success": false,
  "error": {
    "statusCode": 404,
    "message": "Post not found"
  }
}
```

---

### 4. Update Post

Update your own post (title, content, or topic).

**Endpoint:** `PUT /posts/:id`

**Request Body:**
```json
{
  "title": "How to solve quadratic equations? [UPDATED]",
  "content": "I'm having trouble understanding the quadratic formula and completing the square...",
  "topic": "algebra"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Post updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "title": "How to solve quadratic equations? [UPDATED]",
    "content": "I'm having trouble understanding...",
    "topic": "algebra",
    "author": {
      "username": "mathstudent123",
      "firstName": "John",
      "lastName": "Doe"
    },
    "replyCount": 0,
    "createdAt": "2024-11-15T19:30:00.000Z",
    "updatedAt": "2024-11-15T20:00:00.000Z"
  }
}
```

**Authorization:**
- Only the post author can update their own post
- Returns `403 Forbidden` if user is not the author

**Validation:**
- `title` is required (max 500 characters)
- `content` is required
- `topic` must be valid (optional, uses existing if not provided)

---

### 5. Delete Post

Delete your own post. All replies will be cascade deleted.

**Endpoint:** `DELETE /posts/:id`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Post deleted successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Authorization:**
- Only the post author can delete their own post
- Returns `403 Forbidden` if user is not the author
- All replies are automatically deleted (cascade)

---

### 6. Create Reply

Add a reply to a post or reply to another reply (threaded conversation).

**Endpoint:** `POST /posts/:id/replies`

**Request Body (Direct reply to post):**
```json
{
  "content": "The quadratic formula is useful when you can't factor easily..."
}
```

**Request Body (Reply to another reply):**
```json
{
  "content": "Thanks for the clarification!",
  "parentId": "660e8400-e29b-41d4-a716-446655440001"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Reply created successfully",
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "postId": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "223e4567-e89b-12d3-a456-426614174001",
    "content": "The quadratic formula is useful when...",
    "parentId": null,
    "author": {
      "username": "mathhelper",
      "firstName": "Jane",
      "lastName": "Smith"
    },
    "createdAt": "2024-11-15T19:35:00.000Z",
    "updatedAt": "2024-11-15T19:35:00.000Z"
  }
}
```

**Validation:**
- `content` is required
- `parentId` (optional) - Must be a valid reply ID belonging to the same post
- Post must exist

---

### 7. Update Reply

Update your own reply.

**Endpoint:** `PUT /replies/:id`

**Request Body:**
```json
{
  "content": "The quadratic formula is useful when factoring is difficult or impossible..."
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Reply updated successfully",
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "postId": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "223e4567-e89b-12d3-a456-426614174001",
    "content": "The quadratic formula is useful when factoring is difficult or impossible...",
    "parentId": null,
    "author": {
      "username": "mathhelper",
      "firstName": "Jane",
      "lastName": "Smith"
    },
    "createdAt": "2024-11-15T19:35:00.000Z",
    "updatedAt": "2024-11-15T20:10:00.000Z"
  }
}
```

**Authorization:**
- Only the reply author can update their own reply
- Returns `403 Forbidden` if user is not the author

---

### 8. Delete Reply

Delete your own reply. All nested child replies will be cascade deleted.

**Endpoint:** `DELETE /replies/:id`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Reply deleted successfully",
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001"
  }
}
```

**Authorization:**
- Only the reply author can delete their own reply
- Returns `403 Forbidden` if user is not the author
- Child replies are automatically deleted (cascade)

---

### 9. Get Trending Posts

Retrieve trending posts based on recent activity (past 7 days).

**Endpoint:** `GET /trending`

**Query Parameters:**
- `limit` (optional) - Number of results (default: 10, max: 50)

**Example Request:**
```
GET /trending?limit=5
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Trending posts retrieved successfully",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "userId": "123e4567-e89b-12d3-a456-426614174000",
      "title": "Best SAT geometry tricks?",
      "content": "Share your favorite geometry shortcuts...",
      "topic": "geometry",
      "author": {
        "username": "mathstudent123",
        "firstName": "John",
        "lastName": "Doe"
      },
      "replyCount": 15,
      "createdAt": "2024-11-14T19:30:00.000Z",
      "updatedAt": "2024-11-14T19:30:00.000Z"
    }
  ]
}
```

**Trending Algorithm:**
- Only includes posts from the past 7 days
- Ranks by: `reply_count / time_since_created`
- Hot posts with recent activity appear first

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": {
    "statusCode": 400,
    "message": "Title is required"
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": {
    "statusCode": 401,
    "message": "Authorization token missing"
  }
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": {
    "statusCode": 403,
    "message": "You can only edit your own posts"
  }
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": {
    "statusCode": 404,
    "message": "Post not found"
  }
}
```

---

## Usage Examples

### Example 1: Creating a Discussion Post

```bash
curl -X POST http://localhost:3000/api/community/posts \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Need help with logarithms",
    "content": "Can someone explain log properties?",
    "topic": "algebra"
  }'
```

### Example 2: Searching Posts

```bash
curl -X GET "http://localhost:3000/api/community/posts?search=triangle&topic=geometry" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Example 3: Getting Most Replied Posts

```bash
curl -X GET "http://localhost:3000/api/community/posts?sort=most-replied&limit=10" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Example 4: Replying to a Post

```bash
curl -X POST http://localhost:3000/api/community/posts/550e8400-e29b-41d4-a716-446655440000/replies \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Here's how to think about it..."
  }'
```

### Example 5: Nested Reply (Reply to a Reply)

```bash
curl -X POST http://localhost:3000/api/community/posts/550e8400-e29b-41d4-a716-446655440000/replies \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Thanks, that helps!",
    "parentId": "660e8400-e29b-41d4-a716-446655440001"
  }'
```

---

## Features Summary

✅ **Create Discussion Posts** - Start new discussions with topics
✅ **Threaded Conversations** - Nested reply structure
✅ **Search & Filter** - Search by keyword and filter by topic
✅ **Multiple Sort Options** - Newest, most-replied, trending
✅ **Pagination Support** - Efficient data loading
✅ **Authorization** - Users can only edit/delete their own content
✅ **User Attribution** - All posts and replies show author information
✅ **Trending Algorithm** - Discover popular discussions

---

## Database Schema

### community_posts Table
- `id` - UUID (Primary Key)
- `user_id` - UUID (Foreign Key → users)
- `title` - VARCHAR(500)
- `content` - TEXT
- `topic` - VARCHAR(100) (default: 'general')
- `created_at` - TIMESTAMP WITH TIME ZONE
- `updated_at` - TIMESTAMP WITH TIME ZONE

### community_replies Table
- `id` - UUID (Primary Key)
- `post_id` - UUID (Foreign Key → community_posts, CASCADE DELETE)
- `user_id` - UUID (Foreign Key → users)
- `content` - TEXT
- `parent_id` - UUID (Foreign Key → community_replies, CASCADE DELETE, nullable)
- `created_at` - TIMESTAMP WITH TIME ZONE
- `updated_at` - TIMESTAMP WITH TIME ZONE

### Indexes
- `idx_community_posts_user_id` on community_posts(user_id)
- `idx_community_posts_created_at` on community_posts(created_at)
- `idx_community_posts_topic` on community_posts(topic)
- `idx_community_replies_post_id` on community_replies(post_id)
- `idx_community_replies_user_id` on community_replies(user_id)
- `idx_community_replies_parent_id` on community_replies(parent_id)
- `idx_community_replies_created_at` on community_replies(created_at)

---

## Notes

- All timestamps are in ISO 8601 format with timezone
- UUIDs are used for all IDs
- Deleting a post cascades to all its replies
- Deleting a reply cascades to all its child replies
- Topic tags are case-insensitive and normalized to lowercase
- Reply trees can be arbitrarily deep (nested replies)
- The trending algorithm uses recency and engagement to surface hot topics
