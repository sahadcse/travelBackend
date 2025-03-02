const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const os = require("os");

const router = require("./src/routes");
const connectDB = require("./src/config/DB");

dotenv.config();
const app = express();

// Welcome route
app.get("/api/v1", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Hotel Booking API",
  });
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(compression());

// Routes
app.use(router);

const port = process.env.PORT || 3000;

const getLocalIP = () => {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return "127.0.0.1";
};

let server; // Declare server variable

if (process.env.NODE_ENV !== "test") {
  connectDB()
    .then(() => {
      server = app.listen(port, () => {
        const localIP = getLocalIP();
        console.clear();
        console.log(`Server running on http://${localIP}:${port}`);
      });
    })
    .catch((error) => {
      console.error("Failed to connect to MongoDB:", error);
      process.exit(1);
    });
}

module.exports = { app }; // Only export app, let test helper manage server
