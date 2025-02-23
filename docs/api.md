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
| POST   | `/auth/register`              | User registration         | Public |
| POST   | `/auth/login`                 | User login                | Public |
| POST   | `/auth/logout`                | User logout               | Public |
| POST   | `/auth/forgot-password`       | Request password reset    | Public |
| POST   | `/auth/reset-password/:token` | Reset password with token | Public |

### User Routes

| Method | Endpoint            | Description    | Access                    |
| ------ | ------------------- | -------------- | ------------------------- |
| GET    | `/users/all`        | Get all users  | Admin                     |
| GET    | `/users/single/:id` | Get user by ID | Admin, Customer, Provider |
| POST   | `/users/create`     | Create user    | Admin                     |
| PUT    | `/users/update/:id` | Update user    | Admin, Customer           |
| DELETE | `/users/delete/:id` | Delete user    | Admin                     |

### Service Routes

| Method | Endpoint               | Description       | Access          |
| ------ | ---------------------- | ----------------- | --------------- |
| GET    | `/services/search`     | Search services   | Protected       |
| GET    | `/services/all`        | Get all services  | Protected       |
| POST   | `/services/create`     | Create service    | Provider, Admin |
| GET    | `/services/single/:id` | Get service by ID | Protected       |
| PATCH  | `/services/update/:id` | Update service    | Provider, Admin |
| DELETE | `/services/delete/:id` | Delete service    | Admin           |

### Transport Routes

| Method | Endpoint                 | Description         | Access          |
| ------ | ------------------------ | ------------------- | --------------- |
| GET    | `/transports/search`     | Search transports   | Protected       |
| GET    | `/transports/all`        | Get all transports  | Protected       |
| POST   | `/transports/create`     | Create transport    | Provider, Admin |
| GET    | `/transports/single/:id` | Get transport by ID | Protected       |
| PATCH  | `/transports/update/:id` | Update transport    | Provider, Admin |
| DELETE | `/transports/delete/:id` | Delete transport    | Admin           |

### Booking Routes

| Method | Endpoint                     | Description           | Access    |
| ------ | ---------------------------- | --------------------- | --------- |
| GET    | `/bookings/my-bookings`      | Get user's bookings   | Protected |
| POST   | `/bookings/create`           | Create booking        | Protected |
| PATCH  | `/bookings/cancel/:id`       | Cancel booking        | Protected |
| GET    | `/bookings/all`              | Get all bookings      | Admin     |
| PATCH  | `/bookings/updateStatus/:id` | Update booking status | Admin     |
| DELETE | `/bookings/delete/:id`       | Delete booking        | Admin     |

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

### User Profile Updates

#### Update Password Request

```json
PATCH /api/v1/users/password
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

#### Update Password Response

```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

#### Update Profile Request

```json
PATCH /api/v1/users/profile
{
  "name": "Updated Name",
  "email": "newemail@example.com",
  "phone": "1234567890"
}
```

#### Update Profile Response

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-id",
      "name": "Updated Name",
      "email": "newemail@example.com",
      "phone": "1234567890"
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
