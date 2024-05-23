const {
  signUp,
  login,
  getLoggedInUser,
  searchUser,
  getUserToChat,
  addToContact,
  removeFromContact,
} = require("../controllers/userController");
const protect = require("../middleware/auth");

const router = require("express").Router();

router.post("/signup", signUp);
router.post("/login", login);
router.route("/").get(protect, getLoggedInUser);
router.get("/search", protect, searchUser);
router.get("/getuserToChat/:id", protect, getUserToChat);
router.post("/addToContact/:id", protect, addToContact);
router.delete("/removeFromContact/:id", protect, removeFromContact);

module.exports = router;
