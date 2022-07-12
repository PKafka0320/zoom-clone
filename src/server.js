import express from "express";
import http from "http";
import SocketIO from "socket.io";

const app = express();

// setting view engine
app.set("view engine", "pug");
// setting directory of views
app.set("views", __dirname + "/views");

/* setting directory of files
 * public files will be executed in frontend
 */
app.use("/public", express.static(__dirname + "/public"));

// rendering for each address
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

/* create http server
 *for views, static files, home, redirection
 */
const httpServer = http.createServer(app);

/* create io server
 * need to give host "/socket.io/socket.io.js"(script) so that the host can use websocket
 * SocketIO is not implementation of websocket
 */
const wsServer = SocketIO(httpServer);
/* // create web socket server
const wss = new WebSocket.Server({ server }); */

wsServer.on("connection", (socket) => {
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });
  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    /* run a function in front-end for the purpose of security */
    done(); // send a message that sequence is done
    socket.to(roomName).emit("welcome");
  });
});

/* // connected socket list
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

// socket fucntion
function onSocketClose() {
  console.log("Disconnected from the Browser.");
}

function onSocketMessage(message) {
  console.log(message.toString());
} */

// openieng server
const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);
