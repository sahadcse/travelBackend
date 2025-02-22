# Testing Documentation

## Prerequisites

- Node.js and npm installed
- MongoDB running locally
- All project dependencies installed

## Initial Setup

1. Install test dependencies:

```bash
npm install --save-dev jest supertest
```

2. Verify .env.test configuration:

```bash
# Required environment variables
MONGODB_TEST_URI=mongodb://localhost:27017/hotelbook_test
JWT_SECRET=your_test_secret
PORT=3001
NODE_ENV=test
```

## Running Tests

### Basic Test Commands

```bash
# Run all tests
npm test

# Run specific test file
npm run test:users

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Structure

```plaintext
tests/
├── setup.js              # Test setup configuration
├── routes/               # Route tests
│   └── user.route.test.js
└── README.md            # This documentation
```

## Test Categories

### User Routes (`test:users`)

Tests user management endpoints:

- Authentication
- User CRUD operations
- Permission checks
- Error handling

```bash
npm run test:users
```

### Coverage Report

Generate detailed test coverage:

```bash
npm run test:coverage
```

View coverage report in:

- Console output
- ./coverage/lcov-report/index.html (open in browser)

## Troubleshooting

Common Issues:

1. MongoDB Connection:

```bash
# Verify MongoDB is running
mongod

# Check connection string in .env.test
MONGODB_TEST_URI=mongodb://localhost:27017/hotelbook_test
```

2. Test Timeouts:

```json
// In package.json
{
  "jest": {
    "testTimeout": 10000
  }
}
```

3. Authorization Errors:

- Verify JWT_SECRET in .env.test
- Check token generation in tests
- Ensure proper role assignments

## Adding New Tests

1. Create test file in appropriate directory
2. Import required modules
3. Use describe/it pattern
4. Add to package.json scripts if needed

Example:

```javascript
describe("Feature", () => {
  it("should behave as expected", async () => {
    // Setup
    // Action
    // Assert
  });
});
```

## Best Practices

1. Clean up after tests
2. Use meaningful test descriptions
3. Test both success and error cases
4. Keep tests independent
5. Use before/after hooks appropriately
