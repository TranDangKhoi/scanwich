# Token Refresh Flow Documentation

## Overview
This document explains the complete token authentication and refresh flow in the application. Both access tokens and refresh tokens are stored in **httpOnly cookies** for security.

## Architecture

### Token Storage Strategy
- **Access Token**: Stored in httpOnly cookie + client-side memory (`clientAccessToken`)
- **Refresh Token**: Stored in httpOnly cookie only (never exposed to client JavaScript)

### Why This Approach?
1. **Security**: httpOnly cookies prevent XSS attacks from stealing tokens
2. **Performance**: Client-side access token allows immediate API calls without cookie parsing
3. **Automatic Refresh**: Middleware and client-side provider work together to refresh tokens seamlessly

---

## Token Flow Components

### 1. Login Flow (`/api/auth/login`)

**File**: `src/app/api/auth/login/route.ts`

```
User submits credentials
    ↓
Next.js API Route calls backend
    ↓
Backend returns { accessToken, refreshToken }
    ↓
API Route sets both tokens in httpOnly cookies
    ↓
Returns response to client
    ↓
Client updates clientAccessToken.value (via http.ts)
```

**Key Points**:
- Both tokens are set in httpOnly cookies with proper expiration
- Client receives tokens in response body for immediate use
- `clientAccessToken.value` is updated for subsequent API calls

---

### 2. Middleware Token Refresh (`src/middleware.ts`)

**When**: User navigates to a protected route but access token is expired/missing

**Flow**:
```
Request comes in
    ↓
Middleware checks cookies
    ↓
If no accessToken BUT refreshToken exists
    ↓
Call backend /auth/refresh-token directly
    ↓
Backend returns { data: { accessToken, refreshToken } }
    ↓
Set new tokens in cookies
    ↓
Continue to requested page
```

**Key Points**:
- Runs on server-side (Next.js middleware)
- Directly calls backend API (not the Next.js API route)
- Updates cookies before page loads
- User doesn't notice the refresh happened

**Fixed Issue**: 
- Previously tried to destructure `{ accessToken, refreshToken }` from `data`
- Now correctly accesses `data.data.accessToken` and `data.data.refreshToken`

---

### 3. Client-Side Token Refresh (`src/providers/token-refresh-provider.tsx`)

**When**: User is actively using the app and access token is about to expire

**Flow**:
```
Every 3 seconds, check access token expiration
    ↓
If token has 1/3 or less of its lifetime remaining
    ↓
Call /api/auth/refresh-token (Next.js API route)
    ↓
API route gets refreshToken from cookies
    ↓
API route calls backend /auth/refresh-token
    ↓
API route sets new tokens in cookies
    ↓
Returns new tokens to client
    ↓
Client updates clientAccessToken.value
```

**Key Points**:
- Runs in browser while user is active
- Prevents token expiration during active sessions
- Uses Next.js API route (not backend directly) to leverage cookie handling
- Prevents multiple simultaneous refresh requests with `refreshingTokenRef`

**Refresh Timing**:
- If access token expires in 10 seconds
- Refresh triggers when 3.33 seconds or less remain
- Formula: `secondsLeft <= totalLifetime / 3`

---

### 4. API Route Token Refresh (`src/app/api/auth/refresh-token/route.ts`)

**Purpose**: Server-side endpoint that handles token refresh with cookie management

**Flow**:
```
POST /api/auth/refresh-token
    ↓
Get refreshToken from cookies
    ↓
Call backend /auth/refresh-token with refreshToken
    ↓
Backend validates and returns new tokens
    ↓
Set new accessToken in httpOnly cookie
    ↓
Set new refreshToken in httpOnly cookie
    ↓
Return tokens in response body
```

**Key Points**:
- Automatically reads refreshToken from httpOnly cookies
- Sets new tokens in httpOnly cookies
- Returns tokens in response for client-side update
- Deletes cookies on error

---

### 5. HTTP Client (`src/lib/http.ts`)

**Purpose**: Centralized HTTP client that manages token injection and updates

**Token Injection**:
```javascript
if (isClient) {
  const accessToken = clientAccessToken.value;
  baseHeaders = {
    ...baseHeaders,
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
  };
}
```

**Token Updates**:
- After login/register: Updates `clientAccessToken.value`
- After refresh: Updates `clientAccessToken.value`
- After logout: Clears `clientAccessToken.value`

**Error Handling**:
- 401 on refresh endpoint → Logout user
- 500 on refresh endpoint → Logout user
- Emits `UNAUTHORIZED_EVENT` for global logout handling

---

## Complete Request Flow Example

### Scenario: User makes API call with almost-expired token

```
1. User clicks button → API call initiated
   ↓
2. http.ts adds Authorization header with clientAccessToken.value
   ↓
3. Request sent to backend
   ↓
4. Meanwhile, TokenRefreshProvider detects token expiring soon
   ↓
5. Provider calls /api/auth/refresh-token
   ↓
6. API route gets refreshToken from cookie
   ↓
7. API route calls backend /auth/refresh-token
   ↓
8. Backend returns new tokens
   ↓
9. API route sets new tokens in cookies
   ↓
10. API route returns new tokens
   ↓
11. Provider updates clientAccessToken.value
   ↓
12. Next API call uses new token automatically
```

---

## Error Handling

### Refresh Token Expired/Invalid

**Middleware**:
```
Backend returns 401
    ↓
Clear both cookies
    ↓
Redirect to /login
```

**Client Provider**:
```
Refresh fails
    ↓
Clear interval
    ↓
Redirect to /login
```

**HTTP Client**:
```
401 on /api/auth/refresh-token
    ↓
Call /api/auth/logout
    ↓
Clear clientAccessToken
    ↓
Emit UNAUTHORIZED_EVENT
    ↓
AuthProvider redirects to /login
```

---

## Key Files Summary

| File | Purpose | Token Operations |
|------|---------|------------------|
| `src/middleware.ts` | Server-side route protection | Reads cookies, refreshes if needed |
| `src/providers/token-refresh-provider.tsx` | Client-side auto-refresh | Monitors expiration, triggers refresh |
| `src/app/api/auth/refresh-token/route.ts` | Refresh endpoint | Reads/writes cookies, calls backend |
| `src/app/api/auth/login/route.ts` | Login endpoint | Sets initial cookies |
| `src/app/api/auth/logout/route.ts` | Logout endpoint | Clears cookies |
| `src/lib/http.ts` | HTTP client | Injects tokens, updates on response |
| `src/providers/auth-provider.tsx` | Auth context | Initializes clientAccessToken |

---

## Security Considerations

1. **httpOnly Cookies**: Prevents JavaScript access to tokens
2. **Secure Flag**: Ensures cookies only sent over HTTPS
3. **SameSite**: Prevents CSRF attacks
4. **Automatic Expiration**: Cookies expire with token lifetime
5. **Server-Side Validation**: All token operations validated by backend

---

## Testing the Flow

### Test Login
1. Login with valid credentials
2. Check browser cookies for `accessToken` and `refreshToken`
3. Verify `clientAccessToken.value` is set

### Test Auto-Refresh
1. Login and wait for token to approach expiration
2. Watch console for refresh logs
3. Verify cookies are updated
4. Verify no interruption to user experience

### Test Middleware Refresh
1. Login and close browser
2. Wait for access token to expire (but not refresh token)
3. Open browser and navigate to protected route
4. Verify automatic refresh and successful page load

### Test Token Expiration
1. Login and wait for refresh token to expire
2. Verify automatic logout
3. Verify redirect to login page

---

## Common Issues & Solutions

### Issue: "Cannot set accessToken on server side"
**Cause**: Trying to set `clientAccessToken.value` on server
**Solution**: Only set in client-side code (check `typeof window !== "undefined"`)

### Issue: Infinite refresh loop
**Cause**: Refresh endpoint returning wrong data structure
**Solution**: Ensure backend returns `{ data: { accessToken, refreshToken } }`

### Issue: Cookies not being set
**Cause**: Missing cookie configuration
**Solution**: Verify `httpOnly`, `sameSite`, `secure`, `path` are set correctly

### Issue: 401 errors after refresh
**Cause**: `clientAccessToken.value` not updated after refresh
**Solution**: Ensure http.ts updates token on refresh response

