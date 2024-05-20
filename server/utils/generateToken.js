const jwt = require("jsonwebtoken");

const generateToken = (userDataPayload) => {
  const { _id, username } = userDataPayload;
  return jwt.sign({ _id, username }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

module.exports = generateToken;
