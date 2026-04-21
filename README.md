# Personal Finance Application

A complete full-stack personal finance application with JWT authentication, transaction management, and financial summaries.

## Features

### Authentication
- User registration with email/password
- User login with JWT token generation
- Protected API routes
- Token storage in localStorage
- Logout functionality

### Finance Features
- Add transactions (income/expense) with description, amount, type, category, and date
- View all transactions in a list, sorted by date (newest first)
- Delete transactions
- Calculate and display:
  - Total income
  - Total expenses
  - Net balance (income - expenses)

### UI/UX
- Clean, modern design with gradient background
- Responsive design (mobile-friendly)
- Balance cards showing summary statistics
- Transaction form for adding new transactions
- Transaction list with delete buttons
- Separate views for login, registration, and dashboard

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript (strict mode)
- **Authentication**: JWT (jsonwebtoken) + bcrypt
- **Database**: In-memory storage (can upgrade to PostgreSQL)
- **CORS**: Enabled for frontend communication

### Frontend
- **Language**: HTML, CSS, Vanilla TypeScript (strict mode)
- **Build Tool**: Vite
- **State Management**: Custom Store pattern
- **No frameworks**: Pure TypeScript and DOM API

### Type Safety
- Full TypeScript strict mode enabled
- No `any` types anywhere
- Proper interfaces for all data structures
- Type guards for runtime validation
- Discriminated unions for API responses
- Proper DOM element typing

## Project Structure

```
Personal Finance/
├── backend/
│   ├── src/
│   │   ├── index.ts           # Express server setup
│   │   ├── types.ts           # TypeScript interfaces
│   │   ├── database.ts        # In-memory database
│   │   ├── authService.ts     # Authentication logic
│   │   ├── transactionService.ts  # Transaction logic
│   │   ├── middleware.ts      # Auth middleware
│   │   └── routes.ts          # API routes
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── app.ts            # Main application entry
│   │   ├── types.ts          # TypeScript interfaces
│   │   ├── api.ts            # API client
│   │   ├── store.ts          # State management
│   │   ├── dom.ts            # DOM utilities
│   │   ├── styles.css        # Global styles
│   │   └── pages/
│   │       ├── login.ts      # Login page setup
│   │       ├── register.ts   # Registration page setup
│   │       └── dashboard.ts  # Dashboard page setup
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── .env
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js 16+ and npm

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your settings:
```
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

5. Start the development server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. In a new terminal, navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000` (or `http://localhost:5173` depending on Vite)

## API Endpoints

### Authentication

#### Register
- **POST** `/api/auth/register`
- Body: `{ email: string, password: string }`
- Response: `{ token: string, user: User }`

#### Login
- **POST** `/api/auth/login`
- Body: `{ email: string, password: string }`
- Response: `{ token: string, user: User }`

### Transactions (Protected)

#### Create Transaction
- **POST** `/api/transactions`
- Headers: `Authorization: Bearer <token>`
- Body: `{ description, amount, type, category, date }`
- Response: `Transaction`

#### Get All Transactions
- **GET** `/api/transactions`
- Headers: `Authorization: Bearer <token>`
- Response: `Transaction[]`

#### Delete Transaction
- **DELETE** `/api/transactions/:id`
- Headers: `Authorization: Bearer <token>`
- Response: `{ message: string }`

#### Get Financial Summary
- **GET** `/api/summary`
- Headers: `Authorization: Bearer <token>`
- Response: `{ totalIncome, totalExpenses, netBalance }`

## Building for Production

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
```

The built files will be in the `frontend/dist` directory.

## Deployment

### Frontend - Vercel
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will auto-detect Vite and build automatically
4. Set environment variables in Vercel dashboard

### Backend - Render or Railway
1. Connect your repository to Render/Railway
2. Set the build command: `npm run build`
3. Set the start command: `npm start`
4. Set environment variables in the dashboard

## TypeScript Configuration

Both backend and frontend use strict TypeScript settings:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

## Type Safety Features

- **No `any` types**: All data structures have proper TypeScript interfaces
- **Type guards**: Runtime validation using type guards for API responses
- **Discriminated unions**: API responses use discriminated unions for success/error states
- **DOM typing**: Safe DOM element selection with type checking
- **Request validation**: Type guards for all incoming request bodies
- **Error handling**: Proper error types and messages throughout

## Future Enhancements

- [ ] PostgreSQL integration for persistent storage
- [ ] Budget management and alerts
- [ ] Transaction categories with icons
- [ ] Monthly/yearly expense reports
- [ ] Data export (CSV, PDF)
- [ ] Multi-currency support
- [ ] Dark mode
- [ ] Mobile app (React Native)
- [ ] Two-factor authentication
- [ ] Transaction tags and filters

## License

This project is open source and available under the MIT License.
