# Configuration Guide

## Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Port the server runs on
PORT=5000

# JWT secret key for signing tokens
# Change this to a secure random string in production
JWT_SECRET=your-secret-key-change-in-production

# Environment mode
NODE_ENV=development
```

### Production Settings

For production deployment, update these values:

```env
PORT=5000
JWT_SECRET=<generate-a-long-random-string>
NODE_ENV=production
```

Generate a strong JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Frontend Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api
```

### Production Settings

For production (e.g., on Vercel):

```env
VITE_API_URL=https://your-api-domain.com/api
```

## Database Configuration (Future)

When upgrading to PostgreSQL, add these to backend `.env`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/finance_db
```

## Security Recommendations

1. **JWT Secret**
   - Never commit the actual secret to git
   - Use a .env file (already in .gitignore)
   - Rotate secrets periodically

2. **CORS**
   - Update the allowed origins in production
   - Currently allows: http://localhost:3000 and http://localhost:5173

3. **Password Requirements**
   - Minimum 8 characters (currently enforced)
   - Consider adding more complexity requirements

4. **Rate Limiting**
   - Add express-rate-limit middleware
   - Protect login endpoint (max 5 attempts per IP)

5. **HTTPS**
   - Enable HTTPS in production
   - Add secure cookie flags

## Deployment Configuration

### Render.com Backend

Set these environment variables in the Render dashboard:

```
PORT: 5000
JWT_SECRET: <your-secure-secret>
NODE_ENV: production
```

### Railway Backend

Set these environment variables in the Railway dashboard:

```
PORT: 5000
JWT_SECRET: <your-secure-secret>
NODE_ENV: production
```

### Vercel Frontend

Set these environment variables in the Vercel dashboard:

```
VITE_API_URL: https://your-railway-backend.herokuapp.com/api
```

## Local Development

### Quick Setup

1. Backend:
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

2. Frontend (new terminal):
```bash
cd frontend
npm install
npm run dev
```

### Debugging

Enable more detailed logging:

Backend - Add to `.env`:
```env
DEBUG=*
```

Frontend - Check browser DevTools:
- Network tab for API calls
- Console for TypeScript errors
- Application tab for localStorage tokens

## Testing Credentials

After starting the app, use these credentials:
- Email: test@example.com
- Password: password123

Or create your own account through the Sign Up form.

## Troubleshooting

### Backend won't start
- Check port 5000 isn't in use: `lsof -i :5000`
- Delete `node_modules` and reinstall: `npm install`
- Ensure Node.js 16+ is installed

### Frontend won't load
- Clear browser cache
- Check that backend is running on port 5000
- Check .env VITE_API_URL is correct

### Token errors
- Clear localStorage: Open DevTools → Application → Storage → Clear All
- Login again
- Check JWT_SECRET is set correctly

### CORS errors
- Verify backend CORS configuration
- Check frontend is on allowed origin
- Restart backend server

## Health Check

To verify the backend is running:

```bash
curl http://localhost:5000/health
```

Should return:
```json
{"status": "OK"}
```

## Type Checking

Verify TypeScript compilation:

```bash
# Backend
cd backend && npm run type-check

# Frontend
cd frontend && npm run type-check
```

No errors should appear in strict mode.
