const Router = require("../router/router");
const BookingController = require("../controllers/booking.controller");
const { restrictTo, protect } = require("../middleware/auth.middleware");
const { catchAsync } = require("../utils/catchAsync");

const router = new Router();
const ctrl = new BookingController();

router.get("/my-bookings", protect, catchAsync(ctrl.getMyBookings));
router.post("", protect, catchAsync(ctrl.createBooking));
router.patch(":id/cancel", protect, catchAsync(ctrl.cancelBooking));
router.get("", restrictTo("admin"), catchAsync(ctrl.getAllBookings));
router.patch(
  ":id/status",
  restrictTo("admin"),
  catchAsync(ctrl.updateBookingStatus)
);
router.delete(":id", restrictTo("admin"), catchAsync(ctrl.deleteBooking));

module.exports = router;
