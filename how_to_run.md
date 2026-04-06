# How to Run

## Requirements
- Node.js installed
- npm installed

## Steps

1. Open terminal in the project folder.

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Open in browser:
```text
http://localhost:3000/
```

## Test Login Credentials

### Admin
- username: admin
- password: admin123

### Viewer
- username: viewer
- password: viewer123

## Main API Endpoints

- `GET /`
- `POST /api/auth/login`
- `GET /api/users`
- `GET /api/records`
- `POST /api/records`
- `GET /api/dashboard/summary`

## Notes
- This project uses in-memory storage.
- Data resets when the server restarts.