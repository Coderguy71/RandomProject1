# Testing Authentication Integration

## Prerequisites
1. PostgreSQL database running
2. Backend server running on port 3000
3. Frontend dev server running on port 5173 (or configured port)
4. Environment variables configured (`.env` files)

## Test Scenarios

### Test 1: Signup Flow (Happy Path)
**Objective:** Verify that a new user can sign up successfully with username, email, and password.

**Steps:**
1. Navigate to `http://localhost:5173/signup`
2. Fill in the form:
   - Username: `testuser123` (3+ chars, alphanumeric + dots/underscores/hyphens)
   - Email: `test@example.com` (valid email format)
   - Password: `SecurePass123!` (8+ chars)
   - Confirm Password: `SecurePass123!` (must match)
3. Observe password strength indicator (should show "Strong" or "Very Strong")
4. Click "Create Account"

**Expected Results:**
- ✅ Form validates all fields before submission
- ✅ Loading spinner appears during submission
- ✅ Request sent to `POST /api/auth/signup` with `{ username, email, password }`
- ✅ Backend creates user with hashed password
- ✅ Backend returns success with user and tokens
- ✅ Frontend stores `accessToken` and `refreshToken` in localStorage
- ✅ User is redirected to `/dashboard`
- ✅ User is now authenticated and can access protected routes

**Verification in Browser Console:**
```javascript
// Check localStorage
localStorage.getItem('accessToken')  // Should return a JWT token
localStorage.getItem('refreshToken') // Should return a JWT token
```

---

### Test 2: Signup Validation (Error Handling)
**Objective:** Verify that form validation catches invalid inputs.

**Test 2a: Invalid Username**
1. Navigate to `/signup`
2. Enter username: `ab` (too short)
3. **Expected:** Error message "Username must be 3+ characters..."

**Test 2b: Invalid Email**
1. Enter email: `notanemail`
2. **Expected:** Error message "Please enter a valid email address"

**Test 2c: Weak Password**
1. Enter password: `123` (too short)
2. **Expected:** Password strength shows "Weak", submit button disabled

**Test 2d: Password Mismatch**
1. Enter password: `SecurePass123!`
2. Enter confirm password: `DifferentPass123!`
3. **Expected:** Error message "Passwords do not match", submit button disabled

**Test 2e: Duplicate Username/Email**
1. Try to sign up with existing username or email
2. **Expected:** Backend returns 409 error: "An account with this username/email already exists"

---

### Test 3: Login Flow (Happy Path)
**Objective:** Verify that an existing user can log in successfully.

**Steps:**
1. Navigate to `http://localhost:5173/login`
2. Enter email: `test@example.com`
3. Enter password: `SecurePass123!`
4. Click "Sign In"

**Expected Results:**
- ✅ Request sent to `POST /api/auth/login` with `{ email, password }`
- ✅ Backend validates credentials
- ✅ Backend returns success with user and tokens
- ✅ Frontend stores tokens in localStorage
- ✅ User is redirected to `/dashboard`
- ✅ User is authenticated

---

### Test 4: Protected Routes
**Objective:** Verify that authentication is required for protected routes.

**Test 4a: Access Dashboard Without Auth**
1. Clear localStorage: `localStorage.clear()`
2. Navigate to `/dashboard`
3. **Expected:** Redirected to `/login`

**Test 4b: Access Dashboard With Auth**
1. Log in successfully
2. Navigate to `/dashboard`
3. **Expected:** Dashboard loads successfully

---

### Test 5: Token Refresh
**Objective:** Verify that expired access tokens are automatically refreshed.

**Note:** This test requires waiting 15 minutes or manually manipulating token expiration.

**Steps:**
1. Log in successfully
2. Wait for access token to expire (15 minutes)
3. Make an authenticated request (e.g., navigate to `/analytics`)

**Expected Results:**
- ✅ Initial request fails with 401
- ✅ Axios interceptor catches 401 error
- ✅ Request sent to `POST /api/auth/refresh` with `{ refreshToken }`
- ✅ Backend validates refresh token
- ✅ Backend returns new access and refresh tokens
- ✅ Frontend stores new tokens
- ✅ Original request is retried with new token
- ✅ Page loads successfully without logout

---

### Test 6: Logout Flow
**Objective:** Verify that users can log out successfully.

**Steps:**
1. Log in successfully
2. Click "Logout" (in navbar/profile menu)

**Expected Results:**
- ✅ Request sent to `POST /api/auth/logout` with `{ refreshToken }`
- ✅ Backend revokes refresh token
- ✅ Frontend clears tokens from localStorage
- ✅ User is redirected to `/login`
- ✅ User cannot access protected routes

---

### Test 7: Session Persistence
**Objective:** Verify that users remain logged in after page refresh.

**Steps:**
1. Log in successfully
2. Refresh the page (F5 or Ctrl+R)

**Expected Results:**
- ✅ AuthContext loads accessToken from localStorage
- ✅ Request sent to `GET /api/auth/me` with Bearer token
- ✅ Backend validates token and returns user profile
- ✅ Frontend sets user in auth state
- ✅ User remains on dashboard (no redirect to login)

---

### Test 8: Invalid Token Handling
**Objective:** Verify that invalid tokens are handled gracefully.

**Steps:**
1. Log in successfully
2. In browser console, set invalid token:
   ```javascript
   localStorage.setItem('accessToken', 'invalid_token_123')
   ```
3. Refresh the page

**Expected Results:**
- ✅ AuthContext tries to load user with invalid token
- ✅ Request to `/api/auth/me` fails with 401
- ✅ Frontend clears tokens from localStorage
- ✅ User is redirected to `/login`

---

## Backend Validation Checks

### Username Validation
- ✅ Required (400 if missing)
- ✅ Minimum 3 characters (400 if too short)
- ✅ Alphanumeric + dots, underscores, hyphens only (400 if invalid)
- ✅ Unique (409 if duplicate)

### Email Validation
- ✅ Required (400 if missing)
- ✅ Valid email format (400 if invalid)
- ✅ Normalized to lowercase
- ✅ Unique (409 if duplicate)

### Password Validation
- ✅ Required (400 if missing)
- ✅ Minimum 8 characters (400 if too short)
- ✅ Hashed with bcrypt before storage
- ✅ Never returned in API responses

### Token Security
- ✅ Access token expires in 15 minutes
- ✅ Refresh token expires in 7 days
- ✅ Refresh tokens stored in database with hash
- ✅ Tokens revoked on logout
- ✅ Expired tokens cannot be refreshed

---

## Manual Testing Checklist

### Signup Form UI
- [ ] Username field visible and functional
- [ ] Email field visible and functional
- [ ] Password field with show/hide toggle
- [ ] Confirm password field with show/hide toggle
- [ ] Password strength indicator works
- [ ] Real-time validation errors display
- [ ] Submit button disabled when form invalid
- [ ] Loading state during submission
- [ ] Error messages display from backend
- [ ] Link to login page works

### Login Form UI
- [ ] Email field visible and functional
- [ ] Password field with show/hide toggle
- [ ] Remember me checkbox (if implemented)
- [ ] Submit button disabled when fields empty
- [ ] Loading state during submission
- [ ] Error messages display from backend
- [ ] Link to signup page works

### Authentication State
- [ ] User redirected to dashboard after signup
- [ ] User redirected to dashboard after login
- [ ] Protected routes require authentication
- [ ] Public routes redirect to dashboard if authenticated
- [ ] Logout clears state and redirects to login
- [ ] Session persists across page refreshes
- [ ] Invalid tokens handled gracefully

---

## Debugging Tips

### Check Network Requests
Open browser DevTools → Network tab:
1. Filter by `/api/auth/`
2. Check request payload includes `username`, `email`, `password`
3. Check response status (201 for signup, 200 for login)
4. Check response body has `data.user` and `data.tokens`

### Check LocalStorage
Open browser DevTools → Application tab → Local Storage:
1. Verify `accessToken` is stored
2. Verify `refreshToken` is stored
3. Verify tokens are valid JWT format (3 parts separated by dots)

### Check Backend Logs
In backend terminal:
1. Check for incoming requests
2. Check for validation errors
3. Check for database errors
4. Check for token generation

### Check Frontend Console
In browser DevTools → Console tab:
1. Check for API errors
2. Check for React errors
3. Check AuthContext state
4. Check token values in localStorage

---

## Common Issues and Solutions

### Issue: "Username is required" error
**Cause:** Frontend not sending username in request payload
**Solution:** Verify Signup.jsx sends `username: formData.username` in register call

### Issue: Tokens are undefined after login
**Cause:** Incorrect token extraction from response
**Solution:** Use `response.data.tokens.accessToken` instead of `response.data.accessToken`

### Issue: User redirected to login after refresh
**Cause:** Token not persisted or invalid
**Solution:** Check localStorage has valid tokens, verify `/api/auth/me` endpoint works

### Issue: Token refresh fails
**Cause:** Refresh token expired or revoked
**Solution:** Log in again to get new tokens

### Issue: Password not hashed
**Cause:** Backend not using bcrypt before storing
**Solution:** Verify `authController.register` uses `bcrypt.hash()`

---

## Success Criteria

All tests pass when:
1. ✅ New users can sign up with username, email, and password
2. ✅ Existing users can log in with email and password
3. ✅ Tokens are properly stored in localStorage
4. ✅ Protected routes require authentication
5. ✅ Session persists across page refreshes
6. ✅ Token refresh works automatically
7. ✅ Logout revokes tokens and redirects to login
8. ✅ Form validation catches invalid inputs
9. ✅ Error messages display properly
10. ✅ Backend validates and hashes passwords correctly
