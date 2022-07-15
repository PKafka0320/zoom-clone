/* variables & initialization */
const socket = io(); // automatically connect to back-end socket.io

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const cameraSelect = document.getElementById("cameras");

let myStream; // user stream
let muted = false;
let cameraOff = false;

// get user media device list
async function getCamers() {
  try {
    // get all media devices
    const devices = await navigator.mediaDevices.enumerateDevices();
    // get video devices from all devices
    const cameras = devices.filter((device) => device.kind === "videoinput");
    const currentCamera = myStream.getVideoTracks()[0];
    // add camera option to camera select option
    cameras.forEach((camera) => {
      const option = document.createElement("option");
      option.value = camera.deviceId;
      option.innerText = camera.label;
      // select changed camera
      if (currentCamera.label === camera.label) {
        option.selected = true;
      }
      cameraSelect.appendChild(option);
    });
  } catch (e) {
    console.log(e);
  }
}

// get stream from user
async function getMedia(deviceId) {
  // initialize constraintss
  const initialConstraints = {
    audio: true,
    video: { facingMode: "user" },
  };
  // changed camera constraints
  const cameraConstraints = {
    audio: true,
    vidoe: { deviceId: { exact: deviceId } },
  };
  // get user media with audio and video constraints depending on presence of deviceId
  try {
    myStream = await navigator.mediaDevices.getUserMedia(
      deviceId ? cameraConstraints : initialConstraints
    );
    myFace.srcObject = myStream;
    // get camera list for only first time
    if (!deviceId) {
      await getCamers();
    }
  } catch (e) {
    console.log(e);
  }
}

function handleMuteClick() {
  // change enable of audio track
  myStream
    .getAudioTracks()
    .forEach((track) => (track.enabled = !track.enabled));
  if (!muted) {
    muteBtn.innerText = "Unmute";
    muted = true;
  } else {
    muteBtn.innerText = "Mute";
    muted = false;
  }
}

function handleCameraClick() {
  // change enable of video track
  myStream
    .getVideoTracks()
    .forEach((track) => (track.enabled = !track.enabled));
  if (cameraOff) {
    cameraBtn.innerText = "Turn Camera Off";
    cameraOff = false;
  } else {
    cameraBtn.innerText = "Turn Camera On";
    cameraOff = true;
  }
}

// apply camera change
async function handleCameraChange() {
  await getMedia(cameraSelect.value);
}

getMedia();

muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);
cameraSelect.addEventListener("input", handleCameraChange);
