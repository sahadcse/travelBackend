const { startServer, stopServer } = require("./testServer");
const request = require("supertest");
const { app } = require("../../server");

describe("Test Server", () => {
  let server;

  beforeAll(async () => {
    server = await startServer();
  });

  afterAll(async () => {
    await stopServer();
  });

  test("Server should start", () => {
    expect(server).toBeDefined();
    expect(server.listening).toBe(true);
  });

  test("Server should stop", async () => {
    await stopServer();
    expect(server.listening).toBe(false);
  });

  test("GET / should return 200", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
  });

  test("GET /nonexistent should return 404", async () => {
    const response = await request(app).get("/nonexistent");
    expect(response.status).toBe(404);
  });

  test("POST /api/v1/users should return 401 if no token provided", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });
    expect(response.status).toBe(401);
  });
});
