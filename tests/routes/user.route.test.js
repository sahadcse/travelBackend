const request = require("supertest");
const { app, startServer, stopServer } = require("../helpers/testServer");
const User = require("../../src/models/userModel");
const { generateToken } = require("../../src/utils/jwt");

describe("User Routes", () => {
  let adminToken, customerToken, testUserId;

  beforeAll(async () => {
    await startServer();
  });

  afterAll(async () => {
    await stopServer();
  });

  beforeEach(async () => {
    // Create fresh test users before each test
    const admin = await User.create({
      firstName: "Admin",
      lastName: "User",
      email: "admin@test.com",
      password: "test1234",
      role: "admin",
      phoneNumber: "1234567890",
    });

    const customer = await User.create({
      firstName: "Test",
      lastName: "Customer",
      email: "customer@test.com",
      password: "test1234",
      role: "customer",
      phoneNumber: "0987654321",
    });

    // Pass the entire user object to generateToken
    adminToken = generateToken(admin);
    customerToken = generateToken(customer);
    testUserId = customer._id;
  });

  describe("GET /api/v1/users", () => {
    it("should return 401 if no token provided", async () => {
      const response = await request(app).get("/api/v1/users").expect(401);

      expect(response.body.success).toBe(false);
    });

    it("should return users if admin", async () => {
      const response = await request(app)
        .get("/api/v1/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBeTruthy();
    });
  });

  describe("POST /api/v1/users", () => {
    it("should create new user with valid data", async () => {
      const userData = {
        firstName: "New",
        lastName: "User",
        email: "newuser@test.com",
        password: "test1234",
        role: "customer",
        phoneNumber: "1231231234",
      };

      const response = await request(app)
        .post("/api/v1/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe(userData.email);
    });

    it("should validate required fields", async () => {
      const response = await request(app)
        .post("/api/v1/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });

  describe("PUT /api/v1/users/:id", () => {
    it("should update user profile", async () => {
      const updateData = {
        firstName: "Updated",
        lastName: "Name",
        phoneNumber: "9876543210",
      };

      const response = await request(app)
        .put(`/api/v1/users/${testUserId}`)
        .set("Authorization", `Bearer ${customerToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.firstName).toBe(updateData.firstName);
    });
  });

  describe("DELETE /api/v1/users/:id", () => {
    it("should delete user if admin", async () => {
      const response = await request(app)
        .delete(`/api/v1/users/${testUserId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify user is deleted
      const deletedUser = await User.findById(testUserId);
      expect(deletedUser).toBeNull();
    });
  });

  describe("Error Handling", () => {
    it("should handle invalid MongoDB IDs", async () => {
      const response = await request(app)
        .get("/api/v1/users/invalid-id")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });

    it("should handle duplicate email", async () => {
      const userData = {
        firstName: "Duplicate",
        lastName: "User",
        email: "admin@test.com", // Already exists
        password: "test1234",
        role: "customer",
      };

      const response = await request(app)
        .post("/api/v1/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });
});
