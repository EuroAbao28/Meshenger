const {
  signUp,
  login,
  getLoggedInUser,
  searchUser,
  getUserToChat,
  addToContact,
} = require("../controllers/userController");
const protect = require("../middleware/auth");

const router = require("express").Router();

router.post("/signup", signUp);
router.post("/login", login);
router.route("/").get(protect, getLoggedInUser);
router.get("/search", protect, searchUser);
router.get("/getuserToChat/:id", protect, getUserToChat);
router.post("/addToContact/:id", protect, addToContact);

module.exports = router;
