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
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
app.use("/api/user", require("./routes/userRoute"));
app.use("/api/message", require("./routes/messageRoute"));
app.use("/api/room", require("./routes/roomRoute"));

// create a server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

let onlineUsers = [];

// socket io events
io.on("connection", (socket) => {
  console.log("A user connected");

  // handle login event
  socket.on("login", (username) => {
    console.log(`${username} logged in`);
    onlineUsers.push(username);
    io.emit("updatedStatus", onlineUsers);
  });

  // when someone join a room
  socket.on("joinRoom", (data) => {
    socket.join(data);
    console.log("Someone joined room:", data);
  });

  // when someone leave a room
  socket.on("leaveRoom", (data) => {
    socket.leave(data);
    console.log("Someone leave room:", data);
  });

  // when someone send
  socket.on("sendMessage", (data) => {
    // console.log(data);
    socket.to(data.roomId).emit("receiveMessage", data);
  });

  // handle disconnect
  socket.on("disconnect", () => {
    console.log("User disconnect");
  });
});

// start server
server.listen(port, () =>
  console.log(`Server running on port: ${port}`.yellow.underline)
);
