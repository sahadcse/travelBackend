const request = require("supertest");
const { app, startServer, stopServer } = require("../helpers/testServer");

describe("Basic API Testing Example", () => {
  beforeAll(async () => {
    await startServer();
  });

  afterAll(async () => {
    await stopServer();
  });

  // Test GET endpoint
  it("should return welcome message", async () => {
    const response = await request(app).get("/api/v1").expect(200);

    expect(response.body.message).toBe("Welcome to Hotel Booking API");
  });

  // Test POST endpoint with data
  it("should validate required fields", async () => {
    const response = await request(app)
      .post("/api/v1/auth/register")
      .send({}) // Empty data to test validation
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toBeDefined();
  });

  // Test with authentication
  it("should require authentication", async () => {
    const response = await request(app)
      .get("/api/v1/users/profile")
      .expect(401);

    expect(response.body.success).toBe(false);
  });
});
