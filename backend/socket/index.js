const socketio = require("socket.io");

const SocketServer = (server) => {
  const io = socketio(server);

  io.on("connection", (socket) => {
    socket.on("join", async (user) => {
      console.log("New user joined", user.firstName);
    });
  });
};

module.exports = SocketServer;
