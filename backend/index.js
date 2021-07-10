const app = require("./app");
const config = require("./config/app");
const router = require("./router");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.options("*", cors());
app.use(router);

const port = process.env.APP_PORT || config.appPort;

const server = http.createServer(app);
const SocketServer = require("./socket");
SocketServer(server);

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
