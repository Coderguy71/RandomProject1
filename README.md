# SAT Math Learning Platform - Backend API

A modern REST API for the SAT Math Learning Platform built with Node.js, Express, and PostgreSQL.

## Features

- ✅ Express.js web server
- ✅ PostgreSQL database with connection pooling
- ✅ JWT authentication middleware (ready for auth system)
- ✅ CORS support
- ✅ Request logging with Morgan
- ✅ Comprehensive error handling
- ✅ Database migrations system
- ✅ Environment configuration management
- ✅ Health check endpoints
- ✅ API documentation

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd sat-math-platform
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
NODE_ENV=development
PORT=3000
HOST=localhost

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sat_math_platform
DB_USER=postgres
DB_PASSWORD=postgres
DB_POOL_MIN=2
DB_POOL_MAX=10

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRY=24h
```

4. Create PostgreSQL database
```bash
createdb sat_math_platform
```

5. Run database migrations
```bash
npm run db:migrate
```

6. Start the development server
```bash
npm run dev
```

The server will start on `http://localhost:3000`

## Project Structure

```
.
├── src/
│   ├── config/              # Configuration files
│   │   ├── database.js      # Database connection pool
│   │   └── environment.js   # Environment configuration
│   ├── controllers/         # Request handlers
│   │   └── healthController.js
│   ├── middleware/          # Express middleware
│   │   ├── auth.js          # JWT authentication
│   │   ├── cors.js          # CORS configuration
│   │   ├── errorHandler.js  # Global error handler
│   │   └── logger.js        # Request logging
│   ├── routes/              # API routes
│   │   └── health.js        # Health check routes
│   ├── utils/               # Utility functions
│   │   ├── database.js      # Database query utilities
│   │   └── response.js      # Response formatting
│   ├── models/              # Database models (placeholder)
│   ├── app.js               # Express app configuration
│   └── index.js             # Entry point
├── migrations/              # Database migrations
│   └── sqls/                # SQL migration files
├── api-docs/                # API documentation
├── database.json            # Database migration config
├── .env                     # Environment variables
├── .env.example             # Environment template
├── .gitignore               # Git ignore rules
└── package.json             # Dependencies
```

## Available Scripts

### Development
```bash
npm run dev          # Start development server with file watching
```

### Production
```bash
npm start            # Start production server
```

### Database
```bash
npm run db:migrate        # Run pending migrations
npm run db:migrate:down   # Rollback last migration
npm run db:migrate:create -- <migration-name>  # Create new migration
```

## API Endpoints

### Health Check
- `GET /health` - Server health status
- `GET /ready` - Readiness probe
- `GET /api/info` - API information

See [API Documentation](./api-docs/API.md) for detailed endpoint specifications.

## Configuration

### Environment Variables
All configuration is managed through environment variables. See `.env.example` for all available options.

### Database Connection
- Pooled connections (min: 2, max: 10)
- Automatic connection timeout: 2 seconds
- Idle timeout: 30 seconds
- Comprehensive error logging

### JWT Authentication
- Token-based authentication
- Configurable expiration time
- Secure token generation and verification

## Development Guidelines

### Adding New Routes
1. Create controller in `src/controllers/`
2. Create route in `src/routes/`
3. Import and mount in `src/app.js`

### Adding New Middleware
Place middleware files in `src/middleware/` and import in `src/app.js`

### Creating Database Migrations
```bash
npm run db:migrate:create -- table_name

# Edit the migration file in migrations/sqls/
# Then run:
npm run db:migrate
```

### Error Handling
Use the `AppError` class for consistent error responses:
```javascript
const { AppError } = require('../middleware/errorHandler');
throw new AppError('Error message', 400);
```

### Async Request Handling
Wrap async controllers with the `asyncHandler`:
```javascript
const { asyncHandler } = require('../middleware/errorHandler');

router.get('/:id', asyncHandler(async (req, res) => {
  // Your async code
}));
```

## Deployment

### Production Checklist
- [ ] Update `.env` with production values
- [ ] Set `NODE_ENV=production`
- [ ] Update `JWT_SECRET` with a strong secret
- [ ] Configure database credentials
- [ ] Run database migrations: `npm run db:migrate`
- [ ] Start server: `npm start`

## Security

- CORS is configured to prevent unauthorized cross-origin requests
- JWT tokens are used for authentication
- Connection pooling prevents SQL injection vulnerabilities
- Environment variables protect sensitive data
- Error messages are sanitized in production

## Monitoring

The API provides health check endpoints for monitoring:
- `GET /health` - Detailed health information
- `GET /ready` - Simple readiness check

## License

ISC

## Support

For issues and questions, please create an issue in the repository.
