const router = require("express").Router();
const {
  sendMessage,
  getMessage,
  getLatestMessage,
  readLatestMessage,
} = require("../controllers/messageController");
const protect = require("../middleware/auth");

router.route("/:id").post(protect, sendMessage).get(protect, getMessage);
router.get("/getLatestMessage/:id", protect, getLatestMessage);
router.patch("/readLatest/:id", protect, readLatestMessage);

module.exports = router;
