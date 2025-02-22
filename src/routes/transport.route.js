const Router = require("../router/router");
const TransportController = require("../controllers/transport.controller");
const { restrictTo, protect } = require("../middleware/auth.middleware");
const { catchAsync } = require("../utils/catchAsync");

const router = new Router();
const ctrl = new TransportController();

router.get("/search", protect, catchAsync(ctrl.searchTransports));
router.get("", protect, catchAsync(ctrl.getAllTransports));
router.post(
  "",
  protect,
  restrictTo(["provider", "admin"]),
  catchAsync(ctrl.createTransport)
);
router.get("/:id", protect, catchAsync(ctrl.getTransportById));
router.patch(
  "/:id",
  protect,
  restrictTo(["provider", "admin"]),
  catchAsync(ctrl.updateTransport)
);
router.delete("/:id", restrictTo("admin"), catchAsync(ctrl.deleteTransport));

module.exports = router;
