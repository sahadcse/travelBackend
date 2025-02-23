const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: ".env.test" });

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(process.env.MONGODB_TEST_URI, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
      });
    } catch (error) {
      console.error("Error connecting to the test database:", error);
      process.exit(1);
    }
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    try {
      await mongoose.connection.close();
    } catch (error) {
      console.error("Error closing database connection:", error);
    }
  }
});

beforeEach(async () => {
  // Clean collections before each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    try {
      await collections[key].deleteMany({});
    } catch (error) {
      console.error(`Error cleaning collection ${key}:`, error);
    }
  }
});
