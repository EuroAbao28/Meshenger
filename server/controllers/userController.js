const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

const signUp = async (req, res) => {
  try {
    const { username, firstname, lastname, password, confirmPassword } =
      req.body;

    // check if all all fields is not empty
    if (!username || !firstname || !lastname || !password || !confirmPassword)
      return res.status(400).json({ message: "All fields are required" });

    // check if the passwords are matched
    if (password !== confirmPassword)
      return res.status(400).json({
        message: "Passwords do not match",
      });

    // check if the username already exist
    const isUserExist = await userModel.find({ username });

    if (isUserExist && isUserExist.length > 0) {
      return res.status(400).json({
        message: "Username already exist",
      });
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create the user
    await userModel.create({
      username,
      firstname,
      lastname,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "New account already",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ message: "All fields are required" });

    const isUserExist = await userModel.findOne({ username });

    if (isUserExist && (await bcrypt.compare(password, isUserExist.password))) {
      return res.status(200).json({
        message: "Login successfully",
        token: generateToken(isUserExist),
      });
    } else {
      return res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getLoggedInUser = async (req, res) => {
  try {
    return res.status(200).json({ message: "Valid user", user: req.user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const searchUser = async (req, res) => {
  try {
    const { searchInput } = req.query;

    const response = await userModel.find({
      $or: [
        { username: { $regex: searchInput, $options: "i" } },
        { firstname: { $regex: searchInput, $options: "i" } },
        { lastname: { $regex: searchInput, $options: "i" } },
      ],
    });

    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { signUp, login, getLoggedInUser, searchUser };
