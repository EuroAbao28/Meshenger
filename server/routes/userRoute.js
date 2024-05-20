const { signUp, login } = require("../controllers/userController");

const router = require("express").Router();

router.post("/signup", signUp);
router.post("/login", login);

module.exports = router;
