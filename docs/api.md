# Hotel Booking API Documentation

## Base URL

```
/api/v1
```

## Authentication

All routes except `/auth/*` and the root endpoint require authentication via Bearer token.

### Auth Routes

| Method | Endpoint                      | Description               | Access |
| ------ | ----------------------------- | ------------------------- | ------ |
| POST   | `/auth/login`                 | User login                | Public |
| POST   | `/auth/register`              | User registration         | Public |
| POST   | `/auth/logout`                | User logout               | Public |
| POST   | `/auth/forgot-password`       | Request password reset    | Public |
| PATCH  | `/auth/reset-password/:token` | Reset password with token | Public |

### User Routes

| Method | Endpoint     | Description     | Access          |
| ------ | ------------ | --------------- | --------------- |
| GET    | `/users`     | Get all users   | Admin           |
| GET    | `/users/:id` | Get user by ID  | Admin, Customer |
| POST   | `/users`     | Create new user | Admin           |
| PUT    | `/users/:id` | Update user     | Admin, Customer |
| DELETE | `/users/:id` | Delete user     | Admin           |

### Service Routes

| Method | Endpoint           | Description       | Access          |
| ------ | ------------------ | ----------------- | --------------- |
| GET    | `/services/search` | Search services   | Protected       |
| GET    | `/services`        | Get all services  | Protected       |
| POST   | `/services`        | Create service    | Provider, Admin |
| GET    | `/services/:id`    | Get service by ID | Protected       |
| PATCH  | `/services/:id`    | Update service    | Provider, Admin |
| DELETE | `/services/:id`    | Delete service    | Admin           |

### Transport Routes

| Method | Endpoint             | Description         | Access          |
| ------ | -------------------- | ------------------- | --------------- |
| GET    | `/transports/search` | Search transports   | Protected       |
| GET    | `/transports`        | Get all transports  | Protected       |
| POST   | `/transports`        | Create transport    | Provider, Admin |
| GET    | `/transports/:id`    | Get transport by ID | Protected       |
| PATCH  | `/transports/:id`    | Update transport    | Provider, Admin |
| DELETE | `/transports/:id`    | Delete transport    | Admin           |

### Booking Routes

| Method | Endpoint                | Description           | Access    |
| ------ | ----------------------- | --------------------- | --------- |
| GET    | `/bookings/my-bookings` | Get user's bookings   | Protected |
| POST   | `/bookings`             | Create booking        | Protected |
| PATCH  | `/bookings/:id/cancel`  | Cancel booking        | Protected |
| GET    | `/bookings`             | Get all bookings      | Admin     |
| PATCH  | `/bookings/:id/status`  | Update booking status | Admin     |
| DELETE | `/bookings/:id`         | Delete booking        | Admin     |

## Request & Response Examples

### Authentication

#### Login Request

```json
POST /api/v1/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Login Response

```json
{
  "success": true,
  "token": "jwt-token-here",
  "data": {
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "role": "customer"
    }
  }
}
```

### Bookings

#### Create Booking Request

```json
POST /api/v1/bookings
{
  "serviceId": "service-id",
  "checkIn": "2024-02-01",
  "checkOut": "2024-02-05",
  "guests": 2
}
```

#### Create Booking Response

```json
{
  "success": true,
  "data": {
    "booking": {
      "id": "booking-id",
      "serviceId": "service-id",
      "userId": "user-id",
      "status": "pending",
      "checkIn": "2024-02-01",
      "checkOut": "2024-02-05",
      "guests": 2
    }
  }
}
```

## Error Responses

### Generic Error Format

```json
{
  "success": false,
  "error": {
    "statusCode": 400,
    "status": "fail",
    "message": "Error message here"
  }
}
```

### Common Status Codes

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Rate Limiting

- Maximum 100 requests per IP per hour
- Rate limit headers included in response:
  - X-RateLimit-Limit
  - X-RateLimit-Remaining
  - X-RateLimit-Reset
