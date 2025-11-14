# SAT Math Learning Platform - API Documentation

## Overview
This is the REST API for the SAT Math Learning Platform. The API provides endpoints for user authentication, question management, and learning progress tracking.

## Base URL
```
http://localhost:3000/api/v1
```

## Health Check Endpoints

### Server Health
```
GET /health
```

**Response:**
```json
{
  "success": true,
  "message": "Server is healthy",
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "uptime": 1234.567,
    "environment": "development",
    "database": "connected"
  }
}
```

### Readiness Check
```
GET /ready
```

**Response:**
```json
{
  "ready": true,
  "database": true
}
```

### API Info
```
GET /api/info
```

**Response:**
```json
{
  "name": "SAT Math Learning Platform API",
  "version": "v1",
  "environment": "development"
}
```

## Error Handling

All error responses follow this format:
```json
{
  "success": false,
  "error": {
    "statusCode": 400,
    "message": "Error message here"
  }
}
```

### Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Authentication

Authentication is implemented using JWT (JSON Web Tokens). 

### Authorization Header
```
Authorization: Bearer <your-jwt-token>
```

## Planned Endpoints

### Auth Endpoints
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh JWT token
- `POST /api/v1/auth/logout` - User logout

### User Endpoints
- `GET /api/v1/users/:id` - Get user profile
- `PUT /api/v1/users/:id` - Update user profile
- `DELETE /api/v1/users/:id` - Delete user account

### Questions Endpoints
- `GET /api/v1/questions` - List all questions with filtering
- `GET /api/v1/questions/:id` - Get question details
- `POST /api/v1/questions` - Create new question (admin)
- `PUT /api/v1/questions/:id` - Update question (admin)
- `DELETE /api/v1/questions/:id` - Delete question (admin)

### Progress Endpoints
- `GET /api/v1/progress/:userId` - Get user progress
- `POST /api/v1/progress/:userId/answer` - Submit question answer
- `GET /api/v1/progress/:userId/stats` - Get user statistics

## Configuration

Environment variables required:
- `NODE_ENV` - Application environment (development, production, test)
- `PORT` - Server port (default: 3000)
- `DB_HOST` - Database host
- `DB_PORT` - Database port
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRY` - JWT token expiration time

## Middleware

### CORS
Cross-Origin Resource Sharing is enabled for development. Configure allowed origins in `src/middleware/cors.js`.

### Morgan
Request logging is configured using Morgan. Format depends on environment:
- Development: `dev` format
- Production: `combined` format

### Error Handler
Global error handling middleware catches all errors and returns properly formatted JSON responses.

## Database

### Connection Pooling
Database connections are pooled using `pg` library:
- Min connections: 2 (configurable)
- Max connections: 10 (configurable)
- Idle timeout: 30 seconds

### Migrations
Database migrations are managed using `db-migrate`:

```bash
# Run migrations
npm run db:migrate

# Rollback migrations
npm run db:migrate:down

# Create new migration
npm run db:migrate:create -- migration-name
```

## Development

### Start Development Server
```bash
npm run dev
```

### Start Production Server
```bash
npm start
```

## Notes
- All timestamps are in ISO 8601 format with UTC timezone
- UUIDs are used for primary keys
- Request/response body limit is set to 10MB
