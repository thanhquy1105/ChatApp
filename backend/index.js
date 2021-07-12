const app = require("./app");
const config = require("./config/app");

const http = require("http");

const port = process.env.PORT || config.appPort;

const server = http.createServer(app);
const SocketServer = require("./socket");
SocketServer(server);

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
