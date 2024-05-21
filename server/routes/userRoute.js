const {
  signUp,
  login,
  getLoggedInUser,
  searchUser,
} = require("../controllers/userController");
const protect = require("../middleware/auth");

const router = require("express").Router();

router.post("/signup", signUp);
router.post("/login", login);
router.route("/").get(protect, getLoggedInUser);
router.get("/search", searchUser);

module.exports = router;
