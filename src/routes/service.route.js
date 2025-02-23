const express = require("express");
const router = express.Router();
const {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
  searchServices,
} = require("../controllers/service.controller");
const { restrictTo } = require("../middleware/auth.middleware");

router.get("/search", searchServices);
router.get("/all", getAllServices);
router.post("/create", restrictTo("provider", "admin"), createService);
router.get("/single/:id", getServiceById);
router.patch("/update/:id", restrictTo("provider", "admin"), updateService);
router.delete("/delete/:id", restrictTo("admin"), deleteService);

module.exports = router;
