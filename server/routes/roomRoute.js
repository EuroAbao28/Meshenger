const router = require("express").Router();
const { getRoom } = require("../controllers/roomController");
const protect = require("../middleware/auth");

router.route("/:id").post(protect, getRoom);

module.exports = router;
