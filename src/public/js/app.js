/* variables & initialization */
const socket = io(); // automatically connect to back-end socket.io
const welcome = document.getElementById("welcome"); // div of form
const form = welcome.querySelector("form"); // form for entering room
const room = document.getElementById("room"); // form for sending message

room.hidden = true;
let roomName = "";

/* functions */
// show messages from other sockets
function addMessage(message) {
  const ul = room.querySelector("ul"); // find message list
  const li = document.createElement("li"); // create new message element
  li.innerText = message; // add the message to the message element
  ul.appendChild(li); // add the message to the message list
}

// sending message
function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("input"); // find message box
  const value = input.value; // store value of input
  socket.emit("new_message", input.value, roomName, () => {
    // send message to a room
    addMessage(`You: ${value}`); // show sent message
  });
  input.value = ""; // reset input box
}

// change form setting and show room
function showRoom() {
  welcome.hidden = true; // hide room entering form
  room.hidden = false; // show message form
  const h3 = room.querySelector("h3"); // find room name element
  h3.innerText = `Room: ${roomName}`; // change room name
  const form = room.querySelector("form"); // find messaging form element
  form.addEventListener("submit", handleMessageSubmit);
}

// function for entering room
function handleRoomSubmit(event) {
  event.preventDefault(); // block default function
  const input = form.querySelector("input"); // find room name
  socket.emit("enter_room", input.value, showRoom); // send a message to back-end for entring room
  roomName = input.value; // change room name
  input.value = ""; // reset input box
}

/* event listeners */
// form for entring room event
form.addEventListener("submit", handleRoomSubmit);

// connecting room event
socket.on("welcome", () => {
  addMessage("someone joined.");
});

// disconneing room event
socket.on("bye", () => {
  addMessage("someone left.");
});

socket.on("new_message", addMessage);
