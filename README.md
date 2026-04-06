# Finance Dashboard Backend

A Node.js Express API for managing financial records with role-based access control (RBAC).

## Features

- **User Management**: Create, list, update, and delete users with assigned roles
- **Financial Records**: Full CRUD operations for income/expense records
- **Dashboard Analytics**: Summary statistics, category breakdowns, and trend analysis
- **Role-Based Access Control**: Three roles (admin, analyst, viewer) with different permissions
- **Input Validation**: Comprehensive validation for all API endpoints
- **Error Handling**: Centralized error handling middleware

## User Roles

| Role | Permissions |
|------|-------------|
| **Admin** | Full access - manage users, records, and view all data |
| **Analyst** | Create/update records, view all data, no user management |
| **Viewer** | Read-only access to records and dashboard |

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with username/password
- `POST /api/auth/register` - Register a new user

### Users (Admin only for mutations)
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Records
- `GET /api/records` - List records (filter by type, category, date range)
- `GET /api/records/:id` - Get record by ID
- `POST /api/records` - Create record (analyst/admin only)
- `PUT /api/records/:id` - Update record (analyst/admin only)
- `DELETE /api/records/:id` - Delete record (admin only)

### Dashboard
- `GET /api/dashboard/summary` - Total income, expenses, and net balance
- `GET /api/dashboard/categories` - Spending breakdown by category
- `GET /api/dashboard/trends` - Income vs expense trends over time
- `GET /api/dashboard/latest` - Most recent records

## Installation

```bash
npm install
npm start
```

## Usage

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Get Dashboard Summary (with token)
```bash
curl -X GET http://localhost:3000/api/dashboard/summary \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Assumptions

1. **In-Memory Storage**: All data (users, records) is stored in memory for simplicity. Data resets on server restart.
2. **Mock Authentication**: JWT tokens are generated with a hardcoded secret. In production, use environment variables and secure storage.
3. **Pre-seeded Users**: Three default users are created on startup (admin, analyst, viewer).
4. **No Database**: This demo does not connect to a database. For production, integrate MongoDB or PostgreSQL.

## Project Structure

```
finance-dashboard-backend/
├── src/
│   ├── index.js           # Express app entry point
│   ├── middleware/
│   │   ├── auth.js        # JWT authentication middleware
│   │   ├── errorHandler.js # Centralized error handling
│   │   └── roleGuard.js   # Role-based access control
│   └── routes/
│       ├── users.js       # User management routes
│       ├── records.js     # Financial records routes
│       └── dashboard.js   # Dashboard summary routes
├── package.json
├── .gitignore
└── README.md
```

## License

MIT
