const express = require("express");
const config = require("./config/app");
const router = require("./router");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const http = require("http");
const path = require("path");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.options("*", cors());
app.use(router);

app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/uploads"));

if (process.env.NODE_ENV === "production") {
  console.log(123);
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
  });
}

const port = process.env.APP_PORT || config.appPort;

const server = http.createServer(app);
const SocketServer = require("./socket");
SocketServer(server);

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
