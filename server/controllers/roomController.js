const roomModel = require("../models/roomModel");

const getRoom = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id } = req.params;

    // check if the room already existed
    const checkRoom = await roomModel.findOne({
      members: { $all: [myId, id] },
    });

    if (checkRoom) {
      return res
        .status(200)
        .json({
          message: "Old",
          roomId: checkRoom._id,
          members: checkRoom.members,
        });
    }

    // if no room, create one
    const createRoom = await roomModel.create({ members: [myId, id] });
    return res
      .status(201)
      .json({
        status: "Created",
        roomId: createRoom._id,
        members: createRoom.members,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { getRoom };
