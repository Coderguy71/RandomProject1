# SAT Math Learning Platform

A comprehensive full-stack web application for SAT Math practice and learning with gamification elements.

## 🚀 Features

### Backend (Node.js + Express)
- ✅ User authentication with JWT tokens
- ✅ Practice problems with instant feedback
- ✅ Village gamification system
- ✅ Learning path recommendations
- ✅ Analytics and progress tracking
- ✅ RESTful API with PostgreSQL

### Frontend (React + Vite)
- 🎨 Modern UI with black/purple theme
- 📱 Fully responsive design
- 🔐 Authentication flows
- 📊 Interactive dashboards
- 🏘️ Village visualization
- 📚 Tutorial system
- 👥 Community features

## 🛠 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **db-migrate** - Database migrations

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **Context API** - State management

## 📋 Prerequisites

- Node.js 16+
- PostgreSQL 12+
- npm or yarn

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Clone repository
git clone <repository-url>
cd sat-math-learning-platform

# Install backend dependencies
npm install

# Install frontend dependencies
npm run frontend:install
```

### 2. Database Setup

```bash
# Copy environment file
cp .env.example .env

# Edit .env with your database credentials
# Run database migrations
npm run db:migrate
```

### 3. Start Development

```bash
# Start both backend and frontend
npm run dev:full

# Or start separately:
# Backend (port 3000)
npm run dev

# Frontend (port 5173)
npm run frontend:dev
```

### 4. Access Applications

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api
- **API Documentation**: Check `/api-docs` directory

## 📁 Project Structure

```
├── src/                    # Backend source code
│   ├── controllers/         # Request handlers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Express middleware
│   ├── utils/            # Utility functions
│   └── config/           # Configuration
├── frontend/              # Frontend source code
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React Context
│   │   ├── services/      # API services
│   │   ├── hooks/         # Custom hooks
│   │   └── utils/        # Utility functions
│   └── public/           # Static assets
├── migrations/            # Database migrations
├── api-docs/            # API documentation
└── examples/             # Usage examples
```

## 🔧 Available Scripts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server
- `npm run db:migrate` - Run database migrations
- `npm run db:migrate:down` - Rollback migrations
- `npm run db:migrate:create` - Create new migration

### Frontend
- `npm run frontend:dev` - Start frontend dev server
- `npm run frontend:build` - Build for production
- `npm run frontend:install` - Install frontend dependencies

### Full Stack
- `npm run dev:full` - Start both backend and frontend

## 🎨 Design System

The application uses a custom black and purple color scheme:

- **Primary Purple**: #7C3AED
- **Dark Purple**: #6D28D9
- **Dark Background**: #0F172A / #111827
- **Accent Light Purple**: #C4B5FD
- **Text**: #F3F4F6 / #FFFFFF

## 📚 API Documentation

Comprehensive API documentation is available in the `/api-docs` directory:

- `API.md` - General API overview
- `PRACTICE_API.md` - Practice problems API
- `VILLAGE_API.md` - Village gamification API
- `LEARNING_PATH_API.md` - Learning path API
- `TESTING_GUIDE.md` - Testing scenarios

## 🧪 Testing

```bash
# Test API endpoints (examples provided)
node examples/test-api.js

# Test learning path functionality
node test-learning-path.js

# Run demo learning path
node demo-learning-path.js
```

## 🚀 Deployment

### Backend
1. Set production environment variables
2. Run database migrations
3. Start server: `npm start`

### Frontend
1. Build: `npm run frontend:build`
2. Deploy `frontend/dist` to static hosting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🔗 Related Documentation

- [Database Schema](DATABASE_SCHEMA.md)
- [Feature Implementation](FEATURE_IMPLEMENTATION.md)
- [Setup Instructions](SETUP.md)
- [Quick Reference](QUICK_REFERENCE.md)
- [Implementation Summary](IMPLEMENTATION_SUMMARY.md)

## 🆘 Support

For issues and questions:
1. Check the documentation in `/api-docs`
2. Review the testing guides
3. Check existing issues
4. Create a new issue with detailed information