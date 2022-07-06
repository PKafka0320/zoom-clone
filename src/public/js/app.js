const messageList = document.querySelector("ul");
const messageForm = document.querySelector("#message");
const nickForm = document.querySelector("#nick");
// connect socket
const socket = new WebSocket(`ws://${window.location.host}`);

// message to JSON function
function makeMessage(type, payload) {
  const msg = { type, payload };
  return JSON.stringify(msg);
}

// socket connection event
socket.addEventListener("open", () => {
  console.log("Connected to Server.");
});

// socket message recieve event
socket.addEventListener("message", (message) => {
  const li = document.createElement("li");
  li.innerText = message.data;
  messageList.append(li);
});

// socket close event
socket.addEventListener("close", () => {
  console.log("Disconnected from Server.");
});

// message function
function handleSubmit(event) {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  socket.send(makeMessage("new_message", input.value));
  const li = document.createElement("li");
  li.innerText = `You: ${input.value}`;
  messageList.append(li);
  input.value = "";
}

function handleNickSubmit(event) {
  event.preventDefault();
  const input = nickForm.querySelector("input");
  socket.send(makeMessage("nickname", input.value));
}

// messageForm event
messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);
