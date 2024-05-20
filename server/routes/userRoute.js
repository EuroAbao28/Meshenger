const {
  signUp,
  login,
  getLoggedInUser,
} = require("../controllers/userController");
const protect = require("../middleware/auth");

const router = require("express").Router();

router.post("/signup", signUp);
router.post("/login", login);
router.route("/").get(protect, getLoggedInUser);

module.exports = router;
