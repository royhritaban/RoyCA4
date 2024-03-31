// Establish WebSocket connection and select DOM elements
const socket = io("ws://localhost:3500");
const msgInput = document.querySelector("#message");
const nameInput = document.querySelector("#name");
const chatRoom = document.querySelector("#room");
const activity = document.querySelector(".activity");
const usersList = document.querySelector(".user-list");
const roomList = document.querySelector(".room-list");
const chatDisplay = document.querySelector(".chat-display");

// Function to send message
function sendMessage(e) {
    e.preventDefault();
    if (nameInput.value && msgInput.value && chatRoom.value) {
        socket.emit("message", { name: nameInput.value, text: msgInput.value });
        msgInput.value = "";
    }
    msgInput.focus();
}

// Function to enter room
function enterRoom(e) {
    e.preventDefault();
    if (nameInput.value && chatRoom.value) {
        socket.emit("enterRoom", { name: nameInput.value, room: chatRoom.value });
    }
}

// Event listeners for sending message and entering room
document.querySelector(".form-msg").addEventListener("submit", sendMessage);
document.querySelector(".form-join").addEventListener("submit", enterRoom);

// Event listener for detecting typing activity
msgInput.addEventListener("keypress", () => {
    socket.emit("activity", nameInput.value);
});

// Event listener for receiving messages
socket.on("message", (e) => {
    activity.textContent = "";
    let { name: t, text: s, time: o } = e;
    let n = document.createElement("li");
    n.className = "post";
    if (t === nameInput.value) {
        n.className = "post post--right";
    } else if (t !== nameInput.value && t !== "Admin") {
        n.className = "post post--left";
    }
    if (t !== "Admin") {
        n.innerHTML = `<div class="post__header ${t === nameInput.value ? "post__header--user" : "post__header--reply"}">
        <span class="post__header--name">${t}</span> 
        <span class="post__header--time">${o}</span> 
        </div>
        <div class="post__text">${s}</div>`;
    } else {
        n.innerHTML = `<div class="post__text">${s}</div>`;
    }
    document.querySelector(".chat-display").appendChild(n);
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
});

// Timer for showing typing activity
let activityTimer;
socket.on("activity", (e) => {
    activity.textContent = `${e} is typing...`;
    clearTimeout(activityTimer);
    activityTimer = setTimeout(() => {
        activity.textContent = "";
    }, 1000);
});

// Function to display list of users
function showUsers(e) {
    usersList.textContent = "";
    if (e) {
        usersList.innerHTML = `<em>Users in ${chatRoom.value}:</em>`;
        e.forEach((t, s) => {
            usersList.textContent += ` ${t.name}`;
            if (e.length > 1 && s !== e.length - 1) {
                usersList.textContent += ",";
            }
        });
    }
}

// Function to display list of rooms
function showRooms(e) {
    roomList.textContent = "";
    if (e) {
        roomList.innerHTML = "<em>Active Rooms:</em>";
        e.forEach((t, s) => {
            roomList.textContent += ` ${t}`;
            if (e.length > 1 && s !== e.length - 1) {
                roomList.textContent += ",";
            }
        });
    }
}

// Event listeners for updating user and room lists
socket.on("userList", ({ users: e }) => {
    showUsers(e);
});
socket.on("roomList", ({ rooms: e }) => {
    showRooms(e);
});
