# Authentication UI - Login and Signup

## Overview

This document describes the authentication UI implementation for the SAT Math Learning Platform. The frontend provides a complete login and signup flow with secure token management, session persistence, and professional design.

## Features

### Login Page (`frontend/src/pages/auth/Login.jsx`)

- **Email Input**: Required email field with HTML5 validation
- **Password Input**: Password field with show/hide toggle button
- **Form Validation**: 
  - Email format validation
  - Required field checking
- **Error Handling**: Display error messages from backend or validation
- **Loading State**: Visual feedback during submission with spinner
- **Redirect**: On successful login, redirects to dashboard
- **Links**: Direct link to signup page for new users
- **Design**: Centered card layout with black and purple theme

### Signup Page (`frontend/src/pages/auth/Signup.jsx`)

- **Username Input**: 
  - Required field
  - 3+ characters minimum
  - Alphanumeric + dots, underscores, hyphens only
  - Real-time validation feedback
- **Email Input**: 
  - Required field
  - Valid email format required
  - Real-time validation feedback
- **Password Input**: 
  - Required field
  - 8+ characters minimum
  - Real-time strength indicator
  - Show/hide toggle button
  - **Strength Levels**:
    - Weak: < 8 chars or only length
    - Fair: 8-11 chars with minimal variety
    - Good: 12+ chars or mixed case + length
    - Strong: 12+ chars + digits
    - Very Strong: 12+ chars + digits + special chars
- **Confirm Password Input**:
  - Required field
  - Must match password field
  - Show/hide toggle button
  - Real-time matching feedback
- **Form Validation**:
  - All fields required
  - Real-time validation feedback
  - Submit button disabled until all fields valid
- **Error Handling**: Display error messages from backend
- **Loading State**: Visual feedback during submission with spinner
- **Redirect**: On successful signup, redirects to dashboard
- **Links**: Direct link to login page for existing users
- **Design**: Centered card layout with black and purple theme

## Architecture

### Component Hierarchy

```
App (with AuthProvider)
├── Router
│   ├── PublicRoute
│   │   ├── Login
│   │   └── Signup
│   └── ProtectedRoute
│       └── Layout (with Navbar + Sidebar)
│           └── Protected Pages (Dashboard, Practice, Village, etc.)
```

### State Management

#### AuthContext (`frontend/src/context/AuthContext.jsx`)

Global authentication state and actions:

```javascript
{
  user: {
    id, email, username, firstName, lastName, role, isActive, createdAt, updatedAt
  },
  isAuthenticated: boolean,
  isLoading: boolean,
  error: string | null,
  login: (email, password) => Promise,
  register: (userData) => Promise,
  logout: () => Promise,
  clearError: () => void
}
```

#### Session Persistence

- Access token and refresh token stored in `localStorage`
- User profile loaded on app startup if tokens exist
- Automatic token refresh on 401 responses
- Tokens cleared on logout

### API Integration

#### Endpoints

All endpoints use `http://localhost:3000/api` as base URL.

```
POST /auth/signup
Body: { email, username, password }
Response: { user, tokens }

POST /auth/login
Body: { email, password }
Response: { user, tokens }

POST /auth/logout
Body: { refreshToken }
Response: { success }

POST /auth/refresh
Body: { refreshToken }
Response: { user, tokens }

GET /auth/me
Headers: Authorization: Bearer {accessToken}
Response: { user }
```

#### Token Management

- **Request Interceptor**: Adds `Authorization: Bearer {accessToken}` header to all requests
- **Response Interceptor**: 
  - Handles 401 errors by refreshing token
  - Retries original request with new token
  - Redirects to login if refresh fails

### Form Validation

#### Signup Validation

| Field | Requirements | Validation |
|-------|--------------|-----------|
| Username | 3+ chars, alphanumeric + dots/underscores/hyphens | Real-time, error message |
| Email | Valid email format | Real-time, error message |
| Password | 8+ chars | Real-time strength indicator |
| Confirm Password | Matches password field | Real-time matching feedback |

All fields must be valid for submit button to be enabled.

## Design

### Color Scheme

- **Primary**: Purple (#7C3AED)
- **Accent**: Magenta/Purple
- **Background**: Dark slate (#0F172A)
- **Text**: Light (#F3F4F6) on dark backgrounds
- **Error**: Red (#EF4444)
- **Success**: Green (implied)

### Layout

Both login and signup pages feature:

- Centered card container (max-width: 28rem)
- Responsive padding and spacing
- Mobile-first design
- SVG icons for show/hide toggles
- Professional spacing and typography

### Responsive Design

- Mobile: Full width with padding
- Tablet: Centered with max-width
- Desktop: Centered with max-width
- Touch-friendly button sizes (min 2.5rem)

## Usage

### Starting the Application

1. **Backend**:
```bash
cd /home/engine/project
npm install
npm run db:migrate
npm start
# Server runs on http://localhost:3000
```

2. **Frontend**:
```bash
cd /home/engine/project/frontend
npm install
npm run dev
# App runs on http://localhost:5173 (or similar)
```

### Testing the Auth Flow

#### Signup

1. Navigate to `/signup`
2. Enter username (3+ chars, alphanumeric + dots/underscores/hyphens)
3. Enter email (valid format)
4. Enter password (8+ chars, watch strength indicator)
5. Confirm password (must match)
6. Click "Create Account"
7. On success, redirects to `/dashboard`

#### Login

1. Navigate to `/login`
2. Enter email
3. Enter password
4. Click "Sign In"
5. On success, redirects to `/dashboard`

#### Logout

1. Click logout button in navbar (exit icon)
2. Tokens cleared from localStorage
3. Redirected to `/login`

#### Session Persistence

1. Login successfully
2. Refresh browser (F5)
3. User should remain logged in with same data

## Password Strength Indicator

The password strength is calculated on a 5-point scale:

| Criteria | Points |
|----------|--------|
| Length ≥ 8 | +1 |
| Length ≥ 12 | +1 |
| Has uppercase AND lowercase | +1 |
| Has digits | +1 |
| Has special characters | +1 |

**Total: 0-5 points**

Visual feedback:
- **Empty**: Gray bar, no label
- **1 or fewer**: Red bar, "Weak"
- **2**: Orange bar, "Fair"
- **3**: Yellow bar, "Good"
- **4**: Blue bar, "Strong"
- **5**: Green bar, "Very Strong"

## Error Handling

### Frontend Validation Errors

Displayed in real-time below form fields:

- Username: "Username must be 3+ characters (letters, numbers, dots, underscores, hyphens only)"
- Email: "Please enter a valid email address"
- Password Match: "Passwords do not match"

### Backend Validation Errors

Displayed in error alert box:

- "A valid email address is required"
- "Username must be at least 3 characters long"
- "Username may only contain letters, numbers, dots, underscores, or hyphens"
- "Password must be at least 8 characters long"
- "An account with this email already exists"
- "An account with this username already exists"
- "Invalid email or password"

### Network Errors

- Timeout errors displayed as error messages
- Failed token refresh redirects to login

## Security Features

1. **Password Masking**: Show/hide toggle for password fields
2. **Token Security**: 
   - Tokens stored in localStorage (considered appropriate for browser storage)
   - Automatic token refresh before expiry
   - Token removal on logout
3. **Rate Limiting**: Backend enforces rate limiting on auth endpoints
4. **HTTPS Ready**: Can be deployed with HTTPS in production
5. **CORS**: Configured to allow frontend-backend communication

## Development

### Key Files

- `frontend/src/pages/auth/Login.jsx` - Login page component
- `frontend/src/pages/auth/Signup.jsx` - Signup page component
- `frontend/src/context/AuthContext.jsx` - Authentication state management
- `frontend/src/services/api.js` - Axios client with interceptors
- `frontend/src/services/apiServices.js` - API service methods
- `frontend/src/App.jsx` - App routing and protected routes

### Adding Features

To add a feature to the auth flow:

1. Add validation logic to the respective page component
2. Update error messages to be user-friendly
3. Update AuthContext if new state is needed
4. Test with backend endpoints
5. Update this README if behavior changes

### Testing

Manual testing checklist:

- [ ] Signup with valid data
- [ ] Signup with invalid data (each field)
- [ ] Signup with existing email/username
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Logout and verify tokens removed
- [ ] Session persistence on refresh
- [ ] Protected route redirects to login when not authenticated
- [ ] Public routes redirect to dashboard when authenticated
- [ ] Password show/hide toggle works
- [ ] Password strength indicator updates correctly
- [ ] Form validates before submission
- [ ] Loading state shows during submission
- [ ] Error messages display correctly
- [ ] Mobile responsive layout

## Environment Variables

Frontend (`.env` or `.env.local`):

```
VITE_API_URL=http://localhost:3000/api
VITE_NODE_ENV=development
```

Backend (`.env`):

```
NODE_ENV=development
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=sat_math
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
BCRYPT_SALT_ROUNDS=10
AUTH_RATE_LIMIT_WINDOW_MS=900000
AUTH_RATE_LIMIT_MAX=5
```

## Troubleshooting

### Issue: "Invalid email or password" on login

- Verify email and password are correct
- Check backend is running and accessible
- Check network tab in browser dev tools for actual error

### Issue: Tokens not persisting after page refresh

- Check localStorage is enabled in browser
- Verify browser isn't in private/incognito mode
- Check browser console for errors

### Issue: Password strength indicator not updating

- Verify Tailwind CSS is loading correctly
- Check browser console for JavaScript errors
- Try hard refresh (Ctrl+Shift+R)

### Issue: Can't signup or login

- Verify backend is running on http://localhost:3000
- Check CORS is enabled on backend
- Verify database is running and migrations applied
- Check backend logs for errors

## Future Enhancements

- [ ] Email verification
- [ ] Password reset flow
- [ ] Social login (Google, GitHub, etc.)
- [ ] Two-factor authentication
- [ ] OAuth 2.0 support
- [ ] Remember me functionality
- [ ] Phone number authentication
- [ ] Passwordless login (magic links)

## Related Documentation

- Backend API: `api-docs/API.md`
- Testing Guide: `api-docs/TESTING_GUIDE.md`
- Database Schema: `DATABASE_SCHEMA.md`
- Setup Guide: `SETUP.md`
