const messageModel = require("../models/messageModel");

const sendMessage = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id } = req.params;
    const { content } = req.body;

    if (!id)
      return res.status(400).json({ message: "No friend's id provided" });

    if (!content)
      return res.status(400).json({ message: "Content is required" });

    const response = await messageModel.create({
      content,
      sender: myId,
      receiver: id,
    });

    return res.status(201).json({ response });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getMessage = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id } = req.params;

    const response = await messageModel
      .find({
        $or: [
          {
            sender: myId,
            receiver: id,
          },
          {
            sender: id,
            receiver: myId,
          },
        ],
      })
      .sort({ createdAt: 1 });

    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getLatestMessage = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id } = req.params;

    const response = await messageModel
      .findOne({
        $or: [
          {
            sender: myId,
            receiver: id,
          },
          {
            sender: id,
            receiver: myId,
          },
        ],
      })
      .sort({ createdAt: -1 });

    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const readLatestMessage = async (req, res) => {
  try {
    const id = req.params.id;

    await messageModel.findByIdAndUpdate(id, { isRead: true });

    return res.status(200).json({ message: "message isRead changed to TRUE" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  sendMessage,
  getMessage,
  getLatestMessage,
  readLatestMessage,
};
