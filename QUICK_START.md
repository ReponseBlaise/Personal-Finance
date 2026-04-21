# Quick Start Guide

## Installation & Running the Project

### Backend Setup (Terminal 1)

```bash
cd backend

# Install dependencies
npm install

# Start development server
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup (Terminal 2)

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

## Testing the Application

1. **Register a new account**
   - Go to `http://localhost:3000`
   - Click "Sign Up"
   - Enter email and password (min 8 characters)
   - Confirm password and submit

2. **Login**
   - Enter your credentials
   - You'll be redirected to the dashboard

3. **Add a transaction**
   - Fill in: Description, Amount, Type (Income/Expense), Category, Date
   - Click "Add Transaction"
   - See it appear in the transaction list
   - Balance summary will update automatically

4. **Delete a transaction**
   - Click the "✕" button on any transaction
   - Transaction will be removed and summary will update

## Available Scripts

### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run compiled JavaScript
- `npm run type-check` - Check TypeScript types without compiling

### Frontend
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Check TypeScript types

## Key Features Implemented

### Authentication
✅ User registration with email/password validation
✅ Secure login with JWT tokens
✅ Password hashing with bcrypt (10 rounds)
✅ Token stored in localStorage
✅ Automatic logout capability

### Transactions
✅ Add income/expense transactions
✅ Track description, amount, category, date
✅ Delete transactions
✅ Transactions sorted by date (newest first)
✅ Real-time balance calculation

### UI/UX
✅ Modern gradient design
✅ Responsive mobile-friendly layout
✅ Balance cards with color coding (green for positive, red for negative)
✅ Clean transaction list with categories
✅ Form validation with helpful error messages

### Type Safety
✅ Strict TypeScript mode enabled (backend & frontend)
✅ No `any` types anywhere
✅ Proper interfaces for all data structures
✅ Type guards for API responses and form inputs
✅ Discriminated unions for API result states
✅ Safe DOM element selection and manipulation
✅ Request body validation

## Architecture Highlights

### Backend
- Express.js with TypeScript
- In-memory database with Map-based storage
- JWT authentication with 7-day expiration
- Type-safe API endpoints with full validation
- CORS enabled for frontend communication

### Frontend
- Vanilla TypeScript with no frameworks
- Custom Store pattern for state management
- Type-safe DOM utilities
- Responsive CSS Grid layout
- Browser localStorage for token persistence

## Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Next Steps (Optional Enhancements)

1. **Database Integration**
   - Replace in-memory storage with PostgreSQL
   - Add database migrations
   - Implement connection pooling

2. **Advanced Features**
   - Monthly budget tracking
   - Transaction categories with icons
   - Expense reports and analytics
   - Recurring transactions
   - Tags and filters

3. **Security**
   - Add rate limiting
   - Implement refresh tokens
   - Add CSRF protection
   - Input sanitization

4. **Deployment**
   - Set up GitHub Actions for CI/CD
   - Deploy frontend to Vercel
   - Deploy backend to Render/Railway
   - Set up automated tests

Enjoy managing your finances! 💰
