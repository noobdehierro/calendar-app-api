const { Router } = require("express");
const { check } = require("express-validator");
const {
  createUser,
  loginUser,
  revalidateToken,
} = require("../controller/auth");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

router.post(
  "/new",
  [
    check("name", "Name is required").notEmpty(),
    check("email", "email is required or is invalid").notEmpty().isEmail(),
    check("password", "Password must be 6 characters").isLength({
      min: 6,
    }),
    validarCampos,
  ],
  createUser
);

router.post(
  "/",
  [
    check("email", "email is required").notEmpty().isEmail(),
    check("password", "password is required").notEmpty(),
    validarCampos,
  ],
  loginUser
);

router.get("/renew", validarJWT, revalidateToken);

module.exports = router;
