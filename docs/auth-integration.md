# Authentication Integration Guide

> Applies to the current Next.js 16 + App Router stack in `lms-math-exam`.

## 1. Overview

The authentication layer is built on:

- **Axios** for HTTP calls (`lib/http.ts`)
- **js-cookie** for storing the `accessToken`
- **Sonner** toaster for UX feedback
- **Custom service + hook layer** for API isolation and UI ergonomics

All requests target the API specified by `NEXT_PUBLIC_API_URL`.

## 2. Required Packages & Environment

| Package     | Purpose                              |
|-------------|--------------------------------------|
| `axios`     | HTTP client                          |
| `js-cookie` | Cookie storage on the client         |
| `sonner`    | Toast notifications                  |

Environment:

```bash
NEXT_PUBLIC_API_URL=https://your-api-domain
```

## 3. File Structure

| File                               | Responsibility |
|------------------------------------|----------------|
| `types/auth.ts`                    | Request/response typings for every auth endpoint |
| `lib/http.ts`                      | Axios instance, token attachment, refresh retry logic |
| `services/auth-service.ts`         | Concrete API calls (register/login/me/refresh/logout) |
| `hooks/use-auth.ts`                | React hook wrapping the service with loading/error/toast handling |
| `components/auth/login-form.tsx`   | Login UI, redirects based on role |
| `components/auth/signup-form.tsx`  | Registration UI, allows role selection |
| `app/students/page.tsx`            | Protected page example for `Student` role |
| `app/admin/page.tsx`               | Protected page example for `Admin` role |
| `components/teachers/dashboard/app-sidebar.tsx` | Fetches `/api/Auth/me` for teacher layout |
| `components/teachers/dashboard/nav-user.tsx`    | Logout button, avatar fallback |

## 4. Axios Configuration (`lib/http.ts`)

Key behaviors:

- Uses `baseURL = process.env.NEXT_PUBLIC_API_URL`
- `withCredentials: true` to send/receive cookies when API requires them
- Request interceptor reads `accessToken` from `js-cookie` and sets `Authorization: Bearer <token>`
- Response interceptor:
  - Detects `401` responses
  - Skips refresh logic for authentication endpoints (`/api/Auth/login`, `/api/Auth/register`, `/api/Auth/refresh-token`) to avoid loops
  - Otherwise, calls `POST /api/Auth/refresh-token`, stores the new token, retries the original request
  - On refresh failure, clears cookies and redirects to `/signin`

Helper exports:

- `setAccessTokenCookie(token, expiry?)`
- `clearAccessTokenCookie()`

## 5. Auth Service (`services/auth-service.ts`)

Functions:

- `register(payload)` → `POST /api/Auth/register`
- `login(payload)` → `POST /api/Auth/login` (stores `accessToken`)
- `getCurrentUser()` → `GET /api/Auth/me`
- `refreshToken()` → `POST /api/Auth/refresh-token` (stores new token)
- `logout()` → clears cookie only

Errors are rethrown (AxiosError) for the hook to handle.

## 6. Hook API (`hooks/use-auth.ts`)

Exposes:

- `register`, `login`, `getCurrentUser`, `refreshToken`, `logout`
- `loading` + `error`
- `clearError`

Behavior:

- `runWithState` helper sets loading flag and centralizes error handling
- On success: `toast.success(...)` with contextual message
- On failure: parse backend response → `toast.error(...)`
- `logout` clears token + success toast

## 7. UI Integration

### Login (`components/auth/login-form.tsx`)

- Prevents default submit
- Calls `useAuth().login`
- Redirects based on response `role`
  - `student → /students`
  - `teacher → /teachers`
  - `admin → /admin`
  - fallback `/students`
- Displays API errors inline + toast

### Signup (`components/auth/signup-form.tsx`)

- Collects username/email/password/role
- Validates password confirmation locally
- Calls `useAuth().register`
- Redirects to `/signin` on success

### Role-Protected Pages

- `app/students/page.tsx` + `app/admin/page.tsx`
  - On mount: call `getCurrentUser`
  - Show JSON of user data
  - Warn if role mismatch
  - Provide “Reload” + “Logout” buttons (logout clears token + `router.push("/signin")`)

### Teacher Sidebar

- `app-sidebar.tsx` loads `/api/Auth/me` via `getCurrentUser`
- Passes real username/email to `NavUser`
- `NavUser`:
  - Shows avatar fallback via email initial
  - `Log out` item triggers `useAuth().logout` + `router.push("/signin")`

## 8. Toast & UX

- All auth actions (success/failure) fire Sonner toasts in English
- Inline error messages remain for forms
- No page reloads on failure—interceptors no longer redirect for login/register

## 9. Testing Tips

1. **Environment**: ensure `NEXT_PUBLIC_API_URL` matches deployed API domain with proper CORS headers (`Access-Control-Allow-Origin: http://localhost:3000`, `Allow-Credentials: true`).
2. **Dev reloads**: Fast Refresh may remount forms when editing code. Use `NEXT_DISABLE_FAST_REFRESH=1 pnpm dev` or run `pnpm build && pnpm start` to test UX without remounts.
3. **Role routing**: log in with teacher/admin/student accounts to confirm redirects + protected pages.
4. **Token expiry**: manually expire tokens to verify automatic refresh.
5. **Logout**: test from student/admin pages and teacher nav menu to ensure cookie is cleared and user is redirected.

## 10. Extending the Integration

- To add more auth endpoints (e.g., password reset), extend `types/auth.ts`, add a service method, and expose it through `useAuth`.
- For server components that need auth, import `authService` directly or create dedicated server utilities (remember cookies are stored client-side; consider Next.js `cookies()` API if migrating to httpOnly tokens).
- When adding new pages that require auth, follow the `students/admin` pattern: call `getCurrentUser` client-side, or implement middleware/route handlers on the server.

