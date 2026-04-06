# Testing Guide

This file explains how to test the Finance Data Processing and Access Control Backend step by step in a very beginner-friendly way.

## Before Testing

Make sure the project is already running.

Open terminal in the project folder and run:

```bash
npm install
npm start
```

If the project starts correctly, it should run on:

```text
http://localhost:3000/
```

## Best Way to Test

The easiest way to test this project is by using **Postman**. Postman lets you send API requests using buttons instead of writing code.[cite:42][cite:43]

If Postman is not installed, install it first.

## Test 1: Check if server is running

1. Open Postman.
2. Create a new request.
3. Set method to **GET**.
4. In the URL box, enter:

```text
http://localhost:3000/
```

5. Click **Send**.

Expected result:
- You should see a success response.
- This confirms the backend server is running.

## Test 2: Login as admin

1. Open a new request.
2. Change method from **GET** to **POST**.
3. In the URL box, enter:

```text
http://localhost:3000/api/auth/login
```

4. Click the **Body** tab.
5. Select **raw**.
6. In the dropdown on the right side, choose **JSON**.
7. Paste this:

```json
{
  "username": "admin",
  "password": "admin123"
}
```

8. Click **Send**.

Expected result:
- You should get a JSON response.
- The response should contain a **token**.
- Copy that token because it will be used in later tests.

## Test 3: Use token for protected routes

Protected routes need a Bearer token in Postman.

1. Open a new request.
2. Enter a protected URL such as:

```text
http://localhost:3000/api/users
```

3. Click the **Authorization** tab.
4. In **Type**, choose **Bearer Token**.
5. Paste the admin token into the token box.
6. Click **Send**.

Expected result:
- You should get the users list.
- This confirms admin authentication is working.

## Test 4: Get records

1. Open a new request.
2. Set method to **GET**.
3. Enter:

```text
http://localhost:3000/api/records
```

4. In **Authorization**, choose **Bearer Token**.
5. Paste the admin token.
6. Click **Send**.

Expected result:
- You should receive records in JSON format.

## Test 5: Get dashboard summary

1. Open a new request.
2. Set method to **GET**.
3. Enter:

```text
http://localhost:3000/api/dashboard/summary
```

4. Add the admin token in the **Authorization** tab.
5. Click **Send**.

Expected result:
- You should get summary values like total income, total expenses, and net balance.

## Test 6: Create a new record

1. Open a new request.
2. Set method to **POST**.
3. Enter:

```text
http://localhost:3000/api/records
```

4. Go to **Authorization** and choose **Bearer Token**.
5. Paste the admin token.
6. Go to **Body**.
7. Select **raw**.
8. Choose **JSON**.
9. Paste this:

```json
{
  "amount": 2500,
  "type": "expense",
  "category": "Food",
  "date": "2026-04-06",
  "notes": "Dinner"
}
```

10. Click **Send**.

Expected result:
- You should get a created record as response.
- A new record ID should appear.

## Test 7: Check route without token

This checks whether unauthorized users are blocked properly.

1. Open a new request.
2. Set method to **GET**.
3. Enter:

```text
http://localhost:3000/api/users
```

4. Do **not** add any token.
5. Click **Send**.

Expected result:
- You should get **401 Unauthorized**.

## Test 8: Login as viewer

1. Open a new request.
2. Set method to **POST**.
3. Enter:

```text
http://localhost:3000/api/auth/login
```

4. Go to **Body** > **raw** > **JSON**.
5. Paste this:

```json
{
  "username": "viewer",
  "password": "viewer123"
}
```

6. Click **Send**.
7. Copy the viewer token.

Expected result:
- You should receive a token for the viewer account.

## Test 9: Check viewer permissions

### Viewer can access dashboard

1. Open a new request.
2. Set method to **GET**.
3. Enter:

```text
http://localhost:3000/api/dashboard/summary
```

4. In **Authorization**, choose **Bearer Token**.
5. Paste the viewer token.
6. Click **Send**.

Expected result:
- This should work.

### Viewer cannot access users list

1. Open a new request.
2. Set method to **GET**.
3. Enter:

```text
http://localhost:3000/api/users
```

4. Add the viewer token in **Authorization**.
5. Click **Send**.

Expected result:
- You should get **403 Forbidden** because the viewer role does not have admin permission.

## Test 10: Check validation

1. Open a new request.
2. Set method to **POST**.
3. Enter:

```text
http://localhost:3000/api/records
```

4. Add admin token in **Authorization**.
5. Go to **Body** > **raw** > **JSON**.
6. Paste this invalid data:

```json
{
  "amount": -100,
  "type": "expense",
  "category": "Bad Data",
  "date": "2026-04-06"
}
```

7. Click **Send**.

Expected result:
- You should get **400 Bad Request** because the amount is invalid.

## Meaning of status codes

- **200** = Request successful.
- **201** = Resource created successfully.
- **400** = Invalid request data.
- **401** = No token or invalid token.
- **403** = Logged in, but not allowed to access that route.
  
## What to include in submission proof

Take screenshots of these:

- Root route success
- Admin login success with token
- Users list as admin
- Dashboard summary success
- Unauthorized request returning 401
- Viewer access returning 403
- Invalid record request returning 400

These screenshots make the project submission stronger.

## Quick Summary

To fully test the backend, verify:

- Server starts correctly
- Login works
- Bearer token works
- Admin routes work
- Viewer restrictions work
- Validation errors are returned correctly
- Dashboard endpoints work

