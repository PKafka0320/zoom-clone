// connect socket
const socket = new WebSocket(`ws://${window.location.host}`);

// socket connection event
socket.addEventListener("open", () => {
  console.log("Connected to Server.");
});

// socket message recieve event
socket.addEventListener("message", (message) => {
  console.log("New message: ", message.data);
});

// socket close event
socket.addEventListener("close", () => {
  console.log("Disconnected from Server.");
});

// sending message
setTimeout(() => {
  socket.send("hello from the browser");
}, 10000);
