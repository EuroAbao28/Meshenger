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
const upload = require("../middleware/multer");

const router = require("express").Router();

router.post("/signup", signUp);
router.post("/login", login);
router
  .route("/")
  .get(protect, getLoggedInUser)
  .patch(protect, upload.single("userImage"), updateUser);
router.get("/search", protect, searchUser);
router.get("/getuserToChat/:id", protect, getUserToChat);
router.post("/addToContact/:id", protect, addToContact);
router.delete("/removeFromContact/:id", protect, removeFromContact);
router.get("/getContacts", protect, getContacts);

module.exports = router;
