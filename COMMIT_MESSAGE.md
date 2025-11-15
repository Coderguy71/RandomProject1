feat: implement practice problems system with instant feedback

Implements complete practice problems system with answer submission,
instant feedback, attempt tracking, and performance analytics.

## Features Added

### API Endpoints
- GET /api/problems - List problems with filtering and pagination
- GET /api/problems/:id - Get single problem
- POST /api/attempts/problems/:id/submit - Submit answer with instant feedback
- GET /api/attempts/history - Get attempt history
- GET /api/attempts/analytics - Get overall analytics
- GET /api/attempts/analytics/subtopics/:id - Get subtopic analytics

### Core Functionality
- Practice problem retrieval by subtopic and difficulty
- Instant feedback on answer submission with explanations
- Automatic progress tracking and accuracy calculation
- Time tracking per problem attempt
- Comprehensive analytics (accuracy rates, time spent, problems completed)
- Attempt history with full details

### Data & Content
- Added 33 new practice problems via migration
- Total: 42 problems across 6 subtopics (6-7 per subtopic)
- Problems cover Algebra and Geometry topics
- Mixed difficulty levels (easy, medium, hard)
- All problems include detailed explanations

### Models
- problemModel.js - Problem database queries with filtering
- attemptModel.js - Attempt tracking and analytics
- progressModel.js - User progress management

### Controllers
- problemController.js - Problem retrieval logic
- attemptController.js - Submission, feedback, history, analytics

### Routes
- problems.js - Problem endpoints
- attempts.js - Attempt and analytics endpoints

### Documentation
- api-docs/PRACTICE_API.md - Complete API reference
- api-docs/TESTING_GUIDE.md - Testing guide with examples
- PRACTICE_SYSTEM_README.md - Implementation overview
- FEATURE_IMPLEMENTATION.md - Detailed feature summary

### Migration
- 20251114234011-add-more-practice-problems - Adds 33 problems

## Technical Details
- JWT authentication required on all endpoints
- Answers hidden from problem listings (anti-cheat)
- Efficient database queries with proper indexing
- Pagination support (configurable limits)
- Automatic progress updates on submission
- Comprehensive error handling

All ticket requirements met:
✅ Get practice problems by subtopic with pagination
✅ Submit practice problem answers
✅ Instant feedback on correctness
✅ Store user attempts with metadata (time taken, score, timestamp)
✅ Calculate accuracy rates for subtopics
✅ Difficulty-based problem selection
✅ Problem history retrieval for users
✅ Performance analytics data collection
✅ 6 subtopic groups with 5-10 problems each
