
# Authentication System API Documentation

Base URL: `http://localhost:3000`

## 1. Register User

- Method: POST
- Endpoint: `/register`
- Content-Type: `application/json`

Request body:
```json
{
  "username": "demo_user",
  "email": "demo@example.com",
  "password": "Demo@12345"
}
```

Success response: `201 Created`

```json
{
  "message": "User registered successfully",
  "userId": 1
}
```

## 2. Login User

- Method: POST
- Endpoint: `/login`
- Content-Type: `application/json`

Request body:
```json
{
  "email": "demo@example.com",
  "password": "Demo@12345"
}
```

Success response: `200 OK`

Returns a JWT token. Keep it private.

## 3. Get Protected Profile

- Method: GET
- Endpoint: `/profile`
- Authorization: `Bearer <JWT_TOKEN>`

Success response: `200 OK`

Returns an access message, user ID, and email.

## 4. Logout User

- Method: POST
- Endpoint: `/logout`
- Authorization: `Bearer <JWT_TOKEN>`

Success response: `200 OK`

```json
{
  "message": "Logout successful"
}
```

The token hash is saved in the revoked_tokens table. The revoked token should no longer access protected routes.

## Common Error Responses

- `400 Bad Request` — Required fields are missing or password is too short.
- `401 Unauthorized` — Invalid credentials, missing/invalid token, or revoked token.
- `409 Conflict` — Username or email already exists.
- `500 Internal Server Error` — Server or database error.
