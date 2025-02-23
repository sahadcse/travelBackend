# Step-by-Step Testing Guide

## 1. Setup Testing Environment

```bash
# Install required packages
npm install --save-dev jest supertest @types/jest

# Add these scripts to package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

## 2. Create Test Configuration

Create a `.env.test` file:

```env
MONGODB_TEST_URI=mongodb://localhost:27017/hotelbook_test
JWT_SECRET=test_secret_key
PORT=3001
NODE_ENV=test
```

## 3. Basic Test Structure

```javascript
// Basic test structure
describe("Feature or Component", () => {
  // Setup before tests
  beforeEach(() => {
    // setup code
  });

  // Cleanup after tests
  afterEach(() => {
    // cleanup code
  });

  // Individual test
  it("should do something specific", () => {
    // 1. Arrange (setup test data)
    // 2. Act (perform the test)
    // 3. Assert (check results)
  });
});
```

## 4. Common Testing Patterns

### Testing API Endpoints

```javascript
const request = require("supertest");
const app = require("../server");

it("should return users", async () => {
  const response = await request(app)
    .get("/api/users")
    .set("Authorization", `Bearer ${token}`);

  expect(response.status).toBe(200);
  expect(response.body.success).toBe(true);
});
```

### Testing Authentication

```javascript
it("should login user", async () => {
  const response = await request(app).post("/api/auth/login").send({
    email: "test@example.com",
    password: "password123",
  });

  expect(response.status).toBe(200);
  expect(response.body.token).toBeDefined();
});
```

## 5. Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (during development)
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 6. Writing Your First Test

1. Create a new test file (e.g., `user.test.js`)
2. Import required modules
3. Write your test

Example:

```javascript
const request = require("supertest");
const app = require("../server");

describe("User API", () => {
  it("should create new user", async () => {
    const userData = {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    };

    const response = await request(app).post("/api/users").send(userData);

    expect(response.status).toBe(201);
    expect(response.body.data.email).toBe(userData.email);
  });
});
```

## 7. Common Test Cases

1. Success scenarios
2. Error scenarios
3. Edge cases
4. Authentication/Authorization
5. Input validation

## 8. Testing Tips

1. Keep tests independent
2. Use meaningful test descriptions
3. Test one thing per test
4. Clean up after tests
5. Use descriptive variable names
6. Group related tests using describe blocks
