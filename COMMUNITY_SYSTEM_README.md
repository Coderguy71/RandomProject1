# Community Discussion Board System

## Overview

The Community Discussion Board provides a complete peer-to-peer learning support system where students can ask questions, share insights, and help each other understand SAT Math concepts through threaded discussions.

## Features Implemented

### ✅ Core Functionality
- **Create Discussion Posts** - Students can create posts with title, content, and topic tags
- **Threaded Conversations** - Support for nested replies (reply to posts and replies)
- **Search & Filter** - Search posts by keyword and filter by topic tags
- **Multiple Sort Options** - Sort by newest, most-replied, or trending
- **Pagination Support** - Efficient data loading with configurable page sizes
- **User Authorization** - Users can only edit/delete their own posts and replies
- **User Attribution** - All posts and replies display author information

### Topic Tags

The system supports six topic categories:
- `general` - General discussion (default)
- `algebra` - Algebra-related questions
- `geometry` - Geometry-related questions
- `trigonometry` - Trigonometry concepts
- `statistics` - Statistics and probability
- `calculus` - Calculus topics

### Sorting Options

1. **Newest** - Posts sorted by creation date (most recent first)
2. **Most Replied** - Posts with the highest reply count first
3. **Trending** - Hot posts based on recent activity (past 7 days)

## API Endpoints

All endpoints require authentication via Bearer token.

### Posts Management
```
POST   /api/community/posts           - Create a new post
GET    /api/community/posts           - Get all posts (with filters)
GET    /api/community/posts/:id       - Get specific post with replies
PUT    /api/community/posts/:id       - Update your own post
DELETE /api/community/posts/:id       - Delete your own post
```

### Replies Management
```
POST   /api/community/posts/:id/replies  - Add reply to post
PUT    /api/community/replies/:id        - Update your own reply
DELETE /api/community/replies/:id        - Delete your own reply
```

### Discovery
```
GET    /api/community/trending          - Get trending posts
```

## Database Schema

### community_posts Table

| Column     | Type                      | Description                    |
|------------|---------------------------|--------------------------------|
| id         | UUID                      | Primary key                    |
| user_id    | UUID                      | Foreign key to users table     |
| title      | VARCHAR(500)              | Post title                     |
| content    | TEXT                      | Post content                   |
| topic      | VARCHAR(100)              | Topic tag (default: 'general') |
| created_at | TIMESTAMP WITH TIME ZONE  | Creation timestamp             |
| updated_at | TIMESTAMP WITH TIME ZONE  | Last update timestamp          |

**Indexes:**
- `idx_community_posts_user_id` on user_id
- `idx_community_posts_created_at` on created_at
- `idx_community_posts_topic` on topic

### community_replies Table

| Column     | Type                      | Description                        |
|------------|---------------------------|------------------------------------|
| id         | UUID                      | Primary key                        |
| post_id    | UUID                      | Foreign key to community_posts     |
| user_id    | UUID                      | Foreign key to users table         |
| content    | TEXT                      | Reply content                      |
| parent_id  | UUID                      | Parent reply (for nested replies)  |
| created_at | TIMESTAMP WITH TIME ZONE  | Creation timestamp                 |
| updated_at | TIMESTAMP WITH TIME ZONE  | Last update timestamp              |

**Indexes:**
- `idx_community_replies_post_id` on post_id
- `idx_community_replies_user_id` on user_id
- `idx_community_replies_parent_id` on parent_id
- `idx_community_replies_created_at` on created_at

**Cascade Deletes:**
- Deleting a post deletes all its replies
- Deleting a reply deletes all its child replies

## File Structure

```
src/
├── models/
│   └── communityModel.js           - Database queries for posts and replies
├── controllers/
│   └── communityController.js      - Business logic and request handling
├── routes/
│   └── community.js                - API route definitions
└── app.js                          - Route registration

migrations/
├── 20251115191200-add-topic-to-community-posts.js
└── sqls/
    ├── 20251115191200-add-topic-to-community-posts-up.sql
    └── 20251115191200-add-topic-to-community-posts-down.sql

api-docs/
└── COMMUNITY_API.md                - Complete API documentation
```

## Usage Examples

### Creating a Post

```bash
curl -X POST http://localhost:3000/api/community/posts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "How to solve quadratic equations?",
    "content": "I need help understanding the quadratic formula...",
    "topic": "algebra"
  }'
```

### Searching Posts

```bash
# Search for posts containing "triangle" in algebra topic
curl -X GET "http://localhost:3000/api/community/posts?search=triangle&topic=geometry" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Getting Trending Posts

```bash
curl -X GET "http://localhost:3000/api/community/trending?limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Creating a Nested Reply

```bash
# Reply to a specific reply (creates nested conversation)
curl -X POST http://localhost:3000/api/community/posts/POST_ID/replies \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Thanks for the explanation!",
    "parentId": "PARENT_REPLY_ID"
  }'
```

## Features in Detail

### 1. Search Functionality
- Case-insensitive search across post titles and content
- Uses PostgreSQL ILIKE for pattern matching
- Can be combined with topic filtering

### 2. Pagination
- Default page size: 20 items
- Maximum page size: 100 items
- Returns total count and calculated total pages
- Supports `page` and `limit` query parameters

### 3. Authorization
- Users can only edit/delete their own content
- Returns `403 Forbidden` for unauthorized actions
- Post/reply ownership verified via user_id matching

### 4. Nested Reply Structure
- Supports infinite nesting depth
- Replies are automatically organized into tree structure
- Child replies are returned nested within parent replies
- Cascade deletion ensures orphaned replies are removed

### 5. Trending Algorithm
- Only considers posts from past 7 days
- Score = `reply_count / time_since_creation`
- Promotes recent posts with active discussions
- Prevents old popular posts from dominating

### 6. Topic Normalization
- Topics are automatically normalized to lowercase
- Invalid topics default to 'general'
- Prevents inconsistent categorization

## Validation Rules

### Post Creation/Update
- ✅ Title is required (max 500 characters)
- ✅ Content is required
- ✅ Topic must be one of the valid topics
- ✅ All fields are trimmed of whitespace

### Reply Creation/Update
- ✅ Content is required
- ✅ Parent post must exist
- ✅ Parent reply (if specified) must exist and belong to the same post
- ✅ Content is trimmed of whitespace

## Error Handling

All endpoints return standardized error responses:

```json
{
  "success": false,
  "error": {
    "statusCode": 400,
    "message": "Error description here"
  }
}
```

Common error codes:
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (trying to edit others' content)
- `404` - Not Found (post/reply doesn't exist)
- `500` - Internal Server Error

## Testing

A comprehensive test script is provided:

```bash
# Make the script executable
chmod +x test-community-api.sh

# Run the tests (requires server to be running)
./test-community-api.sh
```

The test script covers:
- ✅ Creating posts
- ✅ Getting all posts
- ✅ Getting specific post
- ✅ Creating replies
- ✅ Creating nested replies
- ✅ Updating posts and replies
- ✅ Searching posts
- ✅ Filtering by topic
- ✅ Sorting options
- ✅ Trending posts
- ✅ Pagination
- ✅ Deleting posts and replies

## Migration

To apply the database changes:

```bash
npm run db:migrate
```

This will:
1. Add `topic` column to `community_posts` table
2. Add `parent_id` column to `community_replies` table
3. Create indexes for improved query performance

To rollback:

```bash
npm run db:migrate:down
```

## Performance Considerations

### Indexes
All frequently queried columns have indexes:
- User lookups (user_id)
- Post/reply retrieval (post_id)
- Sorting by date (created_at)
- Topic filtering (topic)
- Nested replies (parent_id)

### Query Optimization
- Reply counts are calculated efficiently using GROUP BY
- Trending algorithm uses single query with computed score
- Pagination uses LIMIT/OFFSET for memory efficiency

### Cascade Deletes
- Database-level cascade ensures data integrity
- No orphaned replies when posts or parent replies are deleted
- Reduces application-level cleanup logic

## Security

### Authentication
- All endpoints require valid JWT access token
- User identity extracted from token (req.user.sub)

### Authorization
- Ownership verification for edit/delete operations
- Cannot modify others' posts or replies
- User IDs stored securely in database

### Input Validation
- All user input is validated and sanitized
- Content length limits prevent abuse
- SQL injection prevented via parameterized queries

## Future Enhancements

Possible future improvements:
- 🔮 Upvoting/downvoting posts and replies
- 🔮 Mark replies as "helpful" or "best answer"
- 🔮 User reputation system based on helpful contributions
- 🔮 Email notifications for replies to your posts
- 🔮 Moderator roles for content management
- 🔮 Report/flag inappropriate content
- 🔮 Rich text formatting (markdown support)
- 🔮 File attachments (images, PDFs)
- 🔮 Bookmarking/saving posts
- 🔮 User mention system (@username)

## Integration with Learning Platform

The community board integrates seamlessly with other platform features:
- **Authentication** - Uses existing JWT authentication
- **User Profiles** - Displays user information (username, name)
- **Topics** - Aligns with SAT Math curriculum structure
- **Village System** - Could award resources for helpful contributions
- **Analytics** - Track community engagement metrics

## Summary

The Community Discussion Board provides a complete, production-ready solution for peer-to-peer learning support. It includes all requested features:

✅ Create, read, update, delete posts
✅ Threaded conversations with nested replies
✅ Search and filter by keyword/topic
✅ Multiple sorting options (newest, most-replied, trending)
✅ Pagination support
✅ User authorization and attribution
✅ Comprehensive API documentation
✅ Database migrations
✅ Test scripts

The system is secure, performant, and ready to help students collaborate and learn together!
