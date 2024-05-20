const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");
require("dotenv").config();
require("colors");

const port = process.env.PORT || 5000;

// connect to database
const connectDB = require("./db/mongoDB");
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
app.use("/api/user", require("./routes/userRoute"));

// start server
server.listen(port, () =>
  console.log(`Server running on port: ${port}`.yellow.underline)
);
