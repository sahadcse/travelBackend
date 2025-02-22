const request = require("supertest");
const app = require("../../server"); // Correct path to app
const User = require("../../src/models/userModel"); // Correct model path
const { generateToken } = require("../../src/utils/jwt");

describe("User Routes", () => {
  let adminToken, customerToken, testUserId;

  beforeAll(async () => {
    // Setup test users and tokens
    const admin = await User.create({
      name: "Admin User",
      email: "admin@test.com",
      password: "test1234",
      role: "admin",
      phoneNumber: "1234567890",
    });

    const customer = await User.create({
      name: "Test Customer",
      email: "customer@test.com",
      password: "test1234",
      role: "customer",
      phoneNumber: "0987654321",
    });

    adminToken = generateToken(admin._id);
    customerToken = generateToken(customer._id);
    testUserId = customer._id;
  });

  describe("GET /api/users", () => {
    it("should return 401 if no token provided", async () => {
      const res = await request(app).get("/api/users");
      expect(res.status).toBe(401);
    });

    it("should return 403 if non-admin user", async () => {
      const res = await request(app)
        .get("/api/users")
        .set("Authorization", `Bearer ${customerToken}`);
      expect(res.status).toBe(403);
    });

    it("should return users if admin", async () => {
      const res = await request(app)
        .get("/api/users")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBeTruthy();
    });

    it("should return 404 for non-existent user", async () => {
      const fakeId = "507f1f77bcf86cd799439011";
      const res = await request(app)
        .get(`/api/users/${fakeId}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(404);
    });

    it("should validate user data on creation", async () => {
      const invalidUser = {
        name: "Test",
        // Missing required email
        password: "test1234",
      };

      const res = await request(app)
        .post("/api/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(invalidUser);
      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/users/:id", () => {
    it("should return user if authorized", async () => {
      const res = await request(app)
        .get(`/api/users/${testUserId}`)
        .set("Authorization", `Bearer ${customerToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty("_id");
    });
  });

  describe("POST /api/users", () => {
    it("should create user if admin", async () => {
      const userData = {
        name: "New User",
        email: "newuser@test.com",
        password: "test1234",
        role: "customer",
      };

      const res = await request(app)
        .post("/api/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(userData);
      expect(res.status).toBe(201);
      expect(res.body.data).toHaveProperty("email", userData.email);
    });
  });

  describe("PUT /api/users/:id", () => {
    it("should update user if authorized", async () => {
      const updateData = {
        name: "Updated Name",
      };

      const res = await request(app)
        .put(`/api/users/${testUserId}`)
        .set("Authorization", `Bearer ${customerToken}`)
        .send(updateData);
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty("name", updateData.name);
    });
  });

  describe("DELETE /api/users/:id", () => {
    it("should delete user if admin", async () => {
      const res = await request(app)
        .delete(`/api/users/${testUserId}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
    });
  });

  describe("Error Handling", () => {
    it("should handle invalid token format", async () => {
      const res = await request(app)
        .get("/api/users")
        .set("Authorization", "Invalid-Token-Format");
      expect(res.status).toBe(401);
    });

    it("should handle expired tokens", async () => {
      const expiredToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
      const res = await request(app)
        .get("/api/users")
        .set("Authorization", `Bearer ${expiredToken}`);
      expect(res.status).toBe(401);
    });
  });

  afterAll(async () => {
    await User.deleteMany({}); // Clean up test database
  });
});
