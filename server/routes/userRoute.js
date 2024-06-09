const {
  signUp,
  login,
  getLoggedInUser,
  searchUser,
  getUserToChat,
  addToContact,
  removeFromContact,
  updateUser,
  getContacts,
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
router.patch("/:id", protect, updateUser);
router.get("/getContacts", protect, getContacts);

module.exports = router;
