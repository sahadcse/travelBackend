const express = require("express");
const router = express.Router();
const {
  create,
  getMyBookings,
  getAll,
  cancelBooking,
  updateStatus,
  deleteBooking,
} = require("../controllers/booking.controller");
const { restrictTo } = require("../middleware/auth.middleware");

router.get("/my-bookings", getMyBookings);
router.post("/create", create);
router.patch("/cancel/:id", cancelBooking);
router.get("/all", restrictTo("admin"), getAll);
router.patch("/updateStatus/:id", restrictTo("admin"), updateStatus);
router.delete("/delete/:id", restrictTo("admin"), deleteBooking);

module.exports = router;
