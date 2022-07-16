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
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

/* create http server
 * - for views, static files, home, redirection
 */
const httpServer = http.createServer(app);

/* create io server
 * - need to give host "/socket.io/socket.io.js"(script) so that the host can use websocket
 * - SocketIO is not implementation of websocket
 */
const wsServer = SocketIO(httpServer);

// openieng server
const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);

// Socket event
wsServer.on("connection", (socket) => {
  // connecting to someone
  socket.on("join_room", (roomName) => {
    socket.join(roomName);
    socket.to(roomName).emit("welcome");
  });

  // sending offer
  socket.on("offer", (offer, roomName) => {
    socket.to(roomName).emit("offer", offer);
  });

  // sending answer
  socket.on("answer", (answer, roomName) => {
    socket.to(roomName).emit("answer", answer);
  });

  // sending candidate
  socket.on("ice", (ice, roomName) => {
    socket.to(roomName).emit("ice", ice);
  });
});
