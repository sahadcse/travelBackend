const express = require("express");
const router = express.Router();
const {
  createTransport,
  getAllTransports,
  getTransportById,
  updateTransport,
  deleteTransport,
  searchTransports,
} = require("../controllers/transport.controller");
const { restrictTo } = require("../middleware/auth.middleware");

router.get("/search", searchTransports);
router.get("/all", getAllTransports);
router.post("/create", restrictTo("provider", "admin"), createTransport);
router.get("/single/:id", getTransportById);
router.patch("/update/:id", restrictTo("provider", "admin"), updateTransport);
router.delete("/delete/:id", restrictTo("admin"), deleteTransport);

module.exports = router;
