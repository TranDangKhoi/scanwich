# Token Refresh Flow - Quick Reference

## 🎯 Quick Overview

**Storage Strategy:**
- ✅ Access Token: httpOnly cookie + `clientAccessToken.value` (memory)
- ✅ Refresh Token: httpOnly cookie only

**Refresh Mechanisms:**
1. **Middleware** (server-side): When navigating to pages
2. **TokenRefreshProvider** (client-side): During active sessions

---

## 📁 Key Files & Their Roles

| File | Role | When It Runs |
|------|------|--------------|
| `middleware.ts` | Server-side refresh on navigation | Before page loads |
| `token-refresh-provider.tsx` | Client-side auto-refresh | Every 3 seconds while active |
| `/api/auth/refresh-token/route.ts` | Refresh endpoint | Called by provider |
| `http.ts` | HTTP client with token injection | Every API call |
| `auth-provider.tsx` | Initialize tokens & handle logout | App startup |

---

## 🔄 When Does Refresh Happen?

### Middleware Refresh
```
Trigger: User navigates to protected route
Condition: No accessToken BUT refreshToken exists
Action: Direct backend call → Update cookies → Continue
```

### Client Provider Refresh
```
Trigger: Every 3 seconds check
Condition: Token has ≤1/3 lifetime remaining
Action: API route call → Update cookies → Update memory
```

---

## 🛠️ Code Snippets

### Get Access Token (Client-Side)
```typescript
import { clientAccessToken } from "src/lib/http";

// Read token
const token = clientAccessToken.value;

// Set token (only in browser!)
if (typeof window !== "undefined") {
  clientAccessToken.value = "new-token";
}
```

### Make Authenticated API Call
```typescript
import http from "src/lib/http";

// Token is automatically added to Authorization header
const response = await http.get("/accounts/me");
```

### Check Token in Middleware
```typescript
import { cookies } from "next/headers";

const cookieStore = cookies();
const accessToken = cookieStore.get("accessToken")?.value;
const refreshToken = cookieStore.get("refreshToken")?.value;
```

### Manual Logout
```typescript
import { authApi } from "src/api-requests/auth.apis";

await authApi.logoutServerSide();
// Cookies are automatically cleared
```

---

## 🐛 Common Issues & Quick Fixes

### Issue: "Cannot set accessToken on server side"
```typescript
// ❌ WRONG (server-side)
clientAccessToken.value = token;

// ✅ CORRECT (client-side only)
if (typeof window !== "undefined") {
  clientAccessToken.value = token;
}
```

### Issue: Middleware not refreshing
```typescript
// ❌ WRONG
const { accessToken, refreshToken } = data;

// ✅ CORRECT
const accessToken = data?.data?.accessToken;
const refreshToken = data?.data?.refreshToken;
```

### Issue: Cookies not updating after refresh
```typescript
// Make sure API route sets cookies:
cookieStore.set("accessToken", accessToken, {
  httpOnly: true,
  sameSite: "lax",
  secure: true,
  expires: calculateCookieExpires(exp),
  path: "/",
});
```

### Issue: Infinite refresh loop
```typescript
// Prevent multiple simultaneous refreshes:
if (refreshingTokenRef.current) return;
refreshingTokenRef.current = true;

try {
  // ... refresh logic
} finally {
  refreshingTokenRef.current = false;
}
```

---

## 🧪 Quick Testing Commands

### Check Cookies in Browser Console
```javascript
// View all cookies
document.cookie

// Note: You won't see httpOnly cookies here (that's good!)
// Use DevTools → Application → Cookies instead
```

### Check Client Access Token
```javascript
// In browser console
window.clientAccessToken?.value
```

### Simulate Token Expiration
```typescript
// In token-refresh-provider.tsx, change:
const isAccessTokenAlmostExpired = 
  secondsLeftBeforeAccessTokenExpire <= totalAccessTokenLifetime / 3;

// To (for testing):
const isAccessTokenAlmostExpired = true; // Always refresh
```

---

## 📊 Response Structures

### Backend Login Response
```json
{
  "message": "Đăng nhập thành công",
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "account": {
      "id": 1,
      "name": "User",
      "email": "user@example.com",
      "role": "Owner"
    }
  }
}
```

### Backend Refresh Response
```json
{
  "message": "Lấy token mới thành công",
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

### API Route Refresh Response
```json
{
  "message": "Lấy token mới thành công",
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

---

## 🔐 Security Checklist

- ✅ httpOnly cookies (prevents XSS)
- ✅ Secure flag (HTTPS only)
- ✅ SameSite: lax (prevents CSRF)
- ✅ Automatic expiration
- ✅ Server-side validation
- ✅ Tokens cleared on logout
- ✅ Tokens cleared on refresh failure

---

## 🚀 Performance Tips

### Optimize Refresh Interval
```typescript
// Current: Check every 3 seconds
refreshTokenIntervalRef.current = setInterval(validateAndRefreshToken, 3000);

// For less frequent checks (saves CPU):
refreshTokenIntervalRef.current = setInterval(validateAndRefreshToken, 5000);
```

### Adjust Refresh Timing
```typescript
// Current: Refresh when 1/3 lifetime remains
const isAccessTokenAlmostExpired = 
  secondsLeftBeforeAccessTokenExpire <= totalAccessTokenLifetime / 3;

// For earlier refresh (more buffer):
const isAccessTokenAlmostExpired = 
  secondsLeftBeforeAccessTokenExpire <= totalAccessTokenLifetime / 2;
```

---

## 📝 Environment Variables

Make sure these are set in your `.env` files:

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Backend (.env)
```bash
ACCESS_TOKEN_SECRET=your-secret-key
REFRESH_TOKEN_SECRET=your-refresh-secret-key
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
```

---

## 🎨 Flow Diagrams

See the interactive Mermaid diagrams:
1. **Token Refresh Flow Architecture** - Overall flow
2. **Cookie & Token Storage Flow** - Sequence diagram

---

## 📞 Debugging Tips

### Enable Detailed Logging

**In middleware.ts:**
```typescript
console.log("Middleware: Access token:", accessToken ? "exists" : "missing");
console.log("Middleware: Refresh token:", refreshToken ? "exists" : "missing");
console.log("Middleware: Refresh response:", data);
```

**In token-refresh-provider.tsx:**
```typescript
console.log("Token check - Seconds left:", secondsLeftBeforeAccessTokenExpire);
console.log("Token check - Total lifetime:", totalAccessTokenLifetime);
console.log("Token check - Should refresh:", isAccessTokenAlmostExpired);
```

**In http.ts:**
```typescript
console.log("HTTP: Making request to:", fullUrl);
console.log("HTTP: Access token:", accessToken ? "present" : "missing");
console.log("HTTP: Response status:", res.status);
```

### Check Token Expiration
```typescript
import { jwtDecode } from "jwt-decode";

const token = "your-token-here";
const decoded = jwtDecode(token);
console.log("Issued at:", new Date(decoded.iat * 1000));
console.log("Expires at:", new Date(decoded.exp * 1000));
console.log("Time remaining:", decoded.exp - Date.now() / 1000, "seconds");
```

---

## 🎯 Best Practices

1. **Never** store refresh tokens in localStorage
2. **Always** use httpOnly cookies for tokens
3. **Always** check `typeof window !== "undefined"` before setting `clientAccessToken.value`
4. **Always** clear tokens on logout
5. **Always** handle refresh failures gracefully
6. **Never** expose tokens in console logs in production
7. **Always** use HTTPS in production

---

## 📚 Related Documentation

- `TOKEN_FLOW_DOCUMENTATION.md` - Comprehensive flow documentation
- `CHANGES_SUMMARY.md` - Summary of changes made
- Backend API docs - Check `server/Readme.md`

---

## ✅ Quick Verification

After implementing changes, verify:

```bash
# 1. Login works
✓ Cookies are set
✓ clientAccessToken.value is set
✓ Can access protected routes

# 2. Middleware refresh works
✓ Navigate to protected route without access token
✓ Automatic refresh happens
✓ Page loads successfully

# 3. Client refresh works
✓ Stay on page until token almost expires
✓ Automatic refresh happens
✓ No interruption to user

# 4. Logout works
✓ Cookies are cleared
✓ clientAccessToken.value is cleared
✓ Redirected to login

# 5. Token expiration works
✓ Wait for refresh token to expire
✓ Automatic logout happens
✓ Redirected to login with message
```

---

## 🆘 Need Help?

1. Check browser console for errors
2. Check browser DevTools → Application → Cookies
3. Check Network tab for API calls
4. Verify backend is running and accessible
5. Check token expiration times are reasonable
6. Review the flow diagrams
7. Read the comprehensive documentation

---

**Last Updated:** 2025-09-30
**Version:** 1.0.0

