const socketIo = require("socket.io");
const SocketServer = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:3001",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("join", async (user) => {
      console.log("New user joined", user.firstName);

      io.to(socket.id).emit("typing", "User typing...");
    });
  });
};

module.exports = SocketServer;
