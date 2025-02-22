const Router = require("../router/router");
const AuthController = require("../controllers/auth.controller");
const { catchAsync } = require("../utils/catchAsync");

const router = new Router();
const ctrl = new AuthController();

router.post("/login", catchAsync(ctrl.login.bind(ctrl)));
router.post("/register", catchAsync(ctrl.register.bind(ctrl)));
router.post("/logout", catchAsync(ctrl.logout.bind(ctrl)));
router.post("/forgot-password", catchAsync(ctrl.forgotPassword.bind(ctrl)));
router.patch(
  "/reset-password/:token",
  catchAsync(ctrl.resetPassword.bind(ctrl))
);

console.log("Auth routes registered"); // Debugging log

module.exports = router;
