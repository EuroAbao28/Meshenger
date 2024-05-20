const express = require("express");
const cors = require("cors");
const connectDB = require("./db/mongoDB");

require("dotenv").config();
require("colors");

const port = process.env.PORT || 5000;

// connect to database
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(port, () =>
  console.log(`Server running on port: ${port}`.yellow.underline)
);
