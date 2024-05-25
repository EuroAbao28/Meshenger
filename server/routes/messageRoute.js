const router = require("express").Router();
const { sendMessage, getMessage } = require("../controllers/messageController");
const protect = require("../middleware/auth");

router.route("/:id").post(protect, sendMessage).get(protect, getMessage);

module.exports = router;
