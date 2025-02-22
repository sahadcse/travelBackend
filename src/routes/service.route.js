const Router = require("../router/router");
const ServiceController = require("../controllers/service.controller");
const { restrictTo, protect } = require("../middleware/auth.middleware");
const { catchAsync } = require("../utils/catchAsync");

const router = new Router();
const ctrl = new ServiceController();

router.get("/search", protect, catchAsync(ctrl.searchServices));
router.get("/", protect, catchAsync(ctrl.getAllServices));
router.post(
  "/everythinggreen",
  protect,
  restrictTo("provider", "admin"),
  catchAsync(ctrl.createService)
);
router.get("/:id", protect, catchAsync(ctrl.getServiceById));
router.patch(
  "/:id",
  protect,
  restrictTo("provider", "admin"),
  catchAsync(ctrl.updateService)
);
router.delete("/:id", restrictTo("admin"), catchAsync(ctrl.deleteService));

module.exports = router;
