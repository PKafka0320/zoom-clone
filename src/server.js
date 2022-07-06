import express from "express";
import http from "http";
import WebSocket from "ws";

const app = express();

// setting view engine
app.set("view engine", "pug");
// setting directory of views
app.set("views", __dirname + "/views");

// setting directory of files
app.use("/public", express.static(__dirname + "/public"));
// public files will be executed in frontend

// rendering for each address
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

// create http server
// for views, static files, home, redirection
const server = http.createServer(app);
// create web socket server
const wss = new WebSocket.Server({ server });

// socket fucntion
function onSocketClose() {
  console.log("Disconnected from the Browser.");
}

function onSocketMessage(message) {
  console.log(message.toString());
}

// connected socket list
const sockets = [];

// web socket event
wss.on("connection", (socket) => {
  sockets.push(socket);
  socket["nickname"] = "Anon";
  console.log("Connected to Browser.");
  // close event
  socket.on("close", onSocketClose);
  // message receive event
  socket.on("message", (msg) => {
    const message = JSON.parse(msg);
    switch (message.type) {
      case "new_message":
        sockets.forEach((aSocket) =>
          aSocket.send(`${socket.nickname}: ${message.payload.toString()}`)
        );
      case "nickname":
        socket["nickname"] = message.payload;
    }
  });
});

// openieng server
const handleListen = () => console.log(`Listening on http://localhost:3000`);
server.listen(3000, handleListen);
