const app = require("./src/utils/app");
require("dotenv").config();
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");

const router = require("./src/routes/index");
const connectDB = require("./src/config/DB");
const { loggingMiddleware } = require("./src/middleware/index");

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(loggingMiddleware);

app.route(router);

const port = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  });
