const express = require("express");
const router = express.Router();

const { validateBody, authenticate, upload } = require("../../middlewares");
const schemas = require("../../schemas/auth");

const AuthController = require("../../controllers/auth");

router.post(
  "/register",
  validateBody(schemas.registerSchemas),
  AuthController.register
);

router.post("/login", validateBody(schemas.loginSchemas), AuthController.login);

router.get("/current", authenticate, AuthController.getCurrent);

router.post("/logout", authenticate, AuthController.logout);

router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  validateBody(schemas.updateAvatar),
  AuthController.updateAvatar
);

module.exports = router;
