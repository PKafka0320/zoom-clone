import express from "express";
import http from "http";
import SocketIO from "socket.io";

const app = express(); // create express application

app.set("view engine", "pug"); // setting view engine
app.set("views", __dirname + "/views"); // setting directory of views

/* setting directory of files
 * public files will be executed in frontend
 */
app.use("/public", express.static(__dirname + "/public"));

// rendering for each address
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

/* create http server
 * - for views, static files, home, redirection
 */
const httpServer = http.createServer(app);

/* create io server
 * - need to give host "/socket.io/socket.io.js"(script) so that the host can use websocket
 * - SocketIO is not implementation of websocket
 */
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
  // socket["nickname"] = "Anon"; // initialize nickname
  socket.onAny((event) => { // show event
    console.log(`Socket Event: ${event}`);
  });
  socket.on("enter_room", (roomName, nickname, done) => {
    socket["nickname"] = nickname;
    socket.join(roomName);
    /* run a function in front-end for the purpose of security */
    done(); // send a message that sequence is done
    socket.to(roomName).emit("welcome", socket.nickname);
  });
  socket.on("disconnecting", () => { // send event to rooms that the socket connected
    socket.rooms.forEach((room) =>
      socket.to(room).emit("bye", socket.nickname)
    );
  });
  socket.on("new_message", (msg, room, done) => { // send event to a room that the socket wants to send message
    socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
    done();
  });
  // socket.on("nickname", (nickname) => (socket["nickname"] = nickname)); // set nickname
});

// openieng server
const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);
