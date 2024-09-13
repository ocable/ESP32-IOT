const express = require("express");
const app = express();

const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    // origin: "http://localhost:5173",
    // methods: ["GET", "POST"],
  },
  transports: ["polling", "websocket"],
});

app.get("/", function (req, res) {
  res.send("<h1>This is a socketIO server</h1>");
});

// On Connection:
io.on("connection", (socket) => {
  const hostIP = socket.handshake.headers.host;
  console.log(`User Connected: ${socket.id} at IP ${hostIP}`);

  socket.on("send_message", (data) => {
    // socket.broadcast.emit("receive_message", data);
    console.log(`Message: ${data.message}`);
  });

  socket.on("turnOnBuiltInLED", (data) => {
    console.log(`${data.type} ${data.body.type} `);
    socket.broadcast.emit("sIOtype_EVENT", data);
  });


  socket.on("sIOtype_ERROR", (data) => {
    console.log(`Error: ${data}`);
  });
  
  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${socket.id}`);
  });
});








server.listen(3001, () => {
  console.log("Server running");
});
