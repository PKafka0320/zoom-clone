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
  const input = room.querySelector("#msg input"); // find message box
  const value = input.value; // store value of input
  socket.emit("new_message", input.value, roomName, () => {
    // send message to a room
    addMessage(`You: ${value}`); // show sent message
  });
  input.value = ""; // reset input box
}

/* // setting nickname
function handleNicknameSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#name input"); // find nickname box
  socket.emit("nickname", input.value);
} */

// change form setting and show room
function showRoom() {
  welcome.hidden = true; // hide room entering form
  room.hidden = false; // show message form
  const h3 = room.querySelector("h3"); // find room name element
  h3.innerText = `Room: ${roomName}`; // change room name
  const msgForm = room.querySelector("#msg"); // find messaging form element
  // const nameForm = room.querySelector("#name"); // find nickname form element
  msgForm.addEventListener("submit", handleMessageSubmit);
  // nameForm.addEventListener("submit", handleNicknameSubmit);
}

// function for entering room
function handleRoomSubmit(event) {
  event.preventDefault(); // block default function
  const roomname = form.querySelector("#roomname"); // find room name
  const nickname = form.querySelector("#nickname"); // find room name
  socket.emit("enter_room", roomname.value, nickname.value, showRoom); // send a message to back-end for entring room
  roomName = roomname.value; // change room name
  roomname.value = ""; // reset roomname input box
  nickname.value = ""; // reset nickname input box
}

/* event listeners */
// form for entring room event
form.addEventListener("submit", handleRoomSubmit);

// connecting room event
socket.on("welcome", (user, newCount) => {
  console.log(newCount);
  const h3 = room.querySelector("h3"); // find room name element
  h3.innerText = `Room: ${roomName} (${newCount})`; // change room name and amount of user
  addMessage(`${user} joined.`);
});

// disconneing room event
socket.on("bye", (left, newCount) => {
  const h3 = room.querySelector("h3"); // find room name element
  h3.innerText = `Room: ${roomName} (${newCount})`; // change room name and amount of user
  addMessage(`${left} left.`);
});

socket.on("new_message", addMessage);

// change room list
socket.on("room_change", (rooms) => {
  const roomList = welcome.querySelector("ul");
  // reset room list
  roomList.innerHTML = "";
  // revise public room list
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.append(li);
  });
});
